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
} from "lucide-react";

export default function TeacherGameSdkGuidePage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const sdkScriptTag = `<script src="/eve-game-sdk.js"></script>`;

  const sdkInitCode = `// 1. Khởi tạo SDK trong trò chơi của Thầy/Cô (HTML5 / Next.js / React)
window.addEventListener("DOMContentLoaded", () => {
  if (window.EveSDK) {
    // Lấy thông tin bài học và dữ liệu kiến thức được bốc tự động từ Course
    const courseData = window.EveSDK.getCourseData();
    console.log("Dữ liệu câu hỏi/kiến thức bài học:", courseData.pairs);

    // Bắt đầu phiên chơi (tự động ký Session Token chống Hack Điểm)
    window.EveSDK.initSession({
      gameId: "my_custom_game",
      courseId: courseData.courseId,
    });
  }
});`;

  const sdkFinishCode = `// 2. Khi học sinh hoàn thành trò chơi, báo điểm lên máy chủ E-V-E
function onGameCompleted(finalScore, starsEarned) {
  if (window.EveSDK) {
    window.EveSDK.finishGame({
      score: finalScore,      // Ví dụ: 100
      stars: starsEarned,     // Ví dụ: 3
      gameplayTimeSeconds: 45 // Thời gian chơi thực tế
    }).then((result) => {
      console.log("Cập nhật điểm và thưởng Coins thành công:", result);
      // Hiển thị màn hình chúc mừng học sinh
    }).catch((err) => {
      console.error("Lỗi xác thực điểm:", err);
    });
  }
}`;

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/15">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Code2 className="w-7 h-7 text-emerald-400" /> Hướng Dẫn Tích Hợp Game SDK (Dành Cho Giáo Viên)
          </h1>
          <p className="text-sm text-[#8e9bb4] mt-1">
            Tự do sáng tạo minigame giáo dục bằng Next.js, Phaser, Three.js hoặc HTML5 và kết nối với nền tảng E-V-E.
          </p>
        </div>

        <Link
          href="/teacher/upload-center"
          className="px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold transition-all flex items-center gap-2"
        >
          <Gamepad2 className="w-4 h-4" /> Đăng Tải Game Ngay
        </Link>
      </div>

      {/* 3 Pillars Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-[#0f1524]/90 border border-emerald-500/20 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-white">1. Sáng Tạo Tùy Ý</h3>
          <p className="text-xs text-[#8e9bb4] leading-relaxed">
            Giáo viên có thể lập trình bất kỳ thể loại game nào: Quiz, Card Matching, 3D PC Lab, mô phỏng vật lý, thuật toán...
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#0f1524]/90 border border-cyan-500/20 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-white">2. Bốc Dữ Liệu Tự Động</h3>
          <p className="text-xs text-[#8e9bb4] leading-relaxed">
            Game tự động lấy các cặp câu hỏi JSON pairs từ bài học của Thầy/Cô mà không cần viết lại mã nguồn.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#0f1524]/90 border border-amber-500/20 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-white">3. Chống Hack & Cheat Engine</h3>
          <p className="text-xs text-[#8e9bb4] leading-relaxed">
            Hệ thống tự động ký Session Token mã hóa tại Server và kiểm tra thời gian chơi thực tế trước khi cộng điểm/Coins.
          </p>
        </div>
      </div>

      {/* Step by step implementation */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-emerald-400" /> Các Bước Tích Hợp SDK Đơn Giản
        </h2>

        {/* Step 1 */}
        <div className="p-6 rounded-2xl bg-[#0f1524] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-emerald-300 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">1</span>
              Nhúng thư viện SDK vào trang Web / Game của Thầy/Cô
            </h3>
            <button
              onClick={() => handleCopy(sdkScriptTag, 1)}
              className="hover:text-emerald-400 flex items-center gap-1 text-xs font-mono text-slate-400 cursor-pointer"
            >
              {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedIndex === 1 ? "Đã chép" : "Sao chép"}</span>
            </button>
          </div>
          <div className="p-3 rounded-xl bg-[#090d18] border border-slate-800 font-mono text-xs text-cyan-300">
            <code>{sdkScriptTag}</code>
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-6 rounded-2xl bg-[#0f1524] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-cyan-300 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs">2</span>
              Khởi tạo phiên chơi & Đọc dữ liệu kiến thức từ bài học
            </h3>
            <button
              onClick={() => handleCopy(sdkInitCode, 2)}
              className="hover:text-cyan-400 flex items-center gap-1 text-xs font-mono text-slate-400 cursor-pointer"
            >
              {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedIndex === 2 ? "Đã chép" : "Sao chép"}</span>
            </button>
          </div>
          <pre className="p-4 rounded-xl bg-[#090d18] border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto">
            <code>{sdkInitCode}</code>
          </pre>
        </div>

        {/* Step 3 */}
        <div className="p-6 rounded-2xl bg-[#0f1524] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-amber-300 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs">3</span>
              Gửi điểm & Hoàn thành vòng chơi
            </h3>
            <button
              onClick={() => handleCopy(sdkFinishCode, 3)}
              className="hover:text-amber-400 flex items-center gap-1 text-xs font-mono text-slate-400 cursor-pointer"
            >
              {copiedIndex === 3 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedIndex === 3 ? "Đã chép" : "Sao chép"}</span>
            </button>
          </div>
          <pre className="p-4 rounded-xl bg-[#090d18] border border-slate-800 font-mono text-xs text-amber-200 overflow-x-auto">
            <code>{sdkFinishCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
