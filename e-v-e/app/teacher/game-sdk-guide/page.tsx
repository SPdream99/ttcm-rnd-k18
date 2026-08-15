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
  BookOpen,
  ArrowRight,
  FileCode,
  Sparkles,
  Maximize2,
  Volume2,
  Trophy,
  Play,
  Download,
  Package,
  Layers,
  FolderArchive,
  Info,
  Flame,
} from "lucide-react";

export default function TeacherGameSdkGuidePage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "pairs" | "api" | "steps" | "packaging">("overview");

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
    const session = await window.EveSDK.initSession({
      gameId: "my_custom_game_id",
      courseId: "crs_coding_basics"
    });

    console.log("Tên Khóa học:", session.courseTitle);
    console.log("Danh sách câu hỏi & giải thích:", session.pairs);

    window.EveSDK.onDataReady((data) => {
      loadGameQuestions(data.pairs);
    });
  }
});`;

  const sdkProgressCode = `// 2. Xử lý khi học sinh chọn đáp án & Báo cáo tiến độ thời gian thực
function onSelectAnswer(chosenText, rightAnswer, currentPair) {
  const isCorrect = chosenText.trim().toLowerCase() === rightAnswer.trim().toLowerCase();

  if (window.EveSDK) {
    if (isCorrect) {
      window.EveSDK.playSound("correct");
    } else {
      window.EveSDK.playSound("wrong");
    }

    window.EveSDK.updateProgress({
      score: currentScore,
      currentStreak: streak,
      progressPercent: Math.round((currentQuestionIndex / totalQuestions) * 100),
      explanation: isCorrect ? null : currentPair.explanation
    });
  }
}`;

  const sdkFinishCode = `// 3. Khi học sinh hoàn thành trò chơi & nộp kết quả nhận Coins
