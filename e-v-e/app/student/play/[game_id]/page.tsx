"use client";

import React, { use } from "react";
import Link from "next/link";
import {
  Gamepad2,
  BookOpen,
  ArrowLeft,
  Trophy,
  Play,
  Layers,
  Sparkles,
  Info,
  Clock,
  Coins,
} from "lucide-react";

interface GameLobbyProps {
  params: Promise<{
    game_id: string;
  }>;
}

const GAME_CATALOG: Record<string, { title: string; subtitle: string; category: string; description: string; author: string; defaultCourseId: string; compatibleCourses: Array<{ id: string; title: string; difficulty: string }> }> = {
  game_space_quiz_3d: {
    title: "Quiz Runner 3D - Trắc Nghiệm Tốc Độ",
    subtitle: "Thử Thách Phản Xạ & Kiểm Tra Kiến Thức",
    category: "Action Quiz 3D",
    description: "Trò chơi trắc nghiệm tốc độ kết hợp phản xạ: Đọc kỹ câu hỏi trích xuất từ bài học và chọn đáp án chính xác nhất để ghi điểm, duy trì chuỗi combo và tích lũy Coins thưởng.",
    author: "GS. Nguyễn Văn An & Ban Học Thuật E-V-E",
    defaultCourseId: "crs_coding_basics",
    compatibleCourses: [
      { id: "crs_coding_basics", title: "Bài 1: Nhập Môn Tư Duy Lập Trình & Thuật Toán", difficulty: "Cơ Bản" },
      { id: "crs_python_mini_games", title: "Bài 3: Lập Trình Trò Chơi Mini Với Python", difficulty: "Trung Cấp" },
      { id: "crs_ai_robotics", title: "Bài 4: Khám Phá Trí Tuệ Nhân Tạo AI & Tương Lai Số", difficulty: "Nâng Cao" },
    ],
  },
  game_hardware_3d_lab: {
    title: "Phòng Thí Nghiệm Lắp Ráp Máy Tính 3D",
    subtitle: "Mô Phỏng Kiến Trúc Phần Cứng Trực Quan",
    category: "3D Hardware Assembly",
    description: "Khám phá cấu tạo bên trong thùng máy PC: Chọn các linh kiện quan trọng (CPU, RAM, GPU, SSD, Bộ Nguồn PSU) và lắp ráp chuẩn xác vào Bo mạch chủ Motherboard để kích nguồn kiểm tra hệ thống.",
    author: "ThS. Phạm Hoàng Nam",
    defaultCourseId: "crs_computer_hardware",
    compatibleCourses: [
      { id: "crs_computer_hardware", title: "Bài 2: Khám Phá Phần Cứng & Kiến Trúc Máy Tính 3D", difficulty: "Thực Hành" },
    ],
  },
  game_card_match_vr: {
    title: "Ghép Cặp Thẻ Bài Thuật Toán (Memory Match)",
    subtitle: "Luyện Trí Nhớ & Khắc Sâu Định Nghĩa",
    category: "Memory Card Matrix",
    description: "Trò chơi lật thẻ bài kinh điển: Tìm và ghép đôi thẻ chứa Khái niệm (Thuật ngữ) với thẻ chứa Định nghĩa tương ứng của bài học.",
    author: "TS. Lê Thị Mai",
    defaultCourseId: "crs_coding_basics",
    compatibleCourses: [
      { id: "crs_coding_basics", title: "Bài 1: Nhập Môn Tư Duy Lập Trình & Thuật Toán", difficulty: "Cơ Bản" },
      { id: "crs_computer_hardware", title: "Bài 2: Khám Phá Phần Cứng & Kiến Trúc Máy Tính 3D", difficulty: "Thực Hành" },
    ],
  },
};

export default function GameLobbyPage({ params }: GameLobbyProps) {
  const resolvedParams = use(params);
  const { game_id: gameId } = resolvedParams;

  const gameInfo = GAME_CATALOG[gameId] || {
    title: gameId.replace(/_/g, " ").toUpperCase(),
    subtitle: "Minigame Tương Tác Học Tập",
    category: "Interactive Minigame",
    description: "Minigame giáo dục trực quan, tương tác học liệu và củng cố kiến thức theo từng bài học.",
    author: "Giảng Viên E-V-E",
    defaultCourseId: "crs_coding_basics",
    compatibleCourses: [
      { id: "crs_coding_basics", title: "Bài 1: Nhập Môn Tư Duy Lập Trình & Thuật Toán", difficulty: "Cơ Bản" },
    ],
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-12">
      {/* Header Bar */}
      <div className="flex items-center gap-3 pb-6 border-b border-[#7bd1fa]/15">
        <Link
          href="/student/learning-paths"
          className="p-2 rounded-xl bg-[#151b2c] hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="text-xs font-mono text-cyan-400 uppercase font-bold flex items-center gap-1.5">
            <Gamepad2 className="w-3.5 h-3.5" /> Thông Tin Trò Chơi
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1">
            {gameInfo.title}
          </h1>
        </div>
      </div>

      {/* Main Showcase Hero */}
      <div className="p-6 md:p-10 rounded-3xl bg-[#0f1524]/90 border border-cyan-500/30 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="space-y-3 relative z-10 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold">
              {gameInfo.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold">
              Hỗ trợ {gameInfo.compatibleCourses.length} Khóa Học
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-black text-white">{gameInfo.subtitle}</h2>
          <p className="text-sm text-[#8e9bb4] leading-relaxed">{gameInfo.description}</p>
          <div className="text-xs text-slate-400 font-mono">
            Tác giả: <strong className="text-white">{gameInfo.author}</strong>
          </div>
        </div>

        {/* Quick Launch default course button */}
        <div className="pt-4 flex items-center gap-4 relative z-10">
          <Link href={`/student/play/${gameId}/${gameInfo.defaultCourseId}`}>
            <button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-cyan-300 text-white font-mono text-xs font-bold shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center gap-2 hover:scale-105">
              <Play className="w-4 h-4" /> Vào Chơi Ngay (Khóa Học Tiêu Chuẩn) →
            </button>
          </Link>
        </div>
      </div>

      {/* Compatible Courses Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-400" /> Chọn Khóa Học Để Trải Nghiệm Cùng Trò Chơi Này
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gameInfo.compatibleCourses.map((crs) => (
            <div
              key={crs.id}
              className="p-5 rounded-2xl bg-[#0f1524] border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <span className="px-2 py-0.5 rounded bg-white/5 border border-slate-700 text-[10px] font-mono text-cyan-300">
                  Độ khó: {crs.difficulty}
                </span>
                <h4 className="font-bold text-sm text-white">{crs.title}</h4>
              </div>

              <Link href={`/student/play/${gameId}/${crs.id}`}>
                <button className="w-full py-2.5 rounded-xl bg-[#151b2c] hover:bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30 transition-all cursor-pointer flex items-center justify-center gap-1.5">
                  <Play className="w-3.5 h-3.5" /> Bắt Đầu Chơi Bài Này →
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
