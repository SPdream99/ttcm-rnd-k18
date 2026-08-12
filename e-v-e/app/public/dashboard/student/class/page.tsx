'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function StudentClassPage() {
  const [activeTab, setActiveTab] = useState<'member' | 'assignment'>('member');

  const members = [
    { name: 'ThS. Trần Thị Bình', role: '👨‍🏫 Giảng viên' },
    { name: 'Nguyễn Văn An', role: '🎓 Học sinh (Bạn)' },
    { name: 'Trần Thị Minh', role: '🎓 Học sinh' },
    { name: 'Lê Hoàng Nam', role: '🎓 Học sinh' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6 md:p-10 font-sans">
      <header className="max-w-4xl mx-auto flex justify-between items-center pb-6 border-b border-sky-500/20 mb-8">
        <div className="flex items-center gap-3">
          <Link href="/public/dashboard/student" className="font-mono text-xs text-sky-400 hover:underline">
            ← Dashboard Học Sinh
          </Link>
          <span className="text-slate-600 font-mono">/</span>
          <span className="font-mono text-sm text-white font-bold">CLASS (STUDENT)</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto space-y-8">
        {/* Class Info Card */}
        <div className="p-8 rounded-3xl bg-[#0f1524]/80 border border-sky-500/30 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="px-3 py-1 rounded bg-sky-500/20 text-sky-300 font-mono text-xs border border-sky-500/30">
                CLASS: LẬP TRÌNH PYTHON AI
              </span>
              <h1 className="text-3xl font-extrabold text-white mt-2">Lớp Học Tương Tác Python AI</h1>
              <p className="text-xs text-slate-400 font-mono mt-1">Giảng viên: ThS. Trần Thị Bình</p>
            </div>
            <Link
              href="/public/courses/course-001"
              className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-mono font-bold text-xs hover:bg-cyan-400 transition-all"
            >
              🚀 Vào Lớp Daginatsuko
            </Link>
          </div>

          {/* Sub Navigation Tabs: Member | Assignment */}
          <div className="flex gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs pt-4">
            <button
              onClick={() => setActiveTab('member')}
              className={`flex-1 py-3 rounded-xl transition-all ${
                activeTab === 'member' ? 'bg-sky-500 text-black font-bold shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              👥 Member (Danh Sách Thành Viên Lớp)
            </button>
            <button
              onClick={() => setActiveTab('assignment')}
              className={`flex-1 py-3 rounded-xl transition-all ${
                activeTab === 'assignment' ? 'bg-sky-500 text-black font-bold shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              ✏️ Assignment (Bài Tập Lớp)
            </button>
          </div>
        </div>

        {/* Tab 1: Member */}
        {activeTab === 'member' && (
          <div className="p-8 rounded-3xl bg-[#0f1524]/60 border border-slate-800 space-y-4">
            <h3 className="font-mono text-xs text-sky-400 uppercase tracking-widest">Danh Sách Thành Viên ({members.length})</h3>
            <div className="space-y-3 font-mono text-xs">
              {members.map((m, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <span className="font-bold text-white text-sm">{m.name}</span>
                  <span className="px-3 py-1 rounded bg-slate-900 border border-slate-700 text-sky-300">{m.role}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Assignment */}
        {activeTab === 'assignment' && (
          <div className="p-8 rounded-3xl bg-[#0f1524]/60 border border-slate-800 space-y-4">
            <h3 className="font-mono text-xs text-amber-400 uppercase tracking-widest">Bài Tập Được Giao</h3>
            <div className="p-6 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-3">
              <div className="flex justify-between items-center font-mono text-xs">
                <h4 className="font-bold text-amber-300 text-sm">Bài Tập Tự Luận: Thuật Toán Đếm Nguyên Âm Python</h4>
                <span className="text-slate-400">Hạn nộp: 23:59 Chủ Nhật</span>
              </div>
              <p className="text-xs text-slate-300">Viết chương trình Python đếm số lượng nguyên âm trong chuỗi ký tự.</p>
              <Link
                href="/public/courses/course-001"
                className="inline-block px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs transition-all"
              >
                Vào Nộp Bài Tập Ngay →
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
