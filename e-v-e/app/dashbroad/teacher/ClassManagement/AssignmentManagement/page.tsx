"use client";

import React from "react";
import { useTeacherAdapter } from "@/hooks/useTeacherAdapter";
import { FileCheck, Plus, Sparkles, Edit } from "lucide-react";

export default function TeacherAssignmentManagementPage() {
  const { assignments, loading } = useTeacherAdapter();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] text-[#e1e2ec] flex items-center justify-center font-sans">
        <p className="text-emerald-400 font-medium">Đang tải bài tập giảng viên...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-[#e1e2ec] p-4 md:p-8 font-sans space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/10">
        <div>
          <div className="flex items-center gap-2 text-sm text-emerald-400 font-medium mb-1">
            <FileCheck className="w-4 h-4" /> Quản lý bài tập & Đề thi
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Ngân Hàng Bài Tập Giáo Viên 📋
          </h1>
          <p className="text-sm text-[#8e9bb4] mt-1">Tạo bài tập mới, tự động chấm bằng AI và theo dõi nộp bài.</p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-medium text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2 self-start md:self-auto">
          <Plus className="w-4 h-4" /> Tạo Bài Tập Mới
        </button>
      </header>

      <div className="space-y-4">
        {assignments.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border border-[#7bd1fa]/15 hover:border-emerald-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  Lớp {item.className}
                </span>
                <span className="text-[#8e9bb4] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Trạng thái: {item.status}
                </span>
              </div>
              <h3 className="font-bold text-base text-white">{item.title}</h3>
              <p className="text-xs text-[#8e9bb4]">Hạn nộp: {item.dueDate} • Đã nộp: <span className="text-cyan-400 font-bold">{item.submittedCount}/{item.totalCount}</span></p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <button className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all">
                Duyệt & Chấm Bài
              </button>
              <button className="p-2 rounded-xl bg-[#151b2c] border border-[#7bd1fa]/20 text-[#8e9bb4] hover:text-white transition-all">
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
