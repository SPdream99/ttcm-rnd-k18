"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTeacherAdapter } from "@/hooks/useTeacherAdapter";
import {
  BookOpen,
  Users,
  FileText,
  Video,
  Plus,
  GraduationCap,
  CheckCircle2,
  Layers,
} from "lucide-react";

export default function TeacherClassManagementPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newClassSubject, setNewClassSubject] = useState("");
  const [newClassGrade, setNewClassGrade] = useState("Khối 10");
  const [createSuccess, setCreateSuccess] = useState(false);

  const { classes, stats, loading } = useTeacherAdapter();

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    setCreateSuccess(true);
    setTimeout(() => {
      setCreateSuccess(false);
      setIsCreateModalOpen(false);
      setNewClassName("");
      setNewClassSubject("");
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 font-sans">
        <div className="w-12 h-12 rounded-full border-4 border-red-200 border-t-red-600 animate-spin" />
        <p className="text-red-600 font-bold text-sm">Đang tải danh sách quản lý lớp giảng viên...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b-2 border-zinc-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 mb-1.5">
            <BookOpen className="w-4 h-4" /> Bàn Làm Việc Giảng Dạy & Điều Hành Lớp
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
            Quản Lý Lớp Học & Bài Giảng 
          </h1>
          <p className="text-xs md:text-sm text-zinc-500 mt-1">
            Không gian điều hành sĩ số, ngân hàng bài tập và kho tài liệu giảng dạy.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs md:text-sm transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Tạo Lớp Học Mới
          </button>
        </div>
      </header>

      {/* Metric Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((st, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm"
          >
            <div className="text-xs font-bold text-zinc-500 uppercase mb-1">{st.title}</div>
            <div className="text-2xl font-black text-zinc-900 font-mono">{st.value}</div>
            <p className="text-[11px] text-red-600 font-bold mt-0.5">{st.change}</p>
          </div>
        ))}
      </div>

      {/* Classes Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-red-600" /> Danh Sách Lớp Phụ Trách ({classes.length})
          </h2>
          <span className="text-xs text-zinc-500">Học kỳ 1 • 2026 - 2027</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="p-6 rounded-2xl bg-white border border-zinc-200 hover:border-red-600 transition-colors shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-md bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                      {cls.subject}
                    </span>
                    <h3 className="font-bold text-lg text-zinc-900 mt-1.5">{cls.name}</h3>
                  </div>
                  <div className="text-right">
                    <div className="px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-800 font-mono text-xs font-bold">
                      GPA {cls.avgGpa}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-zinc-500 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-red-600" /> Sĩ số: <strong className="text-zinc-900">{cls.studentsCount} học sinh</strong>
                  </span>
                  <span>•</span>
                  <span>Khối: <strong className="text-zinc-900">{cls.grade}</strong></span>
                </div>
              </div>

              {/* Action Buttons to 3 Sub-Features */}
              <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-zinc-100">
                <Link
                  href="/teacher/classes/students"
                  className="p-3 rounded-xl bg-zinc-50 hover:bg-red-50 text-zinc-700 hover:text-red-700 text-xs font-bold border border-zinc-200 transition-colors flex flex-col items-center gap-1 text-center"
                >
                  <Users className="w-4 h-4 text-red-600" />
                  <span>Sĩ Số HS</span>
                </Link>
                <Link
                  href="/teacher/classes/assignments"
                  className="p-3 rounded-xl bg-zinc-50 hover:bg-red-50 text-zinc-700 hover:text-red-700 text-xs font-bold border border-zinc-200 transition-colors flex flex-col items-center gap-1 text-center"
                >
                  <FileText className="w-4 h-4 text-red-600" />
                  <span>Bài Tập ({cls.studentsCount > 0 ? "3" : "0"})</span>
                </Link>
                <Link
                  href="/teacher/classes/lectures"
                  className="p-3 rounded-xl bg-zinc-50 hover:bg-red-50 text-zinc-700 hover:text-red-700 text-xs font-bold border border-zinc-200 transition-colors flex flex-col items-center gap-1 text-center"
                >
                  <Video className="w-4 h-4 text-red-600" />
                  <span>Bài Giảng</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Tạo Lớp Mới */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border-2 border-red-600 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-red-100 text-red-600 font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-zinc-900">Tạo Lớp Học Mới</h3>
                  <p className="text-xs text-zinc-500">Thiết lập phòng học và thông tin lớp</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-900"
              >
                
              </button>
            </div>

            {createSuccess ? (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                Lớp học mới đã được khởi tạo thành công!
              </div>
            ) : (
              <form onSubmit={handleCreateClass} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Tên Lớp Học
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 10A1 - Chuyên Tin & AI 2026"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      Môn Học
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="VD: Tin Học..."
                      value={newClassSubject}
                      onChange={(e) => setNewClassSubject(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      Khối Lớp
                    </label>
                    <select
                      value={newClassGrade}
                      onChange={(e) => setNewClassGrade(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-red-600"
                    >
                      <option value="Khối 10">Khối 10</option>
                      <option value="Khối 11">Khối 11</option>
                      <option value="Khối 12">Khối 12</option>
                      <option value="Đại Học">Đại Học</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-100 text-zinc-700 hover:text-zinc-900 text-xs font-bold cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
                  >
                    Tạo Lớp Ngay
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
