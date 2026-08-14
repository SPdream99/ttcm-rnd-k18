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
  Play,
  Inbox,
  Sparkles,
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function TeacherMyContentsPage() {
  const { currentUser, profile } = useAuthAdapter();
  const teacherUid = currentUser?.uid || currentUser?.id || profile?.uid || profile?.id || "";
  const teacherEmail = currentUser?.email || profile?.email || "";

  const [activeTab, setActiveTab] = useState<"courses" | "paths" | "games">("courses");
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [courses, setCourses] = useState<any[]>([]);
  const [paths, setPaths] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);

  // Kiểm tra quyền sở hữu nội dung
  const isOwner = (item: any) => {
    if (!teacherUid && !teacherEmail) return false;
    const author =
      item.authorId ||
      item.author_id ||
      item.instructorId ||
      item.instructor_id ||
      item.uploaderId ||
      item.uploader_id;
    const authorEmail = item.authorEmail || item.email || item.uploaderEmail;

    return (
      (teacherUid && author === teacherUid) ||
      (teacherEmail && authorEmail === teacherEmail) ||
      (!author && !authorEmail && item.isLocalOwner)
    );
  };

  // Load CHỈ nội dung của giáo viên hiện tại từ Firestore & LocalStorage
  const loadOwnContent = async () => {
    if (!teacherUid && !teacherEmail) {
      setCourses([]);
      setPaths([]);
      setGames([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // 1. Courses của chính giáo viên này
      let myCourses: any[] = [];
      try {
        const cSnap = await getDocs(collection(db, "courses"));
        if (!cSnap.empty) {
          cSnap.docs.forEach((d) => {
            const data = d.data();
            const docAuthor =
              data.authorId ||
              data.author_id ||
              data.instructorId ||
              data.instructor_id;
            const docEmail = data.authorEmail || data.email;

            if (
              (teacherUid && docAuthor === teacherUid) ||
              (teacherEmail && docEmail === teacherEmail)
            ) {
              const pairs = Array.isArray(data.contentData)
                ? data.contentData
                : data.contentData?.pairs || data.content_data?.pairs || [];

              myCourses.push({
                id: d.id,
                title: data.title || "Khóa học",
                description: data.description || "",
                pairsCount: pairs.length,
                resourcesCount: data.resources?.length || 0,
                authorId: docAuthor,
                isAccepted: Boolean(data.isAccepted ?? data.is_accepted),
                createdAt: data.createdAt
                  ? new Date(data.createdAt).toLocaleDateString("vi-VN")
                  : "Hôm nay",
              });
            }
          });
        }
      } catch (err) {
        console.warn("Lỗi tải courses của giáo viên:", err);
      }

      // Merge local courses của chính giáo viên
      try {
        if (typeof window !== "undefined") {
          const localCourses = JSON.parse(
            localStorage.getItem("eve_uploaded_courses") || "[]"
          );
          localCourses.forEach((lc: any) => {
            const lcAuthor =
              lc.authorId || lc.author_id || lc.instructorId || lc.instructor_id;
            if (
              (!lcAuthor || lcAuthor === teacherUid) &&
              !myCourses.some((c) => c.id === lc.id || c.title === lc.title)
            ) {
              myCourses.push({
                id: lc.id,
                title: lc.title || "Khóa học mới",
                description: lc.description || "",
                pairsCount: Array.isArray(lc.pairs)
                  ? lc.pairs.length
                  : lc.contentData?.pairs?.length || 0,
                resourcesCount: lc.resources?.length || 0,
                authorId: lcAuthor || teacherUid,
                isAccepted: Boolean(lc.isAccepted ?? lc.is_accepted),
                createdAt: lc.createdAt
                  ? new Date(lc.createdAt).toLocaleDateString("vi-VN")
                  : "Hôm nay",
              });
            }
          });
        }
      } catch {}

      setCourses(myCourses);

      // 2. Learning Paths của chính giáo viên này
      let myPaths: any[] = [];
      try {
        let pSnap = await getDocs(collection(db, "learning_path"));
        if (pSnap.empty) {
          pSnap = await getDocs(collection(db, "learning_paths"));
        }

        if (!pSnap.empty) {
          pSnap.docs.forEach((d) => {
            const data = d.data();
            const docAuthor = data.authorId || data.author_id;
            if (teacherUid && docAuthor === teacherUid) {
              myPaths.push({
                id: d.id,
                title: data.title || "Lộ trình học tập",
                description: data.description || "",
                coursesCount: Array.isArray(data.courses) ? data.courses.length : 0,
                authorId: docAuthor,
                isAccepted: Boolean(data.isAccepted ?? data.is_accepted),
                createdAt: data.createdAt
                  ? new Date(data.createdAt).toLocaleDateString("vi-VN")
                  : "Hôm nay",
              });
            }
          });
        }
      } catch (err) {
        console.warn("Lỗi tải learning paths của giáo viên:", err);
      }

      setPaths(myPaths);

      // 3. Games của chính giáo viên này
      let myGames: any[] = [];
      try {
        const gSnap = await getDocs(collection(db, "game_info"));
        if (!gSnap.empty) {
          gSnap.docs.forEach((d) => {
            const data = d.data();
            const docAuthor =
              data.authorId ||
              data.author_id ||
              data.uploaderId ||
              data.uploader_id;
            const docEmail = data.authorEmail || data.uploaderEmail;

            if (
              (teacherUid && docAuthor === teacherUid) ||
              (teacherEmail && docEmail === teacherEmail)
            ) {
              myGames.push({
                id: d.id,
                gameId: data.gameId || d.id,
                title: data.title || "Game Quiz",
                description: data.description || "Trò chơi học tập tương tác.",
                needExtraData: Boolean(data.needExtraData ?? data.need_extra_data),
                playsCount: Number(data.playsCount ?? data.plays_count ?? 0),
                authorId: docAuthor,
                authorName:
                  data.authorName ||
                  (Array.isArray(data.authors) ? data.authors.join(", ") : "Tôi"),
                isAccepted: Boolean(data.isAccepted ?? data.is_accepted),
                downloadSourceUrl:
                  data.downloadSourceUrl || data.download_source_url || "",
                createdAt: data.createdAt
                  ? new Date(data.createdAt).toLocaleDateString("vi-VN")
                  : "Hôm nay",
              });
            }
          });
        }
      } catch (err) {
        console.warn("Lỗi tải games của giáo viên:", err);
      }

      // Merge local games của chính giáo viên
      try {
        if (typeof window !== "undefined") {
          const localGames = JSON.parse(
            localStorage.getItem("eve_uploaded_games") || "[]"
          );
          localGames.forEach((lg: any) => {
            const lgAuthor =
              lg.authorId || lg.author_id || lg.uploaderId || lg.uploader_id;
            if (!lgAuthor || lgAuthor === teacherUid) {
              const existingIdx = myGames.findIndex(
                (g) => g.id === lg.id || g.title === lg.title
              );
              const formatted = {
                id: lg.id || lg.gameId,
                gameId: lg.gameId || lg.id,
                title: lg.title || "Game Mới Tải Lên",
                description:
                  lg.description ||
                  "Trò chơi tương tác học tập tích hợp E-V-E Game SDK.",
                needExtraData: Boolean(lg.needExtraData ?? lg.need_extra_data),
                playsCount: Number(lg.playsCount ?? lg.plays_count ?? 0),
                authorId: lgAuthor || teacherUid,
                authorName: lg.authorName || "Tôi",
                isAccepted: Boolean(lg.isAccepted ?? lg.is_accepted),
                downloadSourceUrl:
                  lg.downloadSourceUrl || lg.download_source_url || "",
                createdAt: lg.createdAt
                  ? new Date(lg.createdAt).toLocaleDateString("vi-VN")
                  : "Vừa tải lên",
              };

              if (existingIdx === -1) {
                myGames.unshift(formatted);
              } else {
                myGames[existingIdx] = { ...myGames[existingIdx], ...formatted };
              }
            }
          });
        }
      } catch {}

      setGames(myGames);
    } catch (e) {
      console.warn("loadOwnContent warning:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOwnContent();

    if (typeof window !== "undefined") {
      window.addEventListener("eve_games_updated", loadOwnContent);
      window.addEventListener("storage", loadOwnContent);
      return () => {
        window.removeEventListener("eve_games_updated", loadOwnContent);
        window.removeEventListener("storage", loadOwnContent);
      };
    }
  }, [teacherUid, teacherEmail]);

  // Xóa nội dung
  const handleDeleteItem = async (
    type: "course" | "path" | "game",
    id: string,
    authorId: string
  ) => {
    if (!confirm("Bạn có chắc chắn muốn xóa nội dung này của mình không?"))
      return;

    try {
      const collectionName =
        type === "course"
          ? "courses"
          : type === "path"
          ? "learning_path"
          : "game_info";
      await deleteDoc(doc(db, collectionName, id));
    } catch {}

    // Clean LocalStorage
    try {
      if (typeof window !== "undefined") {
        if (type === "game") {
          const local = JSON.parse(
            localStorage.getItem("eve_uploaded_games") || "[]"
          );
          const filtered = local.filter(
            (g: any) => g.id !== id && g.gameId !== id
          );
          localStorage.setItem("eve_uploaded_games", JSON.stringify(filtered));
          window.dispatchEvent(new Event("eve_games_updated"));
        } else if (type === "course") {
          const local = JSON.parse(
            localStorage.getItem("eve_uploaded_courses") || "[]"
          );
          const filtered = local.filter((c: any) => c.id !== id);
          localStorage.setItem(
            "eve_uploaded_courses",
            JSON.stringify(filtered)
          );
        }
      }
    } catch {}

    if (type === "course")
      setCourses((prev) => prev.filter((c) => c.id !== id));
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
            Chỉ hiển thị các Bài học, Lộ trình và Game do chính Thầy/Cô tạo ra và quản lý.
          </p>
        </div>

        <Link href="/teacher/upload-center">
          <button className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer flex items-center gap-2">
            <PlusCircle className="w-4 h-4" /> Tải Lên Thêm Mới
          </button>
        </Link>
      </div>

      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
          {actionNotice}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab("courses")}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border whitespace-nowrap ${
            activeTab === "courses"
              ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
              : "bg-transparent text-slate-400 border-transparent hover:text-white"
          }`}
        >
          <BookOpen className="w-4 h-4" /> Bài Học Của Tôi ({courses.length})
        </button>

        <button
          onClick={() => setActiveTab("paths")}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border whitespace-nowrap ${
            activeTab === "paths"
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              : "bg-transparent text-slate-400 border-transparent hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4" /> Lộ Trình Của Tôi ({paths.length})
        </button>

        <button
          onClick={() => setActiveTab("games")}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border whitespace-nowrap ${
            activeTab === "games"
              ? "bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
              : "bg-transparent text-slate-400 border-transparent hover:text-white"
          }`}
        >
          <Gamepad2 className="w-4 h-4" /> Game Engine Của Tôi ({games.length})
        </button>
      </div>

      {/* ── TAB 1: COURSES ── */}
      {activeTab === "courses" && (
        <>
          {courses.length === 0 && !loading ? (
            <div className="p-12 rounded-3xl bg-[#0f1524]/60 border border-dashed border-slate-800 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mx-auto">
                <Inbox className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Thầy/Cô chưa có Bài Học / Khóa Học nào</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Hãy soạn bài học đầu tiên với các cặp câu hỏi JSON trắc nghiệm để học sinh có thể thực hành qua các trò chơi tương tác.
                </p>
              </div>
              <Link href="/teacher/upload-center">
                <button className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all inline-flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <PlusCircle className="w-4 h-4" /> Soạn Bài Học Mới
                </button>
              </Link>
            </div>
          ) : (
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
                        {course.isAccepted ? (
                          <CheckCircle className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        {course.isAccepted ? "Đã Phê Duyệt" : "Chờ Admin Duyệt"}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {course.createdAt}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">{course.title}</h3>
                    <p className="text-xs text-[#8e9bb4] line-clamp-2">
                      {course.description || "Không có mô tả chi tiết."}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="text-cyan-300 font-bold">
                      {course.pairsCount} Cặp Câu Hỏi Trắc Nghiệm
                    </span>

                    <button
                      onClick={() =>
                        handleDeleteItem("course", course.id, course.authorId)
                      }
                      className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer p-1 rounded hover:bg-rose-500/10"
                    >
                      <Trash2 className="w-4 h-4" /> Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── TAB 2: PATHS ── */}
      {activeTab === "paths" && (
        <>
          {paths.length === 0 && !loading ? (
            <div className="p-12 rounded-3xl bg-[#0f1524]/60 border border-dashed border-slate-800 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <Layers className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Thầy/Cô chưa tạo Lộ Trình nào</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Hãy kết hợp các bài học đã tạo thành một lộ trình học tập toàn diện cho học sinh.
                </p>
              </div>
              <Link href="/teacher/upload-center">
                <button className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all inline-flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <PlusCircle className="w-4 h-4" /> Tạo Lộ Trình Mới
                </button>
              </Link>
            </div>
          ) : (
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
                        {path.isAccepted ? (
                          <CheckCircle className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        {path.isAccepted ? "Đã Phê Duyệt" : "Chờ Admin Duyệt"}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {path.createdAt}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">{path.title}</h3>
                    <p className="text-xs text-[#8e9bb4] line-clamp-2">
                      {path.description || "Không có mô tả chi tiết."}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="text-emerald-300 font-bold">
                      {path.coursesCount} Khóa Học Trong Lộ Trình
                    </span>

                    <button
                      onClick={() =>
                        handleDeleteItem("path", path.id, path.authorId)
                      }
                      className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer p-1 rounded hover:bg-rose-500/10"
                    >
                      <Trash2 className="w-4 h-4" /> Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── TAB 3: GAMES ── */}
      {activeTab === "games" && (
        <>
          {games.length === 0 && !loading ? (
            <div className="p-12 rounded-3xl bg-[#0f1524]/60 border border-dashed border-slate-800 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mx-auto">
                <Gamepad2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Thầy/Cô chưa tải lên Game nào</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Tải lên gói game nén (.zip) theo chuẩn E-V-E SDK để tích hợp đề bài và bảng xếp hạng trực tiếp.
                </p>
              </div>
              <Link href="/teacher/upload-center">
                <button className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all inline-flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                  <PlusCircle className="w-4 h-4" /> Tải Lên Game (.zip)
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {games.map((game, idx) => (
                <div
                  key={`${game.id || game.gameId || idx}_${idx}`}
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
                        {game.isAccepted ? (
                          <CheckCircle className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        {game.isAccepted ? "ĐÃ PHÊ DUYỆT ✅" : "CHỜ ADMIN DUYỆT ⏳"}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {game.createdAt}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">{game.title}</h3>
                    <p className="text-xs text-[#8e9bb4] line-clamp-2">
                      {game.description}
                    </p>
                    <div className="text-[11px] font-mono text-purple-300/80">
                      Tác giả: {game.authorName || "Tôi"} •{" "}
                      {game.needExtraData
                        ? "🧩 Yêu cầu Extra Data"
                        : "⚡ Standalone Engine"}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="text-purple-300 font-bold">
                      {game.playsCount} Lượt Học Sinh Chơi
                    </span>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/student/play/${game.id}/${courses[0]?.id || "crs_coding_basics"}`}
                      >
                        <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-[11px] border border-purple-500/30 cursor-pointer transition-all flex items-center gap-1">
                          <Play className="w-3 h-3" /> Chơi thử
                        </span>
                      </Link>

                      <button
                        onClick={() =>
                          handleDeleteItem("game", game.id, game.authorId)
                        }
                        className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer p-1 rounded hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-4 h-4" /> Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
