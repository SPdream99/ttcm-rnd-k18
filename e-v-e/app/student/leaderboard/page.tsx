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
  Star,
  CheckCircle2,
  Shield,
  Zap,
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
  frameRingClass: string;
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

        // 3. Fetch courses
        const coursesSnap = await getDocs(collection(db, "courses"));
        const allCourses: any[] = coursesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // Student map
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
              frameRingClass: "",
              rank: 1,
            };
          })
          .sort((a, b) => b.score - a.score || b.coins - a.coins)
          .map((item, idx) => {
            const rank = idx + 1;
            let badge = "Học Viên Tiềm Năng ⭐";
            let title = "Tập Sự Vũ Trụ";
            let frameType = "Khung Mặc Định";
            let frameRingClass = "ring-2 ring-slate-700";

            if (rank === 1) {
              badge = "🥇 Đại Sư Phụ AI (Gold)";
              title = "Bậc Thầy Lượng Tử AI";
              frameType = "Hoàng Kim Supernova";
              frameRingClass = "ring-4 ring-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.8)] border-2 border-amber-300";
            } else if (rank === 2) {
              badge = "🥈 Chiến Binh Thuật Toán (Silver)";
              title = "Thiên Tài Lượng Tử";
              frameType = "Neon Cyberpunk";
              frameRingClass = "ring-4 ring-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.8)] border-2 border-cyan-300";
            } else if (rank === 3) {
              badge = "🥉 Nhà Khám Phá Vũ Trụ (Bronze)";
              title = "Nhà Thám Hiểm Không Gian";
              frameType = "Ngọc Bích Emerald";
              frameRingClass = "ring-4 ring-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.8)] border-2 border-emerald-300";
            } else if (rank <= 5) {
              badge = "Chuyên Gia Logic 💡";
              title = "Cao Thủ Thuật Toán";
              frameType = "Tím Cosmic Violet";
              frameRingClass = "ring-2 ring-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]";
            }

            return {
              ...item,
              rank,
              badge,
              title,
              frameType,
              frameRingClass,
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
        console.error("Leaderboard error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboards();
  }, []);

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* ================= HERO HEADER ================= */}
      <div className="relative overflow-hidden rounded-3xl border border-[#7bd1fa]/25 bg-gradient-to-r from-[#0f1524] via-[#151c30] to-[#0a0e1a] p-6 md:p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-semibold">
                <Trophy className="w-3.5 h-3.5" /> Bảng Vinh Danh E-V-E Hall of Fame
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              Bảng Xếp Hạng Toàn Hệ Sinh Thái 🏆
            </h1>
            <p className="text-xs md:text-sm text-[#8e9bb4] max-w-2xl leading-relaxed">
              Vinh danh những học viên và giảng viên có thành tích xuất sắc nhất. Hover chuột vào từng thẻ để xem trang trí avatar và thông tin học tập chi tiết!
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0a0e1a] border border-[#7bd1fa]/20 self-start md:self-auto">
            <button
              onClick={() => setActiveTab("students")}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "students"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Crown className="w-4 h-4" /> Top Học Sinh
            </button>
            <button
              onClick={() => setActiveTab("teachers")}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "teachers"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <GraduationCap className="w-4 h-4" /> Top Giảng Viên
            </button>
          </div>
        </div>
      </div>

      {/* ================= TOP 3 PODIUM ================= */}
      {activeTab === "students" && students.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {/* #2 Silver */}
          <div className="order-2 md:order-1 relative rounded-3xl border border-cyan-400/40 bg-gradient-to-b from-[#151c30] to-[#0f1524] p-6 text-center shadow-xl space-y-4">
            <div className="w-8 h-8 mx-auto -mt-10 rounded-full bg-slate-300 text-slate-900 font-black font-mono flex items-center justify-center shadow-lg border-2 border-white text-sm">
              2
            </div>
            <div className={`w-20 h-20 mx-auto rounded-full bg-slate-800 p-1 flex items-center justify-center ${students[1].frameRingClass}`}>
              <div className="w-full h-full rounded-full bg-[#0a0e1a] flex items-center justify-center text-2xl font-bold text-cyan-300 font-mono">
                {students[1].name.charAt(0)}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">{students[1].name}</h3>
              <span className="text-[11px] font-bold text-cyan-300 block">{students[1].title}</span>
              <span className="text-xs font-mono font-bold text-amber-300">{students[1].score} EXP • {students[1].coins} 🪙</span>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-[#8e9bb4] flex justify-center gap-4">
              <span>🔥 {students[1].streakDays} Ngày</span>
              <span>🎮 {students[1].gamesWon} Game Thắng</span>
            </div>
          </div>

          {/* #1 Gold Champion */}
          <div className="order-1 md:order-2 relative rounded-3xl border-2 border-amber-400/70 bg-gradient-to-b from-amber-500/10 via-[#151c30] to-[#0f1524] p-7 text-center shadow-[0_0_35px_rgba(245,158,11,0.25)] space-y-4 md:-translate-y-4">
            <div className="w-10 h-10 mx-auto -mt-12 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 font-black font-mono flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.6)] border-2 border-white text-base">
              👑 1
            </div>
            <div className={`w-24 h-24 mx-auto rounded-full bg-slate-800 p-1 flex items-center justify-center ${students[0].frameRingClass}`}>
              <div className="w-full h-full rounded-full bg-[#0a0e1a] flex items-center justify-center text-3xl font-black text-amber-400 font-mono">
                {students[0].name.charAt(0)}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-white">{students[0].name}</h3>
              <span className="text-xs font-extrabold text-amber-400 block">{students[0].title}</span>
              <span className="text-sm font-mono font-extrabold text-amber-300">{students[0].score} EXP • {students[0].coins} 🪙</span>
            </div>
            <div className="pt-2 border-t border-amber-500/20 text-xs text-[#8e9bb4] flex justify-center gap-4 font-semibold">
              <span className="text-amber-300">🔥 {students[0].streakDays} Ngày Streak</span>
              <span className="text-cyan-300">🎮 {students[0].gamesWon} Trò Chơi Thắng</span>
            </div>
          </div>

          {/* #3 Bronze */}
          <div className="order-3 relative rounded-3xl border border-emerald-400/40 bg-gradient-to-b from-[#151c30] to-[#0f1524] p-6 text-center shadow-xl space-y-4">
            <div className="w-8 h-8 mx-auto -mt-10 rounded-full bg-amber-700 text-white font-black font-mono flex items-center justify-center shadow-lg border-2 border-white text-sm">
              3
            </div>
            <div className={`w-20 h-20 mx-auto rounded-full bg-slate-800 p-1 flex items-center justify-center ${students[2].frameRingClass}`}>
              <div className="w-full h-full rounded-full bg-[#0a0e1a] flex items-center justify-center text-2xl font-bold text-emerald-300 font-mono">
                {students[2].name.charAt(0)}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">{students[2].name}</h3>
              <span className="text-[11px] font-bold text-emerald-300 block">{students[2].title}</span>
              <span className="text-xs font-mono font-bold text-amber-300">{students[2].score} EXP • {students[2].coins} 🪙</span>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-[#8e9bb4] flex justify-center gap-4">
              <span>🔥 {students[2].streakDays} Ngày</span>
              <span>🎮 {students[2].gamesWon} Game Thắng</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= DETAILED RANKING LIST WITH RICH HOVER POPOVER ================= */}
      <div className="rounded-3xl border border-[#7bd1fa]/20 bg-[#0f1524]/80 p-6 backdrop-blur-xl shadow-2xl space-y-4">
        <h2 className="text-base font-extrabold text-white flex items-center gap-2 pb-3 border-b border-[#7bd1fa]/10">
          <Award className="w-5 h-5 text-cyan-400" />
          {activeTab === "students" ? "Danh Sách Xếp Hạng Học Sinh" : "Danh Sách Xếp Hạng Giảng Viên"}
        </h2>

        {activeTab === "students" ? (
          <div className="space-y-3">
            {students.map((st) => (
              <div
                key={st.id}
                className="group relative flex items-center justify-between p-4 rounded-2xl bg-[#151b2c] border border-[#7bd1fa]/15 hover:border-cyan-400/60 hover:bg-[#182138] transition-all duration-300 cursor-pointer"
              >
                {/* Left: Rank & Avatar */}
                <div className="flex items-center gap-4">
                  <span
                    className={`w-8 text-center font-black font-mono text-base ${
                      st.rank === 1
                        ? "text-amber-400"
                        : st.rank === 2
                        ? "text-slate-300"
                        : st.rank === 3
                        ? "text-amber-600"
                        : "text-slate-500"
                    }`}
                  >
                    #{st.rank}
                  </span>

                  <div className={`w-12 h-12 rounded-full bg-slate-800 p-0.5 flex items-center justify-center transition-transform group-hover:scale-110 ${st.frameRingClass}`}>
                    <div className="w-full h-full rounded-full bg-[#0a0e1a] flex items-center justify-center font-bold text-cyan-300 font-mono text-sm">
                      {st.name.charAt(0)}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {st.name}
                      </h4>
                      <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        {st.title}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#8e9bb4] flex items-center gap-3 mt-0.5 font-mono">
                      <span>🔥 {st.streakDays} Ngày Streak</span>
                      <span>🎮 {st.gamesWon} Games Thắng</span>
                    </span>
                  </div>
                </div>

                {/* Right: Score & Coins */}
                <div className="text-right space-y-0.5">
                  <span className="text-sm font-mono font-extrabold text-amber-300 block">{st.score} EXP</span>
                  <span className="text-xs font-mono font-bold text-[#8e9bb4] block">{st.coins} Coins 🪙</span>
                </div>

                {/* =========================================================
                    EXPANDED HOVER POPOVER TOOLTIP (Hiện rõ trang trí & học tập)
                ========================================================= */}
                <div className="pointer-events-none absolute left-1/2 -top-4 -translate-x-1/2 -translate-y-full w-80 opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 z-50 p-5 rounded-3xl bg-[#0a0e1a]/95 border-2 border-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.4)] backdrop-blur-2xl text-center space-y-3">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-slate-800 p-1 flex items-center justify-center ${st.frameRingClass}`}>
                    <div className="w-full h-full rounded-full bg-[#0a0e1a] flex items-center justify-center text-xl font-black text-cyan-400 font-mono">
                      {st.name.charAt(0)}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-base font-extrabold text-white">{st.name}</h5>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 inline-block mt-1">
                      {st.badge}
                    </span>
                    <p className="text-[11px] text-cyan-300 font-mono mt-0.5">Trang bị: {st.frameType}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-[#151b2c] border border-[#7bd1fa]/15 text-xs font-mono text-left">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Khóa Học:</span>
                      <strong className="text-white">{st.courses} Đang Theo</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Minigame Thắng:</span>
                      <strong className="text-cyan-300">{st.gamesWon} Trận</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Chuỗi Streak:</span>
                      <strong className="text-amber-400">🔥 {st.streakDays} Ngày</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Tổng Điểm:</span>
                      <strong className="text-amber-300">{st.score} EXP</strong>
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
                className="flex items-center justify-between p-4 rounded-2xl bg-[#151b2c] border border-[#7bd1fa]/15 hover:border-cyan-400/50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 text-center font-black font-mono text-base text-cyan-400">
                    #{t.rank}
                  </span>
                  <div className="w-12 h-12 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-300 font-mono">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.name}</h4>
                    <span className="text-[11px] text-[#8e9bb4] block">{t.title} • {t.courses} Khóa học đã xuất bản</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-mono font-bold text-amber-300 block">{t.playsCount} Lượt chơi Game</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">{t.badge}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
