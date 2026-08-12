'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function DemoHomePage() {
  // Full User Flows & Routes Data matching exact Site Tree Architecture
  const userFlows = [
    {
      id: 'student-flow',
      role: 'STUDENT & PARENTS FLOW (HỌC SINH & PHỤ HUYNH)',
      title: 'LUỒNG 01: TRẢI NGHIỆM HỌC TẬP TƯƠNG TÁC & PHỤ HUYNH',
      subtitle: 'Dashboard • Profile (Reset password / Rechange Info) • Learning Path • AI Tutor • Conversation • Class (Member / Assignment)',
      icon: '🎓',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
      btnColor: 'bg-sky-500 hover:bg-sky-400 text-black shadow-[0_0_25px_rgba(125,211,252,0.6)]',
      targetUrl: '/public/dashboard/student',
      targetLabel: '🚀 Vào Main Dashboard Học Sinh & Phụ Huynh',
      routes: [
        { label: '🖥️ Main Dashboard', url: '/public/dashboard/student' },
        { label: '👤 Profile (Reset Password & Info)', url: '/public/dashboard/student/profile' },
        { label: '🗺️ Learning Path (Lộ Trình Học)', url: '/public/dashboard/student/learning-path' },
        { label: '🤖 AI Tutor 24/7 (Hỏi Đáp)', url: '/public/dashboard/student/ai-tutor' },
        { label: '💬 Conversation (Trò Chuyện)', url: '/public/dashboard/student/conversation' },
        { label: '🏫 Class (Member & Assignment)', url: '/public/dashboard/student/class' },
        { label: '🎥 Trang Lớp Học Daginatsuko 6 Panels', url: '/public/courses/course-001' },
      ],
      bgImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX3K7vGdyDUJvI340aetIU0MVajGsT-e6ecJWTX_bifO55kIvgYhItv47FSH5gOlBt4WXUH320SbsaApEiFfNdG66AoUaUjk7G5Nq2aNt68S2ryprglwBXkwjP-dZTcTo4W9-bhhwQxUNBz7Ab_4QpfnZ2OdXoMk-oGfmsIb2lzhbUotG-TIe2LGsotqgod8fmizYQiYz2IWyCnHT5k1cs7W0nk68sUTOd6qV65B-dNJH1vAu6ysgZ',
    },
    {
      id: 'teacher-flow',
      role: 'TEACHER FLOW (GIẢNG VIÊN)',
      title: 'LUỒNG 02: BÀN LÀM VIỆC GIẢNG VIÊN',
      subtitle: 'Dashboard • Profile (Reset password / Rechange Info) • Announcement & Conversation • Class Management (Student / Lecture / Assignment)',
      icon: '👨‍🏫',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
      btnColor: 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_25px_rgba(16,185,129,0.6)]',
      targetUrl: '/public/dashboard/teacher',
      targetLabel: '🚀 Vào Main Dashboard Giảng Viên',
      routes: [
        { label: '🖥️ Main Dashboard', url: '/public/dashboard/teacher' },
        { label: '👤 Profile (Reset Password & Info)', url: '/public/dashboard/teacher/profile' },
        { label: '📢 Announcement & Conversation', url: '/public/dashboard/teacher/announcements' },
        { label: '📚 Class Management (Student/Lecture/Assignment)', url: '/public/dashboard/teacher/classes' },
        { label: '🎥 Trang Lớp Học Daginatsuko 6 Panels', url: '/public/courses/course-001' },
      ],
      bgImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFzxfRc4zu_S4KnQjuHKNY8ZHA_W1eNLJR2iXGJJg8nGFU3FODX9yH_sOsgXUVrbX4-9Q6s5uHBXbOI7OGXYjw4SKXaGl99gDdDatnZQBRjo51CYqKYFrV-5vD5N6w18NU8WRcjrn1KpkjsZOXDHoDgTSTMTcyHoKJ1TKAY_3dVAbYnujaJFw8TtiwcwHllZybE8ID_yd_e4qrzwMJfil_a6zPQiYZPtMV5sWYokBtB7iy1AVC0S2S',
    },
    {
      id: 'school-flow',
      role: 'SCHOOL ADMIN FLOW (NHÀ TRƯỜNG)',
      title: 'LUỒNG 03: HỆ THỐNG ĐIỀU HÀNH NHÀ TRƯỜNG',
      subtitle: 'Dashboard • Profile • Khởi Tạo Tài Khoản Cho Cả 2 Vai Trò • Student Management • Teacher Management',
      icon: '🏫',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
      btnColor: 'bg-purple-500 hover:bg-purple-400 text-black shadow-[0_0_25px_rgba(168,85,247,0.6)]',
      targetUrl: '/public/dashboard/school',
      targetLabel: '🚀 Vào Main Dashboard Nhà Trường',
      routes: [
        { label: '🖥️ Main Dashboard', url: '/public/dashboard/school' },
        { label: '🏫 Profile Nhà Trường', url: '/public/dashboard/school/profile' },
        { label: '🔑 Cổng Cấp Tài Khoản Mới', url: '/public/school/users' },
        { label: '🎓 Student Management', url: '/public/dashboard/school/students' },
        { label: '👨‍🏫 Teacher Management', url: '/public/dashboard/school/teachers' },
      ],
      bgImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX3K7vGdyDUJvI340aetIU0MVajGsT-e6ecJWTX_bifO55kIvgYhItv47FSH5gOlBt4WXUH320SbsaApEiFfNdG66AoUaUjk7G5Nq2aNt68S2ryprglwBXkwjP-dZTcTo4W9-bhhwQxUNBz7Ab_4QpfnZ2OdXoMk-oGfmsIb2lzhbUotG-TIe2LGsotqgod8fmizYQiYz2IWyCnHT5k1cs7W0nk68sUTOd6qV65B-dNJH1vAu6ysgZ',
    },
  ];

  const [activeFlowIndex, setActiveFlowIndex] = useState(0);
  const activeFlow = userFlows[activeFlowIndex];

  const handleNavUp = () => {
    setActiveFlowIndex((prev) => (prev === 0 ? userFlows.length - 1 : prev - 1));
  };

  const handleNavDown = () => {
    setActiveFlowIndex((prev) => (prev === userFlows.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden select-none font-sans bg-[#0a0e1a] text-white">
      
      {/* Background Image Carousel */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center transition-all duration-700 scale-105 filter brightness-75 contrast-125"
          style={{ backgroundImage: `url(${activeFlow.bgImage})` }}
        ></div>
        <div className="absolute inset-0 bg-radial-vignette pointer-events-none bg-gradient-to-t from-black/95 via-black/55 to-black/75"></div>
      </div>

      {/* Top Header Badge */}
      <div className="absolute top-6 left-8 right-8 z-30 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400 flex items-center justify-center text-sky-400 font-bold">⚡</span>
          <span className="font-mono text-xl font-bold tracking-widest text-sky-400">E-V-E SYSTEM NAVIGATION</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/public/login"
            className="px-4 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-sky-500/30 font-mono text-xs text-sky-300 transition-all"
          >
            🔒 Login Page
          </Link>
          <Link
            href="/public/about"
            className="px-4 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 font-mono text-xs text-slate-300 transition-all"
          >
            ℹ️ About Page
          </Link>
        </div>
      </div>

      {/* Center Directional Arrow Controls & User Flow Showcase */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
        
        {/* UP ARROW ▲ */}
        <button
          onClick={handleNavUp}
          title="Phân Hệ Trước [Mũi Tên Lên]"
          className="pointer-events-auto mb-4 w-14 h-14 rounded-full bg-white/10 hover:bg-sky-500/30 border border-white/30 hover:border-sky-400 backdrop-blur-xl flex items-center justify-center text-white text-2xl transition-all hover:scale-110 active:scale-95 shadow-[0_0_25px_rgba(125,211,252,0.4)] cursor-pointer"
        >
          ▲
        </button>

        {/* Dynamic User Flow Title */}
        <div className="pointer-events-auto max-w-4xl space-y-3">
          <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full border backdrop-blur-md text-xs font-mono shadow-lg ${activeFlow.badgeColor}`}>
            <span>{activeFlow.icon}</span>
            <span>{activeFlow.role}</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold italic tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] font-serif">
            {activeFlow.title}
          </h1>

          <p className="text-slate-300 text-xs md:text-sm font-light max-w-2xl mx-auto">
            {activeFlow.subtitle}
          </p>

          {/* Activity Steps / Routes Grid */}
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto py-2">
            {activeFlow.routes.map((r, idx) => (
              <Link
                key={idx}
                href={r.url}
                className="px-3.5 py-1.5 rounded-xl bg-black/75 hover:bg-slate-900 border border-white/20 hover:border-sky-400 backdrop-blur-md text-xs font-mono text-slate-200 hover:text-white transition-all shadow-md"
              >
                {r.label}
              </Link>
            ))}
          </div>

          {/* Primary Action Button */}
          <div className="pt-2">
            <Link
              href={activeFlow.targetUrl}
              className={`inline-block px-8 py-3 rounded-2xl font-bold font-mono text-sm transition-all hover:scale-105 ${activeFlow.btnColor}`}
            >
              {activeFlow.targetLabel}
            </Link>
          </div>
        </div>

        {/* DOWN ARROW ▼ */}
        <button
          onClick={handleNavDown}
          title="Phân Hệ Tiếp theo [Mũi Tên Xuống]"
          className="pointer-events-auto mt-4 w-14 h-14 rounded-full bg-white/10 hover:bg-sky-500/30 border border-white/30 hover:border-sky-400 backdrop-blur-xl flex items-center justify-center text-white text-2xl transition-all hover:scale-110 active:scale-95 shadow-[0_0_25px_rgba(125,211,252,0.4)] cursor-pointer"
        >
          ▼
        </button>

      </div>

      {/* LEFT SIDE PILL HANDLE: TOÀN BỘ LỚP HỌC */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20">
        <Link
          href="/public/courses"
          className="group relative flex items-center justify-center p-4 rounded-full bg-black/50 hover:bg-black/80 border border-white/30 hover:border-sky-400 text-white backdrop-blur-xl transition-all duration-300 shadow-2xl hover:px-7 hover:py-5"
        >
          <span className="font-mono text-xs font-extrabold tracking-widest uppercase group-hover:hidden [writing-mode:vertical-lr] rotate-180 whitespace-nowrap py-4">
            TOÀN BỘ LỚP HỌC
          </span>
          <span className="font-mono text-xs font-extrabold tracking-widest text-sky-400 uppercase hidden group-hover:inline-block whitespace-nowrap py-1">
            ← TOÀN BỘ LỚP HỌC
          </span>
        </Link>
      </div>

      {/* RIGHT SIDE PILL HANDLE: HỆ THỐNG DEMO E-V-E */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20">
        <div className="group relative flex items-center justify-center p-3.5 rounded-full bg-black/50 border border-white/30 text-white backdrop-blur-xl transition-all duration-300 shadow-2xl cursor-default hover:px-7 hover:py-5">
          <span className="font-mono text-sm font-bold text-sky-400 group-hover:hidden py-1">
            ⓘ
          </span>
          <span className="font-mono text-xs font-extrabold tracking-widest text-sky-400 uppercase hidden group-hover:inline-block whitespace-nowrap py-1">
            HỆ THỐNG ĐIỀU HƯỚNG E-V-E
          </span>
        </div>
      </div>

      {/* Bottom Flow Selector Bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 w-full max-w-2xl px-4">
        <div className="p-2 rounded-2xl bg-black/70 border border-white/20 backdrop-blur-2xl shadow-2xl flex justify-center gap-2">
          {userFlows.map((f, idx) => (
            <button
              key={f.id}
              onClick={() => setActiveFlowIndex(idx)}
              className={`px-4 py-2 rounded-xl font-mono text-xs transition-all flex items-center gap-1.5 ${
                activeFlowIndex === idx
                  ? 'bg-sky-400 text-black font-bold shadow-[0_0_20px_rgba(56,189,248,0.7)] scale-105'
                  : 'bg-white/5 hover:bg-white/15 text-white/70 border border-white/10'
              }`}
            >
              <span>{f.icon}</span> {f.role.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="absolute bottom-6 right-8 z-30">
        <div className="px-3.5 py-1 rounded-full bg-black/50 border border-white/20 backdrop-blur-md font-mono text-xs text-white/70">
          © 2026 E-V-E DEMO HUB
        </div>
      </div>

    </div>
  );
}
