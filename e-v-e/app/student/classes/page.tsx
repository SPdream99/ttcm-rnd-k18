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
} from "lucide-react";

export default function StudentClassesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tagFilter, setTagFilter] = useState("all");
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [enrollKey, setEnrollKey] = useState("");
  const [enrollSuccess, setEnrollSuccess] = useState(false);

  const { courses, loading } = useStudentAdapter();

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
        <div className="w-10 h-10 rounded-full border-4 border-zinc-200 border-t-red-600 animate-spin" />
        <p className="text-red-600 font-medium text-sm">Đang đồng bộ dữ liệu lớp học sinh viên...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* ── Header ── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 mb-1.5">
            <GraduationCap className="w-4 h-4" /> Danh Sách Lớp Học Trực Tuyến
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
            Khóa Học Của Tôi 📚
          </h1>
          <p className="text-xs md:text-sm text-zinc-600 mt-1">
            Không gian học tập tương tác, quản lý tiến độ bài giảng và lớp học kỳ này.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <Link
            href="/student/classes/assignments"
            className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 font-bold text-xs md:text-sm transition-colors flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-red-600" /> Xem Tất Cả Bài Tập
          </Link>
          <Link
            href="/student/learning-paths"
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs md:text-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Đăng Ký Lớp Mới
          </Link>
        </div>
      </header>

      {/* ── Quick Stats Strip ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-sm">
          <div className="text-[11px] font-bold text-zinc-500 uppercase flex items-center gap-1.5 mb-1">
            <BookOpen className="w-3.5 h-3.5 text-red-600" /> Tổng Lớp Đang Học
          </div>
          <div className="text-2xl font-black text-zinc-900">{courses.length} Lớp</div>
          <p className="text-[10px] text-zinc-500 mt-0.5">Học kỳ 1 • 2026 - 2027</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-sm">
          <div className="text-[11px] font-bold text-zinc-500 uppercase flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-red-600" /> Tiến Độ Trung Bình
          </div>
          <div className="text-2xl font-black text-red-600">
            {courses.length > 0
              ? Math.round(courses.reduce((acc, c) => acc + c.progress, 0) / courses.length)
              : 0}%
          </div>
          <p className="text-[10px] text-zinc-500 mt-0.5">Hoàn thành đúng tiến độ</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-sm">
          <div className="text-[11px] font-bold text-zinc-500 uppercase flex items-center gap-1.5 mb-1">
            <FileText className="w-3.5 h-3.5 text-red-600" /> Bài Tập Cần Nộp
          </div>
          <div className="text-2xl font-black text-zinc-900">3 Bài</div>
          <p className="text-[10px] text-zinc-500 mt-0.5">2 bài sắp tới hạn</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-sm">
          <div className="text-[11px] font-bold text-zinc-500 uppercase flex items-center gap-1.5 mb-1">
            <Users className="w-3.5 h-3.5 text-red-600" /> Sĩ Số Lớp Trung Bình
          </div>
          <div className="text-2xl font-black text-zinc-900">38 HS</div>
          <p className="text-[10px] text-zinc-500 mt-0.5">Tương tác nhóm tích cực</p>
        </div>
      </div>

      {/* ── Search and Filter Controls ── */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Tìm theo tên môn, giảng viên, môn học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border-2 border-zinc-200 rounded-xl pl-9 pr-4 py-2.5 text-xs md:text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-red-600 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setTagFilter("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
              tagFilter === "all"
                ? "bg-red-600 text-white"
                : "bg-zinc-100 text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Tất Cả ({courses.length})
          </button>
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setTagFilter(tag)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                tagFilter.toLowerCase() === tag.toLowerCase()
                  ? "bg-red-600 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:text-zinc-900"
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
            className="p-6 rounded-2xl bg-white border border-zinc-200 hover:border-red-600 transition-all flex flex-col justify-between space-y-5 shadow-sm group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-red-50 text-red-700 border border-red-200 text-xs font-bold">
                  {cls.tag}
                </span>
                <span className="text-xs text-zinc-500 flex items-center gap-1.5 font-medium">
                  <Users className="w-3.5 h-3.5 text-red-600" /> 40 Học sinh
                </span>
              </div>

              <div>
                <h3 className="font-bold text-lg text-zinc-900 group-hover:text-red-600 transition-colors">
                  {cls.title}
                </h3>
                <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                  Giảng viên: <span className="text-zinc-800 font-medium">{cls.instructor}</span>
                </p>
                <p className="text-[11px] text-zinc-600 mt-2 bg-zinc-50 p-2 rounded-lg border border-zinc-200">
                  <span className="text-red-600 font-bold">Chương hiện tại:</span> {cls.currentChapter}
                </p>
              </div>

              {/* Progress */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-zinc-500">Tiến độ học tập</span>
                  <span className="text-red-600 font-mono">{cls.progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-red-600 transition-all duration-500"
                    style={{ width: `${cls.progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Next Lesson & Nav Links */}
            <div className="pt-4 border-t border-zinc-100 space-y-3">
              <div className="text-xs text-zinc-500 flex items-start gap-1.5">
                <Clock className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                <span className="truncate">
                  <strong className="text-zinc-800">Tiếp theo:</strong> {cls.nextLesson}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Link
                  href="/student/classes/assignments"
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 text-zinc-700 text-[11px] font-bold border border-zinc-200 transition-colors text-center flex items-center justify-center gap-1"
                >
                  <FileText className="w-3 h-3 text-red-600" /> Bài tập
                </Link>
                <Link
                  href="/student/classes/members"
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 text-zinc-700 text-[11px] font-bold border border-zinc-200 transition-colors text-center flex items-center justify-center gap-1"
                >
                  <Users className="w-3 h-3 text-red-600" /> Lớp
                </Link>
                <Link
                  href={`/student/classes/${cls.id}`}
                  className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold transition-colors text-center flex items-center justify-center gap-1"
                >
                  Vào Học <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
