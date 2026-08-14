"use client";

import GetUserData from "@/components/GetUserData";
import { useState } from "react";
import { User, Award, Flame, Bell, Save,  } from "lucide-react";
import Logout from "@/components/LogoutForm";

export default function StudentProfilePage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
const { userData, loading } = GetUserData();
  if (loading) {
    return <header>Loading...</header>;
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-[#e1e2ec] p-4 md:p-8 font-sans space-y-8 max-w-4xl mx-auto">
      <header className="pb-6 border-b border-[#7bd1fa]/10">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Trang Cá Nhân & Cài Đặt 👤
        </h1>
        <p className="text-sm text-[#8e9bb4] mt-1">Quản lý thông tin tài khoản Explorer và cài đặt thông báo.</p>
      </header>

      {/* Profile Card Header */}
      <div className="p-6 rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border border-[#7bd1fa]/15 flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 p-[2px] shadow-[0_0_25px_rgba(59,130,246,0.4)]">
            <div className="w-full h-full rounded-full bg-[#0a0e1a] flex items-center justify-center">
              <User className="w-10 h-10 text-cyan-300" />
            </div>
          </div>
        </div>

        <div className="space-y-1 text-center sm:text-left">
          <h2 className="text-xl font-bold text-white flex items-center justify-center sm:justify-start gap-2">
            {userData?.name} <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs border border-cyan-500/30"> {userData?.role}</span>
          </h2>
          <p className="text-xs text-[#8e9bb4]">Mã SV: EVE-2026-8890 • Lớp: 12A1 Chuyên Lý</p>
          <div className="flex items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-amber-400 font-semibold">
            <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5" /> Chuỗi 7 ngày</span>
            <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-cyan-400" /> GPA 3.85/4.0</span>
          </div>
        </div>
     <div className="sm:ml-auto shrink-0">
      <Logout />
     </div>

      </div>

      {/* Edit Form */}
      <div className="p-6 rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border border-[#7bd1fa]/15 space-y-6">
        <h3 className="font-bold text-base text-white border-b border-[#7bd1fa]/10 pb-3">Thông Tin Chi Tiết</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-[#8e9bb4] block mb-1.5 font-medium">Name</label>
            <input type="text" defaultValue={userData?.name} className="w-full bg-[#151b2c] border border-[#7bd1fa]/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400" />
          </div>
          <div>
            <label className="text-xs text-[#8e9bb4] block mb-1.5 font-medium">Email</label>
            <input type="email" defaultValue={userData?.email} className="w-full bg-[#151b2c] border border-[#7bd1fa]/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400" />
          </div>
                    <div>
            <label className="text-xs text-[#8e9bb4] block mb-1.5 font-medium">Phone</label>
            <input type="tel" defaultValue={userData?.phone_number} className="w-full bg-[#151b2c] border border-[#7bd1fa]/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400" />
          </div>
          <div>
            <label className="text-xs text-[#8e9bb4] block mb-1.5 font-medium">Address</label>
            <input type="text" defaultValue={userData?.coin} className="w-full bg-[#151b2c] border border-[#7bd1fa]/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400" />
          </div>
        </div>

        <div className="pt-4 border-t border-[#7bd1fa]/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-sm font-semibold text-white">Nhận thông báo qua Email</div>
              <div className="text-xs text-[#8e9bb4]">Nhắc nhở lịch học và hạn nộp bài tập</div>
            </div>
          </div>
          <input type="checkbox" checked={emailNotifications} onChange={(e) => setEmailNotifications(e.target.checked)} className="w-5 h-5 accent-blue-600 cursor-pointer" />
        </div>

        <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-medium text-sm shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2">
          <Save className="w-4 h-4" /> Lưu Thay Đổi
        </button>
      </div>
    </div>
  );
}
