'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher' | 'school'>('student');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'school') {
      window.location.href = '/public/dashboard/school';
    } else if (role === 'teacher') {
      window.location.href = '/public/dashboard/teacher';
    } else {
      window.location.href = '/public/dashboard/student';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex flex-col justify-between p-6 font-sans relative overflow-hidden selection:bg-sky-500 selection:text-black">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/15 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="max-w-6xl w-full mx-auto flex justify-between items-center z-10">
        <Link href="/public/demo" className="flex items-center gap-2 group">
          <span className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 font-bold group-hover:scale-105 transition-transform">
            ⚡
          </span>
          <span className="font-mono text-xl font-bold tracking-widest text-sky-400">E-V-E SYSTEM</span>
        </Link>

        <Link
          href="/public/demo"
          className="px-4 py-1.5 rounded-full border border-sky-500/30 bg-slate-900/60 hover:bg-slate-800 text-sky-300 text-xs font-mono transition-all"
        >
          ← Trang Chủ Demo
        </Link>
      </header>

      {/* Login Card Container */}
      <main className="max-w-md w-full mx-auto z-10 py-12">
        <div className="p-8 md:p-10 rounded-3xl bg-[#0f1524]/75 border border-sky-400/20 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] space-y-6">
          
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 font-mono text-xs mb-2">
              🔒 HỆ THỐNG XÁC THỰC E-V-E
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Đăng Nhập Tài Khoản</h1>
            <p className="text-xs text-sky-200/70 leading-relaxed font-mono">
              💡 <span className="font-semibold text-sky-300">Nhà Trường sẽ cung cấp tài khoản riêng</span> cho mỗi Giảng Viên và Học Sinh.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">Chọn Phân Hệ Đăng Nhập</label>
              <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-slate-950/80 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`py-2 rounded-lg font-mono text-xs transition-all ${
                    role === 'student' ? 'bg-sky-500 text-black font-bold shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🎓 Học Sinh
                </button>
                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`py-2 rounded-lg font-mono text-xs transition-all ${
                    role === 'teacher' ? 'bg-emerald-400 text-black font-bold shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  👨‍🏫 Giảng Viên
                </button>
                <button
                  type="button"
                  onClick={() => setRole('school')}
                  className={`py-2 rounded-lg font-mono text-xs transition-all ${
                    role === 'school' ? 'bg-purple-400 text-black font-bold shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🏫 Nhà Trường
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">Email Được Cấp</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@truong.edu.vn"
                className="w-full bg-slate-950/80 border border-sky-500/20 focus:border-sky-400 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">Mật Khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950/80 border border-sky-500/20 focus:border-sky-400 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold font-mono text-sm shadow-[0_0_25px_rgba(125,211,252,0.4)] transition-all hover:scale-[1.02]"
            >
              🚀 Đăng Nhập Vào Dashboard
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800/80 text-center">
            <Link
              href="/public/demo"
              className="text-xs font-mono text-sky-400 hover:underline"
            >
              Chưa có tài khoản? Xem Luồng Demo Người Dùng →
            </Link>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="text-center font-mono text-xs text-slate-500 z-10 py-4">
        © 2026 E-V-E EDUCATION PLATFORM • GLACIER GLASSMORPHISM
      </footer>
    </div>
  );
}
