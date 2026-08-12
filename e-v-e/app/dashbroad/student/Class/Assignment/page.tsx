"use client";

import React, { useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  ChevronRight,
  Download,
  Check,
} from "lucide-react";

export default function StudentClassAssignmentPage() {
  const [filter, setFilter] = useState<"all" | "pending" | "submitted">("pending");

  const assignments = [
    {
      id: 1,
      title: "Bài tập 4: Giải thuật Vướng Víu Lượng Tử",
      course: "Vật Lý Lượng Tử Advanced",
      dueDate: "23:59 • Hôm nay",
      points: "10 Điểm",
      status: "pending",
      urgent: true,
      description: "Thực hiện tính toán ma trận mật độ và giải thích bất đẳng thức Bell cho hệ 2 qubit.",
    },
    {
      id: 2,
      title: "Báo cáo Thực hành: Xây dựng mô hình CNN với PyTorch",
      course: "Kiến Trúc Mạng Thần Kinh",
      dueDate: "23:59 • Ngày mai",
      points: "10 Điểm",
      status: "pending",
      urgent: false,
      description: "Nộp file Jupyter Notebook (.ipynb) kèm báo cáo nhận xét độ chính xác trên tập dữ liệu CIFAR-10.",
    },
    {
      id: 3,
      title: "Dự án Thiết kế UI/UX Design System E-V-E",
      course: "Thiết Kế UI/UX",
      dueDate: "Đã nộp 2 ngày trước",
      points: "9.5 / 10",
      status: "submitted",
      urgent: false,
      description: "Đã được giảng viên duyệt và nhận xét xuất sắc.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-[#e1e2ec] p-4 md:p-8 font-sans space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/10">
        <div>
          <div className="flex items-center gap-2 text-sm text-cyan-400 font-medium mb-1">
            <FileText className="w-4 h-4" /> Quản lý bài tập
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Nhiệm Vụ & Bài Tập Lớp Học 📝
          </h1>
          <p className="text-sm text-[#8e9bb4] mt-1">Theo dõi hạn nộp bài tập và xem điểm nhận xét từ giảng viên.</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#151b2c] rounded-xl border border-[#7bd1fa]/10 self-start md:self-auto">
          {(["pending", "submitted", "all"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === tab
                  ? "bg-blue-600 text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]"
                  : "text-[#8e9bb4] hover:text-white"
              }`}
            >
              {tab === "pending" ? "Cần nộp (2)" : tab === "submitted" ? "Đã nộp (1)" : "Tất cả"}
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
              className={`p-5 rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border transition-all space-y-4 ${
                item.urgent
                  ? "border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                  : "border-[#7bd1fa]/15 hover:border-cyan-500/30"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-500/10 text-cyan-300 border border-blue-500/20 text-xs font-medium">
                      {item.course}
                    </span>
                    <span className="text-xs text-[#8e9bb4]">• Thang điểm: {item.points}</span>
                  </div>
                  <h3 className="font-bold text-base text-white">{item.title}</h3>
                  <p className="text-xs text-[#8e9bb4]">{item.description}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
                  <div className="text-right text-xs">
                    <div className="font-semibold text-cyan-300 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {item.dueDate}
                    </div>
                    {item.urgent && <span className="text-amber-400 font-bold">Cần hoàn thành gấp</span>}
                  </div>

                  {item.status === "pending" ? (
                    <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-medium text-xs shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" /> Nộp Bài File
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-semibold text-xs border border-emerald-500/30 flex items-center gap-1">
                      <Check className="w-4 h-4" /> Đã hoàn thành
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
