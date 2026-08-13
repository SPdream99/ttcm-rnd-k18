'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function TeacherAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([
    { id: '1', title: 'Thông Báo Kiểm Tra giữa kỳ Python AI', content: 'Lớp học sẽ làm bài kiểm tra trắc nghiệm 30 phút vào tiết 2 ngày mai.', createdAt: '12/08/2026' },
  ]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    setAnnouncements([
      { id: Date.now().toString(), title, content, createdAt: new Date().toLocaleDateString('vi-VN') },
      ...announcements,
    ]);
    setTitle('');
    setContent('');
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6 md:p-10 font-sans">
      <header className="max-w-4xl mx-auto flex justify-between items-center pb-6 border-b border-amber-500/20 mb-8">
        <div className="flex items-center gap-3">
          <Link href="/public/dashboard/teacher" className="font-mono text-xs text-amber-400 hover:underline">
            ← Dashboard Giảng Viên
          </Link>
          <span className="text-slate-600 font-mono">/</span>
          <span className="font-mono text-sm text-white font-bold">ANNOUNCEMENT & CONVERSATION</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto space-y-8">
        {/* Form Post Announcement */}
        <div className="p-8 rounded-3xl bg-[#0f1524]/80 border border-amber-500/30 backdrop-blur-xl shadow-2xl space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📢</span> Đăng Thông Báo Hoặc Khởi Tạo Trò Chuyện
          </h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tiêu đề thông báo..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-400"
              required
            />
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nội dung chi tiết thông báo gửi đến toàn bộ học sinh trong lớp..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-400"
              required
            ></textarea>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold font-mono text-xs transition-all"
            >
              🚀 Đăng Thông Báo Ngay
            </button>
          </form>
        </div>

        {/* List of Announcements */}
        <div className="p-8 rounded-3xl bg-[#0f1524]/50 border border-slate-800 space-y-4">
          <h3 className="font-mono text-xs text-amber-400 uppercase tracking-widest">Danh Sách Thông Báo Đã Phát</h3>
          <div className="space-y-3">
            {announcements.map((ann) => (
              <div key={ann.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-amber-300 text-base">{ann.title}</h4>
                  <span className="font-mono text-xs text-slate-500">{ann.createdAt}</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
