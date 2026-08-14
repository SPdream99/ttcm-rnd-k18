"use client";

import React, { useState, useEffect } from "react";
import {
  Trophy,
  Crown,
  GraduationCap,
  Sparkles,
  Award,
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
  badge: string;
}

interface TeacherRank {
  rank: number;
  id: string;
  name: string;
  courses: number;
  playsCount: number;
  badge: string;
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
        // 1. Fetch real users from Firestore
        const userSnap = await getDocs(collection(db, "users"));
        const allUsers: any[] = userSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // 2. Fetch real game results
        const gameResSnap = await getDocs(collection(db, "game_results"));
        const gameResults: any[] = gameResSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // 3. Fetch courses
        const coursesSnap = await getDocs(collection(db, "courses"));
        const allCourses: any[] = coursesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // Calculate student rankings
        const studentMap = new Map<string, { name: string; score: number; coins: number; courses: number }>();

        allUsers
          .filter((u) => u.role === "student" || (!u.role && u.email))
          .forEach((u) => {
            const uid = u.uid || u.id;
            studentMap.set(uid, {
              name: u.displayName || u.fullName || u.name || "Học viên E-V-E",
              score: Number(u.score) || 0,
              coins: Number(u.coins) || 0,
              courses: 0,
            });
          });

        // Add scores from game results
        gameResults.forEach((gr) => {
          const uid = gr.uid || gr.userId;
          if (uid && studentMap.has(uid)) {
            const st = studentMap.get(uid)!;
            st.score += Number(gr.score) || Number(gr.result) || 0;
            st.coins += Number(gr.reward) || 0;
          }
        });

        const sortedStudents: StudentRank[] = Array.from(studentMap.entries())
          .map(([id, data]) => ({
            id,
            name: data.name,
            score: data.score,
            coins: data.coins,
            courses: data.courses,
            badge: data.score > 1000 ? "Thủ Khoa Xuất Sắc 👑" : data.score > 500 ? "Chuyên Gia Logic 💡" : "Học Viên Tiềm Năng ⭐",
            rank: 1,
          }))
          .sort((a, b) => b.score - a.score || b.coins - a.coins)
          .map((item, idx) => ({ ...item, rank: idx + 1 }));

        setStudents(sortedStudents);

        // Calculate teacher rankings
        const teacherUsers = allUsers.filter(
          (u) => u.role === "teacher" || u.role === "instructor"
        );

        const sortedTeachers: TeacherRank[] = teacherUsers
          .map((tc) => {
            const teacherId = tc.uid || tc.id;
            const myCourses = allCourses.filter(
              (c) =>
                c.authorId === teacherId ||
                c.author_id === teacherId ||
                c.instructorId === teacherId ||
                c.uploaderId === teacherId ||
                c.author === tc.name ||
                c.author === tc.fullName
            );

            return {
              id: teacherId,
              name: tc.displayName || tc.fullName || tc.name || "Giảng Viên",
              courses: myCourses.length,
              playsCount: myCourses.reduce((sum, c) => sum + (Number(c.views) || Number(c.playsCount) || 0), 0),
              badge: myCourses.length >= 5 ? "Giảng Viên Tiêu Biểu Tháng 🌟" : "Giảng Viên Sáng Tạo 🚀",
              rank: 1,
            };
          })
          .sort((a, b) => b.courses - a.courses || b.playsCount - a.playsCount)
          .map((item, idx) => ({ ...item, rank: idx + 1 }));

        setTeachers(sortedTeachers);
      } catch (err) {
        console.warn("Lỗi tải bảng xếp hạng:", err);
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboards();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/15">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Trophy className="w-7 h-7 text-amber-400" /> Bảng Vinh Danh & Xếp Hạng E-V-E
          </h1>
          <p className="text-sm text-[#8e9bb4] mt-1">
            Tôn vinh các học viên đạt thành tích xuất sắc và các thầy cô giảng viên tích cực nhất trên hệ thống.
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
              : "bg-[#151b2c] text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          <Crown className="w-4 h-4 text-amber-400" /> Học Viên Nổi Bật ({students.length})
        </button>

        <button
          onClick={() => setActiveTab("teachers")}
          className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
            activeTab === "teachers"
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
              : "bg-[#151b2c] text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          <GraduationCap className="w-4 h-4 text-emerald-400" /> Giáo Viên Tiêu Biểu ({teachers.length})
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
                {activeTab === "teachers" ? "Số Bài Giảng & Khóa Học" : "Tổng Điểm Tích Lũy"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-slate-400">
                  <div className="flex items-center justify-center gap-2 font-sans">
                    <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    <span>Đang cập nhật bảng xếp hạng thực tế...</span>
                  </div>
                </td>
              </tr>
            ) : activeTab === "students" ? (
              students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-slate-500 font-sans">
                    Chưa có dữ liệu học viên tham gia thi đấu. Hãy là người đầu tiên hoàn thành thử thách!
                  </td>
                </tr>
              ) : (
                students.map((st) => (
                  <tr key={st.id} className="hover:bg-white/[0.02] transition-colors">
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
                ))
              )
            ) : teachers.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-slate-500 font-sans">
                  Chưa có dữ liệu giảng viên xuất bản khóa học.
                </td>
              </tr>
            ) : (
              teachers.map((tc) => (
                <tr key={tc.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <span className="w-7 h-7 rounded-full bg-emerald-500 text-black font-bold flex items-center justify-center">
                      {tc.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-white text-sm font-sans">{tc.name}</div>
                    <div className="text-[11px] text-slate-400">{tc.courses} Khóa học & Lộ trình thực tế</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px]">
                      {tc.badge}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-base font-bold text-emerald-300 font-mono">{tc.courses} khóa học</div>
                    <div className="text-[11px] text-slate-400">{tc.playsCount} lượt học</div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
