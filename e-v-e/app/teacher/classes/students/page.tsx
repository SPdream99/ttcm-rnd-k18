"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTeacherAdapter } from "@/hooks/useTeacherAdapter";
import {
  Search,
  MessageSquare,
  ArrowLeft,
  CheckCircle2,
  Send,
} from "lucide-react";

export default function TeacherStudentManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [messageText, setMessageText] = useState("");
  const [messageSent, setMessageSent] = useState(false);

  const { students, loading } = useTeacherAdapter();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setSelectedStudent(null);
      setMessageText("");
    }, 1200);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 font-sans">
        <div className="w-12 h-12 rounded-full border-4 border-red-200 border-t-red-600 animate-spin" />
        <p className="text-red-600 font-bold text-sm">Đang tải sổ theo dõi sĩ số học sinh...</p>
      </div>
    );
  }

  const filteredStudents = students.filter((st) => {
    const matchesSearch =
      st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.className.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === "all" || st.className.toLowerCase().includes(classFilter.toLowerCase());
    return matchesSearch && matchesClass;
  });

  const availableClasses = Array.from(new Set(students.map((s) => s.className)));

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b-2 border-zinc-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 mb-1.5">
            <Link
              href="/teacher/classes"
              className="hover:underline flex items-center gap-1 text-zinc-500 hover:text-red-600"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Quản Lý Lớp Học
            </Link>
            <span>/</span>
            <span>Sĩ Số & Sổ Điểm Học Sinh</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
            Quản Lý Sĩ Số Lớp 
          </h1>
          <p className="text-xs md:text-sm text-zinc-500 mt-1">
            Sổ điểm điện tử, tỷ lệ chuyên cần và nhắn tin hỗ trợ học sinh.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Tìm theo tên, mã học sinh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-zinc-300 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-red-600"
            />
          </div>

          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-red-600"
          >
            <option value="all">Tất Cả Lớp</option>
            {availableClasses.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </header>

      {/* Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredStudents.map((st, idx) => (
          <div
            key={`${st.id}_${idx}`}
            className="p-5 rounded-2xl bg-white border border-zinc-200 hover:border-red-600 transition-colors shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
                  {st.status}
                </span>
                <span className="text-[11px] font-mono text-zinc-500 font-bold">{st.code}</span>
              </div>

              <div>
                <h3 className="font-bold text-base text-zinc-900">{st.name}</h3>
                <p className="text-xs text-zinc-500 mt-0.5">{st.className}</p>

                <div className="grid grid-cols-2 gap-2 pt-2.5 mt-2 border-t border-zinc-100 text-xs">
                  <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-200">
                    <span className="text-zinc-500 block text-[10px] uppercase font-bold">GPA</span>
                    <strong className="text-zinc-900 text-sm font-mono">{st.gpa}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-200">
                    <span className="text-zinc-500 block text-[10px] uppercase font-bold">Chuyên Cần</span>
                    <strong className="text-red-600 text-sm font-mono">{st.attendance}</strong>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedStudent(st)}
              className="w-full py-2 rounded-xl bg-zinc-100 hover:bg-red-50 text-zinc-700 hover:text-red-700 text-xs font-bold border border-zinc-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-red-600" /> Nhắn Tin Trực Tiếp
            </button>
          </div>
        ))}
      </div>

      {/* Modal Gửi Tin Nhắn */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border-2 border-red-600 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-zinc-900">{selectedStudent.name}</h3>
                  <p className="text-[11px] text-zinc-500">{selectedStudent.code} • {selectedStudent.className}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-zinc-400 hover:text-zinc-900"
              >
                
              </button>
            </div>

            {messageSent ? (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                Lời nhắc và thông báo đã được gửi tới học sinh thành công!
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-3">
                <p className="text-xs text-zinc-500">
                  Nhập nhận xét, nhắc nhở nộp bài hoặc hỗ trợ học tập:
                </p>
                <textarea
                  rows={3}
                  required
                  placeholder={`Gửi lời nhắn tới em ${selectedStudent.name}...`}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-red-600"
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedStudent(null)}
                    className="px-3.5 py-1.5 rounded-xl bg-zinc-100 text-zinc-700 hover:text-zinc-900 text-xs font-bold"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-3 h-3" /> Gửi Lời Nhắn
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
