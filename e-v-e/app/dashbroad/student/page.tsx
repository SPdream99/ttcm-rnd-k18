"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  Compass,
  GraduationCap,
  Bot,
  Settings,
  HelpCircle,
  Bell,
  MessageSquare,
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
  ArrowUpRight,
  Star,
} from "lucide-react";

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<"all" | "inProgress" | "completed">("all");
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  // Mock data for student progress
  const stats = [
    {
      label: "Chuỗi học tập",
      value: "7 Ngày",
      change: "+2 so với tuần trước",
      icon: Flame,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
    {
      label: "Điểm trung bình",
      value: "3.85 / 4.0",
      change: "Top 5% lớp học",
      icon: Award,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
    },
    {
      label: "Giờ học tích lũy",
      value: "48.5 Giờ",
      change: "+12.4h tháng này",
      icon: Clock,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      label: "Bài tập hoàn thành",
      value: "18 / 20",
      change: "90% Tiến độ",
      icon: CheckCircle2,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
  ];

  const courses = [
    {
      id: "phys",
      title: "Vật Lý Lượng Tử Advanced",
      instructor: "GS. Nguyễn Văn An",
      progress: 75,
      currentChapter: "Chương 4: Vướng víu lượng tử & Ứng dụng",
      nextLesson: "Bài 4.2: Thí nghiệm EPR & Chuông Bell",
      status: "inProgress",
      tag: "Vật lý",
      color: "from-blue-500 to-cyan-400",
    },
    {
      id: "ai",
      title: "Kiến Trúc Mạng Thần Kinh (Neural Networks)",
      instructor: "TS. Lê Thị Mai",
      progress: 40,
      currentChapter: "Chương 2: Deep Learning Foundation",
      nextLesson: "Bài 2.3: Backpropagation trong Transformer",
      status: "inProgress",
      tag: "Công nghệ AI",
      color: "from-purple-500 to-indigo-500",
    },
    {
      id: "ux",
      title: "Thiết Kế UI/UX & Dynamic System",
      instructor: "ThS. Trần Hoàng Nam",
      progress: 92,
      currentChapter: "Dự án cuối khóa: Design System E-V-E",
      nextLesson: "Bài 6.1: Tối ưu hóa Micro-interactions",
      status: "inProgress",
      tag: "Design",
      color: "from-emerald-400 to-teal-500",
    },
    {
      id: "math",
      title: "Toán Cao Cấp cho AI & Data Science",
      instructor: "GS. Alan Turing",
      progress: 100,
      currentChapter: "Hoàn thành toàn bộ khóa học",
      nextLesson: "Cấp chứng chỉ xuất sắc",
      status: "completed",
      tag: "Toán học",
      color: "from-amber-400 to-orange-500",
    },
  ];

  const upcomingClasses = [
    {
      id: 1,
      title: "Thảo luận: Vật Lý Lượng Tử & Vũ Trụ Học",
      time: "10:00 AM - Hôm nay",
      instructor: "GS. Nguyễn Văn An",
      room: "Phòng ảo E-V-E #01",
      urgent: true,
    },
    {
      id: 2,
      title: "Seminar: Trợ lý AI trong Đổi mới Giáo dục",
      time: "02:30 PM - Chiều nay",
      instructor: "Dr. Carl Sagan",
      room: "Hội trường Virtual A2",
      urgent: false,
    },
    {
      id: 3,
      title: "Thực hành: Train mô hình Deep Learning",
      time: "08:00 AM - Sáng mai",
      instructor: "TS. Lê Thị Mai",
      room: "Lab AI #04",
      urgent: false,
    },
  ];

  const achievements = [
    { name: "Chuỗi 7 Ngày", icon: Flame, color: "text-amber-400 border-amber-400/40 bg-amber-400/10", unlocked: true },
    { name: "Master Lý Thuyết", icon: Star, color: "text-cyan-400 border-cyan-400/40 bg-cyan-400/10", unlocked: true },
    { name: "Dự Án Tiên Phong", icon: Zap, color: "text-purple-400 border-purple-400/40 bg-purple-400/10", unlocked: true },
    { name: "Học Viên Xuất Sắc", icon: Award, color: "text-emerald-400 border-emerald-400/40 bg-emerald-400/10", unlocked: false },
  ];

  const filteredCourses = courses.filter((course) => {
    if (activeTab === "inProgress") return course.status === "inProgress";
    if (activeTab === "completed") return course.status === "completed";
    if (searchQuery) {
      return (
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-[#e1e2ec] flex flex-col md:flex-row relative font-sans">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Side Navigation (Desktop Sidebar) */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-[#0f1524]/80 backdrop-blur-xl border-r border-[#7bd1fa]/15 z-40 p-5 justify-between">
        <div className="space-y-8">
          {/* Brand Logo */}
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

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {[
              { label: "Dashboard", icon: LayoutDashboard, href: "/dashbroad/student", active: true },
              { label: "Ai Tutor", icon: Calendar, href: "/dashbroad/student/AITutor", active: false },
              { label: "Learning Path", icon: Compass, href: "/dashbroad/student/LearningPath", active: false },
              { label: "Class", icon: GraduationCap, href: "/dashbroad/student/Class", active: false },
            ].map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${item.active
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

        {/* AI Assistant Callout & Footer Settings */}
        <div className="space-y-4 pt-6 border-t border-[#7bd1fa]/10">
          <div className="relative group overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-blue-900/40 via-[#151b2c] to-purple-900/30 border border-cyan-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
                <Bot className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm text-white">E-V-E Assistant</span>
            </div>
            <p className="text-xs text-[#8e9bb4] mb-3">Sẵn sàng giải đáp & trợ giúp bài tập 24/7</p>
            <button className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-medium text-xs shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Trò Chuyện Ngay
            </button>
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

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 z-10 space-y-8">
        {/* Header Section */}
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

          {/* Header Action Tools */}
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e9bb4]" />
              <input
                type="text"
                placeholder="Tìm khóa học, bài giảng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#151b2c]/80 border border-[#7bd1fa]/20 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-[#8e9bb4] focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>

            {/* Notification Button */}
            <button
              onClick={() => setShowNotificationModal(!showNotificationModal)}
              className="relative p-2.5 rounded-xl bg-[#151b2c]/80 border border-[#7bd1fa]/20 text-[#8e9bb4] hover:text-white hover:border-cyan-400/50 transition-all"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </button>

            {/* User Profile Avatar */}
            <div className="flex items-center gap-3 pl-2 border-l border-[#7bd1fa]/15">
              <Link href="/dashbroad/student/profile" className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-linear-to-tr from-cyan-400 to-blue-600 p-[2px]">
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

        {/* Quick KPI Stat Cards Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border border-[#7bd1fa]/15 hover:border-cyan-500/40 hover-card-lift transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#8e9bb4] uppercase tracking-wider">{stat.label}</span>
                  <div className={`p-2.5 rounded-xl ${stat.bgColor} ${stat.borderColor} border`}>
                    <IconComponent className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white tracking-tight">{stat.value}</div>
                  <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                    <TrendingUp className="w-3.5 h-3.5" /> {stat.change}
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Main Bento Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Course Progress & AI Recommendation (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Course Progress Section */}
            <section className="p-6 rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border border-[#7bd1fa]/15 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-cyan-400" /> Tiến Độ Khóa Học
                  </h2>
                  <p className="text-xs text-[#8e9bb4]">Các môn học đang diễn ra trong tuần</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-[#151b2c] rounded-xl border border-[#7bd1fa]/10 self-start sm:self-auto">
                  {(["all", "inProgress", "completed"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === tab
                          ? "bg-blue-600 text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]"
                          : "text-[#8e9bb4] hover:text-white"
                        }`}
                    >
                      {tab === "all" ? "Tất cả" : tab === "inProgress" ? "Đang học" : "Hoàn thành"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Course Cards List */}
              <div className="space-y-4">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => setSelectedCourse(course.id)}
                    className={`p-4 rounded-xl bg-[#151b2c]/60 border transition-all cursor-pointer hover:border-cyan-400/50 ${selectedCourse === course.id
                        ? "border-cyan-400 shadow-[0_0_20px_rgba(125,211,252,0.15)] bg-[#1a2238]"
                        : "border-[#7bd1fa]/10 hover:bg-[#1a2238]/60"
                      }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-cyan-300 border border-blue-500/20 text-[11px] font-medium">
                            {course.tag}
                          </span>
                          <span className="text-xs text-[#8e9bb4]">• {course.instructor}</span>
                        </div>
                        <h3 className="font-semibold text-base text-white">{course.title}</h3>
                        <p className="text-xs text-[#8e9bb4]">{course.currentChapter}</p>
                      </div>

                      {/* Progress Circle & Status */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-bold text-cyan-400">{course.progress}%</div>
                          <div className="text-[11px] text-[#8e9bb4]">Hoàn thành</div>
                        </div>
                        <button className="p-2 rounded-xl bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all">
                          <PlayCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-[#0a0e1a] overflow-hidden p-[1px] border border-[#7bd1fa]/10">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${course.color} transition-all duration-500`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* AI Learning Path Recommendation Banner */}
            <section className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-[#0f1524] to-purple-950/40 border border-cyan-500/30 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-lg">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" /> E-V-E AI RECOMMENDATION
                  </div>
                  <h3 className="text-lg font-bold text-white">Lộ trình khuyến nghị: Mô Hình Deep Learning Nâng Cao</h3>
                  <p className="text-xs text-[#8e9bb4]">
                    AI nhận thấy bạn đã hoàn thành xuất sắc 92% môn UI/UX. Mô-đun tiếp theo sẽ giúp bạn kết nối kiến thức thiết kế với lập trình giao diện AI.
                  </p>
                  <div className="flex items-center gap-3 pt-1 text-xs text-[#8e9bb4]">
                    <span className="px-2.5 py-1 rounded-md bg-[#151b2c] border border-[#7bd1fa]/15">⏱ 45 phút</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#151b2c] border border-[#7bd1fa]/15">⚡ Độ khó: Trung bình</span>
                  </div>
                </div>

                <button className="shrink-0 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-white font-semibold text-sm shadow-[0_0_20px_rgba(125,211,252,0.4)] transition-all flex items-center gap-2">
                  Bắt Đầu Học Ngay <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          </div>

          {/* Right Column: Upcoming Schedule & Achievements (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Upcoming Schedule Card */}
            <section className="p-6 rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border border-[#7bd1fa]/15 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-400" /> Lịch Học Trực Tuyền
                </h2>
                <a href="#" className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-medium">
                  Xem hết <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="space-y-3">
                {upcomingClasses.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border transition-all ${item.urgent
                        ? "bg-blue-600/10 border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                        : "bg-[#151b2c]/60 border-[#7bd1fa]/10"
                      }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-cyan-300">{item.time}</span>
                      {item.urgent && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 text-[10px] font-bold border border-blue-500/40">
                          SẮP DIỄN RA
                        </span>
                      )}
                    </div>
                    <h4 className="font-semibold text-sm text-white mb-1">{item.title}</h4>
                    <p className="text-xs text-[#8e9bb4] mb-3">{item.instructor} • {item.room}</p>

                    <button
                      className={`w-full py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${item.urgent
                          ? "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                          : "bg-[#1f273d] hover:bg-[#28334f] text-[#e1e2ec] border border-[#7bd1fa]/15"
                        }`}
                    >
                      <VideoIcon className="w-3.5 h-3.5" />
                      {item.urgent ? "Vào Phòng Học Trực Tuyến" : "Xem Chi Tiết Lịch Học"}
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Achievement Badges */}
            <section className="p-6 rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border border-[#7bd1fa]/15 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" /> Huy Hiệu & Thành Tựu
                </h2>
                <span className="text-xs text-[#8e9bb4]">3/4 Khóa</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {achievements.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex flex-col items-center text-center space-y-1.5 transition-all ${item.unlocked
                          ? `${item.color} shadow-[0_0_15px_rgba(245,158,11,0.1)]`
                          : "bg-[#151b2c]/30 border-[#7bd1fa]/10 opacity-40 grayscale"
                        }`}
                    >
                      <div className="p-2 rounded-full bg-black/20">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-semibold text-white">{item.name}</span>
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

function VideoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}