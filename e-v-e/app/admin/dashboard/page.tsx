"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  GraduationCap,
  BookOpen,
  Gamepad2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Download,
  FolderCheck,
  UserCheck,
  Check,
  RefreshCw,
  X,
  HelpCircle,
} from "lucide-react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ConfirmModalData {
  title: string;
  description: string;
  confirmText?: string;
  variant?: "emerald" | "rose" | "purple" | "cyan";
  onConfirm: () => void;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    studentsCount: 0,
    teachersCount: 0,
    pendingTeachersCount: 0,
    coursesCount: 0,
    pendingCoursesCount: 0,
    gamesCount: 0,
    pendingGamesCount: 0,
  });

  const [pendingTeachers, setPendingTeachers] = useState<any[]>([]);
  const [pendingGames, setPendingGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // ── Confirmation Prompt State ──
  const [confirmPrompt, setConfirmPrompt] = useState<ConfirmModalData | null>(null);

  const loadStats = async () => {
    try {
      // 1. Fetch from Firestore
      let usersList: any[] = [];
      try {
        const usersSnap = await getDocs(collection(db, "users"));
        if (!usersSnap.empty) {
          usersList = usersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        }
      } catch (err) {
        console.warn("Firestore users fetch warning:", err);
      }

      // 2. Merge with LocalStorage registered users & current sessions
      try {
        if (typeof window !== "undefined") {
          const localUsers = JSON.parse(localStorage.getItem("eve_registered_users") || "[]");
          localUsers.forEach((lu: any) => {
            const existingIdx = usersList.findIndex(
              (u: any) => u.email === lu.email || (lu.uid && u.uid === lu.uid) || (lu.id && u.id === lu.id)
            );
            if (existingIdx === -1) {
              usersList.push(lu);
            } else {
              usersList[existingIdx] = { ...usersList[existingIdx], ...lu };
            }
          });

          const sessionUser = JSON.parse(localStorage.getItem("eve_user") || "null");
          if (sessionUser && (sessionUser.role === "teacher" || sessionUser.role === "instructor")) {
            if (!usersList.some((u: any) => u.email === sessionUser.email)) {
              usersList.push(sessionUser);
            }
          }
        }
      } catch {}

      const isTeacher = (u: any) => {
        const r = (u.role || "").toLowerCase();
        return r === "teacher" || r === "instructor";
      };

      const isPending = (u: any) => {
        const s = (u.status || "").toLowerCase();
        return s === "pending" || s === "pending_approval" || !s;
      };

      const students = usersList.filter((u: any) => (u.role || "").toLowerCase() === "student");
      const teachers = usersList.filter(isTeacher);
      const pendingTeachersList = teachers.filter(isPending);

      // Courses
      let coursesList: any[] = [];
      try {
        const coursesSnap = await getDocs(collection(db, "courses"));
        if (!coursesSnap.empty) {
          coursesList = coursesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        }
      } catch {}

      const pendingCourses = coursesList.filter(
        (c: any) => !c.is_accepted && !c.isAccepted
      );

      // Games
      let gamesList: any[] = [];
      try {
        const gamesSnap = await getDocs(collection(db, "game_info"));
        if (!gamesSnap.empty) {
          gamesList = gamesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        }
      } catch {}

      try {
        if (typeof window !== "undefined") {
          const localGames = JSON.parse(localStorage.getItem("eve_uploaded_games") || "[]");
          localGames.forEach((lg: any) => {
            const idx = gamesList.findIndex((g: any) => g.id === lg.id || g.title === lg.title);
            if (idx === -1) {
              gamesList.unshift(lg);
            } else {
              gamesList[idx] = { ...gamesList[idx], ...lg };
            }
          });
        }
      } catch {}

      const pendingGamesList = gamesList.filter(
        (g: any) => !g.is_accepted && !g.isAccepted
      );

      setStats({
        totalUsers: usersList.length,
        studentsCount: students.length,
        teachersCount: teachers.length,
        pendingTeachersCount: pendingTeachersList.length,
        coursesCount: coursesList.length,
        pendingCoursesCount: pendingCourses.length,
        gamesCount: gamesList.length,
        pendingGamesCount: pendingGamesList.length,
      });

      setPendingTeachers(pendingTeachersList);
      setPendingGames(pendingGamesList);
    } catch (e) {
      console.warn("Could not fetch real-time admin stats:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();

    if (typeof window !== "undefined") {
      window.addEventListener("eve_games_updated", loadStats);
      window.addEventListener("storage", loadStats);
      return () => {
        window.removeEventListener("eve_games_updated", loadStats);
        window.removeEventListener("storage", loadStats);
      };
    }
  }, []);

  const handlePromptQuickApprove = (teacher: any) => {
    const teacherName = teacher.name || teacher.fullName || teacher.email;
    setConfirmPrompt({
      title: "Xác Nhận Phê Duyệt Giáo Viên",
      description: `Bạn có chắc chắn muốn PHÊ DUYỆT và cấp toàn quyền Educator Studio cho tài khoản "${teacherName}" (${teacher.email})?`,
      confirmText: "Xác Nhận Phê Duyệt",
      variant: "emerald",
      onConfirm: () => executeQuickApprove(teacher),
    });
  };

  const executeQuickApprove = async (teacher: any) => {
    setConfirmPrompt(null);
    const id = teacher.id || teacher.uid;
    setApprovingId(id);

    try {
      if (teacher.uid || teacher.id) {
        await updateDoc(doc(db, "users", teacher.uid || teacher.id), {
          status: "active",
          updated_at: new Date().toISOString(),
        }).catch(() => {});
      }

      if (typeof window !== "undefined") {
        const localList = JSON.parse(localStorage.getItem("eve_registered_users") || "[]");
        const idx = localList.findIndex((u: any) => u.email === teacher.email || u.uid === id || u.id === id);
        if (idx >= 0) {
          localList[idx].status = "active";
          localStorage.setItem("eve_registered_users", JSON.stringify(localList));
        }

        const sessionUser = JSON.parse(localStorage.getItem("eve_user") || "null");
        if (sessionUser && (sessionUser.email === teacher.email || sessionUser.uid === id)) {
          sessionUser.status = "active";
          localStorage.setItem("eve_user", JSON.stringify(sessionUser));
        }
      }

      setFeedbackMsg(`🎉 Đã phê duyệt kích hoạt tài khoản Giáo viên ${teacher.name || teacher.fullName || teacher.email}!`);
      setTimeout(() => setFeedbackMsg(null), 4000);
      loadStats();
    } catch (err) {
      console.error(err);
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/15">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs font-mono mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Trung Tâm Điều Hành Quản Trị
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Tổng Quan Hệ Thống E-V-E 🏛️
          </h1>
          <p className="text-sm text-[#8e9bb4] mt-1">
            Theo dõi dữ liệu thực tế: kiểm duyệt giáo viên, bài học và source code game engine.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadStats()}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Làm mới
          </button>

          <Link href="/admin/approvals">
            <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-mono text-xs font-bold shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all cursor-pointer flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Đi Đến Duyệt Nội Dung
            </button>
          </Link>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Users */}
        <div className="p-5 rounded-2xl bg-[#0f1524]/80 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono">Tổng Người Dùng</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono">{stats.totalUsers}</div>
          <div className="text-xs text-[#8e9bb4] flex items-center gap-1.5 font-mono">
            <span className="text-blue-400 font-bold">{stats.studentsCount}</span> học sinh •{" "}
            <span className="text-emerald-400 font-bold">{stats.teachersCount}</span> giáo viên
          </div>
        </div>

        {/* Pending Teachers */}
        <div className="p-5 rounded-2xl bg-[#0f1524]/80 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)] transition-all space-y-3">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-mono">Giáo Viên Chờ Duyệt</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-amber-300 font-mono">{stats.pendingTeachersCount}</div>
          <Link
            href="/admin/users"
            className="text-xs font-mono text-amber-400 hover:underline inline-flex items-center gap-1"
          >
            Xem danh sách duyệt ngay →
          </Link>
        </div>

        {/* Pending Courses */}
        <div className="p-5 rounded-2xl bg-[#0f1524]/80 border border-cyan-500/20 hover:border-cyan-500/40 transition-all space-y-3">
          <div className="flex items-center justify-between text-cyan-400">
            <span className="text-xs font-mono">Bài Học & Lộ Trình</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono">{stats.coursesCount}</div>
          <div className="text-xs text-cyan-300 font-mono">
            <span className="font-bold text-rose-400">{stats.pendingCoursesCount}</span> bài học đang chờ duyệt
          </div>
        </div>

        {/* Games */}
        <div className="p-5 rounded-2xl bg-[#0f1524]/80 border border-purple-500/20 hover:border-purple-500/40 transition-all space-y-3">
          <div className="flex items-center justify-between text-purple-400">
            <span className="text-xs font-mono">Game Engine Quiz</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Gamepad2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono">{stats.gamesCount}</div>
          <div className="text-xs text-purple-300 font-mono">
            <span className="font-bold text-rose-400">{stats.pendingGamesCount}</span> game chờ audit & duyệt
          </div>
        </div>
      </div>

      {/* ── Action Panels ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Pending Teachers Quick Action */}
        <div className="p-6 rounded-2xl bg-[#0f1524]/80 border border-[#7bd1fa]/15 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-400" /> Hồ Sơ Giáo Viên Đăng Ký Mới ({pendingTeachers.length})
            </h3>
            <Link
              href="/admin/users"
              className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {pendingTeachers.length === 0 ? (
              <div className="p-6 rounded-xl bg-[#151b2c]/60 border border-dashed border-slate-800 text-center space-y-1">
                <UserCheck className="w-6 h-6 text-emerald-400 mx-auto" />
                <div className="text-xs font-mono text-slate-300 font-bold">
                  Không có hồ sơ giáo viên nào đang chờ duyệt
                </div>
                <p className="text-[11px] text-slate-500">
                  Tất cả tài khoản giáo viên đã được phê duyệt hoặc chưa có đăng ký mới.
                </p>
              </div>
            ) : (
              pendingTeachers.map((teacher) => (
                <div
                  key={teacher.id || teacher.uid || teacher.email}
                  className="p-3.5 rounded-xl bg-[#151b2c] border border-amber-500/20 flex items-center justify-between gap-3 hover:border-amber-500/40 transition-all"
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="font-bold text-sm text-white truncate">
                      {teacher.name || teacher.fullName || "Giáo viên mới"}
                    </div>
                    <div className="text-xs text-[#8e9bb4] truncate font-mono">
                      {teacher.email} {teacher.departmentOrClass ? `• ${teacher.departmentOrClass}` : (teacher.schoolCode ? `• Mã trường: ${teacher.schoolCode}` : "")}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={approvingId === (teacher.id || teacher.uid)}
                      onClick={() => handlePromptQuickApprove(teacher)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/40 cursor-pointer transition-all flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                    >
                      {approvingId === (teacher.id || teacher.uid) ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      <span>Duyệt Ngay</span>
                    </button>

                    <Link href="/admin/users">
                      <span className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono cursor-pointer transition-all">
                        Chi tiết
                      </span>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Panel 2: Pending Games & Source Code Audit */}
        <div className="p-6 rounded-2xl bg-[#0f1524]/80 border border-[#7bd1fa]/15 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-purple-400" /> Game Engine Chờ Tải Source & Duyệt ({pendingGames.length})
            </h3>
            <Link
              href="/admin/approvals"
              className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              Sang trang Audit <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {pendingGames.length === 0 ? (
              <div className="p-6 rounded-xl bg-[#151b2c]/60 border border-dashed border-slate-800 text-center space-y-1">
                <FolderCheck className="w-6 h-6 text-purple-400 mx-auto" />
                <div className="text-xs font-mono text-slate-300 font-bold">
                  Không có Game Engine nào đang chờ kiểm duyệt
                </div>
                <p className="text-[11px] text-slate-500">
                  Tất cả game engine đã được audit hoặc chưa có file tải lên mới.
                </p>
              </div>
            ) : (
              pendingGames.map((game) => (
                <div
                  key={game.id}
                  className="p-3.5 rounded-xl bg-[#151b2c] border border-slate-800 flex items-center justify-between gap-3 hover:border-purple-500/30 transition-all"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-white truncate">{game.title}</div>
                    <div className="text-xs text-[#8e9bb4] truncate">
                      {game.authorName || "Giáo viên"} • {game.sourceFileName || "Source .zip"}
                    </div>
                  </div>
                  <Link href="/admin/approvals">
                    <span className="px-2.5 py-1 rounded-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-[10px] font-mono border border-purple-500/30 cursor-pointer transition-all shrink-0">
                      Audit Code →
                    </span>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── GLOBAL CONFIRMATION PROMPT MODAL ── */}
      {confirmPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in font-sans">
          <div className="bg-[#0f1524] border border-[#7bd1fa]/30 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-5 text-center relative">
            <button
              type="button"
              onClick={() => setConfirmPrompt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto text-xl">
              <HelpCircle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white tracking-tight">
                {confirmPrompt.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {confirmPrompt.description}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmPrompt(null)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold transition-all cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={confirmPrompt.onConfirm}
                className={`flex-1 py-3 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  confirmPrompt.variant === "emerald"
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    : confirmPrompt.variant === "rose"
                    ? "bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                    : "bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {confirmPrompt.confirmText || "Xác Nhận"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
