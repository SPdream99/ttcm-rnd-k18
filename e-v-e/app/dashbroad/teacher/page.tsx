"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTeacherAdapter } from "@/hooks/useTeacherAdapter";
import {
  Users,
  GraduationCap,
  CheckCircle,
  AlertTriangle,
  PlusCircle,
  FileCheck,
  Calendar,
  Clock,
  Search,
  Bell,
  Sparkles,
  TrendingUp,
  Settings,
  HelpCircle,
  ChevronRight,
  BookOpen,
} from "lucide-react";

export default function TeacherDashboard() {
  const [selectedClass, setSelectedClass] = useState("12A1");
  const { stats, classes, assignments, loading } = useTeacherAdapter();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] text-[#e1e2ec] flex items-center justify-center font-sans">
        <p className="text-purple-400 font-medium">Đang tải dữ liệu giảng viên...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-[#e1e2ec] flex flex-col md:flex-row relative font-sans">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[130px]" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[130px]" />
      </div>

      {/* Sidebar Navigation */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-[#0f1524]/80 backdrop-blur-xl border-r border-[#7bd1fa]/15 z-40 p-5 justify-between">
        <div className="space-y-8">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 p-[1px] shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <div className="w-full h-full bg-[#0a0e1a] rounded-[11px] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
                E-V-E <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">TEACHER</span>
              </h1>
              <p className="text-xs text-[#8e9bb4]">Educator Studio</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              { label: "Dashboard", icon: GraduationCap, href: "/dashbroad/teacher", active: true },
              { label: "Quản Lý Lớp Học", icon: BookOpen, href: "/dashbroad/teacher/ClassManagement", active: false },
            ].map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  item.active
                    ? "bg-gradient-to-r from-emerald-600/25 to-teal-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                    : "text-[#8e9bb4] hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className={`w-5 h-5 ${item.active ? "text-emerald-400" : "text-[#8e9bb4]"}`} />
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="space-y-4 pt-6 border-t border-[#7bd1fa]/10">
          <div className="flex items-center justify-between px-2 text-[#8e9bb4]">
            <a href="#" className="hover:text-white transition-colors flex items-center gap-2 text-xs">
              <Settings className="w-4 h-4" /> Cài đặt
            </a>
            <a href="#" className="hover:text-white transition-colors flex items-center gap-2 text-xs">
              <HelpCircle className="w-4 h-4" /> Trợ giúp
            </a>
          </div>
        </div>
      </aside>

      {/* Main Educator Workspace */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 z-10 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/10">
          <div>
            <div className="flex items-center gap-2 text-sm text-emerald-400 font-medium mb-1">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              GS. Nguyễn Văn An • Tổ Vật Lý Lượng Tử
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Bàn Làm Việc Giáo Viên 👨‍🏫
            </h1>
            <p className="text-sm text-[#8e9bb4] mt-1">Quản lý lớp học, chấm bài tập và theo dõi tiến độ học sinh.</p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashbroad/teacher/ClassManagement/AssignmentManagement">
              <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-medium text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2">
                <PlusCircle className="w-4 h-4" /> Tạo Bài Tập Mới
              </button>
            </Link>
          </div>
        </header>

        {/* Metrics Banner */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((metric, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border border-[#7bd1fa]/15 hover:border-emerald-500/40 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#8e9bb4] uppercase tracking-wider">{metric.title}</span>
                <div className={`p-2.5 rounded-xl ${metric.bgColor} ${metric.borderColor} border`}>
                  <Users className={`w-5 h-5 ${metric.color}`} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white tracking-tight">{metric.value}</div>
                <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                  <TrendingUp className="w-3.5 h-3.5" /> {metric.change}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Classes Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <section className="p-6 rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border border-[#7bd1fa]/15 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" /> Các Lớp Phụ Trách
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {classes.map((cls) => (
                  <div key={cls.id} className="p-4 rounded-xl bg-[#151b2c]/60 border border-[#7bd1fa]/10 space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-white text-base">{cls.name}</h3>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                        {cls.grade}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#8e9bb4]">
                      <span>Sĩ số: <strong className="text-white">{cls.studentsCount} HS</strong></span>
                      <span>GPA TB: <strong className="text-emerald-400">{cls.avgGpa}</strong></span>
                    </div>

                    <Link
                      href={`/dashbroad/teacher/ClassManagement`}
                      className="w-full py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-medium text-xs border border-emerald-500/30 transition-all flex items-center justify-center gap-1"
                    >
                      Quản Lý Lớp <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <section className="p-6 rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border border-[#7bd1fa]/15 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-amber-400" /> Bài Tập Cần Chấm
              </h2>

              <div className="space-y-3">
                {assignments.map((as) => (
                  <div key={as.id} className="p-3.5 rounded-xl bg-[#151b2c]/60 border border-[#7bd1fa]/10 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-emerald-300">Lớp {as.className}</span>
                      <span className="text-amber-400 font-bold">{as.status}</span>
                    </div>
                    <h4 className="font-semibold text-sm text-white">{as.title}</h4>
                    <p className="text-xs text-[#8e9bb4]">Đã nộp: {as.submittedCount}/{as.totalCount} HS</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}