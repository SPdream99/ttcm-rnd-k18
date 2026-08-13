"use client";

import React, { useState } from "react";
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Flame,
  Coins,
  GraduationCap,
  Users,
  Sparkles,
  Gamepad2,
} from "lucide-react";

export default function StudentLeaderboardPage() {
  const [activeTab, setActiveTab] = useState<"students" | "teachers" | "game_space" | "game_memory">("students");

  const topStudents = [
    { rank: 1, name: "Trần Minh Quân", score: 1450, coins: 420, courses: 8, badge: "Thủ Khoa Xuất Sắc" },
    { rank: 2, name: "Đạt Student", score: 1280, coins: 250, courses: 6, badge: "Chuyên Gia Thuật Toán" },
    { rank: 3, name: "Nguyễn Hương Giang", score: 1120, coins: 310, courses: 5, badge: "Chiến Binh Logic" },
    { rank: 4, name: "Phạm Hải Đăng", score: 980, coins: 180, courses: 4, badge: "Học Viên Tiềm Năng" },
    { rank: 5, name: "Lê Bảo Ngọc", score: 850, coins: 140, courses: 3, badge: "Học Viên Chăm Chỉ" },
  ];

  const topTeachers = [
    { rank: 1, name: "GS. Nguyễn Văn An", courses: 8, playsCount: 520, badge: "Giảng Viên Tiêu Biểu Tháng" },
    { rank: 2, name: "ThS. Phạm Hoàng Nam", courses: 5, playsCount: 340, badge: "Giảng Viên Sáng Tạo AI" },
    { rank: 3, name: "TS. Lê Thị Mai", courses: 4, playsCount: 210, badge: "Giảng Viên Tiên Phong" },
  ];

  const topGameSpace = [
    { rank: 1, name: "Trần Minh Quân", score: 980, time: "1:15s" },
    { rank: 2, name: "Đạt Student", score: 950, time: "1:22s" },
    { rank: 3, name: "Phạm Hải Đăng", score: 890, time: "1:35s" },
  ];

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/15">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Trophy className="w-7 h-7 text-amber-400" /> Bảng Vinh Danh & Xếp Hạng E-V-E
          </h1>
          <p className="text-sm text-[#8e9bb4] mt-1">
            Tôn vinh các học viên đạt thành tích cao nhất trong tháng, giáo viên tích cực và học sinh hoàn thành xuất sắc thử thách minigame.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab("students")}
          className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
            activeTab === "students"
              ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.25)]"
              : "bg-[#151b2c] text-slate-400 border-slate-800"
          }`}
        >
          <Crown className="w-4 h-4 text-amber-400" /> Học Viên Nổi Bật Tháng
        </button>

        <button
          onClick={() => setActiveTab("teachers")}
          className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
            activeTab === "teachers"
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
              : "bg-[#151b2c] text-slate-400 border-slate-800"
          }`}
        >
          <GraduationCap className="w-4 h-4 text-emerald-400" /> Giáo Viên Tiêu Biểu Tháng
        </button>

        <button
          onClick={() => setActiveTab("game_space")}
          className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
            activeTab === "game_space"
              ? "bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.25)]"
              : "bg-[#151b2c] text-slate-400 border-slate-800"
          }`}
        >
          <Gamepad2 className="w-4 h-4 text-purple-400" /> Top Quiz Runner 3D
        </button>
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-2xl bg-[#0f1524]/90 border border-[#7bd1fa]/15 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#151b2c] border-b border-slate-800 text-slate-400 uppercase text-[10px]">
            <tr>
              <th className="px-6 py-4">Hạng</th>
              <th className="px-6 py-4">Thành Viên</th>
              <th className="px-6 py-4">Danh Hiệu / Huy Hiệu</th>
              <th className="px-6 py-4 text-right">
                {activeTab === "teachers" ? "Lượt Học Sinh Chơi" : "Tổng Điểm Tích Lũy"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {activeTab === "students" &&
              topStudents.map((st) => (
                <tr key={st.rank} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    {st.rank === 1 ? (
                      <span className="w-7 h-7 rounded-full bg-amber-400 text-black font-bold flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                        1
                      </span>
                    ) : st.rank === 2 ? (
                      <span className="w-7 h-7 rounded-full bg-slate-300 text-black font-bold flex items-center justify-center">
                        2
                      </span>
                    ) : st.rank === 3 ? (
                      <span className="w-7 h-7 rounded-full bg-amber-700 text-white font-bold flex items-center justify-center">
                        3
                      </span>
                    ) : (
                      <span className="text-slate-500 font-bold px-2">#{st.rank}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-white text-sm font-sans">{st.name}</div>
                    <div className="text-[11px] text-slate-400">{st.courses} Khóa học đã hoàn thành</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px]">
                      {st.badge}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-base font-bold text-amber-300 font-mono">{st.score} pts</div>
                    <div className="text-[11px] text-slate-400">{st.coins} Coins</div>
                  </td>
                </tr>
              ))}

            {activeTab === "teachers" &&
              topTeachers.map((tc) => (
                <tr key={tc.rank} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <span className="w-7 h-7 rounded-full bg-emerald-500 text-black font-bold flex items-center justify-center">
                      {tc.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-white text-sm font-sans">{tc.name}</div>
                    <div className="text-[11px] text-slate-400">{tc.courses} Khóa học & Lộ trình</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px]">
                      {tc.badge}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-base font-bold text-emerald-300 font-mono">{tc.playsCount} lượt</div>
                  </td>
                </tr>
              ))}

            {activeTab === "game_space" &&
              topGameSpace.map((gm) => (
                <tr key={gm.rank} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <span className="w-7 h-7 rounded-full bg-purple-500 text-white font-bold flex items-center justify-center">
                      {gm.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-white text-sm font-sans">{gm.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-400 font-mono">Thời gian hoàn thành: {gm.time}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-base font-bold text-purple-300 font-mono">{gm.score} pts</div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
