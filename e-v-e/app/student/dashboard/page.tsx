"use client";

import React from "react";
import Link from "next/link";
import {
  Rocket,
  BookOpen,
  Gamepad2,
  Trophy,
  ShoppingBag,
  Coins,
  Play,
  CheckCircle,
  ArrowRight,
  Flame,
  Sparkles,
  Award,
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";

export default function StudentDashboardPage() {
  const { currentUser, profile } = useAuthAdapter();
  const displayName = currentUser?.name || profile?.fullName || "Học Sinh";
  const displayCoins = currentUser?.coins ?? profile?.coins ?? 250;

  const currentPaths = [
    {
      id: "path_quantum_physics",
      title: "Chinh Phục Vật Lý Lượng Tử K18",
      progress: 65,
      currentCourseId: "crs_quantum_101",
      currentCourseTitle: "Hiện tượng quang điện & Lưỡng tính sóng hạt",
      nextGameId: "game_space_quiz_3d",
      totalCourses: 3,
      completedCourses: 2,
    },
  ];

  const quickGames = [
    {
      id: "game_space_quiz_3d",
      title: "Space Flight Quiz 3D",
      courseId: "crs_quantum_101",
      courseName: "Vật Lý Lượng Tử",
      reward: "+50 Coins",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600",
    },
    {
      id: "game_card_match_vr",
      title: "Quantum Memory Matrix",
      courseId: "crs_astrophysics",
      courseName: "Thiên Văn Học",
      reward: "+40 Coins",
      image: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/15">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-mono mb-2">
            <Rocket className="w-3.5 h-3.5 text-cyan-400" /> Bàn Học Tập Vũ Trụ E-V-E
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Chào mừng trở lại, {displayName} 🌟
          </h1>
          <p className="text-sm text-[#8e9bb4] mt-1">
            Tiếp tục hành trình học tập, vượt thử thách Game Quiz để tích lũy Coins và vinh danh trên BXH.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="font-mono font-bold text-sm text-amber-300">{displayCoins} Coins</span>
          </div>
        </div>
      </div>

      {/* ── Active Learning Path ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" /> Lộ Trình Đang Học
          </h2>
          <Link
            href="/student/learning-paths"
            className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
          >
            Khám phá thêm lộ trình <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {currentPaths.map((path) => (
          <div
            key={path.id}
            className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-[#0f1524] via-[#151b2c] to-[#0f1524] border border-[#7bd1fa]/20 shadow-xl space-y-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono uppercase text-cyan-400 tracking-wider">Tiến Độ Học Tập</span>
                <h3 className="text-xl font-bold text-white mt-0.5">{path.title}</h3>
                <p className="text-xs text-[#8e9bb4] mt-1">
                  Đang học: <strong className="text-cyan-300">{path.currentCourseTitle}</strong>
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link href={`/student/play/${path.nextGameId}/${path.currentCourseId}`}>
                  <button className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-cyan-300 text-white font-mono text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center gap-2 hover:scale-[1.02]">
                    <Play className="w-4 h-4 fill-white" /> Chơi Game Quiz Khóa Này
                  </button>
                </Link>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                <span>Đã hoàn thành {path.completedCourses}/{path.totalCourses} Khóa Học</span>
                <span className="font-bold text-cyan-400">{path.progress}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                  style={{ width: `${path.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ── Quick Play Game Hub ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-purple-400" /> Trò Chơi Tương Tác Học Tập
          </h2>
          <span className="text-xs font-mono text-slate-400">Data Course được inject trực tiếp</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {quickGames.map((game) => (
            <div
              key={game.id}
              className="p-5 rounded-2xl bg-[#0f1524]/85 border border-purple-500/20 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-4 shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    Khóa: {game.courseName}
                  </span>
                  <h3 className="font-bold text-base text-white mt-1.5">{game.title}</h3>
                </div>
                <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                  {game.reward}
                </span>
              </div>

              <Link href={`/student/play/${game.id}/${game.courseId}`}>
                <button className="w-full py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/40 font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2">
                  <Play className="w-3.5 h-3.5 fill-current" /> Vào Chơi Ngay
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
