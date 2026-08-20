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
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cacheService } from "@/lib/cacheService";
import { ProfileHoverCard } from "@/components/ProfileHoverCard";

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
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isCancelled = false;

    async function loadLeaderboards(force = false) {
      try {
        setLoading(true);

        // Hiển thị cache ngay lập tức nếu có (SWR), nhưng LUÔN tải lại từ DB để dữ liệu chính xác
        const cachedStudents = cacheService.get<StudentRank[]>("leaderboard_students");
        const cachedTeachers = cacheService.get<TeacherRank[]>("leaderboard_teachers");
        if (!force && cachedStudents) setStudents(cachedStudents.data);
        if (!force && cachedTeachers) setTeachers(cachedTeachers.data);

        // Lấy dữ liệu THẬT từ Firestore: người dùng, kết quả game, khóa học, tiến độ chặng
        const [userSnap, gameResSnap, coursesSnap, pathSnap] = await Promise.all([
          getDocs(collection(db, "users")),
          getDocs(collection(db, "game_results")),
          getDocs(collection(db, "courses")),
          getDocs(collection(db, "student_learning_path")),
        ]);

        const allUsers: any[] = userSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const gameResults: any[] = gameResSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const courses: any[] = coursesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const pathDocs: any[] = pathSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // Chặng đã hoàn thành (passed_courses) theo từng học viên từ student_learning_path
        const passedCoursesByUser = new Map<string, Set<string>>();
        pathDocs.forEach((p) => {
          const sid = p.student_id || p.studentId || p.user_id || p.userId;
          if (!sid) return;
          const arr = Array.isArray(p.passed_courses)
            ? p.passed_courses
            : Array.isArray(p.passedCourses)
              ? p.passedCourses
              : [];
          if (!passedCoursesByUser.has(sid)) passedCoursesByUser.set(sid, new Set());
          arr.forEach((c: string) => passedCoursesByUser.get(sid)!.add(c));
        });

        // Kết quả game THỰC TẾ theo từng học viên — CHỈ tính kết quả ĐẠT CHỈ TIÊU
        // (passed === true || isWin === true || result === "win")
        const resultsByUser = new Map<
          string,
          { score: number; wins: number; courses: Set<string> }
        >();
        gameResults.forEach((gr) => {
          const uid = gr.user_id || gr.userId || gr.uid;
          if (!uid || uid === "anonymous") return;
          const isPass = gr.passed === true || gr.isWin === true || gr.result === "win";
          if (!isPass) return;
          const crs = gr.course_id || gr.courseId || "";
          if (!resultsByUser.has(uid)) {
            resultsByUser.set(uid, { score: 0, wins: 0, courses: new Set<string>() });
          }
          const r = resultsByUser.get(uid)!;
          r.score += Number(gr.score) || 0;
          r.wins += 1;
          if (crs) r.courses.add(crs);
        });

        // Bảng xếp hạng HỌC VIÊN từ dữ liệu thật (KHÔNG còn số ảo)
        const studentRanks: StudentRank[] = [];
        allUsers
          .filter((u) => u.role === "student" || (!u.role && u.email))
          .forEach((u) => {
            const uid = u.id || u.uid;
            const stats = resultsByUser.get(uid);
            const passedCourses = passedCoursesByUser.get(uid);
            const passedCourseCount = passedCourses ? passedCourses.size : 0;
            const playedCourseCount = stats ? stats.courses.size : 0;
            studentRanks.push({
              rank: 1,
              id: uid,
              name: u.name || u.displayName || u.fullName || u.email || "Học viên E-V-E",
              score: stats ? stats.score : 0,
              coins: Number(u.coins) || 0,
              courses: Math.max(playedCourseCount, passedCourseCount),
              gamesWon: stats ? stats.wins : 0,
              streakDays: Number(u.streakDays) || Number(u.streak_days) || Number(u.currentStreak) || 0,
              badge: "",
              title: "",
            });
          });

        const sortedStudents: StudentRank[] = studentRanks
          .sort((a, b) => b.score - a.score || b.coins - a.coins)
          .map((item, idx) => {
            const rank = idx + 1;
            let badge = "Học Viên Tiềm Năng";
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

        if (isCancelled) return;
        setStudents(sortedStudents);
        cacheService.set("leaderboard_students", sortedStudents, 30000);

        // Bảng xếp hạng GIẢNG VIÊN từ dữ liệu thật:
        // - Số khóa học = số khóa học tác giả đã tạo
        // - Lượt tham gia = số kết quả game thực tế thuộc các khóa học của giảng viên đó
        const teacherUsers = allUsers.filter(
          (u) => u.role === "teacher" || u.role === "instructor"
        );

        const sortedTeachers: TeacherRank[] = teacherUsers
          .map((t, idx) => {
            const teacherId = t.id || t.uid;
            const teacherCourses = courses.filter(
              (c) => c.author_id === teacherId || c.authorId === teacherId || c.instructor_id === teacherId
            );
            const teacherCourseIds = new Set(teacherCourses.map((c) => c.id));
            const playsCount = gameResults.reduce((acc, gr) => {
              const crs = gr.course_id || gr.courseId || "";
              return teacherCourseIds.has(crs) ? acc + 1 : acc;
            }, 0);
            return {
              rank: idx + 1,
              id: teacherId,
              name: t.name || t.fullName || t.displayName || "ThS. Giảng Viên E-V-E",
              courses: teacherCourses.length,
              playsCount,
              badge: idx === 0 ? "Giảng Viên Xuất Sắc" : "Giảng Viên Sáng Tạo",
              title: t.specialty || "Thạc Sĩ Khoa Học Máy Tính & Game AI",
            };
          })
          .sort((a, b) => b.playsCount - a.playsCount)
          .map((t, idx) => ({ ...t, rank: idx + 1 }));

        if (isCancelled) return;
        setTeachers(sortedTeachers);
        cacheService.set("leaderboard_teachers", sortedTeachers, 30000);

        setLoading(false);
      } catch (err) {
        console.error("Error loading leaderboards:", err);
        if (!isCancelled) setLoading(false);
      }
    }

    loadLeaderboards();

    // Tự làm mới khi quay lại tab để BXH luôn phản ánh kết quả chơi mới nhất
    const onFocus = () => loadLeaderboards(true);
    window.addEventListener("focus", onFocus);

    return () => {
      isCancelled = true;
      window.removeEventListener("focus", onFocus);
    };
  }, [refreshKey]);

  return (
    <div className="space-y-8 font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b-2 border-zinc-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-200 bg-red-50 text-red-700 text-xs font-bold mb-2">
            <Trophy className="w-3.5 h-3.5 text-red-600" /> Bảng Vinh Danh & Xếp Hạng Toàn Hệ Thống
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">
            Bảng Xếp Hạng Học Tập & Sáng Tạo
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Ghi nhận nỗ lực học tập xuất sắc của học viên và đóng góp học liệu của giảng viên.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 self-start md:self-auto">
          {/* Tab Switcher */}
          <div className="inline-flex p-1 rounded-2xl bg-zinc-100 border border-zinc-200">
            <button
              onClick={() => setActiveTab("students")}
              className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "students"
                  ? "bg-white text-red-600 shadow-sm border border-zinc-200"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <Crown className="w-4 h-4" /> Xếp Hạng Học Viên ({students.length})
            </button>
            <button
              onClick={() => setActiveTab("teachers")}
              className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "teachers"
                  ? "bg-white text-red-600 shadow-sm border border-zinc-200"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <GraduationCap className="w-4 h-4" /> Giảng Viên Tiêu Biểu ({teachers.length})
            </button>
          </div>

          {/* Nút làm mới: tải lại dữ liệu THẬT từ DB ngay lập tức */}
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Làm Mới
          </button>
        </div>
      </div>

      {loading ? (
        <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-red-200 border-t-red-600 animate-spin" />
          <p className="text-sm font-bold text-red-600">Đang tổng hợp dữ liệu bảng xếp hạng thực tế...</p>
        </div>
      ) : activeTab === "students" ? (
        <div className="space-y-6">
          {/* Top 3 Podiums */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {students.slice(0, 3).map((st) => (
              <div
                key={st.id}
                className={`relative p-6 rounded-3xl bg-white border-2 shadow-sm flex flex-col items-center text-center transition-all hover:scale-[1.02] ${
                  st.rank === 1
                    ? "border-amber-400 bg-gradient-to-b from-amber-50/40 to-white order-first md:order-2 -translate-y-2"
                    : st.rank === 2
                    ? "border-zinc-300 order-2 md:order-1"
                    : "border-red-200 order-3"
                }`}
              >
                {/* Rank Badge */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black shadow-md mb-4 ${
                    st.rank === 1
                      ? "bg-amber-400 text-amber-950 ring-4 ring-amber-100"
                      : st.rank === 2
                      ? "bg-zinc-200 text-zinc-800 ring-4 ring-zinc-100"
                      : "bg-red-500 text-white ring-4 ring-red-100"
                  }`}
                >
                  #{st.rank}
                </div>

                <ProfileHoverCard
                  user={{
                    id: st.id,
                    name: st.name,
                    rank: st.rank,
                    score: st.score,
                    coins: st.coins,
                    title: st.title,
                    gamesWon: st.gamesWon,
                    streakDays: st.streakDays,
                  }}
                >
                  <h3 className="text-lg font-black text-zinc-900 hover:text-red-600 transition-colors">{st.name}</h3>
                </ProfileHoverCard>
                <span className="px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold mt-1.5 mb-4">
                  {st.badge}
                </span>

                <div className="w-full grid grid-cols-2 gap-2 pt-4 border-t border-zinc-100 text-left text-xs">
                  <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200">
                    <span className="text-zinc-500 block text-[10px] font-bold">TỔNG ĐIỂM</span>
                    <strong className="text-red-600 font-mono text-sm font-black">{st.score.toLocaleString()}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200">
                    <span className="text-zinc-500 block text-[10px] font-bold">E-V-E COINS</span>
                    <strong className="text-amber-600 font-mono text-sm font-black flex items-center gap-1">
                      <Coins className="w-3 h-3" /> {st.coins}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Full Students Table */}
          <div className="rounded-3xl bg-white border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="font-bold text-base text-zinc-900 flex items-center gap-2">
                <Crown className="w-4 h-4 text-red-600" /> Bảng Điểm Chi Tiết ({students.length} Học Viên)
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    <th className="py-3.5 px-6">Thứ Hạng</th>
                    <th className="py-3.5 px-6">Học Viên</th>
                    <th className="py-3.5 px-6">Danh Hiệu</th>
                    <th className="py-3.5 px-6 text-center">Game Đã Thắng</th>
                    <th className="py-3.5 px-6 text-center">Coins</th>
                    <th className="py-3.5 px-6 text-right">Tổng Điểm</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {students.map((st) => (
                    <tr key={st.id} className="hover:bg-zinc-50 transition-colors group/row">
                      <td className="py-4 px-6 font-mono font-bold text-zinc-700">
                        <ProfileHoverCard
                          user={{
                            id: st.id,
                            name: st.name,
                            rank: st.rank,
                            score: st.score,
                            coins: st.coins,
                            title: st.title,
                            gamesWon: st.gamesWon,
                            streakDays: st.streakDays,
                          }}
                          className="w-full block"
                        >
                          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black ${
                            st.rank === 1
                              ? "bg-amber-100 text-amber-900 border border-amber-300"
                              : st.rank === 2
                              ? "bg-zinc-100 text-zinc-800 border border-zinc-300"
                              : st.rank === 3
                              ? "bg-red-100 text-red-800 border border-red-200"
                              : "text-zinc-600"
                          }`}>
                            #{st.rank}
                          </span>
                        </ProfileHoverCard>
                      </td>
                      <td className="py-4 px-6 font-bold text-zinc-900">
                        <ProfileHoverCard
                          user={{
                            id: st.id,
                            name: st.name,
                            rank: st.rank,
                            score: st.score,
                            coins: st.coins,
                            title: st.title,
                            gamesWon: st.gamesWon,
                            streakDays: st.streakDays,
                          }}
                          className="w-full block"
                        >
                          <span className="cursor-pointer group-hover/row:text-red-600 transition-colors">
                            {st.name}
                          </span>
                        </ProfileHoverCard>
                      </td>
                      <td className="py-4 px-6">
                        <ProfileHoverCard
                          user={{
                            id: st.id,
                            name: st.name,
                            rank: st.rank,
                            score: st.score,
                            coins: st.coins,
                            title: st.title,
                            gamesWon: st.gamesWon,
                            streakDays: st.streakDays,
                          }}
                          className="w-full block"
                        >
                          <span className="text-xs text-zinc-600 font-medium px-2.5 py-1 rounded-md bg-zinc-100 border border-zinc-200">
                            {st.title}
                          </span>
                        </ProfileHoverCard>
                      </td>
                      <td className="py-4 px-6 text-center font-mono font-bold text-zinc-700">
                        <ProfileHoverCard
                          user={{
                            id: st.id,
                            name: st.name,
                            rank: st.rank,
                            score: st.score,
                            coins: st.coins,
                            title: st.title,
                            gamesWon: st.gamesWon,
                            streakDays: st.streakDays,
                          }}
                          className="w-full block"
                        >
                          <span>{st.gamesWon}</span>
                        </ProfileHoverCard>
                      </td>
                      <td className="py-4 px-6 text-center font-mono font-bold text-amber-600">
                        <ProfileHoverCard
                          user={{
                            id: st.id,
                            name: st.name,
                            rank: st.rank,
                            score: st.score,
                            coins: st.coins,
                            title: st.title,
                            gamesWon: st.gamesWon,
                            streakDays: st.streakDays,
                          }}
                          className="w-full block"
                        >
                          <span>{st.coins}</span>
                        </ProfileHoverCard>
                      </td>
                      <td className="py-4 px-6 text-right font-mono font-black text-red-600 text-base">
                        <ProfileHoverCard
                          user={{
                            id: st.id,
                            name: st.name,
                            rank: st.rank,
                            score: st.score,
                            coins: st.coins,
                            title: st.title,
                            gamesWon: st.gamesWon,
                            streakDays: st.streakDays,
                          }}
                          className="w-full block"
                        >
                          <span>{st.score.toLocaleString()}</span>
                        </ProfileHoverCard>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Teacher Rankings */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((tc) => (
            <div
              key={tc.id}
              className="p-6 rounded-3xl bg-white border border-zinc-200 hover:border-red-600 transition-colors shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-red-50 text-red-700 border border-red-200 flex items-center justify-center font-mono font-black text-xs">
                  #{tc.rank}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 text-xs font-bold border border-zinc-200">
                  {tc.badge}
                </span>
              </div>

              <div>
                <ProfileHoverCard
                  user={{
                    id: tc.id,
                    name: tc.name,
                    rank: tc.rank,
                    role: "teacher",
                    title: tc.title,
                    score: tc.playsCount,
                  }}
                >
                  <h3 className="font-black text-lg text-zinc-900 cursor-pointer hover:text-red-600 transition-colors">
                    {tc.name}
                  </h3>
                </ProfileHoverCard>
                <p className="text-xs text-zinc-500 mt-0.5">{tc.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-100 text-xs">
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-zinc-500 block text-[10px] font-bold">BÀI GIẢNG / KHÓA HỌC</span>
                  <strong className="text-zinc-900 font-mono text-base font-black flex items-center gap-1.5 mt-0.5">
                    <BookOpen className="w-4 h-4 text-red-600" /> {tc.courses} Khóa
                  </strong>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-zinc-500 block text-[10px] font-bold">LƯỢT THAM GIA HỌC</span>
                  <strong className="text-zinc-900 font-mono text-base font-black flex items-center gap-1.5 mt-0.5">
                    <Gamepad2 className="w-4 h-4 text-red-600" /> {tc.playsCount} Lượt
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
