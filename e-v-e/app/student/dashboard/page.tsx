"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Rocket,
  BookOpen,
  Gamepad2,
  Trophy,
  Coins,
  Play,
  ArrowRight,
  Flame,
  Sparkles,
  Bot,
  GraduationCap,
  PlusCircle,
  Award,
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function StudentDashboardPage() {
  const { currentUser, profile } = useAuthAdapter();
  const displayName = currentUser?.name || profile?.fullName || "Học Viên E-V-E";
  const displayCoins = currentUser?.coins ?? profile?.coins ?? 250;

  const [enrolledClasses, setEnrolledClasses] = useState<any[]>([]);
  const [availableGames, setAvailableGames] = useState<any[]>([]);
  const [topRankings, setTopRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const user = auth.currentUser;

        // 1. Fetch Enrolled Classes
        if (user) {
          try {
            const enrollSnap = await getDocs(
              query(collection(db, "student_learning_path"), where("student_id", "==", user.uid))
            );

            const classesData: any[] = [];
            for (const docItem of enrollSnap.docs) {
              const eData = docItem.data();
              const pathId = eData.learning_path_id;

              const pathDoc = await getDoc(doc(db, "learning_path", pathId));
              if (pathDoc.exists()) {
                const pData = pathDoc.data();
                const courses = Array.isArray(pData.courses) ? pData.courses : [];
                classesData.push({
                  id: pathDoc.id,
                  title: pData.title || "Lớp học E-V-E",
                  description: pData.description || "",
                  progress: Number(eData.progress) || 0,
                  coursesCount: courses.length,
                  category: pData.category || "Công nghệ & Lập trình",
                  teacherName: pData.authorName || pData.teacherName || "Giáo Viên E-V-E",
                });
              }
            }
            setEnrolledClasses(classesData);
          } catch (e) {
            console.error("Lỗi khi tải thông tin lớp học:", e);
          }
        }

        // 2. Fetch Games List
        const gamesSnap = await getDocs(collection(db, "game_info"));
        let gamesList: any[] = [];

        gamesList.push({
          id: "game_card_match_vr",
          title: "Memory Matching Game 🎴",
          courseName: "Lật Thẻ Trí Nhớ & Khái Niệm",
          genre: "Game Trí Nhớ 3D",
          reward: "+50 Coins",
          badge: "NỔI BẬT 🔥",
          href: "/game/MemoryMatchingGame/play",
        });

        gamesList.push({
          id: "boss_battle_quiz",
          title: "Boss Slayer Marathon Quiz 🗡️",
          courseName: "Giải Đố Phản Xạ Đấu Trùm",
          genre: "Trắc Nghiệm Phản Xạ",
          reward: "+60 Coins",
          badge: "THỬ THÁCH ⚡",
          href: "/student/play/boss_battle_quiz/crs_python_foundation",
        });

        gamesSnap.docs.forEach((d) => {
          const data = d.data();
          if (data.status === "approved" || data.status === "active") {
            gamesList.push({
              id: d.id,
              title: data.name || data.title || "Minigame",
              courseName: data.category || "Minigame Giáo Dục",
              genre: data.genre || "HTML5 Game",
              reward: "+50 Coins",
              badge: "MỚI ⭐",
              href: `/student/play/${d.id}/default`,
            });
          }
        });
        setAvailableGames(gamesList.slice(0, 3));

        // 3. Top Rankings
        setTopRankings([
          { rank: 1, name: "Nguyễn Nhật Anh", points: 2850, badge: "🥇 Thủ Khoa", title: "Học Viên Xuất Sắc" },
          { rank: 2, name: "Nguyễn Thành Đạt", points: 2420, badge: "🥈 Á Khoa", title: "Chuyên Gia Thuật Toán" },
          { rank: 3, name: "Đàm Tuấn Nhiên", points: 1980, badge: "🥉 Khám Phá", title: "Thành Viên Tích Cực" },
        ]);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* ================= HERO CHÀO MỪNG ================= */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-[#0f1422] via-[#141b2d] to-[#0f1422] p-6 md:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Không Gian Học Tập Trực Tuyến
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> Chuỗi học 7 ngày liên tục 🔥
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              Chào mừng trở lại, <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">{displayName}</span> 👋
            </h1>

            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              Theo dõi tiến độ bài học, khám phá bản đồ lộ trình học tập và rèn luyện kiến thức cùng kho minigame tương tác.
            </p>
          </div>

          {/* Khối Thao Tác & Điểm Thưởng */}
          <div className="flex items-center gap-3 self-start lg:self-auto shrink-0">
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#172033] border border-slate-800 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Số dư E-V-E Coins</span>
                <span className="text-base font-bold text-amber-300 font-mono">{displayCoins} 🪙</span>
              </div>
            </div>

            <Link
              href="/student/ai-tutor"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
            >
              <Bot className="w-4 h-4" /> Hỏi Gia Sư
            </Link>
          </div>
        </div>
      </div>

      {/* ================= PHẦN 1: LỚP HỌC ĐÃ ĐĂNG KÝ ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
              Lớp Học Đã Đăng Ký ({enrolledClasses.length})
            </h2>
          </div>

          <Link
            href="/student/learning-paths"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            <PlusCircle className="w-4 h-4" /> Khám phá lộ trình mới <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {enrolledClasses.length === 0 ? (
          <div className="p-8 rounded-3xl border border-slate-800 bg-[#0f1422]/60 text-center space-y-4">
            <BookOpen className="w-12 h-12 text-slate-500 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Bạn Chưa Đăng Ký Lớp Học Nào</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Hãy lựa chọn lộ trình chuyên sâu để tham gia lớp học và mở khóa các chặng bài học theo bản đồ.
              </p>
            </div>
            <Link
              href="/student/learning-paths"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/30 transition"
            >
              <Rocket className="w-4 h-4" /> Khám Phá Lộ Trình Học Ngay
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {enrolledClasses.map((cls) => (
              <div
                key={cls.id}
                className="group rounded-3xl border border-slate-800 bg-[#0f1422] p-5 hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] font-semibold uppercase">
                      {cls.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {cls.progress}% Hoàn thành
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {cls.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {cls.description}
                  </p>

                  {/* Thanh tiến độ */}
                  <div className="space-y-1.5 pt-1">
                    <div className="h-2 w-full rounded-full bg-[#172033] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                        style={{ width: `${cls.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>{cls.coursesCount} Khóa học</span>
                      <span>GV: {cls.teacherName}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 mt-4">
                  <Link
                    href={`/student/classes/${cls.id}`}
                    className="w-full py-2.5 rounded-xl bg-[#172033] hover:bg-cyan-600/30 text-cyan-300 hover:text-cyan-200 border border-cyan-500/20 text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Vào Lớp Học
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= PHẦN 2: MINIGAME & BẢNG XẾP HẠNG ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Minigame (2 Cột) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
                Kho Minigame Sẵn Sàng 🎮
              </h2>
            </div>

            <Link
              href="/student/games"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {availableGames.map((game) => (
              <div
                key={game.id}
                className="rounded-3xl border border-slate-800 bg-[#0f1422] p-5 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-semibold">
                      {game.badge}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-300">{game.reward}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white line-clamp-1">{game.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{game.courseName}</p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 mt-3">
                  <Link
                    href={game.href}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" /> Chơi Ngay
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Xếp Hạng (1 Cột) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
                Bảng Vinh Danh 🏆
              </h2>
            </div>

            <Link
              href="/student/leaderboard"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              Chi tiết <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-[#0f1422] p-4 space-y-3">
            {topRankings.map((user) => (
              <div
                key={user.rank}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#151c2e] border border-slate-800 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 text-center font-bold font-mono text-sm ${
                    user.rank === 1 ? "text-amber-400" : user.rank === 2 ? "text-slate-300" : "text-amber-600"
                  }`}>
                    #{user.rank}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white">{user.name}</h4>
                    <span className="text-[10px] text-slate-400 block">{user.title}</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-amber-300">{user.points} EXP</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
