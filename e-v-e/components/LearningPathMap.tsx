"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Lock,
  Play,
  BookOpen,
  Gamepad2,
  Trophy,
  Sparkles,
  ChevronRight,
} from "lucide-react";

interface LearningPathMapProps {
  courses: string[];
  completedCourses?: string[];
  currentCourseId?: string;
  onSelectCourse?: (courseId: string) => void;
}

export default function LearningPathMap({
  courses,
  completedCourses = [],
  currentCourseId,
  onSelectCourse,
}: LearningPathMapProps) {
  const router = useRouter();

  const getCourseStatus = (courseId: string, index: number) => {
    const isCompleted = completedCourses.includes(courseId);
    if (isCompleted) return "completed";
    if (
      currentCourseId === courseId ||
      (!currentCourseId && index === completedCourses.length)
    ) {
      return "current";
    }
    return index === 0 ? "current" : "locked";
  };

  const handleCourseClick = (courseId: string, isLocked: boolean) => {
    if (isLocked) return;
    if (onSelectCourse) {
      onSelectCourse(courseId);
    } else {
      router.push(`/student/courses/${courseId}`);
    }
  };

  return (
    <div className="w-full">
      <div className="rounded-3xl border border-slate-800 bg-[#0f1422] p-6 md:p-10 shadow-2xl">
        {/* Header Hành Trình */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6 mb-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Lộ Trình Học Tập
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Bản Đồ Mở Khóa Khóa Học
            </h2>
            <p className="text-xs md:text-sm text-slate-400">
              Hoàn thành các bài tập và minigame thử thách trong từng chặng để mở khóa bài học tiếp theo.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#151c2e] px-4 py-2.5 rounded-2xl border border-slate-800 shadow-sm self-start md:self-auto">
            <Trophy className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Tiến độ chặng:</span>
              <span className="font-bold text-white text-sm">
                {completedCourses.length} / {courses.length} Khóa hoàn thành
              </span>
            </div>
          </div>
        </div>

        {/* Bản Đồ Zigzag Tương Tác */}
        <div className="relative max-w-2xl mx-auto py-2">
          {courses.map((courseId, index) => {
            const status = getCourseStatus(courseId, index);
            const isLeft = index % 2 === 0;
            const isCompleted = status === "completed";
            const isCurrent = status === "current";
            const isLocked = status === "locked";
            const nextCourse = index < courses.length - 1;

            const cleanName = courseId
              .replace(/^crs_/, "")
              .replace(/_/g, " ")
              .toUpperCase();

            return (
              <div key={courseId} className="relative mb-12 last:mb-2">
                {/* Đường Nối Dẫn Chặng */}
                {nextCourse && (
                  <div
                    className={`absolute z-0 hidden md:block border-dashed ${
                      isCompleted
                        ? "border-cyan-400"
                        : isCurrent
                        ? "border-cyan-500/50"
                        : "border-slate-800"
                    } ${
                      isLeft
                        ? "left-[32%] top-20 h-40 w-[42%] border-r-2 border-t-2 rounded-tr-3xl"
                        : "right-[32%] top-20 h-40 w-[42%] border-l-2 border-t-2 rounded-tl-3xl"
                    }`}
                  />
                )}

                {/* Node Khóa Học */}
                <div
                  className={`relative z-10 flex min-h-[140px] items-center ${
                    isLeft ? "justify-start md:pl-4" : "justify-end md:pr-4"
                  }`}
                >
                  <div
                    onClick={() => handleCourseClick(courseId, isLocked)}
                    className={`group w-full max-w-[320px] p-5 rounded-2xl border transition-all duration-300 ${
                      isLocked
                        ? "cursor-not-allowed bg-[#131929]/60 border-slate-800 opacity-60"
                        : isCompleted
                        ? "cursor-pointer bg-[#131b2e] border-cyan-500/40 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] hover:-translate-y-1"
                        : "cursor-pointer bg-[#152038] border-cyan-400 hover:border-cyan-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:-translate-y-1"
                    }`}
                  >
                    {/* Badge trạng thái */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                      <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                        Chặng {index + 1}
                      </span>

                      <span
                        className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          isCompleted
                            ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                            : isCurrent
                            ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 animate-pulse"
                            : "bg-slate-800 text-slate-500"
                        }`}
                      >
                        {isCompleted ? "Đã xong ✓" : isCurrent ? "Đang học" : "Chưa mở"}
                      </span>
                    </div>

                    {/* Nội dung Node */}
                    <div className="py-3.5 flex items-center gap-3.5">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                          isCompleted
                            ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                            : isCurrent
                            ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-cyan-500/30"
                            : "bg-slate-800 text-slate-500"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-6 h-6 stroke-[3]" />
                        ) : isCurrent ? (
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        ) : (
                          <Lock className="w-5 h-5" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                          {cleanName}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                          {isCompleted
                            ? "Đã hoàn thành toàn bộ thử thách"
                            : isCurrent
                            ? "Bấm để mở danh sách minigame"
                            : "Hoàn thành chặng trước để mở"}
                        </p>
                      </div>
                    </div>

                    {/* Footer Thao Tác */}
                    {!isLocked && (
                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" /> Minigame tương thích
                        </span>
                        <span className="font-bold text-cyan-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                          Xem chi tiết <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}