"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStudentAdapter } from "@/hooks/useStudentAdapter";
import {
  LayoutDashboard,
  Calendar,
  Compass,
  GraduationCap,
  Bot,
  Settings,
  HelpCircle,
  Bell,
  Search,
  Sparkles,
  Flame,
  Award,
  BookOpen,
  Clock,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  PlayCircle,
  FileText,
  User,
  Zap,
  Star,
} from "lucide-react";

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<"all" | "inProgress" | "completed">("all");
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { stats, courses, upcomingClasses, loading } = useStudentAdapter(activeTab, searchQuery);

  const achievements = [
    { name: "Chuỗi 7 Ngày", icon: Flame, color: "text-amber-400 border-amber-400/40 bg-amber-400/10", unlocked: true },
    { name: "Master Lý Thuyết", icon: Star, color: "text-cyan-400 border-cyan-400/40 bg-cyan-400/10", unlocked: true },
    { name: "Dự Án Tiên Phong", icon: Zap, color: "text-purple-400 border-purple-400/40 bg-purple-400/10", unlocked: true },
    { name: "Học Viên Xuất Sắc", icon: Award, color: "text-emerald-400 border-emerald-400/40 bg-emerald-400/10", unlocked: false },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] text-[#e1e2ec] flex items-center justify-center font-sans">
        <p className="text-cyan-400 font-medium">Đang tải dữ liệu học sinh...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-[#e1e2ec] flex flex-col md:flex-row relative font-sans">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Side Navigation */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-[#0f1524]/80 backdrop-blur-xl border-r border-[#7bd1fa]/15 z-40 p-5 justify-between">
        <div className="space-y-8">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-teal-400 p-[1px] shadow-[0_0_20px_rgba(59,130,246,0.5)]">
              <div className="w-full h-full bg-[#0a0e1a] rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
                E-V-E <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">STUDENT</span>
              </h1>
              <p className="text-xs text-[#8e9bb4]">Cosmic Knowledge Ecosystem</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              { label: "Dashboard", icon: LayoutDashboard, href: "/dashbroad/student", active: true },
              { label: "Ai Tutor", icon: Calendar, href: "/dashbroad/student/AITutor", active: false },
              { label: "Class", icon: GraduationCap, href: "/dashbroad/student/Class", active: false },
            ].map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  item.active
                    ? "bg-gradient-to-r from-blue-600/25 to-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(59,130,246,0.25)]"
                    : "text-[#8e9bb4] hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className={`w-5 h-5 ${item.active ? "text-cyan-400" : "text-[#8e9bb4]"}`} />
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="space-y-4 pt-6 border-t border-[#7bd1fa]/10">
          <div className="relative group overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-blue-900/40 via-[#151b2c] to-purple-900/30 border border-cyan-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
                <Bot className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm text-white">E-V-E Assistant</span>
            </div>
            <p className="text-xs text-[#8e9bb4] mb-3">Sẵn sàng giải đáp & trợ giúp bài tập 24/7</p>
            <Link href="/dashbroad/student/AITutor">
              <button className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-medium text-xs shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Trò Chuyện Ngay
              </button>
            </Link>
          </div>

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

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 z-10 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/10">
          <div>
            <div className="flex items-center gap-2 text-sm text-cyan-400 font-medium mb-1">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Học kỳ I • Năm học 2025 - 2026
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Chào mừng trở lại, <span className="gradient-text-cyan">Explorer Alex!</span> 🚀
            </h1>
            <p className="text-sm text-[#8e9bb4] mt-1">Hôm nay bạn có 2 lớp học trực tuyến và 1 bài tập sắp đến hạn.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e9bb4]" />
              <input
                type="text"
                placeholder="Tìm khóa học, bài giảng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#151b2c]/80 border border-[#7bd1fa]/20 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-[#8e9bb4] focus:outline-none focus:border-cyan-400 transition-all"
              />
            </div>

            <button
              onClick={() => setShowNotificationModal(!showNotificationModal)}
              className="relative p-2.5 rounded-xl bg-[#151b2c]/80 border border-[#7bd1fa]/20 text-[#8e9bb4] hover:text-white transition-all"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </button>

            <div className="flex items-center gap-3 pl-2 border-l border-[#7bd1fa]/15">
              <Link href="/dashbroad/student/profile" className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 p-[2px]">
                    <div className="w-full h-full rounded-full bg-[#0a0e1a] flex items-center justify-center overflow-hidden">
                      <User className="w-5 h-5 text-cyan-300" />
                    </div>
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0a0e1a]" />
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border border-[#7bd1fa]/15 hover:border-cyan-500/40 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#8e9bb4] uppercase tracking-wider">{stat.label}</span>
                <div className={`p-2.5 rounded-xl ${stat.bgColor} ${stat.borderColor} border`}>
                  <Flame className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white tracking-tight">{stat.value}</div>
                <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                  <TrendingUp className="w-3.5 h-3.5" /> {stat.change}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Courses & Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <section className="p-6 rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border border-[#7bd1fa]/15 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-cyan-400" /> Khóa Học Đang Theo Dõi
                  </h2>
                  <p className="text-xs text-[#8e9bb4]">Lộ trình tri thức cá nhân hóa được tạo bởi AI</p>
                </div>

                <div className="flex items-center gap-1 bg-[#151b2c] p-1 rounded-xl border border-[#7bd1fa]/10 self-start sm:self-auto">
                  {(["all", "inProgress", "completed"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        activeTab === tab
                          ? "bg-cyan-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                          : "text-[#8e9bb4] hover:text-white"
                      }`}
                    >
                      {tab === "all" ? "Tất cả" : tab === "inProgress" ? "Đang học" : "Đã xong"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="p-5 rounded-xl bg-[#151b2c]/60 border border-[#7bd1fa]/10 hover:border-cyan-500/40 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-[10px] font-semibold border border-cyan-500/20">
                          {course.tag}
                        </span>
                        <h3 className="font-bold text-base text-white mt-1">{course.title}</h3>
                        <p className="text-xs text-[#8e9bb4]">Giảng viên: {course.instructor}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold text-cyan-400">{course.progress}%</span>
                        <p className="text-[10px] text-[#8e9bb4]">Hoàn thành</p>
                      </div>
                    </div>

                    <div className="w-full h-2 rounded-full bg-[#0a0e1a] overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${course.color} rounded-full transition-all duration-500`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs">
                      <div className="space-y-1">
                        <div className="text-white font-medium flex items-center gap-1.5">
                          <PlayCircle className="w-3.5 h-3.5 text-cyan-400" /> {course.currentChapter}
                        </div>
                        <div className="text-[#8e9bb4]">Bài tiếp theo: {course.nextLesson}</div>
                      </div>

                      <button className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30 transition-all flex items-center justify-center gap-1 self-start sm:self-auto">
                        Học Tiếp <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <section className="p-6 rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border border-[#7bd1fa]/15 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" /> Lịch Học Trực Tuyến Sắp Tới
              </h2>

              <div className="space-y-3">
                {upcomingClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      cls.urgent
                        ? "bg-cyan-500/10 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                        : "bg-[#151b2c]/60 border-[#7bd1fa]/10"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-cyan-300">{cls.time}</span>
                      {cls.urgent && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                          Sắp diễn ra
                        </span>
                      )}
                    </div>
                    <h4 className="font-semibold text-sm text-white mb-1">{cls.title}</h4>
                    <p className="text-xs text-[#8e9bb4] mb-3">{cls.instructor} • {cls.room}</p>
                    <button className="w-full py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-semibold shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all">
                      Vào Phòng Học Trực Tuyến
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="p-6 rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border border-[#7bd1fa]/15 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" /> Huy Chương & Thành Tựu
              </h2>

              <div className="grid grid-cols-2 gap-3">
                {achievements.map((ach, idx) => {
                  const Icon = ach.icon;
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex flex-col items-center text-center space-y-2 ${ach.color}`}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-xs font-semibold">{ach.name}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}