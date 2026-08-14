"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Layers,
  Sparkles,
  CheckCircle2,
  Play,
  ArrowRight,
  Compass,
  Award,
} from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function StudentLearningPathsPage() {
  const [filter, setFilter] = useState<"all" | "enrolled">("all");
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const [paths, setPaths] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPaths() {
      try {
        setLoading(true);
        // Load enrolled IDs from local storage if available
        if (typeof window !== "undefined") {
          const saved = JSON.parse(localStorage.getItem("eve_enrolled_paths") || "[]");
          setEnrolledIds(saved);
        }

        const snap = await getDocs(collection(db, "learning_path"));
        const realPaths = snap.docs.map((d) => {
          const data = d.data();
          const coursesList = Array.isArray(data.courses) ? data.courses : [];
          return {
            id: d.id,
            title: data.title || "Lộ trình đào tạo",
            description: data.description || "Lộ trình học tập toàn diện được thiết kế bởi giảng viên.",
            authorName: data.authorName || data.instructorName || "Giáo Viên E-V-E",
            coursesCount: coursesList.length,
            requiredGamesTotal: coursesList.length,
            completedGamesTotal: 0,
            rewardCoins: Number(data.rewardCoins) || (coursesList.length * 50),
            bannerGradient: data.bannerGradient || "from-blue-600 via-indigo-600 to-cyan-500",
          };
        });

        setPaths(realPaths);
      } catch (err) {
        console.warn("Lỗi tải lộ trình học tập:", err);
      } finally {
        setLoading(false);
      }
    }

    loadPaths();
  }, []);

  const handleToggleEnroll = (pathId: string) => {
    let next: string[];
    if (enrolledIds.includes(pathId)) {
      next = enrolledIds.filter((id) => id !== pathId);
    } else {
      next = [...enrolledIds, pathId];
    }
    setEnrolledIds(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("eve_enrolled_paths", JSON.stringify(next));
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
            <Compass className="w-3.5 h-3.5 text-cyan-400" /> Khám Phá Lộ Trình Học Tập
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Lộ Trình Học & Chinh Phục Kiến Thức
          </h1>
          <p className="text-sm text-[#8e9bb4] mt-1">
            Các chuỗi bài học chuẩn hóa kết hợp cùng minigame thử thách do chính thầy cô giáo phát triển.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 bg-[#151b2c] p-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setFilter("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              filter === "all"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Tất Cả ({paths.length})
          </button>
          <button
            onClick={() => setFilter("enrolled")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              filter === "enrolled"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Đang Học ({enrolledIds.length})
          </button>
        </div>
      </div>

      {/* Grid Container */}
      {loading ? (
        <div className="text-center py-20 bg-[#0f1524]/60 rounded-3xl border border-slate-800">
          <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm font-sans">Đang tải danh sách lộ trình học tập thực tế...</p>
        </div>
      ) : displayedPaths.length === 0 ? (
        <div className="text-center py-20 bg-[#0f1524]/60 rounded-3xl border border-slate-800 p-8">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-1 font-sans">
            {filter === "enrolled"
              ? "Bạn chưa đăng ký lộ trình học tập nào"
              : "Chưa có lộ trình học tập nào được xuất bản"}
          </h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
            {filter === "enrolled"
              ? "Hãy chuyển sang tab 'Tất Cả' để chọn và tham gia các lộ trình học hấp dẫn!"
              : "Thầy cô đang xây dựng các lộ trình bài giảng và mini-game mới. Vui lòng quay lại sau nhé!"}
          </p>
          {filter === "enrolled" && (
            <button
              onClick={() => setFilter("all")}
              className="px-5 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold transition-all cursor-pointer"
            >
              Khám Phá Tất Cả Lộ Trình
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPaths.map((path) => {
            const isEnrolled = enrolledIds.includes(path.id);

            return (
              <div
                key={path.id}
                className="rounded-3xl bg-[#0f1524]/90 border border-[#7bd1fa]/15 overflow-hidden flex flex-col justify-between hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all group"
              >
                <div>
                  {/* Banner */}
                  <div className={`h-28 bg-gradient-to-r ${path.bannerGradient} p-5 relative flex flex-col justify-between`}>
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[11px] font-mono text-cyan-200 border border-white/10 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" />
                        {path.coursesCount} Khóa Học
                      </span>

                      <span className="px-2.5 py-1 rounded-full bg-amber-500/30 backdrop-blur-md text-[11px] font-mono text-amber-200 border border-amber-400/30 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-300" />
                        +{path.rewardCoins} Coins
                      </span>
                    </div>

                    <div className="text-[11px] text-white/80 font-mono flex items-center gap-1 truncate">
                      <span>Giảng viên:</span>
                      <strong className="text-white">{path.authorName}</strong>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {path.title}
                    </h3>
                    <p className="text-xs text-[#8e9bb4] line-clamp-3 leading-relaxed">
                      {path.description}
                    </p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 pt-0 space-y-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleEnroll(path.id)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        isEnrolled
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
                          : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                      }`}
                    >
                      {isEnrolled ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Đã Tham Gia
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" /> Bắt Đầu Học
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
