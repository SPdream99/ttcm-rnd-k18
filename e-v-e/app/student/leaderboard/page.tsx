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
  Medal,
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
              frameRingClass: "",
              rank: 1,
            };
          })
          .sort((a, b) => b.score - a.score || b.coins - a.coins)
          .map((item, idx) => {
            const rank = idx + 1;
            let badge = "Học Viên Tiềm Năng ⭐";
            let title = "Thành Viên Năng Động";
            let frameRingClass = "ring-2 ring-slate-700";

            if (rank === 1) {
              badge = "🥇 Thủ Khoa Xuất Sắc";
              title = "Bậc Thầy Lập Trình";
              frameRingClass = "ring-4 ring-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)]";
            } else if (rank === 2) {
              badge = "🥈 Á Khoa Toàn Diện";
              title = "Chuyên Gia Thuật Toán";
              frameRingClass = "ring-4 ring-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)]";
            } else if (rank === 3) {
              badge = "🥉 Top 3 Bứt Phá";
              title = "Nhà Khám Phá Kiến Thức";
              frameRingClass = "ring-4 ring-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]";
            } else if (rank <= 5) {
              badge = "Chuyên Gia Logic 💡";
              title = "Học Viên Ưu Tú";
              frameRingClass = "ring-2 ring-purple-400";
            }

            return {
              ...item,
              rank,
              badge,
              title,
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
                { rank: 1, id: "t1", name: "ThS. Nguyễn Nhật Anh", courses: 4, playsCount: 520, badge: "🥇 Giảng Viên Xuất Sắc", title: "Trưởng Bộ Môn Công Nghệ" },
                { rank: 2, id: "t2", name: "ThS. Nguyễn Thành Đạt", courses: 3, playsCount: 410, badge: "🥈 Giảng Viên Sáng Tạo", title: "Chuyên Gia Đồ Họa & Game" },
                { rank: 3, id: "t3", name: "ThS. Đàm Tuấn Nhiên", courses: 2, playsCount: 280, badge: "🥉 Giảng Viên Tận Tâm", title: "Cố Vấn Học Thuật" },
              ]
        ).sort((a, b) => b.playsCount - a.playsCount);

        setTeachers(sortedTeachers);
      } catch (err) {
        console.error("Lỗi khi tải bảng xếp hạng:", err);
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboards();
  }, []);

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* ================= HERO HEADER ================= */}
      <div className="rounded-3xl border border-slate-800 bg-[#0f1422] p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
                <Trophy className="w-3.5 h-3.5" /> Bảng Vinh Danh Thành Tích
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              Bảng Xếp Hạng Toàn Trường 🏆
            </h1>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              Vinh danh những học viên và giảng viên có thành tích học tập và đóng góp xuất sắc nhất. Rê chuột vào từng thành viên để xem thẻ hồ sơ chi tiết.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#151c2e] border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => setActiveTab("students")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "students"
                  ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Crown className="w-4 h-4" /> Top Học Sinh
            </button>
            <button
              onClick={() => setActiveTab("teachers")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "teachers"
                  ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <GraduationCap className="w-4 h-4" /> Top Giảng Viên
            </button>
          </div>
        </div>
      </div>

      {/* ================= BỤC TOP 3 ================= */}
      {activeTab === "students" && students.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* #2 Á Khoa */}
          <div className="order-2 md:order-1 rounded-3xl border border-slate-800 bg-[#0f1422] p-6 text-center shadow-lg space-y-4 hover:border-cyan-500/40 transition-all">
            <div className="w-8 h-8 mx-auto -mt-10 rounded-full bg-slate-300 text-slate-900 font-bold flex items-center justify-center shadow-md text-sm border-2 border-white">
              2
            </div>
            <div className={`w-20 h-20 mx-auto rounded-full bg-slate-800 p-1 flex items-center justify-center ${students[1].frameRingClass}`}>
              <div className="w-full h-full rounded-full bg-[#151c2e] flex items-center justify-center text-2xl font-bold text-cyan-300 font-mono">
                {students[1].name.charAt(0)}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">{students[1].name}</h3>
              <span className="text-xs text-cyan-300 block font-medium">{students[1].title}</span>
              <span className="text-xs font-mono font-bold text-amber-300">{students[1].score} EXP • {students[1].coins} Coins</span>
            </div>
            <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex justify-center gap-4">
              <span>🔥 {students[1].streakDays} Ngày</span>
              <span>🎮 {students[1].gamesWon} Game Thắng</span>
            </div>
          </div>

          {/* #1 Thủ Khoa */}
          <div className="order-1 md:order-2 rounded-3xl border border-amber-500/40 bg-gradient-to-b from-amber-500/10 via-[#0f1422] to-[#0f1422] p-7 text-center shadow-xl space-y-4 md:-translate-y-3">
            <div className="w-9 h-9 mx-auto -mt-11 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 font-bold flex items-center justify-center shadow-lg text-sm border-2 border-white">
              👑 1
            </div>
            <div className={`w-24 h-24 mx-auto rounded-full bg-slate-800 p-1 flex items-center justify-center ${students[0].frameRingClass}`}>
              <div className="w-full h-full rounded-full bg-[#151c2e] flex items-center justify-center text-3xl font-extrabold text-amber-400 font-mono">
                {students[0].name.charAt(0)}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-white">{students[0].name}</h3>
              <span className="text-xs font-bold text-amber-400 block">{students[0].title}</span>
              <span className="text-sm font-mono font-bold text-amber-300">{students[0].score} EXP • {students[0].coins} Coins</span>
            </div>
            <div className="pt-3 border-t border-amber-500/20 text-xs text-slate-300 flex justify-center gap-5 font-semibold">
              <span className="text-amber-300">🔥 {students[0].streakDays} Ngày Streak</span>
              <span className="text-cyan-300">🎮 {students[0].gamesWon} Game Thắng</span>
            </div>
          </div>

          {/* #3 Khám Phá */}
          <div className="order-3 rounded-3xl border border-slate-800 bg-[#0f1422] p-6 text-center shadow-lg space-y-4 hover:border-emerald-500/40 transition-all">
            <div className="w-8 h-8 mx-auto -mt-10 rounded-full bg-amber-700 text-white font-bold flex items-center justify-center shadow-md text-sm border-2 border-white">
              3
            </div>
            <div className={`w-20 h-20 mx-auto rounded-full bg-slate-800 p-1 flex items-center justify-center ${students[2].frameRingClass}`}>
              <div className="w-full h-full rounded-full bg-[#151c2e] flex items-center justify-center text-2xl font-bold text-emerald-300 font-mono">
                {students[2].name.charAt(0)}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">{students[2].name}</h3>
              <span className="text-xs text-emerald-300 block font-medium">{students[2].title}</span>
              <span className="text-xs font-mono font-bold text-amber-300">{students[2].score} EXP • {students[2].coins} Coins</span>
            </div>
            <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex justify-center gap-4">
              <span>🔥 {students[2].streakDays} Ngày</span>
              <span>🎮 {students[2].gamesWon} Game Thắng</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= BẢNG DANH SÁCH CHI TIẾT ================= */}
      <div className="rounded-3xl border border-slate-800 bg-[#0f1422] p-6 md:p-8 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
          <Award className="w-5 h-5 text-cyan-400" />
          {activeTab === "students" ? "Danh Sách Học Viên Xếp Hạng" : "Danh Sách Giảng Viên Tiêu Biểu"}
        </h2>

        {activeTab === "students" ? (
          <div className="space-y-3">
            {students.map((st) => (
              <div
                key={st.id}
                className="group relative flex items-center justify-between p-4 rounded-2xl bg-[#151c2e] border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-200 cursor-pointer"
              >
                {/* Trái: Thông tin cơ bản */}
                <div className="flex items-center gap-4">
                  <span
                    className={`w-8 text-center font-bold font-mono text-base ${
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

                  <div className={`w-12 h-12 rounded-full bg-slate-800 p-0.5 flex items-center justify-center transition-transform group-hover:scale-105 ${st.frameRingClass}`}>
                    <div className="w-full h-full rounded-full bg-[#0f1422] flex items-center justify-center font-bold text-cyan-300 font-mono text-sm">
                      {st.name.charAt(0)}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {st.name}
                      </h4>
                      <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        {st.title}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 flex items-center gap-4 mt-0.5">
                      <span>🔥 {st.streakDays} Ngày Streak</span>
                      <span>🎮 {st.gamesWon} Game Thắng</span>
                    </span>
                  </div>
                </div>

                {/* Phải: Điểm số */}
                <div className="text-right">
                  <span className="text-sm font-mono font-bold text-amber-300 block">{st.score} EXP</span>
                  <span className="text-xs font-mono text-slate-400 block">{st.coins} Coins</span>
                </div>

                {/* ================= THẺ HOVER PROFILE CHI TIẾT ================= */}
                <div className="pointer-events-none absolute left-1/2 -top-4 -translate-x-1/2 -translate-y-full w-80 opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50 p-5 rounded-2xl bg-[#0f1422]/95 border border-cyan-500/40 shadow-2xl backdrop-blur-xl text-center space-y-3">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-slate-800 p-1 flex items-center justify-center ${st.frameRingClass}`}>
                    <div className="w-full h-full rounded-full bg-[#151c2e] flex items-center justify-center text-xl font-bold text-cyan-400 font-mono">
                      {st.name.charAt(0)}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-base font-bold text-white">{st.name}</h5>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 inline-block mt-1">
                      {st.badge}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#151c2e] border border-slate-800 text-xs text-left">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Khóa Học:</span>
                      <strong className="text-white">{st.courses} Đang Học</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Minigame Thắng:</span>
                      <strong className="text-cyan-300">{st.gamesWon} Trận</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Chuỗi Streak:</span>
                      <strong className="text-amber-400">🔥 {st.streakDays} Ngày</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Tổng Điểm:</span>
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
                className="flex items-center justify-between p-4 rounded-2xl bg-[#151c2e] border border-slate-800 hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 text-center font-bold font-mono text-base text-cyan-400">
                    #{t.rank}
                  </span>
                  <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center font-bold text-cyan-300 font-mono">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.name}</h4>
                    <span className="text-xs text-slate-400 block">{t.title} • {t.courses} Khóa học đã xuất bản</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-mono font-bold text-amber-300 block">{t.playsCount} Lượt Chơi</span>
                  <span className="text-[11px] text-emerald-400 font-semibold">{t.badge}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
