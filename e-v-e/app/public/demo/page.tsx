'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function DemoHomePage() {
  // Demo User Flows & Routes Data
  const userFlows = [
    {
      id: 'student-flow',
      role: 'HỌC SINH (STUDENT FLOW)',
      title: 'LUỒNG 01: TRẢI NGHIỆM HỌC TẬP TƯƠNG TÁC',
      subtitle: 'Khám Phá Lớp Học • Xem Video 4K • Nộp Bài Tập & Quiz AI',
      icon: '🎓',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
      btnColor: 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_25px_rgba(6,182,212,0.6)]',
      targetUrl: '/public/courses/course-001',
      targetLabel: '🚀 Thử Luồng Học Sinh (Vào Lớp Học Demo)',
      steps: [
        { label: '1. Khám Phá Vũ Trụ Lớp Học', url: '/public/courses' },
        { label: '2. Vào Trang Chủ Lớp Học Daginatsuko', url: '/public/courses/course-001' },
        { label: '3. Tương Tác Video 4K & Quiz AI', url: '/public/courses/course-001' },
      ],
      bgImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX3K7vGdyDUJvI340aetIU0MVajGsT-e6ecJWTX_bifO55kIvgYhItv47FSH5gOlBt4WXUH320SbsaApEiFfNdG66AoUaUjk7G5Nq2aNt68S2ryprglwBXkwjP-dZTcTo4W9-bhhwQxUNBz7Ab_4QpfnZ2OdXoMk-oGfmsIb2lzhbUotG-TIe2LGsotqgod8fmizYQiYz2IWyCnHT5k1cs7W0nk68sUTOd6qV65B-dNJH1vAu6ysgZ',
    },
    {
      id: 'instructor-flow',
      role: 'GIẢNG VIÊN (INSTRUCTOR FLOW)',
      title: 'LUỒNG 02: QUẢN LÝ & GIẢNG DẠY',
      subtitle: 'Tạo Khóa Học • Đăng Thông Báo • Quản Lý Bài Tập Lớp',
      icon: '👨‍🏫',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
      btnColor: 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_25px_rgba(16,185,129,0.6)]',
      targetUrl: '/public/courses/course-001',
      targetLabel: '🚀 Thử Luồng Giảng Viên (Đăng Thông Báo & Tài Liệu)',
      steps: [
        { label: '1. Khởi Tạo Khóa Học & Lộ Trình', url: '/public/courses' },
        { label: '2. Phát Sóng Live Stream Google Meet', url: '/public/courses/course-001' },
        { label: '3. Chấm Bài Tập & Upload Tài Liệu Slide', url: '/public/courses/course-001' },
      ],
      bgImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFzxfRc4zu_S4KnQjuHKNY8ZHA_W1eNLJR2iXGJJg8nGFU3FODX9yH_sOsgXUVrbX4-9Q6s5uHBXbOI7OGXYjw4SKXaGl99gDdDatnZQBRjo51CYqKYFrV-5vD5N6w18NU8WRcjrn1KpkjsZOXDHoDgTSTMTcyHoKJ1TKAY_3dVAbYnujaJFw8TtiwcwHllZybE8ID_yd_e4qrzwMJfil_a6zPQiYZPtMV5sWYokBtB7iy1AVC0S2S',
    },
    {
      id: 'admin-flow',
      role: 'QUẢN TRỊ VIÊN (ADMIN FLOW)',
      title: 'LUỒNG 03: ĐIỀU HÀNH HỆ THỐNG E-V-E',
      subtitle: 'Phê Duyệt Khóa Học • Giám Sát Firestore Database • Quản Lý Người Dùng',
      icon: '⚙️',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
      btnColor: 'bg-purple-500 hover:bg-purple-400 text-black shadow-[0_0_25px_rgba(168,85,247,0.6)]',
      targetUrl: '/public/courses',
      targetLabel: '🚀 Thử Luồng Admin (Quản Lý Toàn Bộ Lớp Học)',
      steps: [
        { label: '1. Phê Duyệt Khóa Học & Kiểm Soát Danh Mục', url: '/public/courses' },
        { label: '2. Phân Quyền Vai Trò Admin / Instructor', url: '/public/courses' },
        { label: '3. Giám Sát Engine Kết Nối Realtime Firestore', url: '/public/courses/course-001' },
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
    <div className="fixed inset-0 w-full h-full overflow-hidden select-none font-sans bg-black text-white">
      
      {/* Background Image Carousel */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center transition-all duration-700 scale-105 filter brightness-75 contrast-125"
          style={{ backgroundImage: `url(${activeFlow.bgImage})` }}
        ></div>
        <div className="absolute inset-0 bg-radial-vignette pointer-events-none bg-gradient-to-t from-black/90 via-black/50 to-black/70"></div>
      </div>

      {/* Top Header Badge */}
      <div className="absolute top-6 left-8 right-8 z-30 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-400 font-bold">⚡</span>
          <span className="font-mono text-xl font-bold tracking-widest text-cyan-400">E-V-E DEMO HUB</span>
        </div>

        <Link
          href="/public/courses"
          className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md font-mono text-xs text-white transition-all"
        >
          Toàn Bộ Lớp Học →
        </Link>
      </div>

      {/* Center Directional Arrow Controls & User Flow Showcase */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
        
        {/* UP ARROW ▲ */}
        <button
          onClick={handleNavUp}
          title="Luồng Người Dùng Trước [Mũi Tên Lên]"
          className="pointer-events-auto mb-6 w-14 h-14 rounded-full bg-white/10 hover:bg-cyan-500/30 border border-white/30 hover:border-cyan-400 backdrop-blur-xl flex items-center justify-center text-white text-2xl transition-all hover:scale-110 active:scale-95 shadow-[0_0_25px_rgba(6,182,212,0.4)] cursor-pointer"
        >
          ▲
        </button>

        {/* Dynamic User Flow Title */}
        <div className="pointer-events-auto max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border backdrop-blur-md text-xs font-mono mb-3 shadow-lg ${activeFlow.badgeColor}">
            <span>{activeFlow.icon}</span>
            <span>{activeFlow.role}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold italic tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] mb-3 font-serif">
            {activeFlow.title}
          </h1>

          <p className="text-slate-300 text-sm md:text-base font-light mb-6">
            {activeFlow.subtitle}
          </p>

          {/* Activity Steps Flow List */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {activeFlow.steps.map((step, idx) => (
              <Link
                key={idx}
                href={step.url}
                className="px-4 py-2 rounded-xl bg-black/60 hover:bg-slate-900 border border-white/20 hover:border-cyan-400 backdrop-blur-md text-xs font-mono text-slate-200 hover:text-white transition-all shadow-md"
              >
                {step.label}
              </Link>
            ))}
          </div>

          {/* Primary Action Button */}
          <Link
            href={activeFlow.targetUrl}
            className={`inline-block px-8 py-3.5 rounded-2xl font-bold font-mono text-sm transition-all hover:scale-105 ${activeFlow.btnColor}`}
          >
            {activeFlow.targetLabel}
          </Link>
        </div>

        {/* DOWN ARROW ▼ */}
        <button
          onClick={handleNavDown}
          title="Luồng Người Dùng Tiếp theo [Mũi Tên Xuống]"
          className="pointer-events-auto mt-6 w-14 h-14 rounded-full bg-white/10 hover:bg-cyan-500/30 border border-white/30 hover:border-cyan-400 backdrop-blur-xl flex items-center justify-center text-white text-2xl transition-all hover:scale-110 active:scale-95 shadow-[0_0_25px_rgba(6,182,212,0.4)] cursor-pointer"
        >
          ▼
        </button>

      </div>

      {/* LEFT SIDE PILL HANDLE: LỚP HỌC */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20">
        <Link
          href="/public/courses"
          className="group relative flex items-center justify-center p-4 rounded-full bg-black/50 hover:bg-black/80 border border-white/30 hover:border-cyan-400 text-white backdrop-blur-xl transition-all duration-300 shadow-2xl hover:px-7 hover:py-5"
        >
          <span className="font-mono text-xs font-extrabold tracking-widest uppercase group-hover:hidden [writing-mode:vertical-lr] rotate-180 whitespace-nowrap py-4">
            TOÀN BỘ LỚP HỌC
          </span>
          <span className="font-mono text-xs font-extrabold tracking-widest text-cyan-400 uppercase hidden group-hover:inline-block whitespace-nowrap py-1">
            ← TOÀN BỘ LỚP HỌC
          </span>
        </Link>
      </div>

      {/* RIGHT SIDE PILL HANDLE: HỆ THỐNG DEMO E-V-E (Informative ONLY with 'ⓘ' icon) */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20">
        <div className="group relative flex items-center justify-center p-3.5 rounded-full bg-black/50 border border-white/30 text-white backdrop-blur-xl transition-all duration-300 shadow-2xl cursor-default hover:px-7 hover:py-5">
          <span className="font-mono text-sm font-bold text-cyan-400 group-hover:hidden py-1">
            ⓘ
          </span>
          <span className="font-mono text-xs font-extrabold tracking-widest text-cyan-400 uppercase hidden group-hover:inline-block whitespace-nowrap py-1">
            HỆ THỐNG DEMO LUỒNG NGUỜI DÙNG E-V-E
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
                  ? 'bg-cyan-500 text-black font-bold shadow-[0_0_20px_rgba(6,182,212,0.7)] scale-105'
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
