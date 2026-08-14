"use client";

import React from "react";
import { useStudentAdapter } from "@/hooks/useStudentAdapter";
import { Users, MessageSquare, Shield } from "lucide-react";

export default function StudentClassMemberPage() {
  const { members, loading } = useStudentAdapter();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] text-[#e1e2ec] flex items-center justify-center font-sans">
        <p className="text-cyan-400 font-medium">Đang tải thành viên lớp...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-[#e1e2ec] p-4 md:p-8 font-sans space-y-8">
      <header className="pb-6 border-b border-[#7bd1fa]/10">
        <div className="flex items-center gap-2 text-sm text-cyan-400 font-medium mb-1">
          <Users className="w-4 h-4" /> Thành viên lớp học
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Danh Sách Lớp Vật Lý Lượng Tử 👥
        </h1>
        <p className="text-sm text-[#8e9bb4] mt-1">Các học sinh & Giảng viên phụ trách</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((m) => {
          const isTeacher = m.role === "Teacher";
          return (
            <div
              key={m.id}
              className={`p-4 rounded-2xl border flex items-center justify-between gap-3 backdrop-blur-md transition-all ${
                isTeacher
                  ? "bg-blue-600/10 border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                  : "bg-[#0f1524]/60 border-[#7bd1fa]/15 hover:border-cyan-500/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-white">
                    {m.name.charAt(0)}
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0a0e1a]" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white flex items-center gap-1.5">
                    {m.name} {isTeacher && <Shield className="w-3.5 h-3.5 text-cyan-400" />}
                  </h3>
                  <p className="text-xs text-[#8e9bb4]">{m.role} • {m.email}</p>
                </div>
              </div>

              <button className="p-2 rounded-xl bg-[#151b2c] border border-[#7bd1fa]/20 text-cyan-300 hover:bg-cyan-500/20 transition-all">
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
