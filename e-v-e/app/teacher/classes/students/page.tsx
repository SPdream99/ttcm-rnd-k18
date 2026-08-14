"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTeacherAdapter } from "@/hooks/useTeacherAdapter";
import {
  Users,
  Search,
  MessageSquare,
  ArrowLeft,
  GraduationCap,
  Sparkles,
  TrendingUp,
  Award,
  CheckCircle2,
  Send,
  X,
  Filter,
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
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
        <p className="text-emerald-400 font-medium text-sm">Đang tải sổ theo dõi sĩ số học sinh...</p>
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
      {/* ── Header ── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1.5">
            <Link
              href="/teacher/classes"
              className="hover:underline flex items-center gap-1 text-[#8e9bb4] hover:text-emerald-300"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Quản Lý Lớp Học
            </Link>
            <span>/</span>
            <span>Sĩ Số & Sổ Điểm Học Sinh</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Quản Lý Sĩ Số Lớp 👨‍🎓
          </h1>
          <p className="text-xs md:text-sm text-[#8e9bb4] mt-1">
            Sổ điểm điện tử, tỷ lệ chuyên cần, phân tích học lực và nhắn tin hỗ trợ cá nhân hóa.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e9bb4]" />
            <input
              type="text"
              placeholder="Tìm theo tên, mã học sinh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#151b2c] border border-emerald-500/30 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-[#8e9bb4] focus:outline-none focus:border-emerald-400"
            />
          </div>

          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="bg-[#151b2c] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
          >
            <option value="all">Tất Cả Lớp</option>
            {availableClasses.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </header>

      {/* ── Roster Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredStudents.map((st) => (
          <div
            key={st.id}
            className="p-5 rounded-2xl bg-[#0f1524]/75 backdrop-blur-xl border border-[#7bd1fa]/15 hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {st.status}
                </span>
                <span className="text-[11px] font-mono text-cyan-400 font-semibold">{st.code}</span>
              </div>

              <div>
                <h3 className="font-bold text-base text-white">{st.name}</h3>
                <p className="text-xs text-[#8e9bb4] mt-0.5">{st.className}</p>

                <div className="grid grid-cols-2 gap-2 pt-2.5 mt-2 border-t border-[#7bd1fa]/10 text-xs">
                  <div className="p-2 rounded-lg bg-[#151b2c]/80 border border-[#7bd1fa]/10">
                    <span className="text-[#8e9bb4] block text-[10px] uppercase">GPA</span>
                    <strong className="text-cyan-300 text-sm font-mono">{st.gpa}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-[#151b2c]/80 border border-[#7bd1fa]/10">
                    <span className="text-[#8e9bb4] block text-[10px] uppercase">Chuyên Cần</span>
                    <strong className="text-emerald-400 text-sm font-mono">{st.attendance}</strong>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedStudent(st)}
              className="w-full py-2 rounded-xl bg-[#151b2c] hover:bg-emerald-600/20 text-emerald-300 text-xs font-semibold border border-emerald-500/25 transition-all flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> Nhắn Tin Trực Tiếp
            </button>
          </div>
        ))}
      </div>

      {/* ── Modal Gửi Tin Nhắn ── */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0f1524] border border-emerald-500/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(16,185,129,0.25)] space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#7bd1fa]/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-300 text-sm">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{selectedStudent.name}</h3>
                  <p className="text-[11px] text-[#8e9bb4]">{selectedStudent.code} • {selectedStudent.className}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-[#8e9bb4] hover:text-white"
              >
                ✕
              </button>
            </div>

            {messageSent ? (
              <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Lời nhắc và thông báo đã được gửi tới học sinh thành công!
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-3">
                <p className="text-xs text-[#8e9bb4]">
                  Nhập nhận xét, nhắc nhở nộp bài hoặc hỗ trợ học tập cá nhân hóa:
                </p>
                <textarea
                  rows={3}
                  required
                  placeholder={`Gửi lời nhắn tới em ${selectedStudent.name}...`}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full bg-[#151b2c] border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#8e9bb4] focus:outline-none focus:border-emerald-400"
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedStudent(null)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#151b2c] text-[#8e9bb4] hover:text-white text-xs font-semibold"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)] flex items-center gap-1.5"
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
