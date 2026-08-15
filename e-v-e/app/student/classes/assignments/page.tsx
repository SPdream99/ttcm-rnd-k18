"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStudentAdapter } from "@/hooks/useStudentAdapter";
import { FileText, Clock, Upload, Check, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function StudentClassAssignmentPage() {
  const [filter, setFilter] = useState<"all" | "pending" | "submitted">("pending");
  const { assignments, loading } = useStudentAdapter();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 font-sans">
        <div className="w-10 h-10 rounded-full border-4 border-zinc-200 border-t-red-600 animate-spin" />
        <p className="text-red-600 font-medium text-sm">Đang tải nhiệm vụ bài tập...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* ── Header ── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <Link
            href="/student/classes"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-red-600 mb-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Quay lại danh sách lớp
          </Link>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 mb-1">
            <FileText className="w-4 h-4" /> Quản Lý Bài Tập & Đánh Giá
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">
            Nhiệm Vụ & Bài Tập Lớp Học 
          </h1>
          <p className="text-xs md:text-sm text-zinc-600 mt-1">
            Theo dõi hạn nộp bài tập và xem điểm nhận xét từ giảng viên.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-xl border border-zinc-200 self-start md:self-auto">
          {(["pending", "submitted", "all"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === tab
                  ? "bg-red-600 text-white shadow-sm"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              {tab === "pending" ? "Cần nộp" : tab === "submitted" ? "Đã nộp" : "Tất cả"}
            </button>
          ))}
        </div>
      </header>

      {/* Assignment Items List */}
      <div className="space-y-4">
        {assignments
          .filter((a) => (filter === "all" ? true : a.status === filter))
          .map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm hover:border-red-600 transition-all space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200 text-xs font-bold">
                      {item.subject}
                    </span>
                    {item.score && (
                      <span className="text-xs text-zinc-500 font-semibold">• Thang điểm: {item.score}</span>
                    )}
                  </div>
                  <h3 className="font-extrabold text-base text-zinc-900">{item.title}</h3>
                </div>

                <div className="flex items-center gap-4 shrink-0 self-start md:self-auto">
                  <div className="text-right text-xs">
                    <div className="font-semibold text-zinc-600 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-red-600" /> Hạn nộp: {item.dueDate}
                    </div>
                  </div>

                  {item.status === "pending" ? (
                    <button className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" /> Nộp Bài File
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Đã hoàn thành
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
