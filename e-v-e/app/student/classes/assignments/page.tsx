"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStudentAdapter } from "@/hooks/useStudentAdapter";
import {
  FileText,
  Clock,
  Upload,
  Check,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Filter,
  FileCheck,
  Sparkles,
  Award,
  UploadCloud,
  File,
  X,
} from "lucide-react";

export default function StudentClassAssignmentPage() {
  const [filter, setFilter] = useState<"all" | "pending" | "submitted">("pending");
  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [submissionNote, setSubmissionNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { assignments, loading } = useStudentAdapter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSubmissionFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionFile) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setSelectedAssignment(null);
        setSubmissionFile(null);
        setSubmissionNote("");
      }, 1500);
    }, 1200);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 font-sans">
        <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
        <p className="text-cyan-400 font-medium text-sm">Đang tải nhiệm vụ bài tập...</p>
      </div>
    );
  }

  const filteredAssignments = assignments.filter((a) =>
    filter === "all" ? true : a.status === filter
  );

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
            <span>Nhiệm Vụ & Bài Tập</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Nhiệm Vụ & Bài Tập Lớp Học 📝
          </h1>
          <p className="text-xs md:text-sm text-[#8e9bb4] mt-1">
            Theo dõi hạn nộp bài, nộp bài trực tuyến và xem điểm đánh giá từ Thầy/Cô.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#151b2c] rounded-xl border border-[#7bd1fa]/15 self-start md:self-auto">
          {(["pending", "submitted", "all"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === tab
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_12px_rgba(59,130,246,0.4)]"
                  : "text-[#8e9bb4] hover:text-white"
              }`}
            >
              {tab === "pending"
                ? `Cần Nộp (${assignments.filter((a) => a.status === "pending").length})`
                : tab === "submitted"
                ? `Đã Nộp (${assignments.filter((a) => a.status !== "pending").length})`
                : `Tất Cả (${assignments.length})`}
            </button>
          ))}
        </div>
      </header>

      {/* ── Assignment List ── */}
      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#0f1524]/40 border border-[#7bd1fa]/10 space-y-3">
            <FileCheck className="w-10 h-10 text-cyan-400/50 mx-auto" />
            <p className="text-sm text-slate-300 font-semibold">Không có bài tập nào trong mục này</p>
            <p className="text-xs text-[#8e9bb4]">Bạn đã hoàn thành tất cả nhiệm vụ học tập được giao!</p>
          </div>
        ) : (
          filteredAssignments.map((item) => (
            <div
              key={item.id}
              className="p-5 md:p-6 rounded-2xl bg-[#0f1524]/70 backdrop-blur-xl border border-[#7bd1fa]/15 hover:border-cyan-500/30 transition-all space-y-4 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-500/10 text-cyan-300 border border-blue-500/20 text-xs font-bold">
                      {item.subject}
                    </span>
                    {item.score && (
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 text-xs font-semibold flex items-center gap-1">
                        <Award className="w-3 h-3" /> Điểm số: {item.score}
                      </span>
                    )}
                    <span className="text-xs text-[#8e9bb4]">• Mã bài: #{item.id}</span>
                  </div>

                  <h3 className="font-bold text-base md:text-lg text-white">{item.title}</h3>
                  <p className="text-xs text-[#8e9bb4]">
                    Yêu cầu nộp file báo cáo PDF / Word hoặc link code repository trước hạn chót.
                  </p>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-4 shrink-0 self-start md:self-auto pt-2 md:pt-0 border-t md:border-t-0 border-[#7bd1fa]/10 w-full md:w-auto justify-between">
                  <div className="text-left md:text-right text-xs space-y-0.5">
                    <div className="font-semibold text-cyan-300 flex items-center md:justify-end gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" /> Hạn nộp: {item.dueDate}
                    </div>
                    <div className="text-[11px] text-[#8e9bb4]">Hình thức: Tải lên tệp</div>
                  </div>

                  {item.status === "pending" ? (
                    <button
                      onClick={() => setSelectedAssignment(item)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-cyan-300 text-white font-bold text-xs shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center gap-2"
                    >
                      <Upload className="w-3.5 h-3.5" /> Nộp Bài Tập
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30 flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-400" /> Đã Nộp & Chấm Điểm
                      </span>
                      <button
                        onClick={() => setSelectedAssignment(item)}
                        className="px-3 py-2 rounded-xl bg-[#151b2c] hover:bg-[#1f273d] text-cyan-300 text-xs font-semibold border border-[#7bd1fa]/15 transition-all"
                      >
                        Xem Lại
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Modal Nộp Bài ── */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0f1524] border border-[#7bd1fa]/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.25)] space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#7bd1fa]/10 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Nộp Bài Trực Tuyến</h3>
                  <p className="text-xs text-[#8e9bb4]">{selectedAssignment.title}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="text-[#8e9bb4] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-semibold flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                Bài tập đã được tải lên và lưu vào hệ thống thành công!
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div className="p-3.5 rounded-xl bg-[#151b2c] border border-[#7bd1fa]/15 text-xs text-[#8e9bb4] space-y-1">
                  <div className="flex justify-between">
                    <span>Môn học: <strong className="text-white">{selectedAssignment.subject}</strong></span>
                    <span>Hạn nộp: <strong className="text-cyan-300">{selectedAssignment.dueDate}</strong></span>
                  </div>
                  {selectedAssignment.score && (
                    <div>Thang điểm: <strong className="text-emerald-300">{selectedAssignment.score}</strong></div>
                  )}
                </div>

                {/* Upload Zone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Tệp bài làm (Hỗ trợ PDF, DOCX, ZIP, MP4 - tối đa 50MB)
                  </label>
                  <label className="border-2 border-dashed border-[#7bd1fa]/30 hover:border-cyan-400 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-[#151b2c]/60 hover:bg-[#151b2c] transition-all text-center">
                    <UploadCloud className="w-8 h-8 text-cyan-400" />
                    {submissionFile ? (
                      <div className="flex items-center gap-2 text-xs text-white font-medium">
                        <File className="w-4 h-4 text-cyan-400" />
                        <span>{submissionFile.name} ({(submissionFile.size / 1024).toFixed(1)} KB)</span>
                      </div>
                    ) : (
                      <>
                        <span className="text-xs text-slate-300 font-semibold">
                          Kéo thả tệp vào đây hoặc nhấn để chọn tệp
                        </span>
                        <span className="text-[11px] text-[#8e9bb4]">Đảm bảo đúng định dạng bài tập quy định</span>
                      </>
                    )}
                    <input
                      type="file"
                      required
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Ghi chú đính kèm gửi giảng viên (Tùy chọn)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Nhập lời nhắn hoặc đường dẫn Git repo bổ sung nếu có..."
                    value={submissionNote}
                    onChange={(e) => setSubmissionNote(e.target.value)}
                    className="w-full bg-[#151b2c] border border-[#7bd1fa]/25 rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#8e9bb4] focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedAssignment(null)}
                    className="px-4 py-2 rounded-xl bg-[#151b2c] hover:bg-[#1f273d] text-[#8e9bb4] hover:text-white text-xs font-semibold transition-all"
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 text-white text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Đang tải lên...
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" /> Xác Nhận Nộp Bài
                      </>
                    )}
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
