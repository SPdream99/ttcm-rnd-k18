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
  FileCode,
  ShieldCheck,
  CheckCircle2,
  X,
  Trash2,
  HelpCircle,
} from "lucide-react";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
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

      try {
        if (typeof window !== "undefined") {
          const localGames = JSON.parse(localStorage.getItem("eve_uploaded_games") || "[]");
          localGames.forEach((lg: any) => {
            const existingIdx = combinedGames.findIndex(
              (g) =>
                g.id === lg.id ||
                g.gameId === lg.id ||
                g.id === lg.gameId ||
                (g.title && lg.title && g.title.toLowerCase().trim() === lg.title.toLowerCase().trim())
            );
            const formatted = {
              id: lg.id || lg.gameId,
              ...lg,
              isAccepted: lg.isAccepted ?? lg.is_accepted ?? false,
              needExtraData: lg.needExtraData ?? lg.need_extra_data ?? true,
              downloadSourceUrl: lg.downloadSourceUrl ?? lg.download_source_url ?? "/boss_battle_quiz.zip",
            };

            if (existingIdx === -1) {
              combinedGames.unshift(formatted);
            } else {
              combinedGames[existingIdx] = { ...combinedGames[existingIdx], ...formatted };
            }
          });
        }
      } catch {}

      setGames(combinedGames);
    }
    loadData();
  }, []);

  const handlePromptApproveCourse = (course: Course, accepted: boolean) => {
    const actionText = accepted ? "phê duyệt" : "từ chối / hủy duyệt";
    setConfirmPrompt({
      title: accepted ? "Xác Nhận Duyệt Khóa Học" : "Hủy Duyệt Khóa Học",
      description: `Bạn có chắc chắn muốn ${actionText} khóa học "${course.title}"?`,
      confirmText: accepted ? "Xác Nhận Duyệt" : "Xác Nhận",
      variant: accepted ? "emerald" : "rose",
      onConfirm: () => executeApproveCourse(course.id, accepted),
    });
  };

  const executeApproveCourse = async (courseId: string, isAccepted: boolean) => {
    setConfirmPrompt(null);
    try {
      await updateDoc(doc(db, "courses", courseId), {
        isAccepted,
        is_accepted: isAccepted,
      });
      setCourses((prev) =>
        prev.map((c) => (c.id === courseId ? { ...c, isAccepted } : c))
      );
      setActionMsg(`Đã ${isAccepted ? "DUYỆT" : "HỦY DUYỆT"} khóa học thành công!`);
      setTimeout(() => setActionMsg(null), 3500);
    } catch {
      alert("Lỗi khi cập nhật trạng thái khóa học.");
    }
  };

  const handlePromptDeleteCourse = (course: Course) => {
    setConfirmPrompt({
      title: "Xóa Vĩnh Viễn Khóa Học",
      description: `Bạn có chắc chắn muốn XÓA VĨNH VIỄN khóa học "${course.title}" (${course.id}) khỏi toàn bộ hệ thống không?`,
      confirmText: "Xóa Vĩnh Viễn",
      variant: "rose",
      onConfirm: () => executeDeleteCourse(course.id),
    });
  };

  const executeDeleteCourse = async (courseId: string) => {
    setConfirmPrompt(null);
    try {
      await deleteDoc(doc(db, "courses", courseId));
      if (typeof window !== "undefined") {
        const local = JSON.parse(localStorage.getItem("eve_uploaded_courses") || "[]");
        const updated = local.filter((c: any) => c.id !== courseId);
        localStorage.setItem("eve_uploaded_courses", JSON.stringify(updated));
      }
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
      if (selectedCourse?.id === courseId) setSelectedCourse(null);
      setActionMsg("Đã xóa vĩnh viễn khóa học khỏi hệ thống thành công!");
      setTimeout(() => setActionMsg(null), 3500);
    } catch {
      alert("Lỗi khi xóa khóa học.");
    }
  };

  const handlePromptApproveGame = (game: Game, accepted: boolean) => {
    const actionText = accepted ? "phê duyệt" : "từ chối / hủy duyệt";
    setConfirmPrompt({
      title: accepted ? "Xác Nhận Duyệt Game Engine" : "Hủy Duyệt Game Engine",
      description: `Bạn có chắc chắn muốn ${actionText} Game "${game.title}" không?`,
      confirmText: accepted ? "Xác Nhận Duyệt" : "Xác Nhận",
      variant: accepted ? "emerald" : "rose",
      onConfirm: () => executeApproveGame(game.id, accepted),
    });
  };

  const executeApproveGame = async (gameId: string, isAccepted: boolean) => {
    setConfirmPrompt(null);
    try {
      await updateDoc(doc(db, "game_info", gameId), {
        isAccepted,
        is_accepted: isAccepted,
      });
    } catch {}

    try {
      if (typeof window !== "undefined") {
        const local = JSON.parse(localStorage.getItem("eve_uploaded_games") || "[]");
        const updated = local.map((g: any) =>
          g.id === gameId || g.gameId === gameId ? { ...g, isAccepted, is_accepted: isAccepted } : g
        );
        localStorage.setItem("eve_uploaded_games", JSON.stringify(updated));
        window.dispatchEvent(new Event("eve_games_updated"));
      }
    } catch {}

    setGames((prev) =>
      prev.map((g) => (g.id === gameId || g.gameId === gameId ? { ...g, isAccepted } : g))
    );
    setActionMsg(`Đã ${isAccepted ? "DUYỆT" : "HỦY DUYỆT"} Game Engine thành công!`);
    setTimeout(() => setActionMsg(null), 3500);
  };

  const handlePromptDeleteGame = (game: Game) => {
    setConfirmPrompt({
      title: "Xóa Vĩnh Viễn Game Engine",
      description: `Bạn có chắc chắn muốn XÓA VĨNH VIỄN Game Engine "${game.title}" (${game.id}) khỏi hệ thống không?`,
      confirmText: "Xóa Game",
      variant: "rose",
      onConfirm: () => executeDeleteGame(game.id),
    });
  };

  const executeDeleteGame = async (gameId: string) => {
    setConfirmPrompt(null);
    try {
      await deleteDoc(doc(db, "game_info", gameId));
    } catch {}

    try {
      if (typeof window !== "undefined") {
        const local = JSON.parse(localStorage.getItem("eve_uploaded_games") || "[]");
        const updated = local.filter((g: any) => g.id !== gameId && g.gameId !== gameId);
        localStorage.setItem("eve_uploaded_games", JSON.stringify(updated));
        window.dispatchEvent(new Event("eve_games_updated"));
      }
    } catch {}

    setGames((prev) => prev.filter((g) => g.id !== gameId && g.gameId !== gameId));
    setActionMsg("Đã xóa vĩnh viễn Game Engine khỏi hệ thống thành công!");
    setTimeout(() => setActionMsg(null), 3500);
  };

  const handlePromptDownloadSource = (game: any) => {
    setConfirmPrompt({
      title: "Tải Gói Source Code",
      description: `Tải file zip mã nguồn của Game "${game.title}" về máy để kiểm tra bảo mật?`,
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
    setActionMsg(`Đang tải source code của "${game.title}" (.zip)...`);
    setTimeout(() => setActionMsg(null), 4000);
  };

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-zinc-200">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
            <CheckSquare className="w-7 h-7 text-red-600" /> Trung Tâm Kiểm Duyệt & Audit Nội Dung
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Xem trước câu hỏi bài học và kiểm định Game trước khi kích hoạt.
          </p>
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center justify-between">
          <span>{actionMsg}</span>
          <button onClick={() => setActionMsg(null)} className="text-zinc-400 hover:text-zinc-900 cursor-pointer"></button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-3">
        <button
          onClick={() => setActiveTab("courses")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 border ${
            activeTab === "courses"
              ? "bg-red-600 text-white border-red-600 shadow-sm"
              : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Duyệt Bài Học ({courses.filter((c) => !c.isAccepted).length})
        </button>

        <button
          onClick={() => setActiveTab("games")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 border ${
            activeTab === "games"
              ? "bg-red-600 text-white border-red-600 shadow-sm"
              : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          Duyệt Game Engine ({games.filter((g) => !g.isAccepted).length})
        </button>
      </div>

      {/* TAB 1: COURSES APPROVAL */}
      {activeTab === "courses" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List of courses */}
          <div className="lg:col-span-2 space-y-4">
            {courses.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white border border-zinc-200 text-center text-zinc-500 text-xs">
                Hiện không có bài học nào trong danh sách chờ duyệt.
              </div>
            ) : (
              courses.map((course) => {
                const pairs = Array.isArray(course.contentData)
                  ? course.contentData
                  : course.contentData?.pairs || [];

                return (
                  <div
                    key={course.id}
                    className={`p-6 rounded-2xl bg-white border transition-colors shadow-sm ${
                      selectedCourse?.id === course.id
                        ? "border-2 border-red-600"
                        : "border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 font-bold border border-zinc-200">
                            {course.id}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                              course.isAccepted
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {course.isAccepted ? "Đã duyệt" : "Chờ duyệt"}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg text-zinc-900">{course.title}</h3>
                        <p className="text-xs text-zinc-500 mt-1">{course.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-zinc-500 pt-3 border-t border-zinc-100">
                      <span>Bởi: <strong className="text-zinc-900">{course.authorName || course.authorId}</strong></span>
                      <span>{pairs.length} Cặp Câu Hỏi</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-zinc-100">
                      <button
                        onClick={() => setSelectedCourse(course)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors border border-zinc-200"
                      >
                        <Eye className="w-3.5 h-3.5 text-red-600" /> Xem Data Pairs
                      </button>

                      <div className="flex items-center gap-2">
                        {!course.isAccepted ? (
                          <>
                            <button
                              onClick={() => handlePromptApproveCourse(course, true)}
                              className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Duyệt
                            </button>
                            <button
                              onClick={() => handlePromptApproveCourse(course, false)}
                              className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold border border-zinc-200 cursor-pointer transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Từ Chối
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handlePromptApproveCourse(course, false)}
                            className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-red-50 text-zinc-700 hover:text-red-700 border border-zinc-200 text-xs font-bold cursor-pointer transition-colors"
                          >
                            Hủy phê duyệt
                          </button>
                        )}

                        <button
                          onClick={() => handlePromptDeleteCourse(course)}
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-red-50 text-zinc-700 hover:text-red-700 border border-zinc-200 cursor-pointer transition-colors flex items-center gap-1 text-xs font-bold"
                          title="Xóa vĩnh viễn khóa học này"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-600" /> Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Preview Details Pane */}
          <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm sticky top-24 h-fit space-y-4">
            <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-2 pb-3 border-b border-zinc-100">
              <FileCode className="w-4 h-4 text-red-600" /> Cấu Trúc Câu Hỏi
            </h3>

            {selectedCourse ? (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                <div>
                  <div className="text-xs font-bold text-zinc-900">{selectedCourse.title}</div>
                  <div className="text-[11px] text-zinc-500 font-mono mt-0.5">Mã: {selectedCourse.id}</div>
                </div>

                <div className="space-y-3">
                  {(
                    (Array.isArray(selectedCourse.contentData)
                      ? selectedCourse.contentData
                      : selectedCourse.contentData?.pairs) || []
                  ).map((pair: CourseContentPair, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                      <div className="text-xs font-bold text-zinc-900">
                        #{idx + 1}: {pair.title}
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-emerald-300 text-xs text-emerald-800">
                        <strong className="text-[10px] uppercase font-bold block text-emerald-700">Đáp án đúng:</strong>
                        {pair.description || pair.rightAnswer}
                      </div>
                      {(pair.distractions || pair.wrongAnswers || []).length > 0 && (
                        <div className="p-2 rounded-lg bg-white border border-red-200 text-xs text-red-700 space-y-1">
                          <strong className="text-[10px] uppercase font-bold block text-red-600">Gây nhiễu (Sai):</strong>
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
              <div className="text-center py-12 text-zinc-500 text-xs">
                Chọn một Khóa học bên trái để xem trước các cặp câu hỏi & đáp án.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: GAMES APPROVAL */}
      {activeTab === "games" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {games.length === 0 ? (
            <div className="col-span-2 p-8 rounded-2xl bg-white border border-zinc-200 text-center text-zinc-500 text-xs">
              Hiện không có Game nào cần duyệt.
            </div>
          ) : (
            games.map((game, idx) => (
              <div
                key={`${game.id || game.gameId || idx}_${idx}`}
                className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 font-bold border border-zinc-200 inline-block mb-1.5">
                      {game.id}
                    </span>
                    <h3 className="font-bold text-lg text-zinc-900">{game.title}</h3>
                    <p className="text-xs text-zinc-500 mt-1">{game.description}</p>
                  </div>

                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-full font-bold border shrink-0 ${
                      game.isAccepted
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {game.isAccepted ? "Đã duyệt" : "Chờ Duyệt"}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs space-y-1 text-zinc-600">
                  <div>Tác giả: <strong className="text-zinc-900">{game.authorName || "Giáo viên"}</strong></div>
                  <div>Cần Data: <strong>{game.needExtraData ? "Có (Dynamic Data)" : "Không"}</strong></div>
                  <div>URL thực thi: <span className="font-mono text-zinc-500">{game.gameUrl}</span></div>
                </div>

                {/* Audit & Download Action */}
                <div className="pt-3 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    onClick={() => handlePromptDownloadSource(game)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold flex items-center justify-center gap-2 border border-zinc-200 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-red-600" /> Tải Source Code (.zip)
                  </button>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {!game.isAccepted ? (
                      <>
                        <button
                          onClick={() => handlePromptApproveGame(game, true)}
                          className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                        >
                          <ShieldCheck className="w-4 h-4" /> Duyệt Game
                        </button>
                        <button
                          onClick={() => handlePromptApproveGame(game, false)}
                          className="px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold border border-zinc-200 cursor-pointer transition-colors"
                        >
                          Từ Chối
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handlePromptApproveGame(game, false)}
                        className="px-3 py-2 rounded-xl bg-zinc-100 hover:bg-red-50 text-zinc-700 hover:text-red-700 border border-zinc-200 text-xs font-bold cursor-pointer transition-colors"
                      >
                        Hủy duyệt
                      </button>
                    )}

                    <button
                      onClick={() => handlePromptDeleteGame(game)}
                      className="px-3 py-2 rounded-xl bg-zinc-100 hover:bg-red-50 text-zinc-700 hover:text-red-700 border border-zinc-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                      title="Xóa vĩnh viễn Game Engine này"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" /> Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* CONFIRMATION PROMPT MODAL */}
      {confirmPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 font-sans">
          <div className="bg-white border-2 border-red-600 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-4 text-center relative">
            <button
              type="button"
              onClick={() => setConfirmPrompt(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto text-xl font-bold">
              <HelpCircle className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-zinc-900">
                {confirmPrompt.title}
              </h3>
              <p className="text-xs text-zinc-500">
                {confirmPrompt.description}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmPrompt(null)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={confirmPrompt.onConfirm}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white shadow-sm"
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
