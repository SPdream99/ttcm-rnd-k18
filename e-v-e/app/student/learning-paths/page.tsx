"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Layers,
  Sparkles,
  CheckCircle2,
  Play,
  ArrowRight,
  Clock,
  Award,
  Compass,
  MapPin,
  Map,
} from "lucide-react";

export default function StudentLearningPathsPage() {
  const [filter, setFilter] = useState<"all" | "enrolled">("all");
  const [enrolledIds, setEnrolledIds] = useState<string[]>([
    "path_quantum_physics",
  ]);

  const [paths] = useState([
    {
      id: "path_quantum_physics",
      title: "Chinh Phục Vật Lý Lượng Tử K18",
      description: "Lộ trình học tập từ căn bản đến nâng cao về bản chất hạt ánh sáng, hàm sóng và nguyên lý bất định Heisenberg.",
      authorName: "ThS. Phạm Hoàng Nam",
      coursesCount: 3,
      requiredGamesTotal: 5,
      completedGamesTotal: 3,
      rewardCoins: 150,
      bannerGradient: "from-blue-600 via-indigo-600 to-cyan-500",
    },
    {
      id: "path_astronomy_deepspace",
      title: "Khám Phá Vũ Trụ & Thiên Văn Học Không Gian",
      description: "Tìm hiểu sự hình thành các chòm sao, chân trời sự kiện của hố đen và các vụ nổ siêu tân tinh (Supernova).",
      authorName: "GS. Nguyễn Văn An",
      coursesCount: 3,
      requiredGamesTotal: 6,
      completedGamesTotal: 0,
      rewardCoins: 180,
      bannerGradient: "from-purple-600 via-pink-600 to-indigo-700",
    },
    {
      id: "path_computational_thinking",
      title: "Tư Duy Thuật Toán & Logic Không Gian Số",
      description: "Rèn luyện tư duy giải thuật thông qua các mini-game logic, sắp xếp ma trận và đồ thị không gian.",
      authorName: "TS. Lê Thị Mai",
      coursesCount: 4,
      requiredGamesTotal: 8,
      completedGamesTotal: 0,
      rewardCoins: 220,
      bannerGradient: "from-emerald-600 via-teal-600 to-cyan-700",
    },
  ]);

  const handleToggleEnroll = (pathId: string) => {
    if (enrolledIds.includes(pathId)) {
      setEnrolledIds((prev) => prev.filter((id) => id !== pathId));
    } else {
      setEnrolledIds((prev) => [...prev, pathId]);
    }
  };

  const displayedPaths = paths.filter((p) => {
    if (filter === "enrolled") return enrolledIds.includes(p.id);
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/15">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-mono mb-2">
            <Compass className="w-3.5 h-3.5 text-cyan-400" /> Bản Đồ Học Tập Tự Do
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-7 h-7 text-cyan-400" /> Thư Viện Lộ Trình Tri Thức
          </h1>
          <p className="text-sm text-[#8e9bb4] mt-1">
            Bạn có thể đăng ký số lượng lộ trình tùy ý! Mỗi lộ trình là một Bản Đồ Kho Báu gồm chuỗi các trạm Course cần vượt qua bằng Game.
          </p>
        </div>

        {/* Filter Tab */}
        <div className="flex items-center gap-2 bg-[#151b2c] p-1.5 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              filter === "all"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Tất Cả Lộ Trình ({paths.length})
          </button>
          <button
            onClick={() => setFilter("enrolled")}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              filter === "enrolled"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Đã Đăng Ký ({enrolledIds.length})
          </button>
        </div>
      </div>

      {/* Path Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {displayedPaths.map((path) => {
          const isEnrolled = enrolledIds.includes(path.id);

          return (
            <div
              key={path.id}
              className="p-6 md:p-8 rounded-3xl bg-[#0f1524]/90 border border-[#7bd1fa]/15 hover:border-cyan-500/40 shadow-xl flex flex-col justify-between space-y-6 transition-all relative overflow-hidden group"
            >
              {/* Subtle Ambient Glow */}
              <div
                className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${path.bannerGradient} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity`}
              />

              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    {path.coursesCount} Trạm Khóa Học
                  </span>
                  <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                    +{path.rewardCoins} Coins Phá Đảo
                  </span>
                </div>

                <h2 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {path.title}
                </h2>
                <p className="text-xs text-[#8e9bb4] leading-relaxed line-clamp-3">
                  {path.description}
                </p>

                <div className="text-[11px] text-slate-400 font-mono pt-2">
                  Giảng viên biên soạn: <strong className="text-white">{path.authorName}</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
                <button
                  onClick={() => handleToggleEnroll(path.id)}
                  className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer border ${
                    isEnrolled
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      : "bg-[#151b2c] hover:bg-slate-800 text-slate-300 border-slate-700"
                  }`}
                >
                  {isEnrolled ? "✓ Đã Ghi Danh" : "+ Đăng Ký Học"}
                </button>

                <Link href={`/student/learning-paths/${path.id}`} className="w-full sm:w-auto">
                  <button className="w-full px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-cyan-300 text-white font-mono text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02]">
                    <Map className="w-4 h-4" /> Mở Bản Đồ Kho Báu →
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
