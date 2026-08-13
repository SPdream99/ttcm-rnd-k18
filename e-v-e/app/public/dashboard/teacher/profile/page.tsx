'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function TeacherProfilePage() {
  const [tab, setTab] = useState<'info' | 'password'>('info');
  const [displayName, setDisplayName] = useState('ThS. Trần Thị Bình');
  const [email, setEmail] = useState('binh.tran@teacher.edu.vn');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('✅ Đã cập nhật thành công thông tin cá nhân!');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('🔑 Đã thay đổi mật khẩu thành công!');
    setOldPassword('');
    setNewPassword('');
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6 md:p-10 font-sans">
      <header className="max-w-4xl mx-auto flex justify-between items-center pb-6 border-b border-emerald-500/20 mb-8">
        <div className="flex items-center gap-3">
          <Link href="/public/dashboard/teacher" className="font-mono text-xs text-emerald-400 hover:underline">
            ← Dashboard Giảng Viên
          </Link>
          <span className="text-slate-600 font-mono">/</span>
          <span className="font-mono text-sm text-white font-bold">TEACHER PROFILE</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto space-y-6">
        <div className="p-8 rounded-3xl bg-[#0f1524]/80 border border-emerald-500/30 backdrop-blur-xl shadow-2xl space-y-6">
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 text-3xl">
              👨‍🏫
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{displayName}</h1>
              <p className="font-mono text-xs text-emerald-300">Bộ Môn Công Nghệ Thông Tin & AI</p>
            </div>
          </div>

          {/* Sub Navigation Tabs: Reset password | rechange Info */}
          <div className="flex gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
            <button
              onClick={() => { setTab('info'); setMsg(''); }}
              className={`flex-1 py-2.5 rounded-lg transition-all ${
                tab === 'info' ? 'bg-emerald-500 text-black font-bold shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              ✏️ Rechange Info (Cập Nhật Thông Tin)
            </button>
            <button
              onClick={() => { setTab('password'); setMsg(''); }}
              className={`flex-1 py-2.5 rounded-lg transition-all ${
                tab === 'password' ? 'bg-emerald-500 text-black font-bold shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              🔒 Reset Password (Đổi Mật Khẩu)
            </button>
          </div>

          {msg && (
            <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
              {msg}
            </div>
          )}

          {tab === 'info' ? (
            <form onSubmit={handleSaveInfo} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Họ Và Tên</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Email Giảng Viên</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-mono text-xs transition-all"
              >
                Lưu Thay Đổi Thông Tin
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Mật Khẩu Hiện Tại</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Mật Khẩu Mới</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-mono text-xs transition-all"
              >
                Cập Nhật Mật Khẩu Mới
              </button>
            </form>
          )}

        </div>
      </main>
    </div>
  );
}
