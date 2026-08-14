"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStudentAdapter } from "@/hooks/useStudentAdapter";
import {
  Users,
  MessageSquare,
  Shield,
  ArrowLeft,
  Search,
  CheckCircle2,
  Mail,
  GraduationCap,
  Sparkles,
  Send,
  X,
} from "lucide-react";

export default function StudentClassMemberPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "Teacher" | "Student">("all");
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatSent, setChatSent] = useState(false);

  const { members, loading } = useStudentAdapter();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatSent(true);
    setTimeout(() => {
      setChatSent(false);
      setSelectedMember(null);
      setChatMessage("");
    }, 1200);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 font-sans">
        <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
        <p className="text-cyan-400 font-medium text-sm">Đang tải danh sách thành viên lớp học...</p>
      </div>
    );
  }

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" ? true : m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* ── Header ── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1.5">
            <Link
              href="/student/classes"
              className="hover:underline flex items-center gap-1 text-[#8e9bb4] hover:text-cyan-300"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Lớp Học Của Tôi
            </Link>
            <span>/</span>
            <span>Thành Viên Lớp</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Danh Sách Thành Viên Lớp Học 👥
          </h1>
          <p className="text-xs md:text-sm text-[#8e9bb4] mt-1">
            Gặp gỡ Giảng viên phụ trách, Ban cán sự và các bạn học trong không gian E-V-E.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e9bb4]" />
            <input
              type="text"
              placeholder="Tìm theo tên, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#151b2c] border border-[#7bd1fa]/20 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-[#8e9bb4] focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#151b2c] rounded-xl border border-[#7bd1fa]/15">
            {(["all", "Teacher", "Student"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  roleFilter === r
                    ? "bg-cyan-500 text-[#0a0e1a] font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                    : "text-[#8e9bb4] hover:text-white"
                }`}
              >
                {r === "all" ? "Tất Cả" : r === "Teacher" ? "Giáo Viên" : "Học Sinh"}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Members Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((m) => {
          const isTeacher = m.role === "Teacher";
          return (
            <div
              key={m.id}
              className={`p-4 md:p-5 rounded-2xl border flex items-center justify-between gap-3 backdrop-blur-xl transition-all ${
                isTeacher
                  ? "bg-gradient-to-r from-blue-900/30 via-[#0f1524] to-cyan-950/20 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                  : "bg-[#0f1524]/60 border-[#7bd1fa]/15 hover:border-cyan-500/30"
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="relative shrink-0">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-md ${
                      isTeacher
                        ? "bg-gradient-to-tr from-cyan-400 to-blue-600 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                        : "bg-gradient-to-tr from-purple-500 to-indigo-600"
                    }`}
                  >
                    {m.name.charAt(0)}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0a0e1a]" />
                </div>

                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-white flex items-center gap-1.5 truncate">
                    {m.name}
                    {isTeacher && (
                      <span className="px-1.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30 flex items-center gap-0.5">
                        <Shield className="w-3 h-3 text-cyan-400" /> GV
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-[#8e9bb4] truncate flex items-center gap-1 mt-0.5">
                    <Mail className="w-3 h-3 text-slate-500" /> {m.email}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedMember(m)}
                title="Gửi tin nhắn nhanh"
                className="p-2.5 rounded-xl bg-[#151b2c] border border-[#7bd1fa]/20 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all shrink-0"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Message Popup Modal ── */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0f1524] border border-[#7bd1fa]/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.25)] space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#7bd1fa]/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-300 text-sm">
                  {selectedMember.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{selectedMember.name}</h3>
                  <p className="text-[11px] text-cyan-300">{selectedMember.role} • Trực tuyến</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="text-[#8e9bb4] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {chatSent ? (
              <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Tin nhắn đã được gửi thành công!
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-3">
                <p className="text-xs text-[#8e9bb4]">
                  Gửi tin nhắn trao đổi bài học hoặc thắc mắc trực tiếp:
                </p>
                <textarea
                  rows={3}
                  required
                  placeholder={`Gửi lời nhắn tới ${selectedMember.name}...`}
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="w-full bg-[#151b2c] border border-[#7bd1fa]/25 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#8e9bb4] focus:outline-none focus:border-cyan-400"
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedMember(null)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#151b2c] text-[#8e9bb4] hover:text-white text-xs font-semibold"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)] flex items-center gap-1.5"
                  >
                    <Send className="w-3 h-3" /> Gửi Tin Nhắn
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
