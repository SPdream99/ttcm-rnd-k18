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
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function StudentDashboardPage() {
  const { currentUser, profile } = useAuthAdapter();
  const displayName = currentUser?.name || profile?.fullName || "Học Viên E-V-E";
  const displayCoins = currentUser?.coins ?? profile?.coins ?? 250;

  const [learningPaths, setLearningPaths] = useState<any[]>([
    {
      id: "path_quantum_physics",
      title: "Chinh Phục Vật Lý Lượng Tử K18 🌌",
      progress: 75,
      currentCourseId: "crs_coding_basics",
      currentCourseTitle: "Nhập Môn Tư Duy Lập Trình & Thuật Toán",
      nextGameId: "boss_battle_quiz",
      totalCourses: 4,
      completedCourses: 3,
    },
    {
      id: "path_computer_arch",
      title: "Khám Phá Phần Cứng & Kiến Trúc Máy Tính 3D 💻",
      progress: 50,
      currentCourseId: "crs_computer_hardware",
      currentCourseTitle: "Khám Phá Phần Cứng & Kiến Trúc Máy Tính 3D",
      nextGameId: "game_space_quiz_3d",
      totalCourses: 3,
      completedCourses: 1,
    },
  ]);

  const [availableGames, setAvailableGames] = useState<any[]>([
    {
      id: "boss_battle_quiz",
      title: "Boss Slayer Marathon Quiz 🗡️",
      courseId: "crs_coding_basics",
      courseName: "Tư Duy Lập Trình",
      genre: "Action QTE Quiz",
      reward: "+100 Coins",
      badge: "MỚI NHẤT 🔥",
      description: "Đánh trùm 1000 HP marathon 10s liên tục, né đòn phản công QTE bằng phím mũi tên!",
    },
    {
      id: "game_space_quiz_3d",
      title: "Space Flight Quiz 3D 🚀",
      courseId: "crs_computer_hardware",
      courseName: "Kiến Trúc Máy Tính",
      genre: "WebGL Space Simulator",
      reward: "+50 Coins",
      badge: "PHỔ BIẾN ⭐",
      description: "Điều khiển phi thuyền trong không gian 3D, bắn đúng đáp án để ghi điểm số cao!",
    },
    {
      id: "game_card_match_vr",
      title: "Quantum Memory Card Matrix 🃏",
      courseId: "crs_quantum_101",
      courseName: "Vật Lý Lượng Tử",
      genre: "Memory Match 3D",
      reward: "+40 Coins",
      badge: "TRÍ TUỆ 💡",
      description: "Lật và ghi nhớ các cặp định nghĩa sóng hạt, hiện tượng quang điện để nhận thưởng.",
    },
  ]);

  const [topRankings, setTopRankings] = useState<any[]>([
    { rank: 1, name: "Trần Minh Đức", score: 1450, coins: 520, badge: "Thủ Khoa 👑" },
    { rank: 2, name: "Nguyễn Hoàng Nam", score: 1280, coins: 410, badge: "Chuyên Gia 💡" },
    { rank: 3, name: "Lê Thu Hà", score: 1120, coins: 340, badge: "Bứt Phá 🔥" },
  ]);

  useEffect(() => {
    async function loadGamesAndCourses() {
      try {
        const gamesSnap = await getDocs(collection(db, "games"));
        let gamesList: any[] = gamesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        try {
          if (typeof window !== "undefined") {
            const localGames = JSON.parse(localStorage.getItem("eve_uploaded_games") || "[]");
            localGames.forEach((lg: any) => {
              if (!gamesList.some((g: any) => g.title === lg.title || g.id === lg.id)) {
                gamesList.push(lg);
              }
            });
          }
        } catch {}

        if (gamesList.length > 0) {
          const mapped = gamesList.map((g: any) => ({
            id: g.id || "boss_battle_quiz",
            title: g.title || "Game Quiz",
            courseId: (g.coursesAllowed && g.coursesAllowed[0]) || "crs_coding_basics",
            courseName: (g.coursesAllowed && g.coursesAllowed[0]) ? "Khóa Phù Hợp" : "Tư Duy Lập Trình",
            genre: "Interactive Quiz",
            reward: "+60 Coins",
            badge: "GAME ĐÃ DUYỆT",
            description: g.description || "Chơi game để kiểm tra kiến thức bài học.",
          }));
          setAvailableGames(mapped);
        }
      } catch (err) {
        console.warn("Using default student games list:", err);
      }
    }

    loadGamesAndCourses();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/15">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-mono mb-2">
            <Flame className="w-3.5 h-3.5 text-amber-400" /> Chuỗi 7 Ngày Học Liên Tục • Chào mừng {displayName} 🌟
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Bảng Điều Khiển Học Viên E-V-E 🚀
          </h1>
          <p className="text-sm text-[#8e9bb4] mt-1">
            Tiếp tục hành trình học tập, hoàn thành các bài học & minigame tương tác để tích lũy Coins và vinh danh trên BXH.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="font-mono font-bold text-sm text-amber-300">{displayCoins} Coins</span>
          </div>
          <Link href="/student/shop">
            <button className="px-3.5 py-2 rounded-xl bg-[#151b2c] hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" /> Đổi Thưởng
            </button>
          </Link>
        </div>
      </div>

      {/* ── Active Learning Paths ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" /> Lộ Trình Đang Theo Học
          </h2>
          <Link
            href="/student/learning-paths"
            className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
          >
            Khám phá thêm lộ trình <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {learningPaths.map((path) => (
            <div
              key={path.id}
              className="p-6 rounded-2xl bg-gradient-to-r from-[#0f1524] via-[#151b2c] to-[#0f1524] border border-[#7bd1fa]/20 shadow-xl space-y-5 hover:border-cyan-500/40 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider">Tiến Độ Học Tập</span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{path.title}</h3>
                  <p className="text-xs text-[#8e9bb4] mt-1">
                    Bài hiện tại: <strong className="text-cyan-300">{path.currentCourseTitle}</strong>
                  </p>
                </div>

                <Link href={`/student/play/${path.nextGameId}/${path.currentCourseId}`}>
                  <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-cyan-300 text-white font-mono text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.35)] transition-all cursor-pointer flex items-center gap-2 shrink-0">
                    <Play className="w-3.5 h-3.5 fill-white" /> Chơi Quiz Ngay
                  </button>
                </Link>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                  <span>Hoàn thành {path.completedCourses}/{path.totalCourses} bài học</span>
                  <span className="font-bold text-cyan-400">{path.progress}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                    style={{ width: `${path.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Playable Game Hub ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-purple-400" /> Ngân Hàng Game Engine Ôn Tập Tri Thức
            </h2>
            <p className="text-xs text-[#8e9bb4] mt-0.5">
              Dữ liệu bài học được tự động inject vào game để tạo thử thách trắc nghiệm tương tác cao.
            </p>
          </div>

          <Link
            href="/student/leaderboard"
            className="text-xs font-mono text-purple-400 hover:underline flex items-center gap-1"
          >
            Xem BXH Điểm Thưởng <Trophy className="w-3.5 h-3.5 text-amber-400" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {availableGames.map((game) => (
            <div
              key={game.id}
              className="p-5 rounded-2xl bg-[#0f1524]/85 border border-purple-500/20 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-4 shadow-lg group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-bold">
                    {game.badge}
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {game.reward}
                  </span>
                </div>

                <h3 className="font-bold text-base text-white group-hover:text-purple-300 transition-colors">
                  {game.title}
                </h3>
                <p className="text-xs text-[#8e9bb4] line-clamp-2 leading-relaxed">
                  {game.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span>Khóa: {game.courseName}</span>
                  <span className="text-cyan-400">{game.genre}</span>
                </div>

                <Link href={`/student/play/${game.id}/${game.courseId}`}>
                  <button className="w-full py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/40 font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2">
                    <Play className="w-3.5 h-3.5 fill-current" /> Vào Trận Đấu Ngay
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Leaderboard & Quick Tools ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 3 Leaderboard */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0f1524]/80 border border-[#7bd1fa]/15 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" /> Bảng Vinh Danh Học Sinh Xuất Sắc
            </h3>
            <Link
              href="/student/leaderboard"
              className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              Xem đầy đủ <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {topRankings.map((student) => (
              <div
                key={student.rank}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                  student.rank === 1
                    ? "bg-amber-500/10 border-amber-500/40"
                    : "bg-[#151b2c] border-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs font-mono ${
                      student.rank === 1
                        ? "bg-amber-400 text-black shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                        : student.rank === 2
                        ? "bg-slate-300 text-black"
                        : "bg-amber-700 text-white"
                    }`}
                  >
                    #{student.rank}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">{student.name}</div>
                    <span className="text-[10px] font-mono text-amber-300">{student.badge}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-cyan-300 font-bold">{student.score} Pts</span>
                  <span className="text-amber-300 font-bold">+{student.coins} Coins</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Tutor Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0f1524] to-[#172554] border border-cyan-500/30 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white">Gia Sư Trí Tuệ Nhân Tạo (AI Tutor)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bạn gặp khó khăn trong một câu hỏi hay định lý? Hỏi ngay AI Tutor để được giải thích chi tiết từng bước.
            </p>
          </div>

          <Link href="/student/ai-tutor">
            <button className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2">
              <Bot className="w-3.5 h-3.5" /> Trò Chuyện Với AI Tutor
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
