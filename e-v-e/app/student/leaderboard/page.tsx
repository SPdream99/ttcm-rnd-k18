"use client";

import React, { useState, useEffect } from "react";
import {
  Trophy,
  Crown,
  GraduationCap,
  Award,
  Flame,
  Gamepad2,
  BookOpen,
  Coins,
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
              rank: 1,
            };
          })
          .sort((a, b) => b.score - a.score || b.coins - a.coins)
          .map((item, idx) => {
            const rank = idx + 1;
            let badge = "Học Viên Tiềm Năng ⭐";
            let title = "Thành Viên Năng Động";

            if (rank === 1) {
              badge = "Thủ Khoa Xuất Sắc";
              title = "Bậc Thầy Lập Trình";
            } else if (rank === 2) {
              badge = "Á Khoa Toàn Diện";
              title = "Chuyên Gia Thuật Toán";
            } else if (rank === 3) {
              badge = "Top 3 Bứt Phá";
              title = "Nhà Khám Phá Kiến Thức";
            } else if (rank <= 5) {
              badge = "Chuyên Gia Logic";
              title = "Học Viên Ưu Tú";
            }

            return {
              ...item,
              rank,
              badge,
              title,
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
                badge: "Giảng Viên Ưu Tú",
                title: "Thạc Sĩ Khoa Học Máy Tính",
              }))
            : [
                { rank: 1, id: "t1", name: "ThS. Nguyễn Nhật Anh", courses: 4, playsCount: 520, badge: "Giảng Viên Xuất Sắc", title: "Trưởng Bộ Môn Công Nghệ" },
                { rank: 2, id: "t2", name: "ThS. Nguyễn Thành Đạt", courses: 3, playsCount: 410, badge: "Giảng Viên Sáng Tạo", title: "Chuyên Gia Đồ Họa & Game" },
                { rank: 3, id: "t3", name: "ThS. Đàm Tuấn Nhiên", courses: 2, playsCount: 280, badge: "Giảng Viên Tận Tâm", title: "Cố Vấn Học Thuật" },
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
      <div className="rounded-2xl border-2 border-red-600 bg-white p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold">
                <Trophy className="w-3.5 h-3.5" /> Bảng Vinh Danh Thành Tích
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">
              Bảng Xếp Hạng Toàn Trường 🏆
            </h1>
            <p className="text-xs md:text-sm text-zinc-600 leading-relaxed">
              Vinh danh những học viên và giảng viên có thành tích học tập và đóng góp xuất sắc nhất.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-zinc-100 border border-zinc-200 self-start md:self-auto">
            <button
              onClick={() => setActiveTab("students")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === "students"
                  ? "bg-red-600 text-white"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <Crown className="w-4 h-4" /> Top Học Sinh
            </button>
            <button
              onClick={() => setActiveTab("teachers")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === "teachers"
                  ? "bg-red-600 text-white"
                  : "text-zinc-600 hover:text-zinc-900"
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
          <div className="order-2 md:order-1 rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-sm space-y-4 hover:border-red-600 transition-all">
            <div className="w-8 h-8 mx-auto -mt-10 rounded-full bg-zinc-800 text-white font-bold flex items-center justify-center text-sm">
              2
            </div>
            <div className="w-20 h-20 mx-auto rounded-full bg-zinc-100 border-2 border-zinc-300 p-1 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-zinc-200 flex items-center justify-center text-2xl font-bold text-zinc-800 font-mono">
                {students[1].name.charAt(0)}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-zinc-900">{students[1].name}</h3>
              <span className="text-xs text-red-600 block font-bold">{students[1].title}</span>
              <span className="text-xs font-mono font-bold text-zinc-700">{students[1].score} EXP • {students[1].coins} Coins</span>
            </div>
            <div className="pt-3 border-t border-zinc-100 text-xs text-zinc-500 flex justify-center gap-4 font-medium">
              <span>🔥 {students[1].streakDays} Ngày</span>
              <span>🎮 {students[1].gamesWon} Game Thắng</span>
            </div>
          </div>

          {/* #1 Thủ Khoa (Solid Red Focus) */}
          <div className="order-1 md:order-2 rounded-2xl border-2 border-red-600 bg-red-50/40 p-7 text-center shadow-md space-y-4 md:-translate-y-2">
            <div className="w-9 h-9 mx-auto -mt-11 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              👑 1
            </div>
            <div className="w-24 h-24 mx-auto rounded-full bg-white border-4 border-red-600 p-1 flex items-center justify-center shadow-sm">
              <div className="w-full h-full rounded-full bg-red-600 flex items-center justify-center text-3xl font-extrabold text-white font-mono">
                {students[0].name.charAt(0)}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-zinc-900">{students[0].name}</h3>
              <span className="text-xs font-bold text-red-600 block">{students[0].title}</span>
              <span className="text-sm font-mono font-bold text-red-700">{students[0].score} EXP • {students[0].coins} Coins</span>
            </div>
            <div className="pt-3 border-t border-red-200 text-xs text-zinc-700 flex justify-center gap-5 font-bold">
              <span className="text-red-600">🔥 {students[0].streakDays} Ngày Streak</span>
              <span>🎮 {students[0].gamesWon} Game Thắng</span>
            </div>
          </div>

          {/* #3 Khám Phá */}
          <div className="order-3 rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-sm space-y-4 hover:border-red-600 transition-all">
            <div className="w-8 h-8 mx-auto -mt-10 rounded-full bg-zinc-600 text-white font-bold flex items-center justify-center text-sm">
              3
            </div>
            <div className="w-20 h-20 mx-auto rounded-full bg-zinc-100 border-2 border-zinc-300 p-1 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-zinc-200 flex items-center justify-center text-2xl font-bold text-zinc-800 font-mono">
                {students[2].name.charAt(0)}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-zinc-900">{students[2].name}</h3>
              <span className="text-xs text-red-600 block font-bold">{students[2].title}</span>
              <span className="text-xs font-mono font-bold text-zinc-700">{students[2].score} EXP • {students[2].coins} Coins</span>
            </div>
            <div className="pt-3 border-t border-zinc-100 text-xs text-zinc-500 flex justify-center gap-4 font-medium">
              <span>🔥 {students[2].streakDays} Ngày</span>
              <span>🎮 {students[2].gamesWon} Game Thắng</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= BẢNG DANH SÁCH CHI TIẾT ================= */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 md:p-8 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2 pb-3 border-b border-zinc-200">
          <Award className="w-5 h-5 text-red-600" />
          {activeTab === "students" ? "Danh Sách Học Viên Xếp Hạng" : "Danh Sách Giảng Viên Tiêu Biểu"}
        </h2>

        {activeTab === "students" ? (
          <div className="space-y-3">
            {students.map((st) => (
              <div
                key={st.id}
                className="group relative flex items-center justify-between p-4 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-red-600 transition-all duration-200 cursor-pointer"
              >
                {/* Trái: Thông tin cơ bản */}
                <div className="flex items-center gap-4">
                  <span
                    className={`w-8 text-center font-bold font-mono text-base ${
                      st.rank === 1 ? "text-red-600" : "text-zinc-600"
                    }`}
                  >
                    #{st.rank}
                  </span>

                  <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm ${
                    st.rank === 1 ? "bg-red-600 text-white" : "bg-zinc-200 text-zinc-700"
                  }`}>
                    {st.name.charAt(0)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-zinc-900 group-hover:text-red-600 transition-colors">
                        {st.name}
                      </h4>
                      <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                        {st.title}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-500 flex items-center gap-4 mt-0.5">
                      <span>🔥 {st.streakDays} Ngày Streak</span>
                      <span>🎮 {st.gamesWon} Game Thắng</span>
                    </span>
                  </div>
                </div>

                {/* Phải: Điểm số */}
                <div className="text-right">
                  <span className="text-sm font-mono font-bold text-red-600 block">{st.score} EXP</span>
                  <span className="text-xs font-mono text-zinc-500 block">{st.coins} Coins</span>
                </div>

                {/* Hover Profile Thẻ Nổi (Đỏ & Trắng) */}
                <div className="pointer-events-none absolute left-1/2 -top-4 -translate-x-1/2 -translate-y-full w-80 opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50 p-5 rounded-2xl bg-white border-2 border-red-600 shadow-xl text-center space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-full bg-red-600 flex items-center justify-center text-xl font-bold text-white font-mono">
                    {st.name.charAt(0)}
                  </div>

                  <div>
                    <h5 className="text-base font-bold text-zinc-900">{st.name}</h5>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-700 inline-block mt-1">
                      {st.badge}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-left">
                    <div>
                      <span className="text-zinc-500 text-[10px] block">Khóa Học:</span>
                      <strong className="text-zinc-900">{st.courses} Đang Học</strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[10px] block">Minigame Thắng:</span>
                      <strong className="text-red-600">{st.gamesWon} Trận</strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[10px] block">Chuỗi Streak:</span>
                      <strong className="text-red-600">🔥 {st.streakDays} Ngày</strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[10px] block">Tổng Điểm:</span>
                      <strong className="text-red-600">{st.score} EXP</strong>
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
                className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-red-600 transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 text-center font-bold font-mono text-base text-red-600">
                    #{t.rank}
                  </span>
                  <div className="w-11 h-11 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold font-mono">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">{t.name}</h4>
                    <span className="text-xs text-zinc-500 block">{t.title} • {t.courses} Khóa học đã xuất bản</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-mono font-bold text-red-600 block">{t.playsCount} Lượt Chơi</span>
                  <span className="text-[11px] text-zinc-600 font-bold">{t.badge}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
