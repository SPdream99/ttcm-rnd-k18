"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Rocket,
  BookOpen,
  Gamepad2,
  Trophy,
  ShoppingBag,
  Coins,
  Play,
  CheckCircle2,
  ArrowRight,
  Flame,
  Sparkles,
  Award,
  Swords,
  Bot,
  Zap,
  Target,
  GraduationCap,
  PlusCircle,
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

        // 1. Fetch Enrolled Classes (My Classes from student_learning_path)
        if (user) {
          try {
            const enrollSnap = await getDocs(
              query(collection(db, "student_learning_path"), where("student_id", "==", user.uid))
            );

            const classesData: any[] = [];
            for (const docItem of enrollSnap.docs) {
              const eData = docItem.data();
              const pathId = eData.learning_path_id;

              // Fetch matching learning_path
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
                  category: pData.category || "General",
                  teacherName: pData.authorName || pData.teacherName || "Giáo Viên E-V-E",
                });
              }
            }
            setEnrolledClasses(classesData);
          } catch (e) {
            console.warn("Enrollment fetch notice:", e);
          }
        }

        // 2. Fetch Custom / Approved Games from Firestore
        const gamesSnap = await getDocs(collection(db, "game_info"));
        let gamesList: any[] = [];

        gamesList.push({
          id: "game_card_match_vr",
          title: "Memory Matching Game 🎴",
          courseName: "Lật Thẻ Trí Nhớ & Khái Niệm",
          genre: "Memory Match 3D",
          reward: "+50 Coins",
          badge: "HOT 🔥",
          href: "/game/MemoryMatchingGame/play",
        });

        gamesList.push({
          id: "boss_battle_quiz",
          title: "Boss Slayer Marathon Quiz 🗡️",
          courseName: "Giải Đố Đấu Trùm",
          genre: "Action QTE Quiz",
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
              courseName: data.category || "Minigame Tương Tác",
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
          { rank: 1, name: "Nguyễn Nhật Anh", points: 2850, badge: "🥇 Đại Sư Phụ AI", title: "Bậc Thầy Vũ Trụ" },
          { rank: 2, name: "Nguyễn Thành Đạt", points: 2420, badge: "🥈 Chiến Binh Thuật Toán", title: "Thiên Tài Lượng Tử" },
          { rank: 3, name: "Đàm Tuấn Nhiên", points: 1980, badge: "🥉 Nhà Khám Phá Vũ Trụ", title: "Nhà Thám Hiểm" },
        ]);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* ================= HERO WELCOME BANNER ================= */}
      <div className="relative overflow-hidden rounded-3xl border border-[#7bd1fa]/25 bg-gradient-to-r from-[#0f1524] via-[#151c30] to-[#0a0e1a] p-6 md:p-8 backdrop-blur-xl shadow-2xl">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> E-V-E Cosmic Portal
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-semibold">
                <Flame className="w-3.5 h-3.5" /> Streak 7 Ngày 🔥
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              Chào mừng trở lại, <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">{displayName}</span>! 🚀
            </h1>
            <p className="text-xs md:text-sm text-[#8e9bb4] max-w-2xl leading-relaxed">
              Tiếp tục hành trình học tập, mở khóa các khóa học theo bản đồ tương tác và thử thách các Minigame chuẩn E-V-E SDK v2.0.
            </p>
          </div>

          {/* Quick Action Badges */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#151b2c] border border-[#7bd1fa]/20 shadow-lg">
              <Coins className="w-6 h-6 text-amber-400 animate-bounce" />
              <div>
                <span className="text-[10px] uppercase font-mono text-[#8e9bb4] block font-bold">Số dư Coins</span>
                <span className="text-base font-extrabold text-amber-300 font-mono">{displayCoins} 🪙</span>
              </div>
            </div>

            <Link
              href="/student/ai-tutor"
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Bot className="w-4 h-4" /> Hỏi AI Tutor
            </Link>
          </div>
        </div>
      </div>

      {/* ================= SECTION 1: MY CLASSES (LỚP HỌC ĐÃ ĐĂNG KÝ) ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg md:text-xl font-extrabold text-white tracking-tight">
              Lớp Học Đã Đăng Ký (My Classes)
            </h2>
          </div>
          <Link
            href="/student/learning-paths"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Đăng Ký Lớp Mới <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {enrolledClasses.length === 0 ? (
          <div className="p-8 rounded-3xl bg-[#0f1524]/60 border border-[#7bd1fa]/15 text-center space-y-4">
            <BookOpen className="w-12 h-12 text-slate-500 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Bạn Chưa Đăng Ký Lớp Học Nào</h3>
              <p className="text-xs text-[#8e9bb4] max-w-md mx-auto">
                Khám phá các lộ trình học tập chuyên sâu để đăng ký tham gia lớp học và mở khóa chuỗi minigame.
              </p>
            </div>
            <Link
              href="/student/learning-paths"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.3)] transition"
            >
              <Rocket className="w-4 h-4" /> Khám Phá Learning Paths Ngay
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {enrolledClasses.map((cls) => (
              <div
                key={cls.id}
                className="group rounded-3xl border border-[#7bd1fa]/20 bg-[#0f1524]/80 p-5 backdrop-blur-xl hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold uppercase">
                      {cls.category}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold">
                      {cls.progress}% Hoàn Thành
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {cls.title}
                  </h3>

                  <p className="text-xs text-[#8e9bb4] line-clamp-2 leading-relaxed">
                    {cls.description}
                  </p>

                  {/* Progress bar */}
                  <div className="space-y-1 pt-1">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#151b2c]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                        style={{ width: `${cls.progress}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-[#8e9bb4] block">
                      {cls.coursesCount} Khóa học • Giảng viên: {cls.teacherName}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#7bd1fa]/10 mt-4">
                  <Link
                    href={`/student/classes/${cls.id}`}
                    className="w-full py-2.5 rounded-xl bg-[#151b2c] hover:bg-cyan-600/30 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Vào Lớp Học
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= SECTION 2: FAST MINIGAME HUB ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Playable Minigames List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg md:text-xl font-extrabold text-white tracking-tight">
                Kho Minigame Sẵn Sàng Chơi 🎮
              </h2>
            </div>
            <Link
              href="/student/games"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {availableGames.map((game) => (
              <div
                key={game.id}
                className="rounded-3xl border border-[#7bd1fa]/15 bg-[#0f1524]/80 p-5 backdrop-blur-xl hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[9px] font-mono font-bold">
                      {game.badge}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-300">{game.reward}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white line-clamp-1">{game.title}</h3>
                  <p className="text-xs text-[#8e9bb4] line-clamp-2">{game.courseName}</p>
                </div>

                <div className="pt-4 border-t border-[#7bd1fa]/10 mt-3">
                  <Link
                    href={game.href}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.3)] cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" /> Chơi Ngay
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Leaderboard Card (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg md:text-xl font-extrabold text-white tracking-tight">
                Bảng Xếp Hạng 🏆
              </h2>
            </div>
            <Link
              href="/student/leaderboard"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              Chi tiết <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="rounded-3xl border border-[#7bd1fa]/15 bg-[#0f1524]/80 p-4 space-y-3 backdrop-blur-xl">
            {topRankings.map((user) => (
              <div
                key={user.rank}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#151b2c] border border-[#7bd1fa]/10 hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 text-center font-black font-mono text-sm ${
                    user.rank === 1 ? "text-amber-400" : user.rank === 2 ? "text-slate-300" : "text-amber-600"
                  }`}>
                    #{user.rank}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white">{user.name}</h4>
                    <span className="text-[10px] text-cyan-400 font-medium block">{user.title}</span>
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
