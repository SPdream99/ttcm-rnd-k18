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
} from "lucide-react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Course, CourseContentPair } from "@/core/entities/Course";
import { Game } from "@/core/entities/Game";

const MOCK_PENDING_COURSES: Course[] = [
  {
    id: "crs_quantum_101",
    title: "Vật Lý Lượng Tử Cơ Bản (Quantum 101)",
    description: "Nhập môn lưỡng tính sóng hạt, nguyên lý bất định Heisenberg và hàm sóng Schrödinger.",
    authorId: "usr_teacher_001",
    authorName: "ThS. Phạm Hoàng Nam",
    isAccepted: false,
    contentData: {
      pairs: [
        {
          id: "p1",
          title: "Hiện tượng quang điện chứng minh tính chất gì của ánh sáng?",
          description: "Tính chất hạt (Photon)",
          distractions: ["Tính chất sóng", "Tính chất phản xạ", "Tính chất tán sắc"],
          image_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600",
        },
        {
          id: "p2",
          title: "Ai là người đề xuất phương trình hàm sóng mô tả trạng thái lượng tử?",
          description: "Erwin Schrödinger",
          distractions: ["Albert Einstein", "Niels Bohr", "Isaac Newton"],
        },
        {
          id: "p3",
          title: "Hằng số Planck có ký hiệu là gì?",
          description: "h",
          distractions: ["c", "e", "k"],
        },
      ],
    },
    createdAt: "14/08/2026",
  },
  {
    id: "crs_astrophysics",
    title: "Thiên Văn Học & Hố Đen Vũ Trụ",
    description: "Khám phá chân trời sự kiện, bức xạ Hawking và các thiên hà xa xôi.",
    authorId: "usr_teacher_003",
    authorName: "GS. Nguyễn Văn An",
    isAccepted: false,
    contentData: {
      pairs: [
        {
          id: "p4",
          title: "Ranh giới mà không vật chất nào có thể thoát khỏi hố đen gọi là gì?",
          description: "Chân trời sự kiện (Event Horizon)",
          distractions: ["Điểm kỳ dị", "Vùng bồi tụ", "Vành đai Kuiper"],
        },
      ],
    },
    createdAt: "13/08/2026",
  },
];

const MOCK_PENDING_GAMES: Game[] = [
  {
    id: "game_space_quiz_3d",
    title: "Quiz Runner 3D - Trắc Nghiệm Tốc Độ",
    description: "Minigame tương tác vượt chướng ngại vật bằng cách chọn đúng đáp án tương ứng với nội dung bài học.",
    authorName: "GS. Nguyễn Văn An",
    gameUrl: "/games/space_quiz_3d/index.html",
    downloadSourceUrl: "https://github.com/SPdream99/ttcm-rnd-k18/raw/main/games/space_quiz_3d_source.zip",
    needExtraData: true,
    coursesAllowed: "all",
    coursesBlocked: [],
    isAccepted: false,
    playsCount: 145,
    createdAt: "14/08/2026",
  },
  {
    id: "game_card_match_vr",
    title: "Quantum Memory Matrix",
    description: "Trò chơi ghép cặp thẻ bài nhớ nhanh thuật ngữ và đáp án khoa học.",
    authorName: "ThS. Phạm Hoàng Nam",
    gameUrl: "/games/card_match_vr/index.html",
    downloadSourceUrl: "https://github.com/SPdream99/ttcm-rnd-k18/raw/main/games/card_match_source.zip",
    needExtraData: true,
    coursesAllowed: ["crs_quantum_101", "crs_astrophysics"],
    coursesBlocked: [],
    isAccepted: false,
    playsCount: 89,
    createdAt: "12/08/2026",
  },
];

export default function AdminApprovalsPage() {
  const [activeTab, setActiveTab] = useState<"courses" | "games">("courses");
  const [courses, setCourses] = useState<Course[]>(MOCK_PENDING_COURSES);
  const [games, setGames] = useState<Game[]>(MOCK_PENDING_GAMES);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const cSnap = await getDocs(collection(db, "courses"));
        if (!cSnap.empty) {
          const list: any[] = cSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
          setCourses(list);
        }
        const gSnap = await getDocs(collection(db, "games"));
        if (!gSnap.empty) {
          const list: any[] = gSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
          setGames(list);
        }
      } catch (e) {
        console.warn("Using fallback approvals data:", e);
      }
    }
    loadData();
  }, []);

  const handleApproveCourse = async (courseId: string, approved: boolean) => {
    try {
      await updateDoc(doc(db, "courses", courseId), { is_accepted: approved });
    } catch {}
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, isAccepted: approved } : c))
    );
    setActionMsg(approved ? "✅ Đã phê duyệt Khóa học thành công!" : "⚠️ Đã từ chối Khóa học.");
    setTimeout(() => setActionMsg(null), 3500);
  };

  const handleApproveGame = async (gameId: string, approved: boolean) => {
    try {
      await updateDoc(doc(db, "games", gameId), { is_accepted: approved });
    } catch {}
    setGames((prev) =>
      prev.map((g) => (g.id === gameId ? { ...g, isAccepted: approved } : g))
    );
    setActionMsg(approved ? "✅ Đã phê duyệt Game Engine thành công!" : "⚠️ Đã từ chối Game.");
    setTimeout(() => setActionMsg(null), 3500);
  };

  const handleDownloadSource = (game: Game) => {
    // Simulate/Trigger download of zip source
    const downloadUrl = game.downloadSourceUrl || game.download_source_url || `#download-${game.id}`;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `${game.id}_source_code.zip`;
    a.target = "_blank";
    a.click();
    setActionMsg(`📥 Đang tải source code của "${game.title}" về máy để audit...`);
    setTimeout(() => setActionMsg(null), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
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
          <button onClick={() => setActionMsg(null)} className="text-slate-400 hover:text-white">✕</button>
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
                              onClick={() => handleApproveCourse(course.id, true)}
                              className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-mono text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Duyệt
                            </button>
                            <button
                              onClick={() => handleApproveCourse(course.id, false)}
                              className="px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 font-mono text-xs cursor-pointer transition-all"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Từ Chối
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleApproveCourse(course.id, false)}
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
                    onClick={() => handleDownloadSource(game)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> 📥 Tải Source Code (.zip)
                  </button>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {!game.isAccepted ? (
                      <>
                        <button
                          onClick={() => handleApproveGame(game.id, true)}
                          className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                        >
                          <ShieldCheck className="w-4 h-4" /> Duyệt Game
                        </button>
                        <button
                          onClick={() => handleApproveGame(game.id, false)}
                          className="px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 font-mono text-xs cursor-pointer transition-all"
                        >
                          Từ Chối
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleApproveGame(game.id, false)}
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
    </div>
  );
}
