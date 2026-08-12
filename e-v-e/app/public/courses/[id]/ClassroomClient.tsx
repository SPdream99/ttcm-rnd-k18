'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface ClassroomClientProps {
  initialCourse: any;
  initialLessons: any[];
  initialAnnouncements: any[];
  initialResources: any[];
  initialDiscussions: any[];
}

export default function ClassroomClient({
  initialCourse,
  initialLessons,
  initialAnnouncements,
  initialResources,
}: ClassroomClientProps) {
  // 6 Panel chính theo thứ tự chuẩn (Đã xóa toàn bộ chữ Nhật):
  const panels = [
    {
      id: 'overview',
      number: '01',
      title: 'TỔNG QUAN LỚP HỌC',
      subtitle: 'Mô Tả & Thông Báo Giảng Viên',
      icon: '📌',
      bgImage: initialCourse.bannerUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX3K7vGdyDUJvI340aetIU0MVajGsT-e6ecJWTX_bifO55kIvgYhItv47FSH5gOlBt4WXUH320SbsaApEiFfNdG66AoUaUjk7G5Nq2aNt68S2ryprglwBXkwjP-dZTcTo4W9-bhhwQxUNBz7Ab_4QpfnZ2OdXoMk-oGfmsIb2lzhbUotG-TIe2LGsotqgod8fmizYQiYz2IWyCnHT5k1cs7W0nk68sUTOd6qV65B-dNJH1vAu6ysgZ',
    },
    {
      id: 'online',
      number: '02',
      title: 'VÀO HỌC ONLINE',
      subtitle: 'Phòng Google Meet / Zoom Live Stream',
      icon: '🌐',
      bgImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFzxfRc4zu_S4KnQjuHKNY8ZHA_W1eNLJR2iXGJJg8nGFU3FODX9yH_sOsgXUVrbX4-9Q6s5uHBXbOI7OGXYjw4SKXaGl99gDdDatnZQBRjo51CYqKYFrV-5vD5N6w18NU8WRcjrn1KpkjsZOXDHoDgTSTMTcyHoKJ1TKAY_3dVAbYnujaJFw8TtiwcwHllZybE8ID_yd_e4qrzwMJfil_a6zPQiYZPtMV5sWYokBtB7iy1AVC0S2S',
    },
    {
      id: 'video',
      number: '03',
      title: 'HỌC BẰNG VIDEO',
      subtitle: 'Trình Phát Video Bài Giảng 4K',
      icon: '🎥',
      bgImage: initialCourse.bannerUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX3K7vGdyDUJvI340aetIU0MVajGsT-e6ecJWTX_bifO55kIvgYhItv47FSH5gOlBt4WXUH320SbsaApEiFfNdG66AoUaUjk7G5Nq2aNt68S2ryprglwBXkwjP-dZTcTo4W9-bhhwQxUNBz7Ab_4QpfnZ2OdXoMk-oGfmsIb2lzhbUotG-TIe2LGsotqgod8fmizYQiYz2IWyCnHT5k1cs7W0nk68sUTOd6qV65B-dNJH1vAu6ysgZ',
    },
    {
      id: 'resources',
      number: '04',
      title: 'TÀI LIỆU BÀI GIẢNG',
      subtitle: 'Thư Viện File PDF, ZIP, Code Mẫu',
      icon: '📁',
      bgImage: initialCourse.thumbnailUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFzxfRc4zu_S4KnQjuHKNY8ZHA_W1eNLJR2iXGJJg8nGFU3FODX9yH_sOsgXUVrbX4-9Q6s5uHBXbOI7OGXYjw4SKXaGl99gDdDatnZQBRjo51CYqKYFrV-5vD5N6w18NU8WRcjrn1KpkjsZOXDHoDgTSTMTcyHoKJ1TKAY_3dVAbYnujaJFw8TtiwcwHllZybE8ID_yd_e4qrzwMJfil_a6zPQiYZPtMV5sWYokBtB7iy1AVC0S2S',
    },
    {
      id: 'assignments',
      number: '05',
      title: 'BÀI TẬP VÀ NỘP BÀI TẬP',
      subtitle: 'Đề Bài Tự Luận & Biên Soạn Code',
      icon: '✏️',
      bgImage: initialCourse.bannerUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX3K7vGdyDUJvI340aetIU0MVajGsT-e6ecJWTX_bifO55kIvgYhItv47FSH5gOlBt4WXUH320SbsaApEiFfNdG66AoUaUjk7G5Nq2aNt68S2ryprglwBXkwjP-dZTcTo4W9-bhhwQxUNBz7Ab_4QpfnZ2OdXoMk-oGfmsIb2lzhbUotG-TIe2LGsotqgod8fmizYQiYz2IWyCnHT5k1cs7W0nk68sUTOd6qV65B-dNJH1vAu6ysgZ',
    },
    {
      id: 'quizzes',
      number: '06',
      title: 'QUIZ & KIỂM TRA',
      subtitle: 'Trắc Nghiệm Tương Tác Tự Động',
      icon: '🧩',
      bgImage: initialCourse.thumbnailUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFzxfRc4zu_S4KnQjuHKNY8ZHA_W1eNLJR2iXGJJg8nGFU3FODX9yH_sOsgXUVrbX4-9Q6s5uHBXbOI7OGXYjw4SKXaGl99gDdDatnZQBRjo51CYqKYFrV-5vD5N6w18NU8WRcjrn1KpkjsZOXDHoDgTSTMTcyHoKJ1TKAY_3dVAbYnujaJFw8TtiwcwHllZybE8ID_yd_e4qrzwMJfil_a6zPQiYZPtMV5sWYokBtB7iy1AVC0S2S',
    },
  ];

  // Currently Focused Panel Index (Controlled by UP ▲ and DOWN ▼ buttons)
  const [currentPanelIndex, setCurrentPanelIndex] = useState(0);

  // Active Full-Screen Screen View
  const [activeFullPanel, setActiveFullPanel] = useState<string | null>(null);

  // Dark Mode Toggle State
  const [isDarkMode, setIsDarkMode] = useState(true);

  // State controls
  const [selectedVideoLesson, setSelectedVideoLesson] = useState<any | null>(
    initialLessons.find((l) => l.type === 'video') || initialLessons[0] || null
  );
  const [completedLessons, setCompletedLessons] = useState<string[]>(['lesson-1']);

  // Assignment & Quiz States
  const [submissionText, setSubmissionText] = useState('');
  const [submittedAssignments, setSubmittedAssignments] = useState<Record<string, string>>({});
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const activePanelData = panels[currentPanelIndex];

  // Up/Down Navigation Functions
  const handleNavUp = () => {
    setCurrentPanelIndex((prev) => (prev === 0 ? panels.length - 1 : prev - 1));
  };

  const handleNavDown = () => {
    setCurrentPanelIndex((prev) => (prev === panels.length - 1 ? 0 : prev + 1));
  };

  const quizQuestions = [
    {
      question: 'Cú pháp nào sau đây dùng để khai báo hàm trong Python?',
      options: ['function myFunc():', 'def myFunc():', 'func myFunc():', 'void myFunc():'],
      correct: 1,
    },
    {
      question: 'Kiểu dữ liệu nào trong Python là MUTABLE (có thể thay đổi)?',
      options: ['Tuple', 'String', 'List', 'Integer'],
      correct: 2,
    },
    {
      question: 'Kết quả của biểu thức `3 ** 2` trong Python là gì?',
      options: ['6', '9', '8', 'Lỗi cú pháp'],
      correct: 1,
    },
  ];

  const handleQuizOptionSelect = (qIdx: number, oIdx: number) => {
    setSelectedAnswers({ ...selectedAnswers, [qIdx]: oIdx });
  };

  const handleQuizSubmit = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) score += 10;
    });
    setQuizScore(score);
  };

  const handleAssignmentSubmit = (e: React.FormEvent, assignmentId: string) => {
    e.preventDefault();
    if (!submissionText.trim()) return;
    setSubmittedAssignments({
      ...submittedAssignments,
      [assignmentId]: submissionText,
    });
    setSubmissionText('');
  };

  const toggleLessonComplete = (lessonId: string) => {
    if (completedLessons.includes(lessonId)) {
      setCompletedLessons(completedLessons.filter((id) => id !== lessonId));
    } else {
      setCompletedLessons([...completedLessons, lessonId]);
    }
  };

  const videoLessons = initialLessons.filter((l) => l.type === 'video');
  const progressPercentage = initialLessons.length > 0
    ? Math.round((completedLessons.length / initialLessons.length) * 100)
    : 40;

  return (
    <div className={`fixed inset-0 w-full h-full overflow-hidden select-none font-sans transition-colors duration-500 ${isDarkMode ? 'bg-[#060a12] text-white' : 'bg-slate-100 text-slate-900'}`}>
      
      {/* ─── 1. FULLSCREEN IMMERSIVE BACKGROUND ─── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className={`w-full h-full bg-cover bg-center transition-all duration-700 scale-105 filter ${isDarkMode ? 'brightness-75 contrast-125' : 'brightness-90 contrast-100'}`}
          style={{ backgroundImage: `url(${activePanelData.bgImage})` }}
        ></div>
        <div className={`absolute inset-0 pointer-events-none ${isDarkMode ? 'bg-radial-vignette bg-gradient-to-t from-black/85 via-black/40 to-black/65' : 'bg-gradient-to-t from-slate-100/90 via-slate-100/40 to-slate-100/70'}`}></div>
      </div>

      {/* ─── 2. TOP RIGHT BRAND BADGE ─── */}
      <div className="absolute top-6 right-8 z-30 flex items-center gap-3">
        <Link
          href="/"
          className={`px-4 py-1.5 rounded-full border backdrop-blur-md text-xs font-mono transition-all flex items-center gap-2 shadow-lg ${
            isDarkMode
              ? 'bg-black/40 border-white/20 text-white/80 hover:text-white hover:bg-black/70'
              : 'bg-white/60 border-slate-300 text-slate-800 hover:bg-white'
          }`}
        >
          <span>⚡ E-V-E</span>
          <span className="opacity-40">|</span>
          <span>Trang Chủ</span>
        </Link>
      </div>

      {/* ─── 3. CENTER HERO TITLE & DIRECTIONAL CONTROLS (UP ▲ / DOWN ▼) ─── */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
        
        {/* UP ARROW ▲ */}
        <button
          onClick={handleNavUp}
          title="Panel Trước [Mũi Tên Lên]"
          className={`pointer-events-auto mb-8 w-14 h-14 rounded-full border backdrop-blur-xl flex items-center justify-center text-xl transition-all hover:scale-110 active:scale-95 cursor-pointer ${
            isDarkMode
              ? 'bg-white/10 hover:bg-cyan-500/30 border-white/30 hover:border-cyan-400 text-white shadow-[0_0_25px_rgba(6,182,212,0.3)]'
              : 'bg-white/80 hover:bg-cyan-500/20 border-slate-300 hover:border-cyan-500 text-slate-900 shadow-md'
          }`}
        >
          ▲
        </button>

        {/* Dynamic Center Title */}
        <div
          onClick={() => setActiveFullPanel(activePanelData.id)}
          className="pointer-events-auto cursor-pointer group transition-transform hover:scale-105"
        >
          <div className="font-mono text-xs text-cyan-400 tracking-widest uppercase mb-2">
            PANEL {activePanelData.number} / {panels.length}
          </div>

          <h1 className={`text-4xl md:text-6xl font-extrabold italic tracking-tight mb-3 font-serif transition-colors ${
            isDarkMode
              ? 'text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] group-hover:text-cyan-300'
              : 'text-slate-900 drop-shadow-md group-hover:text-cyan-600'
          }`}>
            {activePanelData.icon} {activePanelData.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <span className={`px-4 py-1 rounded-full border backdrop-blur-md text-xs font-mono shadow-md ${
              isDarkMode
                ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300'
                : 'bg-cyan-100 border-cyan-300 text-cyan-800'
            }`}>
              {activePanelData.subtitle}
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all">
            🚀 MỞ TRANG CHI TIẾT PANEL
          </div>
        </div>

        {/* DOWN ARROW ▼ */}
        <button
          onClick={handleNavDown}
          title="Panel Tiếp Theo [Mũi Tên Xuống]"
          className={`pointer-events-auto mt-8 w-14 h-14 rounded-full border backdrop-blur-xl flex items-center justify-center text-xl transition-all hover:scale-110 active:scale-95 cursor-pointer ${
            isDarkMode
              ? 'bg-white/10 hover:bg-cyan-500/30 border-white/30 hover:border-cyan-400 text-white shadow-[0_0_25px_rgba(6,182,212,0.3)]'
              : 'bg-white/80 hover:bg-cyan-500/20 border-slate-300 hover:border-cyan-500 text-slate-900 shadow-md'
          }`}
        >
          ▼
        </button>
      </div>

      {/* ─── 4. LEFT SIDE PILL HANDLE: LỚP HỌC (Điều Hướng Đến Trang Toàn Bộ Lớp Học) ─── */}
      {/* 
          Yêu cầu:
          - Chữ để dọc ([writing-mode:vertical-lr])
          - Khi hover vào thì hiện dài ra để ngang
          - Đảm bảo không bị mất hover khi thay đổi chiều / size (dùng flex container mở rộng mượt mà)
      */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20">
        <Link
          href="/public/courses"
          className={`group relative flex items-center justify-center p-4 rounded-full border backdrop-blur-xl transition-all duration-300 shadow-2xl cursor-pointer hover:px-7 hover:py-5 ${
            isDarkMode
              ? 'bg-black/50 hover:bg-black/80 border-white/30 hover:border-cyan-400 text-white'
              : 'bg-white/70 hover:bg-white border-slate-300 hover:border-cyan-500 text-slate-900'
          }`}
        >
          {/* Default Vertical Text */}
          <span className="font-mono text-xs font-extrabold tracking-widest uppercase group-hover:hidden [writing-mode:vertical-lr] rotate-180 whitespace-nowrap py-4">
            TOÀN BỘ LỚP HỌC
          </span>

          {/* Hover Horizontal Text */}
          <span className="font-mono text-xs font-extrabold tracking-widest text-cyan-400 uppercase hidden group-hover:inline-block whitespace-nowrap py-1">
            ← TOÀN BỘ LỚP HỌC
          </span>
        </Link>
      </div>

      {/* ─── 5. RIGHT SIDE PILL HANDLE: TÊN KHÓA HỌC NÀY (Chỉ Hiển Thị, Không Điều Hướng) ─── */}
      {/* 
          Yêu cầu:
          - Hiển thị tên của lớp học này
          - Không điều hướng được (Non-clickable / Informative ONLY)
          - Chữ để dọc, khi hover vào hiện dài ra để ngang
          - Giữ nguyên hover không bị mất khi đổi chiều/size
      */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20">
        <div
          className={`group relative flex items-center justify-center p-4 rounded-full border backdrop-blur-xl transition-all duration-300 shadow-2xl cursor-default hover:px-7 hover:py-5 ${
            isDarkMode
              ? 'bg-black/50 border-white/30 text-white'
              : 'bg-white/70 border-slate-300 text-slate-900'
          }`}
        >
          {/* Default Vertical Text */}
          <span className="font-mono text-xs font-extrabold tracking-widest uppercase group-hover:hidden [writing-mode:vertical-lr] whitespace-nowrap max-h-56 overflow-hidden text-ellipsis py-4">
            {initialCourse.title}
          </span>

          {/* Hover Horizontal Text */}
          <span className="font-mono text-xs font-extrabold tracking-widest text-cyan-400 uppercase hidden group-hover:inline-block whitespace-nowrap py-1">
            {initialCourse.title}
          </span>
        </div>
      </div>

      {/* ─── 6. BOTTOM NAVIGATION BAR (HIGHLIGHTS CURRENT PANEL INDEX) ─── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 w-full max-w-4xl px-4">
        <div className={`p-2.5 rounded-2xl border backdrop-blur-2xl shadow-2xl flex flex-wrap items-center justify-center gap-2 ${
          isDarkMode
            ? 'bg-black/65 border-white/20'
            : 'bg-white/80 border-slate-300'
        }`}>
          {panels.map((p, idx) => {
            const isSelected = currentPanelIndex === idx;
            return (
              <button
                key={p.id}
                onClick={() => setCurrentPanelIndex(idx)}
                className={`px-4 py-2 rounded-xl font-mono text-xs transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-cyan-500 text-black font-bold shadow-[0_0_20px_rgba(6,182,212,0.8)] scale-105'
                    : isDarkMode
                      ? 'bg-white/5 hover:bg-white/15 text-white/80 border border-white/10'
                      : 'bg-slate-200/80 hover:bg-slate-300 text-slate-800 border border-slate-300'
                }`}
              >
                <span>{p.icon}</span> {p.number}. {p.title.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── 7. BOTTOM CONTROLS & DARK MODE TOGGLE ─── */}
      <div className="absolute bottom-6 left-8 z-30 flex items-center gap-2">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`px-4 py-1.5 rounded-full border backdrop-blur-md font-mono text-xs transition-all flex items-center gap-2 shadow-lg ${
            isDarkMode
              ? 'bg-black/50 border-white/20 text-white hover:bg-black/80'
              : 'bg-white/80 border-slate-300 text-slate-900 hover:bg-white'
          }`}
        >
          <span>{isDarkMode ? '🌙 Dark Mode: ON' : '☀️ Light Mode: ON'}</span>
        </button>
      </div>

      <div className="absolute bottom-6 right-8 z-30">
        <div className={`px-3.5 py-1 rounded-full border backdrop-blur-md font-mono text-xs ${
          isDarkMode
            ? 'bg-black/50 border-white/20 text-white/70'
            : 'bg-white/80 border-slate-300 text-slate-700'
        }`}>
          © 2026 E-V-E CLASSROOM
        </div>
      </div>

      {/* ─── 8. FULL-PAGE PANEL SCREENS (Opens when panel is active) ─── */}
      {activeFullPanel && (
        <div className={`fixed inset-0 z-50 w-full h-full flex flex-col overflow-y-auto animate-in fade-in duration-300 ${
          isDarkMode
            ? 'bg-[#060a12]/95 backdrop-blur-3xl text-white'
            : 'bg-slate-50/95 backdrop-blur-3xl text-slate-900'
        }`}>
          
          <header className={`sticky top-0 z-40 px-6 md:px-12 py-4 flex justify-between items-center border-b ${
            isDarkMode
              ? 'bg-[#090e1a]/90 border-white/15'
              : 'bg-white/90 border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 rounded font-mono text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase font-bold">
                PANEL // {activeFullPanel.toUpperCase()}
              </span>
              <span className="font-mono text-xs opacity-60 hidden sm:inline-block">
                {initialCourse.title}
              </span>
            </div>

            <button
              onClick={() => setActiveFullPanel(null)}
              className={`px-5 py-2 rounded-full font-mono text-xs transition-all hover:scale-105 flex items-center gap-2 shadow-lg ${
                isDarkMode
                  ? 'bg-white/10 hover:bg-white/25 border border-white/30 text-white'
                  : 'bg-slate-200 hover:bg-slate-300 border border-slate-400 text-slate-900'
              }`}
            >
              <span>✕</span> TRỞ VỀ MENU CHÍNH
            </button>
          </header>

          <main className="flex-1 max-w-6xl w-full mx-auto px-6 md:px-12 py-10">
            
            {/* PANEL 1: TỔNG QUAN */}
            {activeFullPanel === 'overview' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
                <div className={`p-8 md:p-12 rounded-3xl border backdrop-blur-xl shadow-2xl ${
                  isDarkMode
                    ? 'bg-slate-900/80 border-cyan-500/30'
                    : 'bg-white border-slate-200'
                }`}>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-400/40 text-cyan-400 font-mono text-xs mb-4">
                    <span>TỔNG QUAN LỚP HỌC</span>
                  </div>

                  <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
                    {initialCourse.title}
                  </h2>
                  <p className="text-sm md:text-base leading-relaxed mb-8 font-light max-w-4xl opacity-90">
                    {initialCourse.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-800">
                    <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-black/50 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                      <div className="font-mono text-3xl font-bold text-cyan-400 mb-1">12,400+</div>
                      <div className="font-mono text-xs opacity-60 uppercase tracking-wider">Lines of Code</div>
                    </div>
                    <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-black/50 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                      <div className="font-mono text-3xl font-bold text-emerald-400">{progressPercentage}%</div>
                      <div className="font-mono text-xs opacity-60 uppercase tracking-wider">Tiến Độ Bản Thân</div>
                    </div>
                    <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-black/50 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                      <div className="font-mono text-3xl font-bold text-purple-400">{initialCourse.studentsCount || 128}</div>
                      <div className="font-mono text-xs opacity-60 uppercase tracking-wider">Sĩ Số Học Viên</div>
                    </div>
                  </div>
                </div>

                {initialAnnouncements.length > 0 && (
                  <div className={`p-8 rounded-3xl border space-y-4 ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h3 className="font-mono text-sm text-amber-400 tracking-wider uppercase mb-2">
                      📢 Thông Báo Mới Nhất Từ Giảng Viên
                    </h3>
                    {initialAnnouncements.map((ann) => (
                      <div key={ann.id} className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-950/80 border-amber-500/30' : 'bg-amber-50 border-amber-200'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-bold text-amber-500 text-base">{ann.title}</h4>
                          <span className="font-mono text-xs opacity-60">{new Date(ann.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <p className="text-sm leading-relaxed opacity-90">{ann.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PANEL 2: VÀO HỌC ONLINE */}
            {activeFullPanel === 'online' && (
              <div className={`p-10 md:p-16 rounded-3xl border text-center space-y-8 animate-in slide-in-from-bottom-4 duration-300 shadow-2xl ${
                isDarkMode ? 'bg-slate-900/90 border-emerald-500/40' : 'bg-white border-slate-200'
              }`}>
                <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 text-4xl mx-auto shadow-[0_0_40px_rgba(16,185,129,0.5)]">
                  🎥
                </div>
                <div>
                  <h3 className="text-3xl md:text-4xl font-extrabold mb-2">Phòng Học Trực Tuyến Live Stream</h3>
                  <p className="font-mono text-sm opacity-70">Lớp học Google Meet / Zoom được kết nối trực tiếp</p>
                </div>

                <div className={`p-8 rounded-2xl border max-w-2xl mx-auto space-y-4 ${isDarkMode ? 'bg-black/60 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs border border-emerald-500/40">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>BUỔI HỌC LIVE ĐANG DIỄN RA</span>
                  </div>

                  <h4 className="text-xl font-bold">Chủ Đề: Hướng Dẫn Thực Hành Thuật Toán Python & Q&A</h4>
                  <p className="text-xs opacity-70 max-w-lg mx-auto leading-relaxed">
                    Giảng viên Trần Thị Bình đang chủ trì lớp học online. Nhấp nút bên dưới để vào phòng học ngay.
                  </p>

                  <a
                    href="https://meet.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block px-10 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold font-mono text-base shadow-[0_0_35px_rgba(16,185,129,0.6)] transition-all hover:scale-105"
                  >
                    🚀 Tham Gia Phòng Học Google Meet
                  </a>
                </div>
              </div>
            )}

            {/* PANEL 3: HỌC BẰNG VIDEO */}
            {activeFullPanel === 'video' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
                {selectedVideoLesson && (
                  <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-slate-900/90 border-cyan-500/30' : 'bg-white border-slate-200'}`}>
                    <div className="flex justify-between items-center mb-4">
                      <span className="px-3 py-1 rounded bg-cyan-500/20 text-cyan-400 font-mono text-xs border border-cyan-500/30">
                        📹 VIDEO LECTURE #{selectedVideoLesson.order}
                      </span>
                      <span className="font-mono text-xs opacity-60">{Math.round((selectedVideoLesson.duration || 1800) / 60)} Phút</span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold mb-3">{selectedVideoLesson.title}</h3>
                    <p className="text-sm opacity-80 mb-6">{selectedVideoLesson.description}</p>

                    <div className="aspect-video w-full rounded-2xl bg-black border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden group mb-6">
                      <div className="w-20 h-20 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-400 text-3xl shadow-[0_0_35px_rgba(6,182,212,0.5)] group-hover:scale-110 transition-transform cursor-pointer">
                        ▶
                      </div>
                      <span className="mt-4 font-mono text-xs text-slate-400">Phát video bài giảng 4K</span>
                    </div>

                    <button
                      onClick={() => toggleLessonComplete(selectedVideoLesson.id)}
                      className={`px-6 py-3 rounded-xl font-mono text-xs transition-all ${
                        completedLessons.includes(selectedVideoLesson.id)
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      }`}
                    >
                      {completedLessons.includes(selectedVideoLesson.id) ? '✓ Đã Hoàn Thành' : '○ Đánh Dấu Hoàn Thành'}
                    </button>
                  </div>
                )}

                <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <h4 className="font-mono text-xs text-cyan-400 uppercase tracking-widest mb-4">Danh Sách Video Bài Giảng</h4>
                  <div className="space-y-3">
                    {videoLessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        onClick={() => setSelectedVideoLesson(lesson)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                          selectedVideoLesson?.id === lesson.id
                            ? 'border-cyan-400 bg-cyan-500/10'
                            : isDarkMode ? 'border-slate-800 bg-slate-950/30 hover:border-slate-700' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-cyan-400 font-mono text-sm">▶</span>
                          <span className="text-sm font-medium">{lesson.title}</span>
                        </div>
                        <span className="font-mono text-xs opacity-60">{Math.round((lesson.duration || 1800) / 60)} phút</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PANEL 4: TÀI LIỆU */}
            {activeFullPanel === 'resources' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-300">
                {initialResources.map((res) => (
                  <div key={res.id} className={`p-8 rounded-3xl border flex flex-col justify-between ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-sm uppercase">
                          {res.fileType}
                        </span>
                        <span className="font-mono text-xs opacity-60">{res.fileSize}</span>
                      </div>
                      <h4 className="font-bold text-lg mb-2">{res.title}</h4>
                      <p className="text-xs opacity-70 mb-6 leading-relaxed">{res.description || 'Tài liệu học tập.'}</p>
                    </div>
                    <a
                      href={res.fileUrl}
                      download
                      className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition-all text-center block"
                    >
                      ↓ Tải Xuống File ({res.downloadCount || 0} lượt tải)
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* PANEL 5: BÀI TẬP VÀ NỘP BÀI TẬP */}
            {activeFullPanel === 'assignments' && (
              <div className={`p-8 md:p-12 rounded-3xl border space-y-6 animate-in slide-in-from-bottom-4 duration-300 ${
                isDarkMode ? 'bg-slate-900/90 border-amber-500/30' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center gap-4 pb-6 border-b border-amber-500/20">
                  <span className="text-4xl">✏️</span>
                  <div>
                    <h3 className="font-bold text-xl">Bài Tập Tự Luận: Thuật Toán Python</h3>
                    <p className="font-mono text-xs text-amber-500">Hạn nộp: 23:59 Chủ Nhật Tuần Này</p>
                  </div>
                </div>

                <p className="text-sm opacity-90 leading-relaxed">
                  Yêu cầu: Viết chương trình Python nhập vào một chuỗi ký tự và đếm số lượng nguyên âm (a, e, i, o, u) xuất hiện trong chuỗi đó. Hãy dán mã nguồn bài giải của bạn vào ô bên dưới.
                </p>

                <form onSubmit={(e) => handleAssignmentSubmit(e, 'assign-1')} className="space-y-4">
                  <textarea
                    rows={8}
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    placeholder="Dán mã nguồn Python bài tập của bạn tại đây..."
                    className={`w-full border rounded-2xl p-5 text-sm font-mono focus:outline-none ${
                      isDarkMode ? 'bg-slate-950 border-amber-500/40 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  ></textarea>

                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs opacity-70">Trạng thái: {submittedAssignments['assign-1'] ? '✓ Đã Nộp Bài' : 'Chưa nộp'}</span>
                    <button
                      type="submit"
                      className="px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold font-mono text-sm transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                    >
                      Nộp Bài Tập
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* PANEL 6: QUIZE */}
            {activeFullPanel === 'quizzes' && (
              <div className={`p-8 md:p-12 rounded-3xl border space-y-8 animate-in slide-in-from-bottom-4 duration-300 ${
                isDarkMode ? 'bg-slate-900/90 border-purple-500/30' : 'bg-white border-slate-200'
              }`}>
                <div className="flex justify-between items-center pb-6 border-b border-purple-500/20">
                  <div>
                    <h3 className="font-bold text-2xl">Bài Kiểm Tra Trắc Nghiệm Quiz #1</h3>
                    <p className="font-mono text-xs text-purple-400">3 Câu hỏi • Thang điểm 30</p>
                  </div>
                  {quizScore !== null && (
                    <span className="px-5 py-2.5 rounded-2xl bg-purple-500/20 text-purple-400 font-mono font-bold text-base border border-purple-500/40">
                      Điểm Số: {quizScore}/30
                    </span>
                  )}
                </div>

                <div className="space-y-6">
                  {quizQuestions.map((q, qIdx) => (
                    <div key={qIdx} className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <h4 className="font-semibold text-base mb-4">Câu {qIdx + 1}: {q.question}</h4>
                      <div className="space-y-3">
                        {q.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            onClick={() => handleQuizOptionSelect(qIdx, oIdx)}
                            className={`p-4 rounded-xl border text-xs font-mono cursor-pointer transition-all ${
                              selectedAnswers[qIdx] === oIdx
                                ? 'border-purple-400 bg-purple-500/20 text-purple-400 font-bold'
                                : isDarkMode ? 'border-slate-800 bg-slate-900/50 opacity-70' : 'border-slate-200 bg-white'
                            }`}
                          >
                            {String.fromCharCode(65 + oIdx)}. {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleQuizSubmit}
                  className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-base font-bold shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all"
                >
                  Nộp Bài Kiểm Tra Quiz
                </button>
              </div>
            )}

          </main>

          <footer className={`sticky bottom-0 z-40 px-6 md:px-12 py-3 border-t ${
            isDarkMode ? 'bg-[#090e1a]/95 border-white/15' : 'bg-white border-slate-200'
          }`}>
            <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-2">
              <span className="font-mono text-xs opacity-50 hidden md:inline-block">CHUYỂN PANEL NHANH:</span>
              
              <div className="flex flex-wrap gap-2">
                {panels.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActiveFullPanel(p.id)}
                    className={`px-3 py-1 rounded-lg font-mono text-xs ${activeFullPanel === p.id ? 'bg-cyan-500 text-black font-bold' : 'bg-slate-800/40 text-slate-300'}`}
                  >
                    {p.number}. {p.title.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </footer>

        </div>
      )}

    </div>
  );
}
