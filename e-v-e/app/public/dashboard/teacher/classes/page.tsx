'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function TeacherClassesPage() {
  const [activeTab, setActiveTab] = useState<'students' | 'lectures' | 'assignments'>('students');

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6 md:p-10 font-sans">
      <header className="max-w-6xl mx-auto flex justify-between items-center pb-6 border-b border-emerald-500/20 mb-8">
        <div className="flex items-center gap-3">
          <Link href="/public/dashboard/teacher" className="font-mono text-xs text-emerald-400 hover:underline">
            ← Dashboard Giảng Viên
          </Link>
          <span className="text-slate-600 font-mono">/</span>
          <span className="font-mono text-sm text-white font-bold">CLASS MANAGEMENT</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto space-y-8">
        {/* Class Header */}
        <div className="p-8 rounded-3xl bg-[#0f1524]/80 border border-emerald-500/30 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs border border-emerald-500/30">
                CLASS ID: COURSE-001
              </span>
              <h1 className="text-3xl font-extrabold text-white mt-2">Lập Trình Python AI & Machine Learning</h1>
              <p className="text-xs text-slate-400 font-mono mt-1">Giảng viên phụ trách: ThS. Trần Thị Bình</p>
            </div>
            <Link
              href="/public/courses/course-001"
              className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-mono font-bold text-xs hover:bg-cyan-400 transition-all"
            >
              🚀 Mở Lớp Học Daginatsuko
            </Link>
          </div>

          {/* Sub Navigation Tabs: Student Management | Lecture Management | Assignment Management */}
          <div className="flex gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs pt-4">
            <button
              onClick={() => setActiveTab('students')}
              className={`flex-1 py-3 rounded-xl transition-all ${
                activeTab === 'students' ? 'bg-emerald-500 text-black font-bold shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              🎓 Student Management (Quản Lý Học Sinh)
            </button>
            <button
              onClick={() => setActiveTab('lectures')}
              className={`flex-1 py-3 rounded-xl transition-all ${
                activeTab === 'lectures' ? 'bg-emerald-500 text-black font-bold shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              📚 Lecture Management (Quản Lý Bài Giảng)
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`flex-1 py-3 rounded-xl transition-all ${
                activeTab === 'assignments' ? 'bg-emerald-500 text-black font-bold shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              ✏️ Assignment Management (Quản Lý Bài Tập)
            </button>
          </div>
        </div>

        {/* Tab 1: Student Management */}
        {activeTab === 'students' && (
          <div className="p-8 rounded-3xl bg-[#0f1524]/60 border border-slate-800 space-y-4">
            <h3 className="font-mono text-xs text-emerald-400 uppercase tracking-widest">Danh Sách Học Sinh Trong Lớp</h3>
            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span>1. Nguyễn Văn An (an.nguyen@student.edu.vn)</span>
                <span className="text-emerald-400 font-bold">Tiến độ: 80%</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span>2. Trần Thị Minh (minh.tran@student.edu.vn)</span>
                <span className="text-emerald-400 font-bold">Tiến độ: 65%</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Lecture Management */}
        {activeTab === 'lectures' && (
          <div className="p-8 rounded-3xl bg-[#0f1524]/60 border border-slate-800 space-y-4">
            <h3 className="font-mono text-xs text-emerald-400 uppercase tracking-widest">Danh Sách Bài Giảng & Video 4K</h3>
            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span>📹 Bài 1: Giới thiệu Python & Cài đặt môi trường Anaconda</span>
                <span className="text-cyan-400">Thời lượng: 45 phút</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span>📹 Bài 2: Biến, Kiểu dữ liệu và Các phép toán cơ bản</span>
                <span className="text-cyan-400">Thời lượng: 60 phút</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Assignment Management */}
        {activeTab === 'assignments' && (
          <div className="p-8 rounded-3xl bg-[#0f1524]/60 border border-slate-800 space-y-4">
            <h3 className="font-mono text-xs text-amber-400 uppercase tracking-widest">Danh Sách Bài Tập & Chấm Điểm Nộp Bài</h3>
            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-amber-300 text-sm mb-1">Bài Tập Tự Luận: Thuật Toán Đếm Nguyên Âm Python</h4>
                  <p className="text-slate-400">Hạn nộp: 23:59 Chủ Nhật</p>
                </div>
                <span className="px-3 py-1.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Đã nộp: 12/15 học sinh
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
