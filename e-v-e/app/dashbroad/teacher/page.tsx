"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  ChevronDown,
  Bell,
  Sparkles,
  Award,
  BookOpen,
  Filter,
  ArrowUpRight,
  TrendingUp,
  MessageCircle,
  Send,
  MoreVertical,
  Layers,
  HelpCircle,
  Settings,
} from "lucide-react";

export default function TeacherDashboard() {
  const [selectedClass, setSelectedClass] = useState("12A1");
  const [searchStudent, setSearchStudent] = useState("");
  const [gradingFilter, setGradingFilter] = useState<"all" | "pending" | "graded">("pending");

  const classesList = [
    { id: "12A1", name: "Lớp 12A1 • Chuyên Vật Lý", totalStudents: 38 },
    { id: "11B2", name: "Lớp 11B2 • AI & Data Science", totalStudents: 42 },
    { id: "10A5", name: "Lớp 10A5 • Toán Ươm Mầm", totalStudents: 35 },
  ];

  const teacherMetrics = [
    {
      title: "Học Sinh Phụ Trách",
      value: "115 HS",
      change: "+5 học sinh mới",
      icon: Users,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
    },
    {
      title: "Điểm Trung Bình Lớp",
      value: "8.4 / 10",
      change: "+0.3 so với tháng trước",
      icon: GraduationCap,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      title: "Tỷ Lệ Nộp Bài Đúng Hạn",
      value: "94.2%",
      change: "+2.1% tuần này",
      icon: CheckCircle,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Học Sinh Cần Hỗ Trợ",
      value: "3 Học Sinh",
      change: "Cần chú ý đặc biệt",
      icon: AlertTriangle,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
  ];

  const pendingGradings = [
    {
      id: 1,
      studentName: "Nguyễn Trần Hải Đăng",
      assignmentTitle: "Bài tập 4: Giải thuật Vướng Víu Lượng Tử",
      submittedTime: "10 phút trước",
      aiSuggestedScore: "9.5 / 10",
      status: "pending",
      avatarColor: "bg-blue-500",
    },
    {
      id: 2,
      studentName: "Lê Bảo Ngọc",
      assignmentTitle: "Báo cáo Thực hành: Train mô hình CNN",
      submittedTime: "45 phút trước",
      aiSuggestedScore: "8.8 / 10",
      status: "pending",
      avatarColor: "bg-emerald-500",
    },
    {
      id: 3,
      studentName: "Phạm Quốc Thái",
      assignmentTitle: "Bài tập 3: Phương trình vi phân ứng dụng",
      submittedTime: "2 giờ trước",
      aiSuggestedScore: "7.0 / 10",
      status: "pending",
      avatarColor: "bg-purple-500",
    },
  ];

  const teachingSchedule = [
    {
      id: 1,
      time: "08:00 - 09:30 AM",
      className: "Lớp 12A1",
      topic: "Vật Lý Lượng Tử: Thí nghiệm Khe Song",
      room: "Phòng Smart Lab 302",
      status: "ongoing",
    },
    {
      id: 2,
      time: "10:15 - 11:45 AM",
      className: "Lớp 11B2",
      topic: "Machine Learning: Backpropagation Matrix",
      room: "Phòng Virtual Meeting A",
      status: "upcoming",
    },
    {
      id: 3,
      time: "02:00 - 03:30 PM",
      className: "Lớp 10A5",
      topic: "Đại Số Tuyến Tính & Vector Không Gian",
      room: "Giảng đường B1",
      status: "upcoming",
    },
  ];

  const atRiskStudents = [
    { name: "Trần Minh Khoa", class: "12A1", score: 5.2, reason: "Vắng 2 buổi & thiếu 1 bài tập", status: "Cảnh báo" },
    { name: "Đặng Thị Phương", class: "11B2", score: 5.8, reason: "Điểm kiểm tra giữa kỳ thấp", status: "Theo dõi" },
  ];

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
          {/* Logo Brand */}
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
              <p className="text-xs text-[#8e9bb4]">Educator Command Workspace</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {[
              { label: "Dashboard", icon: Layers, href: "/dashbroad/teacher", active: true },
              { label: "ClassManagement", icon: Users, href: "/dashbroad/teacher/ClassManagement", active: false },
            ].map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  item.active
                    ? "bg-gradient-to-r from-emerald-600/25 to-teal-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                    : "text-[#8e9bb4] hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className={`w-5 h-5 ${item.active ? "text-emerald-400" : "text-[#8e9bb4]"}`} />
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* AI Teaching Assistant Callout */}
        <div className="space-y-4 pt-6 border-t border-[#7bd1fa]/10">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-[#151b2c] to-blue-950/30 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-semibold text-sm text-white">E-V-E Co-Teacher</span>
            </div>
            <p className="text-xs text-[#8e9bb4] mb-3">Tự động chấm bài & tạo đề thi thông minh trong 30s</p>
            <button className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-medium text-xs shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all">
              Tạo Giáo Án AI
            </button>
          </div>

          <div className="flex items-center justify-between px-2 text-[#8e9bb4]">
            <a href="#" className="hover:text-white transition-colors flex items-center gap-2 text-xs">
              <Settings className="w-4 h-4" /> Cấu hình
            </a>
            <a href="#" className="hover:text-white transition-colors flex items-center gap-2 text-xs">
              <HelpCircle className="w-4 h-4" /> Hỗ trợ
            </a>
          </div>
        </div>
      </aside>

      {/* Main Educator Workspace */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 z-10 space-y-8">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/10">
          <div>
            <div className="flex items-center gap-2 text-sm text-emerald-400 font-medium mb-1">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Không gian giảng dạy trực tuyến
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Bảng Điều Khiển Giáo Viên, <span className="gradient-text-emerald">ThS. Phạm Hoàng Nam</span> 📚
            </h1>
            <p className="text-sm text-[#8e9bb4] mt-1">Quản lý lớp học, theo dõi tiến độ nộp bài và phân tích năng lực học sinh.</p>
          </div>

          {/* Controls & Class Selector */}
          <div className="flex items-center gap-3">
            {/* Class Selector Dropdown */}
            <div className="relative">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="appearance-none bg-[#151b2c] border border-emerald-500/30 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.1)]"
              >
                {classesList.map((cls) => (
                  <option key={cls.id} value={cls.id} className="bg-[#0f1524] text-white">
                    {cls.name}
                  </option>
                ))}
              </select> 
              <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none" />
            </div>

            {/* Quick Action: New Assignment */}
              <Link href="/dashbroad/teacher/profile" className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-linear-to-tr from-cyan-400 to-blue-600 p-[2px]">
                    <div className="w-full h-full rounded-full bg-[#0a0e1a] flex items-center justify-center overflow-hidden">
                      <Users className="w-5 h-5 text-cyan-300" />
                    </div>
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0a0e1a]" />
                </div>
              </Link>

          </div>
        </header>

        {/* Educator Metrics Row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {teacherMetrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border border-[#7bd1fa]/15 hover:border-emerald-500/40 hover-card-lift transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#8e9bb4] uppercase tracking-wider">{metric.title}</span>
                  <div className={`p-2.5 rounded-xl ${metric.bgColor} ${metric.borderColor} border`}>
                    <Icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white tracking-tight">{metric.value}</div>
                  <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                    <TrendingUp className="w-3.5 h-3.5" /> {metric.change}
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Core Educator Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Grading Queue & Class Performance (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Interactive Grading Queue */}
            <section className="p-6 rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border border-[#7bd1fa]/15 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-emerald-400" /> Bài Tập Chờ Duyệt Điểm
                  </h2>
                  <p className="text-xs text-[#8e9bb4]">Được AI chấm trước và đề xuất thang điểm chính xác</p>
                </div>

                <div className="flex items-center gap-1.5 p-1 bg-[#151b2c] rounded-xl border border-[#7bd1fa]/10">
                  {(["pending", "all"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setGradingFilter(filter)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        gradingFilter === filter
                          ? "bg-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                          : "text-[#8e9bb4] hover:text-white"
                      }`}
                    >
                      {filter === "pending" ? "Chưa duyệt (3)" : "Tất cả bài tập"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submitted Item Cards */}
              <div className="space-y-4">
                {pendingGradings.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-[#151b2c]/60 border border-[#7bd1fa]/10 hover:border-emerald-500/40 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full ${item.avatarColor} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                          {item.studentName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm text-white">{item.studentName}</h3>
                          <p className="text-xs text-[#8e9bb4]">{item.assignmentTitle}</p>
                        </div>
                      </div>
                      <span className="text-xs text-[#8e9bb4] self-start sm:self-auto">{item.submittedTime}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#7bd1fa]/10">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-[#8e9bb4]">Điểm AI gợi ý:</span>
                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                          {item.aiSuggestedScore}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 rounded-lg bg-[#1f273d] hover:bg-[#28334f] text-[#e1e2ec] text-xs font-medium border border-[#7bd1fa]/15 transition-all">
                          Xem Bài Nộp
                        </button>
                        <button className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all">
                          Duyệt Điểm Tức Thì
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Class Performance Analysis */}
            <section className="p-6 rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border border-[#7bd1fa]/15 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-cyan-400" /> Phân Phối Học Lực Lớp 12A1
                  </h2>
                  <p className="text-xs text-[#8e9bb4]">Cập nhật theo dữ liệu điểm giữa kỳ</p>
                </div>
                <span className="text-xs text-emerald-400 font-medium">Trung bình: 8.4/10</span>
              </div>

              {/* Visual Performance Distribution Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {[
                  { label: "Xuất Sắc (9-10)", count: "14 HS", percent: 36, color: "bg-emerald-400" },
                  { label: "Giỏi (8-8.9)", count: "18 HS", percent: 47, color: "bg-blue-400" },
                  { label: "Khá (6.5-7.9)", count: "4 HS", percent: 11, color: "bg-amber-400" },
                  { label: "Cần Cố Gắng (<6.5)", count: "2 HS", percent: 6, color: "bg-rose-400" },
                ].map((tier, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#151b2c]/60 border border-[#7bd1fa]/10 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#8e9bb4]">{tier.label}</span>
                      <span className="font-bold text-white">{tier.count}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#0a0e1a] overflow-hidden">
                      <div className={`h-full ${tier.color} rounded-full`} style={{ width: `${tier.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Schedule & At-Risk Alerts (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Teaching Schedule for Today */}
            <section className="p-6 rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border border-[#7bd1fa]/15 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-400" /> Lịch Giảng Dạy Hôm Nay
                </h2>
                <span className="text-xs text-[#8e9bb4]">3 Tiết</span>
              </div>

              <div className="space-y-3">
                {teachingSchedule.map((slot) => (
                  <div
                    key={slot.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      slot.status === "ongoing"
                        ? "bg-emerald-600/10 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                        : "bg-[#151b2c]/60 border-[#7bd1fa]/10"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-emerald-300">{slot.time}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          slot.status === "ongoing"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse"
                            : "bg-[#151b2c] text-[#8e9bb4] border-[#7bd1fa]/10"
                        }`}
                      >
                        {slot.status === "ongoing" ? "ĐANG DIỄN RA" : "SẮP TỚI"}
                      </span>
                    </div>
                    <h4 className="font-semibold text-sm text-white mb-1">{slot.className}</h4>
                    <p className="text-xs text-[#8e9bb4] mb-3">{slot.topic} • {slot.room}</p>

                    <button className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-[0_0_10px_rgba(16,185,129,0.2)] transition-all">
                      Mở Lớp Học Ngay
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* At-Risk Intervention Panel */}
            <section className="p-6 rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border border-amber-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" /> Cảnh Báo Sa Sút
                </h2>
                <span className="text-xs text-amber-400 font-medium">2 Học Sinh</span>
              </div>

              <div className="space-y-3">
                {atRiskStudents.map((st, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#151b2c]/60 border border-amber-500/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-white">{st.name}</span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 text-[11px] font-bold border border-amber-500/30">
                        {st.status} ({st.score}đ)
                      </span>
                    </div>
                    <p className="text-xs text-[#8e9bb4]">{st.reason}</p>

                    <div className="flex items-center gap-2 pt-1">
                      <button className="flex-1 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-medium border border-amber-500/30 transition-all flex items-center justify-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" /> Gửi Nhắn Phụ Huynh
                      </button>
                    </div>
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