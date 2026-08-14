"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Lock,
  Play,
  Terminal,
  Gamepad2,
  Cpu,
  Radio,
  Zap,
  Sparkles,
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
    <section className="relative w-full overflow-hidden font-mono">
      {/* Background Micro-Grid Texture */}
      <div className="rounded-3xl border-2 border-zinc-800 bg-[#0c1017] p-6 md:p-10 shadow-[8px_8px_0px_0px_#000] relative overflow-hidden">
        {/* Subtle dot matrix grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#222f3e_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

        {/* ================= TELEMETRY HEADER ================= */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-zinc-800 pb-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm bg-[#00F0FF]/15 border border-[#00F0FF]/50 text-[#00F0FF] text-[11px] font-bold tracking-widest uppercase">
                <Radio className="w-3.5 h-3.5 animate-pulse" /> E-V-E SCHEMATIC // v2.0
              </span>
              <span className="text-zinc-500 text-xs">// SYSTEM ROADMAP</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-zinc-100 tracking-tight flex items-center gap-2">
              BẢN ĐỒ TIẾN TRÌNH KHÓA HỌC <span className="text-[#E2F952]">⚡</span>
            </h2>
            <p className="font-sans text-xs md:text-sm text-zinc-400 mt-1 max-w-xl">
              Hoàn thành các bài tập và Minigame trong từng node để giải mã chặng tiếp theo trong chuỗi liên kết.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto bg-[#141b26] px-3 py-2 rounded-lg border border-zinc-700/80 shadow-[3px_3px_0px_0px_#000]">
            <Cpu className="w-4 h-4 text-[#E2F952]" />
            <div className="text-[11px]">
              <span className="text-zinc-500 block">TIẾN ĐỘ CHẶNG:</span>
              <span className="font-bold text-[#E2F952] font-mono">
                {completedCourses.length} / {courses.length} NODES HOÀN TẤT
              </span>
            </div>
          </div>
        </div>

        {/* ================= CIRCUIT MAP NODES ================= */}
        <div className="relative z-10 max-w-2xl mx-auto py-4">
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

            // Controlled micro-rotations for tactile physical look
            const cardRotation = isLeft ? "rotate-[-1deg]" : "rotate-[1deg]";

            return (
              <div key={courseId} className="relative mb-14 last:mb-2">
                {/* Tactical Schematic Connecting Cable */}
                {nextCourse && (
                  <div
                    className={`absolute z-0 hidden md:block ${
                      isCompleted
                        ? "border-[#00F0FF] shadow-[0_0_12px_rgba(0,240,255,0.4)]"
                        : isCurrent
                        ? "border-[#E2F952] border-dashed"
                        : "border-zinc-700/60 border-dashed"
                    } ${
                      isLeft
                        ? "left-[32%] top-20 h-44 w-[42%] border-r-[3px] border-t-[3px] rounded-tr-3xl"
                        : "right-[32%] top-20 h-44 w-[42%] border-l-[3px] border-t-[3px] rounded-tl-3xl"
                    }`}
                  />
                )}

                {/* Node Container with Asymmetric Alignment */}
                <div
                  className={`relative z-10 flex min-h-[160px] items-center ${
                    isLeft ? "justify-start md:pl-4" : "justify-end md:pr-4"
                  }`}
                >
                  <div
                    onClick={() => handleCourseClick(courseId, isLocked)}
                    className={`group relative flex w-full max-w-[320px] flex-col p-4 transition-all duration-200 ${cardRotation} hover:rotate-0 ${
                      isLocked
                        ? "cursor-not-allowed opacity-50 bg-[#121620] border-2 border-zinc-800 rounded-xl"
                        : isCompleted
                        ? "cursor-pointer bg-[#0f1d1e] border-2 border-[#00F0FF] rounded-tl-2xl rounded-br-2xl rounded-tr-sm rounded-bl-md shadow-[5px_5px_0px_0px_#00F0FF] hover:-translate-y-1 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                        : "cursor-pointer bg-[#1a2118] border-2 border-[#E2F952] rounded-tr-2xl rounded-bl-2xl rounded-tl-sm rounded-br-md shadow-[6px_6px_0px_0px_#E2F952] hover:-translate-y-1 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none animate-pulse-subtle"
                    }`}
                  >
                    {/* Tape Header Tag */}
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-700/60">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider">
                        <Terminal className="w-3 h-3 text-zinc-400" />
                        <span className="text-zinc-400">NODE_{String(index + 1).padStart(2, "0")}</span>
                      </div>

                      <span
                        className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-sm ${
                          isCompleted
                            ? "bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40"
                            : isCurrent
                            ? "bg-[#E2F952]/20 text-[#E2F952] border border-[#E2F952]/40 animate-pulse"
                            : "bg-zinc-800 text-zinc-500"
                        }`}
                      >
                        {isCompleted ? "COMPILED ✓" : isCurrent ? "ACTIVE KERNEL" : "AIR-GAPPED 🔒"}
                      </span>
                    </div>

                    {/* Main Node Content */}
                    <div className="py-3 flex items-start gap-3">
                      {/* Physical Icon Stamp */}
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border-2 font-black ${
                          isCompleted
                            ? "bg-[#00F0FF] text-black border-black shadow-[2px_2px_0px_0px_#000]"
                            : isCurrent
                            ? "bg-[#E2F952] text-black border-black shadow-[3px_3px_0px_0px_#000]"
                            : "bg-zinc-800 text-zinc-500 border-zinc-700"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-6 h-6 stroke-[3]" />
                        ) : isCurrent ? (
                          <Play className="w-6 h-6 fill-current ml-0.5" />
                        ) : (
                          <Lock className="w-5 h-5" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-black text-white group-hover:text-[#00F0FF] transition-colors line-clamp-2 leading-tight">
                          {cleanName}
                        </h4>
                        <p className="text-[11px] font-sans text-zinc-400 mt-1 line-clamp-1">
                          {isCompleted
                            ? "Đã vượt qua tất cả thử thách"
                            : isCurrent
                            ? "Bấm để mở kho Minigame thử thách"
                            : "Cần hoàn thành chặng trước để mở"}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    {!isLocked && (
                      <div className="pt-2 border-t border-zinc-700/50 flex items-center justify-between text-[10px]">
                        <span className="text-zinc-400 flex items-center gap-1 font-sans">
                          <Gamepad2 className="w-3.5 h-3.5 text-[#00F0FF]" /> Minigame tương thích
                        </span>
                        <span className="font-bold text-[#E2F952] flex items-center gap-1">
                          TRUY CẬP <Zap className="w-3 h-3" />
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
    </section>
  );
}