async function onGameComplete(isWon, finalScore, correctAnswersCount) {
  if (window.EveSDK) {
    if (isWon) {
      window.EveSDK.playSound("win");
    }

    const result = await window.EveSDK.finishGame({
      score: finalScore,
      isWin: isWon,
      correctCount: correctAnswersCount,
      totalCount: totalQuestions
    });

    console.log("Coins thưởng nhận được:", result.rewardCoins);
  }
}`;

  return (
    <div className="space-y-8 font-sans pb-16">
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b-2 border-zinc-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-200 bg-red-50 text-red-700 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-red-600" /> E-V-E Game SDK v2.0.0
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight flex items-center gap-2.5">
            <Code2 className="w-8 h-8 text-red-600" /> Tài Liệu & Tải Mã Nguồn Game SDK
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-3xl leading-relaxed">
            Thư viện chuẩn giúp Thầy/Cô phát triển trò chơi giáo dục bằng bất kỳ công nghệ web nào (HTML5, Canvas, React, Phaser, Three.js).
          </p>
        </div>

        <Link
          href="/teacher/upload-center"
          className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-sm shrink-0"
        >
          <Gamepad2 className="w-4 h-4" /> Đăng Tải Game Đã Đóng Gói (.ZIP) →
        </Link>
      </div>

      {/* 2. DIRECT DOWNLOAD PACKAGES */}
      <div className="space-y-3">
        <h2 className="text-sm text-zinc-900 font-bold uppercase tracking-wider flex items-center gap-2">
          <Download className="w-4 h-4 text-red-600" /> Tải Xuống Thư Viện SDK & Bộ Mã Nguồn Mẫu
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Starter Kit Boilerplate ZIP */}
          <div className="p-6 rounded-2xl bg-white border border-zinc-200 hover:border-red-600 transition-colors flex flex-col justify-between space-y-4 shadow-sm group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-bold">
                  KHUYÊN DÙNG 
                </span>
                <h3 className="text-base font-bold text-zinc-900 mt-1 group-hover:text-red-600 transition-colors">
                  Bộ Starter Kit Mẫu Cơ Bản (.ZIP)
                </h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Bao gồm đầy đủ file <code className="text-red-600 font-mono">index.html</code>, <code className="text-red-600 font-mono">game.js</code>, <code className="text-red-600 font-mono">style.css</code>, <code className="text-red-600 font-mono">eve-game-sdk.js</code> và 5 câu hỏi mẫu.
                </p>
              </div>
            </div>

            <a
              href="/eve_game_starter_kit.zip"
              download="eve_game_starter_kit.zip"
              className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4" /> Tải Bộ Starter Kit (.ZIP)
            </a>
          </div>

          {/* Card 2: Standalone eve-game-sdk.js */}
          <div className="p-6 rounded-2xl bg-white border border-zinc-200 hover:border-red-600 transition-colors flex flex-col justify-between space-y-4 shadow-sm group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center font-bold">
                <FileCode className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 text-[10px] font-bold">
                  THƯ VIỆN ĐỘC LẬP
                </span>
                <h3 className="text-base font-bold text-zinc-900 mt-1 group-hover:text-red-600 transition-colors">
                  File SDK Thuần (eve-game-sdk.js)
                </h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  File Javascript độc lập (11 KB), chứa toàn bộ API giao tiếp 2 chiều, Web Audio Synthesis và Fullscreen Controller.
                </p>
              </div>
            </div>

            <a
              href="/eve-game-sdk.js"
              download="eve-game-sdk.js"
              className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-900 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4" /> Tải eve-game-sdk.js (11KB)
            </a>
          </div>

          {/* Card 3: Advanced Boss Battle Sample Game ZIP */}
          <div className="p-6 rounded-2xl bg-white border border-zinc-200 hover:border-red-600 transition-colors flex flex-col justify-between space-y-4 shadow-sm group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-bold">
                  GAME NÂNG CAO 
                </span>
                <h3 className="text-base font-bold text-zinc-900 mt-1 group-hover:text-red-600 transition-colors">
                  Boss Slayer Marathon Quiz (.ZIP)
                </h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Đấu Trùm marathon 10s, phím mũi tên né đòn phản công QTE, combo sát thương và bảng xếp hạng.
                </p>
              </div>
            </div>

            <a
              href="/boss_battle_quiz.zip"
              download="boss_battle_quiz.zip"
              className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4" /> Tải Boss Battle (.ZIP)
            </a>
          </div>
        </div>
      </div>

      {/* 3. CATEGORY NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs border-b border-zinc-200">
        {[
          { id: "overview", label: " 1. Tổng Quan", icon: BookOpen },
          { id: "pairs", label: " 2. Cấu Trúc Câu Hỏi", icon: Layers },
          { id: "api", label: " 3. Tra Cứu API SDK", icon: Zap },
          { id: "steps", label: " 4. Các Bước Viết Code", icon: FileCode },
          { id: "packaging", label: " 5. Đóng Gói .ZIP", icon: FolderArchive },
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-t-xl whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer font-bold border-t border-x ${
                active
                  ? "bg-white text-red-600 border-zinc-200 border-b-2 border-b-white shadow-sm"
                  : "bg-zinc-50 text-zinc-600 border-transparent hover:text-zinc-900"
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-white border border-zinc-200 space-y-2 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-zinc-900">1. Sáng Tạo Tự Do</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Hỗ trợ mọi framework: React, Phaser 3, Three.js 3D, HTML5 Canvas hoặc Vanilla JS.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-zinc-200 space-y-2 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-zinc-900">2. Nạp Dữ Liệu Tự Động</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Hệ thống tự động nạp ngân hàng câu hỏi của bài học trực tiếp vào game.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-zinc-200 space-y-2 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                <Maximize2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-zinc-900">3. Toàn Màn Hình & Âm Thanh</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Tích hợp sẵn Fullscreen API và bộ tổng hợp âm thanh Web Audio.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-zinc-200 space-y-2 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-zinc-900">4. Chống Gian Lận</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Xác thực phiên chơi bằng Session Token, bảo vệ điểm số của học sinh.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: PAIRS */}
      {activeTab === "pairs" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-900">Cấu Trúc Cặp Dữ Liệu Câu Hỏi</h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Mỗi câu hỏi nạp vào game có đầy đủ Câu hỏi, Đáp án đúng, Phương án sai và Giải thích.
                </p>
              </div>
              <button
                onClick={() => handleCopy(samplePairsJson, 99)}
                className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-zinc-700 flex items-center gap-1.5 cursor-pointer border border-zinc-200"
              >
                {copiedIndex === 99 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedIndex === 99 ? "Đã chép" : "Sao chép JSON"}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900 font-mono text-xs text-zinc-100 overflow-x-auto whitespace-pre">
              <code>{samplePairsJson}</code>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: API REFERENCE */}
      {activeTab === "api" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-2">
              <span className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-bold">
                EveSDK.initSession(config)
              </span>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Khởi tạo phiên chơi và tự động kéo ngân hàng câu hỏi của khóa học.
              </p>
              <div className="p-3 rounded-xl bg-zinc-900 font-mono text-xs text-zinc-100">
                <code>const session = await EveSDK.initSession(&#123; gameId, courseId &#125;);</code>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-2">
              <span className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-bold">
                EveSDK.updateProgress(payload)
              </span>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Gửi báo cáo điểm số và tiến độ khi học sinh trả lời từng câu.
              </p>
              <div className="p-3 rounded-xl bg-zinc-900 font-mono text-xs text-zinc-100">
                <code>EveSDK.updateProgress(&#123; score: 80, currentStreak: 3 &#125;);</code>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-2">
              <span className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-bold">
                EveSDK.finishGame(payload)
              </span>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Gửi kết quả hoàn thành trận đấu lên server và trao thưởng Coins.
              </p>
              <div className="p-3 rounded-xl bg-zinc-900 font-mono text-xs text-zinc-100">
                <code>const res = await EveSDK.finishGame(&#123; score: 100, isWin: true &#125;);</code>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-2">
              <span className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-bold">
                EveSDK.playSound(type)
              </span>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Phát âm thanh hiệu ứng: "correct", "wrong", "win", "coin".
              </p>
              <div className="p-3 rounded-xl bg-zinc-900 font-mono text-xs text-zinc-100">
                <code>EveSDK.playSound("correct");</code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: STEPS */}
      {activeTab === "steps" && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-red-50 text-red-600 flex items-center justify-center text-xs font-bold">1</span>
                Nhúng thư viện SDK vào trang HTML
              </h3>
              <button
                onClick={() => handleCopy(sdkScriptTag, 1)}
                className="px-3 py-1 rounded-lg bg-zinc-100 text-xs font-bold text-zinc-700 hover:bg-zinc-200"
              >
                {copiedIndex === 1 ? "Đã chép" : "Sao chép"}
              </button>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900 font-mono text-xs text-zinc-100">
              <code>{sdkScriptTag}</code>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-red-50 text-red-600 flex items-center justify-center text-xs font-bold">2</span>
                Khởi tạo phiên chơi và nhận câu hỏi bài học
              </h3>
              <button
                onClick={() => handleCopy(sdkInitCode, 2)}
                className="px-3 py-1 rounded-lg bg-zinc-100 text-xs font-bold text-zinc-700 hover:bg-zinc-200"
              >
                {copiedIndex === 2 ? "Đã chép" : "Sao chép"}
              </button>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900 font-mono text-xs text-zinc-100 whitespace-pre overflow-x-auto">
              <code>{sdkInitCode}</code>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: PACKAGING */}
      {activeTab === "packaging" && (
        <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <FolderArchive className="w-5 h-5 text-red-600" /> Quy Chuẩn Đóng Gói File .ZIP
          </h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Để game chạy được trên hệ thống E-V-E, file nén .zip cần có cấu trúc sau:
          </p>

          <div className="p-4 rounded-xl bg-zinc-900 font-mono text-xs text-zinc-100 whitespace-pre">
            <code>{` my_game.zip
├──  index.html        (BẮT BUỘC)
├──  style.css         (Tùy chọn)
├──  game.js           (BẮT BUỘC)
└──  eve-game-sdk.js   (BẮT BUỘC)`}</code>
          </div>

          <div className="pt-2">
            <Link
              href="/teacher/upload-center"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors shadow-sm"
            >
              <span>Chuyển Sang Trung Tâm Tải Lên Game</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
