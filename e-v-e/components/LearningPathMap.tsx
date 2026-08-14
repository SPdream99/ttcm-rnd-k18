"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Lock,
  Play,
  BookOpen,
  Trophy,
  Sparkles,
  Gamepad2,
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
    <section className="mx-auto w-full">
      <div className="overflow-hidden rounded-3xl border border-[#7bd1fa]/15 bg-[#0f1524]/80 backdrop-blur-xl shadow-2xl">
        {/* ================= HEADER ================= */}
        <div className="border-b border-[#7bd1fa]/10 px-6 py-6 text-center md:px-10">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <BookOpen className="h-6 w-6" />
          </div>

          <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
            Hành Trình Chinh Phục
          </p>

          <h2 className="mt-1 text-2xl font-extrabold text-white tracking-tight">
            Bản Đồ Mở Khóa Khóa Học 🗺️
          </h2>

          <p className="mx-auto mt-2 max-w-lg text-xs md:text-sm leading-relaxed text-[#8e9bb4]">
            Hoàn thành các minigame thử thách trong từng khóa học để mở khóa chặng tiếp theo.
          </p>
        </div>

        {/* ================= MAP ================= */}
        <div className="px-5 py-8 md:px-10 md:py-12">
          <div className="relative mx-auto max-w-3xl">
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
                <div key={courseId} className="relative">
                  {/* ================= CONNECTOR ================= */}
                  {nextCourse && (
                    <div
                      className={`absolute z-0 hidden md:block ${
                        isCompleted
                          ? "border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                          : isCurrent
                          ? "border-blue-400/60"
                          : "border-slate-700/50"
                      } ${
                        isLeft
                          ? "left-[32%] top-18 h-44 w-[45%] border-r-2 border-t-2 rounded-tr-[50px]"
                          : "right-[32%] top-18 h-44 w-[45%] border-l-2 border-t-2 rounded-tl-[50px]"
                      } border-dashed`}
                    />
                  )}

                  {/* ================= COURSE NODE ================= */}
                  <div
                    className={`relative z-10 flex min-h-[220px] items-center ${
                      isLeft ? "justify-start" : "justify-end"
                    }`}
                  >
                    <button
                      type="button"
                      disabled={isLocked}
                      onClick={() => handleCourseClick(courseId, isLocked)}
                      className={`group flex w-full max-w-[280px] flex-col items-center text-center transition-all duration-300 md:w-[280px] ${
                        isLocked
                          ? "cursor-not-allowed opacity-60"
                          : "cursor-pointer hover:-translate-y-2"
                      }`}
                    >
                      {/* ================= CIRCLE ================= */}
                      <div
                        className={`relative flex h-24 w-24 items-center justify-center rounded-3xl border-2 transition-all duration-300 ${
                          isCompleted
                            ? "border-emerald-400/80 bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-[0_0_25px_rgba(16,185,129,0.5)]"
                            : isCurrent
                            ? "border-cyan-400 bg-gradient-to-tr from-blue-600 via-cyan-500 to-teal-400 shadow-[0_0_30px_rgba(6,182,212,0.6)] animate-pulse"
                            : "border-slate-700/60 bg-[#151b2c] shadow-lg"
                        }`}
                      >
                        {/* ICON */}
                        {isCompleted ? (
                          <Check className="h-10 w-10 text-white stroke-[3]" />
                        ) : isCurrent ? (
                          <Play className="ml-1 h-9 w-9 fill-white text-white" />
                        ) : (
                          <Lock className="h-8 w-8 text-slate-500" />
                        )}

                        {/* NUMBER BADGE */}
                        <span
                          className={`absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full text-xs font-mono font-bold shadow-md border ${
                            isCompleted
                              ? "bg-emerald-800 text-emerald-200 border-emerald-400"
                              : isCurrent
                              ? "bg-cyan-700 text-white border-cyan-300"
                              : "bg-[#0a0e1a] text-slate-500 border-slate-700"
                          }`}
                        >
                          {index + 1}
                        </span>
                      </div>

                      {/* ================= INFO ================= */}
                      <div className="mt-4 space-y-1">
                        <p
                          className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                            isCompleted
                              ? "text-emerald-400"
                              : isCurrent
                              ? "text-cyan-300"
                              : "text-slate-500"
                          }`}
                        >
                          {isCompleted
                            ? "✓ ĐÃ HOÀN THÀNH"
                            : isCurrent
                            ? "🔥 ĐANG MỞ KHÓA"
                            : "🔒 CHƯA MỞ"}
                        </p>

                        <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                          Chặng {index + 1}: {cleanName}
                        </h4>

                        {!isLocked && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-cyan-400 font-medium">
                            <Gamepad2 className="w-3.5 h-3.5" /> Bấm để chơi game
                          </span>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}