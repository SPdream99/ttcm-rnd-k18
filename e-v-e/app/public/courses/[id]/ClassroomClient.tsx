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
  // 6 Panel chính theo đúng thứ tự yêu cầu:
  // 1. Tổng quan | 2. Vào học online | 3. Học bằng video | 4. Tài liệu | 5. Bài tập và nộp bài tập | 6. Quize
  const [activePanel, setActivePanel] = useState<
    'overview' | 'online' | 'video' | 'resources' | 'assignments' | 'quizzes'
  >('overview');

  // Video Selected State
  const [selectedVideoLesson, setSelectedVideoLesson] = useState<any | null>(
    initialLessons.find((l) => l.type === 'video') || initialLessons[0] || null
  );

  // Completed Lessons State
  const [completedLessons, setCompletedLessons] = useState<string[]>(['lesson-1']);
  const [copiedShare, setCopiedShare] = useState(false);

  // Assignment Submission State
  const [submissionText, setSubmissionText] = useState('');
  const [submittedAssignments, setSubmittedAssignments] = useState<Record<string, string>>({});

  // Quiz State
  const [activeQuizIndex, setActiveQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Sample Quiz Questions
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
    <div className="min-h-screen bg-[#060a12] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* ─── TOP NAVIGATION BAR (Daginatsuko Style Header) ─── */}
      <header className="fixed top-0 w-full z-50 bg-[#090e1a]/85 backdrop-blur-2xl border-b border-cyan-500/20 shadow-[0_4px_30px_rgba(6,182,212,0.12)]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.35)] group-hover:scale-105 transition-transform">
                ⚡
              </span>
              <span className="font-mono text-xl font-bold tracking-widest text-cyan-400">E-V-E</span>
            </Link>
            <span className="text-slate-600 font-mono">/</span>
            <span className="font-mono text-xs text-slate-400 tracking-wider hidden sm:inline-block">
              {initialCourse.japaneseTitle || 'コース概要'} CLASSROOM
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3.5 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>LIVE SERVER ONLINE</span>
            </div>
            <Link
              href="/"
              className="px-4 py-1.5 rounded-lg border border-slate-700 hover:border-cyan-400 bg-slate-900/80 text-slate-300 hover:text-white font-mono text-xs transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.25)]"
            >
              ← Về Trang Chủ
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO BANNER SECTION (Daginatsuko Glass Banner & Stats) ─── */}
      <section className="relative pt-24 pb-10 overflow-hidden border-b border-cyan-500/20">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-25 mix-blend-luminosity filter blur-[1px] scale-105"
          style={{
            backgroundImage: `url(${initialCourse.bannerUrl || initialCourse.thumbnailUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX3K7vGdyDUJvI340aetIU0MVajGsT-e6ecJWTX_bifO55kIvgYhItv47FSH5gOlBt4WXUH320SbsaApEiFfNdG66AoUaUjk7G5Nq2aNt68S2ryprglwBXkwjP-dZTcTo4W9-bhhwQxUNBz7Ab_4QpfnZ2OdXoMk-oGfmsIb2lzhbUotG-TIe2LGsotqgod8fmizYQiYz2IWyCnHT5k1cs7W0nk68sUTOd6qV65B-dNJH1vAu6ysgZ'})`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#060a12] via-[#060a12]/85 to-transparent z-0"></div>
        <div className="absolute top-12 right-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 font-mono text-xs mb-4">
                <span>{initialCourse.japaneseTitle || 'コース概要'}</span>
                <span>•</span>
                <span>{initialCourse.subtitle || 'E-V-E COSMIC CLASSROOM'}</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                {initialCourse.title}
              </h1>

              <p className="text-slate-300 text-base leading-relaxed mb-6 max-w-2xl font-light">
                {initialCourse.description}
              </p>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setActivePanel('online')}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-mono text-sm shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:shadow-[0_0_35px_rgba(16,185,129,0.7)] transition-all flex items-center gap-2 active:scale-95"
                >
                  <span>🟢</span> Vào Học Online Trực Tuyến
                </button>

                <button
                  onClick={() => setActivePanel('video')}
                  className="px-5 py-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 font-mono text-sm transition-all flex items-center gap-2"
                >
                  <span>▶</span> Xem Video Bài Giảng
                </button>

                <button
                  onClick={handleShareCopy}
                  className="px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-slate-500 text-slate-300 font-mono text-sm transition-all"
                >
                  {copiedShare ? '✓ Đã Copy URL' : '🔗 Chia Sẻ Lớp'}
                </button>
              </div>
            </div>

            {/* Course Card Preview */}
            <div className="w-full lg:w-80 shrink-0">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.15)] relative">
                <div className="aspect-video w-full rounded-xl overflow-hidden relative">
                  <img
                    src={initialCourse.thumbnailUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFzxfRc4zu_S4KnQjuHKNY8ZHA_W1eNLJR2iXGJJg8nGFU3FODX9yH_sOsgXUVrbX4-9Q6s5uHBXbOI7OGXYjw4SKXaGl99gDdDatnZQBRjo51CYqKYFrV-5vD5N6w18NU8WRcjrn1KpkjsZOXDHoDgTSTMTcyHoKJ1TKAY_3dVAbYnujaJFw8TtiwcwHllZybE8ID_yd_e4qrzwMJfil_a6zPQiYZPtMV5sWYokBtB7iy1AVC0S2S'}
                    alt="Course Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                    <span className="font-mono text-xs text-cyan-300 font-semibold">
                      THỜI LƯỢNG: {initialCourse.totalDuration || '24 Giờ 30 Phút'}
                    </span>
                  </div>
                </div>

                <div className="mt-3 px-1 flex justify-between items-center text-xs font-mono text-slate-400">
                  <span>Giảng Viên: Trần Thị Bình</span>
                  <span className="text-emerald-400">● Live Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-900/50 border border-cyan-500/20 backdrop-blur-md">
            <div className="border-r border-slate-800 last:border-none pr-4">
              <div className="font-mono text-2xl font-bold text-cyan-400">12,400+</div>
              <div className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">Lines of Code</div>
            </div>
            <div className="border-r border-slate-800 last:border-none pr-4">
              <div className="font-mono text-2xl font-bold text-emerald-400">{progressPercentage}%</div>
              <div className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">Tiến Độ Bản Thân</div>
            </div>
            <div className="border-r border-slate-800 last:border-none pr-4">
              <div className="font-mono text-2xl font-bold text-purple-400">{initialCourse.studentsCount || 128}</div>
              <div className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">Sĩ Số Học Viên</div>
            </div>
            <div>
              <div className="font-mono text-2xl font-bold text-amber-400">99.4%</div>
              <div className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">Đánh Giá Lớp Học</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6 PANEL CHÍNH THEO ĐÚNG THỨ TỰ YÊU CẦU ─── */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        
        {/* PANEL TABS HEADER */}
        <div className="flex border-b border-slate-800 mb-8 overflow-x-auto scrollbar-none gap-1">
          <button
            onClick={() => setActivePanel('overview')}
            className={`px-5 py-3.5 font-mono text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activePanel === 'overview'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>1.</span> 📌 Tổng quan
          </button>

          <button
            onClick={() => setActivePanel('online')}
            className={`px-5 py-3.5 font-mono text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activePanel === 'online'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>2.</span> 🌐 Vào học online
          </button>

          <button
            onClick={() => setActivePanel('video')}
            className={`px-5 py-3.5 font-mono text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activePanel === 'video'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>3.</span> 🎥 Học bằng video
          </button>

          <button
            onClick={() => setActivePanel('resources')}
            className={`px-5 py-3.5 font-mono text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activePanel === 'resources'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>4.</span> 📁 Tài liệu
          </button>

          <button
            onClick={() => setActivePanel('assignments')}
            className={`px-5 py-3.5 font-mono text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activePanel === 'assignments'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>5.</span> ✏️ Bài tập và nộp bài tập
          </button>

          <button
            onClick={() => setActivePanel('quizzes')}
            className={`px-5 py-3.5 font-mono text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activePanel === 'quizzes'
                ? 'border-purple-400 text-purple-300 bg-purple-500/10 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>6.</span> 🧩 Quize
          </button>
        </div>

        {/* WORKSPACE LAYOUT: Left Main Panel Content + Right Debugger Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">

            {/* PANEL 1: TỔNG QUAN */}
            {activePanel === 'overview' && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-xl">
                  <h3 className="font-mono text-sm text-cyan-400 tracking-wider uppercase mb-3">
                    Mô Tả Lớp Học & Mục Tiêu Đầu Ra
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6 whitespace-pre-line">
                    {initialCourse.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="font-mono text-xs text-cyan-400 font-bold mb-1">🎯 CHUẨN ĐẦU RA</div>
                      <p className="text-xs text-slate-300">Nắm vững cú pháp Python, lập trình hướng đối tượng, xử lý dữ liệu và xây dựng mô hình AI cơ bản.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="font-mono text-xs text-purple-400 font-bold mb-1">🤖 HỖ TRỢ AI MENTOR</div>
                      <p className="text-xs text-slate-300">Trợ Lý E-V-E tích hợp trực tiếp, giải đáp thắc mắc code 24/7 qua phương pháp Socratics.</p>
                    </div>
                  </div>
                </div>

                {/* Important Announcements Feed */}
                {initialAnnouncements.length > 0 && (
                  <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <h3 className="font-mono text-sm text-amber-400 tracking-wider uppercase mb-4">
                      📢 Thông Báo Mới Nhất Từ Giảng Viên
                    </h3>
                    {initialAnnouncements.map((ann) => (
                      <div key={ann.id} className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/20 mb-3 last:mb-0">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-amber-300 text-sm">{ann.title}</span>
                          <span className="font-mono text-[11px] text-slate-500">{new Date(ann.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{ann.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PANEL 2: VÀO HỌC ONLINE */}
            {activePanel === 'online' && (
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-emerald-500/30 backdrop-blur-xl shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-emerald-500/20">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 text-2xl shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                    🎥
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">Phòng Học Trực Tuyến Live Stream</h3>
                    <p className="font-mono text-xs text-emerald-300">Lớp học Google Meet / Zoom tích hợp trực tiếp</p>
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-4 mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs border border-emerald-500/40">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>BUỔI HỌC LIVE ĐANG DIỄN RA</span>
                  </div>

                  <h4 className="text-xl font-bold text-white">Chủ Đề: Hướng Dẫn Thực Hành Thuật Toán Python & Q&A</h4>
                  <p className="text-xs text-slate-400 max-w-lg mx-auto">
                    Giảng viên Trần Thị Bình đang chủ trì lớp học online. Nhấp nút bên dưới để vào phòng học ngay.
                  </p>

                  <a
                    href="https://meet.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-mono text-sm shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all hover:scale-105"
                  >
                    🚀 Tham Gia Phòng Học Google Meet
                  </a>
                </div>
              </div>
            )}

            {/* PANEL 3: HỌC BẰNG VIDEO */}
            {activePanel === 'video' && (
              <div className="space-y-6">
                {selectedVideoLesson && (
                  <div className="p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-xl">
                    <div className="flex justify-between items-center mb-3">
                      <span className="px-3 py-1 rounded bg-cyan-500/20 text-cyan-300 font-mono text-xs border border-cyan-500/30">
                        📹 VIDEO LECTURE #{selectedVideoLesson.order}
                      </span>
                      <span className="font-mono text-xs text-slate-400">
                        {Math.round((selectedVideoLesson.duration || 1800) / 60)} Phút
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-white mb-2">{selectedVideoLesson.title}</h2>
                    <p className="text-slate-300 text-xs mb-4">{selectedVideoLesson.description}</p>

                    {/* Video Player */}
                    <div className="aspect-video w-full rounded-xl bg-black border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden group mb-4">
                      <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-400 text-2xl shadow-[0_0_30px_rgba(6,182,212,0.4)] group-hover:scale-110 transition-transform cursor-pointer">
                        ▶
                      </div>
                      <span className="mt-3 font-mono text-xs text-slate-400">Phát video bài giảng chất lượng 4K</span>
                    </div>

                    <button
                      onClick={() => toggleLessonComplete(selectedVideoLesson.id)}
                      className={`px-4 py-2 rounded-lg font-mono text-xs transition-all ${
                        completedLessons.includes(selectedVideoLesson.id)
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      {completedLessons.includes(selectedVideoLesson.id) ? '✓ Đã Hoàn Thành' : '○ Đánh Dấu Hoàn Thành'}
                    </button>
                  </div>
                )}

                {/* Playlist Video List */}
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <h3 className="font-mono text-sm text-cyan-400 uppercase tracking-wider mb-4">Danh Sách Video Bài Giảng</h3>
                  <div className="space-y-2">
                    {videoLessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        onClick={() => setSelectedVideoLesson(lesson)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                          selectedVideoLesson?.id === lesson.id
                            ? 'border-cyan-400 bg-cyan-950/40'
                            : 'border-slate-800 bg-slate-950/30 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-cyan-400 font-mono text-xs">▶</span>
                          <span className="text-xs font-medium text-slate-200">{lesson.title}</span>
                        </div>
                        <span className="font-mono text-[11px] text-slate-500">{Math.round((lesson.duration || 1800) / 60)} phút</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PANEL 4: TÀI LIỆU */}
            {activePanel === 'resources' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {initialResources.map((res) => (
                  <div
                    key={res.id}
                    className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs uppercase">
                          {res.fileType}
                        </span>
                        <span className="font-mono text-xs text-slate-500">{res.fileSize}</span>
                      </div>
                      <h4 className="font-semibold text-white text-sm mb-2">{res.title}</h4>
                      <p className="text-slate-400 text-xs mb-4">{res.description || 'Tài liệu hướng dẫn.'}</p>
                    </div>
                    <a
                      href={res.fileUrl}
                      download
                      className="w-full py-2 rounded bg-slate-800 hover:bg-cyan-500 text-slate-300 hover:text-black font-mono text-xs font-semibold transition-all text-center block"
                    >
                      ↓ Tải Xuống File ({res.downloadCount || 0} lượt tải)
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* PANEL 5: BÀI TẬP VÀ NỘP BÀI TẬP */}
            {activePanel === 'assignments' && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-slate-900/90 border border-amber-500/30 backdrop-blur-xl">
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-amber-500/20">
                    <span className="text-2xl">✏️</span>
                    <div>
                      <h3 className="font-bold text-white text-base">Bài Tập Tự Luận #1: Thuật Toán Xử Lý Chuỗi Python</h3>
                      <p className="font-mono text-xs text-amber-300">Hạn nộp: 23:59 Chủ Nhật Tuần Này</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Yêu cầu: Viết chương trình Python nhập vào một chuỗi ký tự và đếm số lượng nguyên âm (a, e, i, o, u) xuất hiện trong chuỗi đó. Hãy upload file `.py` hoặc dán code giải bài tập vào ô bên dưới.
                  </p>

                  <form onSubmit={(e) => handleAssignmentSubmit(e, 'assign-1')} className="space-y-3">
                    <textarea
                      rows={5}
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.target.value)}
                      placeholder="Dán mã nguồn Python bài tập của bạn tại đây..."
                      className="w-full bg-slate-950 border border-amber-500/30 rounded-xl p-4 text-xs font-mono text-slate-100 focus:outline-none focus:border-amber-400"
                    ></textarea>

                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs text-slate-500">Đã nộp: {submittedAssignments['assign-1'] ? '✓ Đã Nộp Bài' : 'Chưa nộp'}</span>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold font-mono text-xs transition-all"
                      >
                        Nộp Bài Tập
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* PANEL 6: QUIZE */}
            {activePanel === 'quizzes' && (
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-purple-500/30 backdrop-blur-xl">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-purple-500/20">
                  <div>
                    <h3 className="font-bold text-white text-base">Bài Kiểm Tra Trắc Nghiệm Quiz #1</h3>
                    <p className="font-mono text-xs text-purple-300">3 Câu hỏi • Thang điểm 30</p>
                  </div>
                  {quizScore !== null && (
                    <span className="px-4 py-2 rounded-xl bg-purple-500/20 text-purple-300 font-mono font-bold text-sm border border-purple-500/40">
                      Điểm Số: {quizScore}/30
                    </span>
                  )}
                </div>

                <div className="space-y-6">
                  {quizQuestions.map((q, qIdx) => (
                    <div key={qIdx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                      <h4 className="font-semibold text-white text-sm mb-3">
                        Câu {qIdx + 1}: {q.question}
                      </h4>
                      <div className="space-y-2">
                        {q.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            onClick={() => handleQuizOptionSelect(qIdx, oIdx)}
                            className={`p-3 rounded-lg border text-xs font-mono cursor-pointer transition-all ${
                              selectedAnswers[qIdx] === oIdx
                                ? 'border-purple-400 bg-purple-950/40 text-purple-200'
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
                  className="mt-6 w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-sm font-bold shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"
                >
                  Nộp Bài Kiểm Tra Quiz
                </button>
              </div>
            )}

          </div>

          {/* ─── RIGHT DEBUGGER INSPECTOR PANEL ─── */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-cyan-500/20 backdrop-blur-xl">
              <div className="flex justify-between items-center mb-4">
                <span className="font-mono text-xs text-cyan-400 tracking-widest uppercase">INSPECTOR</span>
                <span className="font-mono text-xs text-slate-500">デバッガ</span>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Phần Trăm Hoàn Thành</span>
                    <span className="text-cyan-400 font-bold">{progressPercentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Học Viên:</span>
                    <span className="text-slate-200">Nguyễn Văn An</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Streak Liên Tiếp:</span>
                    <span className="text-amber-400">🔥 7 Ngày</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Database Engine:</span>
                    <span className="text-emerald-400">Firestore (default)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
