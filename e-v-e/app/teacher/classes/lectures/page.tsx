"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTeacherAdapter } from "@/hooks/useTeacherAdapter";
import {
  BookOpen,
  Plus,
  Eye,
  ArrowLeft,
  Clock,
  FileText,
  Video,
  Presentation,
  CheckCircle2,
  Share2,
  Trash2,
  X,
} from "lucide-react";

export default function TeacherLectureManagementPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newClassName, setNewClassName] = useState("10A1 - Vật Lý");
  const [newDuration, setNewDuration] = useState("45 phút");
  const [previewLecture, setPreviewLecture] = useState<any | null>(null);
  const [createSuccess, setCreateSuccess] = useState(false);

  const { lectures, loading } = useTeacherAdapter();

  const handleCreateLecture = (e: React.FormEvent) => {
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
        <p className="text-emerald-400 font-medium text-sm">Đang tải kho bài giảng & tài liệu...</p>
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
            <span>Kho Bài Giảng & Tài Liệu</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Kho Bài Giảng & Tài Liệu 📖
          </h1>
          <p className="text-xs md:text-sm text-[#8e9bb4] mt-1">
            Đăng tải video bài giảng, tài liệu slide thuyết trình và liên kết quiz tương tác cho học sinh.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs md:text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Đăng Bài Giảng Mới
        </button>
      </header>

      {/* ── Lectures Grid ── */}
      <div className="space-y-4">
        {lectures.map((lec) => (
          <div
            key={lec.id}
            className="p-5 md:p-6 rounded-2xl bg-[#0f1524]/75 backdrop-blur-xl border border-[#7bd1fa]/15 hover:border-emerald-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  Lớp: {lec.className}
                </span>
                <span className="text-[#8e9bb4]">Ngày phát hành: {lec.date}</span>
              </div>

              <h3 className="font-bold text-base md:text-lg text-white">{lec.title}</h3>

              <div className="flex items-center gap-4 text-xs text-[#8e9bb4]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" /> Thời lượng: <strong className="text-slate-200">{lec.duration}</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Presentation className="w-3.5 h-3.5 text-cyan-400" /> Slide: <strong className="text-slate-200">{lec.slidesCount} trang</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-start md:self-auto pt-2 md:pt-0 border-t md:border-t-0 border-[#7bd1fa]/10 w-full md:w-auto justify-end">
              <button
                onClick={() => setPreviewLecture(lec)}
                className="px-4 py-2 rounded-xl bg-[#151b2c] hover:bg-[#1f273d] text-cyan-300 text-xs font-semibold border border-[#7bd1fa]/20 transition-all flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-emerald-400" /> Xem Trước Bài Giảng
              </button>
              <button
                onClick={() => alert(`Đã sao chép liên kết chia sẻ bài giảng ${lec.title}`)}
                className="p-2 rounded-xl bg-[#151b2c] border border-[#7bd1fa]/20 text-[#8e9bb4] hover:text-white transition-all"
                title="Chia sẻ liên kết"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Modal Đăng Bài Giảng Mới ── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0f1524] border border-emerald-500/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(16,185,129,0.25)] space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#7bd1fa]/10 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Đăng Tải Bài Giảng Mới</h3>
                  <p className="text-xs text-[#8e9bb4]">Tải lên slide thuyết trình và video hướng dẫn</p>
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
                Bài giảng mới đã được xuất bản và sẵn sàng cho học sinh truy cập!
              </div>
            ) : (
              <form onSubmit={handleCreateLecture} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Tên Bài Giảng
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Chương 5: Phương trình sóng Schrödinger và Ứng dụng"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-[#151b2c] border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#8e9bb4] focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Lớp Áp Dụng
                    </label>
                    <select
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                      className="w-full bg-[#151b2c] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                    >
                      <option value="10A1 - Vật Lý">10A1 - Vật Lý</option>
                      <option value="11B2 - Chuyên Tin">11B2 - Chuyên Tin</option>
                      <option value="12A3 - Robotics">12A3 - Robotics</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Thời Lượng Dự Kiến
                    </label>
                    <input
                      type="text"
                      value={newDuration}
                      onChange={(e) => setNewDuration(e.target.value)}
                      placeholder="VD: 45 phút"
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
                    Xuất Bản Bài Giảng
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── Modal Xem Trước Bài Giảng ── */}
      {previewLecture && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0f1524] border border-emerald-500/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(16,185,129,0.25)] space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#7bd1fa]/10 pb-3">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-sm text-white">Xem Trước Bài Giảng</h3>
                  <p className="text-[11px] text-[#8e9bb4]">{previewLecture.title}</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewLecture(null)}
                className="text-[#8e9bb4] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-8 rounded-xl bg-[#0a0e1a] border border-[#7bd1fa]/15 flex flex-col items-center justify-center text-center space-y-3">
              <Presentation className="w-12 h-12 text-emerald-400/60 animate-pulse" />
              <p className="text-sm text-white font-bold">{previewLecture.title}</p>
              <p className="text-xs text-[#8e9bb4]">
                Tài liệu bài giảng bao gồm {previewLecture.slidesCount} slide trình chiếu và video 4K đã được mã hóa tối ưu.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPreviewLecture(null)}
                className="px-4 py-2 rounded-xl bg-[#151b2c] text-[#8e9bb4] hover:text-white text-xs font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
