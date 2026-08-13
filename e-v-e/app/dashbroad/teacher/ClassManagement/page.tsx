"use client";

import React from "react";
import Link from "next/link";
import { useTeacherAdapter } from "@/hooks/useTeacherAdapter";
import { BookOpen, Users, FileText, Video, ArrowRight } from "lucide-react";

export default function TeacherClassManagementPage() {
  const { classes, loading } = useTeacherAdapter();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] text-[#e1e2ec] flex items-center justify-center font-sans">
        <p className="text-emerald-400 font-medium">Đang tải danh sách quản lý lớp...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-[#e1e2ec] p-4 md:p-8 font-sans space-y-8">
      <header className="pb-6 border-b border-[#7bd1fa]/10">
        <div className="flex items-center gap-2 text-sm text-emerald-400 font-medium mb-1">
          <BookOpen className="w-4 h-4" /> Bàn làm việc giảng dạy
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Quản Lý Lớp Học & Bài Giảng 📖
        </h1>
        <p className="text-sm text-[#8e9bb4] mt-1">Danh sách các lớp học phụ trách và điều hướng quản lý chuyên sâu.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="p-6 rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border border-[#7bd1fa]/15 hover:border-emerald-500/40 transition-all space-y-5"
          >
            <div className="flex justify-between items-center">
              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 text-xs font-semibold border border-emerald-500/20">
                  {cls.subject}
                </span>
                <h3 className="font-bold text-xl text-white mt-1">{cls.name}</h3>
              </div>
              <span className="text-xs text-cyan-400 font-bold">GPA {cls.avgGpa}</span>
            </div>

            <p className="text-xs text-[#8e9bb4]">Sĩ số: {cls.studentsCount} học sinh • Khối {cls.grade}</p>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#7bd1fa]/10">
              <Link
                href="/dashbroad/teacher/ClassManagement/StudentManagement"
                className="p-2.5 rounded-xl bg-[#151b2c] hover:bg-emerald-600/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-all flex flex-col items-center gap-1 text-center"
              >
                <Users className="w-4 h-4" />
                Học sinh
              </Link>
              <Link
                href="/dashbroad/teacher/ClassManagement/AssignmentManagement"
                className="p-2.5 rounded-xl bg-[#151b2c] hover:bg-emerald-600/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-all flex flex-col items-center gap-1 text-center"
              >
                <FileText className="w-4 h-4" />
                Bài tập
              </Link>
              <Link
                href="/dashbroad/teacher/ClassManagement/LectureManagement"
                className="p-2.5 rounded-xl bg-[#151b2c] hover:bg-emerald-600/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-all flex flex-col items-center gap-1 text-center"
              >
                <Video className="w-4 h-4" />
                Bài giảng
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
