"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTeacherAdapter } from "@/hooks/useTeacherAdapter";
import { useToast } from "@/components/Toast";
import {
  Plus,
  Eye,
  ArrowLeft,
  Clock,
  Video,
  Presentation,
  CheckCircle2,
  Share2,
} from "lucide-react";

export default function TeacherLectureManagementPage() {
  const toast = useToast();
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
        <div className="w-12 h-12 rounded-full border-4 border-red-200 border-t-red-600 animate-spin" />
        <p className="text-red-600 font-bold text-sm">Đang tải kho bài giảng & tài liệu...</p>
      </div>
    );
  }

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
            <span>Kho Bài Giảng & Tài Liệu</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
            Kho Bài Giảng & Tài Liệu 
          </h1>
          <p className="text-xs md:text-sm text-zinc-500 mt-1">
            Đăng tải video bài giảng, tài liệu slide và liên kết học tập cho học sinh.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs md:text-sm transition-colors flex items-center gap-2 self-start md:self-auto cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" /> Đăng Bài Giảng Mới
        </button>
      </header>

      {/* Lectures Grid */}
      <div className="space-y-4">
        {lectures.map((lec) => (
          <div
            key={lec.id}
            className="p-5 md:p-6 rounded-2xl bg-white border border-zinc-200 hover:border-red-600 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-md bg-red-50 text-red-700 font-bold border border-red-200">
                  Lớp: {lec.className}
                </span>
                <span className="text-zinc-400">Ngày phát hành: {lec.date}</span>
              </div>

              <h3 className="font-bold text-base md:text-lg text-zinc-900">{lec.title}</h3>

              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1 font-medium text-zinc-700">
                  <Clock className="w-3.5 h-3.5 text-red-600" /> Thời lượng: <strong className="text-zinc-900">{lec.duration}</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Presentation className="w-3.5 h-3.5 text-red-600" /> Slide: <strong className="text-zinc-900">{lec.slidesCount} trang</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-start md:self-auto pt-2 md:pt-0 border-t md:border-t-0 border-zinc-100 w-full md:w-auto justify-end">
              <button
                onClick={() => setPreviewLecture(lec)}
                className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold transition-colors flex items-center gap-1.5 border border-zinc-200 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-red-600" /> Xem Trước Bài Giảng
              </button>
              <button
                onClick={() => toast.success(`Đã sao chép liên kết chia sẻ bài giảng "${lec.title}"!`, "Chia Sẻ Bài Giảng")}
                className="p-2 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
                title="Chia sẻ liên kết"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Đăng Bài Giảng Mới */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border-2 border-red-600 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-red-100 text-red-600 font-bold">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-zinc-900">Đăng Tải Bài Giảng Mới</h3>
                  <p className="text-xs text-zinc-500">Tải lên slide thuyết trình và tài liệu bài học</p>
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
                Bài giảng mới đã được xuất bản và sẵn sàng cho học sinh truy cập!
              </div>
            ) : (
              <form onSubmit={handleCreateLecture} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Tên Bài Giảng
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Cấu trúc điều khiển IF-ELSE và Vòng lặp For"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      Lớp Áp Dụng
                    </label>
                    <select
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-red-600"
                    >
                      <option value="10A1 - Vật Lý">10A1 - Vật Lý</option>
                      <option value="11B2 - Chuyên Tin">11B2 - Chuyên Tin</option>
                      <option value="12A3 - Robotics">12A3 - Robotics</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      Thời Lượng Dự Kiến
                    </label>
                    <input
                      type="text"
                      value={newDuration}
                      onChange={(e) => setNewDuration(e.target.value)}
                      placeholder="VD: 45 phút"
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-100 text-zinc-700 hover:text-zinc-900 text-xs font-bold"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    Xuất Bản Bài Giảng
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal Xem Trước Bài Giảng */}
      {previewLecture && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white border-2 border-red-600 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-red-600" />
                <div>
                  <h3 className="font-bold text-sm text-zinc-900">Xem Trước Bài Giảng</h3>
                  <p className="text-xs text-zinc-500">{previewLecture.title}</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewLecture(null)}
                className="text-zinc-400 hover:text-zinc-900"
              >
                
              </button>
            </div>

            <div className="p-8 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col items-center justify-center text-center space-y-3">
              <Presentation className="w-12 h-12 text-red-600" />
              <p className="text-sm text-zinc-900 font-bold">{previewLecture.title}</p>
              <p className="text-xs text-zinc-500">
                Tài liệu bài giảng bao gồm {previewLecture.slidesCount} slide trình chiếu.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPreviewLecture(null)}
                className="px-4 py-2 rounded-xl bg-zinc-100 text-zinc-700 hover:text-zinc-900 text-xs font-bold"
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
