"use client";

import React, { use } from "react";
import Link from "next/link";
import {
  Gamepad2,
  BookOpen,
  ArrowLeft,
  Play,
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
    description: "Trò chơi trắc nghiệm tốc độ: Đọc kỹ câu hỏi trích xuất từ bài học và chọn đáp án chính xác nhất để ghi điểm và tích lũy Coins thưởng.",
    author: "Ban Học Thuật E-V-E",
    defaultCourseId: "crs_coding_basics",
    compatibleCourses: [
      { id: "crs_coding_basics", title: "Bài 1: Nhập Môn Tư Duy Lập Trình & Thuật Toán", difficulty: "Cơ Bản" },
      { id: "crs_python_mini_games", title: "Bài 3: Lập Trình Trò Chơi Mini Với Python", difficulty: "Trung Cấp" },
      { id: "crs_ai_robotics", title: "Bài 4: Khám Phá Trí Tuệ Nhân Tạo AI", difficulty: "Nâng Cao" },
    ],
  },
  game_hardware_3d_lab: {
    title: "Phòng Thí Nghiệm Lắp Ráp Máy Tính 3D",
    subtitle: "Mô Phỏng Kiến Trúc Phần Cứng Trực Quan",
    category: "3D Hardware Assembly",
    description: "Khám phá cấu tạo bên trong thùng máy PC: Chọn các linh kiện quan trọng (CPU, RAM, GPU, SSD) và lắp ráp chuẩn xác vào bo mạch chủ.",
    author: "ThS. Phạm Hoàng Nam",
    defaultCourseId: "crs_computer_hardware",
    compatibleCourses: [
      { id: "crs_computer_hardware", title: "Bài 2: Khám Phá Phần Cứng Máy Tính 3D", difficulty: "Thực Hành" },
    ],
  },
  game_card_match_vr: {
    title: "Ghép Cặp Thẻ Bài Thuật Toán (Memory Match)",
    subtitle: "Luyện Trí Nhớ & Khắc Sâu Định Nghĩa",
    category: "Memory Card Matrix",
    description: "Trò chơi lật thẻ bài: Tìm và ghép đôi thẻ chứa Khái niệm với thẻ chứa Định nghĩa tương ứng của bài học.",
    author: "TS. Lê Thị Mai",
    defaultCourseId: "crs_coding_basics",
    compatibleCourses: [
      { id: "crs_coding_basics", title: "Bài 1: Nhập Môn Tư Duy Lập Trình & Thuật Toán", difficulty: "Cơ Bản" },
      { id: "crs_computer_hardware", title: "Bài 2: Khám Phá Phần Cứng Máy Tính 3D", difficulty: "Thực Hành" },
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
    <div className="space-y-8 font-sans pb-12">
      {/* Header Bar */}
      <div className="flex items-center gap-3 pb-6 border-b-2 border-zinc-200">
        <Link
          href="/student/learning-paths"
          className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-900 transition-colors cursor-pointer border border-zinc-200"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="text-xs text-red-600 uppercase font-bold flex items-center gap-1.5">
            <Gamepad2 className="w-3.5 h-3.5" /> Thông Tin Trò Chơi
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight mt-1">
            {gameInfo.title}
          </h1>
        </div>
      </div>

      {/* Main Showcase Hero */}
      <div className="p-6 md:p-8 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-5">
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
              {gameInfo.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-bold">
              Hỗ trợ {gameInfo.compatibleCourses.length} Bài Học
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-zinc-900">{gameInfo.subtitle}</h2>
          <p className="text-sm text-zinc-600 leading-relaxed">{gameInfo.description}</p>
          <div className="text-xs text-zinc-500">
            Tác giả: <strong className="text-zinc-900">{gameInfo.author}</strong>
          </div>
        </div>

        {/* Quick Launch default course button */}
        <div className="pt-2 flex items-center gap-4">
          <Link href={`/student/play/${gameId}/${gameInfo.defaultCourseId}`}>
            <button className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer flex items-center gap-2">
              <Play className="w-4 h-4" /> Vào Chơi Ngay →
            </button>
          </Link>
        </div>
      </div>

      {/* Compatible Courses Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-red-600" /> Chọn Bài Học Để Trải Nghiệm Cùng Trò Chơi Này
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gameInfo.compatibleCourses.map((crs) => (
            <div
              key={crs.id}
              className="p-5 rounded-2xl bg-white border border-zinc-200 hover:border-red-600 transition-colors flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="space-y-2">
                <span className="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-[10px] font-bold text-zinc-700">
                  Độ khó: {crs.difficulty}
                </span>
                <h4 className="font-bold text-sm text-zinc-900">{crs.title}</h4>
              </div>

              <Link href={`/student/play/${gameId}/${crs.id}`}>
                <button className="w-full py-2.5 rounded-xl bg-zinc-100 hover:bg-red-600 text-zinc-800 hover:text-white text-xs font-bold border border-zinc-200 hover:border-red-600 transition-colors cursor-pointer flex items-center justify-center gap-1.5">
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
