"use client";

import React, { use, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Gamepad2,
  BookOpen,
  ArrowLeft,
  Play,
  Lock,
  Sparkles,
  RotateCw,
  PlusCircle,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Search,
} from "lucide-react";
import { collection, getDocs, query, where, getDoc, doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useToast } from "@/components/Toast";

interface GameLobbyProps {
  params: Promise<{
    game_id: string;
  }>;
}

export interface LobbyCourseItem {
  id: string;
  title: string;
  description: string;
  learningPathId?: string;
  learningPathTitle?: string;
  enrollmentStatus: "active" | "paused" | "not_enrolled";
  pairsCount: number;
  authorName: string;
}

const GAME_CATALOG: Record<
  string,
  {
    title: string;
    subtitle: string;
    category: string;
    description: string;
    author: string;
  }
> = {
  game_card_match_vr: {
    title: "Ghép Cặp Thẻ Bài Thuật Toán (Memory Match)",
    subtitle: "Luyện Trí Nhớ & Khắc Sâu Định Nghĩa",
    category: "Memory Card Matrix",
    description: "Trò chơi lật thẻ bài: Tìm và ghép đôi thẻ chứa Khái niệm với thẻ chứa Định nghĩa tương ứng của bài học.",
    author: "TS. Lê Thị Mai",
  },
  boss_battle_quiz: {
    title: "Boss Slayer Marathon Quiz",
    subtitle: "Đấu trùm trắc nghiệm phản xạ kiến thức",
    category: "Boss Battle Quiz",
    description: "Mỗi câu trả lời đúng sẽ giáng một đòn chí mạng vào Boss quái vật. Hỗ trợ mọi khóa học!",
    author: "E-V-E Dev Team",
  },
};

