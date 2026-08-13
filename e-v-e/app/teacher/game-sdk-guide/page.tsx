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
} from "lucide-react";

export default function TeacherGameSdkGuidePage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [sandboxOutput, setSandboxOutput] = useState<string | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const sdkScriptTag = `<script src="/eve-game-sdk.js"></script>`;

  const sdkInitCode = `// 1. Khởi tạo SDK trong trò chơi của Thầy/Cô (HTML5 / Next.js / React / Phaser)
window.addEventListener("DOMContentLoaded", async () => {
  if (window.EveSDK) {
    // Tự động nhận dữ liệu câu hỏi từ khóa học mà học sinh đang học
    const session = await window.EveSDK.initSession({
      gameId: "my_custom_game_id",
      courseId: "crs_coding_basics" // hoặc tự lấy từ URL parameter
    });

    console.log("Khóa học:", session.courseTitle);
    console.log("Danh sách câu hỏi:", session.pairs);

    // Lắng nghe khi dữ liệu sẵn sàng
    window.EveSDK.onDataReady((data) => {
      // Nạp dữ liệu vào Game Engine của bạn
      loadGameQuestions(data.pairs);
    });
  }
});`;

  const sdkProgressCode = `// 2. Báo cáo tiến độ thời gian thực khi học sinh trả lời từng câu
function onQuestionAnswered(isCorrect, currentScore) {
  if (window.EveSDK) {
    if (isCorrect) {
      window.EveSDK.playSound("correct"); // Phát âm thanh đúng
    } else {
      window.EveSDK.playSound("wrong");   // Phát âm thanh sai
    }

    // Báo cáo tiến độ lên giao diện phụ huynh/giáo viên
    window.EveSDK.updateProgress({
      score: currentScore,
      currentStreak: streakCount,
      progressPercent: (currentQuestion / totalQuestions) * 100,
      currentQuestion: currentQuestion,
      totalQuestions: totalQuestions
    });
  }
}`;

  const sdkFinishCode = `// 3. Khi học sinh hoàn thành trò chơi, báo điểm & thưởng Coins an toàn
async function onGameCompleted(finalScore, accuracy) {
  if (window.EveSDK) {
    try {
      const result = await window.EveSDK.finishGame({
        score: finalScore,        // Điểm số chung cuộc (0 - 100)
        isWin: true,              // Đạt chuẩn qua bài
        accuracyPercent: accuracy,// Tỷ lệ chính xác %
        playTimeSeconds: 52,      // Thời gian chơi thực tế
        details: { mode: "ranked" }
      });

      console.log("Xác thực điểm và cộng Coins:", result);
      // Kết quả trả về: result.data.earnedCoins
    } catch (err) {
      console.error("Lỗi gửi kết quả:", err);
    }
  }
}`;

  const sdkFullscreenCode = `// 4. Kích hoạt toàn màn hình (Fullscreen API Helper)
document.getElementById("btn-fullscreen").addEventListener("click", () => {
  if (window.EveSDK) {
    window.EveSDK.toggleFullscreen(); // Tự động toggle phóng to / thu nhỏ canvas
  }
});`;

  // Sandbox Live Demo simulation
  const runLiveTest = () => {
    setSandboxOutput("Đang kết nối E-V-E Game SDK v2.0.0...");
    setTimeout(() => {
      setSandboxOutput(`[E-V-E SDK v2.0.0] Kết nối thành công!
- Game ID: demo_quiz_runner
- Course ID: crs_coding_basics
- Trạng thái: Session Token đã được ký chống gian lận (Anti-Cheat)
- Số câu hỏi nạp sẵn: 4 câu (JSON Pairs)
- Fullscreen API: Sẵn sàng
- Web Audio Engine: Sẵn sàng`);
    }, 800);
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/15">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> E-V-E Game SDK v2.0.0
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Code2 className="w-7 h-7 text-emerald-400" /> Hướng Dẫn Tích Hợp Game SDK (Dành Cho Giáo Viên)
          </h1>
          <p className="text-sm text-[#8e9bb4] mt-1">
            Tự do sáng tạo minigame giáo dục bằng Next.js, Phaser, Three.js hoặc HTML5 Canvas và kết nối tự động với hệ thống E-V-E.
          </p>
        </div>

        <Link
          href="/teacher/upload-center"
          className="px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
        >
          <Gamepad2 className="w-4 h-4" /> Đăng Tải Game Ngay →
        </Link>
      </div>

      {/* 4 Key Pillars */}
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
            Hệ thống tự động inject ngân hàng câu hỏi (JSON Pairs) của bài học trực tiếp vào game.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#0f1524]/90 border border-blue-500/20 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Maximize2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-white">3. Toàn Màn Hình & Âm Thanh</h3>
          <p className="text-xs text-[#8e9bb4] leading-relaxed">
            Tích hợp sẵn bộ điều khiển Fullscreen API và bộ tổng hợp âm thanh Web Audio (Đúng, Sai, Win).
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

      {/* Step by Step Code Implementation */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FileCode className="w-5 h-5 text-cyan-400" /> Các Bước Tích Hợp SDK Trong 5 Phút
        </h2>

        {/* Step 1: Include SDK */}
        <div className="p-6 rounded-3xl bg-[#0f1524]/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono flex items-center justify-center text-xs">1</span>
              Nhúng thư viện SDK vào trang HTML hoặc Component Game
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

        {/* Step 2: Init Session */}
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

        {/* Step 3: Progress & Sound */}
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

        {/* Step 4: Finish Game */}
        <div className="p-6 rounded-3xl bg-[#0f1524]/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 font-mono flex items-center justify-center text-xs">4</span>
              Báo cáo hoàn thành & cộng thưởng Coins
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

      {/* Interactive SDK Sandbox Tester */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#0f1524] border border-cyan-500/30 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyan-400" /> Trình Giả Lập & Thử Nghiệm SDK Trực Tuyến (Sandbox)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Thầy/Cô có thể chạy kiểm tra bắt tay handshake SDK trực tiếp trên trình duyệt.
            </p>
          </div>

          <button
            onClick={runLiveTest}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-black" /> Chạy Thử Nghiệm
          </button>
        </div>

        {sandboxOutput && (
          <div className="p-4 rounded-xl bg-[#080c16] border border-cyan-500/20 font-mono text-xs text-emerald-300 whitespace-pre leading-relaxed animate-fade-in">
            {sandboxOutput}
          </div>
        )}
      </div>
    </div>
  );
}
