"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTeacherAdapter } from "@/hooks/useTeacherAdapter";
import {
  FileCheck,
  Plus,
  Sparkles,
  Edit,
  ArrowLeft,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  Eye,
  Trash2,
  X,
} from "lucide-react";

export default function TeacherAssignmentManagementPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newClassName, setNewClassName] = useState("10A1 - Vật Lý");
  const [newDueDate, setNewDueDate] = useState("2026-08-25");
  const [createSuccess, setCreateSuccess] = useState(false);
  const [gradingModalItem, setGradingModalItem] = useState<any | null>(null);

  const { assignments, loading } = useTeacherAdapter();

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreateSuccess(true);
    setTimeout(() => {
      setCreateSuccess(false);
      setIsCreateModalOpen(false);
      setNewTitle("");
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 font-sans">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
        <p className="text-emerald-400 font-medium text-sm">Đang tải ngân hàng bài tập giáo viên...</p>
      </div>
    );
  }

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
            <span>Ngân Hàng Bài Tập</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Ngân Hàng Bài Tập & Đề Thi 📋
          </h1>
          <p className="text-xs md:text-sm text-[#8e9bb4] mt-1">
            Tạo bài tập mới, tự động chấm bằng AI và theo dõi tỷ lệ nộp bài của từng lớp.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs md:text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Tạo Bài Tập Mới
        </button>
      </header>

      {/* ── Assignments List ── */}
      <div className="space-y-4">
        {assignments.map((item) => {
          const submissionPercent = Math.round((item.submittedCount / (item.totalCount || 1)) * 100);
          return (
            <div
              key={item.id}
              className="p-5 md:p-6 rounded-2xl bg-[#0f1524]/75 backdrop-blur-xl border border-[#7bd1fa]/15 hover:border-emerald-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
            >
              <div className="space-y-2 max-w-xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                    Lớp: {item.className}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-cyan-400" /> Trạng thái: {item.status}
                  </span>
                </div>

                <h3 className="font-bold text-base md:text-lg text-white">{item.title}</h3>
                
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#8e9bb4]">
                  <span className="flex items-center gap-1 font-medium text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" /> Hạn nộp: {item.dueDate}
                  </span>
                  <span>•</span>
                  <span>
                    Đã nộp: <strong className="text-cyan-300">{item.submittedCount}</strong> / {item.totalCount} học sinh ({submissionPercent}%)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full max-w-xs h-2 rounded-full bg-[#0a0e1a] overflow-hidden border border-[#7bd1fa]/10">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full"
                    style={{ width: `${submissionPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto pt-3 md:pt-0 border-t md:border-t-0 border-[#7bd1fa]/10 w-full md:w-auto justify-end">
                <button
                  onClick={() => setGradingModalItem(item)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all flex items-center gap-1.5"
                >
                  <FileCheck className="w-3.5 h-3.5" /> Duyệt & Chấm Bài
                </button>
                <button
                  onClick={() => alert(`Chỉnh sửa bài tập: ${item.title}`)}
                  className="p-2 rounded-xl bg-[#151b2c] border border-[#7bd1fa]/20 text-[#8e9bb4] hover:text-white hover:border-emerald-400 transition-all"
                  title="Chỉnh sửa bài tập"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Modal Tạo Bài Tập Mới ── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0f1524] border border-emerald-500/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(16,185,129,0.25)] space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#7bd1fa]/10 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Giao Nhiệm Vụ Bài Tập Mới</h3>
                  <p className="text-xs text-[#8e9bb4]">Tạo bài tập tự luận, trắc nghiệm hoặc báo cáo</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-[#8e9bb4] hover:text-white"
              >
                ✕
              </button>
            </div>

            {createSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Bài tập mới đã được xuất bản và gửi thông báo tới học sinh!
              </div>
            ) : (
              <form onSubmit={handleCreateAssignment} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Tiêu Đề Bài Tập / Đề Thi
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Báo cáo thí nghiệm Giao thoa Ánh sáng Laser"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-[#151b2c] border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#8e9bb4] focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Áp Dụng Cho Lớp
                    </label>
                    <select
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                      className="w-full bg-[#151b2c] border border-emerald-500/30 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                    >
                      <option value="10A1 - Vật Lý">10A1 - Vật Lý</option>
                      <option value="11B2 - Chuyên Tin">11B2 - Chuyên Tin</option>
                      <option value="12A3 - Robotics">12A3 - Robotics</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Hạn Chót Nộp Bài
                    </label>
                    <input
                      type="date"
                      required
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      className="w-full bg-[#151b2c] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#151b2c] text-[#8e9bb4] hover:text-white text-xs font-semibold"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
                  >
                    Giao Bài Ngay
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── Modal Duyệt Chấm Điểm ── */}
      {gradingModalItem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0f1524] border border-emerald-500/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(16,185,129,0.25)] space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#7bd1fa]/10 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-sm text-white">Sổ Chấm Bài Điện Tử</h3>
                  <p className="text-[11px] text-[#8e9bb4]">{gradingModalItem.title}</p>
                </div>
              </div>
              <button
                onClick={() => setGradingModalItem(null)}
                className="text-[#8e9bb4] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[#151b2c] border border-[#7bd1fa]/15 flex justify-between">
                <span>Số bài đã nộp: <strong className="text-emerald-400">{gradingModalItem.submittedCount} bài</strong></span>
                <span>Chưa chấm: <strong className="text-amber-400">{Math.max(0, gradingModalItem.submittedCount - 2)} bài</strong></span>
              </div>
              <p className="text-[#8e9bb4]">
                Hệ thống AI Tutor E-V-E hỗ trợ tự động đối chiếu barem điểm và đề xuất nhận xét chi tiết cho từng học sinh.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setGradingModalItem(null)}
                className="px-4 py-2 rounded-xl bg-[#151b2c] text-[#8e9bb4] hover:text-white text-xs font-semibold"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  alert("Đã kích hoạt chế độ AI Tự động chấm theo barem!");
                  setGradingModalItem(null);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)] flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> Kích Hoạt AI Chấm Barem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
