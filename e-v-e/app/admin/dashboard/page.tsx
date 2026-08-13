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
} from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 24,
    studentsCount: 18,
    teachersCount: 5,
    pendingTeachersCount: 2,
    coursesCount: 12,
    pendingCoursesCount: 3,
    gamesCount: 6,
    pendingGamesCount: 2,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const usersSnap = await getDocs(collection(db, "users"));
        const coursesSnap = await getDocs(collection(db, "courses"));
        const gamesSnap = await getDocs(collection(db, "games"));

        const usersList = usersSnap.docs.map((d) => d.data());
        const students = usersList.filter((u) => u.role === "student");
        const teachers = usersList.filter((u) => u.role === "teacher");
        const pendingTeachers = usersList.filter((u) => u.role === "teacher" && u.status === "pending");

        const coursesList = coursesSnap.docs.map((d) => d.data());
        const pendingCourses = coursesList.filter((c) => !c.is_accepted && !c.isAccepted);

        const gamesList = gamesSnap.docs.map((d) => d.data());
        const pendingGames = gamesList.filter((g) => !g.is_accepted && !g.isAccepted);

        setStats({
          totalUsers: usersList.length || 24,
          studentsCount: students.length || 18,
          teachersCount: teachers.length || 5,
          pendingTeachersCount: pendingTeachers.length || 2,
          coursesCount: coursesList.length || 12,
          pendingCoursesCount: pendingCourses.length || 3,
          gamesCount: gamesList.length || 6,
          pendingGamesCount: pendingGames.length || 2,
        });
      } catch (e) {
        console.warn("Could not fetch real-time admin stats, using fallback defaults:", e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
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
            Theo dõi dữ liệu người dùng, kiểm soát và phê duyệt khóa học, lộ trình và source code game.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/approvals">
            <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-mono text-xs font-bold shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all cursor-pointer flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Đi Đến Duyệt Nội Dung
            </button>
          </Link>
        </div>
      </div>

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
          <div className="text-xs text-[#8e9bb4] flex items-center gap-1.5">
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
            <span className="text-xs font-mono">Course & Lộ Trình</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono">{stats.coursesCount}</div>
          <div className="text-xs text-cyan-300">
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
          <div className="text-xs text-purple-300">
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
              <GraduationCap className="w-5 h-5 text-emerald-400" /> Hồ Sơ Giáo Viên Đăng Ký Mới
            </h3>
            <Link
              href="/admin/users"
              className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            <div className="p-3.5 rounded-xl bg-[#151b2c] border border-slate-800 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-bold text-sm text-white">ThS. Phạm Hoàng Nam</div>
                <div className="text-xs text-[#8e9bb4]">nam.ph@eve.edu.vn • Tổ Toán - Tin</div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30">
                Chờ duyệt
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#151b2c] border border-slate-800 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-bold text-sm text-white">TS. Lê Thị Mai</div>
                <div className="text-xs text-[#8e9bb4]">mai.le@school.edu.vn • Bộ môn Vật lý</div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30">
                Chờ duyệt
              </span>
            </div>
          </div>
        </div>

        {/* Panel 2: Pending Games & Source Code Audit */}
        <div className="p-6 rounded-2xl bg-[#0f1524]/80 border border-[#7bd1fa]/15 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-purple-400" /> Game Engine Chờ Tải Source & Duyệt
            </h3>
            <Link
              href="/admin/approvals"
              className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              Sang trang Audit <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            <div className="p-3.5 rounded-xl bg-[#151b2c] border border-slate-800 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-bold text-sm text-white">Space Quiz 3D (Next.js Static)</div>
                <div className="text-xs text-[#8e9bb4]">Bởi: GS. Nguyễn Văn An • Inject data: Có</div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono border border-purple-500/30">
                Chờ Audit
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#151b2c] border border-slate-800 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-bold text-sm text-white">Quantum Physics Memory Card</div>
                <div className="text-xs text-[#8e9bb4]">Bởi: ThS. Phạm Hoàng Nam • Inject data: Có</div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono border border-purple-500/30">
                Chờ Audit
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
