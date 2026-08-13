"use client";

import React from "react";
import Link from "next/link";
import { useStudentAdapter } from "@/hooks/useStudentAdapter";
import { Users, Clock, Plus, ArrowRight, GraduationCap } from "lucide-react";

export default function StudentClassPage() {
  const { courses, loading } = useStudentAdapter();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] text-[#e1e2ec] flex items-center justify-center font-sans">
        <p className="text-cyan-400 font-medium">Đang tải danh sách lớp học...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-[#e1e2ec] p-4 md:p-8 font-sans space-y-8">
      {/* Top Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/10">
        <div>
          <div className="flex items-center gap-2 text-sm text-cyan-400 font-medium mb-1">
            <GraduationCap className="w-4 h-4" /> Danh sách lớp học
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Khóa Học Của Tôi 📚
          </h1>
          <p className="text-sm text-[#8e9bb4] mt-1">Các lớp học trực tuyến bạn đang tham gia học kỳ này.</p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-medium text-sm shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2 self-start md:self-auto">
          <Plus className="w-4 h-4" /> Đăng Ký Lớp Mới
        </button>
      </header>

      {/* Grid of Classes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((cls) => (
          <div
            key={cls.id}
            className="p-5 rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border border-[#7bd1fa]/15 hover:border-cyan-500/40 hover-card-lift transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-500/10 text-cyan-300 border border-blue-500/20 text-xs font-medium">
                  {cls.tag}
                </span>
                <span className="text-xs text-[#8e9bb4] flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> 40 Học sinh
                </span>
              </div>

              <h3 className="font-bold text-lg text-white">{cls.title}</h3>
              <p className="text-xs text-[#8e9bb4]">Giảng viên: {cls.instructor}</p>

              {/* Progress */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#8e9bb4]">Tiến độ học</span>
                  <span className="font-bold text-cyan-400">{cls.progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#0a0e1a] overflow-hidden">
                  <div className={`h-full rounded-full bg-gradient-to-r ${cls.color}`} style={{ width: `${cls.progress}%` }} />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[#7bd1fa]/10 flex items-center justify-between text-xs">
              <span className="text-[#8e9bb4] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> {cls.nextLesson}
              </span>
              <Link
                href={`/dashbroad/student/Class/Assignment`}
                className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-cyan-300 font-medium border border-blue-500/30 transition-all flex items-center gap-1"
              >
                Vào Lớp <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
