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
  Trash2,
  ShieldAlert,
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function TeacherMyContentsPage() {
  const { currentUser, profile } = useAuthAdapter();
  const teacherUid = currentUser?.uid || profile?.uid || "usr_teacher";
  const userRole = currentUser?.role || profile?.role || "teacher";

  const [activeTab, setActiveTab] = useState<"courses" | "paths" | "games">("courses");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const [courses, setCourses] = useState([
    {
      id: "crs_coding_basics",
      title: "Bài 1: Nhập Môn Tư Duy Lập Trình & Thuật Toán",
      description: "Làm quen với các khái niệm lập trình cơ bản, tuần tự, biến số và logic.",
      pairsCount: 3,
      resourcesCount: 2,
      authorId: teacherUid,
      isAccepted: true,
      createdAt: "14/08/2026",
    },
    {
      id: "crs_python_mini_games",
      title: "Bài 3: Lập Trình Trò Chơi Mini Với Python",
      description: "Tự tay viết mã nguồn cho các mini-game tương tác vui nhộn.",
      pairsCount: 5,
      resourcesCount: 1,
      authorId: teacherUid,
      isAccepted: false,
      createdAt: "13/08/2026",
    },
  ]);

  const [paths, setPaths] = useState([
    {
      id: "path_kids_coding",
      title: "Lộ Trình: Lập Trình & Khoa Học Máy Tính Cho Trẻ Em",
      description: "Lộ trình học tập trực quan gồm 4 bài học liên kết theo thứ tự.",
      coursesCount: 4,
      authorId: teacherUid,
      isAccepted: true,
      createdAt: "12/08/2026",
    },
  ]);

  const [games, setGames] = useState([
    {
      id: "game_card_match_vr",
      title: "Quantum Memory Matrix (Card Match)",
      description: "Trò chơi lật thẻ bài ghép cặp khái niệm lập trình.",
      needExtraData: true,
      playsCount: 145,
      authorId: teacherUid,
      isAccepted: true,
      createdAt: "10/08/2026",
    },
  ]);

  // Load user's own items from Firestore
  useEffect(() => {
    async function loadOwnContent() {
      if (!teacherUid) return;
      try {
        // Query courses created by this user
        const cSnap = await getDocs(query(collection(db, "courses"), where("authorId", "==", teacherUid)));
        if (!cSnap.empty) {
          const list = cSnap.docs.map((d) => {
            const data = d.data();
            const pairs = Array.isArray(data.contentData) ? data.contentData : data.contentData?.pairs || [];
            return {
              id: d.id,
              title: data.title || "Khóa học",
              description: data.description || "",
              pairsCount: pairs.length,
              resourcesCount: data.resources?.length || 0,
              authorId: data.authorId || teacherUid,
              isAccepted: !!(data.isAccepted || data.is_accepted),
              createdAt: data.createdAt ? new Date(data.createdAt).toLocaleDateString("vi-VN") : "Hôm nay",
            };
          });
          setCourses(list);
        }
      } catch {}
    }
    loadOwnContent();
  }, [teacherUid]);

  // Delete handler with ownership enforcement
  const handleDeleteItem = async (type: "course" | "path" | "game", id: string, authorId: string) => {
    // Strict Ownership Check: Only Admin and Author can delete/modify
    if (authorId !== teacherUid && userRole !== "admin") {
      alert("⚠️ Lỗi Phân Quyền: Bạn chỉ có thể chỉnh sửa/xóa nội dung do chính bạn tạo ra!");
      return;
    }

    if (!confirm("Bạn có chắc chắn muốn xóa mục này không?")) return;

    try {
      const collectionName = type === "course" ? "courses" : type === "path" ? "learning_paths" : "games";
      await deleteDoc(doc(db, collectionName, id));
    } catch {}

    if (type === "course") setCourses((prev) => prev.filter((c) => c.id !== id));
    if (type === "path") setPaths((prev) => prev.filter((p) => p.id !== id));
    if (type === "game") setGames((prev) => prev.filter((g) => g.id !== id));

    setActionNotice("Đã xóa nội dung thành công!");
    setTimeout(() => setActionNotice(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/15">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FolderKanban className="w-7 h-7 text-emerald-400" /> Quản Lý Nội Dung Đã Tạo
          </h1>
          <p className="text-sm text-[#8e9bb4] mt-1">
            Theo dõi trạng thái kiểm duyệt các Bài học, Lộ trình và Game do Thầy/Cô tạo ra. Đảm bảo tính bảo mật và phân quyền cá nhân.
          </p>
        </div>

        <Link href="/teacher/upload-center">
          <button className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer flex items-center gap-2">
            <PlusCircle className="w-4 h-4" /> Tạo Thêm Mới
          </button>
        </Link>
      </div>

      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
          {actionNotice}
        </div>
      )}

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
          <BookOpen className="w-4 h-4 text-cyan-400" /> Bài Học & Học Liệu ({courses.length})
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
          <Gamepad2 className="w-4 h-4 text-purple-400" /> Game Đã Nộp ({games.length})
        </button>
      </div>

      {/* ── TAB 1: COURSES ── */}
      {activeTab === "courses" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="p-6 rounded-2xl bg-[#0f1524]/90 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                      course.isAccepted
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                        : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {course.isAccepted ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    {course.isAccepted ? "Đã Phê Duyệt" : "Chờ Admin Duyệt"}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">{course.createdAt}</span>
                </div>

                <h3 className="text-base font-bold text-white">{course.title}</h3>
                <p className="text-xs text-[#8e9bb4] line-clamp-2">{course.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="text-cyan-300 font-bold">{course.pairsCount} Cặp Câu Hỏi</span>
                  <span>•</span>
                  <span className="text-emerald-300 font-bold">{course.resourcesCount} Tài Liệu</span>
                </div>

                <button
                  onClick={() => handleDeleteItem("course", course.id, course.authorId)}
                  className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer p-1 rounded hover:bg-rose-500/10"
                  title="Xóa bài học của bạn"
                >
                  <Trash2 className="w-4 h-4" /> Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TAB 2: LEARNING PATHS ── */}
      {activeTab === "paths" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paths.map((path) => (
            <div
              key={path.id}
              className="p-6 rounded-2xl bg-[#0f1524]/90 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                      path.isAccepted
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                        : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {path.isAccepted ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    {path.isAccepted ? "Đã Phê Duyệt" : "Chờ Admin Duyệt"}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">{path.createdAt}</span>
                </div>

                <h3 className="text-base font-bold text-white">{path.title}</h3>
                <p className="text-xs text-[#8e9bb4] line-clamp-2">{path.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="text-emerald-300 font-bold">{path.coursesCount} Khóa Học Trong Lộ Trình</span>

                <button
                  onClick={() => handleDeleteItem("path", path.id, path.authorId)}
                  className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer p-1 rounded hover:bg-rose-500/10"
                >
                  <Trash2 className="w-4 h-4" /> Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TAB 3: GAMES ── */}
      {activeTab === "games" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {games.map((game) => (
            <div
              key={game.id}
              className="p-6 rounded-2xl bg-[#0f1524]/90 border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                      game.isAccepted
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                        : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {game.isAccepted ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    {game.isAccepted ? "Đã Phê Duyệt" : "Chờ Admin Duyệt"}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">{game.createdAt}</span>
                </div>

                <h3 className="text-base font-bold text-white">{game.title}</h3>
                <p className="text-xs text-[#8e9bb4] line-clamp-2">{game.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="text-purple-300 font-bold">{game.playsCount} Lượt Học Sinh Chơi</span>

                <button
                  onClick={() => handleDeleteItem("game", game.id, game.authorId)}
                  className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer p-1 rounded hover:bg-rose-500/10"
                >
                  <Trash2 className="w-4 h-4" /> Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
