"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderKanban,
  BookOpen,
  Layers,
  Gamepad2,
  Clock,
  CheckCircle,
  PlusCircle,
  Eye,
  Trash2,
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function TeacherMyContentsPage() {
  const { currentUser, profile } = useAuthAdapter();
  const teacherUid = currentUser?.uid || profile?.uid || "usr_teacher";

  const [activeTab, setActiveTab] = useState<"courses" | "paths" | "games">("courses");

  const [courses, setCourses] = useState([
    {
      id: "crs_quantum_101",
      title: "Vật Lý Lượng Tử Cơ Bản (Quantum 101)",
      description: "Nhập môn lưỡng tính sóng hạt, nguyên lý bất định và hàm sóng Schrödinger.",
      pairsCount: 3,
      isAccepted: true,
      createdAt: "14/08/2026",
    },
    {
      id: "crs_thermodynamics",
      title: "Nhiệt Động Lực Học Thiên Thể",
      description: "Các nguyên lý entropy, chu trình Carnot trong vật lý vũ trụ.",
      pairsCount: 5,
      isAccepted: false,
      createdAt: "13/08/2026",
    },
  ]);

  const [paths, setPaths] = useState([
    {
      id: "path_quantum_physics",
      title: "Lộ Trình Toàn Diện: Vật Lý Lượng Tử & Thiên Văn",
      description: "Lộ trình học tập chuyên sâu gồm 2 khóa học chính.",
      coursesCount: 2,
      isAccepted: true,
      createdAt: "12/08/2026",
    },
  ]);

  const [games, setGames] = useState([
    {
      id: "game_space_quiz_3d",
      title: "Space Flight Quiz 3D",
      description: "Trò chơi lái tàu không gian 3D trả lời câu hỏi lượng tử.",
      needExtraData: true,
      playsCount: 145,
      isAccepted: true,
      createdAt: "10/08/2026",
    },
  ]);

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/15">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FolderKanban className="w-7 h-7 text-emerald-400" /> Quản Lý Nội Dung Đã Tạo
          </h1>
          <p className="text-sm text-[#8e9bb4] mt-1">
            Theo dõi trạng thái kiểm duyệt các Khóa học (JSON pairs), Lộ trình và Game Engine do Thầy/Cô nộp.
          </p>
        </div>

        <Link href="/teacher/upload-center">
          <button className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer flex items-center gap-2">
            <PlusCircle className="w-4 h-4" /> Tạo Mới
          </button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab("courses")}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
            activeTab === "courses"
              ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
              : "bg-[#151b2c] text-slate-400 border-slate-800"
          }`}
        >
          <BookOpen className="w-4 h-4 text-cyan-400" /> Khóa Học ({courses.length})
        </button>

        <button
          onClick={() => setActiveTab("paths")}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
            activeTab === "paths"
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              : "bg-[#151b2c] text-slate-400 border-slate-800"
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-400" /> Lộ Trình ({paths.length})
        </button>

        <button
          onClick={() => setActiveTab("games")}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
            activeTab === "games"
              ? "bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
              : "bg-[#151b2c] text-slate-400 border-slate-800"
          }`}
        >
          <Gamepad2 className="w-4 h-4 text-purple-400" /> Game Engine ({games.length})
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {activeTab === "courses" &&
          courses.map((c) => (
            <div
              key={c.id}
              className="p-6 rounded-2xl bg-[#0f1524]/90 border border-[#7bd1fa]/15 space-y-3 shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 inline-block mb-1">
                    {c.id}
                  </span>
                  <h3 className="font-bold text-base text-white">{c.title}</h3>
                </div>

                <span
                  className={`font-mono text-[10px] px-2.5 py-1 rounded-full border ${
                    c.isAccepted
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse"
                  }`}
                >
                  {c.isAccepted ? "Đã duyệt" : "Chờ Admin duyệt"}
                </span>
              </div>

              <p className="text-xs text-[#8e9bb4]">{c.description}</p>

              <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-3 border-t border-slate-800/80">
                <span>{c.pairsCount} Cặp câu hỏi</span>
                <span>Ngày tạo: {c.createdAt}</span>
              </div>
            </div>
          ))}

        {activeTab === "paths" &&
          paths.map((p) => (
            <div
              key={p.id}
              className="p-6 rounded-2xl bg-[#0f1524]/90 border border-emerald-500/20 space-y-3 shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 inline-block mb-1">
                    {p.id}
                  </span>
                  <h3 className="font-bold text-base text-white">{p.title}</h3>
                </div>

                <span
                  className={`font-mono text-[10px] px-2.5 py-1 rounded-full border ${
                    p.isAccepted
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse"
                  }`}
                >
                  {p.isAccepted ? "Đã duyệt" : "Chờ duyệt"}
                </span>
              </div>

              <p className="text-xs text-[#8e9bb4]">{p.description}</p>

              <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-3 border-t border-slate-800/80">
                <span>{p.coursesCount} Khóa học đã gộp</span>
                <span>Ngày tạo: {p.createdAt}</span>
              </div>
            </div>
          ))}

        {activeTab === "games" &&
          games.map((g) => (
            <div
              key={g.id}
              className="p-6 rounded-2xl bg-[#0f1524]/90 border border-purple-500/20 space-y-3 shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 inline-block mb-1">
                    {g.id}
                  </span>
                  <h3 className="font-bold text-base text-white">{g.title}</h3>
                </div>

                <span
                  className={`font-mono text-[10px] px-2.5 py-1 rounded-full border ${
                    g.isAccepted
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      : "bg-purple-500/20 text-purple-300 border-purple-500/30"
                  }`}
                >
                  {g.isAccepted ? "Đã duyệt" : "Chờ Audit"}
                </span>
              </div>

              <p className="text-xs text-[#8e9bb4]">{g.description}</p>

              <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-3 border-t border-slate-800/80">
                <span>{g.playsCount} Lượt học sinh chơi</span>
                <span>Inject Data: {g.needExtraData ? "Có" : "Không"}</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
