"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTeacherAdapter } from "@/hooks/useTeacherAdapter";
import { useToast } from "@/components/Toast";
import {
  FileCheck,
  Plus,
  Sparkles,
  Edit,
  ArrowLeft,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function TeacherAssignmentManagementPage() {
  const toast = useToast();
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
        <div className="w-12 h-12 rounded-full border-4 border-red-200 border-t-red-600 animate-spin" />
        <p className="text-red-600 font-bold text-sm">Đang tải ngân hàng bài tập giáo viên...</p>
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
            <span>Ngân Hàng Bài Tập</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
            Ngân Hàng Bài Tập & Đề Thi 
          </h1>
          <p className="text-xs md:text-sm text-zinc-500 mt-1">
            Tạo bài tập mới, tự động chấm và theo dõi tỷ lệ nộp bài của từng lớp.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs md:text-sm transition-colors flex items-center gap-2 self-start md:self-auto cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" /> Tạo Bài Tập Mới
        </button>
      </header>

      {/* Assignments List */}
      <div className="space-y-4">
        {assignments.map((item) => {
          const submissionPercent = Math.round((item.submittedCount / (item.totalCount || 1)) * 100);
          return (
            <div
              key={item.id}
              className="p-5 md:p-6 rounded-2xl bg-white border border-zinc-200 hover:border-red-600 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm"
            >
              <div className="space-y-2 max-w-xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200 text-xs font-bold">
                    Lớp: {item.className}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200 text-xs font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-red-600" /> Trạng thái: {item.status}
                  </span>
                </div>

                <h3 className="font-bold text-base md:text-lg text-zinc-900">{item.title}</h3>
                
                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                  <span className="flex items-center gap-1 font-medium text-zinc-700">
                    <Clock className="w-3.5 h-3.5 text-red-600" /> Hạn nộp: {item.dueDate}
                  </span>
                  <span>•</span>
                  <span>
                    Đã nộp: <strong className="text-red-600">{item.submittedCount}</strong> / {item.totalCount} học sinh ({submissionPercent}%)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full max-w-xs h-2 rounded-full bg-zinc-100 overflow-hidden border border-zinc-200">
                  <div
                    className="h-full bg-red-600 rounded-full"
                    style={{ width: `${submissionPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto pt-3 md:pt-0 border-t md:border-t-0 border-zinc-100 w-full md:w-auto justify-end">
                <button
                  onClick={() => setGradingModalItem(item)}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <FileCheck className="w-3.5 h-3.5" /> Duyệt & Chấm Bài
                </button>
                <button
                  onClick={() => toast.info(`Mở giao diện chỉnh sửa bài tập: "${item.title}"`, "Chỉnh Sửa Bài Tập")}
                  className="p-2 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-red-300 transition-colors cursor-pointer"
                  title="Chỉnh sửa bài tập"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Tạo Bài Tập Mới */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border-2 border-red-600 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-red-100 text-red-600 font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-zinc-900">Giao Nhiệm Vụ Bài Tập Mới</h3>
                  <p className="text-xs text-zinc-500">Tạo bài tập tự luận hoặc trắc nghiệm</p>
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
                Bài tập mới đã được xuất bản và gửi thông báo tới học sinh!
              </div>
            ) : (
              <form onSubmit={handleCreateAssignment} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Tiêu Đề Bài Tập / Đề Thi
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Bài tập thực hành Lập trình căn bản"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      Áp Dụng Cho Lớp
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
                      Hạn Chót Nộp Bài
                    </label>
                    <input
                      type="date"
                      required
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
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
                    Giao Bài Ngay
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal Duyệt Chấm Điểm */}
      {gradingModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border-2 border-red-600 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-red-600" />
                <div>
                  <h3 className="font-bold text-sm text-zinc-900">Sổ Chấm Bài Điện Tử</h3>
                  <p className="text-xs text-zinc-500">{gradingModalItem.title}</p>
                </div>
              </div>
              <button
                onClick={() => setGradingModalItem(null)}
                className="text-zinc-400 hover:text-zinc-900"
              >
                
              </button>
            </div>

            <div className="space-y-2 text-xs text-zinc-600">
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex justify-between">
                <span>Số bài đã nộp: <strong className="text-red-600">{gradingModalItem.submittedCount} bài</strong></span>
                <span>Chưa chấm: <strong className="text-zinc-800">{Math.max(0, gradingModalItem.submittedCount - 2)} bài</strong></span>
              </div>
              <p>
                Hệ thống hỗ trợ tự động đối chiếu barem điểm và đề xuất nhận xét chi tiết cho từng học sinh.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setGradingModalItem(null)}
                className="px-4 py-2 rounded-xl bg-zinc-100 text-zinc-700 hover:text-zinc-900 text-xs font-bold"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  toast.success("Đã kích hoạt chế độ tự động chấm theo barem!", "Chấm Điểm Tự Động");
                  setGradingModalItem(null);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" /> Chấm Theo Barem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
