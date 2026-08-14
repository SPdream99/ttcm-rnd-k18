"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStudentAdapter } from "@/hooks/useStudentAdapter";
import {
  GraduationCap,
  Users,
  Clock,
  Plus,
  ArrowRight,
  BookOpen,
  FileText,
  Search,
  Sparkles,
  Video,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Layers,
} from "lucide-react";

export default function StudentClassesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tagFilter, setTagFilter] = useState("all");
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [enrollKey, setEnrollKey] = useState("");
  const [enrollSuccess, setEnrollSuccess] = useState(false);

  const { courses, upcomingClasses, loading } = useStudentAdapter();

  const filteredCourses = courses.filter((cls) => {
    const matchesSearch =
      cls.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.tag.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = tagFilter === "all" || cls.tag.toLowerCase() === tagFilter.toLowerCase();
    return matchesSearch && matchesTag;
  });

  const availableTags = Array.from(new Set(courses.map((c) => c.tag)));

  const handleEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollKey.trim()) return;
    setEnrollSuccess(true);
    setTimeout(() => {
      setEnrollSuccess(false);
      setIsRegisterModalOpen(false);
      setEnrollKey("");
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
        <p className="text-cyan-400 font-medium text-sm">Đang đồng bộ dữ liệu lớp học sinh viên...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* ── Header ── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1.5">
            <GraduationCap className="w-4 h-4" /> Danh Sách Lớp Học Trực Tuyến
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Khóa Học Của Tôi 📚
          </h1>
          <p className="text-xs md:text-sm text-[#8e9bb4] mt-1">
            Không gian học tập tương tác, quản lý tiến độ bài giảng và lớp học kỳ này.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <Link
            href="/student/classes/assignments"
            className="px-4 py-2.5 rounded-xl bg-[#151b2c] hover:bg-[#1f273d] text-cyan-300 border border-[#7bd1fa]/20 font-medium text-xs md:text-sm transition-all flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-cyan-400" /> Xem Tất Cả Bài Tập
          </Link>
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-cyan-300 text-white font-semibold text-xs md:text-sm shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Đăng Ký Lớp Mới
          </button>
        </div>
      </header>

      {/* ── Quick Stats Strip ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border border-[#7bd1fa]/15">
          <div className="text-[11px] font-semibold text-[#8e9bb4] uppercase flex items-center gap-1.5 mb-1">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> Tổng Lớp Đang Học
          </div>
          <div className="text-2xl font-black text-white">{courses.length} Lớp</div>
          <p className="text-[10px] text-cyan-300/70 mt-0.5">Học kỳ 1 • 2026 - 2027</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border border-[#7bd1fa]/15">
          <div className="text-[11px] font-semibold text-[#8e9bb4] uppercase flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-emerald-400" /> Tiến Độ Trung Bình
          </div>
          <div className="text-2xl font-black text-emerald-300">
            {courses.length > 0
              ? Math.round(courses.reduce((acc, c) => acc + c.progress, 0) / courses.length)
              : 0}%
          </div>
          <p className="text-[10px] text-emerald-300/70 mt-0.5">Hoàn thành đúng tiến độ</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border border-[#7bd1fa]/15">
          <div className="text-[11px] font-semibold text-[#8e9bb4] uppercase flex items-center gap-1.5 mb-1">
            <FileText className="w-3.5 h-3.5 text-amber-400" /> Bài Tập Cần Nộp
          </div>
          <div className="text-2xl font-black text-amber-300">3 Bài</div>
          <p className="text-[10px] text-amber-300/70 mt-0.5">2 bài sắp tới hạn</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border border-[#7bd1fa]/15">
          <div className="text-[11px] font-semibold text-[#8e9bb4] uppercase flex items-center gap-1.5 mb-1">
            <Users className="w-3.5 h-3.5 text-purple-400" /> Sĩ Số Lớp Trung Bình
          </div>
          <div className="text-2xl font-black text-purple-300">38 HS</div>
          <p className="text-[10px] text-purple-300/70 mt-0.5">Tương tác nhóm tích cực</p>
        </div>
      </div>

      {/* ── Search and Filter Controls ── */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e9bb4]" />
          <input
            type="text"
            placeholder="Tìm theo tên môn, giảng viên, môn học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#151b2c] border border-[#7bd1fa]/20 rounded-xl pl-9 pr-4 py-2.5 text-xs md:text-sm text-white placeholder-[#8e9bb4] focus:outline-none focus:border-cyan-400 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setTagFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              tagFilter === "all"
                ? "bg-cyan-500 text-[#0a0e1a] shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                : "bg-[#151b2c] text-[#8e9bb4] hover:text-white border border-[#7bd1fa]/15"
            }`}
          >
            Tất Cả ({courses.length})
          </button>
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setTagFilter(tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                tagFilter.toLowerCase() === tag.toLowerCase()
                  ? "bg-cyan-500 text-[#0a0e1a] shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                  : "bg-[#151b2c] text-[#8e9bb4] hover:text-white border border-[#7bd1fa]/15"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* ── Courses Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((cls) => (
          <div
            key={cls.id}
            className="p-6 rounded-2xl bg-[#0f1524]/70 backdrop-blur-xl border border-[#7bd1fa]/15 hover:border-cyan-400/40 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] transition-all flex flex-col justify-between space-y-5 group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 text-xs font-bold tracking-wide">
                  {cls.tag}
                </span>
                <span className="text-xs text-[#8e9bb4] flex items-center gap-1.5 font-medium">
                  <Users className="w-3.5 h-3.5 text-cyan-400" /> 40 Học sinh
                </span>
              </div>

              <div>
                <h3 className="font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">
                  {cls.title}
                </h3>
                <p className="text-xs text-[#8e9bb4] mt-1 flex items-center gap-1">
                  Giảng viên: <span className="text-slate-300 font-medium">{cls.instructor}</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-2 bg-[#151b2c]/80 p-2 rounded-lg border border-[#7bd1fa]/10">
                  <span className="text-cyan-400 font-semibold">Chương hiện tại:</span> {cls.currentChapter}
                </p>
              </div>

              {/* Progress */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[#8e9bb4]">Tiến độ học tập</span>
                  <span className="text-cyan-300 font-mono">{cls.progress}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#0a0e1a] overflow-hidden p-[1px] border border-[#7bd1fa]/15">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${cls.color || "from-blue-500 to-cyan-400"} transition-all duration-700`}
                    style={{ width: `${cls.progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Next Lesson & Nav Links */}
            <div className="pt-4 border-t border-[#7bd1fa]/10 space-y-3">
              <div className="text-xs text-[#8e9bb4] flex items-start gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span className="truncate">
                  <strong className="text-slate-300">Tiếp theo:</strong> {cls.nextLesson}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Link
                  href="/student/classes/assignments"
                  className="px-2.5 py-1.5 rounded-lg bg-[#151b2c] hover:bg-[#1f273d] text-[#8e9bb4] hover:text-cyan-300 text-[11px] font-medium border border-[#7bd1fa]/15 transition-all text-center flex items-center justify-center gap-1"
                >
                  <FileText className="w-3 h-3" /> Bài tập
                </Link>
                <Link
                  href="/student/classes/members"
                  className="px-2.5 py-1.5 rounded-lg bg-[#151b2c] hover:bg-[#1f273d] text-[#8e9bb4] hover:text-cyan-300 text-[11px] font-medium border border-[#7bd1fa]/15 transition-all text-center flex items-center justify-center gap-1"
                >
                  <Users className="w-3 h-3" /> Thành viên
                </Link>
                <Link
                  href="/student/learning-paths"
                  className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-[11px] font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all text-center flex items-center justify-center gap-1"
                >
                  Vào Học <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Upcoming Online Sessions ── */}
      <section className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-[#0f1524] to-cyan-950/30 border border-cyan-500/25 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" /> Lịch Học Trực Tuyến Sắp Diễn Ra
          </h2>
          <span className="text-xs text-cyan-300 font-semibold">Tuần Này</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingClasses.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                item.urgent
                  ? "bg-blue-600/10 border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                  : "bg-[#151b2c]/60 border-[#7bd1fa]/15"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-300">{item.time}</span>
                  {item.urgent && (
                    <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-bold border border-red-500/30 animate-pulse">
                      SẮP DIỄN RA
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-sm text-white">{item.title}</h4>
                <p className="text-xs text-[#8e9bb4]">
                  {item.instructor} • Phòng: <span className="text-slate-300 font-medium">{item.room}</span>
                </p>
              </div>

              <button
                onClick={() => alert(`Đang kết nối vào phòng học trực tuyến: ${item.room}`)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shrink-0 ${
                  item.urgent
                    ? "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                    : "bg-[#1f273d] hover:bg-[#28334f] text-cyan-300 border border-[#7bd1fa]/20"
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                {item.urgent ? "Vào Phòng Học Ngay" : "Chi Tiết Lớp"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Modal Đăng Ký Lớp Mới ── */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0f1524] border border-[#7bd1fa]/30 rounded-2xl p-6 shadow-[0_0_40px_rgba(6,182,212,0.25)] space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#7bd1fa]/10 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Đăng Ký Tham Gia Lớp</h3>
                  <p className="text-xs text-[#8e9bb4]">Nhập mã lớp được Thầy/Cô cấp</p>
                </div>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="text-[#8e9bb4] hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {enrollSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                Đăng ký tham gia lớp học thành công! Đang chuyển tiếp...
              </div>
            ) : (
              <form onSubmit={handleEnroll} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Mã Lớp Học (Class Code / Invitation Key)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: EVE-PHYS-2026 hoặc MATH-A1-K18"
                    value={enrollKey}
                    onChange={(e) => setEnrollKey(e.target.value)}
                    className="w-full bg-[#151b2c] border border-[#7bd1fa]/25 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder-[#8e9bb4] focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-[#8e9bb4] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    Sau khi nhập mã lớp, bạn sẽ được tự động đồng bộ thời khóa biểu, tài liệu học tập và nhiệm vụ bài giảng của lớp.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsRegisterModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#151b2c] hover:bg-[#1f273d] text-[#8e9bb4] hover:text-white text-xs font-semibold transition-all"
                  >
                    Hủy Bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
                  >
                    Xác Nhận Tham Gia
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
