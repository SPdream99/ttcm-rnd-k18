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
  // 6 Panel chính theo thứ tự chuẩn:
  const panels = [
    {
      id: 'overview',
      number: '01',
      title: 'TỔNG QUAN LỚP HỌC',
      japaneseTitle: 'コース概要',
      subtitle: 'Mô Tả & Thông Báo Giảng Viên',
      icon: '📌',
      bgImage: initialCourse.bannerUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX3K7vGdyDUJvI340aetIU0MVajGsT-e6ecJWTX_bifO55kIvgYhItv47FSH5gOlBt4WXUH320SbsaApEiFfNdG66AoUaUjk7G5Nq2aNt68S2ryprglwBXkwjP-dZTcTo4W9-bhhwQxUNBz7Ab_4QpfnZ2OdXoMk-oGfmsIb2lzhbUotG-TIe2LGsotqgod8fmizYQiYz2IWyCnHT5k1cs7W0nk68sUTOd6qV65B-dNJH1vAu6ysgZ',
    },
    {
      id: 'online',
      number: '02',
      title: 'VÀO HỌC ONLINE',
      japaneseTitle: 'オンライン授業',
      subtitle: 'Phòng Google Meet / Zoom Live Stream',
      icon: '🌐',
      bgImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFzxfRc4zu_S4KnQjuHKNY8ZHA_W1eNLJR2iXGJJg8nGFU3FODX9yH_sOsgXUVrbX4-9Q6s5uHBXbOI7OGXYjw4SKXaGl99gDdDatnZQBRjo51CYqKYFrV-5vD5N6w18NU8WRcjrn1KpkjsZOXDHoDgTSTMTcyHoKJ1TKAY_3dVAbYnujaJFw8TtiwcwHllZybE8ID_yd_e4qrzwMJfil_a6zPQiYZPtMV5sWYokBtB7iy1AVC0S2S',
    },
    {
      id: 'video',
      number: '03',
      title: 'HỌC BẰNG VIDEO',
      japaneseTitle: 'ビデオ学習',
      subtitle: 'Trình Phát Video Bài Giảng 4K',
      icon: '🎥',
      bgImage: initialCourse.bannerUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX3K7vGdyDUJvI340aetIU0MVajGsT-e6ecJWTX_bifO55kIvgYhItv47FSH5gOlBt4WXUH320SbsaApEiFfNdG66AoUaUjk7G5Nq2aNt68S2ryprglwBXkwjP-dZTcTo4W9-bhhwQxUNBz7Ab_4QpfnZ2OdXoMk-oGfmsIb2lzhbUotG-TIe2LGsotqgod8fmizYQiYz2IWyCnHT5k1cs7W0nk68sUTOd6qV65B-dNJH1vAu6ysgZ',
    },
    {
      id: 'resources',
      number: '04',
      title: 'TÀI LIỆU BÀI GIẢNG',
      japaneseTitle: 'ドキュメント',
      subtitle: 'Thư Viện File PDF, ZIP, Code Mẫu',
      icon: '📁',
      bgImage: initialCourse.thumbnailUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFzxfRc4zu_S4KnQjuHKNY8ZHA_W1eNLJR2iXGJJg8nGFU3FODX9yH_sOsgXUVrbX4-9Q6s5uHBXbOI7OGXYjw4SKXaGl99gDdDatnZQBRjo51CYqKYFrV-5vD5N6w18NU8WRcjrn1KpkjsZOXDHoDgTSTMTcyHoKJ1TKAY_3dVAbYnujaJFw8TtiwcwHllZybE8ID_yd_e4qrzwMJfil_a6zPQiYZPtMV5sWYokBtB7iy1AVC0S2S',
    },
    {
      id: 'assignments',
      number: '05',
      title: 'BÀI TẬP VÀ NỘP BÀI TẬP',
      japaneseTitle: '課題と提出',
      subtitle: 'Đề Bài Tự Luận & Biên Soạn Code',
      icon: '✏️',
      bgImage: initialCourse.bannerUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX3K7vGdyDUJvI340aetIU0MVajGsT-e6ecJWTX_bifO55kIvgYhItv47FSH5gOlBt4WXUH320SbsaApEiFfNdG66AoUaUjk7G5Nq2aNt68S2ryprglwBXkwjP-dZTcTo4W9-bhhwQxUNBz7Ab_4QpfnZ2OdXoMk-oGfmsIb2lzhbUotG-TIe2LGsotqgod8fmizYQiYz2IWyCnHT5k1cs7W0nk68sUTOd6qV65B-dNJH1vAu6ysgZ',
    },
    {
      id: 'quizzes',
      number: '06',
      title: 'QUIZ & KIỂM TRA',
      japaneseTitle: 'クイズ試験',
      subtitle: 'Trắc Nghiệm Tương Tác Tự Động',
      icon: '🧩',
      bgImage: initialCourse.thumbnailUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFzxfRc4zu_S4KnQjuHKNY8ZHA_W1eNLJR2iXGJJg8nGFU3FODX9yH_sOsgXUVrbX4-9Q6s5uHBXbOI7OGXYjw4SKXaGl99gDdDatnZQBRjo51CYqKYFrV-5vD5N6w18NU8WRcjrn1KpkjsZOXDHoDgTSTMTcyHoKJ1TKAY_3dVAbYnujaJFw8TtiwcwHllZybE8ID_yd_e4qrzwMJfil_a6zPQiYZPtMV5sWYokBtB7iy1AVC0S2S',
    },
  ];

  // Currently Focused Panel Index (Controlled by UP ▲ and DOWN ▼ buttons)
  const [currentPanelIndex, setCurrentPanelIndex] = useState(0);

  // Active Full-Screen Screen View (Opened when clicking center title or panel button)
  const [activeFullPanel, setActiveFullPanel] = useState<string | null>(null);

  // State controls
  const [selectedVideoLesson, setSelectedVideoLesson] = useState<any | null>(
    initialLessons.find((l) => l.type === 'video') || initialLessons[0] || null
  );
  const [completedLessons, setCompletedLessons] = useState<string[]>(['lesson-1']);
  const [copiedShare, setCopiedShare] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

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

  const handleShareCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const videoLessons = initialLessons.filter((l) => l.type === 'video');
  const progressPercentage = initialLessons.length > 0
    ? Math.round((completedLessons.length / initialLessons.length) * 100)
    : 40;

  return (
    <div className={`fixed inset-0 w-full h-full overflow-hidden select-none font-sans ${isDarkMode ? 'bg-black text-white' : 'bg-slate-100 text-slate-900'}`}>
      
      {/* ─── 1. FULLSCREEN IMMERSIVE BACKGROUND (Changes dynamically per panel) ─── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center transition-all duration-700 scale-105 filter brightness-75 contrast-125"
          style={{ backgroundImage: `url(${activePanelData.bgImage})` }}
        ></div>
        <div className="absolute inset-0 bg-radial-vignette pointer-events-none bg-gradient-to-t from-black/85 via-black/40 to-black/65"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/40 to-black/90"></div>
      </div>

      {/* ─── 2. TOP RIGHT BRAND BADGE ─── */}
      <div className="absolute top-6 right-8 z-30 flex items-center gap-3">
        <Link
          href="/"
          className="px-4 py-1.5 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 backdrop-blur-md text-xs font-mono text-white/80 hover:text-white transition-all flex items-center gap-2 shadow-lg"
        >
          <span>⚡ E-V-E</span>
          <span className="text-white/40">|</span>
          <span>Trang Chủ</span>
        </Link>
      </div>

      {/* ─── 3. CENTER HERO TITLE (CHANGES DYNAMICALLY WITH UP ▲ / DOWN ▼ BUTTONS) ─── */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
        
        {/* UP ARROW ▲ (Switches to Previous Panel) */}
        <button
          onClick={handleNavUp}
          title="Panel Trước [Mũi Tên Lên]"
          className="pointer-events-auto mb-8 w-14 h-14 rounded-full bg-white/10 hover:bg-cyan-500/30 border border-white/30 hover:border-cyan-400 backdrop-blur-xl flex items-center justify-center text-white text-2xl transition-all hover:scale-110 shadow-[0_0_25px_rgba(6,182,212,0.3)] active:scale-95 cursor-pointer"
        >
          ▲
        </button>

        {/* Dynamic Center Title: Name of Current Panel (Clickable to open full page) */}
        <div
          onClick={() => setActiveFullPanel(activePanelData.id)}
          className="pointer-events-auto cursor-pointer group transition-transform hover:scale-105"
        >
          <div className="font-mono text-xs text-cyan-400 tracking-widest uppercase mb-2">
            PANEL {activePanelData.number} / {panels.length}
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold italic tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] mb-3 font-serif group-hover:text-cyan-300 transition-colors">
            {activePanelData.icon} {activePanelData.title}
          </h1>

          {/* Japanese Subtext & Subtitle */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <span className="px-4 py-1 rounded-full bg-white/15 border border-white/30 backdrop-blur-md text-xs font-mono text-white/90 shadow-md">
              {activePanelData.japaneseTitle}
            </span>
            <span className="px-4 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 backdrop-blur-md text-xs font-mono text-cyan-300 shadow-md">
              {activePanelData.subtitle}
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all">
            🚀 MỞ TRANG CHI TIẾT PANEL
          </div>
        </div>

        {/* DOWN ARROW ▼ (Switches to Next Panel) */}
        <button
          onClick={handleNavDown}
          title="Panel Tiếp Theo [Mũi Tên Xuống]"
          className="pointer-events-auto mt-8 w-14 h-14 rounded-full bg-white/10 hover:bg-cyan-500/30 border border-white/30 hover:border-cyan-400 backdrop-blur-xl flex items-center justify-center text-white text-2xl transition-all hover:scale-110 shadow-[0_0_25px_rgba(6,182,212,0.3)] active:scale-95 cursor-pointer"
        >
          ▼
        </button>
      </div>

      {/* ─── 4. LEFT SIDE PILL HANDLE: LỚP HỌC (FOLIO) ─── */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20">
        <button
          onClick={() => setActiveFullPanel('overview')}
          className="group relative flex items-center gap-3 px-3 py-6 rounded-full bg-white/10 hover:bg-white/25 border border-white/30 backdrop-blur-xl transition-all shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:scale-105 active:scale-95"
        >
          <div className="flex flex-col items-center">
            <span className="font-mono text-xs font-bold tracking-widest text-white uppercase [writing-mode:vertical-lr] rotate-180">
              LỚP HỌC
            </span>
            <span className="font-mono text-[10px] text-white/60 uppercase [writing-mode:vertical-lr] rotate-180 mt-2">
              ポートフォリオ
            </span>
          </div>
        </button>
      </div>

      {/* ─── 5. RIGHT SIDE PILL HANDLE: INSPECTOR (ABOUT) ─── */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20">
        <button
          onClick={() => setActiveFullPanel('inspector')}
          className="group relative flex items-center gap-3 px-3 py-6 rounded-full bg-white/10 hover:bg-white/25 border border-white/30 backdrop-blur-xl transition-all shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:scale-105 active:scale-95"
        >
          <div className="flex flex-col items-center">
            <span className="font-mono text-xs font-bold tracking-widest text-white uppercase [writing-mode:vertical-lr]">
              INSPECTOR
            </span>
            <span className="font-mono text-[10px] text-white/60 uppercase [writing-mode:vertical-lr] mt-2">
              私について知る
            </span>
          </div>
        </button>
      </div>

      {/* ─── 6. BOTTOM NAVIGATION BAR (HIGHLIGHTS CURRENT PANEL INDEX) ─── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 w-full max-w-4xl px-4">
        <div className="p-2.5 rounded-2xl bg-black/65 border border-white/20 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex flex-wrap items-center justify-center gap-2">
          {panels.map((p, idx) => {
            const isSelected = currentPanelIndex === idx;
            return (
              <button
                key={p.id}
                onClick={() => setCurrentPanelIndex(idx)}
                className={`px-4 py-2 rounded-xl font-mono text-xs transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-cyan-500 text-black font-bold shadow-[0_0_20px_rgba(6,182,212,0.8)] scale-105'
                    : 'bg-white/5 hover:bg-white/15 text-white/80 border border-white/10'
                }`}
              >
                <span>{p.icon}</span> {p.number}. {p.title.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── 7. BOTTOM CONTROLS ─── */}
      <div className="absolute bottom-6 left-8 z-30 flex items-center gap-2">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="px-3.5 py-1.5 rounded-full bg-black/50 border border-white/20 backdrop-blur-md font-mono text-xs text-white/80 hover:text-white transition-all flex items-center gap-2"
        >
          <span>⚙ Dark Mode</span>
        </button>
      </div>

      <div className="absolute bottom-6 right-8 z-30">
        <div className="px-3 py-1 rounded-full bg-black/50 border border-white/20 backdrop-blur-md font-mono text-xs text-white/70">
          © 2026 E-V-E CLASSROOM
        </div>
      </div>

      {/* ─── 8. FULL-PAGE PANEL SCREENS ─── */}
      {activeFullPanel && (
        <div className="fixed inset-0 z-50 w-full h-full bg-[#060a12]/95 backdrop-blur-3xl text-white flex flex-col overflow-y-auto animate-in fade-in duration-300">
          
          <header className="sticky top-0 z-40 bg-[#090e1a]/90 backdrop-blur-2xl border-b border-white/15 px-6 md:px-12 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 rounded font-mono text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase font-bold">
                PANEL // {activeFullPanel.toUpperCase()}
              </span>
              <span className="font-mono text-xs text-white/50 hidden sm:inline-block">
                {initialCourse.japaneseTitle || 'コース概要'}
              </span>
            </div>

            <button
              onClick={() => setActiveFullPanel(null)}
              className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/25 border border-white/30 font-mono text-xs text-white transition-all hover:scale-105 flex items-center gap-2 shadow-lg"
            >
              <span>✕</span> TRỞ VỀ MENU CHÍNH
            </button>
          </header>

          <main className="flex-1 max-w-6xl w-full mx-auto px-6 md:px-12 py-10">
            
            {/* PANEL 1: TỔNG QUAN */}
            {activeFullPanel === 'overview' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
                <div className="p-8 md:p-12 rounded-3xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-xl shadow-2xl">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 font-mono text-xs mb-4">
                    <span>{initialCourse.japaneseTitle || 'コース概要'}</span>
                    <span>•</span>
                    <span>OVERVIEW</span>
                  </div>

                  <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                    {initialCourse.title}
                  </h2>
                  <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-8 font-light max-w-4xl">
                    {initialCourse.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-800">
                    <div className="p-6 rounded-2xl bg-black/50 border border-slate-800">
                      <div className="font-mono text-3xl font-bold text-cyan-400 mb-1">12,400+</div>
                      <div className="font-mono text-xs text-slate-400 uppercase tracking-wider">Lines of Code</div>
                    </div>
                    <div className="p-6 rounded-2xl bg-black/50 border border-slate-800">
                      <div className="font-mono text-3xl font-bold text-emerald-400">{progressPercentage}%</div>
                      <div className="font-mono text-xs text-slate-400 uppercase tracking-wider">Tiến Độ Học Bản Thân</div>
                    </div>
                    <div className="p-6 rounded-2xl bg-black/50 border border-slate-800">
                      <div className="font-mono text-3xl font-bold text-purple-400">{initialCourse.studentsCount || 128}</div>
                      <div className="font-mono text-xs text-slate-400 uppercase tracking-wider">Sĩ Số Học Viên</div>
                    </div>
                  </div>
                </div>

                {initialAnnouncements.length > 0 && (
                  <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
                    <h3 className="font-mono text-sm text-amber-400 tracking-wider uppercase mb-2">
                      📢 Thông Báo Mới Nhất Từ Giảng Viên
                    </h3>
                    {initialAnnouncements.map((ann) => (
                      <div key={ann.id} className="p-5 rounded-2xl bg-slate-950/80 border border-amber-500/30">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-bold text-amber-300 text-base">{ann.title}</h4>
                          <span className="font-mono text-xs text-slate-500">{new Date(ann.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">{ann.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PANEL 2: VÀO HỌC ONLINE */}
            {activeFullPanel === 'online' && (
              <div className="p-10 md:p-16 rounded-3xl bg-slate-900/90 border border-emerald-500/40 backdrop-blur-xl text-center space-y-8 animate-in slide-in-from-bottom-4 duration-300 shadow-2xl">
                <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 text-4xl mx-auto shadow-[0_0_40px_rgba(16,185,129,0.5)]">
                  🎥
                </div>
                <div>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Phòng Học Trực Tuyến Live Stream</h3>
                  <p className="text-slate-400 font-mono text-sm">Lớp học Google Meet / Zoom được kết nối trực tiếp</p>
                </div>

                <div className="p-8 rounded-2xl bg-black/60 border border-slate-800 max-w-2xl mx-auto space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs border border-emerald-500/40">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>BUỔI HỌC LIVE ĐANG DIỄN RA</span>
                  </div>

                  <h4 className="text-xl font-bold text-white">Chủ Đề: Hướng Dẫn Thực Hành Thuật Toán Python & Q&A</h4>
                  <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
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
                  <div className="p-8 rounded-3xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-xl">
                    <div className="flex justify-between items-center mb-4">
                      <span className="px-3 py-1 rounded bg-cyan-500/20 text-cyan-300 font-mono text-xs border border-cyan-500/30">
                        📹 VIDEO LECTURE #{selectedVideoLesson.order}
                      </span>
                      <span className="font-mono text-xs text-slate-400">{Math.round((selectedVideoLesson.duration || 1800) / 60)} Phút</span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">{selectedVideoLesson.title}</h3>
                    <p className="text-slate-300 text-sm mb-6">{selectedVideoLesson.description}</p>

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
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      {completedLessons.includes(selectedVideoLesson.id) ? '✓ Đã Hoàn Thành' : '○ Đánh Dấu Hoàn Thành'}
                    </button>
                  </div>
                )}

                <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800">
                  <h4 className="font-mono text-xs text-cyan-400 uppercase tracking-widest mb-4">Danh Sách Video Bài Giảng</h4>
                  <div className="space-y-3">
                    {videoLessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        onClick={() => setSelectedVideoLesson(lesson)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                          selectedVideoLesson?.id === lesson.id
                            ? 'border-cyan-400 bg-cyan-950/40'
                            : 'border-slate-800 bg-slate-950/30 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-cyan-400 font-mono text-sm">▶</span>
                          <span className="text-sm font-medium text-slate-200">{lesson.title}</span>
                        </div>
                        <span className="font-mono text-xs text-slate-500">{Math.round((lesson.duration || 1800) / 60)} phút</span>
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
                  <div key={res.id} className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-sm uppercase">
                          {res.fileType}
                        </span>
                        <span className="font-mono text-xs text-slate-500">{res.fileSize}</span>
                      </div>
                      <h4 className="font-bold text-white text-lg mb-2">{res.title}</h4>
                      <p className="text-xs text-slate-400 mb-6 leading-relaxed">{res.description || 'Tài liệu học tập.'}</p>
                    </div>
                    <a
                      href={res.fileUrl}
                      download
                      className="w-full py-3 rounded-xl bg-slate-800 hover:bg-cyan-500 text-slate-300 hover:text-black font-mono text-xs font-bold transition-all text-center block"
                    >
                      ↓ Tải Xuống File ({res.downloadCount || 0} lượt tải)
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* PANEL 5: BÀI TẬP VÀ NỘP BÀI TẬP */}
            {activeFullPanel === 'assignments' && (
              <div className="p-8 md:p-12 rounded-3xl bg-slate-900/90 border border-amber-500/30 backdrop-blur-xl space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-4 pb-6 border-b border-amber-500/20">
                  <span className="text-4xl">✏️</span>
                  <div>
                    <h3 className="font-bold text-white text-xl">Bài Tập Tự Luận: Thuật Toán Python</h3>
                    <p className="font-mono text-xs text-amber-300">Hạn nộp: 23:59 Chủ Nhật Tuần Này</p>
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  Yêu cầu: Viết chương trình Python nhập vào một chuỗi ký tự và đếm số lượng nguyên âm (a, e, i, o, u) xuất hiện trong chuỗi đó. Hãy dán mã nguồn bài giải của bạn vào ô bên dưới.
                </p>

                <form onSubmit={(e) => handleAssignmentSubmit(e, 'assign-1')} className="space-y-4">
                  <textarea
                    rows={8}
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    placeholder="Dán mã nguồn Python bài tập của bạn tại đây..."
                    className="w-full bg-slate-950 border border-amber-500/40 rounded-2xl p-5 text-sm font-mono text-slate-100 focus:outline-none focus:border-amber-400 leading-relaxed"
                  ></textarea>

                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs text-slate-400">Trạng thái: {submittedAssignments['assign-1'] ? '✓ Đã Nộp Bài' : 'Chưa nộp'}</span>
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
              <div className="p-8 md:p-12 rounded-3xl bg-slate-900/90 border border-purple-500/30 backdrop-blur-xl space-y-8 animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex justify-between items-center pb-6 border-b border-purple-500/20">
                  <div>
                    <h3 className="font-bold text-white text-2xl">Bài Kiểm Tra Trắc Nghiệm Quiz #1</h3>
                    <p className="font-mono text-xs text-purple-300">3 Câu hỏi • Thang điểm 30</p>
                  </div>
                  {quizScore !== null && (
                    <span className="px-5 py-2.5 rounded-2xl bg-purple-500/20 text-purple-300 font-mono font-bold text-base border border-purple-500/40">
                      Điểm Số: {quizScore}/30
                    </span>
                  )}
                </div>

                <div className="space-y-6">
                  {quizQuestions.map((q, qIdx) => (
                    <div key={qIdx} className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800">
                      <h4 className="font-semibold text-white text-base mb-4">Câu {qIdx + 1}: {q.question}</h4>
                      <div className="space-y-3">
                        {q.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            onClick={() => handleQuizOptionSelect(qIdx, oIdx)}
                            className={`p-4 rounded-xl border text-xs font-mono cursor-pointer transition-all ${
                              selectedAnswers[qIdx] === oIdx
                                ? 'border-purple-400 bg-purple-950/40 text-purple-200 font-bold'
                                : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
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

            {/* INSPECTOR PANEL */}
            {activeFullPanel === 'inspector' && (
              <div className="p-8 md:p-12 rounded-3xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-xl space-y-8 animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex justify-between items-center pb-6 border-b border-cyan-500/20">
                  <h3 className="font-mono text-lg font-bold text-cyan-400 uppercase tracking-widest">CLASSROOM INSPECTOR</h3>
                  <span className="font-mono text-xs text-slate-500">デバッガ</span>
                </div>

                <div className="space-y-6 font-mono text-xs">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-2 text-sm">
                      <span>Phần Trăm Hoàn Thành</span>
                      <span className="text-cyan-400 font-bold text-base">{progressPercentage}%</span>
                    </div>
                    <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Học Viên:</span>
                      <span className="text-white font-bold">Nguyễn Văn An</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Streak Liên Tiếp:</span>
                      <span className="text-amber-400 font-bold">🔥 7 Ngày</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Database Engine:</span>
                      <span className="text-emerald-400 font-bold">Firebase Firestore (default)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </main>

          <footer className="sticky bottom-0 z-40 bg-[#090e1a]/95 backdrop-blur-2xl border-t border-white/15 px-6 md:px-12 py-3">
            <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-2">
              <span className="font-mono text-xs text-white/50 hidden md:inline-block">CHUYỂN PANEL NHANH:</span>
              
              <div className="flex flex-wrap gap-2">
                {panels.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActiveFullPanel(p.id)}
                    className={`px-3 py-1 rounded-lg font-mono text-xs ${activeFullPanel === p.id ? 'bg-cyan-500 text-black font-bold' : 'bg-white/5 text-white/70'}`}
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
