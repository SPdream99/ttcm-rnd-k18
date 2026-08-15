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
      <div className="rounded-2xl border-2 border-zinc-200 bg-white p-6 md:p-8 shadow-sm">
        {/* Header Hành Trình */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-6 mb-8">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold">
              <BookOpen className="w-3.5 h-3.5" /> Lộ Trình Học Tập
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
              Bản Đồ Mở Khóa Khóa Học
            </h2>
            <p className="text-xs md:text-sm text-zinc-500">
              Hoàn thành các bài tập và minigame thử thách trong từng chặng để mở khóa bài học tiếp theo.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-zinc-50 px-4 py-2.5 rounded-xl border border-zinc-200 self-start md:self-auto">
            <Trophy className="w-5 h-5 text-red-600" />
            <div>
              <span className="text-[11px] text-zinc-500 block font-medium">Tiến độ chặng:</span>
              <span className="font-bold text-zinc-900 text-sm">
                {completedCourses.length} / {courses.length} Khóa hoàn thành
              </span>
            </div>
          </div>
        </div>

        {/* Bản Đồ Tương Tác */}
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
              <div key={courseId} className="relative mb-10 last:mb-2">
                {/* Đường Nối Dẫn Chặng */}
                {nextCourse && (
                  <div
                    className={`absolute z-0 hidden md:block border-dashed ${
                      isCompleted
                        ? "border-red-600"
                        : isCurrent
                        ? "border-red-400"
                        : "border-zinc-300"
                    } ${
                      isLeft
                        ? "left-[32%] top-20 h-36 w-[42%] border-r-2 border-t-2 rounded-tr-2xl"
                        : "right-[32%] top-20 h-36 w-[42%] border-l-2 border-t-2 rounded-tl-2xl"
                    }`}
                  />
                )}

                {/* Node Khóa Học */}
                <div
                  className={`relative z-10 flex min-h-[130px] items-center ${
                    isLeft ? "justify-start md:pl-4" : "justify-end md:pr-4"
                  }`}
                >
                  <div
                    onClick={() => handleCourseClick(courseId, isLocked)}
                    className={`group w-full max-w-[320px] p-4 rounded-xl border-2 transition-all duration-200 ${
                      isLocked
                        ? "cursor-not-allowed bg-zinc-50 border-zinc-200 opacity-60"
                        : isCompleted
                        ? "cursor-pointer bg-white border-red-600 shadow-sm hover:border-red-700 hover:-translate-y-0.5"
                        : "cursor-pointer bg-red-50/40 border-red-600 shadow-sm hover:border-red-700 hover:-translate-y-0.5"
                    }`}
                  >
                    {/* Badge trạng thái */}
                    <div className="flex items-center justify-between pb-2.5 border-b border-zinc-200">
                      <span className="text-[11px] font-bold text-zinc-600 flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-red-600" />
                        Chặng {index + 1}
                      </span>

                      <span
                        className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          isCompleted
                            ? "bg-red-600 text-white"
                            : isCurrent
                            ? "bg-red-100 text-red-700 border border-red-300"
                            : "bg-zinc-200 text-zinc-500"
                        }`}
                      >
                        {isCompleted ? "Đã xong " : isCurrent ? "Đang học" : "Chưa mở"}
                      </span>
                    </div>

                    {/* Nội dung Node */}
                    <div className="py-3 flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 font-bold ${
                          isCompleted
                            ? "bg-red-600 text-white"
                            : isCurrent
                            ? "bg-red-600 text-white"
                            : "bg-zinc-200 text-zinc-400"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-6 h-6 stroke-[3]" />
                        ) : isCurrent ? (
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        ) : (
                          <Lock className="w-4 h-4" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-zinc-900 group-hover:text-red-600 transition-colors line-clamp-1">
                          {cleanName}
                        </h4>
                        <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">
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
                      <div className="pt-2.5 border-t border-zinc-200 flex items-center justify-between text-xs">
                        <span className="text-zinc-600 flex items-center gap-1 font-medium">
                          <Gamepad2 className="w-3.5 h-3.5 text-red-600" /> Minigame tương thích
                        </span>
                        <span className="font-bold text-red-600 flex items-center gap-0.5">
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