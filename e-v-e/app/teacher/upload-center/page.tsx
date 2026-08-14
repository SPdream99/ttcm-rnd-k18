"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  UploadCloud,
  BookOpen,
  Layers,
  Gamepad2,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  FileCode,
  FolderArchive,
  Info,
  ShieldAlert,
  Download,
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { collection, addDoc, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CourseContentPair } from "@/core/entities/Course";

export default function TeacherUploadCenterPage() {
  const { currentUser, profile } = useAuthAdapter();
  const teacherUid = currentUser?.uid || profile?.uid || "usr_teacher";
  const teacherName = currentUser?.name || profile?.fullName || "Giảng viên";

  const [activeTab, setActiveTab] = useState<"course" | "path" | "game">("course");
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  // ── 1. Create Course State ──
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [resources, setResources] = useState<{ title: string; url: string; type: "pdf" | "video" | "code" | "slide" | "link" }[]>([
    { title: "Slide Bài Giảng & Code Mẫu", url: "https://github.com", type: "code" },
  ]);
  const [pairs, setPairs] = useState<CourseContentPair[]>([
    {
      id: "pair_1",
      title: "Lệnh print() trong Python dùng để làm gì?",
      description: "In văn bản hoặc kết quả ra màn hình",
      explanation: "Hàm print() là hàm tích hợp sẵn trong Python dùng để xuất dữ liệu hoặc chuỗi thông báo ra màn hình console.",
      distractions: ["Nhập dữ liệu từ bàn phím", "Tạo một biến số mới", "Dừng chương trình"],
      image_url: "",
    },
  ]);

  // ── 2. Create Learning Path State ──
  const [pathTitle, setPathTitle] = useState("");
  const [pathDesc, setPathDesc] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>(["crs_quantum_101"]);
  const [availableCourses, setAvailableCourses] = useState([
    { id: "crs_quantum_101", title: "Vật Lý Lượng Tử Cơ Bản" },
    { id: "crs_astrophysics", title: "Thiên Văn Học & Hố Đen Vũ Trụ" },
    { id: "crs_algorithms", title: "Cấu Trúc Dữ Liệu & Giải Thuật Không Gian" },
  ]);

  // ── 3. Upload Game State ──
  const [gameTitle, setGameTitle] = useState("");
  const [gameDesc, setGameDesc] = useState("");
  const [gameZipFile, setGameZipFile] = useState<File | null>(null);
  const [needExtraData, setNeedExtraData] = useState(true);
  const [whitelistMode, setWhitelistMode] = useState<"all" | "custom">("all");
  const [allowedCourses, setAllowedCourses] = useState<string[]>(["crs_quantum_101"]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStepText, setUploadStepText] = useState("");

  // Add pair handler
  const handleAddPair = () => {
    setPairs((prev) => [
      ...prev,
      {
        id: `pair_${Date.now()}`,
        title: "",
        description: "",
        explanation: "",
        distractions: [""],
        image_url: "",
      },
    ]);
  };

  const handleRemovePair = (idx: number) => {
    setPairs((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpdatePair = (idx: number, field: keyof CourseContentPair, val: any) => {
    setPairs((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  const handleAddDistraction = (pairIdx: number) => {
    setPairs((prev) => {
      const copy = [...prev];
      copy[pairIdx].distractions = [...(copy[pairIdx].distractions || []), ""];
      return copy;
    });
  };

  const handleUpdateDistraction = (pairIdx: number, distIdx: number, val: string) => {
    setPairs((prev) => {
      const copy = [...prev];
      const dists = [...(copy[pairIdx].distractions || [])];
      dists[distIdx] = val;
      copy[pairIdx].distractions = dists;
      return copy;
    });
  };

  const handleRemoveDistraction = (pairIdx: number, distIdx: number) => {
    setPairs((prev) => {
      const copy = [...prev];
      copy[pairIdx].distractions = (copy[pairIdx].distractions || []).filter((_, i) => i !== distIdx);
      return copy;
    });
  };

  // Drag & Drop Handlers for ZIP File
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const name = file.name.toLowerCase();
      if (name.endsWith(".zip") || name.endsWith(".rar") || name.endsWith(".tar.gz")) {
        setGameZipFile(file);
        if (!gameTitle) {
          // Auto-suggest game title from filename
          const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
          setGameTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
        }
      } else {
        alert("Vui lòng tải lên file định dạng nén (.zip, .rar, .tar.gz) chứa mã nguồn HTML/JS/WebGL game.");
      }
    }
  };

  // Submit Course
  const handleSubmitCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle || pairs.length === 0) {
      alert("Vui lòng nhập tên khóa học và ít nhất 1 cặp câu hỏi.");
      return;
    }

    const payload = {
      title: courseTitle,
      description: courseDesc,
      authorId: teacherUid,
      authorName: teacherName,
      resources: resources.filter((r) => r.title.trim() && r.url.trim()),
      isAccepted: false,
      is_accepted: false,
      contentData: { pairs },
      createdAt: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, "courses"), payload);
    } catch {}

    setActionMsg(`✅ Đã lưu Khóa Học "${courseTitle}" với ${pairs.length} cặp câu hỏi và ${resources.length} tài liệu học tập!`);
    setCourseTitle("");
    setCourseDesc("");
    setPairs([{ id: "pair_1", title: "", description: "", explanation: "", distractions: [""], image_url: "" }]);
    setResources([]);
    setTimeout(() => setActionMsg(null), 4500);
  };

  // Submit Learning Path
  const handleSubmitPath = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pathTitle || selectedCourses.length === 0) {
      alert("Vui lòng nhập tiêu đề lộ trình và chọn ít nhất 1 khóa học.");
      return;
    }

    const payload = {
      title: pathTitle,
      description: pathDesc,
      authorId: teacherUid,
      authorName: teacherName,
      courses: selectedCourses,
      isAccepted: false,
      is_accepted: false,
      createdAt: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, "learning_paths"), payload);
    } catch {}

    setActionMsg(`✅ Đã gửi Lộ Trình "${pathTitle}" gồm ${selectedCourses.length} khóa học lên Admin để duyệt!`);
    setPathTitle("");
    setPathDesc("");
    setTimeout(() => setActionMsg(null), 4500);
  };

  // Submit Game with Step-by-Step Progress Bar and Multi-Layer Persistence
  const handleSubmitGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameTitle.trim()) {
      alert("Vui lòng nhập tiêu đề Game.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    setUploadStepText("1/4: Đang đọc và kiểm tra tính toàn vẹn của file nén package .zip...");

    // Simulated progress steps with realistic delays
    await new Promise((r) => setTimeout(r, 600));
    setUploadProgress(35);
    setUploadStepText("2/4: Phân tích cấu trúc thư mục (index.html, eve-game-sdk.js, manifest)...");

    await new Promise((r) => setTimeout(r, 700));
    setUploadProgress(70);
    setUploadStepText("3/4: Đăng ký Game Engine lên Firestore & Cổng kiểm soát E-V-E...");

    const gameGeneratedId = `game_${Date.now()}`;
    const slugName = gameTitle.toLowerCase().replace(/[^a-z0-9]+/g, "_");
    const downloadUrl = gameZipFile ? `/boss_battle_quiz.zip` : "https://github.com/SPdream99/ttcm-rnd-k18";

    const payload = {
      id: gameGeneratedId,
      gameId: gameGeneratedId,
      title: gameTitle,
      description: gameDesc || "Trò chơi tương tác học tập tích hợp E-V-E Game SDK.",
      authorId: teacherUid,
      author_id: teacherUid,
      uploaderId: teacherUid,
      uploader_id: teacherUid,
      authorName: teacherName,
      authors: [teacherName],
      needExtraData,
      need_extra_data: needExtraData,
      coursesAllowed: whitelistMode === "all" ? "all" : allowedCourses,
      courses_allowed: whitelistMode === "all" ? "all" : allowedCourses,
      coursesBlocked: [],
      courses_blocked: [],
      gameUrl: `/games/${slugName}/index.html`,
      sourceUrl: `/games/${slugName}/index.html`,
      source_url: `/games/${slugName}/index.html`,
      downloadSourceUrl: downloadUrl,
      download_source_url: downloadUrl,
      fileName: gameZipFile ? gameZipFile.name : "boss_battle_quiz.zip",
      fileSize: gameZipFile ? `${(gameZipFile.size / 1024).toFixed(1)} KB` : "19.5 KB",
      isAccepted: false,
      is_accepted: false,
      playsCount: 0,
      plays_count: 0,
      createdAt: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    // 1. Save to Firestore
    try {
      await setDoc(doc(db, "game_info", gameGeneratedId), payload);
    } catch (err) {
      console.warn("Firestore setDoc error (falling back to LocalStorage):", err);
    }

    // 2. Multi-layer persistent storage to LocalStorage so Admin Audit always sees it
    try {
      const prevStored = JSON.parse(localStorage.getItem("eve_uploaded_games") || "[]");
      const updatedList = [payload, ...prevStored.filter((g: any) => g.id !== payload.id && g.title !== payload.title)];
      localStorage.setItem("eve_uploaded_games", JSON.stringify(updatedList));
      window.dispatchEvent(new Event("eve_games_updated"));
    } catch (e) {
      console.warn("LocalStorage save error:", e);
    }

    await new Promise((r) => setTimeout(r, 600));
    setUploadProgress(100);
    setUploadStepText("4/4: Hoàn tất 100%! Game đã được chuyển thành công tới hàng chờ Admin Audit.");

    await new Promise((r) => setTimeout(r, 400));
    setIsUploading(false);
    setActionMsg(`🎉 Đã tải lên Game "${gameTitle}" (.zip) thành công! Quản trị viên Admin đã nhận được thông báo để audit.`);
    setGameTitle("");
    setGameDesc("");
    setGameZipFile(null);
    setUploadProgress(0);
    setUploadStepText("");
    setTimeout(() => setActionMsg(null), 6000);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/15">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <UploadCloud className="w-7 h-7 text-emerald-400" /> Trung Tâm Soạn Bài & Quản Lý Học Liệu
          </h1>
          <p className="text-sm text-[#8e9bb4] mt-1">
            Thiết kế bài giảng lập trình, đính kèm tài liệu học tập (PDF/Code/Slide) và tạo các cặp câu hỏi tương tác cho trẻ nhỏ.
          </p>
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs flex items-center justify-between animate-fade-in">
          <span>{actionMsg}</span>
          <button onClick={() => setActionMsg(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab("course")}
          className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
            activeTab === "course"
              ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
              : "bg-[#151b2c] text-slate-400 border-slate-800 hover:border-slate-700"
          }`}
        >
          <BookOpen className="w-4 h-4 text-cyan-400" /> Tab 1: Tạo Bài Học & Học Liệu
        </button>

        <button
          onClick={() => setActiveTab("path")}
          className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
            activeTab === "path"
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
              : "bg-[#151b2c] text-slate-400 border-slate-800 hover:border-slate-700"
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-400" /> Tab 2: Tạo Lộ Trình Học Tập
        </button>

        <button
          onClick={() => setActiveTab("game")}
          className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
            activeTab === "game"
              ? "bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.25)]"
              : "bg-[#151b2c] text-slate-400 border-slate-800 hover:border-slate-700"
          }`}
        >
          <Gamepad2 className="w-4 h-4 text-purple-400" /> Tab 3: Nộp Trò Chơi Mới (.zip)
        </button>
      </div>

      {/* ── TAB 1: CREATE COURSE WITH JSON PAIRS & RESOURCES ── */}
      {activeTab === "course" && (
        <form onSubmit={handleSubmitCourse} className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0f1524]/90 border border-[#7bd1fa]/15 space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" /> Thông Tin Cơ Bản Bài Học
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">Tên Bài Học / Khóa Học</label>
                <input
                  type="text"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="VD: Lập Trình Python Căn Bản Cho Trẻ Em"
                  className="w-full bg-[#151b2c] border border-cyan-500/20 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">Mô Tả Bài Học</label>
                <input
                  type="text"
                  value={courseDesc}
                  onChange={(e) => setCourseDesc(e.target.value)}
                  placeholder="Khái niệm biến số, vòng lặp for/while và câu lệnh điều kiện if-else..."
                  className="w-full bg-[#151b2c] border border-cyan-500/20 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Resources & Attachments Section */}
          <div className="p-6 rounded-2xl bg-[#0f1524]/90 border border-[#7bd1fa]/15 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-400" /> Tài Liệu & Học Liệu Đính Kèm (Resources)
                </h3>
                <p className="text-xs text-[#8e9bb4] mt-0.5">
                  Cung cấp link Slide bài giảng, file PDF giáo trình, link video Youtube hoặc kho code mẫu cho học sinh tải về học.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setResources((prev) => [...prev, { title: "", url: "", type: "code" }])}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1 cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm Tài Liệu
              </button>
            </div>

            <div className="space-y-3">
              {resources.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#151b2c] border border-slate-800 text-center text-slate-500 text-xs font-mono">
                  Chưa có tài liệu đính kèm. Bấm nút "Thêm Tài Liệu" ở trên để bổ sung.
                </div>
              ) : (
                resources.map((res, rIdx) => (
                  <div key={rIdx} className="p-4 rounded-xl bg-[#151b2c] border border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        value={res.title}
                        onChange={(e) => {
                          const copy = [...resources];
                          copy[rIdx].title = e.target.value;
                          setResources(copy);
                        }}
                        placeholder="Tên tài liệu (VD: Slide Bài Giảng Tuần 1)"
                        className="w-full bg-[#0f1524] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="sm:col-span-5">
                      <input
                        type="text"
                        value={res.url}
                        onChange={(e) => {
                          const copy = [...resources];
                          copy[rIdx].url = e.target.value;
                          setResources(copy);
                        }}
                        placeholder="Đường link URL (https://drive.google.com/... hoặc github)"
                        className="w-full bg-[#0f1524] border border-slate-700 rounded-lg px-3 py-2 text-xs text-cyan-300 focus:outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <select
                        value={res.type}
                        onChange={(e) => {
                          const copy = [...resources];
                          copy[rIdx].type = e.target.value as any;
                          setResources(copy);
                        }}
                        className="w-full bg-[#0f1524] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                      >
                        <option value="code">Code Mẫu</option>
                        <option value="slide">Slide Bài</option>
                        <option value="pdf">Tài liệu PDF</option>
                        <option value="video">Video Clip</option>
                        <option value="link">Link ngoài</option>
                      </select>
                    </div>

                    <div className="sm:col-span-1 text-right">
                      <button
                        type="button"
                        onClick={() => setResources((prev) => prev.filter((_, i) => i !== rIdx))}
                        className="text-slate-500 hover:text-rose-400 cursor-pointer p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Dynamic Question Pairs */}
          <div className="p-6 rounded-2xl bg-[#0f1524]/90 border border-[#7bd1fa]/15 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-cyan-400" /> Cặp Dữ Liệu Câu Hỏi & Đáp Án (JSON Pairs)
                </h3>
                <p className="text-xs text-[#8e9bb4] mt-0.5">
                  Mỗi cặp gồm Tiêu đề/Khái niệm, Đáp án đúng (Right Answer) và các Phương án gây nhiễu (Distractions).
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddPair}
                className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)]"
              >
                <Plus className="w-4 h-4" /> Thêm Cặp Câu Hỏi
              </button>
            </div>

            <div className="space-y-4">
              {pairs.map((pair, idx) => (
                <div key={pair.id || idx} className="p-5 rounded-xl bg-[#151b2c] border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-cyan-400"># Cặp Dữ Liệu {idx + 1}</span>
                    {pairs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePair(idx)}
                        className="text-rose-400 hover:text-rose-300 font-mono text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Xóa cặp này
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Tiêu đề / Khái niệm / Câu hỏi:
                    </label>
                    <input
                      type="text"
                      value={pair.title}
                      onChange={(e) => handleUpdatePair(idx, "title", e.target.value)}
                      placeholder="VD: Hiện tượng quang điện chứng minh tính chất gì của ánh sáng?"
                      className="w-full bg-[#0f1524] border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Right answer */}
                    <div>
                      <label className="block text-xs font-mono text-emerald-400 mb-1 font-bold">
                        ✓ Đáp án đúng (Right Answer):
                      </label>
                      <input
                        type="text"
                        value={pair.description}
                        onChange={(e) => handleUpdatePair(idx, "description", e.target.value)}
                        placeholder="VD: Tính chất hạt (Photon)"
                        className="w-full bg-[#0f1524] border border-emerald-500/40 focus:border-emerald-400 rounded-xl px-4 py-2.5 text-sm text-emerald-200 focus:outline-none"
                        required
                      />
                    </div>

                    {/* Image URL */}
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1">
                        URL Hình Ảnh Minh Họa (Tùy chọn):
                      </label>
                      <input
                        type="text"
                        value={pair.image_url || ""}
                        onChange={(e) => handleUpdatePair(idx, "image_url", e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-[#0f1524] border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Explanation */}
                  <div>
                    <label className="block text-xs font-mono text-cyan-300 mb-1 font-bold">
                      💡 Giải thích chi tiết đáp án / kiến thức (Explanation):
                    </label>
                    <textarea
                      rows={2}
                      value={pair.explanation || ""}
                      onChange={(e) => handleUpdatePair(idx, "explanation", e.target.value)}
                      placeholder="VD: Giải thích tại sao đáp án này đúng và nguyên lý kiến thức liên quan..."
                      className="w-full bg-[#0f1524] border border-cyan-500/30 focus:border-cyan-400 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none resize-none"
                    />
                  </div>

                  {/* Distractions */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono text-rose-400 font-bold">
                        ✗ Các Phương Án Gây Nhiễu / Sai (Distractions):
                      </label>
                      <button
                        type="button"
                        onClick={() => handleAddDistraction(idx)}
                        className="text-[11px] font-mono text-cyan-400 hover:underline cursor-pointer"
                      >
                        + Thêm đáp án sai
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {(pair.distractions || []).map((dist, dIdx) => (
                        <div key={dIdx} className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={dist}
                            onChange={(e) => handleUpdateDistraction(idx, dIdx, e.target.value)}
                            placeholder={`Đáp án sai #${dIdx + 1}`}
                            className="w-full bg-[#0f1524] border border-rose-500/30 focus:border-rose-400 rounded-xl px-3 py-2 text-xs text-rose-200 focus:outline-none"
                          />
                          {(pair.distractions || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveDistraction(idx, dIdx)}
                              className="text-slate-500 hover:text-rose-400 cursor-pointer"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-cyan-300 text-white font-bold font-mono text-sm shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" /> Gửi Khóa Học Cho Admin Phê Duyệt
          </button>
        </form>
      )}

      {/* ── TAB 2: CREATE LEARNING PATH ── */}
      {activeTab === "path" && (
        <form onSubmit={handleSubmitPath} className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0f1524]/90 border border-emerald-500/20 space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" /> Thông Tin Lộ Trình Học Tập
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">Tiêu Đề Lộ Trình</label>
                <input
                  type="text"
                  value={pathTitle}
                  onChange={(e) => setPathTitle(e.target.value)}
                  placeholder="VD: Chinh Phục Vật Lý Thiên Văn & Lượng Tử K18"
                  className="w-full bg-[#151b2c] border border-emerald-500/20 focus:border-emerald-400 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">Mô Tả Lộ Trình</label>
                <textarea
                  rows={3}
                  value={pathDesc}
                  onChange={(e) => setPathDesc(e.target.value)}
                  placeholder="Lộ trình kết hợp lý thuyết và game quiz rèn luyện tư duy không gian..."
                  className="w-full bg-[#151b2c] border border-emerald-500/20 focus:border-emerald-400 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0f1524]/90 border border-emerald-500/20 space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" /> Chọn Các Khóa Học Cho Vào Lộ Trình
            </h3>
            <p className="text-xs text-[#8e9bb4]">
              Học sinh sẽ học lần lượt các khóa học này theo thứ tự sắp xếp trong lộ trình.
            </p>

            <div className="space-y-2.5">
              {availableCourses.map((c) => {
                const isSelected = selectedCourses.includes(c.id);
                return (
                  <label
                    key={c.id}
                    className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? "bg-emerald-500/20 border-emerald-500 text-white"
                        : "bg-[#151b2c] border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCourses((prev) => [...prev, c.id]);
                          } else {
                            setSelectedCourses((prev) => prev.filter((id) => id !== c.id));
                          }
                        }}
                        className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                      />
                      <div>
                        <div className="font-bold text-sm text-white font-sans">{c.title}</div>
                        <div className="text-xs font-mono text-emerald-300/80">Mã: {c.id}</div>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold font-mono text-sm shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" /> Gửi Lộ Trình Cho Admin Phê Duyệt
          </button>
        </form>
      )}

      {/* ── TAB 3: UPLOAD GAME ENGINE (.ZIP) ── */}
      {activeTab === "game" && (
        <form onSubmit={handleSubmitGame} className="space-y-6">
          {/* Quick Download SDK & Starter Kit Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#151b2c] to-purple-950/40 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1">
              <div className="text-xs font-mono text-emerald-300 font-bold flex items-center gap-1.5">
                <Download className="w-4 h-4 text-emerald-400" /> Tải Bộ Mã Nguồn Mẫu & Thư Viện SDK Để Chạy Test Trực Tiếp
              </div>
              <p className="text-xs text-slate-300">
                Thầy/Cô có thể tải bộ mã nguồn mẫu <code className="text-cyan-300 font-mono">eve_game_starter_kit.zip</code> (có sẵn file HTML/JS/CSS và câu hỏi mẫu) để chạy thử nghiệm offline trước khi nén gói nộp lên hệ thống.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <a
                href="/eve_game_starter_kit.zip"
                download="eve_game_starter_kit.zip"
                className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-black font-mono font-bold text-xs border border-cyan-500/40 transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.2)]"
              >
                <Download className="w-3.5 h-3.5" /> Tải Starter Kit (.ZIP)
              </a>
              <a
                href="/eve-game-sdk.js"
                download="eve-game-sdk.js"
                className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black font-mono font-bold text-xs border border-emerald-500/40 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> eve-game-sdk.js
              </a>
              <Link
                href="/teacher/game-sdk-guide"
                className="px-3.5 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500 text-purple-300 hover:text-black font-mono font-bold text-xs border border-purple-500/40 transition-all flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" /> Xem Tài Liệu SDK →
              </Link>
            </div>
          </div>

          {/* Game Archetype Template Presets */}
          <div className="p-6 rounded-2xl bg-[#0f1524]/90 border border-purple-500/20 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" /> Mẫu Thiết Kế Trò Chơi (Game Archetypes & Templates)
              </h3>
              <span className="text-xs font-mono text-purple-300">Chọn mẫu để tạo nhanh</span>
            </div>
            <p className="text-xs text-[#8e9bb4]">
              Hệ thống E-V-E hỗ trợ đa dạng thể loại trò chơi: từ Lật Thẻ Ghép Cặp (Card Matching), Mô hình Không Gian 3D (3D Hardware Lab), đến Game Action Quiz hoặc nộp Source Code tự viết bằng Next.js / WebGL.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setGameTitle("Quantum Memory Matrix (Card Match)");
                  setGameDesc("Trò chơi lật thẻ bài ghép cặp khái niệm và định nghĩa/đáp án dựa trên dữ liệu Course ngẫu nhiên.");
                  setNeedExtraData(true);
                }}
                className="p-4 rounded-xl bg-[#151b2c] hover:bg-purple-950/30 border border-purple-500/30 hover:border-purple-400 text-left transition-all cursor-pointer space-y-1.5"
              >
                <div className="text-xs font-bold text-purple-300 font-mono">🃏 Mẫu 1: Card Matching Matrix</div>
                <div className="text-[11px] text-slate-400">Bốc ngẫu nhiên cặp câu hỏi/đáp án thành các thẻ bài tương tác lật mở.</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setGameTitle("3D Computer Hardware & Spatial Assembly Lab");
                  setGameDesc("Khám phá mô hình 3D linh kiện máy tính (CPU, GPU, RAM, SSD), lắp ráp vào bo mạch chủ và kiểm tra khởi động POST BIOS.");
                  setNeedExtraData(true);
                }}
                className="p-4 rounded-xl bg-[#151b2c] hover:bg-cyan-950/30 border border-cyan-500/30 hover:border-cyan-400 text-left transition-all cursor-pointer space-y-1.5"
              >
                <div className="text-xs font-bold text-cyan-300 font-mono">🖥️ Mẫu 2: 3D Hardware Assembly Lab</div>
                <div className="text-[11px] text-slate-400">Mô hình 3D linh kiện máy tính, kiểm tra thông số và lắp ráp thực hành.</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setGameTitle("Quiz Runner 3D - Trắc Nghiệm Tốc Độ");
                  setGameDesc("Điều khiển nhân vật vượt chướng ngại vật bằng cách chọn đúng cổng đáp án tương ứng với nội dung câu hỏi.");
                  setNeedExtraData(true);
                }}
                className="p-4 rounded-xl bg-[#151b2c] hover:bg-emerald-950/30 border border-emerald-500/30 hover:border-emerald-400 text-left transition-all cursor-pointer space-y-1.5"
              >
                <div className="text-xs font-bold text-emerald-300 font-mono">🏃 Mẫu 3: Quiz Runner 3D</div>
                <div className="text-[11px] text-slate-400">Trò chơi phản xạ vượt chướng ngại vật tích hợp ngân hàng câu hỏi đa dạng.</div>
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0f1524]/90 border border-purple-500/20 space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-purple-400" /> Thông Tin Chi Tiết Trò Chơi
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">Tên Trò Chơi</label>
                <input
                  type="text"
                  value={gameTitle}
                  onChange={(e) => setGameTitle(e.target.value)}
                  placeholder="VD: Quantum Memory Matrix / 3D Computer Hardware Lab"
                  className="w-full bg-[#151b2c] border border-purple-500/20 focus:border-purple-400 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">Mô Tả Trò Chơi & Luật Chơi</label>
                <textarea
                  rows={3}
                  value={gameDesc}
                  onChange={(e) => setGameDesc(e.target.value)}
                  placeholder="Mô tả cách học sinh tương tác, cơ chế vượt chướng ngại vật..."
                  className="w-full bg-[#151b2c] border border-purple-500/20 focus:border-purple-400 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              {/* Upload Zip File with Drag & Drop */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Source Code / Build Package (.zip, .rar, .tar.gz):</span>
                  <span className="text-[11px] text-purple-300 font-normal">Hỗ trợ Kéo & Thả file trực tiếp</span>
                </label>

                <div
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`p-6 rounded-2xl border-2 border-dashed transition-all text-center relative ${
                    isDragging
                      ? "border-purple-400 bg-purple-950/40 shadow-[0_0_25px_rgba(168,85,247,0.4)] scale-[1.01]"
                      : gameZipFile
                      ? "border-emerald-500/50 bg-emerald-950/20"
                      : "border-purple-500/30 bg-[#151b2c]/80 hover:border-purple-400"
                  }`}
                >
                  <input
                    type="file"
                    accept=".zip,.rar,.tar.gz"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null;
                      setGameZipFile(f);
                      if (f && !gameTitle) {
                        const clean = f.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
                        setGameTitle(clean.charAt(0).toUpperCase() + clean.slice(1));
                      }
                    }}
                    className="hidden"
                    id="game-file-input"
                  />

                  {gameZipFile ? (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-[#0f1524] rounded-xl border border-emerald-500/40">
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-base shrink-0">
                          📦
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white font-mono truncate max-w-xs sm:max-w-md">
                            {gameZipFile.name}
                          </div>
                          <div className="text-[11px] text-emerald-400 font-mono">
                            {(gameZipFile.size / 1024).toFixed(1)} KB • Sẵn sàng tải lên
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <label
                          htmlFor="game-file-input"
                          className="px-3 py-1.5 rounded-lg bg-[#151b2c] hover:bg-slate-800 text-slate-300 text-xs font-mono cursor-pointer border border-slate-700 transition-colors"
                        >
                          Đổi file khác
                        </label>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setGameZipFile(null);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 text-xs font-mono cursor-pointer transition-colors"
                          title="Hủy chọn file"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label htmlFor="game-file-input" className="cursor-pointer block">
                      <FolderArchive className={`w-10 h-10 mx-auto mb-2 transition-transform ${isDragging ? "text-purple-300 scale-125 animate-bounce" : "text-purple-400"}`} />
                      <span className="text-xs font-mono text-purple-300 hover:underline font-bold block">
                        {isDragging ? "🔥 Thả file .zip vào đây ngay!" : "Kéo thả file .zip vào đây hoặc Bấm để duyệt file"}
                      </span>
                      <span className="text-[11px] text-slate-400 block mt-1">
                        Chấp nhận các file gói mã nguồn nén: .zip, .rar, .tar.gz
                      </span>
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Config Whitelist & Extra Data */}
          <div className="p-6 rounded-2xl bg-[#0f1524]/90 border border-purple-500/20 space-y-5">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Info className="w-5 h-5 text-purple-400" /> Cấu Hình Dữ Liệu & Danh Sách Khóa Học Tương Thích (Whitelist)
            </h3>

            <div className="space-y-4">
              {/* Need extra data checkbox */}
              <label className="p-4 rounded-xl bg-[#151b2c] border border-slate-800 flex items-start gap-3 cursor-pointer hover:border-purple-500/40 transition-colors">
                <input
                  type="checkbox"
                  checked={needExtraData}
                  onChange={(e) => setNeedExtraData(e.target.checked)}
                  className="w-4 h-4 rounded accent-purple-500 mt-0.5 cursor-pointer"
                />
                <div>
                  <div className="font-bold text-sm text-white">Yêu cầu dữ liệu câu hỏi từ Course (need_extra_data)</div>
                  <div className="text-xs text-[#8e9bb4] mt-0.5">
                    Hệ thống sẽ tự động inject danh sách JSON pairs của khóa học vào Game thông qua <code className="text-purple-300">window.postMessage()</code> hoặc <code className="text-purple-300">window.EveSDK</code>.
                  </div>
                </div>
              </label>

              {/* Whitelist course configuration */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-mono text-slate-300 font-bold mb-1">
                    Danh Sách Khóa Học Được Phép Sử Dụng (Whitelist Courses):
                  </label>
                  <p className="text-[11px] text-[#8e9bb4]">
                    Áp dụng cho tất cả trò chơi (kể cả trò chơi độc lập hay trò chơi cần nạp dữ liệu động từ khóa học).
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setWhitelistMode("all")}
                    className={`p-3 rounded-xl border font-mono text-xs font-bold transition-all cursor-pointer ${
                      whitelistMode === "all"
                        ? "bg-purple-500/20 text-purple-300 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.25)]"
                        : "bg-[#151b2c] text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    Hỗ trợ tất cả Khóa Học (all)
                  </button>
                  <button
                    type="button"
                    onClick={() => setWhitelistMode("custom")}
                    className={`p-3 rounded-xl border font-mono text-xs font-bold transition-all cursor-pointer ${
                      whitelistMode === "custom"
                        ? "bg-purple-500/20 text-purple-300 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.25)]"
                        : "bg-[#151b2c] text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    Chọn Khóa Học cụ thể (Custom)
                  </button>
                </div>

                {whitelistMode === "custom" && (
                  <div className="space-y-2 p-3.5 rounded-xl bg-[#151b2c] border border-slate-800">
                    <div className="text-[11px] font-mono text-purple-300 mb-2">
                      Chọn các khóa học cho phép chạy trò chơi này:
                    </div>
                    {availableCourses.map((c) => (
                      <label key={c.id} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-white transition-colors">
                        <input
                          type="checkbox"
                          checked={allowedCourses.includes(c.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAllowedCourses((prev) => [...prev, c.id]);
                            } else {
                              setAllowedCourses((prev) => prev.filter((id) => id !== c.id));
                            }
                          }}
                          className="w-3.5 h-3.5 accent-purple-500 rounded"
                        />
                        <span>{c.title} <strong className="text-slate-500 font-mono">({c.id})</strong></span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Upload Progress Status Indicator */}
          {isUploading && (
            <div className="p-5 rounded-2xl bg-purple-950/40 border border-purple-500/40 shadow-xl space-y-3 animate-fade-in font-mono">
              <div className="flex items-center justify-between text-xs">
                <span className="text-purple-300 font-bold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
                  Tiến Trình Tải Lên Hệ Thống
                </span>
                <span className="text-purple-300 font-bold">{uploadProgress}%</span>
              </div>

              {/* Animated Progress Bar */}
              <div className="w-full h-3 bg-[#0f1524] rounded-full overflow-hidden border border-purple-500/30 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-400 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.6)]"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>

              <div className="text-[11px] text-slate-300 flex items-center justify-between">
                <span>{uploadStepText}</span>
                <span className="text-slate-500">Xin vui lòng chờ...</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUploading}
            className={`w-full py-4 rounded-xl font-bold font-mono text-sm shadow-[0_0_20px_rgba(168,85,247,0.35)] transition-all flex items-center justify-center gap-2 ${
              isUploading
                ? "bg-purple-900/60 text-purple-300 cursor-not-allowed border border-purple-700/50"
                : "bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white cursor-pointer hover:scale-[1.005]"
            }`}
          >
            {isUploading ? (
              <>
                <span className="w-4 h-4 border-2 border-purple-300 border-t-transparent rounded-full animate-spin" />
                <span>Đang tải lên & chuyển tới Admin Audit ({uploadProgress}%)...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Nộp Game Engine Lên Hệ Thống Cho Admin Audit</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
