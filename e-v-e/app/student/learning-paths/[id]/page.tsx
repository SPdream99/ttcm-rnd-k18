"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import {
  BookOpen,
  Lock,
  Unlock,
  CheckCircle2,
  Trophy,
  Play,
  ArrowLeft,
  Sparkles,
  Gamepad2,
  Star,
  Gift,
  Compass,
  FileText,
  ExternalLink,
  Code,
  Video,
} from "lucide-react";

interface PathDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface PathCourseNode {
  id: string;
  order: number;
  title: string;
  description: string;
  requiredGamesCount: number;  // Số trò chơi cần hoàn thành (y)
  completedGamesCount: number; // Số trò chơi đã hoàn thành (x)
  isUnlocked: boolean;         // Đã mở khóa hay chưa
  isCompleted: boolean;        // Đã hoàn thành 100% (x >= y)
  resources: {
    title: string;
    url: string;
    type: "pdf" | "video" | "code" | "slide" | "link";
  }[];
  compatibleGames: {
    id: string;
    title: string;
    type: string;
    reward: string;
  }[];
}

export default function LearningPathTreasureMapPage({ params }: PathDetailPageProps) {
  const resolvedParams = use(params);
  const pathId = resolvedParams.id;

  const [pathInfo] = useState({
    id: pathId,
    title: "Lộ Trình: Lập Trình & Khoa Học Máy Tính Cho Trẻ Em 🚀",
    description: "Lộ trình học tập trực quan từng bước: Học lý thuyết qua tài liệu, hoàn thành các trò chơi thực hành để mở khóa bài học tiếp theo và nhận phần thưởng hoàn thành lộ trình!",
    authorName: "ThS. Phạm Hoàng Nam",
    rewardCoins: 150,
  });

  // Course sequence data with unlock status, resources, and x/y game progress
  const [courses] = useState<PathCourseNode[]>([
    {
      id: "crs_coding_basics",
      order: 1,
      title: "Bài 1: Nhập Môn Tư Duy Lập Trình & Thuật Toán",
      description: "Làm quen với các khái niệm lập trình cơ bản: tuần tự, biến số, câu lệnh điều kiện và cách máy tính suy nghĩ.",
      requiredGamesCount: 1,
      completedGamesCount: 1, // Đã hoàn thành 1/1 -> Mở khóa Bài 2
      isUnlocked: true,
      isCompleted: true,
      resources: [
        { title: "Slide Bài Giảng: Nhập Môn Thuật Toán", url: "https://docs.google.com/presentation", type: "slide" },
        { title: "Tài Liệu Đọc: Khái Niệm Biến Số", url: "https://github.com", type: "pdf" },
      ],
      compatibleGames: [
        { id: "game_card_match_vr", title: "Ghép Cặp Thẻ Bài Thuật Toán", type: "Card Matching", reward: "+40 Coins" },
      ],
    },
    {
      id: "crs_computer_hardware",
      order: 2,
      title: "Bài 2: Khám Phá Phần Cứng & Kiến Trúc Máy Tính 3D",
      description: "Tìm hiểu cấu tạo bên trong máy tính: CPU, RAM, Card đồ họa GPU, Ổ cứng SSD và cách các linh kiện phối hợp.",
      requiredGamesCount: 2,
      completedGamesCount: 1, // 1/2 trò chơi -> Đang học, chưa mở Bài 3
      isUnlocked: true,
      isCompleted: false,
      resources: [
        { title: "Sơ Đồ 3D Kiến Trúc Máy Tính", url: "https://github.com", type: "slide" },
        { title: "Video Hướng Dẫn: CPU và RAM hoạt động thế nào?", url: "https://youtube.com", type: "video" },
      ],
      compatibleGames: [
        { id: "game_hardware_3d_lab", title: "Phòng Thí Nghiệm Lắp Ráp Máy Tính 3D", type: "3D Spatial Assembly", reward: "+70 Coins" },
        { id: "game_card_match_vr", title: "Ghép Cặp Linh Kiện Phần Cứng", type: "Card Matching", reward: "+40 Coins" },
      ],
    },
    {
      id: "crs_python_mini_games",
      order: 3,
      title: "Bài 3: Lập Trình Trò Chơi Mini Với Python",
      description: "Tự tay viết mã nguồn cho các mini-game tương tác vui nhộn và học cách xử lý lỗi (debug).",
      requiredGamesCount: 2,
      completedGamesCount: 0, // Bị khóa vì Bài 2 chưa xong (1/2)
      isUnlocked: false,
      isCompleted: false,
      resources: [
        { title: "Kho Code Mẫu Python Game Mini", url: "https://github.com", type: "code" },
      ],
      compatibleGames: [
        { id: "game_space_quiz_3d", title: "Space Flight Quantum Quiz 3D", type: "Action Quiz", reward: "+50 Coins" },
      ],
    },
    {
      id: "crs_ai_robotics",
      order: 4,
      title: "Bài 4: Khám Phá Trí Tuệ Nhân Tạo AI & Tương Lai Số",
      description: "Ứng dụng AI đơn giản, nhận diện hình ảnh và tạo ra trợ lý thông minh đầu tiên của bạn.",
      requiredGamesCount: 2,
      completedGamesCount: 0, // Bị khóa
      isUnlocked: false,
      isCompleted: false,
      resources: [
        { title: "Giáo Trình AI Cho Thiếu Nhi", url: "https://github.com", type: "pdf" },
      ],
      compatibleGames: [
        { id: "game_space_quiz_3d", title: "Space Flight Quantum Quiz 3D", type: "Action Quiz", reward: "+50 Coins" },
      ],
    },
  ]);

  const [selectedCourseForModal, setSelectedCourseForModal] = useState<PathCourseNode | null>(null);

  const totalCourses = courses.length;
  const completedCoursesCount = courses.filter((c) => c.isCompleted).length;
  const progressPercent = Math.round((completedCoursesCount / totalCourses) * 100);
  const isTreasureUnlocked = completedCoursesCount === totalCourses;

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-16">
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/15">
        <div>
          <Link
            href="/student/learning-paths"
            className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Quay Lại Danh Sách Lộ Trình
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Compass className="w-7 h-7 text-amber-400" /> {pathInfo.title}
          </h1>
          <p className="text-xs md:text-sm text-[#8e9bb4] mt-1 max-w-3xl">
            {pathInfo.description}
          </p>
        </div>

        {/* Path Progress Summary Box */}
        <div className="p-4 rounded-2xl bg-[#0f1524] border border-cyan-500/30 flex items-center gap-4 shrink-0 shadow-lg">
          <div>
            <div className="text-[11px] font-mono text-slate-400">Tiến Độ Lộ Trình</div>
            <div className="text-xl font-bold font-mono text-cyan-300">
              {completedCoursesCount}/{totalCourses} Bài ({progressPercent}%)
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Trophy className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ── LEARNING PATH VIEWPORT ── */}
      <div className="relative rounded-3xl bg-[#080c16] border-2 border-[#7bd1fa]/25 p-6 md:p-12 overflow-hidden shadow-2xl">
        {/* Subtle Constellation Grid Background */}
        <div
          className="absolute inset-0 z-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#7bd1fa 1.5px, transparent 1.5px)",
            backgroundSize: "36px 36px",
          }}
        />

        {/* Map Header Title */}
        <div className="text-center relative z-10 mb-12">
          <span className="px-4 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold tracking-widest uppercase inline-block mb-2 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            🎯 LỘ TRÌNH HỌC TẬP TỪNG BƯỚC
          </span>
          <p className="text-xs text-slate-400 font-mono">
            Quy tắc: Hoàn thành đủ số trò chơi thực hành <span className="text-cyan-300 font-bold">"x/y trò"</span> tại mỗi bài để mở khóa bài học kế tiếp!
          </p>
        </div>

        {/* ── COURSE TRAIL SEQUENCE ── */}
        <div className="relative z-10 max-w-2xl mx-auto space-y-12">
          {courses.map((course, index) => {
            const isLast = index === courses.length - 1;
            const progressRatio = `${course.completedGamesCount}/${course.requiredGamesCount}`;

            return (
              <div key={course.id} className="relative flex flex-col items-center">
                {/* ── Course Node Card ── */}
                <div
                  onClick={() => {
                    if (course.isUnlocked) {
                      setSelectedCourseForModal(course);
                    }
                  }}
                  className={`w-full p-6 md:p-7 rounded-3xl border-2 transition-all duration-300 relative select-none ${
                    course.isCompleted
                      ? "bg-gradient-to-r from-[#0d1a24] to-[#0f241d] border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.25)] cursor-pointer hover:scale-[1.01]"
                      : course.isUnlocked
                      ? "bg-gradient-to-r from-[#0f1b30] via-[#12203d] to-[#0f1b30] border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.35)] cursor-pointer hover:scale-[1.02] ring-2 ring-cyan-400/30"
                      : "bg-[#0a0d14]/90 border-slate-800/80 opacity-60 grayscale-[70%] cursor-not-allowed"
                  }`}
                >
                  {/* Status Ribbon */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-8 h-8 rounded-xl font-mono text-xs font-extrabold flex items-center justify-center border ${
                          course.isCompleted
                            ? "bg-emerald-500 text-black border-emerald-400"
                            : course.isUnlocked
                            ? "bg-cyan-500 text-black border-cyan-400"
                            : "bg-slate-800 text-slate-500 border-slate-700"
                        }`}
                      >
                        0{course.order}
                      </span>

                      <span
                        className={`text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                          course.isCompleted
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                            : course.isUnlocked
                            ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse"
                            : "bg-slate-800 text-slate-500 border-slate-700"
                        }`}
                      >
                        {course.isCompleted
                          ? "✓ Đã Hoàn Thành Bài Này"
                          : course.isUnlocked
                          ? "⚡ Đang Học - Cần Vượt Thử Thách"
                          : "🔒 Bị Khóa (Cần hoàn thành bài trước)"}
                      </span>
                    </div>

                    {/* Icon */}
                    <div>
                      {course.isCompleted ? (
                        <div className="flex items-center gap-1 text-emerald-400">
                          <Star className="w-4 h-4 fill-emerald-400" />
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      ) : course.isUnlocked ? (
                        <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 animate-bounce">
                          <Unlock className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400 border border-slate-700">
                          <Lock className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3
                    className={`text-lg md:text-xl font-bold font-sans transition-colors ${
                      course.isCompleted
                        ? "text-emerald-200"
                        : course.isUnlocked
                        ? "text-white"
                        : "text-slate-500"
                    }`}
                  >
                    {course.title}
                  </h3>
                  <p
                    className={`text-xs mt-1.5 leading-relaxed ${
                      course.isUnlocked ? "text-[#8e9bb4]" : "text-slate-600"
                    }`}
                  >
                    {course.description}
                  </p>

                  {/* Progress & Game Completion Counter (x/y) */}
                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="text-xs font-mono">
                        <span className="text-slate-400">Yêu cầu hoàn thành: </span>
                        <strong
                          className={`text-sm ${
                            course.isCompleted
                              ? "text-emerald-400"
                              : course.isUnlocked
                              ? "text-cyan-300 font-extrabold"
                              : "text-slate-500"
                          }`}
                        >
                          {progressRatio} Trò Chơi
                        </strong>
                      </div>

                      {/* Mini Progress Bar */}
                      <div className="w-24 h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            course.isCompleted
                              ? "bg-emerald-400"
                              : "bg-cyan-400"
                          }`}
                          style={{
                            width: `${(course.completedGamesCount / course.requiredGamesCount) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Action Button inside Card */}
                    <div>
                      {course.isUnlocked ? (
                        <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-mono text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center gap-1.5">
                          <Play className="w-3.5 h-3.5 fill-white" /> Mở Bài Học & Trò Chơi
                        </button>
                      ) : (
                        <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5" /> Khóa
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── DASHED CONNECTING ARROW (MŨI TÊN ĐỨT ĐOẠN) ── */}
                {!isLast && (
                  <div className="my-2 flex flex-col items-center justify-center">
                    <svg width="40" height="60" viewBox="0 0 40 60" className="overflow-visible">
                      <line
                        x1="20"
                        y1="0"
                        x2="20"
                        y2="50"
                        stroke={course.isCompleted ? "#10b981" : "#38bdf8"}
                        strokeWidth="3"
                        strokeDasharray="6,6"
                        className="animate-pulse"
                      />
                      <polygon
                        points="14,48 20,60 26,48"
                        fill={course.isCompleted ? "#10b981" : "#38bdf8"}
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}

          {/* ── FINAL DESTINATION: REWARD & CERTIFICATE ── */}
          <div className="flex flex-col items-center pt-6">
            <svg width="40" height="50" viewBox="0 0 40 50" className="overflow-visible mb-2">
              <line
                x1="20"
                y1="0"
                x2="20"
                y2="40"
                stroke={isTreasureUnlocked ? "#f59e0b" : "#475569"}
                strokeWidth="3"
                strokeDasharray="6,6"
              />
              <polygon
                points="14,38 20,48 26,38"
                fill={isTreasureUnlocked ? "#f59e0b" : "#475569"}
              />
            </svg>

            {/* Reward Box */}
            <div
              className={`max-w-md w-full p-8 rounded-3xl border-2 text-center space-y-4 relative transition-all ${
                isTreasureUnlocked
                  ? "bg-gradient-to-b from-[#1a140a] to-[#241a0b] border-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.4)] animate-bounce-slow"
                  : "bg-[#0d111a] border-slate-800 opacity-70"
              }`}
            >
              <div className="w-20 h-20 rounded-full bg-amber-500/20 border border-amber-500/40 mx-auto flex items-center justify-center text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)]">
                <Gift className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">Chứng Nhận Hoàn Thành Lộ Trình 🎓</h3>
                <p className="text-xs text-[#8e9bb4] mt-1">
                  Hoàn thành toàn bộ các bài học trong lộ trình để nhận thưởng Coins và Huy hiệu danh giá.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono font-bold text-sm">
                <Trophy className="w-4 h-4 text-amber-400" /> Thưởng Hoàn Tất: +{pathInfo.rewardCoins} Coins
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL: HỌC LIỆU & DANH SÁCH GAME CHO BÀI HỌC ĐÃ MỞ KHÓA ── */}
      {selectedCourseForModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-3xl bg-[#0f1524] border border-cyan-500/40 p-6 md:p-8 space-y-6 shadow-2xl animate-scale-up max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="font-mono text-[10px] uppercase text-cyan-400 font-bold">
                  Bài 0{selectedCourseForModal.order} • Trung Tâm Bài Học & Thực Hành
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{selectedCourseForModal.title}</h3>
                <div className="text-xs font-mono text-slate-400 mt-1">
                  Tiến độ bài này: <strong className="text-cyan-300">{selectedCourseForModal.completedGamesCount}/{selectedCourseForModal.requiredGamesCount} trò chơi hoàn thành</strong>
                </div>
              </div>

              <button
                onClick={() => setSelectedCourseForModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* 1. Resources & Study Materials */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase text-emerald-400 font-bold flex items-center gap-1.5">
                <FileText className="w-4 h-4" /> 1. Tài Liệu & Code Mẫu Do Giáo Viên Cung Cấp
              </h4>

              <div className="space-y-2">
                {(selectedCourseForModal.resources || []).map((res, rIdx) => (
                  <a
                    key={rIdx}
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3.5 rounded-xl bg-[#151b2c] hover:bg-emerald-950/20 border border-slate-800 hover:border-emerald-500/40 flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform">
                        {res.type === "code" ? <Code className="w-4 h-4" /> : res.type === "video" ? <Video className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-emerald-300">{res.title}</div>
                        <div className="text-[10px] text-slate-400 font-mono capitalize">Loại: {res.type}</div>
                      </div>
                    </div>

                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* 2. Compatible Games */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold flex items-center gap-1.5">
                <Gamepad2 className="w-4 h-4" /> 2. Trò Chơi Thực Hành Để Mở Khóa Bài Kế Tiếp
              </h4>

              <div className="space-y-2.5">
                {selectedCourseForModal.compatibleGames.map((game) => (
                  <div
                    key={game.id}
                    className="p-4 rounded-2xl bg-[#151b2c] border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-sm text-white">{game.title}</div>
                      <div className="text-[11px] text-[#8e9bb4] font-mono mt-0.5">
                        Thể loại: {game.type} • {game.reward}
                      </div>
                    </div>

                    <Link href={`/student/play/${game.id}/${selectedCourseForModal.id}`}>
                      <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-mono text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.35)] transition-all cursor-pointer flex items-center gap-1.5 shrink-0">
                        <Play className="w-3.5 h-3.5 fill-current" /> Bắt Đầu Chơi
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setSelectedCourseForModal(null)}
                className="text-xs font-mono text-slate-400 hover:text-white hover:underline"
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
