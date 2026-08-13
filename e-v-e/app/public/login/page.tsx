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
    <div className="bg-background text-on-surface min-h-screen flex flex-col items-center justify-center bg-nebula p-margin-mobile md:p-margin-desktop overflow-hidden relative">
      {/* Background Stars Effect */}
      <div
        className="absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(white 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Login Container */}
      <main className="w-full max-w-md relative z-10 my-auto">
        {/* Brand Header */}
        <div className="text-center mb-stack-lg">
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-widest uppercase mb-stack-sm drop-shadow-[0_0_15px_rgba(173,198,255,0.3)]">
            E-V-E
          </h1>

          <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-sm">
            Chào mừng trở lại
          </h2>

          <p className="font-body-md text-body-md text-on-surface-variant">
            Tiếp tục hành trình khám phá tri thức của bạn.
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
      </main>

      {/* Footer */}
      <footer className="text-center font-mono text-xs text-slate-500 z-10 py-4">
        © 2026 E-V-E EDUCATION PLATFORM • GLACIER GLASSMORPHISM
      </footer>
    </div>
  );
}
