"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Code2,
  Gamepad2,
  ShieldCheck,
  Zap,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Terminal,
  FileCode,
  Sparkles,
  Maximize2,
  Volume2,
  Trophy,
  Play,
  CheckCircle2,
  Download,
  Package,
  Layers,
  HelpCircle,
  FolderArchive,
  Info,
  ChevronRight,
  Flame,
} from "lucide-react";

export default function TeacherGameSdkGuidePage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [sandboxOutput, setSandboxOutput] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "pairs" | "api" | "steps" | "sandbox" | "packaging">("overview");

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const sdkScriptTag = `<script src="/eve-game-sdk.js"></script>`;

  const samplePairsJson = `[
  {
    "id": "p1",
    "title": "Trong lập trình, cấu trúc điều kiện nào dùng để rẽ nhánh khi đúng hoặc sai?",
    "description": "Cấu trúc IF - ELSE",
    "distractions": [
      "Vòng lặp For",
      "Vòng lặp While",
      "Hàm Function"
    ],
    "explanation": "Cấu trúc IF - ELSE cho phép chương trình kiểm tra biểu thức điều kiện Logic (Boolean). Nếu biểu thức trả về True thì thực thi khối lệnh IF, ngược lại thực thi khối lệnh ELSE.",
    "imageUrl": ""
  },
  {
    "id": "p2",
    "title": "Linh kiện nào được coi là 'Bộ Não' xử lý trung tâm của máy tính?",
    "description": "CPU (Central Processing Unit)",
    "distractions": [
      "RAM",
      "Ổ cứng SSD",
      "Bộ nguồn PSU"
    ],
    "explanation": "CPU là bộ vi xử lý trung tâm, chịu trách nhiệm nhận, giải mã và thực thi các chỉ lệnh của chương trình máy tính bằng các khối ALU và Control Unit.",
    "imageUrl": ""
  }
]`;

  const sdkInitCode = `// 1. Khởi tạo SDK trong trò chơi của Thầy/Cô (HTML5 / React / Phaser / Canvas)
window.addEventListener("DOMContentLoaded", async () => {
  if (window.EveSDK) {
    // Tự động nhận dữ liệu câu hỏi từ khóa học mà học sinh đang học
    const session = await window.EveSDK.initSession({
      gameId: "my_custom_game_id",
      courseId: "crs_coding_basics" // hoặc tự động lấy từ URL parameter
    });

    console.log("Tên Khóa học:", session.courseTitle);
    console.log("Danh sách câu hỏi & giải thích:", session.pairs);

    // Lắng nghe khi dữ liệu đã sẵn sàng
    window.EveSDK.onDataReady((data) => {
      // Nạp dữ liệu vào Game Engine của Thầy/Cô
      loadGameQuestions(data.pairs);
    });
  }
});`;

  const sdkProgressCode = `// 2. Xử lý khi học sinh chọn đáp án & Báo cáo tiến độ thời gian thực
function onSelectAnswer(chosenText, rightAnswer, currentPair) {
  const isCorrect = chosenText.trim().toLowerCase() === rightAnswer.trim().toLowerCase();

  if (window.EveSDK) {
    if (isCorrect) {
      window.EveSDK.playSound("correct"); // Phát âm thanh đúng
    } else {
      window.EveSDK.playSound("wrong");   // Phát âm thanh sai
    }

    // Báo cáo tiến độ lên máy chủ E-V-E & thanh trạng thái
    window.EveSDK.updateProgress({
      score: currentScore,
      currentStreak: streakCount,
      progressPercent: (currentQuestion / totalQuestions) * 100,
      currentQuestion: currentQuestion,
      totalQuestions: totalQuestions
    });
  }

  // Hiển thị giải thích kiến thức chi tiết (nếu có)
  if (currentPair.explanation) {
    document.getElementById("explanation-box").textContent = currentPair.explanation;
  }
}`;

  const sdkFinishCode = `// 3. Khi học sinh hoàn thành trò chơi, nộp điểm & nhận Coins thưởng
async function onGameCompleted(finalScore, accuracy) {
  if (window.EveSDK) {
    try {
      const result = await window.EveSDK.finishGame({
        score: finalScore,        // Điểm số chung cuộc (0 - 100)
        isWin: true,              // Đạt chuẩn qua bài
        accuracyPercent: accuracy,// Tỷ lệ chính xác %
        playTimeSeconds: 52,      // Thời gian chơi thực tế (giây)
        details: { mode: "ranked" }
      });

      console.log("Kết quả xác thực & Coins nhận được:", result.data.earnedCoins);
    } catch (err) {
      console.error("Lỗi gửi kết quả:", err);
    }
  }
}`;

  const sdkFullscreenCode = `// 4. Kích hoạt toàn màn hình (Fullscreen Helper)
document.getElementById("btn-fullscreen").addEventListener("click", () => {
  if (window.EveSDK) {
    window.EveSDK.toggleFullscreen(); // Tự động phóng to / thu nhỏ canvas
  }
});`;

  // Sandbox Live Demo simulation
  const runLiveTest = (action: string) => {
    if (action === "init") {
      setSandboxOutput(`[E-V-E SDK v2.0.0] Khởi tạo thành công!
- Game ID: starter_quiz_game
- Course ID: crs_coding_basics
- Trạng thái: Session Token đã được ký số (Anti-Cheat)
- Số câu hỏi nạp sẵn: 5 câu (JSON Pairs có kèm Giải thích chi tiết)
- Web Audio & Fullscreen API: Đã kích hoạt`);
    } else if (action === "correct") {
      if (typeof window !== "undefined" && (window as any).EveSDK) {
        (window as any).EveSDK.playSound("correct");
      }
      setSandboxOutput(`[E-V-E SDK v2.0.0] updateProgress()
- Trạng thái: Trả lời ĐÚNG (+20 điểm)
- Chuỗi đúng (Streak): x2 🔥
- Âm thanh: Đã phát Web Audio SFX (Tần số 587Hz -> 880Hz)
- Tiến độ: 40% (2 / 5 câu)`);
    } else if (action === "wrong") {
      if (typeof window !== "undefined" && (window as any).EveSDK) {
        (window as any).EveSDK.playSound("wrong");
      }
      setSandboxOutput(`[E-V-E SDK v2.0.0] updateProgress()
- Trạng thái: Trả lời SAI
- Chuỗi đúng (Streak): Reset về 0
- Âm thanh: Đã phát Web Audio SFX (Tần số 220Hz -> 110Hz)`);
    } else if (action === "finish") {
      if (typeof window !== "undefined" && (window as any).EveSDK) {
        (window as any).EveSDK.playSound("win");
      }
      setSandboxOutput(`[E-V-E SDK v2.0.0] finishGame() -> SUCCESS
- Điểm số: 95 / 100
- Độ chính xác: 100%
- Thưởng Coins: +50 Coins 🪙
- Mở khóa bài học kế tiếp: Thành công!`);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-16">
      {/* ══════════════════════════════════════════════════════════════════════════
          1. HEADER & DIRECT DOWNLOAD HUB
         ══════════════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/15">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> E-V-E Game SDK v2.0.0 (Official Standard)
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Code2 className="w-8 h-8 text-emerald-400" /> Trung Tâm Tài Liệu & Tải Mã Nguồn Game SDK
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Thư viện chuẩn giúp Thầy/Cô phát triển trò chơi giáo dục bằng bất kỳ công nghệ web nào (HTML5, Canvas, React, Phaser, Three.js).
            Tự động nhận câu hỏi từ khóa học, đồng bộ tiến độ thời gian thực và tặng Coins thưởng cho học sinh.
          </p>
        </div>

        <Link
          href="/teacher/upload-center"
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] shrink-0"
        >
          <Gamepad2 className="w-4 h-4" /> Đăng Tải Game Đã Đóng Gói (.ZIP) →
        </Link>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          2. DIRECT DOWNLOAD PACKAGES (3 ACTION CARDS)
         ══════════════════════════════════════════════════════════════════════════ */}
      <div className="space-y-3">
        <h2 className="text-sm font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-2">
          <Download className="w-4 h-4" /> Tải Xuống Thư Viện SDK & Bộ Mã Nguồn Mẫu (Ready To Test)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Starter Kit Boilerplate ZIP */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#151b2c] to-[#0f1524] border border-cyan-500/30 hover:border-cyan-400/60 transition-all flex flex-col justify-between space-y-4 shadow-lg group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-500/30 group-hover:scale-105 transition-transform">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">
                  KHUYÊN DÙNG ⭐
                </span>
                <h3 className="text-base font-bold text-white mt-1 group-hover:text-cyan-300 transition-colors">
                  Bộ Starter Kit Mẫu Cơ Bản (.ZIP)
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Bao gồm đầy đủ file <code className="text-cyan-300">index.html</code>, <code className="text-cyan-300">game.js</code>, <code className="text-cyan-300">style.css</code>, <code className="text-cyan-300">eve-game-sdk.js</code> và 5 câu hỏi mẫu kèm giải thích chi tiết. Mở là chạy ngay!
                </p>
              </div>
            </div>

            <a
              href="/eve_game_starter_kit.zip"
              download="eve_game_starter_kit.zip"
              className="w-full py-3 px-4 rounded-xl bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-black font-mono font-bold text-xs border border-cyan-500/40 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.25)] cursor-pointer"
            >
              <Download className="w-4 h-4" /> Tải Bộ Starter Kit (.ZIP)
            </a>
          </div>

          {/* Card 2: Standalone eve-game-sdk.js */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#151b2c] to-[#0f1524] border border-emerald-500/30 hover:border-emerald-400/60 transition-all flex flex-col justify-between space-y-4 shadow-lg group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30 group-hover:scale-105 transition-transform">
                <FileCode className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                  THƯ VIỆN ĐỘC LẬP
                </span>
                <h3 className="text-base font-bold text-white mt-1 group-hover:text-emerald-300 transition-colors">
                  File SDK Thuần (eve-game-sdk.js)
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  File Javascript độc lập (11 KB), chứa toàn bộ API giao tiếp 2 chiều, Web Audio Synthesis, Fullscreen Controller và Anti-Cheat Token.
                </p>
              </div>
            </div>

            <a
              href="/eve-game-sdk.js"
              download="eve-game-sdk.js"
              className="w-full py-3 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black font-mono font-bold text-xs border border-emerald-500/40 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.25)] cursor-pointer"
            >
              <Download className="w-4 h-4" /> Tải eve-game-sdk.js (11KB)
            </a>
          </div>

          {/* Card 3: Advanced Boss Battle Sample Game ZIP */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#151b2c] to-[#0f1524] border border-purple-500/30 hover:border-purple-400/60 transition-all flex flex-col justify-between space-y-4 shadow-lg group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/30 group-hover:scale-105 transition-transform">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold">
                  GAME NÂNG CAO 🔥
                </span>
                <h3 className="text-base font-bold text-white mt-1 group-hover:text-purple-300 transition-colors">
                  Boss Slayer Marathon Quiz (.ZIP)
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Đấu Trùm 1000 HP marathon 10s, phím mũi tên né đòn phản công QTE, combo sát thương và bảng xếp hạng.
                </p>
              </div>
            </div>

            <a
              href="/boss_battle_quiz.zip"
              download="boss_battle_quiz.zip"
              className="w-full py-3 px-4 rounded-xl bg-purple-500/20 hover:bg-purple-500 text-purple-300 hover:text-black font-mono font-bold text-xs border border-purple-500/40 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.25)] cursor-pointer"
            >
              <Download className="w-4 h-4" /> Tải Boss Battle (.ZIP)
            </a>
          </div>

          {/* Card 4: Memory Matching Game ZIP */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#151b2c] to-[#0f1524] border border-amber-500/30 hover:border-amber-400/60 transition-all flex flex-col justify-between space-y-4 shadow-lg group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30 group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                  TRÍ NHỚ & GHÉP CẶP 🎴
                </span>
                <h3 className="text-base font-bold text-white mt-1 group-hover:text-amber-300 transition-colors">
                  Memory Matching Game (.ZIP)
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Lật thẻ bài 3D xoay chiều ghép cặp Thuật ngữ & Khái niệm, hiệu ứng Synth Web Audio, combo x4 điểm.
                </p>
              </div>
            </div>

            <a
              href="/memory_matching_game.zip"
              download="memory_matching_game.zip"
              className="w-full py-3 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black font-mono font-bold text-xs border border-amber-500/40 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.25)] cursor-pointer"
            >
              <Download className="w-4 h-4" /> Tải Memory Game (.ZIP)
            </a>
          </div>
        </div>

        {/* Security & Realtime Server SDK Policy Banner */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-[#0d1627] via-[#101b33] to-[#15132b] border border-cyan-500/40 space-y-3 shadow-[0_0_25px_rgba(6,182,212,0.15)]">
          <div className="flex items-center gap-2 text-sm font-bold text-cyan-300 font-mono">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            QUY CHUẨN VẬN HÀNH & NGUỒN CẤP THƯ VIỆN E-V-E GAME SDK
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-slate-300">
            <div className="p-4 rounded-2xl bg-[#0a0f1d] border border-slate-800 space-y-1.5">
              <span className="font-bold text-amber-300 font-mono block flex items-center gap-1.5">
                🧪 1. Bản SDK Trong Starter Kit (Offline Simulator Mode):
              </span>
              <p className="text-slate-400">
                Khi Thầy/Cô mở file <code className="text-cyan-300 font-mono">index.html</code> chạy thử cục bộ trên máy tính (chưa có server E-V-E), SDK tự động kích hoạt bộ **Mock Data Simulator** với 5 câu hỏi mẫu để Thầy/Cô kiểm tra giao diện, hiệu ứng âm thanh và luồng nộp điểm.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0a0f1d] border border-slate-800 space-y-1.5">
              <span className="font-bold text-emerald-300 font-mono block flex items-center gap-1.5">
                ⚡ 2. Bản SDK Thật Trên Server (Realtime Production Mode):
              </span>
              <p className="text-slate-400">
                Khi game tải lên hệ thống E-V-E, game **bắt buộc phải import** <code className="text-cyan-300 font-mono">&lt;script src="/eve-game-sdk.js"&gt;&lt;/script&gt;</code>. Hệ thống chỉ cho phép nạp SDK từ chính máy chủ E-V-E, **ngăn chặn tuyệt đối việc tải từ CDN/nguồn ngoài** để bảo mật chữ ký số Session Token và chống gian lận điểm số.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          3. CATEGORY NAVIGATION TABS
         ══════════════════════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono scrollbar-none border-b border-slate-800">
        {[
          { id: "overview", label: "📌 1. Tổng Quan & Kiến Trúc", icon: BookOpen },
          { id: "pairs", label: "🧩 2. Cấu Trúc Câu Hỏi (JSON Pairs)", icon: Layers },
          { id: "api", label: "⚡ 3. Tra Cứu Toàn Bộ API SDK", icon: Zap },
          { id: "steps", label: "💻 4. Các Bước Viết Code & Ví Dụ", icon: FileCode },
          { id: "sandbox", label: "🧪 5. Trình Thử Nghiệm Trực Tiếp (Sandbox)", icon: Terminal },
          { id: "packaging", label: "📦 6. Hướng Dẫn Đóng Gói .ZIP", icon: FolderArchive },
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-t-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer font-bold border-t border-x ${
                active
                  ? "bg-[#0f1524] text-cyan-300 border-cyan-500/40 border-b-2 border-b-cyan-400 shadow-[0_-5px_15px_rgba(6,182,212,0.15)]"
                  : "bg-transparent text-slate-400 border-transparent hover:text-white"
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          4. TAB CONTENT 1: TỔNG QUAN & KIẾN TRÚC
         ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-[#0f1524]/90 border border-emerald-500/20 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white">1. Sáng Tạo Tự Do</h3>
              <p className="text-xs text-[#8e9bb4] leading-relaxed">
                Hỗ trợ mọi framework: React, Phaser 3, Three.js 3D, Unity WebGL, HTML5 Canvas hoặc Vanilla JS.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0f1524]/90 border border-cyan-500/20 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white">2. Bốc Dữ Liệu Tự Động</h3>
              <p className="text-xs text-[#8e9bb4] leading-relaxed">
                Hệ thống tự động inject ngân hàng câu hỏi (JSON Pairs kèm Giải thích) của bài học trực tiếp vào game.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0f1524]/90 border border-blue-500/20 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Maximize2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white">3. Toàn Màn Hình & Âm Thanh</h3>
              <p className="text-xs text-[#8e9bb4] leading-relaxed">
                Tích hợp sẵn bộ điều khiển Fullscreen API và bộ tổng hợp âm thanh Web Audio (Đúng, Sai, Win, Coin).
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0f1524]/90 border border-purple-500/20 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white">4. Chống Gian Lận (Anti-Cheat)</h3>
              <p className="text-xs text-[#8e9bb4] leading-relaxed">
                Xác thực phiên chơi bằng chữ ký số Session Token, bảo vệ điểm số và phần thưởng Coins của học sinh.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#0f1524] border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400" /> Mô Hình Giao Tiếp Hai Chiều Giữa Game & Hệ Thống
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Trò chơi của Thầy/Cô khi tải lên hệ thống E-V-E sẽ được chạy trong môi trường **Sandbox Iframe an toàn**. Thư viện <code className="text-cyan-300">eve-game-sdk.js</code> tự động xử lý toàn bộ cơ chế <code className="text-cyan-300">window.postMessage</code> và REST API phía sau, giúp Thầy/Cô chỉ cần gọi các hàm Javascript đơn giản mà không cần lo lắng về hạ tầng máy chủ hay xác thực người dùng.
            </p>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          5. TAB CONTENT 2: CẤU TRÚC JSON PAIRS & EXPLANATION
         ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === "pairs" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#0f1524] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Cấu Trúc Cặp Dữ Liệu Câu Hỏi (CourseContentPair)</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Mỗi câu hỏi được nạp vào Game Engine sẽ có đầy đủ Câu hỏi, Đáp án đúng, Các phương án sai và **Giải thích chi tiết**.
                </p>
              </div>
              <button
                onClick={() => handleCopy(samplePairsJson, 99)}
                className="px-3 py-1.5 rounded-lg bg-[#151b2c] hover:bg-slate-800 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700"
              >
                {copiedIndex === 99 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedIndex === 99 ? "Đã chép" : "Sao chép JSON"}
              </button>
            </div>

            {/* Field Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
                <thead className="bg-[#151b2c] font-mono text-cyan-300">
                  <tr>
                    <th className="p-3 border-b border-slate-800">Trường (Field)</th>
                    <th className="p-3 border-b border-slate-800">Kiểu Dữ Liệu</th>
                    <th className="p-3 border-b border-slate-800">Mô Tả Ý Nghĩa</th>
                    <th className="p-3 border-b border-slate-800">Ví Dụ Mẫu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono text-slate-300">
                  <tr>
                    <td className="p-3 text-cyan-300 font-bold">title</td>
                    <td className="p-3 text-purple-300">string</td>
                    <td className="p-3 text-slate-300 font-sans">Nội dung Câu hỏi hoặc Khái niệm cần kiểm tra</td>
                    <td className="p-3 text-slate-400">"Hằng số Planck có ký hiệu là gì?"</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-emerald-300 font-bold">description</td>
                    <td className="p-3 text-purple-300">string</td>
                    <td className="p-3 text-slate-300 font-sans">Đáp án chính xác (Right Answer / Definition)</td>
                    <td className="p-3 text-slate-400">"h"</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-amber-300 font-bold">distractions</td>
                    <td className="p-3 text-purple-300">string[]</td>
                    <td className="p-3 text-slate-300 font-sans">Danh sách các phương án gây nhiễu (Đáp án sai)</td>
                    <td className="p-3 text-slate-400">["c", "e", "k"]</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-pink-300 font-bold">explanation</td>
                    <td className="p-3 text-purple-300">string</td>
                    <td className="p-3 text-slate-300 font-sans">💡 Giải thích chi tiết đáp án & mở rộng kiến thức</td>
                    <td className="p-3 text-slate-400">"Hằng số Planck (h = 6.626 x 10^-34 J.s) do Max Planck khám phá..."</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-400">imageUrl</td>
                    <td className="p-3 text-purple-300">string?</td>
                    <td className="p-3 text-slate-300 font-sans">Đường dẫn hình ảnh minh họa cho câu hỏi (nếu có)</td>
                    <td className="p-3 text-slate-400">"https://storage.eve.edu.vn/..."</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Code Block */}
            <div className="p-4 rounded-xl bg-[#080c16] font-mono text-xs text-emerald-300 overflow-x-auto border border-slate-800/80 whitespace-pre">
              <code>{samplePairsJson}</code>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          6. TAB CONTENT 3: TRA CỨU TOÀN BỘ API SDK (API REFERENCE)
         ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === "api" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Method 1: initSession */}
            <div className="p-6 rounded-3xl bg-[#0f1524] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold">
                  EveSDK.initSession(config)
                </span>
                <span className="text-[10px] font-mono text-slate-400">Async / Promise</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Khởi tạo phiên chơi và tự động kéo ngân hàng câu hỏi của khóa học từ server.
              </p>
              <div className="p-3 rounded-xl bg-[#080c16] font-mono text-xs text-cyan-300 border border-slate-800">
                <code>const session = await EveSDK.initSession(&#123; gameId, courseId &#125;);</code>
              </div>
            </div>

            {/* Method 2: onDataReady */}
            <div className="p-6 rounded-3xl bg-[#0f1524] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
                  EveSDK.onDataReady(callback)
                </span>
                <span className="text-[10px] font-mono text-slate-400">Event Listener</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Đăng ký hàm callback được kích hoạt ngay khi dữ liệu câu hỏi từ khóa học đã sẵn sàng.
              </p>
              <div className="p-3 rounded-xl bg-[#080c16] font-mono text-xs text-emerald-300 border border-slate-800">
                <code>EveSDK.onDataReady((data) =&gt; &#123; loadQuestions(data.pairs); &#125;);</code>
              </div>
            </div>

            {/* Method 3: updateProgress */}
            <div className="p-6 rounded-3xl bg-[#0f1524] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-mono text-xs font-bold">
                  EveSDK.updateProgress(payload)
                </span>
                <span className="text-[10px] font-mono text-slate-400">Live Progress</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Gửi báo cáo điểm số và tiến độ khi học sinh trả lời từng câu để cập nhật thời gian thực lên phụ huynh/giáo viên.
              </p>
              <div className="p-3 rounded-xl bg-[#080c16] font-mono text-xs text-amber-300 border border-slate-800">
                <code>EveSDK.updateProgress(&#123; score: 80, currentStreak: 3, progressPercent: 60 &#125;);</code>
              </div>
            </div>

            {/* Method 4: finishGame */}
            <div className="p-6 rounded-3xl bg-[#0f1524] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 font-mono text-xs font-bold">
                  EveSDK.finishGame(payload)
                </span>
                <span className="text-[10px] font-mono text-slate-400">Result & Coins</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Gửi kết quả hoàn thành trận đấu lên server, xác thực qua Anti-Cheat Token, lưu kết quả và trao thưởng Coins.
              </p>
              <div className="p-3 rounded-xl bg-[#080c16] font-mono text-xs text-purple-300 border border-slate-800">
                <code>const res = await EveSDK.finishGame(&#123; score: 100, isWin: true &#125;);</code>
              </div>
            </div>

            {/* Method 5: playSound */}
            <div className="p-6 rounded-3xl bg-[#0f1524] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 font-mono text-xs font-bold">
                  EveSDK.playSound(type)
                </span>
                <span className="text-[10px] font-mono text-slate-400">Web Audio SFX</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Phát âm thanh hiệu ứng tự tạo bằng Web Audio API không cần tải file MP3 ngoài. Các loại âm thanh: <code className="text-cyan-300">"correct"</code>, <code className="text-red-300">"wrong"</code>, <code className="text-amber-300">"win"</code>, <code className="text-emerald-300">"coin"</code>.
              </p>
              <div className="p-3 rounded-xl bg-[#080c16] font-mono text-xs text-teal-300 border border-slate-800">
                <code>EveSDK.playSound("correct"); // hoặc "wrong", "win", "coin"</code>
              </div>
            </div>

            {/* Method 6: toggleFullscreen */}
            <div className="p-6 rounded-3xl bg-[#0f1524] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 font-mono text-xs font-bold">
                  EveSDK.toggleFullscreen()
                </span>
                <span className="text-[10px] font-mono text-slate-400">Display Helper</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tự động bật hoặc tắt chế độ toàn màn hình cho khung chứa game trên mọi trình duyệt và thiết bị di động.
              </p>
              <div className="p-3 rounded-xl bg-[#080c16] font-mono text-xs text-blue-300 border border-slate-800">
                <code>EveSDK.toggleFullscreen();</code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          7. TAB CONTENT 4: CÁC BƯỚC VIẾT CODE & VÍ DỤ
         ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === "steps" && (
        <div className="space-y-6">
          {/* Step 1 */}
          <div className="p-6 rounded-3xl bg-[#0f1524]/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono flex items-center justify-center text-xs">1</span>
                Nhúng thư viện SDK vào trang HTML
              </h3>
              <button
                onClick={() => handleCopy(sdkScriptTag, 1)}
                className="px-3 py-1.5 rounded-lg bg-[#151b2c] hover:bg-slate-800 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700"
              >
                {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedIndex === 1 ? "Đã chép" : "Sao chép"}
              </button>
            </div>
            <div className="p-4 rounded-xl bg-[#080c16] font-mono text-xs text-cyan-300 overflow-x-auto border border-slate-800/80">
              <code>{sdkScriptTag}</code>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-3xl bg-[#0f1524]/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono flex items-center justify-center text-xs">2</span>
                Khởi tạo phiên chơi và nhận câu hỏi bài học
              </h3>
              <button
                onClick={() => handleCopy(sdkInitCode, 2)}
                className="px-3 py-1.5 rounded-lg bg-[#151b2c] hover:bg-slate-800 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700"
              >
                {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedIndex === 2 ? "Đã chép" : "Sao chép"}
              </button>
            </div>
            <div className="p-4 rounded-xl bg-[#080c16] font-mono text-xs text-slate-200 overflow-x-auto border border-slate-800/80 whitespace-pre">
              <code>{sdkInitCode}</code>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-3xl bg-[#0f1524]/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-mono flex items-center justify-center text-xs">3</span>
                Báo cáo tiến độ thời gian thực & phát âm thanh
              </h3>
              <button
                onClick={() => handleCopy(sdkProgressCode, 3)}
                className="px-3 py-1.5 rounded-lg bg-[#151b2c] hover:bg-slate-800 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700"
              >
                {copiedIndex === 3 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedIndex === 3 ? "Đã chép" : "Sao chép"}
              </button>
            </div>
            <div className="p-4 rounded-xl bg-[#080c16] font-mono text-xs text-slate-200 overflow-x-auto border border-slate-800/80 whitespace-pre">
              <code>{sdkProgressCode}</code>
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-3xl bg-[#0f1524]/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 font-mono flex items-center justify-center text-xs">4</span>
                Nộp điểm hoàn thành & nhận thưởng Coins
              </h3>
              <button
                onClick={() => handleCopy(sdkFinishCode, 4)}
                className="px-3 py-1.5 rounded-lg bg-[#151b2c] hover:bg-slate-800 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700"
              >
                {copiedIndex === 4 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedIndex === 4 ? "Đã chép" : "Sao chép"}
              </button>
            </div>
            <div className="p-4 rounded-xl bg-[#080c16] font-mono text-xs text-slate-200 overflow-x-auto border border-slate-800/80 whitespace-pre">
              <code>{sdkFinishCode}</code>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          8. TAB CONTENT 5: TRÌNH THỬ NGHIỆM TRỰC TIẾP (INTERACTIVE SANDBOX)
         ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === "sandbox" && (
        <div className="p-6 rounded-3xl bg-[#0f1524] border border-cyan-500/30 space-y-5 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold mb-1">
              <Terminal className="w-3.5 h-3.5" /> Live Sandbox Simulation
            </div>
            <h3 className="text-lg font-bold text-white">Kiểm Tra Hoạt Động Của SDK Trực Tiếp Trên Trình Duyệt</h3>
            <p className="text-xs text-slate-400">
              Nhấp vào các nút bên dưới để xem phản hồi thực tế của các hàm SDK và lắng nghe âm thanh hiệu ứng Web Audio.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => runLiveTest("init")}
              className="px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-black font-mono font-bold text-xs border border-cyan-500/40 transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
            >
              <Play className="w-3.5 h-3.5" /> 1. Khởi tạo initSession()
            </button>

            <button
              onClick={() => runLiveTest("correct")}
              className="px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black font-mono font-bold text-xs border border-emerald-500/40 transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
            >
              <Volume2 className="w-3.5 h-3.5" /> 2. Trả lời Đúng + SFX
            </button>

            <button
              onClick={() => runLiveTest("wrong")}
              className="px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-black font-mono font-bold text-xs border border-red-500/40 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Volume2 className="w-3.5 h-3.5" /> 3. Trả lời Sai + SFX
            </button>

            <button
              onClick={() => runLiveTest("finish")}
              className="px-4 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500 text-purple-300 hover:text-black font-mono font-bold text-xs border border-purple-500/40 transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_10px_rgba(168,85,247,0.2)]"
            >
              <Trophy className="w-3.5 h-3.5" /> 4. Hoàn thành finishGame()
            </button>
          </div>

          {/* Console Log Output */}
          <div className="p-4 rounded-2xl bg-[#080c16] border border-slate-800 font-mono text-xs text-emerald-300 min-h-[120px] whitespace-pre-line leading-relaxed">
            {sandboxOutput || "> Sẵn sàng chạy mô phỏng. Hãy nhấp vào một trong các nút kiểm tra ở trên..."}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          9. TAB CONTENT 6: HƯỚNG DẪN ĐÓNG GÓI .ZIP & QUY TRÌNH KIỂM DUYỆT
         ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === "packaging" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#0f1524] border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FolderArchive className="w-5 h-5 text-cyan-400" /> Quy Chuẩn Đóng Gói Tệp Tin .ZIP Trước Khi Tải Lên
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Để hệ thống E-V-E có thể giải nén và chạy game trơn tru trên mọi trình duyệt, file nén <code className="text-cyan-300">.zip</code> của Thầy/Cô phải tuân thủ đúng cấu trúc thư mục sau:
            </p>

            <div className="p-4 rounded-xl bg-[#080c16] font-mono text-xs text-cyan-300 border border-slate-800/80 whitespace-pre">
              <code>{`📦 my_educational_game.zip
├── 📄 index.html        (BẮT BUỘC: File gốc chạy giao diện chính)
├── 📄 style.css         (Tùy chọn: File định kiểu CSS)
├── 📄 game.js           (BẮT BUỘC: File logic trò chơi & gọi SDK)
└── 📄 eve-game-sdk.js   (BẮT BUỘC: Thư viện E-V-E Game SDK v2.0)`}</code>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs leading-relaxed space-y-1.5">
              <div className="font-bold flex items-center gap-1.5">
                <Info className="w-4 h-4" /> Lưu ý quan trọng khi nén file:
              </div>
              <p>
                1. Hãy chọn trực tiếp các file bên trong thư mục game và bấm <strong>Compress to ZIP</strong> (Không nén cả thư mục cha bao bên ngoài). File <code className="font-mono bg-amber-500/20 px-1 py-0.5 rounded">index.html</code> phải nằm ngay ở cấp cao nhất của file .zip.
              </p>
              <p>
                2. Dung lượng file .zip tối đa là <strong>50 MB</strong>. Nếu game có nhiều hình ảnh hoặc âm thanh chất lượng cao, vui lòng tối ưu dung lượng trước khi tải lên.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/teacher/upload-center"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                <span>Chuyển Sang Trung Tâm Tải Lên Để Upload Game Ngay</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
