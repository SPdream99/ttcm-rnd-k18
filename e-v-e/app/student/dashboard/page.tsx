"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Rocket,
  BookOpen,
  Gamepad2,
  Trophy,
  Coins,
  Play,
  ArrowRight,
  Flame,
  Bot,
  GraduationCap,
  PlusCircle,
  Crown,
  Search,
  X,
  Layers,
  Lock,
  AlertCircle,
  RotateCw,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { useToast } from "@/components/Toast";
import { collection, getDocs, query, where, doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { cacheService } from "@/lib/cacheService";
import { ProfileHoverCard } from "@/components/ProfileHoverCard";

export interface DashboardCourseItem {
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

export default function StudentDashboardPage() {
  const router = useRouter();
  const toast = useToast();
  const { currentUser, profile } = useAuthAdapter();
  const displayName = currentUser?.name || currentUser?.displayName || profile?.fullName || "Học Viên E-V-E";
  const displayCoins = currentUser?.coins ?? profile?.coins ?? 450;

  const [enrolledClasses, setEnrolledClasses] = useState<any[]>([]);
  const [availableGames, setAvailableGames] = useState<any[]>([]);
  const [coursesList, setCoursesList] = useState<DashboardCourseItem[]>([]);
  const [topRankings, setTopRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Modal State for Extra Data Selection
  const [selectedGameForPlay, setSelectedGameForPlay] = useState<any | null>(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [courseSearch, setCourseSearch] = useState("");

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const user = auth.currentUser;
        const userUid = user?.uid || "guest";

        // Tối ưu hóa: Chạy song song toàn bộ các truy vấn Firestore độc lập
        const [enrollSnap, pathSnap, coursesSnap, gamesSnap, userSnap, gameResSnap] = await Promise.all([
          user
            ? getDocs(query(collection(db, "student_learning_path"), where("student_id", "==", user.uid)))
            : Promise.resolve({ docs: [] } as any),
          getDocs(collection(db, "learning_path")),
          getDocs(collection(db, "courses")),
          getDocs(collection(db, "game_info")),
          getDocs(collection(db, "users")),
          getDocs(collection(db, "game_results")),
        ]);

        // 1. Xây dựng tập các khóa học đã được duyệt
        const acceptedCourseIds = new Set<string>();
        coursesSnap.docs.forEach((d: any) => {
          const cd = d.data();
          if (cd.isAccepted ?? cd.is_accepted) {
            acceptedCourseIds.add(d.id);
          }
        });

        // 2. In-memory map cho Learning Paths (CHỈ path đã duyệt VÀ 100% courses con đã duyệt)
        const pathDataMap = new Map<string, any>();
        const courseToPathMap: Record<string, { pathId: string; pathTitle: string }> = {};

        pathSnap.docs.forEach((d: any) => {
          const pData = d.data();
          const isPathAccepted = Boolean(pData.isAccepted ?? pData.is_accepted);
          const pCourses: string[] = Array.isArray(pData.courses) ? pData.courses : [];
          const allCoursesApproved = pCourses.length > 0 && pCourses.every((cId) => acceptedCourseIds.has(cId));

          if (!isPathAccepted || !allCoursesApproved) return; // Quy tắc một chiều

          pathDataMap.set(d.id, pData);
          pCourses.forEach((cId) => {
            courseToPathMap[cId] = {
              pathId: d.id,
              pathTitle: pData.title || "Lộ trình học tập E-V-E",
            };
          });
        });

        // 3. Map Enrolled Classes từ bộ nhớ (Không cần gọi thêm query mạng lồng nhau)
        const userPathStatusMap = new Map<string, "active" | "paused">();
        const classesData: any[] = [];
        const seenPathIds = new Set<string>();

        for (const docItem of enrollSnap.docs) {
          const eData = docItem.data();
          const pathId = eData.learning_path_id;
          if (pathId) {
            userPathStatusMap.set(pathId, eData.status === "paused" ? "paused" : "active");
          }

          // Chỉ hiện lớp học nếu lộ trình thỏa mãn quy tắc duyệt một chiều
          if (eData.status === "paused" || seenPathIds.has(pathId) || !pathDataMap.has(pathId)) {
            continue;
          }
          seenPathIds.add(pathId);

          const pData = pathDataMap.get(pathId);
          if (pData) {
            const courses = Array.isArray(pData.courses) ? pData.courses : [];
            classesData.push({
              id: pathId,
              title: pData.title || "Lớp học E-V-E",
              description: pData.description || "",
              progress: Number(eData.progress) || 0,
              coursesCount: courses.length,
              category: pData.category || "Công nghệ & Lập trình",
              teacherName: pData.authorName || pData.teacherName || "ThS. Nguyễn Thành Đạt",
            });
          }
        }
        setEnrolledClasses(classesData);

        // 3. Map Courses List (CHỈ LẤY KHÓA HỌC ĐÃ DUYỆT VÀ THUỘC LỘ TRÌNH ĐÃ DUYỆT)
        const cl: DashboardCourseItem[] = [];
        coursesSnap.docs.forEach((d: any) => {
          const cd = d.data();
          const isCourseAccepted = Boolean(cd.isAccepted ?? cd.is_accepted ?? false);
          if (!isCourseAccepted) return; // Bỏ qua khóa học chưa duyệt

          const pInfo = courseToPathMap[d.id];
          // Bắt buộc: Khóa học PHẢI thuộc một Lộ Trình đã được duyệt 100%
          if (!pInfo) return;

          const enrollmentStatus: "active" | "paused" | "not_enrolled" = userPathStatusMap.get(pInfo.pathId) || "not_enrolled";

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

        // 4. Map Games List (CHỈ LẤY GAME ĐÃ DUYỆT)
        let gamesList: any[] = [];
        gamesSnap.docs.forEach((d: any) => {
          const data = d.data();
          const isGameAccepted = Boolean(data.isAccepted ?? data.is_accepted ?? (data.status === "approved" || data.status === "active"));
          if (!isGameAccepted) return; // Bỏ qua game chưa duyệt

          const needExtraData = data.needExtraData !== false;
          gamesList.push({
            id: d.id,
            title: data.title || data.name || "Minigame Giáo Dục",
            courseName: data.subtitle || data.description || "Thực hành tương tác",
            genre: data.genre || "Minigame",
            reward: `+${data.rewardCoins || 50} Coins`,
            badge: data.badge || "HOT",
            needExtraData,
          });
        });

        if (gamesList.length === 0) {
          gamesList = [
            {
              id: "game_card_match_vr",
              title: "Memory Matching Game",
              courseName: "Lật Thẻ Trí Nhớ & Khái Niệm",
              genre: "Game Trí Nhớ 3D",
              reward: "+50 Coins",
              badge: "NỔI BẬT",
              needExtraData: true,
            },
            {
              id: "boss_battle_quiz",
              title: "Boss Slayer Marathon Quiz",
              courseName: "Giải Đố Phản Xạ Đấu Trùm",
              genre: "Trắc Nghiệm Phản Xạ",
              reward: "+60 Coins",
              badge: "HOT",
              needExtraData: true,
            },
          ];
        }
        setAvailableGames(gamesList);

        // 5. Map Leaderboard
        const studentMap = new Map<
          string,
          { id: string; name: string; score: number; coins: number; isMe: boolean }
        >();

        userSnap.docs.forEach((d: any) => {
          const u = d.data();
          const uId = d.id;
          if (u.role === "student" || (!u.role && u.email)) {
            studentMap.set(uId, {
              id: uId,
              name: u.name || u.displayName || u.fullName || `Học viên #${uId.slice(-4)}`,
              score: Number(u.score) || (Number(u.coins) ? Number(u.coins) * 2 : 100),
              coins: Number(u.coins) || 0,
              isMe: user ? uId === user.uid : false,
            });
          }
        });

        // Điền điểm tích lũy từ kết quả game
        gameResSnap.docs.forEach((d: any) => {
          const res = d.data();
          const uId = res.userId;
          if (uId && studentMap.has(uId)) {
            const current = studentMap.get(uId)!;
            current.score = Math.max(current.score, Number(res.score) || 0);
          }
        });

        // Đảm bảo học sinh hiện tại luôn có mặt trong danh sách nếu đã đăng nhập
        if (user && !studentMap.has(user.uid)) {
          studentMap.set(user.uid, {
            id: user.uid,
            name: displayName,
            score: displayCoins * 2 || 150,
            coins: displayCoins,
            isMe: true,
          });
        }

        const sorted = Array.from(studentMap.values())
          .sort((a, b) => b.score - a.score)
          .slice(0, 5)
          .map((item, idx) => ({
            rank: idx + 1,
            id: item.id,
            name: item.name,
            score: `${item.score.toLocaleString()} XP`,
            level: `Cấp ${Math.max(1, Math.floor(item.score / 400) + 1)}`,
            isMe: item.isMe,
          }));

        setTopRankings(sorted);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu trang chủ:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [displayName, displayCoins]);

  const handleOpenGameLauncher = (game: any) => {
    if (game.needExtraData) {
      setSelectedGameForPlay(game);
      setCourseSearch("");
      setIsCourseModalOpen(true);
    } else {
      router.push(`/student/play/${game.id}/default`);
    }
  };

  const handleSelectCourseToPlay = (courseId: string) => {
    if (!selectedGameForPlay) return;
    setIsCourseModalOpen(false);
    router.push(`/student/play/${selectedGameForPlay.id}/${courseId}`);
  };

  const handleResumeOrEnroll = async (course: DashboardCourseItem, action: "resume" | "enroll") => {
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
          student_name: user.displayName || displayName,
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
        handleSelectCourseToPlay(course.id);
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
        if (!courseSearch.trim()) return true;
        const q = courseSearch.toLowerCase();
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
  }, [coursesList, courseSearch]);

  const activeCoursesCount = useMemo(() => {
    return coursesList.filter((c) => c.enrollmentStatus === "active").length;
  }, [coursesList]);

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* ================= HERO CHÀO MỪNG (ĐỎ & TRẮNG, NO GRADIENT) ================= */}
      <div className="rounded-2xl border-2 border-red-600 bg-white p-6 md:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold">
                E-V-E Educational Ecosystem
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-bold">
                <Flame className="w-3.5 h-3.5 text-red-600" /> Chuỗi học 7 ngày
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">
              Chào mừng trở lại, <span className="text-red-600">{displayName}</span>
            </h1>

            <p className="text-xs md:text-sm text-zinc-600 leading-relaxed">
              Theo dõi tiến độ bài học, khám phá bản đồ lộ trình học tập và rèn luyện kiến thức cùng kho minigame tương tác.
            </p>
          </div>

          {/* Khối Thao Tác & Điểm Thưởng */}
          <div className="flex items-center gap-3 self-start lg:self-auto shrink-0">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200">
              <div className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block font-bold uppercase">Số dư Coins</span>
                <span className="text-base font-bold text-red-600 font-mono">{displayCoins} Coins</span>
              </div>
            </div>

            <Link
              href="/student/ai-tutor"
              className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Bot className="w-4 h-4" /> Hỏi Gia Sư
            </Link>
          </div>
        </div>
      </div>

      {/* ================= PHẦN 1: LỚP HỌC ĐÃ ĐĂNG KÝ ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-red-600" />
            <h2 className="text-lg md:text-xl font-bold text-zinc-900 tracking-tight">
              Lớp Học Đã Đăng Ký ({enrolledClasses.length})
            </h2>
          </div>
          <Link
            href="/student/classes"
            className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 transition-colors"
          >
            Xem tất cả lớp học <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-zinc-400">Đang tải lớp học...</div>
        ) : enrolledClasses.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white border border-zinc-200 space-y-3">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-zinc-800">Bạn chưa tham gia lớp học nào đang hoạt động</p>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              Hãy khám phá các lộ trình chuyên gia được thiết kế bài bản để bắt đầu học tập và mở khóa minigame.
            </p>
            <Link href="/student/learning-paths">
              <button className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition cursor-pointer">
                Khám Phá Lộ Trình Học Tập
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledClasses.map((cls, idx) => (
              <div
                key={`${cls.id}_${idx}`}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs hover:border-red-600 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-[10px] font-bold border border-red-200">
                      {cls.category}
                    </span>
                    <span className="text-[11px] text-zinc-400 font-medium">
                      {cls.coursesCount} bài học
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-zinc-900 line-clamp-1">{cls.title}</h3>
                  <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{cls.description}</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-zinc-100 mt-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-medium text-zinc-600">
                      <span>Tiến độ học tập</span>
                      <span className="font-bold text-red-600">{cls.progress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
                      <div
                        className="h-full bg-red-600 rounded-full transition-all duration-500"
                        style={{ width: `${cls.progress}%` }}
                      />
                    </div>
                  </div>

                  <Link href={`/student/classes/${cls.id}`}>
                    <button className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-red-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                      <span>Vào Học Tiếp</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= PHẦN 2: KHO MINIGAME & BẢNG XẾP HẠNG ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Minigame List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-red-600" />
              <h2 className="text-lg md:text-xl font-bold text-zinc-900 tracking-tight">
                Kho Minigame Giáo Dục
              </h2>
            </div>
            <Link
              href="/student/games"
              className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 transition-colors"
            >
              Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {availableGames.map((game) => (
              <div
                key={game.id}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs hover:border-red-600 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 text-[10px] font-bold border border-zinc-200">
                      {game.genre}
                    </span>
                    <span className="text-xs font-bold text-amber-600">{game.reward}</span>
                  </div>

                  <h3 className="font-bold text-base text-zinc-900">{game.title}</h3>
                  <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{game.courseName}</p>
                </div>

                <button
                  onClick={() => handleOpenGameLauncher(game)}
                  className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{game.needExtraData ? "Chọn Khóa Học & Chơi" : "Chơi Ngay"}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bảng Xếp Hạng */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-200 pb-3">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg md:text-xl font-bold text-zinc-900 tracking-tight">
              Bảng Xếp Hạng Tuần
            </h2>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs space-y-3">
            {topRankings.map((user) => (
              <ProfileHoverCard
                key={user.rank}
                user={{
                  id: user.id,
                  name: user.name,
                  rank: user.rank,
                  score: user.score,
                  level: user.level,
                  isMe: user.isMe,
                }}
                className="w-full block"
              >
                <div
                  className={`p-3 rounded-xl flex items-center justify-between gap-3 transition-all hover:scale-[1.01] hover:shadow-xs ${
                    user.isMe
                      ? "bg-red-50/80 border border-red-200"
                      : "bg-zinc-50 hover:bg-zinc-100/90"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        user.rank === 1
                          ? "bg-amber-400 text-white"
                          : user.rank === 2
                          ? "bg-zinc-400 text-white"
                          : user.rank === 3
                          ? "bg-amber-700 text-white"
                          : "bg-zinc-200 text-zinc-700"
                      }`}
                    >
                      {user.rank}
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 cursor-pointer">
                        <span className="text-xs font-bold text-zinc-900 group-hover:text-red-600 transition-colors">
                          {user.name}
                        </span>
                        {user.isMe && (
                          <span className="text-[10px] text-red-600 font-black">(Bạn)</span>
                        )}
                      </div>
                      <div className="text-[10px] text-zinc-400 font-medium">{user.level}</div>
                    </div>
                  </div>

                  <div className="text-xs font-bold text-red-600 font-mono">{user.score}</div>
                </div>
              </ProfileHoverCard>
            ))}

            <Link href="/student/leaderboard" className="block pt-2">
              <button className="w-full py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold transition cursor-pointer">
                Xem Bảng Xếp Hạng Chi Tiết
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ================= MODAL CHỌN & GỢI Ý KHÓA HỌC CHO MINIGAME ================= */}
      {isCourseModalOpen && selectedGameForPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-2xl bg-white border-2 border-red-600 p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col justify-between">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-zinc-200">
              <div>
                <span className="text-[10px] text-red-600 font-bold uppercase block">Nạp Dữ Liệu Bài Học</span>
                <h3 className="text-lg font-bold text-zinc-900">
                  Chọn Khóa Học Cho {selectedGameForPlay.title}
                </h3>
              </div>
              <button
                onClick={() => setIsCourseModalOpen(false)}
                className="p-1.5 rounded-lg bg-zinc-100 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 transition cursor-pointer"
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
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                placeholder="Tìm tên khóa học hoặc lộ trình..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-red-600 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none"
              />
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[360px] pr-1">
              {filteredCourses.map((course) => {
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
                          onClick={() => handleSelectCourseToPlay(course.id)}
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
                onClick={() => setIsCourseModalOpen(false)}
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
