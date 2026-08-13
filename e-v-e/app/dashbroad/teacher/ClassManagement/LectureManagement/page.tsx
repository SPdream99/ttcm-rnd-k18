"use client";

import React from "react";
import { useTeacherAdapter } from "@/hooks/useTeacherAdapter";
import { BookOpen, Plus, Eye } from "lucide-react";

export default function TeacherLectureManagementPage() {
  const { lectures, loading } = useTeacherAdapter();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] text-[#e1e2ec] flex items-center justify-center font-sans">
        <p className="text-emerald-400 font-medium">Đang tải danh sách bài giảng...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-[#e1e2ec] p-4 md:p-8 font-sans space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/10">
        <div>
          <div className="flex items-center gap-2 text-sm text-emerald-400 font-medium mb-1">
            <BookOpen className="w-4 h-4" /> Quản lý bài giảng
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Kho Bài Giảng & Tài Liệu 📖
          </h1>
          <p className="text-sm text-[#8e9bb4] mt-1">Đăng tải bài giảng video, slide bài học và quiz tương tác.</p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-medium text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2 self-start md:self-auto">
          <Plus className="w-4 h-4" /> Đăng Bài Giảng Mới
        </button>
      </header>

      <div className="space-y-4">
        {lectures.map((lec) => (
          <div
            key={lec.id}
            className="p-5 rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border border-[#7bd1fa]/15 hover:border-emerald-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30">
                  {lec.className}
                </span>
                <span className="text-[#8e9bb4]">Ngày: {lec.date}</span>
              </div>
              <h3 className="font-bold text-base text-white">{lec.title}</h3>
              <p className="text-xs text-[#8e9bb4]">Thời lượng: {lec.duration} • Slide: {lec.slidesCount} trang</p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <button className="px-3 py-1.5 rounded-xl bg-[#151b2c] hover:bg-[#1f273d] text-white text-xs font-medium border border-[#7bd1fa]/20 transition-all flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-emerald-400" /> Xem Trước
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
