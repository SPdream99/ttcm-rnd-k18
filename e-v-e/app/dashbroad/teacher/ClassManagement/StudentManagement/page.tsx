"use client";

import React from "react";
import { useTeacherAdapter } from "@/hooks/useTeacherAdapter";
import { Users, Search, MessageSquare } from "lucide-react";

export default function TeacherStudentManagementPage() {
  const { students, loading } = useTeacherAdapter();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] text-[#e1e2ec] flex items-center justify-center font-sans">
        <p className="text-emerald-400 font-medium">Đang tải danh sách học sinh lớp...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-[#e1e2ec] p-4 md:p-8 font-sans space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/10">
        <div>
          <div className="flex items-center gap-2 text-sm text-emerald-400 font-medium mb-1">
            <Users className="w-4 h-4" /> Danh sách học sinh
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Quản Lý Sĩ Số Lớp 👨‍🎓
          </h1>
          <p className="text-sm text-[#8e9bb4] mt-1">Sổ điểm điện tử, tỷ lệ chuyên cần và hỗ trợ cá nhân hóa.</p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e9bb4]" />
          <input
            type="text"
            placeholder="Tìm tên học sinh, mã HS..."
            className="w-full bg-[#151b2c] border border-emerald-500/30 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-400"
          />
        </div>
      </header>

      {/* Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {students.map((st) => (
          <div
            key={st.id}
            className="p-4 rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border border-[#7bd1fa]/15 hover:border-emerald-500/40 transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {st.status}
              </span>
              <span className="text-xs text-[#8e9bb4]">{st.code}</span>
            </div>

            <div>
              <h3 className="font-bold text-base text-white">{st.name}</h3>
              <div className="flex justify-between items-center text-xs text-[#8e9bb4] mt-1">
                <span>GPA: <strong className="text-white">{st.gpa}</strong></span>
                <span>Chuyên cần: <strong className="text-emerald-400">{st.attendance}</strong></span>
              </div>
            </div>

            <button className="w-full py-1.5 rounded-xl bg-[#151b2c] hover:bg-[#1f273d] text-cyan-300 text-xs font-medium border border-[#7bd1fa]/20 transition-all flex items-center justify-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" /> Nhắn Tin Trực Tiếp
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
