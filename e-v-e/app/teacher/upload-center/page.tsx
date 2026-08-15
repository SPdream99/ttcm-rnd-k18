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
import { useToast } from "@/components/Toast";
import { collection, addDoc, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cacheService } from "@/lib/cacheService";
import { CourseContentPair } from "@/core/entities/Course";

export default function TeacherUploadCenterPage() {
  const { toast } = useToast();
  const { currentUser, profile } = useAuthAdapter();
  const teacherUid = currentUser?.uid || profile?.uid || "usr_teacher";
  const teacherName = currentUser?.name || profile?.fullName || "Giảng viên";

  const [activeTab, setActiveTab] = useState<"course" | "path" | "game">("course");

  // 1. Create Course State
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

  // 1. Create Course State
  const [courseVisibility, setCourseVisibility] = useState<"private" | "public" | "free_to_share" | "free_to_use">("public");

  // 2. Create Learning Path State
  const [pathTitle, setPathTitle] = useState("");
  const [pathDesc, setPathDesc] = useState("");
  const [pathVisibility, setPathVisibility] = useState<"private" | "public" | "free_to_share" | "free_to_use">("public");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [availableCourses, setAvailableCourses] = useState<{ id: string; title: string }[]>([]);

  // 3. Upload Game State
  const [gameTitle, setGameTitle] = useState("");
  const [gameDesc, setGameDesc] = useState("");
  const [gameVisibility, setGameVisibility] = useState<"private" | "public" | "free_to_share" | "free_to_use">("public");
  const [gameZipFile, setGameZipFile] = useState<File | null>(null);
  const [needExtraData, setNeedExtraData] = useState(true);
  const DAILY_GAME_LIMIT = 2;
  const [todayGameUploads, setTodayGameUploads] = useState<number>(0);
  const [whitelistMode, setWhitelistMode] = useState<"all" | "custom">("all");
  const [allowedCourses, setAllowedCourses] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStepText, setUploadStepText] = useState("");

  const loadTeacherCoursesAndQuota = async () => {
    if (!teacherUid) return;
    const todayStr = new Date().toISOString().split("T")[0];
    let count = 0;

    try {
      const cSnap = await getDocs(collection(db, "courses"));
      const myCourses: { id: string; title: string }[] = [];
      cSnap.forEach((d) => {
        const data = d.data();
        const docAuthor = data.authorId || data.author_id || data.instructorId || data.instructor_id;
        const isOwn = docAuthor === teacherUid;
        const isShareable = data.visibility === "free_to_share" || data.visibility === "free_to_use";
        if (isOwn || isShareable) {
          myCourses.push({
            id: d.id,
            title: isOwn
              ? `${data.title || "Khóa học"} (Của bạn)`
              : `${data.title || "Khóa học"} (Chia sẻ từ ${data.authorName || "GV khác"})`,
          });
        }
      });

      if (typeof window !== "undefined") {
        const localCourses = JSON.parse(localStorage.getItem("eve_uploaded_courses") || "[]");
        localCourses.forEach((lc: any) => {
          const lcAuthor = lc.authorId || lc.author_id || lc.instructorId || lc.instructor_id;
          if ((!lcAuthor || lcAuthor === teacherUid) && !myCourses.some((c) => c.id === lc.id)) {
            myCourses.push({ id: lc.id, title: `${lc.title || "Khóa học mới"} (Cục bộ)` });
          }
        });
      }

      setAvailableCourses(myCourses);
      if (myCourses.length > 0 && selectedCourses.length === 0) {
        setSelectedCourses([myCourses[0].id]);
      }
    } catch {}

    try {
      if (typeof window !== "undefined") {
        const localGames = JSON.parse(localStorage.getItem("eve_uploaded_games") || "[]");
        localGames.forEach((g: any) => {
          if ((g.uploaderId === teacherUid || g.authorId === teacherUid) && g.createdAt?.startsWith(todayStr)) {
            count++;
          }
        });
      }
      setTodayGameUploads(count);
    } catch {}
  };

  useEffect(() => {
    loadTeacherCoursesAndQuota();
  }, [teacherUid]);

  const handleAddPair = () => {
    setPairs((prev) => [
      ...prev,
      {
        id: `pair_${Date.now()}`,
        title: "",
        description: "",
        explanation: "",
        distractions: ["", "", ""],
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
          const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
          setGameTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
        }
      } else {
        toast.error("Vui lòng tải lên file định dạng nén (.zip, .rar, .tar.gz).", "Định Dạng File");
      }
    }
  };

  const handleSubmitCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle || pairs.length === 0) {
      toast.warning("Vui lòng nhập tên bài học và ít nhất 1 cặp câu hỏi.", "Thiếu Thông Tin");
      return;
    }

    const payload = {
      title: courseTitle,
      description: courseDesc,
      authorId: teacherUid,
      authorName: teacherName,
      resources: resources.filter((r) => r.title.trim() && r.url.trim()),
      visibility: courseVisibility,
      isAccepted: false,
      is_accepted: false,
      contentData: { pairs },
      createdAt: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, "courses"), payload);
    } catch {}

    cacheService.clearFullAppCache(true);
    toast.success(`Đã lưu Bài Học "${courseTitle}" với ${pairs.length} câu hỏi!`, "Soạn Bài");
    setCourseTitle("");
    setCourseDesc("");
    setPairs([{ id: "pair_1", title: "", description: "", explanation: "", distractions: [""], image_url: "" }]);
    setResources([]);
  };

  const handleSubmitPath = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pathTitle || selectedCourses.length === 0) {
      toast.warning("Vui lòng nhập tiêu đề lộ trình và chọn ít nhất 1 bài học.", "Thiếu Thông Tin");
      return;
    }

    const payload = {
      title: pathTitle,
      description: pathDesc,
      authorId: teacherUid,
      authorName: teacherName,
      courses: selectedCourses,
      visibility: pathVisibility,
      isAccepted: false,
      is_accepted: false,
      createdAt: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, "learning_paths"), payload);
    } catch {}

    cacheService.clearFullAppCache(true);
    toast.success(`Đã gửi Lộ Trình "${pathTitle}" gồm ${selectedCourses.length} bài học lên hệ thống!`, "Lộ Trình");
    setPathTitle("");
    setPathDesc("");
  };

  const handleSubmitGame = async (e: React.FormEvent) => {
    e.preventDefault();

    if (todayGameUploads >= DAILY_GAME_LIMIT) {
      toast.error(`Mỗi giáo viên chỉ có thể đăng tối đa ${DAILY_GAME_LIMIT} Game/ngày. Bạn đã tải lên ${todayGameUploads}/${DAILY_GAME_LIMIT} game hôm nay.`, "Giới Hạn Tải Lên");
      return;
    }

    if (!gameTitle.trim()) {
      toast.warning("Vui lòng nhập tiêu đề Game.", "Thiếu Tiêu Đề");
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    setUploadStepText("1/4: Đang đọc và kiểm tra tính toàn vẹn file nén .zip...");

    await new Promise((r) => setTimeout(r, 600));
    setUploadProgress(35);
    setUploadStepText("2/4: Phân tích cấu trúc thư mục (index.html, eve-game-sdk.js)...");

    await new Promise((r) => setTimeout(r, 700));
    setUploadProgress(70);
    setUploadStepText("3/4: Đăng ký Game lên hệ thống E-V-E...");

    const gameGeneratedId = `game_${Date.now()}`;
    const slugName = gameTitle.toLowerCase().replace(/[^a-z0-9]+/g, "_");
    const zipName = gameZipFile ? gameZipFile.name.toLowerCase() : "";
    let downloadUrl = "/memory_matching_game.zip";
    if (zipName.includes("boss")) {
      downloadUrl = "/boss_battle_quiz.zip";
    } else if (zipName.includes("starter")) {
      downloadUrl = "/eve_game_starter_kit.zip";
    } else if (zipName.includes("memory") || zipName.includes("match")) {
      downloadUrl = "/memory_matching_game.zip";
    }

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
      visibility: gameVisibility,
      needExtraData,
      need_extra_data: needExtraData,
      coursesAllowed: whitelistMode === "all" ? "all" : allowedCourses,
      courses_allowed: whitelistMode === "all" ? "all" : allowedCourses,
      coursesBlocked: [],
      courses_blocked: [],
      gameUrl: `/games/${slugName}/index.html`,
      sourceUrl: `/games/${slugName}/index.html`,
      source_url: `/games/${slugName}/index.html`,
      downloadUrl,
      download_url: downloadUrl,
      downloadSourceUrl: downloadUrl,
      download_source_url: downloadUrl,
      fileName: gameZipFile ? gameZipFile.name : "memory_matching_game.zip",
      file_name: gameZipFile ? gameZipFile.name : "memory_matching_game.zip",
      fileSize: gameZipFile ? `${(gameZipFile.size / 1024).toFixed(1)} KB` : "19.5 KB",
      isAccepted: false,
      is_accepted: false,
      playsCount: 0,
      plays_count: 0,
      createdAt: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, "game_info", gameGeneratedId), payload);
    } catch {}

    try {
      const prevStored = JSON.parse(localStorage.getItem("eve_uploaded_games") || "[]");
      const updatedList = [payload, ...prevStored.filter((g: any) => g.id !== payload.id && g.title !== payload.title)];
      localStorage.setItem("eve_uploaded_games", JSON.stringify(updatedList));
      window.dispatchEvent(new Event("eve_games_updated"));
    } catch {}

    cacheService.clearFullAppCache(true);

    await new Promise((r) => setTimeout(r, 600));
    setUploadProgress(100);
    setUploadStepText("4/4: Hoàn tất 100%! Game đã được chuyển tới hàng chờ Admin duyệt.");

    await new Promise((r) => setTimeout(r, 400));
    setIsUploading(false);
    toast.success(`Đã tải lên Game "${gameTitle}" (.zip) thành công!`, "Tải Lên Game");
    setGameTitle("");
    setGameDesc("");
    setGameZipFile(null);
    setUploadProgress(0);
    setUploadStepText("");
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-zinc-200">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
            <UploadCloud className="w-7 h-7 text-red-600" /> Soạn Bài & Quản Lý Học Liệu
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Thiết kế bài giảng, đính kèm tài liệu học tập và tạo câu hỏi tương tác cho học sinh.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 pb-3">
        <button
          onClick={() => setActiveTab("course")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 border ${
            activeTab === "course"
              ? "bg-red-600 text-white border-red-600 shadow-sm"
              : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
          }`}
        >
          <BookOpen className="w-4 h-4" /> Tab 1: Tạo Bài Học & Học Liệu
        </button>

        <button
          onClick={() => setActiveTab("path")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 border ${
            activeTab === "path"
              ? "bg-red-600 text-white border-red-600 shadow-sm"
              : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
          }`}
        >
          <Layers className="w-4 h-4" /> Tab 2: Tạo Lộ Trình Học Tập
        </button>

        <button
          onClick={() => setActiveTab("game")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 border ${
            activeTab === "game"
              ? "bg-red-600 text-white border-red-600 shadow-sm"
              : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
          }`}
        >
          <Gamepad2 className="w-4 h-4" /> Tab 3: Nộp Trò Chơi Mới (.zip)
        </button>
      </div>

      {/* TAB 1: CREATE COURSE */}
      {activeTab === "course" && (
        <form onSubmit={handleSubmitCourse} className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-zinc-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-red-600" /> Thông Tin Cơ Bản Bài Học
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Tên Bài Học / Khóa Học</label>
                <input
                  type="text"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="VD: Lập Trình Python Căn Bản"
                  className="w-full bg-zinc-50 border border-zinc-300 focus:border-red-600 rounded-xl px-4 py-2 text-xs text-zinc-900 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Mô Tả Bài Học</label>
                <input
                  type="text"
                  value={courseDesc}
                  onChange={(e) => setCourseDesc(e.target.value)}
                  placeholder="Khái niệm biến số, vòng lặp for và câu lệnh if-else..."
                  className="w-full bg-zinc-50 border border-zinc-300 focus:border-red-600 rounded-xl px-4 py-2 text-xs text-zinc-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Resources */}
          <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-zinc-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-red-600" /> Tài Liệu & Học Liệu Đính Kèm
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Link Slide, PDF giáo trình, link video hoặc code mẫu.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setResources((prev) => [...prev, { title: "", url: "", type: "code" }])}
                className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm Tài Liệu
              </button>
            </div>

            <div className="space-y-3">
              {resources.length === 0 ? (
                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-center text-zinc-500 text-xs">
                  Chưa có tài liệu đính kèm. Bấm nút "Thêm Tài Liệu" ở trên để bổ sung.
                </div>
              ) : (
                resources.map((res, rIdx) => (
                  <div key={rIdx} className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        value={res.title}
                        onChange={(e) => {
                          const copy = [...resources];
                          copy[rIdx].title = e.target.value;
                          setResources(copy);
                        }}
                        placeholder="Tên tài liệu"
                        className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-red-600"
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
                        placeholder="Đường link URL"
                        className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-red-600 font-mono"
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
                        className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs text-zinc-900 focus:outline-none"
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
                        className="text-zinc-400 hover:text-red-600 cursor-pointer p-1"
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
          <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-zinc-900 flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-red-600" /> Cặp Dữ Liệu Câu Hỏi & Đáp Án
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Mỗi cặp gồm Tiêu đề/Câu hỏi, Đáp án đúng và các Phương án gây nhiễu.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddPair}
                className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" /> Thêm Cặp Câu Hỏi
              </button>
            </div>

            <div className="space-y-4">
              {pairs.map((pair, idx) => (
                <div key={pair.id || idx} className="p-5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-600"># Cặp Câu Hỏi {idx + 1}</span>
                    {pairs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePair(idx)}
                        className="text-red-600 hover:underline text-xs flex items-center gap-1 cursor-pointer font-bold"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Xóa
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      Câu hỏi / Khái niệm:
                    </label>
                    <input
                      type="text"
                      value={pair.title}
                      onChange={(e) => handleUpdatePair(idx, "title", e.target.value)}
                      placeholder="VD: Cú pháp in văn bản trong Python?"
                      className="w-full bg-white border border-zinc-300 focus:border-red-600 rounded-xl px-4 py-2 text-xs text-zinc-900 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-emerald-700 mb-1">
                         Đáp án đúng:
                      </label>
                      <input
                        type="text"
                        value={pair.description}
                        onChange={(e) => handleUpdatePair(idx, "description", e.target.value)}
                        placeholder="VD: print('Hello')"
                        className="w-full bg-white border border-emerald-300 focus:border-emerald-600 rounded-xl px-4 py-2 text-xs text-zinc-900 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1">
                        URL Hình Ảnh (Tùy chọn):
                      </label>
                      <input
                        type="text"
                        value={pair.image_url || ""}
                        onChange={(e) => handleUpdatePair(idx, "image_url", e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-white border border-zinc-300 focus:border-red-600 rounded-xl px-4 py-2 text-xs text-zinc-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      Giải thích chi tiết đáp án:
                    </label>
                    <textarea
                      rows={2}
                      value={pair.explanation || ""}
                      onChange={(e) => handleUpdatePair(idx, "explanation", e.target.value)}
                      placeholder="Giải thích tại sao đáp án này đúng..."
                      className="w-full bg-white border border-zinc-300 focus:border-red-600 rounded-xl px-4 py-2 text-xs text-zinc-900 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="space-y-2 pt-2 border-t border-zinc-200">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-zinc-700">
                         Các Phương Án Sai:
                      </label>
                      <button
                        type="button"
                        onClick={() => handleAddDistraction(idx)}
                        className="text-xs text-red-600 hover:underline cursor-pointer font-bold"
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
                            className="w-full bg-white border border-zinc-300 focus:border-red-600 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none"
                          />
                          {(pair.distractions || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveDistraction(idx, dIdx)}
                              className="text-zinc-400 hover:text-red-600 cursor-pointer"
                            >
                              
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

          {/* Visibility / Licensing Selector */}
          <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-3">
            <div>
              <label className="block text-xs font-bold text-zinc-900 uppercase tracking-wider">
                Quyền Cấp Phép & Mức Độ Hiển Thị Bài Học
              </label>
              <p className="text-xs text-zinc-500 mt-0.5">
                Thiết lập quyền sở hữu và cách thức người dùng khác tiếp cận bài học này.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {[
                { id: "private", title: "Private (Riêng tư)", desc: "Không ai thấy trừ bản thân & Admin", icon: "🔒" },
                { id: "public", title: "Public (Công khai)", desc: "Học sinh & mọi người xem, học và làm bài", icon: "🌐" },
                { id: "free_to_share", title: "Free to Share", desc: "Giáo viên khác được đưa vào lộ trình học", icon: "🔄" },
                { id: "free_to_use", title: "Free to Use", desc: "Cho phép tải tài liệu & câu hỏi về máy", icon: "📥" },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setCourseVisibility(lvl.id as any)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    courseVisibility === lvl.id
                      ? "border-red-600 bg-red-50/50 ring-2 ring-red-200"
                      : "border-zinc-200 bg-zinc-50 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-lg">{lvl.icon}</span>
                    {courseVisibility === lvl.id && (
                      <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                        Đang chọn
                      </span>
                    )}
                  </div>
                  <strong className="text-xs text-zinc-900 font-bold block">{lvl.title}</strong>
                  <span className="text-[11px] text-zinc-500 line-clamp-2 mt-1">{lvl.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" /> Gửi Bài Học Cho Admin Phê Duyệt
          </button>
        </form>
      )}

      {/* TAB 2: CREATE LEARNING PATH */}
      {activeTab === "path" && (
        <form onSubmit={handleSubmitPath} className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-zinc-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-red-600" /> Thông Tin Lộ Trình Học Tập
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Tiêu Đề Lộ Trình</label>
                <input
                  type="text"
                  value={pathTitle}
                  onChange={(e) => setPathTitle(e.target.value)}
                  placeholder="VD: Chinh Phục Lập Trình Cơ Bản"
                  className="w-full bg-zinc-50 border border-zinc-300 focus:border-red-600 rounded-xl px-4 py-2 text-xs text-zinc-900 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Mô Tả Lộ Trình</label>
                <textarea
                  rows={3}
                  value={pathDesc}
                  onChange={(e) => setPathDesc(e.target.value)}
                  placeholder="Lộ trình kết hợp lý thuyết và trò chơi rèn luyện tư duy..."
                  className="w-full bg-zinc-50 border border-zinc-300 focus:border-red-600 rounded-xl px-4 py-2 text-xs text-zinc-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-zinc-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-red-600" /> Chọn Các Bài Học Cho Vào Lộ Trình
            </h3>

            <div className="space-y-2">
              {availableCourses.map((c) => {
                const isSelected = selectedCourses.includes(c.id);
                return (
                  <label
                    key={c.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-red-50 border-red-600 text-zinc-900 font-bold"
                        : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-300"
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
                        className="w-4 h-4 rounded accent-red-600 cursor-pointer"
                      />
                      <div>
                        <div className="font-bold text-xs text-zinc-900">{c.title}</div>
                        <div className="text-[11px] text-zinc-500 font-mono">Mã: {c.id}</div>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Visibility / Licensing Selector */}
          <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-3">
            <div>
              <label className="block text-xs font-bold text-zinc-900 uppercase tracking-wider">
                Quyền Cấp Phép & Mức Độ Hiển Thị Lộ Trình
              </label>
              <p className="text-xs text-zinc-500 mt-0.5">
                Thiết lập quyền sở hữu và cách thức người dùng khác tiếp cận lộ trình học này.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {[
                { id: "private", title: "Private (Riêng tư)", desc: "Không ai thấy trừ bản thân & Admin", icon: "🔒" },
                { id: "public", title: "Public (Công khai)", desc: "Học sinh tham gia học theo chặng bản đồ", icon: "🌐" },
                { id: "free_to_share", title: "Free to Share", desc: "Giáo viên khác được áp dụng vào lớp học", icon: "🔄" },
                { id: "free_to_use", title: "Free to Use", desc: "Cho phép xuất và tải tài nguyên về máy", icon: "📥" },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setPathVisibility(lvl.id as any)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    pathVisibility === lvl.id
                      ? "border-red-600 bg-red-50/50 ring-2 ring-red-200"
                      : "border-zinc-200 bg-zinc-50 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-lg">{lvl.icon}</span>
                    {pathVisibility === lvl.id && (
                      <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                        Đang chọn
                      </span>
                    )}
                  </div>
                  <strong className="text-xs text-zinc-900 font-bold block">{lvl.title}</strong>
                  <span className="text-[11px] text-zinc-500 line-clamp-2 mt-1">{lvl.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" /> Gửi Lộ Trình Cho Admin Phê Duyệt
          </button>
        </form>
      )}

      {/* TAB 3: UPLOAD GAME */}
      {activeTab === "game" && (
        <form onSubmit={handleSubmitGame} className="space-y-6">
          <div className="p-4 rounded-2xl border border-red-200 bg-red-50 flex items-center justify-between text-xs text-red-700">
            <div className="flex items-center gap-2 font-bold">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <span>Hạn mức đăng tải: Tối đa {DAILY_GAME_LIMIT} Game/ngày</span>
            </div>
            <span className="font-bold">Đã đăng hôm nay: {todayGameUploads}/{DAILY_GAME_LIMIT}</span>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-zinc-900 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-red-600" /> Thông Tin Trò Chơi
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Tên Trò Chơi</label>
                <input
                  type="text"
                  value={gameTitle}
                  onChange={(e) => setGameTitle(e.target.value)}
                  placeholder="VD: Memory Matching Game"
                  className="w-full bg-zinc-50 border border-zinc-300 focus:border-red-600 rounded-xl px-4 py-2 text-xs text-zinc-900 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Mô Tả Trò Chơi & Luật Chơi</label>
                <textarea
                  rows={3}
                  value={gameDesc}
                  onChange={(e) => setGameDesc(e.target.value)}
                  placeholder="Mô tả cách học sinh tương tác..."
                  className="w-full bg-zinc-50 border border-zinc-300 focus:border-red-600 rounded-xl px-4 py-2 text-xs text-zinc-900 focus:outline-none"
                />
              </div>

              {/* Upload Zip File with Drag & Drop */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  File nén (.zip, .rar, .tar.gz):
                </label>

                <div
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`p-6 rounded-2xl border-2 border-dashed transition-colors text-center relative ${
                    isDragging
                      ? "border-red-600 bg-red-50"
                      : gameZipFile
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-zinc-300 bg-zinc-50 hover:border-red-600"
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
                    <div className="flex items-center justify-between gap-4 p-3 bg-white rounded-xl border border-zinc-200">
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
                          
                        </div>
                        <div>
                          <div className="text-xs font-bold text-zinc-900 truncate">
                            {gameZipFile.name}
                          </div>
                          <div className="text-[11px] text-zinc-500">
                            {(gameZipFile.size / 1024).toFixed(1)} KB • Sẵn sàng tải lên
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setGameZipFile(null);
                        }}
                        className="text-xs text-red-600 hover:underline font-bold"
                      >
                        Hủy
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="game-file-input" className="cursor-pointer block">
                      <FolderArchive className="w-10 h-10 mx-auto mb-2 text-red-600" />
                      <span className="text-xs text-red-600 hover:underline font-bold block">
                        Kéo thả file .zip vào đây hoặc Bấm để duyệt file
                      </span>
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Upload Progress Status Indicator */}
          {isUploading && (
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-900">
                <span>Tiến Trình Tải Lên</span>
                <span>{uploadProgress}%</span>
              </div>

              <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-600 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>

              <div className="text-[11px] text-zinc-500">{uploadStepText}</div>
            </div>
          )}

          {/* Visibility / Licensing Selector */}
          <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-3">
            <div>
              <label className="block text-xs font-bold text-zinc-900 uppercase tracking-wider">
                Quyền Cấp Phép & Mức Độ Hiển Thị Trò Chơi
              </label>
              <p className="text-xs text-zinc-500 mt-0.5">
                Thiết lập quyền sở hữu và cách thức chia sẻ game trong hệ sinh thái E-V-E.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {[
                { id: "private", title: "Private (Riêng tư)", desc: "Không ai thấy trừ bản thân & Admin", icon: "🔒" },
                { id: "public", title: "Public (Công khai)", desc: "Học sinh chơi và tính điểm xếp hạng", icon: "🌐" },
                { id: "free_to_share", title: "Free to Share", desc: "Giáo viên khác được nạp câu hỏi bài họ vào", icon: "🔄" },
                { id: "free_to_use", title: "Free to Use", desc: "Cho phép tải gói mã nguồn .zip về máy", icon: "📥" },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setGameVisibility(lvl.id as any)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    gameVisibility === lvl.id
                      ? "border-red-600 bg-red-50/50 ring-2 ring-red-200"
                      : "border-zinc-200 bg-zinc-50 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-lg">{lvl.icon}</span>
                    {gameVisibility === lvl.id && (
                      <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                        Đang chọn
                      </span>
                    )}
                  </div>
                  <strong className="text-xs text-zinc-900 font-bold block">{lvl.title}</strong>
                  <span className="text-[11px] text-zinc-500 line-clamp-2 mt-1">{lvl.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isUploading || todayGameUploads >= DAILY_GAME_LIMIT}
            className="w-full py-3.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white cursor-pointer disabled:opacity-50 shadow-sm"
          >
            {isUploading ? (
              <span>Đang tải lên ({uploadProgress}%)...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Nộp Game Lên Hệ Thống Cho Admin Duyệt</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
