"use client";

import React, { useState } from "react";
import {
  Building2,
  Users,
  GraduationCap,
  Award,
  ShieldCheck,
  Download,
  Search,
  Bell,
  Sparkles,
  BarChart3,
  PieChart,
  Calendar,
  Layers,
  Server,
  Plus,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet,
  Megaphone,
  Radio,
  Settings,
  HelpCircle,
  Activity,
  CheckCircle2,
} from "lucide-react";

export default function SchoolDashboard() {
  const [academicYear, setAcademicYear] = useState("2025-2026");
  const [selectedDept, setSelectedDept] = useState("all");

  const schoolMetrics = [
    {
      title: "Tổng Quy Mô Học Sinh",
      value: "1,450 HS",
      change: "+85 học sinh năm mới",
      icon: Users,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
    },
    {
      title: "Đội Ngũ Giáo Viên & Cán Bộ",
      value: "120 Giáo Viên",
      change: "100% Đạt chuẩn & Trên chuẩn",
      icon: GraduationCap,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      title: "Tỷ Lệ Học Sinh Khá / Giỏi",
      value: "88.5%",
      change: "+3.2% so với cùng kỳ",
      icon: Award,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      title: "Hạ Tầng AI & Máy Chủ School",
      value: "99.9% Uptime",
      change: "Hoạt động hoàn hảo",
      icon: ShieldCheck,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
  ];

  const gradeBreakdown = [
    { grade: "Khối 10", classes: 12, students: 480, avgGpa: "8.2 / 10", progress: 82, color: "from-blue-500 to-cyan-400" },
    { grade: "Khối 11", classes: 12, students: 470, avgGpa: "8.4 / 10", progress: 84, color: "from-purple-500 to-indigo-500" },
    { grade: "Khối 12", classes: 13, students: 500, avgGpa: "8.7 / 10", progress: 87, color: "from-emerald-400 to-teal-500" },
  ];

  const departmentRanking = [
    { name: "Tổ Tự Nhiên - Vật Lý", head: "GS. Nguyễn Văn An", classes: 15, rating: "9.8/10", status: "Xuất Sắc" },
    { name: "Tổ Công Nghệ & AI", head: "TS. Lê Thị Mai", classes: 18, rating: "9.7/10", status: "Xuất Sắc" },
    { name: "Tổ Toán Học", head: "GS. Alan Turing", classes: 20, rating: "9.5/10", status: "Tiên Tiến" },
    { name: "Tổ UI/UX & Thiết Kế", head: "ThS. Trần Hoàng Nam", classes: 10, rating: "9.4/10", status: "Tiên Tiến" },
  ];

  const schoolEvents = [
    {
      id: 1,
      title: "Kỳ Thi Chọn Học Sinh Giỏi Quốc Gia 2026",
      date: "15 Tháng 9, 2026",
      category: "Kỳ Thi",
      important: true,
    },
    {
      id: 2,
      title: "Hội Thảo Ứng Dụng AI Trong Đổi Mới Giáo Dục THPT",
      date: "28 Tháng 9, 2026",
      category: "Hội Thảo",
      important: false,
    },
    {
      id: 3,
      title: "Họp Phụ Huynh Toàn Trường Đầu Năm Học",
      date: "05 Tháng 10, 2026",
      category: "Sự Kiện",
      important: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-[#e1e2ec] flex flex-col md:flex-row relative font-sans">
      {/* Background Lighting Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[150px]" />
      </div>

      {/* Sidebar Navigation */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-[#0f1524]/80 backdrop-blur-xl border-r border-[#7bd1fa]/15 z-40 p-5 justify-between">
        <div className="space-y-8">
          {/* School Brand Header */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 via-blue-500 to-cyan-400 p-[1px] shadow-[0_0_20px_rgba(168,85,247,0.4)]">
              <div className="w-full h-full bg-[#0a0e1a] rounded-[11px] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-purple-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
                E-V-E <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">SCHOOL</span>
              </h1>
              <p className="text-xs text-[#8e9bb4]">School Executive Command</p>
            </div>
          </div>

          {/* Sidebar Menu Items */}
          <nav className="space-y-1.5">
            {[
              { label: "Teacher Management", icon: BarChart3, href: "/dashbroad/school/TeacherManagement", active: true },
              { label: "Student Management", icon: GraduationCap, href: "/dashbroad/school/StudentManagement", active: false },
            ].map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  item.active
                    ? "bg-gradient-to-r from-purple-600/25 to-blue-500/15 text-purple-300 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                    : "text-[#8e9bb4] hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className={`w-5 h-5 ${item.active ? "text-purple-400" : "text-[#8e9bb4]"}`} />
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* System Health Indicator & Bottom Tools */}
        <div className="space-y-4 pt-6 border-t border-[#7bd1fa]/10">
          <div className="p-4 rounded-2xl bg-[#151b2c] border border-purple-500/20 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8e9bb4]">Hệ thống AI School</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Active
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#0a0e1a] overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full w-[99.9%]" />
            </div>
          </div>

          <div className="flex items-center justify-between px-2 text-[#8e9bb4]">
            <a href="#" className="hover:text-white transition-colors flex items-center gap-2 text-xs">
              <Settings className="w-4 h-4" /> Hệ thống
            </a>
            <a href="#" className="hover:text-white transition-colors flex items-center gap-2 text-xs">
              <HelpCircle className="w-4 h-4" /> Hướng dẫn
            </a>
          </div>
        </div>
      </aside>

      {/* Executive Command Workspace */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 z-10 space-y-8">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/10">
          <div>
            <div className="flex items-center gap-2 text-sm text-purple-400 font-medium mb-1">
              <span className="inline-block w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              Ban Giám Hiệu • Trường THPT Chuyên E-V-E
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Trung Tâm Điều Hành Nhà Trường 🏛️
            </h1>
            <p className="text-sm text-[#8e9bb4] mt-1">Giám sát tổng thể hoạt động giảng dạy, học tập và hạ tầng chuyển đổi số toàn trường.</p>
          </div>

          {/* Academic Year Switcher & Report Button */}
          <div className="flex items-center gap-3">
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="bg-[#151b2c] border border-purple-500/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-400 cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.1)]"
            >
              <option value="2025-2026">Năm học 2025 - 2026</option>
              <option value="2024-2025">Năm học 2024 - 2025</option>
            </select>

            <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium text-sm shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all flex items-center gap-2">
              <Download className="w-4 h-4" /> Xuất Báo Cáo
            </button>
          </div>
        </header>

        {/* Executive KPI Banner */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {schoolMetrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border border-[#7bd1fa]/15 hover:border-purple-500/40 hover-card-lift transition-all space-y-3"
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

        {/* Executive Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Grade Breakdown & Department Performance (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Grade Breakdown Cards */}
            <section className="p-6 rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border border-[#7bd1fa]/15 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-purple-400" /> Thống Kê Các Khối Học
                  </h2>
                  <p className="text-xs text-[#8e9bb4]">Phân bổ sĩ số và điểm trung bình theo khối</p>
                </div>
                <span className="text-xs text-cyan-400 font-semibold">37 Lớp Học Toàn Trường</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {gradeBreakdown.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#151b2c]/60 border border-[#7bd1fa]/10 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-base text-white">{item.grade}</span>
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-xs font-semibold">
                        {item.classes} Lớp
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xl font-extrabold text-white">{item.students} HS</div>
                      <div className="text-xs text-[#8e9bb4]">Điểm TB Khối: <span className="text-emerald-400 font-bold">{item.avgGpa}</span></div>
                    </div>

                    <div className="w-full h-2 rounded-full bg-[#0a0e1a] overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${item.color} rounded-full`} style={{ width: `${item.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Department Leaderboard & Ranking */}
            <section className="p-6 rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border border-[#7bd1fa]/15 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" /> Xếp Hạng Thi Đua Tổ Bộ Môn
                  </h2>
                  <p className="text-xs text-[#8e9bb4]">Đánh giá chất lượng giảng dạy & tích cực ứng dụng AI</p>
                </div>
              </div>

              <div className="space-y-3">
                {departmentRanking.map((dept, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#151b2c]/60 border border-[#7bd1fa]/10 hover:border-purple-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-sm">
                        #{idx + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-white">{dept.name}</h4>
                        <p className="text-xs text-[#8e9bb4]">Tổ trưởng: {dept.head} • {dept.classes} Lớp</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-start sm:self-auto">
                      <div className="text-right">
                        <div className="text-sm font-bold text-emerald-400">{dept.rating}</div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {dept.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: School Events & Announcements (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* School Wide Announcements */}
            <section className="p-6 rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border border-[#7bd1fa]/15 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-cyan-400" /> Thông Báo & Sự Kiện
                </h2>
                <button className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {schoolEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      ev.important
                        ? "bg-purple-600/10 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                        : "bg-[#151b2c]/60 border-[#7bd1fa]/10"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-purple-300">{ev.date}</span>
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                        {ev.category}
                      </span>
                    </div>
                    <h4 className="font-semibold text-sm text-white mb-2">{ev.title}</h4>
                    <button className="w-full py-1 rounded-lg bg-[#1f273d] hover:bg-[#28334f] text-[#e1e2ec] text-xs font-medium border border-[#7bd1fa]/15 transition-all">
                      Xem Nội Dung Chi Tiết
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Emergency Broadcast / Quick Executive Action */}
            <section className="p-6 rounded-2xl bg-gradient-to-br from-purple-950/40 via-[#0f1524] to-blue-950/40 border border-purple-500/30 space-y-4">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
                <Radio className="w-4 h-4 text-purple-400 animate-pulse" /> Phát Thông Báo Toàn Trường
              </div>
              <p className="text-xs text-[#8e9bb4]">
                Gửi thông tin khẩn cấp hoặc lịch điều chỉnh năm học đến toàn bộ học sinh và phụ huynh.
              </p>

              <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-xs shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all">
                Tạo Thông Báo Phát Sóng
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}