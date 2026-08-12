"use client";

import React from "react";
import { User, Mail, GraduationCap, Award, BookOpen, Save, Shield } from "lucide-react";

export default function TeacherProfilePage() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-[#e1e2ec] p-4 md:p-8 font-sans space-y-8 max-w-4xl mx-auto">
      <header className="pb-6 border-b border-[#7bd1fa]/10">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Hồ Sơ Giảng Viên & Thiết Lập 👨‍🏫
        </h1>
        <p className="text-sm text-[#8e9bb4] mt-1">Thông tin công tác, học hàm học vị và ngân hàng đề thi AI.</p>
      </header>

      <div className="p-6 rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border border-[#7bd1fa]/15 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-600 p-[2px] shadow-[0_0_25px_rgba(16,185,129,0.4)]">
          <div className="w-full h-full rounded-full bg-[#0a0e1a] flex items-center justify-center">
            <GraduationCap className="w-10 h-10 text-emerald-400" />
          </div>
        </div>

        <div className="space-y-1 text-center sm:text-left">
          <h2 className="text-xl font-bold text-white flex items-center justify-center sm:justify-start gap-2">
            ThS. Phạm Hoàng Nam <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs border border-emerald-500/30">Giảng Viên Tiêu Biểu</span>
          </h2>
          <p className="text-xs text-[#8e9bb4]">Tổ Vật Lý & Công Nghệ AI • Trường THPT Chuyên E-V-E</p>
          <div className="flex items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-emerald-400 font-semibold">
            <span>3 Lớp Giảng Dạy (115 HS)</span> • <span>Đánh giá AI: 9.8/10</span>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border border-[#7bd1fa]/15 space-y-6">
        <h3 className="font-bold text-base text-white border-b border-[#7bd1fa]/10 pb-3">Thông Tin Giảng Dạy</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-[#8e9bb4] block mb-1.5 font-medium">Họ và tên giảng viên</label>
            <input type="text" defaultValue="Phạm Hoàng Nam" className="w-full bg-[#151b2c] border border-[#7bd1fa]/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400" />
          </div>
          <div>
            <label className="text-xs text-[#8e9bb4] block mb-1.5 font-medium">Email giảng dạy</label>
            <input type="email" defaultValue="nam.ph@eve.edu.vn" className="w-full bg-[#151b2c] border border-[#7bd1fa]/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400" />
          </div>
        </div>

        <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-medium text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2">
          <Save className="w-4 h-4" /> Cập Nhật Hồ Sơ
        </button>
      </div>
    </div>
  );
}
