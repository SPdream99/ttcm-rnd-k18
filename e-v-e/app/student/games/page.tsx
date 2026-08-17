"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Gamepad2,
  Play,
  Search,
  BookOpen,
  Zap,
  Layers,
  Swords,
  Cpu,
  ArrowRight,
  X,
  Shuffle,
  ShieldCheck,
  Star,
  Users,
  Coins,
  Lock,
  AlertCircle,
  RotateCw,
  PlusCircle,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { useToast } from "@/components/Toast";
import { collection, getDocs, query, where, getDoc, doc, setDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

interface ArcadeGameItem {
  id: string;
  title: string;
  subtitle: string;
  genre: string;
  category: "quiz" | "memory" | "simulation" | "boss" | "custom";
  description: string;
  author: string;
  difficulty: "Dễ" | "Trung Bình" | "Thử Thách" | "Cao Cấp";
  rewardCoins: number;
  needExtraData: boolean;
  coursesAllowed?: string[] | "all";
  thumbnailUrl: string;
  badge?: string;
  rating: number;
  playsCount: number;
  tags: string[];
}

export interface GameCourseItem {
  id: string;
  title: string;
  description: string;
  learningPathId?: string;
  learningPathTitle?: string;
  enrollmentStatus: "active" | "paused" | "not_enrolled";
  pairsCount: number;
  authorName: string;
  tags: string[];
}

export default function StudentGamesArcadePage() {
  const router = useRouter();
  const toast = useToast();
  const { currentUser, profile } = useAuthAdapter();
  const studentCoins = currentUser?.coins ?? profile?.coins ?? 250;

  const [games, setGames] = useState<ArcadeGameItem[]>([]);
  const [coursesList, setCoursesList] = useState<GameCourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [extraDataFilter, setExtraDataFilter] = useState<"all" | "dynamic" | "standalone">("all");

  const [selectedGameForPlay, setSelectedGameForPlay] = useState<ArcadeGameItem | null>(null);
  const [courseSearchTerm, setCourseSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadArcadeData() {
      try {
        setLoading(true);
        const studentUid = currentUser?.uid || auth.currentUser?.uid;

        // Tối ưu hóa: Chạy song song toàn bộ các truy vấn Firestore độc lập
        const [gamesSnap, pathSnap, enSnap, coursesSnap] = await Promise.all([
          getDocs(collection(db, "game_info")),
          getDocs(collection(db, "learning_path")),
          studentUid
            ? getDocs(query(collection(db, "student_learning_path"), where("student_id", "==", studentUid)))
            : Promise.resolve({ docs: [] } as any),
          getDocs(collection(db, "courses")),
        ]);

        // Standard built-in default games
        const gamesMap = new Map<string, ArcadeGameItem>([
          [
            "game_card_match_vr",
            {
              id: "game_card_match_vr",
              title: "Memory Matching Game (Lật Thẻ Trí Nhớ)",
              subtitle: "Rèn luyện trí nhớ và liên kết thuật ngữ 3D",
              genre: "Game Trí Nhớ 3D",
              category: "memory",
              description: "Lật và ghép đúng các cặp thuật ngữ lập trình và giải thích trước khi hết thời gian.",
              author: "E-V-E Studio",
              difficulty: "Trung Bình",
              rewardCoins: 50,
              needExtraData: true,
              coursesAllowed: "all",
              thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
              badge: "NỔI BẬT",
              rating: 4.9,
              playsCount: 1420,
              tags: ["Memory", "Flashcards", "Logic"],
            },
          ],
          [
            "boss_battle_quiz",
            {
              id: "boss_battle_quiz",
              title: "Boss Slayer Marathon Quiz",
              subtitle: "Đấu trùm trắc nghiệm phản xạ kiến thức",
              genre: "Trắc Nghiệm Phản Xạ",
              category: "boss",
              description: "Mỗi câu trả lời đúng sẽ giáng một đòn chí mạng vào Boss quái vật. Hỗ trợ mọi khóa học!",
              author: "E-V-E Dev Team",
              difficulty: "Thử Thách",
              rewardCoins: 60,
              needExtraData: true,
              coursesAllowed: "all",
              thumbnailUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80",
              badge: "HOT",
              rating: 4.8,
              playsCount: 2350,
              tags: ["Boss Battle", "Quiz", "Speed"],
            },
          ],
        ]);

        if (!gamesSnap.empty) {
          gamesSnap.docs.forEach((d: any) => {
            const data = d.data();
            const isGameAccepted = Boolean(
              data.isAccepted ?? data.is_accepted ?? (data.status === "approved" || data.status === "active")
            );
            if (isGameAccepted) {
              const existing = gamesMap.get(d.id);
              gamesMap.set(d.id, {
                id: d.id,
                title: data.name || data.title || existing?.title || "Minigame",
                subtitle: data.subtitle || existing?.subtitle || "Minigame Giáo Dục",
                genre: data.genre || existing?.genre || "HTML5 Game",
                category: data.category || existing?.category || "custom",
                description: data.description || existing?.description || "Trò chơi học tập tương tác.",
                author: data.authorName || existing?.author || "Giáo Viên E-V-E",
                difficulty: data.difficulty || existing?.difficulty || "Trung Bình",
                rewardCoins: Number(data.rewardCoins) || existing?.rewardCoins || 50,
                needExtraData: Boolean(data.need_extra_data ?? data.needExtraData ?? (existing ? existing.needExtraData : true)),
                coursesAllowed: data.courses_allowed || existing?.coursesAllowed || "all",
                thumbnailUrl: data.thumbnailUrl || existing?.thumbnailUrl || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80",
                badge: data.badge || existing?.badge,
                rating: Number(data.rating) || existing?.rating || 4.7,
                playsCount: Number(data.playsCount) || existing?.playsCount || 420,
                tags: Array.isArray(data.tags) ? data.tags : existing?.tags || ["Custom", "HTML5"],
              });
            }
          });
        }

        setGames(Array.from(gamesMap.values()));

        // Lấy tập ID khóa học đã duyệt
        const acceptedCourseIds = new Set<string>();
        coursesSnap.docs.forEach((d: any) => {
          const cd = d.data();
          if (cd.isAccepted ?? cd.is_accepted) {
            acceptedCourseIds.add(d.id);
          }
        });

        // Fetch Learning Paths map (CHỈ LẤY PATH ĐÃ DUYỆT VÀ 100% COURSES CON ĐÃ ĐƯỢC DUYỆT)
        const courseToPathMap: Record<string, { pathId: string; pathTitle: string }> = {};
        pathSnap.docs.forEach((d: any) => {
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

        // Map student enrollments
        const userPathStatusMap = new Map<string, "active" | "paused">();
        for (const d of enSnap.docs) {
          const data = d.data();
          if (data.learning_path_id) {
            userPathStatusMap.set(data.learning_path_id, data.status === "paused" ? "paused" : "active");
          }
        }

        const isTeacherOrAdmin = ["teacher", "instructor", "admin"].includes(currentUser?.role || profile?.role || "");

        // Map all courses and attach enrollment status (CHỈ LẤY KHÓA HỌC THUỘC LỘ TRÌNH ĐÃ DUYỆT 100%)
        const cl: GameCourseItem[] = [];
        coursesSnap.docs.forEach((d: any) => {
          const cd = d.data();
          const isCourseAccepted = Boolean(cd.isAccepted ?? cd.is_accepted ?? false);
          if (!isCourseAccepted) return; // Ẩn các khóa học chưa được duyệt

          const pInfo = courseToPathMap[d.id];
          // Bắt buộc: Khóa học PHẢI thuộc một Lộ Trình đã được duyệt 100%
          if (!pInfo) return;

          const enrollmentStatus: "active" | "paused" | "not_enrolled" = isTeacherOrAdmin
            ? "active"
            : userPathStatusMap.get(pInfo.pathId) || "not_enrolled";

          cl.push({
            id: d.id,
            title: cd.title || d.id,
            description: cd.description || "Nội dung bài học & học liệu tương tác.",
            learningPathId: pInfo.pathId,
            learningPathTitle: pInfo.pathTitle,
            enrollmentStatus,
            pairsCount: Array.isArray(cd.pairs) ? cd.pairs.length : 10,
            authorName: cd.authorName || "Giảng viên",
            tags: Array.isArray(cd.tags) ? cd.tags : ["Lập trình"],
          });
        });
        setCoursesList(cl);
      } catch (e) {
        console.error("Lỗi khi nạp danh sách Arcade:", e);
      } finally {
        setLoading(false);
      }
    }

    loadArcadeData();
  }, [currentUser]);

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchSearch =
        !searchTerm ||
        game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.genre.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory =
        selectedCategory === "all" ||
        game.category === selectedCategory;

      const matchExtraData =
        extraDataFilter === "all" ||
        (extraDataFilter === "dynamic" && game.needExtraData) ||
        (extraDataFilter === "standalone" && !game.needExtraData);

      return matchSearch && matchCategory && matchExtraData;
    });
  }, [games, searchTerm, selectedCategory, extraDataFilter]);

  const handleSelectGame = (game: ArcadeGameItem) => {
    if (game.needExtraData) {
      setSelectedGameForPlay(game);
      setCourseSearchTerm("");
      setIsModalOpen(true);
    } else {
      router.push(`/student/play/${game.id}/default`);
    }
  };

  const handleLaunchWithCourse = (courseId: string) => {
    if (!selectedGameForPlay) return;
    setIsModalOpen(false);
    router.push(`/student/play/${selectedGameForPlay.id}/${courseId}`);
  };

  const handleResumeOrEnroll = async (course: GameCourseItem, action: "resume" | "enroll") => {
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
          ? `Đã kích hoạt lại lộ trình "${course.learningPathTitle || "Lớp học"}"! Đang nạp trò chơi...`
          : `Đăng ký thành công lộ trình "${course.learningPathTitle || "Lớp học"}"! Đang nạp trò chơi...`,
        "Thành công"
      );

      setCoursesList((prev) =>
        prev.map((c) =>
          c.learningPathId === pathId ? { ...c, enrollmentStatus: "active" } : c
        )
      );

      setTimeout(() => {
        handleLaunchWithCourse(course.id);
      }, 700);
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái lộ trình:", err);
      toast.error("Không thể cập nhật trạng thái lớp học. Vui lòng thử lại!", "Lỗi");
    } finally {
      setActionLoadingId(null);
    }
  };

  const modalFilteredCourses = useMemo(() => {
    return coursesList
      .filter((c) => {
        if (!courseSearchTerm) return true;
        const q = courseSearchTerm.toLowerCase();
        return (
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          (c.learningPathTitle && c.learningPathTitle.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        // Active first, then paused, then not_enrolled
        const rank = { active: 0, paused: 1, not_enrolled: 2 };
        return rank[a.enrollmentStatus] - rank[b.enrollmentStatus];
      });
  }, [coursesList, courseSearchTerm]);

  const activeCoursesCount = useMemo(() => {
    return coursesList.filter((c) => c.enrollmentStatus === "active").length;
  }, [coursesList]);

  return (
    <div className="space-y-8 font-sans pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-red-600 border border-red-500 p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold">
              <Gamepad2 className="w-3.5 h-3.5 text-white" />
              <span>E-V-E Game Arcade Studio</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Kho Trò Chơi Giáo Dục Tương Tác
            </h1>
            <p className="text-xs md:text-sm text-red-100 leading-relaxed">
              Trải nghiệm các trò chơi học tập tương tác, củng cố kiến thức các bài học thực tế, rèn luyện tư duy và tích lũy E-V-E Coins.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/15 backdrop-blur-xs border border-white/20 p-4 rounded-2xl self-start md:self-auto">
            <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] text-red-100 font-medium">Số dư hiện tại</div>
              <div className="text-xl font-black text-amber-300">{studentCoins.toLocaleString()} Coins</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm trò chơi theo tên, thể loại, từ khóa..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-red-600 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-red-600 text-white"
                  : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
              }`}
            >
              Tất Cả Thể Loại
            </button>
            <button
              onClick={() => setSelectedCategory("memory")}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === "memory"
                  ? "bg-red-600 text-white"
                  : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
              }`}
            >
              Lật Thẻ Trí Nhớ
            </button>
            <button
              onClick={() => setSelectedCategory("boss")}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === "boss"
                  ? "bg-red-600 text-white"
                  : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
              }`}
            >
              Đấu Trùm Boss Quiz
            </button>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            className="group rounded-2xl bg-white border border-zinc-200 overflow-hidden shadow-xs hover:border-red-600 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-zinc-100">
              <img
                src={game.thumbnailUrl}
                alt={game.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {game.badge && (
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                  {game.badge}
                </span>
              )}
              {game.needExtraData && (
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-zinc-900/80 backdrop-blur-xs text-white text-[10px] font-bold border border-zinc-700">
                  Dynamic Extra Data
                </span>
              )}
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                  {game.genre}
                </div>
                <h3 className="text-base font-bold text-zinc-900 group-hover:text-red-600 transition-colors line-clamp-1">
                  {game.title}
                </h3>
                <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                  {game.description}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-zinc-100">
                <div className="flex items-center justify-between text-[11px] text-zinc-500 font-medium">
                  <span>Tác giả: <strong className="text-zinc-800">{game.author}</strong></span>
                  <span className="text-red-600 font-bold">+{game.rewardCoins} Coins</span>
                </div>

                <button
                  onClick={() => handleSelectGame(game)}
                  className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{game.needExtraData ? "Chọn Khóa Học & Bắt Đầu" : "Chơi Ngay"}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= COURSE SELECTION & SUGGESTION MODAL ================= */}
      {isModalOpen && selectedGameForPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-2xl bg-white border-2 border-red-600 p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col justify-between">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-zinc-200">
              <div>
                <span className="text-[10px] text-red-600 font-bold uppercase block">Nạp dữ liệu khóa học</span>
                <h3 className="text-lg font-bold text-zinc-900">
                  Chọn Khóa Học Cho {selectedGameForPlay.title}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-zinc-100 text-zinc-600 hover:text-zinc-900 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Thông báo gợi ý nếu chưa có khóa học đang học */}
            {activeCoursesCount === 0 && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-800">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Bạn chưa có khóa học nào đang hoạt động chứa trò chơi này
                </div>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  Dưới đây là các khóa học gợi ý hỗ trợ minigame này. Bạn có thể bấm <strong>"Đăng ký"</strong> hoặc <strong>"Học tiếp"</strong> (nếu đang bảo lưu) để kích hoạt và bắt đầu chơi ngay!
                </p>
              </div>
            )}

            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={courseSearchTerm}
                onChange={(e) => setCourseSearchTerm(e.target.value)}
                placeholder="Tìm khóa học hoặc lộ trình..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-red-600 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none"
              />
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[360px] pr-1">
              {modalFilteredCourses.map((course) => {
                const isActive = course.enrollmentStatus === "active";
                const isPaused = course.enrollmentStatus === "paused";
                const isNotEnrolled = course.enrollmentStatus === "not_enrolled";
                const isActionLoading = actionLoadingId === course.id;

                return (
                  <div
                    key={course.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isActive
                        ? "bg-white border-zinc-200 hover:border-red-500 hover:bg-red-50/30"
                        : isPaused
                        ? "bg-amber-50/50 border-amber-200"
                        : "bg-zinc-50 border-zinc-200"
                    }`}
                  >
                    <div className="space-y-1 max-w-md">
                      <div className="flex items-center gap-2 flex-wrap">
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Đang Học
                          </span>
                        )}
                        {isPaused && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold border border-amber-200 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Đang Bảo Lưu
                          </span>
                        )}
                        {isNotEnrolled && (
                          <span className="px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-600 text-[10px] font-bold">
                            Chưa Đăng Ký
                          </span>
                        )}
                        {course.learningPathTitle && (
                          <span className="text-[10px] text-zinc-500 font-medium truncate max-w-[220px]">
                            Thuộc: {course.learningPathTitle}
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-bold text-zinc-900">{course.title}</h4>
                      <p className="text-[11px] text-zinc-500 line-clamp-1">{course.description}</p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <Link href={`/student/courses/${course.id}`}>
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[11px] font-bold border border-zinc-200 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Chi Tiết</span>
                        </button>
                      </Link>

                      {isActive && (
                        <button
                          type="button"
                          onClick={() => handleLaunchWithCourse(course.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Play className="w-3 h-3 fill-white" />
                          <span>Nạp & Chơi</span>
                        </button>
                      )}

                      {isPaused && (
                        <button
                          type="button"
                          disabled={isActionLoading}
                          onClick={() => handleResumeOrEnroll(course, "resume")}
                          className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                        >
                          <RotateCw className={`w-3 h-3 ${isActionLoading ? "animate-spin" : ""}`} />
                          <span>{isActionLoading ? "Đang xử lý..." : "Học Tiếp"}</span>
                        </button>
                      )}

                      {isNotEnrolled && (
                        <button
                          type="button"
                          disabled={isActionLoading}
                          onClick={() => handleResumeOrEnroll(course, "enroll")}
                          className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                        >
                          <PlusCircle className={`w-3 h-3 ${isActionLoading ? "animate-spin" : ""}`} />
                          <span>{isActionLoading ? "Đang đăng ký..." : "Đăng Ký"}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-zinc-200 flex items-center justify-between">
              <Link href="/student/learning-paths" className="text-xs text-red-600 hover:underline font-bold">
                Xem Tất Cả Lộ Trình Học Tập →
              </Link>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold transition cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
