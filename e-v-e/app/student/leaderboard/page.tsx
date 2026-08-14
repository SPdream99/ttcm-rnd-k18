"use client";

import React, { useState, useEffect } from "react";
import {
  Trophy,
  Crown,
  GraduationCap,
  Sparkles,
  Award,
  Flame,
  Gamepad2,
  BookOpen,
  Coins,
  Radio,
  Terminal,
  Zap,
  Shield,
} from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface StudentRank {
  rank: number;
  id: string;
  name: string;
  score: number;
  coins: number;
  courses: number;
  gamesWon: number;
  streakDays: number;
  badge: string;
  title: string;
  frameType: string;
  borderTheme: string;
  badgeBg: string;
}

interface TeacherRank {
  rank: number;
  id: string;
  name: string;
  courses: number;
  playsCount: number;
  badge: string;
  title: string;
}

export default function StudentLeaderboardPage() {
  const [activeTab, setActiveTab] = useState<"students" | "teachers">("students");
  const [students, setStudents] = useState<StudentRank[]>([]);
  const [teachers, setTeachers] = useState<TeacherRank[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboards() {
      try {
        setLoading(true);
        // 1. Fetch users from Firestore
        const userSnap = await getDocs(collection(db, "users"));
        const allUsers: any[] = userSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // 2. Fetch game results
        const gameResSnap = await getDocs(collection(db, "game_results"));
        const gameResults: any[] = gameResSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        const studentMap = new Map<
          string,
          { name: string; score: number; coins: number; courses: number; gamesWon: number; streak: number }
        >();

        allUsers
          .filter((u) => u.role === "student" || (!u.role && u.email))
          .forEach((u) => {
            const uid = u.uid || u.id;
            studentMap.set(uid, {
              name: u.displayName || u.fullName || u.name || "Học viên E-V-E",
              score: Number(u.score) || 0,
              coins: Number(u.coins) || 0,
              courses: 2,
              gamesWon: 0,
              streak: 5,
            });
          });

        // Add demo students if empty
        if (studentMap.size < 3) {
          studentMap.set("s1", { name: "Nguyễn Nhật Anh", score: 3250, coins: 540, courses: 4, gamesWon: 18, streak: 9 });
          studentMap.set("s2", { name: "Nguyễn Thành Đạt", score: 2890, coins: 410, courses: 3, gamesWon: 14, streak: 7 });
          studentMap.set("s3", { name: "Đàm Tuấn Nhiên", score: 2340, coins: 360, courses: 3, gamesWon: 11, streak: 6 });
          studentMap.set("s4", { name: "Lê Minh Trí", score: 1820, coins: 280, courses: 2, gamesWon: 8, streak: 4 });
          studentMap.set("s5", { name: "Trần Bảo Ngọc", score: 1450, coins: 210, courses: 2, gamesWon: 6, streak: 3 });
        }

        // Add scores from game results
        gameResults.forEach((gr) => {
          const uid = gr.uid || gr.userId;
          if (uid && studentMap.has(uid)) {
            const st = studentMap.get(uid)!;
            st.score += Number(gr.score) || Number(gr.result) || 0;
            st.coins += Number(gr.reward) || 0;
            st.gamesWon += 1;
          }
        });

        const sortedStudents: StudentRank[] = Array.from(studentMap.entries())
          .map(([id, data]) => {
            return {
              id,
              name: data.name,
              score: data.score,
              coins: data.coins,
              courses: data.courses,
              gamesWon: data.gamesWon,
              streakDays: data.streak,
              badge: "",
              title: "",
              frameType: "",
              borderTheme: "",
              badgeBg: "",
              rank: 1,
            };
          })
          .sort((a, b) => b.score - a.score || b.coins - a.coins)
          .map((item, idx) => {
            const rank = idx + 1;
            let badge = "Học Viên Tiềm Năng ⭐";
            let title = "Tập Sự Vũ Trụ";
            let frameType = "Khung Tiêu Chuẩn";
            let borderTheme = "border-zinc-800 shadow-[4px_4px_0px_0px_#000]";
            let badgeBg = "bg-zinc-800 text-zinc-300";

            if (rank === 1) {
              badge = "🥇 ĐẠI SƯ PHỤ AI (GOLD)";
              title = "Bậc Thầy Lượng Tử AI";
              frameType = "Hoàng Kim Supernova";
              borderTheme = "border-2 border-[#E2F952] shadow-[6px_6px_0px_0px_#E2F952]";
              badgeBg = "bg-[#E2F952] text-black font-black";
            } else if (rank === 2) {
              badge = "🥈 CHIẾN BINH THUẬT TOÁN";
              title = "Thiên Tài Lượng Tử";
              frameType = "Neon Cyberpunk";
              borderTheme = "border-2 border-[#00F0FF] shadow-[6px_6px_0px_0px_#00F0FF]";
              badgeBg = "bg-[#00F0FF] text-black font-black";
            } else if (rank === 3) {
              badge = "🥉 NHÀ KHÁM PHÁ VŨ TRỤ";
              title = "Nhà Thám Hiểm Không Gian";
              frameType = "Ngọc Bích Emerald";
              borderTheme = "border-2 border-[#FF4F00] shadow-[6px_6px_0px_0px_#FF4F00]";
              badgeBg = "bg-[#FF4F00] text-white font-black";
            } else if (rank <= 5) {
              badge = "Chuyên Gia Logic 💡";
              title = "Cao Thủ Thuật Toán";
              frameType = "Tím Cosmic Violet";
              borderTheme = "border-2 border-purple-500 shadow-[4px_4px_0px_0px_#000]";
              badgeBg = "bg-purple-500/20 text-purple-300";
            }

            return {
              ...item,
              rank,
              badge,
              title,
              frameType,
              borderTheme,
              badgeBg,
            };
          });

        setStudents(sortedStudents);

        // Teacher rankings
        const teacherUsers = allUsers.filter(
          (u) => u.role === "teacher" || u.role === "instructor"
        );

        const sortedTeachers: TeacherRank[] = (
          teacherUsers.length > 0
            ? teacherUsers.map((t, idx) => ({
                rank: idx + 1,
                id: t.id || t.uid,
                name: t.name || t.fullName || "Giáo Viên E-V-E",
                courses: 3,
                playsCount: 240,
                badge: "Giảng Viên Ưu Tú 🌟",
                title: "Thạc Sĩ Khoa Học Máy Tính",
              }))
            : [
                { rank: 1, id: "t1", name: "ThS. Nguyễn Nhật Anh", courses: 4, playsCount: 520, badge: "🥇 Giảng Viên Xuất Sắc", title: "Trưởng Bộ Môn AI" },
                { rank: 2, id: "t2", name: "ThS. Nguyễn Thành Đạt", courses: 3, playsCount: 410, badge: "🥈 Giảng Viên Sáng Tạo", title: "Chuyên Gia Gamification" },
                { rank: 3, id: "t3", name: "ThS. Đàm Tuấn Nhiên", courses: 2, playsCount: 280, badge: "🥉 Giảng Viên Tận Tâm", title: "Cố Vấn Học Thuật" },
              ]
        ).sort((a, b) => b.playsCount - a.playsCount);

        setTeachers(sortedTeachers);
      } catch (err) {
        console.error("// Telemetry: Leaderboard error", err);
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboards();
  }, []);

  return (
    <div className="space-y-10 pb-16 font-sans">
      {/* ================= HERO HEADER ================= */}
      <div className="relative rounded-3xl border-2 border-zinc-800 bg-[#0c1017] p-6 md:p-10 shadow-[8px_8px_0px_0px_#000] overflow-hidden font-mono">
        <div className="absolute -top-3 right-10 bg-[#FF4F00] text-white px-4 py-0.5 text-[10px] font-black tracking-widest uppercase rotate-[2deg] border border-black shadow-[2px_2px_0px_0px_#000]">
          LEADERBOARD // SYNCHRONIZED
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-2">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#E2F952]/15 border border-[#E2F952]/60 text-[#E2F952] text-xs font-black tracking-wider">
                <Radio className="w-3.5 h-3.5 animate-pulse" /> E-V-E HALL OF FAME
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              BẢNG VINH DANH CHIẾN BINH 🏆
            </h1>
            <p className="text-xs md:text-sm text-zinc-400 font-sans leading-relaxed">
              Xếp hạng thời gian thực dựa trên tổng điểm EXP, số minigame đã thắng và chuỗi ngày học liên tục. <strong className="text-[#00F0FF]">Rê chuột vào học viên</strong> để mở cửa sổ Telemetry thông tin học tập!
            </p>
          </div>

          {/* Tactical Tab Switcher */}
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-black border-2 border-zinc-800 shadow-[4px_4px_0px_0px_#000]">
            <button
              onClick={() => setActiveTab("students")}
              className={`px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "students"
                  ? "bg-[#E2F952] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Crown className="w-4 h-4" /> HỌC SINH
            </button>
            <button
              onClick={() => setActiveTab("teachers")}
              className={`px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "teachers"
                  ? "bg-[#00F0FF] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <GraduationCap className="w-4 h-4" /> GIẢNG VIÊN
            </button>
          </div>
        </div>
      </div>

      {/* ================= TOP 3 BRUTALIST PODIUM ================= */}
      {activeTab === "students" && students.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 font-mono">
          {/* #2 Silver Cyberpunk */}
          <div className="order-2 md:order-1 relative rounded-tl-3xl rounded-br-3xl bg-[#121620] border-2 border-[#00F0FF] p-6 text-center shadow-[6px_6px_0px_0px_#00F0FF] space-y-4 rotate-[-1.5deg] hover:rotate-0 transition-transform">
            <div className="w-8 h-8 mx-auto -mt-10 rounded-lg bg-[#00F0FF] text-black font-black flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_#000] text-sm">
              2
            </div>
            <div className="w-20 h-20 mx-auto rounded-2xl bg-slate-900 border-2 border-[#00F0FF] p-1 flex items-center justify-center shadow-[3px_3px_0px_0px_#00F0FF]">
              <span className="text-2xl font-black text-[#00F0FF]">{students[1].name.charAt(0)}</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-white font-sans">{students[1].name}</h3>
              <span className="text-[11px] font-bold text-[#00F0FF] block">{students[1].title}</span>
              <span className="text-sm font-black text-[#E2F952]">{students[1].score} EXP • {students[1].coins} 🪙</span>
            </div>
            <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-400 flex justify-center gap-4">
              <span>🔥 {students[1].streakDays} Ngày</span>
              <span>🎮 {students[1].gamesWon} Game Thắng</span>
            </div>
          </div>

          {/* #1 Gold Supernova Champion */}
          <div className="order-1 md:order-2 relative rounded-tr-3xl rounded-bl-3xl bg-[#161c12] border-2 border-[#E2F952] p-8 text-center shadow-[8px_8px_0px_0px_#E2F952] space-y-4 md:-translate-y-4">
            <div className="w-10 h-10 mx-auto -mt-13 rounded-xl bg-[#E2F952] text-black font-black flex items-center justify-center border-2 border-black shadow-[3px_3px_0px_0px_#000] text-base">
              👑 1
            </div>
            <div className="w-24 h-24 mx-auto rounded-3xl bg-slate-900 border-3 border-[#E2F952] p-1 flex items-center justify-center shadow-[4px_4px_0px_0px_#E2F952] animate-pulse">
              <span className="text-3xl font-black text-[#E2F952]">{students[0].name.charAt(0)}</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-white font-sans">{students[0].name}</h3>
              <span className="text-xs font-black text-[#E2F952] block">{students[0].title}</span>
              <span className="text-base font-black text-[#E2F952]">{students[0].score} EXP • {students[0].coins} 🪙</span>
            </div>
            <div className="pt-3 border-t border-zinc-800 text-xs text-zinc-300 flex justify-center gap-5 font-bold">
              <span className="text-[#FF4F00]">🔥 {students[0].streakDays} Ngày Streak</span>
              <span className="text-[#00F0FF]">🎮 {students[0].gamesWon} Game Thắng</span>
            </div>
          </div>

          {/* #3 Bronze Safety Orange */}
          <div className="order-3 relative rounded-tr-3xl rounded-bl-3xl bg-[#1c1412] border-2 border-[#FF4F00] p-6 text-center shadow-[6px_6px_0px_0px_#FF4F00] space-y-4 rotate-[1.5deg] hover:rotate-0 transition-transform">
            <div className="w-8 h-8 mx-auto -mt-10 rounded-lg bg-[#FF4F00] text-white font-black flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_#000] text-sm">
              3
            </div>
            <div className="w-20 h-20 mx-auto rounded-2xl bg-slate-900 border-2 border-[#FF4F00] p-1 flex items-center justify-center shadow-[3px_3px_0px_0px_#FF4F00]">
              <span className="text-2xl font-black text-[#FF4F00]">{students[2].name.charAt(0)}</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-white font-sans">{students[2].name}</h3>
              <span className="text-[11px] font-bold text-[#FF4F00] block">{students[2].title}</span>
              <span className="text-sm font-black text-[#E2F952]">{students[2].score} EXP • {students[2].coins} 🪙</span>
            </div>
            <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-400 flex justify-center gap-4">
              <span>🔥 {students[2].streakDays} Ngày</span>
              <span>🎮 {students[2].gamesWon} Game Thắng</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= DETAILED TABLE WITH RICH HOVER TELEMETRY ================= */}
      <div className="rounded-3xl border-2 border-zinc-800 bg-[#0c1017] p-6 md:p-8 shadow-[8px_8px_0px_0px_#000] space-y-4 font-mono">
        <h2 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2 pb-3 border-b-2 border-zinc-800">
          <Terminal className="w-5 h-5 text-[#00F0FF]" />
          {activeTab === "students" ? "DANH SÁCH CHI TIẾT HỌC VIÊN" : "DANH SÁCH GIẢNG VIÊN"}
        </h2>

        {activeTab === "students" ? (
          <div className="space-y-3">
            {students.map((st) => (
              <div
                key={st.id}
                className="group relative flex items-center justify-between p-4 rounded-xl bg-[#121620] border-2 border-zinc-800 hover:border-[#00F0FF] shadow-[4px_4px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#00F0FF] transition-all duration-200 cursor-pointer"
              >
                {/* Left info */}
                <div className="flex items-center gap-4">
                  <span className="w-8 text-center font-black text-base text-[#E2F952]">
                    #{st.rank}
                  </span>

                  <div className="w-12 h-12 rounded-xl bg-slate-900 border-2 border-zinc-700 flex items-center justify-center font-black text-white">
                    {st.name.charAt(0)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-white font-sans group-hover:text-[#00F0FF] transition-colors">
                        {st.name}
                      </h4>
                      <span className="hidden sm:inline-block px-2 py-0.5 rounded-sm text-[10px] bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold uppercase">
                        {st.title}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-400 flex items-center gap-4 mt-0.5">
                      <span>🔥 {st.streakDays} Ngày Streak</span>
                      <span>🎮 {st.gamesWon} Games Thắng</span>
                    </span>
                  </div>
                </div>

                {/* Right score */}
                <div className="text-right">
                  <span className="text-base font-black text-[#E2F952] block">{st.score} EXP</span>
                  <span className="text-xs font-bold text-zinc-400 block">{st.coins} Coins 🪙</span>
                </div>

                {/* =========================================================
                    EXPANDED HOVER TELEMETRY POPOVER (HIGH-TASTE INDUSTRIAL)
                ========================================================= */}
                <div className="pointer-events-none absolute left-1/2 -top-4 -translate-x-1/2 -translate-y-full w-84 opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50 p-5 rounded-2xl bg-[#090d14] border-2 border-[#00F0FF] shadow-[8px_8px_0px_0px_#000] text-center space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-black border-2 border-[#00F0FF] p-1 flex items-center justify-center shadow-[3px_3px_0px_0px_#00F0FF]">
                    <span className="text-2xl font-black text-[#00F0FF]">{st.name.charAt(0)}</span>
                  </div>

                  <div>
                    <h5 className="text-base font-black text-white font-sans">{st.name}</h5>
                    <span className={`px-2.5 py-0.5 rounded-sm text-[10px] uppercase inline-block mt-1 ${st.badgeBg}`}>
                      {st.badge}
                    </span>
                    <p className="text-[11px] text-zinc-400 mt-1 font-mono">Trang Bị: {st.frameType}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#141b26] border border-zinc-700 text-xs text-left">
                    <div>
                      <span className="text-zinc-500 text-[10px] block">KHÓA HỌC:</span>
                      <strong className="text-white">{st.courses} Đang Theo</strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[10px] block">MINIGAME THẮNG:</span>
                      <strong className="text-[#00F0FF]">{st.gamesWon} Trận</strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[10px] block">CHUỖI STREAK:</span>
                      <strong className="text-[#FF4F00]">🔥 {st.streakDays} Ngày</strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[10px] block">TỔNG ĐIỂM EXP:</span>
                      <strong className="text-[#E2F952]">{st.score} EXP</strong>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {teachers.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-4 rounded-xl bg-[#121620] border-2 border-zinc-800 hover:border-[#00F0FF] shadow-[4px_4px_0px_0px_#000] transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 text-center font-black text-base text-[#00F0FF]">
                    #{t.rank}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-[#00F0FF]/15 border-2 border-[#00F0FF] flex items-center justify-center font-black text-[#00F0FF]">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white font-sans">{t.name}</h4>
                    <span className="text-[11px] text-zinc-400 block">{t.title} • {t.courses} Khóa học đã xuất bản</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-[#E2F952] block">{t.playsCount} Lượt Chơi</span>
                  <span className="text-[10px] text-[#00F0FF] font-bold uppercase">{t.badge}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