export default function GameLobbyPage({ params }: GameLobbyProps) {
  const router = useRouter();
  const toast = useToast();
  const resolvedParams = use(params);
  const { game_id: gameId } = resolvedParams;

  const [coursesList, setCoursesList] = useState<LobbyCourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const gameInfo = GAME_CATALOG[gameId] || {
    title: gameId.replace(/_/g, " ").toUpperCase(),
    subtitle: "Minigame Tương Tác Học Tập",
    category: "Interactive Minigame",
    description: "Minigame giáo dục trực quan, tương tác học liệu và củng cố kiến thức theo từng bài học.",
    author: "Giảng Viên E-V-E",
  };

  useEffect(() => {
    async function loadCoursesData() {
      try {
        setLoading(true);
        const user = auth.currentUser;

        // Lấy danh sách khóa học và lọc khóa học đã được duyệt
        const coursesSnap = await getDocs(collection(db, "courses"));
        const acceptedCourseIds = new Set<string>();
        coursesSnap.docs.forEach((d) => {
          const cData = d.data();
          if (cData.isAccepted ?? cData.is_accepted) {
            acceptedCourseIds.add(d.id);
          }
        });

        // 1. Fetch Learning Paths for Course Mapping (CHỈ PATH ĐÃ DUYỆT VÀ 100% COURSES CON ĐÃ DUYỆT)
        const pathSnap = await getDocs(collection(db, "learning_path"));
        const courseToPathMap: Record<string, { pathId: string; pathTitle: string }> = {};
        pathSnap.docs.forEach((d) => {
          const pData = d.data();
          const isPathAccepted = Boolean(pData.isAccepted ?? pData.is_accepted);
          const pCourses: string[] = Array.isArray(pData.courses) ? pData.courses : [];
          const allCoursesApproved = pCourses.length > 0 && pCourses.every((cId) => acceptedCourseIds.has(cId));

          if (!isPathAccepted || !allCoursesApproved) return; // Ràng buộc một chiều

          pCourses.forEach((cId) => {
            courseToPathMap[cId] = {
              pathId: d.id,
              pathTitle: pData.title || "Lộ trình học tập E-V-E",
            };
          });
        });

        // 2. Fetch student enrollments & check teacher role
        const userPathStatusMap = new Map<string, "active" | "paused">();
        let isTeacherOrAdmin = false;
        if (user) {
          try {
            const uDoc = await getDoc(doc(db, "users", user.uid));
            const r = uDoc.exists() ? uDoc.data()?.role : "";
            if (r === "teacher" || r === "instructor" || r === "admin") {
              isTeacherOrAdmin = true;
            }

            const enSnap = await getDocs(
              query(collection(db, "student_learning_path"), where("student_id", "==", user.uid))
            );
            for (const d of enSnap.docs) {
              const data = d.data();
              if (data.learning_path_id) {
                userPathStatusMap.set(data.learning_path_id, data.status === "paused" ? "paused" : "active");
              }
            }
          } catch (enErr) {
            console.warn("Could not check student enrollments in lobby:", enErr);
          }
        }

        // 3. Fetch courses (CHỈ LẤY KHÓA HỌC ĐÃ ĐƯỢC ADMIN DUYỆT)
        const list: LobbyCourseItem[] = [];
        coursesSnap.docs.forEach((d) => {
          const data = d.data();
          const isCourseAccepted = Boolean(data.isAccepted ?? data.is_accepted ?? false);
          if (!isCourseAccepted) return; // Bỏ qua khóa học chưa duyệt

          const pInfo = courseToPathMap[d.id];
          const enrollmentStatus: "active" | "paused" | "not_enrolled" = isTeacherOrAdmin
            ? "active"
            : pInfo
            ? userPathStatusMap.get(pInfo.pathId) || "not_enrolled"
            : "not_enrolled";

          list.push({
            id: d.id,
            title: data.title || d.id,
            description: data.description || "Nội dung bài học và học liệu tương tác.",
            learningPathId: pInfo?.pathId,
            learningPathTitle: pInfo?.pathTitle,
            enrollmentStatus,
            pairsCount: Array.isArray(data.pairs) ? data.pairs.length : 10,
            authorName: data.authorName || "Giảng viên",
          });
        });

        setCoursesList(list);
      } catch (err) {
        console.error("Lỗi khi tải danh sách khóa học cho lobby:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCoursesData();
  }, [gameId]);

  const handleResumeOrEnroll = async (course: LobbyCourseItem, action: "resume" | "enroll") => {
    const user = auth.currentUser;
    if (!user) {
      router.push("/login");
      return;
    }
    const pathId = course.learningPathId || "lp_fullstack_gamification_2026";
    setActionLoadingId(course.id);

    try {
      const docKey = `${user.uid}_${pathId}`;
      await setDoc(
        doc(db, "student_learning_path", docKey),
        {
          student_id: user.uid,
          student_name: user.displayName || "Học Viên E-V-E",
          learning_path_id: pathId,
          status: "active",
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      toast.success(
        action === "resume"
          ? `Đã kích hoạt lại lộ trình "${course.learningPathTitle || "Lớp học"}"! Đang vào trò chơi...`
          : `Đăng ký thành công lộ trình "${course.learningPathTitle || "Lớp học"}"! Đang vào trò chơi...`,
        "Thành công"
      );

      setCoursesList((prev) =>
        prev.map((c) =>
          c.learningPathId === pathId ? { ...c, enrollmentStatus: "active" } : c
        )
      );

      setTimeout(() => {
        router.push(`/student/play/${gameId}/${course.id}`);
      }, 700);
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái lộ trình:", err);
      toast.error("Không thể cập nhật trạng thái lớp học. Vui lòng thử lại!", "Lỗi");
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredCourses = useMemo(() => {
    return coursesList
      .filter((c) => {
        if (!searchTerm) return true;
        const q = searchTerm.toLowerCase();
        return (
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          (c.learningPathTitle && c.learningPathTitle.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        const rank = { active: 0, paused: 1, not_enrolled: 2 };
        return rank[a.enrollmentStatus] - rank[b.enrollmentStatus];
      });
  }, [coursesList, searchTerm]);

  const activeCourses = useMemo(() => {
    return coursesList.filter((c) => c.enrollmentStatus === "active");
  }, [coursesList]);

  return (
    <div className="space-y-8 font-sans pb-12">
      {/* Header Bar */}
      <div className="flex items-center gap-3 pb-6 border-b-2 border-zinc-200">
        <Link
          href="/student/games"
          className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-900 transition-colors cursor-pointer border border-zinc-200"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="text-xs text-red-600 uppercase font-bold flex items-center gap-1.5">
            <Gamepad2 className="w-3.5 h-3.5" /> Thông Tin Trò Chơi
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight mt-1">
            {gameInfo.title}
          </h1>
        </div>
      </div>

      {/* Main Showcase Hero */}
      <div className="p-6 md:p-8 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-5">
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
              {gameInfo.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {activeCourses.length} Khóa Học Đang Hoạt Động
            </span>
            <span className="px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-bold">
              Tổng {coursesList.length} Khóa Học Hỗ Trợ
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-zinc-900">{gameInfo.subtitle}</h2>
          <p className="text-sm text-zinc-600 leading-relaxed">{gameInfo.description}</p>
          <div className="text-xs text-zinc-500">
            Tác giả: <strong className="text-zinc-900">{gameInfo.author}</strong>
          </div>
        </div>

        {activeCourses.length > 0 && (
          <div className="pt-2 flex items-center gap-4">
            <Link href={`/student/play/${gameId}/${activeCourses[0].id}`}>
              <button className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer flex items-center gap-2">
                <Play className="w-4 h-4" /> Vào Chơi Khóa Đầu Tiên →
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Compatible Courses Selection */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-red-600" /> Chọn Khóa Học Để Trải Nghiệm Cùng Trò Chơi
          </h3>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm khóa học..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-zinc-200 focus:border-red-600 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Thông báo gợi ý nếu chưa có khóa học đang học */}
        {activeCourses.length === 0 && !loading && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs space-y-1 shadow-xs">
            <div className="font-bold flex items-center gap-1.5 text-amber-800 text-sm">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Bạn chưa có khóa học nào đang hoạt động có chứa trò chơi này
            </div>
            <p className="text-xs text-amber-700 leading-relaxed">
              Dưới đây là các khóa học gợi ý mà trò chơi này hỗ trợ. Bạn có thể bấm <strong>"Đăng ký"</strong> hoặc <strong>"Học tiếp"</strong> (nếu đang bảo lưu) để kích hoạt và bắt đầu chơi ngay!
            </p>
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center text-xs text-zinc-400">Đang tải danh sách bài học khả dụng...</div>
        ) : filteredCourses.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white border border-zinc-200 space-y-3">
            <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center mx-auto">
              <Lock className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-zinc-700">Không tìm thấy khóa học nào phù hợp</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((crs) => {
              const isActive = crs.enrollmentStatus === "active";
              const isPaused = crs.enrollmentStatus === "paused";
              const isNotEnrolled = crs.enrollmentStatus === "not_enrolled";
              const isActionLoading = actionLoadingId === crs.id;

              return (
                <div
                  key={crs.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 shadow-sm ${
                    isActive
                      ? "bg-white border-zinc-200 hover:border-red-600"
                      : isPaused
                      ? "bg-amber-50/40 border-amber-200"
                      : "bg-zinc-50/70 border-zinc-200"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Đang Học
                        </span>
                      )}
                      {isPaused && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-[10px] font-bold text-amber-800 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Đang Bảo Lưu
                        </span>
                      )}
                      {isNotEnrolled && (
                        <span className="px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-600 text-[10px] font-bold">
                          Chưa Đăng Ký
                        </span>
                      )}
                      <span className="text-xs text-amber-600 font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> +100 Coins
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-zinc-900 line-clamp-1">{crs.title}</h4>
                    <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{crs.description}</p>
                    {crs.learningPathTitle && (
                      <div className="text-[10px] text-zinc-400 font-medium truncate">
                        Lộ trình: {crs.learningPathTitle}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 pt-2 border-t border-zinc-100">
                    <div className="flex items-center gap-2">
                      <Link href={`/student/courses/${crs.id}`} className="flex-1">
                        <button
                          type="button"
                          className="w-full py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold border border-zinc-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Chi Tiết</span>
                        </button>
                      </Link>

                      {isActive && (
                        <Link href={`/student/play/${gameId}/${crs.id}`} className="flex-1">
                          <button
                            type="button"
                            className="w-full py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                          >
                            <Play className="w-3 h-3 fill-white" />
                            <span>Vào Chơi</span>
                          </button>
                        </Link>
                      )}

                      {isPaused && (
                        <button
                          type="button"
                          disabled={isActionLoading}
                          onClick={() => handleResumeOrEnroll(crs, "resume")}
                          className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs disabled:opacity-50"
                        >
                          <RotateCw className={`w-3 h-3 ${isActionLoading ? "animate-spin" : ""}`} />
                          <span>{isActionLoading ? "..." : "Học Tiếp"}</span>
                        </button>
                      )}

                      {isNotEnrolled && (
                        <button
                          type="button"
                          disabled={isActionLoading}
                          onClick={() => handleResumeOrEnroll(crs, "enroll")}
                          className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs disabled:opacity-50"
                        >
                          <PlusCircle className={`w-3 h-3 ${isActionLoading ? "animate-spin" : ""}`} />
                          <span>{isActionLoading ? "..." : "Đăng Ký"}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
