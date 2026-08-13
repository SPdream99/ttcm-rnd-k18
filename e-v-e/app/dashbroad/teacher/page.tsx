"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTeacherAdapter } from "@/hooks/useTeacherAdapter";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { useLearningPathAdapter } from "@/hooks/useLearningPathAdapter";
import { useGameAdapter } from "@/hooks/useGameAdapter";
import {
  Users,
  GraduationCap,
  PlusCircle,
  TrendingUp,
  BookOpen,
  Gamepad2,
  Sparkles,
  LogOut,
  UserCheck,
} from "lucide-react";

export default function TeacherDashboard() {
  const { currentUser, profile } = useAuthAdapter();
  const teacherUid = currentUser?.uid || currentUser?.id || profile?.id || "usr_teacher_001";
  const teacherName = currentUser?.name || profile?.fullName || "GS. Nguyễn Văn An";

  const { stats, loading: teacherLoading } = useTeacherAdapter();
  const { learningPaths, createLearningPath, loading: lpathLoading } = useLearningPathAdapter(teacherUid);
  const { games, createGame, loading: gamesLoading } = useGameAdapter(teacherUid);

  const [activeTab, setActiveTab] = useState<"overview" | "create_path" | "upload_game">("overview");

  // Create Learning Path Form State
  const [lpathTitle, setLpathTitle] = useState("");
  const [lpathDesc, setLpathDesc] = useState("");
  const [lpathCourses, setLpathCourses] = useState("crs_quantum_101, crs_astrophysics");
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Upload Game Form State
  const [gameTitle, setGameTitle] = useState("");
  const [gameDesc, setGameDesc] = useState("");
  const [gameAuthors, setGameAuthors] = useState(teacherName);
  const [gameCourses, setGameCourses] = useState("crs_quantum_101");
  const [gameSourceUrl, setGameSourceUrl] = useState("");

  const handleCreatePath = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMsg(null);
    const courseList = lpathCourses.split(",").map((c: string) => c.trim()).filter(Boolean);

    const res = await createLearningPath({
      title: lpathTitle,
      description: lpathDesc,
      authorId: teacherUid,
      courses: courseList,
    });

    if (res.success) {
      setFeedbackMsg(`✅ Đã gửi Lộ trình "${lpathTitle}" cho Admin phê duyệt thành công!`);
      setLpathTitle("");
      setLpathDesc("");
      setActiveTab("overview");
      setTimeout(() => setFeedbackMsg(null), 4000);
    } else {
      setFeedbackMsg(`❌ ${res.error || "Lỗi tạo lộ trình."}`);
    }
  };

  const handleUploadGame = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMsg(null);
    const authorList = gameAuthors.split(",").map((a: string) => a.trim()).filter(Boolean);
    const courseList = gameCourses.split(",").map((c: string) => c.trim()).filter(Boolean);

    const res = await createGame({
      title: gameTitle,
      description: gameDesc,
      authors: authorList,
      coursesAllowed: courseList,
      coursesBlocked: [],
      needExtraData: true,
      sourceUrl: gameSourceUrl || "https://storage.eve.edu.vn/games/sample_game/index.html",
      uploaderId: teacherUid,
    });

    if (res.success) {
      setFeedbackMsg(`🎮 Đã gửi Game "${gameTitle}" cho Admin kiểm duyệt thành công!`);
      setGameTitle("");
      setGameDesc("");
      setGameSourceUrl("");
      setActiveTab("overview");
      setTimeout(() => setFeedbackMsg(null), 4000);
    } else {
      setFeedbackMsg(`❌ ${res.error || "Lỗi tải game lên."}`);
    }
  };

  if (teacherLoading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] text-[#e1e2ec] flex items-center justify-center font-sans">
        <p className="text-emerald-400 font-mono text-sm animate-pulse">Đang tải dữ liệu không gian giảng viên...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-[#e1e2ec] flex flex-col md:flex-row relative font-sans">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[130px]" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[130px]" />
      </div>

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0f1524]/80 backdrop-blur-xl border-r border-[#7bd1fa]/15 z-40 p-5 flex flex-col justify-between">
        <div className="space-y-8">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 p-[1px] shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <div className="w-full h-full bg-[#0a0e1a] rounded-[11px] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
                E-V-E <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">TEACHER</span>
              </h1>
              <p className="text-xs text-[#8e9bb4]">Educator Studio</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "bg-gradient-to-r from-emerald-600/25 to-teal-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                  : "text-[#8e9bb4] hover:text-white hover:bg-white/5"
              }`}
            >
              <GraduationCap className="w-5 h-5 text-emerald-400" /> Bàn Làm Việc
            </button>

            <button
              onClick={() => setActiveTab("create_path")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                activeTab === "create_path"
                  ? "bg-gradient-to-r from-emerald-600/25 to-teal-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                  : "text-[#8e9bb4] hover:text-white hover:bg-white/5"
              }`}
            >
              <BookOpen className="w-5 h-5 text-emerald-400" /> Tạo Lộ Trình Mới
            </button>

            <button
              onClick={() => setActiveTab("upload_game")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                activeTab === "upload_game"
                  ? "bg-gradient-to-r from-emerald-600/25 to-teal-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                  : "text-[#8e9bb4] hover:text-white hover:bg-white/5"
              }`}
            >
              <Gamepad2 className="w-5 h-5 text-emerald-400" /> Nộp Game Engine
            </button>

            <Link
              href="/dashbroad/student/profile"
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-[#8e9bb4] hover:text-white hover:bg-white/5 transition-all"
            >
              <UserCheck className="w-5 h-5" /> Trang Cá Nhân
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-[#7bd1fa]/10 space-y-4">
          <Link href="/public/login">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-mono transition-all cursor-pointer">
              <LogOut className="w-3.5 h-3.5" /> Đăng Xuất Giảng Viên
            </button>
          </Link>
        </div>
      </aside>

      {/* Main Educator Workspace */}
      <main className="flex-1 p-4 md:p-8 z-10 space-y-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/10">
          <div>
            <div className="flex items-center gap-2 text-sm text-emerald-400 font-medium mb-1">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              {teacherName} • Tổ Vật Lý Lượng Tử
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Bàn Làm Việc Giảng Viên 👨‍🏫
            </h1>
            <p className="text-sm text-[#8e9bb4] mt-1">
              Quản lý bài học, thiết kế Lộ trình học tập và nộp Game Engine cho Admin phê duyệt.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("create_path")}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-medium text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> Tạo Lộ Trình Học Tập
            </button>
          </div>
        </header>

        {/* Global Feedback Banner */}
        {feedbackMsg && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-900/60 to-teal-900/60 border border-emerald-400/40 text-emerald-200 text-sm font-medium shadow-lg animate-fade-in flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-emerald-300 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* TAB OVERVIEW */}
        {activeTab === "overview" && (
          <>
            {/* Metrics Banner */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((metric, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border border-[#7bd1fa]/15 hover:border-emerald-500/40 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#8e9bb4] uppercase tracking-wider">
                      {metric.title}
                    </span>
                    <div className={`p-2.5 rounded-xl ${metric.bgColor} ${metric.borderColor} border`}>
                      <Users className={`w-5 h-5 ${metric.color}`} />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white tracking-tight">{metric.value}</div>
                    <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                      <TrendingUp className="w-3.5 h-3.5" /> {metric.change}
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* My Learning Paths & Games */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Learning Paths List */}
              <section className="p-6 rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border border-[#7bd1fa]/15 space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-400" /> Lộ Trình Đã Tạo ({learningPaths.length})
                </h2>

                <div className="space-y-3">
                  {learningPaths.map((p) => (
                    <div key={p.lpathId || p.id} className="p-4 rounded-xl bg-[#151b2c] border border-[#7bd1fa]/10 space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-white text-sm">{p.title}</h3>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                            p.isAccepted
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          }`}
                        >
                          {p.isAccepted ? "Đã Duyệt" : "Chờ Duyệt"}
                        </span>
                      </div>
                      <p className="text-xs text-[#8e9bb4] line-clamp-2">{p.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Games List */}
              <section className="p-6 rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border border-[#7bd1fa]/15 space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-emerald-400" /> Game Engine Đã Nộp ({games.length})
                </h2>

                <div className="space-y-3">
                  {games.map((g) => (
                    <div key={g.gameId || g.id} className="p-4 rounded-xl bg-[#151b2c] border border-[#7bd1fa]/10 space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-white text-sm">{g.title}</h3>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                            g.isAccepted
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          }`}
                        >
                          {g.isAccepted ? "Đã Duyệt" : "Chờ Duyệt"}
                        </span>
                      </div>
                      <p className="text-xs text-[#8e9bb4]">{g.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </>
        )}

        {/* TAB CREATE LEARNING PATH */}
        {activeTab === "create_path" && (
          <section className="max-w-2xl mx-auto p-6 rounded-2xl bg-[#0f1524]/80 backdrop-blur-md border border-emerald-500/30 space-y-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-emerald-400" /> Tạo Lộ Trình Học Tập Mới
            </h2>

            <form onSubmit={handleCreatePath} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">Tên Lộ Trình Học Tập</label>
                <input
                  type="text"
                  value={lpathTitle}
                  onChange={(e) => setLpathTitle(e.target.value)}
                  placeholder="VD: Lộ Trình Chuyên Sâu Vật Lý Lượng Tử 12"
                  className="w-full bg-[#151b2c] border border-[#7bd1fa]/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">Mô Tả Lộ Trình</label>
                <textarea
                  value={lpathDesc}
                  onChange={(e) => setLpathDesc(e.target.value)}
                  placeholder="Mô tả mục tiêu đầu ra và đối tượng học sinh hướng tới..."
                  rows={4}
                  className="w-full bg-[#151b2c] border border-[#7bd1fa]/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Danh Sách Course ID Liên Kết (Phân cách bởi dấu phẩy)
                </label>
                <input
                  type="text"
                  value={lpathCourses}
                  onChange={(e) => setLpathCourses(e.target.value)}
                  placeholder="crs_quantum_101, crs_astrophysics"
                  className="w-full bg-[#151b2c] border border-[#7bd1fa]/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setActiveTab("overview")}
                  className="w-1/3 py-3 rounded-xl bg-slate-900 text-slate-400 font-mono text-xs hover:text-white cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={lpathLoading}
                  className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold font-mono text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {lpathLoading ? "Đang gửi..." : "🚀 Gửi Cho Admin Duyệt"}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* TAB UPLOAD GAME */}
        {activeTab === "upload_game" && (
          <section className="max-w-2xl mx-auto p-6 rounded-2xl bg-[#0f1524]/80 backdrop-blur-md border border-emerald-500/30 space-y-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-emerald-400" /> Nộp Game Engine Cho Admin Kiểm Duyệt
            </h2>

            <form onSubmit={handleUploadGame} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">Tên Trò Chơi Trắc Nghiệm</label>
                <input
                  type="text"
                  value={gameTitle}
                  onChange={(e) => setGameTitle(e.target.value)}
                  placeholder="VD: Mô Phỏng Thí Nghiệm Lượng Tử 3D"
                  className="w-full bg-[#151b2c] border border-[#7bd1fa]/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">Mô Tả Lối Chơi & Quy Tắc</label>
                <textarea
                  value={gameDesc}
                  onChange={(e) => setGameDesc(e.target.value)}
                  placeholder="Mô tả cách game đọc dữ liệu extra_data và quy tắc thưởng coin..."
                  rows={3}
                  className="w-full bg-[#151b2c] border border-[#7bd1fa]/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">Tác Giả (Phân cách bởi dấu phẩy)</label>
                <input
                  type="text"
                  value={gameAuthors}
                  onChange={(e) => setGameAuthors(e.target.value)}
                  className="w-full bg-[#151b2c] border border-[#7bd1fa]/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">Link Source / Storage Bundle URL (iframe)</label>
                <input
                  type="url"
                  value={gameSourceUrl}
                  onChange={(e) => setGameSourceUrl(e.target.value)}
                  placeholder="https://storage.eve.edu.vn/games/my_game/index.html"
                  className="w-full bg-[#151b2c] border border-[#7bd1fa]/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setActiveTab("overview")}
                  className="w-1/3 py-3 rounded-xl bg-slate-900 text-slate-400 font-mono text-xs hover:text-white cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={gamesLoading}
                  className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold font-mono text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {gamesLoading ? "Đang gửi..." : "🎮 Nộp Game Cho Admin Kiểm Duyệt"}
                </button>
              </div>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}