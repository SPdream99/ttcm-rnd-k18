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
  initialDiscussions,
}: ClassroomClientProps) {
  const [activeTab, setActiveTab] = useState<'lessons' | 'announcements' | 'resources' | 'discussions' | 'ai'>('lessons');
  const [selectedLesson, setSelectedLesson] = useState<any | null>(initialLessons[0] || null);
  const [completedLessons, setCompletedLessons] = useState<string[]>(['lesson-1']);
  const [copiedShare, setCopiedShare] = useState(false);

  // E-V-E AI Chat State
  const [aiQuery, setAiQuery] = useState('');
  const [aiMessages, setAiMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: `Xin chào! Tôi là E-V-E AI Mentor của lớp "${initialCourse.title}". Bạn có thắc mắc gì về bài học hay muốn giải đáp cú pháp Python không?`,
    },
  ]);

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

  const handleSendAiQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    const userText = aiQuery;
    setAiMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setAiQuery('');

    // Simulated AI response
    setTimeout(() => {
      let aiResponse = `Cảm ơn bạn đã hỏi về "${userText}". Trong Python, tư duy quan trọng nhất là hiểu cách quản lý cấu trúc dữ liệu và phạm vi biến (scope). Bạn có muốn E-V-E minh họa code ví dụ không?`;
      if (userText.toLowerCase().includes('list') || userText.toLowerCase().includes('comprehension')) {
        aiResponse = `Về List Comprehension: Cú pháp chuẩn là \`[expression for item in iterable if condition]\`. Ví dụ: \`squares = [x**2 for x in range(10) if x % 2 == 0]\`. Rất gọn và tối ưu bộ nhớ!`;
      }
      setAiMessages((prev) => [...prev, { sender: 'ai', text: aiResponse }]);
    }, 800);
  };

  const progressPercentage = initialLessons.length > 0
    ? Math.round((completedLessons.length / initialLessons.length) * 100)
    : 35;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* ─── 1. TOP NAVBAR (Daginatsuko Minimal Navigation) ─── */}
      <header className="fixed top-0 w-full z-50 bg-[#0a101f]/80 backdrop-blur-xl border-b border-cyan-500/20 shadow-[0_0_25px_rgba(6,182,212,0.15)]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)] group-hover:scale-105 transition-transform">
                ⚡
              </span>
              <span className="font-mono text-lg font-bold tracking-widest text-cyan-400">E-V-E</span>
            </Link>
            <span className="text-slate-600 font-mono">/</span>
            <span className="font-mono text-xs text-slate-400 uppercase tracking-wider hidden sm:inline-block">
              {initialCourse.japaneseTitle || 'コース概要'} CLASSROOM
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/30 text-cyan-300 font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>LIVE SESSIONS READY</span>
            </div>
            <Link
              href="/"
              className="px-4 py-1.5 rounded-lg border border-slate-700 hover:border-cyan-400/60 bg-slate-900/60 text-slate-300 hover:text-white font-mono text-xs transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            >
              ← Về Trang Chủ
            </Link>
          </div>
        </div>
      </header>

      {/* ─── 2. HERO BANNER (Daginatsuko Style Cover Banner) ─── */}
      <section className="relative pt-24 pb-12 overflow-hidden border-b border-cyan-500/20">
        {/* Background Visual Overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-30 mix-blend-luminosity filter blur-[2px] scale-105"
          style={{
            backgroundImage: `url(${initialCourse.bannerUrl || initialCourse.thumbnailUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX3K7vGdyDUJvI340aetIU0MVajGsT-e6ecJWTX_bifO55kIvgYhItv47FSH5gOlBt4WXUH320SbsaApEiFfNdG66AoUaUjk7G5Nq2aNt68S2ryprglwBXkwjP-dZTcTo4W9-bhhwQxUNBz7Ab_4QpfnZ2OdXoMk-oGfmsIb2lzhbUotG-TIe2LGsotqgod8fmizYQiYz2IWyCnHT5k1cs7W0nk68sUTOd6qV65B-dNJH1vAu6ysgZ'})`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-[#070b14]/80 to-transparent z-0"></div>
        <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
            {/* Left Header Content */}
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 font-mono text-xs mb-4">
                <span>{initialCourse.japaneseTitle || 'コース概要'}</span>
                <span>•</span>
                <span>{initialCourse.subtitle || 'E-V-E COSMIC CLASSROOM'}</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                {initialCourse.title}
              </h1>

              <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-6 max-w-2xl font-light">
                {initialCourse.description}
              </p>

              {/* Action Buttons Row (Daginatsuko Pill Action Buttons) */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setActiveTab('lessons');
                    if (initialLessons.length > 0) setSelectedLesson(initialLessons[0]);
                  }}
                  className="px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold font-mono text-sm shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.7)] transition-all flex items-center gap-2 active:scale-95"
                >
                  <span>▶</span> Vào Bài Học Tiếp Theo
                </button>

                <button
                  onClick={() => setActiveTab('resources')}
                  className="px-5 py-3 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 font-mono text-sm transition-all flex items-center gap-2 hover:border-cyan-400"
                >
                  <span>📁</span> Tải Press Kit & Slide
                </button>

                <button
                  onClick={() => setActiveTab('ai')}
                  className="px-5 py-3 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-purple-500/30 text-purple-300 font-mono text-sm transition-all flex items-center gap-2 hover:border-purple-400"
                >
                  <span>💬</span> Hỏi E-V-E AI Mentor
                </button>

                <button
                  onClick={handleShareCopy}
                  className="px-4 py-3 rounded-lg bg-slate-900/60 border border-slate-700 hover:border-slate-500 text-slate-300 font-mono text-sm transition-all"
                >
                  {copiedShare ? '✓ Đã Copy URL' : '🔗 Chia Sẻ Lớp'}
                </button>
              </div>
            </div>

            {/* Right Card Image Preview */}
            <div className="w-full lg:w-80 shrink-0">
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.15)] relative group">
                <div className="aspect-video w-full rounded-xl overflow-hidden relative">
                  <img
                    src={initialCourse.thumbnailUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFzxfRc4zu_S4KnQjuHKNY8ZHA_W1eNLJR2iXGJJg8nGFU3FODX9yH_sOsgXUVrbX4-9Q6s5uHBXbOI7OGXYjw4SKXaGl99gDdDatnZQBRjo51CYqKYFrV-5vD5N6w18NU8WRcjrn1KpkjsZOXDHoDgTSTMTcyHoKJ1TKAY_3dVAbYnujaJFw8TtiwcwHllZybE8ID_yd_e4qrzwMJfil_a6zPQiYZPtMV5sWYokBtB7iy1AVC0S2S'}
                    alt="Course Preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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

          {/* ─── 3. STATS STRIP (Daginatsuko 4-Column Stat Category) ─── */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-900/50 border border-cyan-500/20 backdrop-blur-md">
            <div className="border-r border-slate-800 last:border-none pr-4">
              <div className="font-mono text-2xl font-bold text-cyan-400">12,400+</div>
              <div className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">Lines of Code Completed</div>
            </div>
            <div className="border-r border-slate-800 last:border-none pr-4">
              <div className="font-mono text-2xl font-bold text-emerald-400">{progressPercentage}%</div>
              <div className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">Tiến Độ Học Bản Thân</div>
            </div>
            <div className="border-r border-slate-800 last:border-none pr-4">
              <div className="font-mono text-2xl font-bold text-purple-400">{initialCourse.studentsCount || 128}</div>
              <div className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">Học Viên Đang Học</div>
            </div>
            <div>
              <div className="font-mono text-2xl font-bold text-amber-400">99.4%</div>
              <div className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">Đánh Giá Chất Lượng</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. MAIN WORKSPACE (Tabs + Content Grid + Side Inspector) ─── */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 mb-8 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('lessons')}
            className={`px-6 py-3 font-mono text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'lessons'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>📚</span> Lộ Trình Bài Học ({initialLessons.length})
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-6 py-3 font-mono text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'announcements'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>📢</span> Thông Báo Lớp ({initialAnnouncements.length})
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className={`px-6 py-3 font-mono text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'resources'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>📂</span> Thư Viện Tài Liệu ({initialResources.length})
          </button>

          <button
            onClick={() => setActiveTab('discussions')}
            className={`px-6 py-3 font-mono text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'discussions'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>💬</span> Thảo Luận Lớp ({initialDiscussions.length})
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`px-6 py-3 font-mono text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'ai'
                ? 'border-purple-400 text-purple-300 bg-purple-500/10 font-bold'
                : 'border-transparent text-purple-400/70 hover:text-purple-300'
            }`}
          >
            <span>🤖</span> E-V-E AI Workspace
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Left Content Column */}
          <div className="lg:col-span-8 space-y-6">

            {/* TAB 1: LESSONS SYLLABUS & VIEWER */}
            {activeTab === 'lessons' && (
              <div className="space-y-6">
                {/* Active Selected Lesson Player View */}
                {selectedLesson && (
                  <div className="p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                    <div className="flex justify-between items-center mb-4">
                      <span className="px-3 py-1 rounded bg-cyan-500/20 text-cyan-300 font-mono text-xs border border-cyan-500/30">
                        {selectedLesson.type === 'video' ? '📹 VIDEO LECTURE' : '📝 QUIZ & EXERCISE'}
                      </span>
                      <span className="font-mono text-xs text-slate-400">
                        Thời lượng: {Math.round((selectedLesson.duration || 1800) / 60)} Phút
                      </span>
                    </div>

                    <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                      {selectedLesson.title}
                    </h2>
                    <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                      {selectedLesson.description || 'Nội dung bài học hướng dẫn từng bước từ lý thuyết đến thực hành.'}
                    </p>

                    {/* Video / Interactive Media Placeholder */}
                    <div className="aspect-video w-full rounded-xl bg-black border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden group mb-6">
                      <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-400 text-2xl shadow-[0_0_30px_rgba(6,182,212,0.4)] group-hover:scale-110 transition-transform cursor-pointer">
                        ▶
                      </div>
                      <span className="mt-3 font-mono text-xs text-slate-400">Nhấp để phát video bài giảng với phụ đề AI</span>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                      <button
                        onClick={() => toggleLessonComplete(selectedLesson.id)}
                        className={`px-4 py-2 rounded-lg font-mono text-xs transition-all flex items-center gap-2 ${
                          completedLessons.includes(selectedLesson.id)
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20'
                        }`}
                      >
                        {completedLessons.includes(selectedLesson.id) ? '✓ Đã Hoàn Thành' : '○ Đánh Dấu Đã Hoàn Thành'}
                      </button>

                      <button
                        onClick={() => setActiveTab('ai')}
                        className="text-purple-400 hover:text-purple-300 font-mono text-xs flex items-center gap-1"
                      >
                        Hỏi AI Mentor bài này →
                      </button>
                    </div>
                  </div>
                )}

                {/* Lessons Accordion List */}
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <h3 className="font-mono text-sm text-cyan-400 tracking-wider uppercase mb-4">
                    Danh Sách Bài Học ({initialLessons.length})
                  </h3>

                  <div className="space-y-3">
                    {initialLessons.map((lesson, idx) => {
                      const isCompleted = completedLessons.includes(lesson.id);
                      const isSelected = selectedLesson?.id === lesson.id;

                      return (
                        <div
                          key={lesson.id}
                          onClick={() => setSelectedLesson(lesson)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                            isSelected
                              ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                              : 'border-slate-800/80 bg-slate-950/40 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLessonComplete(lesson.id);
                              }}
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono border transition-all ${
                                isCompleted
                                  ? 'bg-emerald-500 border-emerald-400 text-black font-bold'
                                  : 'border-slate-700 text-slate-500 hover:border-cyan-400'
                              }`}
                            >
                              {isCompleted ? '✓' : idx + 1}
                            </span>

                            <div>
                              <h4 className={`text-sm font-medium ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                                {lesson.title}
                              </h4>
                              <span className="font-mono text-[11px] text-slate-500">
                                {lesson.type === 'video' ? '📹 Video' : '📝 Bài Tập Quiz'} • {Math.round((lesson.duration || 1800) / 60)} phút
                              </span>
                            </div>
                          </div>

                          <span className="font-mono text-xs text-cyan-400/80">
                            {isSelected ? 'Đang Học ▶' : 'Xem'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ANNOUNCEMENTS */}
            {activeTab === 'announcements' && (
              <div className="space-y-4">
                {initialAnnouncements.map((ann) => (
                  <div
                    key={ann.id}
                    className="p-6 rounded-2xl bg-slate-900/80 border border-cyan-500/20 backdrop-blur-xl relative overflow-hidden"
                  >
                    {ann.isImportant && (
                      <div className="absolute top-0 right-0 px-3 py-1 bg-amber-500/20 border-l border-b border-amber-500/40 text-amber-300 font-mono text-[10px]">
                        ★ TRỌNG TÂM
                      </div>
                    )}

                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center font-bold text-cyan-300 font-mono">
                        {ann.authorName[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">{ann.authorName}</div>
                        <div className="font-mono text-xs text-slate-400">
                          {new Date(ann.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-cyan-300 mb-2">{ann.title}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                      {ann.content}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: RESOURCES */}
            {activeTab === 'resources' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {initialResources.map((res) => (
                  <div
                    key={res.id}
                    className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs uppercase">
                          {res.fileType}
                        </span>
                        <span className="font-mono text-xs text-slate-500">{res.fileSize}</span>
                      </div>

                      <h4 className="font-semibold text-white text-sm mb-2 group-hover:text-cyan-300 transition-colors">
                        {res.title}
                      </h4>
                      <p className="text-slate-400 text-xs mb-4 line-clamp-2">
                        {res.description || 'Tài liệu hướng dẫn thực hành và slide tổng hợp.'}
                      </p>
                    </div>

                    <a
                      href={res.fileUrl}
                      download
                      className="w-full py-2 rounded bg-slate-800 hover:bg-cyan-500 text-slate-300 hover:text-black font-mono text-xs font-semibold transition-all text-center block"
                    >
                      ↓ Download File ({res.downloadCount || 0} lượt tải)
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: DISCUSSIONS */}
            {activeTab === 'discussions' && (
              <div className="space-y-4">
                {initialDiscussions.map((disc) => (
                  <div key={disc.id} className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-slate-100 text-sm">{disc.title}</h4>
                      {disc.isResolved && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                          ✓ Đã Giải Đáp
                        </span>
                      )}
                    </div>
                    <p className="text-slate-300 text-xs mb-3">{disc.content}</p>
                    <div className="flex justify-between items-center font-mono text-[11px] text-slate-500 border-t border-slate-800/80 pt-3">
                      <span>Bởi: {disc.authorName} ({disc.authorRole})</span>
                      <span>💬 {disc.replyCount} Phản Hồi</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 5: E-V-E AI MENTOR WORKSPACE */}
            {activeTab === 'ai' && (
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-purple-500/30 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-purple-500/20">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-400 flex items-center justify-center text-purple-300 text-lg shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                    🤖
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">E-V-E AI Mentor Workspace</h3>
                    <p className="font-mono text-xs text-purple-300">Trợ lý trí tuệ nhân tạo riêng cho lớp {initialCourse.title}</p>
                  </div>
                </div>

                {/* Messages Box */}
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2 mb-4">
                  {aiMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`p-4 rounded-xl max-w-xl text-sm leading-relaxed font-sans ${
                          msg.sender === 'user'
                            ? 'bg-cyan-950/60 border border-cyan-500/40 text-cyan-100 rounded-tr-none'
                            : 'bg-slate-950/80 border border-purple-500/30 text-slate-200 rounded-tl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Query Form */}
                <form onSubmit={handleSendAiQuery} className="flex gap-2">
                  <input
                    type="text"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    placeholder="Gõ thắc mắc hoặc yêu cầu giải thích cú pháp Python tại đây..."
                    className="flex-1 bg-slate-950 border border-purple-500/40 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-400 font-mono"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-sm font-semibold shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"
                  >
                    Gửi AI
                  </button>
                </form>
              </div>
            )}

          </div>

          {/* ─── 5. SIDE INSPECTOR (Daginatsuko Debugger Style) ─── */}
          <div className="lg:col-span-4 space-y-6">
            {/* Student Status Inspector Card */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-cyan-500/20 backdrop-blur-xl relative">
              <div className="flex justify-between items-center mb-4">
                <span className="font-mono text-xs text-cyan-400 tracking-widest uppercase">
                  THÔNG TIN TIẾN ĐỘ
                </span>
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
                    <span className="text-slate-400">Chứng Chỉ AI:</span>
                    <span className="text-purple-400">Sẵn Sàng Sau 100%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Helper Info */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 font-mono text-xs text-slate-400">
              <div className="text-cyan-400 font-bold">💡 E-V-E TIPS FOR STUDENTS</div>
              <p className="leading-relaxed font-sans text-slate-300">
                Hãy luyện tập gõ lại code bài giảng trực tiếp vào môi trường Python thay vì chỉ xem video để đạt hiệu quả ghi nhớ cao nhất!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
