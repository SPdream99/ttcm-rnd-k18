"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  Gamepad2,
  Users,
  TrendingUp,
  PlusCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Award,
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function TeacherDashboardPage() {
  const { currentUser, profile } = useAuthAdapter();
  const teacherUid = currentUser?.uid || profile?.uid || "usr_teacher";

  const [stats, setStats] = useState({
    totalPlays: 320,
    enrolledStudents: 68,
    myCoursesCount: 4,
    myPathsCount: 2,
    myGamesCount: 2,
  });

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/15">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-mono mb-2">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-400" /> Bàn Làm Việc Giảng Viên
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Educator Studio Dashboard 🚀
          </h1>
          <p className="text-sm text-[#8e9bb4] mt-1">
            Theo dõi thống kê lượt học tập của học sinh, quản lý lộ trình và ngân hàng game tương tác.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/teacher/upload-center">
            <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-mono text-xs font-bold shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all cursor-pointer flex items-center gap-2">
              <PlusCircle className="w-4 h-4" /> Tạo Nội Dung Mới
            </button>
          </Link>
        </div>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Student Plays */}
        <div className="p-5 rounded-2xl bg-[#0f1524]/80 border border-emerald-500/20 space-y-3">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-mono">Tổng Lượt Chơi / Học</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono">{stats.totalPlays}</div>
          <div className="text-xs text-emerald-300 font-mono">Tăng +24% so với tuần trước</div>
        </div>

        {/* Enrolled Students */}
        <div className="p-5 rounded-2xl bg-[#0f1524]/80 border border-cyan-500/20 space-y-3">
          <div className="flex items-center justify-between text-cyan-400">
            <span className="text-xs font-mono">Học Sinh Theo Học</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono">{stats.enrolledStudents}</div>
          <div className="text-xs text-cyan-300 font-mono">Trong các khóa của Thầy/Cô</div>
        </div>

        {/* My Courses */}
        <div className="p-5 rounded-2xl bg-[#0f1524]/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono">Khóa Học & Lộ Trình</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono">{stats.myCoursesCount}</div>
          <div className="text-xs text-[#8e9bb4]">{stats.myPathsCount} lộ trình học tập đã gộp</div>
        </div>

        {/* My Games */}
        <div className="p-5 rounded-2xl bg-[#0f1524]/80 border border-purple-500/20 space-y-3">
          <div className="flex items-center justify-between text-purple-400">
            <span className="text-xs font-mono">Game Engine Nộp</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Gamepad2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono">{stats.myGamesCount}</div>
          <div className="text-xs text-purple-300 font-mono">Đã tích hợp data injection</div>
        </div>
      </div>

      {/* ── Content Highlights ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Upload CTA */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0f1524] to-[#151b2c] border border-emerald-500/20 flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
              <PlusCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white">Tạo Khóa Học Mới Với JSON Pairs</h3>
            <p className="text-xs text-[#8e9bb4] mt-1 leading-relaxed">
              Dễ dàng soạn câu hỏi, gắn đáp án đúng và các phương án gây nhiễu để Game Engine tự động tạo màn chơi hấp dẫn cho học sinh.
            </p>
          </div>
          <Link href="/teacher/upload-center">
            <button className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2">
              Vào Trung Tâm Tạo Content <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        {/* Upload Game Engine CTA */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0f1524] to-[#151b2c] border border-purple-500/20 flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white">Nộp Game Engine Static (Next.js / WebGL)</h3>
            <p className="text-xs text-[#8e9bb4] mt-1 leading-relaxed">
              Upload file source code (.zip), thiết lập whitelist các khóa học tương thích để nhúng và chạy an toàn qua iframe.
            </p>
          </div>
          <Link href="/teacher/upload-center">
            <button className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2">
              Nộp Game Mới <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
