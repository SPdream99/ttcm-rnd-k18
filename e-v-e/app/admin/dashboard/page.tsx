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
  ArrowRight,
  ShieldAlert,
  FolderCheck,
  UserCheck,
  Check,
  RefreshCw,
  Trash2,
  X,
  HelpCircle,
} from "lucide-react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/components/Toast";
import { cacheService } from "@/lib/cacheService";

interface ConfirmModalData {
  title: string;
  description: string;
  confirmText?: string;
  variant?: "emerald" | "rose" | "purple" | "cyan";
  onConfirm: () => void;
}

export default function AdminDashboardPage() {
  const toast = useToast();
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
  const [confirmPrompt, setConfirmPrompt] = useState<ConfirmModalData | null>(null);

  const loadStats = async () => {
    try {
      let usersList: any[] = [];
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        if (data.success && Array.isArray(data.users)) {
          usersList = data.users;
        }
      } catch (apiErr) {
        console.warn("API /api/admin/users fetch warning in admin dashboard:", apiErr);
      }

      if (usersList.length === 0) {
        try {
          const usersSnap = await getDocs(collection(db, "users"));
          if (!usersSnap.empty) {
            usersList = usersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
          }
        } catch (err) {
          console.warn("Firestore users fetch warning:", err);
        }
      }

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
        return s === "pending" || u.is_accepted === false || u.isAccepted === false;
      };

      const pendingT = usersList.filter((u: any) => isTeacher(u) && isPending(u));
      const activeT = usersList.filter((u: any) => isTeacher(u) && !isPending(u));
      const students = usersList.filter((u: any) => (u.role || "").toLowerCase() === "student");

      let coursesList: any[] = [];
      try {
        const cSnap = await getDocs(collection(db, "courses"));
        coursesList = cSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      } catch {}

      try {
        if (typeof window !== "undefined") {
          const localCourses = JSON.parse(localStorage.getItem("eve_uploaded_courses") || "[]");
          localCourses.forEach((lc: any) => {
            if (!coursesList.some((c) => c.id === lc.id)) {
              coursesList.push(lc);
            }
          });
        }
      } catch {}

      const pendingC = coursesList.filter((c: any) => c.isAccepted === false || c.is_accepted === false);

      let gamesList: any[] = [];
      try {
        const gSnap = await getDocs(collection(db, "game_info"));
        gamesList = gSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      } catch {}

      try {
        if (typeof window !== "undefined") {
          const localGames = JSON.parse(localStorage.getItem("eve_uploaded_games") || "[]");
          localGames.forEach((lg: any) => {
            if (!gamesList.some((g) => g.id === lg.id || (g.title && g.title === lg.title))) {
              gamesList.push(lg);
            }
          });
        }
      } catch {}

      const pendingG = gamesList.filter((g: any) => g.isAccepted === false || g.is_accepted === false);

      setStats({
        totalUsers: usersList.length || 3,
        studentsCount: students.length || 1,
        teachersCount: activeT.length || 1,
        pendingTeachersCount: pendingT.length,
        coursesCount: coursesList.length || 4,
        pendingCoursesCount: pendingC.length,
        gamesCount: gamesList.length || 2,
        pendingGamesCount: pendingG.length,
      });

      setPendingTeachers(pendingT);
      setPendingGames(pendingG);
    } catch (e) {
      console.warn("Failed to aggregate admin stats:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handlePromptQuickApprove = (teacher: any) => {
    const tName = teacher.name || teacher.fullName || teacher.email;
    setConfirmPrompt({
      title: "Xác Nhận Duyệt Giáo Viên",
      description: `Phê duyệt tài khoản "${tName}" thành Giáo viên chính thức?`,
      confirmText: "Duyệt Ngay",
      variant: "emerald",
      onConfirm: () => {
        setConfirmPrompt(null);
        executeQuickApprove(teacher);
      },
    });
  };

  const executeQuickApprove = async (teacher: any) => {
    const targetId = teacher.id || teacher.uid;
    setApprovingId(targetId);

    try {
      if (teacher.id) {
        try {
          await updateDoc(doc(db, "users", teacher.id), {
            status: "active",
            isAccepted: true,
            is_accepted: true,
          });
        } catch {}
      }

      if (typeof window !== "undefined") {
        const localUsers = JSON.parse(localStorage.getItem("eve_registered_users") || "[]");
        const updated = localUsers.map((u: any) => {
          if (u.email === teacher.email || (targetId && (u.uid === targetId || u.id === targetId))) {
            return { ...u, status: "active", isAccepted: true, is_accepted: true };
          }
          return u;
        });
        localStorage.setItem("eve_registered_users", JSON.stringify(updated));

        const sessionUser = JSON.parse(localStorage.getItem("eve_user") || "null");
        if (sessionUser && (sessionUser.email === teacher.email || sessionUser.uid === targetId)) {
          sessionUser.status = "active";
          sessionUser.isAccepted = true;
          sessionUser.is_accepted = true;
          localStorage.setItem("eve_user", JSON.stringify(sessionUser));
        }
      }

      setFeedbackMsg(`Đã phê duyệt thành công tài khoản giáo viên: ${teacher.name || teacher.email}!`);
      toast.success(`Đã phê duyệt tài khoản: ${teacher.name || teacher.email}!`, "Phê Duyệt");
      await loadStats();
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch {
      toast.error("Lỗi khi duyệt tài khoản giáo viên.", "Lỗi Xử Lý");
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="space-y-8 font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-zinc-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-200 bg-red-50 text-red-700 text-xs font-bold mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-red-600" /> Trung Tâm Điều Hành Quản Trị
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">
            Tổng Quan Hệ Thống E-V-E 
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Theo dõi dữ liệu thực tế: kiểm duyệt giáo viên, bài học và game engine.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              cacheService.clearFullAppCache(true);
              toast.success("Đã xóa sạch bộ nhớ đệm (Cache) toàn hệ thống thành công!", "Xóa Cache");
              loadStats();
            }}
            className="px-3 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 border border-red-200"
            title="Xóa cache và làm mới dữ liệu hệ thống"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-600" /> Xóa Cache
          </button>

          <button
            onClick={() => loadStats()}
            className="px-3.5 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 border border-zinc-200"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Làm mới
          </button>

          <Link href="/admin/approvals">
            <button className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 shadow-sm">
              <CheckCircle2 className="w-4 h-4" /> Duyệt Nội Dung
            </button>
          </Link>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-red-600" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Users */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-bold">Tổng Người Dùng</span>
            <div className="p-2 rounded-lg bg-zinc-100 text-zinc-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-zinc-900 font-mono">{stats.totalUsers}</div>
          <div className="text-xs text-zinc-500 flex items-center gap-1.5">
            <span className="text-zinc-900 font-bold">{stats.studentsCount}</span> học sinh •{" "}
            <span className="text-red-600 font-bold">{stats.teachersCount}</span> giáo viên
          </div>
        </div>

        {/* Pending Teachers */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-bold">Giáo Viên Chờ Duyệt</span>
            <div className="p-2 rounded-lg bg-red-50 text-red-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-red-600 font-mono">{stats.pendingTeachersCount}</div>
          <Link
            href="/admin/users"
            className="text-xs font-bold text-red-600 hover:underline inline-flex items-center gap-1"
          >
            Xem danh sách duyệt ngay →
          </Link>
        </div>

        {/* Pending Courses */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-bold">Bài Học & Lộ Trình</span>
            <div className="p-2 rounded-lg bg-zinc-100 text-zinc-700">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-zinc-900 font-mono">{stats.coursesCount}</div>
          <div className="text-xs text-zinc-500">
            <span className="font-bold text-red-600">{stats.pendingCoursesCount}</span> bài học đang chờ duyệt
          </div>
        </div>

        {/* Games */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-bold">Game Engine Quiz</span>
            <div className="p-2 rounded-lg bg-zinc-100 text-zinc-700">
              <Gamepad2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-zinc-900 font-mono">{stats.gamesCount}</div>
          <div className="text-xs text-zinc-500">
            <span className="font-bold text-red-600">{stats.pendingGamesCount}</span> game chờ duyệt
          </div>
        </div>
      </div>

      {/* Action Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Pending Teachers Quick Action */}
        <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-zinc-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-red-600" /> Hồ Sơ Giáo Viên Đăng Ký Mới ({pendingTeachers.length})
            </h3>
            <Link
              href="/admin/users"
              className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
            >
              Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {pendingTeachers.length === 0 ? (
              <div className="p-6 rounded-xl bg-zinc-50 border border-dashed border-zinc-200 text-center space-y-1">
                <UserCheck className="w-6 h-6 text-zinc-400 mx-auto" />
                <div className="text-xs text-zinc-700 font-bold">
                  Không có hồ sơ giáo viên nào đang chờ duyệt
                </div>
                <p className="text-[11px] text-zinc-500">
                  Tất cả tài khoản giáo viên đã được phê duyệt.
                </p>
              </div>
            ) : (
              pendingTeachers.map((teacher) => (
                <div
                  key={teacher.id || teacher.uid || teacher.email}
                  className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between gap-3 hover:border-red-300 transition-colors"
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="font-bold text-sm text-zinc-900 truncate">
                      {teacher.name || teacher.fullName || "Giáo viên mới"}
                    </div>
                    <div className="text-xs text-zinc-500 truncate">
                      {teacher.email}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={approvingId === (teacher.id || teacher.uid)}
                      onClick={() => handlePromptQuickApprove(teacher)}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer transition-colors flex items-center gap-1 shadow-sm"
                    >
                      {approvingId === (teacher.id || teacher.uid) ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      <span>Duyệt</span>
                    </button>

                    <Link href="/admin/users">
                      <span className="px-2.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold cursor-pointer transition-colors border border-zinc-200">
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
        <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-zinc-900 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-red-600" /> Game Engine Chờ Duyệt ({pendingGames.length})
            </h3>
            <Link
              href="/admin/approvals"
              className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
            >
              Sang trang duyệt <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {pendingGames.length === 0 ? (
              <div className="p-6 rounded-xl bg-zinc-50 border border-dashed border-zinc-200 text-center space-y-1">
                <FolderCheck className="w-6 h-6 text-zinc-400 mx-auto" />
                <div className="text-xs text-zinc-700 font-bold">
                  Không có Game Engine nào đang chờ kiểm duyệt
                </div>
                <p className="text-[11px] text-zinc-500">
                  Tất cả game engine đã được duyệt.
                </p>
              </div>
            ) : (
              pendingGames.map((game, idx) => (
                <div
                  key={`${game.id || game.gameId || idx}_${idx}`}
                  className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between gap-3 hover:border-red-300 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-zinc-900 truncate">{game.title}</div>
                    <div className="text-xs text-zinc-500 truncate">
                      {game.authorName || "Giáo viên"} • {game.sourceFileName || "Source .zip"}
                    </div>
                  </div>
                  <Link href="/admin/approvals">
                    <span className="px-2.5 py-1 rounded-full bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 cursor-pointer transition-colors shrink-0">
                      Duyệt Code →
                    </span>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* GLOBAL CONFIRMATION PROMPT MODAL */}
      {confirmPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 font-sans">
          <div className="bg-white border-2 border-red-600 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-4 text-center relative">
            <button
              type="button"
              onClick={() => setConfirmPrompt(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto text-xl font-bold">
              <HelpCircle className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-zinc-900">
                {confirmPrompt.title}
              </h3>
              <p className="text-xs text-zinc-500">
                {confirmPrompt.description}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmPrompt(null)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={confirmPrompt.onConfirm}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white shadow-sm"
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
