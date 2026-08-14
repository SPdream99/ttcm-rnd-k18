"use client";

import React, { useState, useEffect } from "react";
import {
  CheckSquare,
  BookOpen,
  Gamepad2,
  Download,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  Layers,
  Sparkles,
  HelpCircle,
  FileCode,
  ShieldCheck,
  CheckCircle2,
  X,
} from "lucide-react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Course, CourseContentPair } from "@/core/entities/Course";
import { Game } from "@/core/entities/Game";

interface ConfirmModalData {
  title: string;
  description: string;
  confirmText?: string;
  variant?: "emerald" | "rose" | "purple" | "cyan";
  onConfirm: () => void;
}

export default function AdminApprovalsPage() {
  const [activeTab, setActiveTab] = useState<"courses" | "games">("courses");
  const [courses, setCourses] = useState<Course[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  // ── Confirmation Prompt State ──
  const [confirmPrompt, setConfirmPrompt] = useState<ConfirmModalData | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const cSnap = await getDocs(collection(db, "courses"));
        if (!cSnap.empty) {
          const list: any[] = cSnap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
            isAccepted: d.data().isAccepted ?? d.data().is_accepted ?? false,
          }));
          setCourses(list);
        } else {
          setCourses([]);
        }
      } catch (e) {
        console.warn("Error loading courses:", e);
      }

      let combinedGames: any[] = [];
      try {
        const gSnap = await getDocs(collection(db, "game_info"));
        if (!gSnap.empty) {
          combinedGames = gSnap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
            isAccepted: d.data().isAccepted ?? d.data().is_accepted ?? false,
            needExtraData: d.data().needExtraData ?? d.data().need_extra_data ?? true,
            downloadSourceUrl: d.data().downloadSourceUrl ?? d.data().download_source_url ?? "/boss_battle_quiz.zip",
          }));
        }
      } catch (e) {
        console.warn("Firestore games fetch:", e);
      }

      // Read from LocalStorage persistent cache
      try {
        if (typeof window !== "undefined") {
          const localGames = JSON.parse(localStorage.getItem("eve_uploaded_games") || "[]");
          localGames.forEach((lg: any) => {
            const existingIdx = combinedGames.findIndex((g) => g.id === lg.id || g.title === lg.title);
            if (existingIdx === -1) {
              combinedGames.unshift({
                ...lg,
                isAccepted: lg.isAccepted ?? lg.is_accepted ?? false,
                needExtraData: lg.needExtraData ?? lg.need_extra_data ?? true,
                downloadSourceUrl: lg.downloadSourceUrl ?? lg.download_source_url ?? "/boss_battle_quiz.zip",
              });
            }
          });
        }
      } catch (e) {
        console.warn("LocalStorage games read:", e);
      }

      setGames(combinedGames);
    }

    loadData();

    if (typeof window !== "undefined") {
      window.addEventListener("eve_games_updated", loadData);
      window.addEventListener("storage", loadData);
      return () => {
        window.removeEventListener("eve_games_updated", loadData);
        window.removeEventListener("storage", loadData);
      };
    }
  }, []);

  // ── Prompt Handlers ──
  const handlePromptApproveCourse = (course: Course, approved: boolean) => {
    setConfirmPrompt({
      title: approved ? "Xác Nhận Phê Duyệt Khóa Học" : "Xác Nhận Từ Chối / Hủy Duyệt",
      description: approved
        ? `Bạn có chắc muốn PHÊ DUYỆT khóa học "${course.title}"? Khóa học sẽ lập tức xuất hiện cho học sinh ôn luyện trên toàn hệ thống.`
        : `Bạn có chắc muốn ${course.isAccepted ? "HỦY PHÊ DUYỆT" : "TỪ CHỐI"} khóa học "${course.title}"?`,
      confirmText: approved ? "Xác Nhận Duyệt" : "Xác Nhận Từ Chối",
      variant: approved ? "emerald" : "rose",
      onConfirm: () => executeApproveCourse(course.id, approved),
    });
  };

  const executeApproveCourse = async (courseId: string, approved: boolean) => {
    setConfirmPrompt(null);
    try {
      await updateDoc(doc(db, "courses", courseId), { is_accepted: approved, isAccepted: approved });
    } catch {}
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, isAccepted: approved } : c))
    );
    setActionMsg(approved ? "✅ Đã phê duyệt Khóa học thành công!" : "⚠️ Đã từ chối / hủy duyệt Khóa học.");
    setTimeout(() => setActionMsg(null), 3500);
  };

  const handlePromptApproveGame = (game: Game, approved: boolean) => {
    setConfirmPrompt({
      title: approved ? "Xác Nhận Phê Duyệt Game Engine" : "Xác Nhận Từ Chối Game",
      description: approved
        ? `Bạn đã audit source code và xác nhận PHÊ DUYỆT cho Game Engine "${game.title}"? Trò chơi sẽ sẵn sàng để giáo viên và học sinh liên kết vào các bộ đề trắc nghiệm.`
        : `Bạn có chắc muốn ${game.isAccepted ? "HỦY PHÊ DUYỆT" : "TỪ CHỐI"} Game Engine "${game.title}"?`,
      confirmText: approved ? "Xác Nhận Duyệt Game" : "Xác Nhận Từ Chối",
      variant: approved ? "emerald" : "rose",
      onConfirm: () => executeApproveGame(game.id, approved),
    });
  };

  const executeApproveGame = async (gameId: string, approved: boolean) => {
    setConfirmPrompt(null);
    try {
      await updateDoc(doc(db, "game_info", gameId), { is_accepted: approved, isAccepted: approved });
    } catch (err) {
      console.warn("Firestore updateDoc game_info warning:", err);
    }

    try {
      if (typeof window !== "undefined") {
        const local = JSON.parse(localStorage.getItem("eve_uploaded_games") || "[]");
        const updated = local.map((g: any) =>
          g.id === gameId || g.gameId === gameId ? { ...g, isAccepted: approved, is_accepted: approved } : g
        );
        localStorage.setItem("eve_uploaded_games", JSON.stringify(updated));
        window.dispatchEvent(new Event("eve_games_updated"));
      }
    } catch {}

    setGames((prev) =>
      prev.map((g) => (g.id === gameId || g.gameId === gameId ? { ...g, isAccepted: approved, is_accepted: approved } : g))
    );
    setActionMsg(approved ? "✅ Đã phê duyệt Game Engine thành công! Game đã sẵn sàng trên toàn hệ thống." : "⚠️ Đã từ chối / hủy duyệt Game.");
    setTimeout(() => setActionMsg(null), 3500);
  };

  const handlePromptDownloadSource = (game: any) => {
    setConfirmPrompt({
      title: "Xác Nhận Tải Gói Source Code",
      description: `Bạn có muốn tải file zip mã nguồn của Game Engine "${game.title}" về máy tính để thực hiện kiểm định bảo mật (Audit code) không?`,
      confirmText: "Tải Xuống (.zip)",
      variant: "purple",
      onConfirm: () => executeDownloadSource(game),
    });
  };

  const executeDownloadSource = (game: any) => {
    setConfirmPrompt(null);
    const downloadUrl = game.downloadSourceUrl || game.download_source_url || "/boss_battle_quiz.zip";
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `${game.id || "game"}_source_code.zip`;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setActionMsg(`📥 Đang tải source code của "${game.title}" (.zip) về máy để audit...`);
    setTimeout(() => setActionMsg(null), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/15">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CheckSquare className="w-7 h-7 text-rose-400" /> Trung Tâm Kiểm Duyệt Nội Dung & Audit Source Code
          </h1>
          <p className="text-sm text-[#8e9bb4] mt-1">
            Xem trước cấu trúc câu hỏi JSON Pairs, tải source code Game để kiểm định an toàn trước khi kích hoạt.
          </p>
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs flex items-center justify-between animate-fade-in">
          <span>{actionMsg}</span>
          <button onClick={() => setActionMsg(null)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab("courses")}
          className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
            activeTab === "courses"
              ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
              : "bg-[#151b2c] text-slate-400 border-slate-800 hover:border-slate-700"
          }`}
        >
          <BookOpen className="w-4 h-4 text-cyan-400" />
          Duyệt Khóa Học & Lộ Trình ({courses.filter((c) => !c.isAccepted).length})
        </button>

        <button
          onClick={() => setActiveTab("games")}
          className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
            activeTab === "games"
              ? "bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.25)]"
              : "bg-[#151b2c] text-slate-400 border-slate-800 hover:border-slate-700"
          }`}
        >
          <Gamepad2 className="w-4 h-4 text-purple-400" />
          Duyệt & Audit Game Engine ({games.filter((g) => !g.isAccepted).length})
        </button>
      </div>

      {/* ── TAB 1: COURSES APPROVAL ── */}
      {activeTab === "courses" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List of courses */}
          <div className="lg:col-span-2 space-y-4">
            {courses.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#0f1524] border border-slate-800 text-center text-slate-500 font-mono text-xs">
                Hiện không có khóa học nào trong danh sách chờ duyệt.
              </div>
            ) : (
              courses.map((course) => {
                const pairs = Array.isArray(course.contentData)
                  ? course.contentData
                  : course.contentData?.pairs || [];

                return (
                  <div
                    key={course.id}
                    className={`p-6 rounded-2xl bg-[#0f1524]/90 border transition-all ${
                      selectedCourse?.id === course.id
                        ? "border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                        : "border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            {course.id}
                          </span>
                          <span
                            className={`font-mono text-[10px] px-2 py-0.5 rounded-full border ${
                              course.isAccepted
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                            }`}
                          >
                            {course.isAccepted ? "Đã duyệt" : "Chờ duyệt"}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg text-white">{course.title}</h3>
                        <p className="text-xs text-[#8e9bb4] mt-1">{course.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80 font-mono">
                      <span>Bởi: <strong className="text-white">{course.authorName || course.authorId}</strong></span>
                      <span>{pairs.length} Cặp Câu Hỏi JSON</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-800">
                      <button
                        onClick={() => setSelectedCourse(course)}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 font-mono text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" /> Xem Data Pairs
                      </button>

                      <div className="flex items-center gap-2">
                        {!course.isAccepted ? (
                          <>
                            <button
                              onClick={() => handlePromptApproveCourse(course, true)}
                              className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-mono text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Duyệt
                            </button>
                            <button
                              onClick={() => handlePromptApproveCourse(course, false)}
                              className="px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 font-mono text-xs cursor-pointer transition-all"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Từ Chối
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handlePromptApproveCourse(course, false)}
                            className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-mono text-xs cursor-pointer transition-all"
                          >
                            Hủy phê duyệt
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Preview Details Pane */}
          <div className="p-6 rounded-2xl bg-[#0f1524]/90 border border-[#7bd1fa]/15 sticky top-24 h-fit space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <FileCode className="w-4 h-4 text-cyan-400" /> Cấu Trúc JSON Data Pairs
            </h3>

            {selectedCourse ? (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                <div>
                  <div className="text-xs font-bold text-cyan-300">{selectedCourse.title}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">Mã: {selectedCourse.id}</div>
                </div>

                <div className="space-y-3">
                  {(
                    (Array.isArray(selectedCourse.contentData)
                      ? selectedCourse.contentData
                      : selectedCourse.contentData?.pairs) || []
                  ).map((pair: CourseContentPair, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-[#151b2c] border border-slate-800 space-y-2">
                      <div className="text-xs font-bold text-white">
                        #{idx + 1}: {pair.title}
                      </div>
                      <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                        <strong className="text-[10px] uppercase font-mono block text-emerald-400">Đáp án đúng:</strong>
                        {pair.description || pair.rightAnswer}
                      </div>
                      {(pair.distractions || pair.wrongAnswers || []).length > 0 && (
                        <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 space-y-1">
                          <strong className="text-[10px] uppercase font-mono block text-rose-400">Gây nhiễu (Sai):</strong>
                          {(pair.distractions || pair.wrongAnswers || []).map((w, wIdx) => (
                            <div key={wIdx} className="text-[11px]">• {w}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs">
                Chọn một Khóa học bên trái để xem trước các cặp câu hỏi & đáp án.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: GAMES APPROVAL & AUDIT ── */}
      {activeTab === "games" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {games.length === 0 ? (
            <div className="col-span-2 p-8 rounded-2xl bg-[#0f1524] border border-slate-800 text-center text-slate-500 font-mono text-xs">
              Hiện không có Game nào cần duyệt.
            </div>
          ) : (
            games.map((game) => (
              <div
                key={game.id}
                className="p-6 rounded-2xl bg-[#0f1524]/90 border border-purple-500/20 shadow-lg space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 inline-block mb-1.5">
                      {game.id}
                    </span>
                    <h3 className="font-bold text-lg text-white">{game.title}</h3>
                    <p className="text-xs text-[#8e9bb4] mt-1">{game.description}</p>
                  </div>

                  <span
                    className={`font-mono text-[10px] px-2.5 py-1 rounded-full border shrink-0 ${
                      game.isAccepted
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        : "bg-purple-500/20 text-purple-300 border-purple-500/30 animate-pulse"
                    }`}
                  >
                    {game.isAccepted ? "Đã duyệt" : "Chờ Audit"}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#151b2c] border border-slate-800 text-xs font-mono space-y-1.5 text-slate-300">
                  <div>Tác giả: <strong className="text-white">{game.authorName || "Giáo viên"}</strong></div>
                  <div>Cần Data Course: <strong className={game.needExtraData ? "text-cyan-300" : "text-slate-400"}>{game.needExtraData ? "Có (Inject data qua postMessage)" : "Không"}</strong></div>
                  <div>Hỗ trợ Course: <strong className="text-amber-300">{Array.isArray(game.coursesAllowed) ? game.coursesAllowed.join(", ") : "Tất cả (all)"}</strong></div>
                  <div>URL thực thi: <span className="text-slate-400">{game.gameUrl}</span></div>
                </div>

                {/* Audit & Download Action */}
                <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    onClick={() => handlePromptDownloadSource(game)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> 📥 Tải Source Code (.zip)
                  </button>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {!game.isAccepted ? (
                      <>
                        <button
                          onClick={() => handlePromptApproveGame(game, true)}
                          className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                        >
                          <ShieldCheck className="w-4 h-4" /> Duyệt Game
                        </button>
                        <button
                          onClick={() => handlePromptApproveGame(game, false)}
                          className="px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 font-mono text-xs cursor-pointer transition-all"
                        >
                          Từ Chối
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handlePromptApproveGame(game, false)}
                        className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-mono text-xs cursor-pointer transition-all"
                      >
                        Hủy duyệt
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── CONFIRMATION PROMPT MODAL ── */}
      {confirmPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in font-sans">
          <div className="bg-[#0f1524] border border-[#7bd1fa]/30 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-5 text-center relative">
            <button
              type="button"
              onClick={() => setConfirmPrompt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto text-xl ${
              confirmPrompt.variant === "emerald"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                : confirmPrompt.variant === "purple"
                ? "bg-purple-500/20 text-purple-400 border border-purple-500/40"
                : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
            }`}>
              <HelpCircle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white tracking-tight">
                {confirmPrompt.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {confirmPrompt.description}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmPrompt(null)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold transition-all cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={confirmPrompt.onConfirm}
                className={`flex-1 py-3 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  confirmPrompt.variant === "emerald"
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    : confirmPrompt.variant === "purple"
                    ? "bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                    : "bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {confirmPrompt.confirmText || "Xác Nhận"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
