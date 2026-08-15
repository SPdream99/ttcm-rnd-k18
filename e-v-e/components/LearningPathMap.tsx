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
  courses?: string[];
  completedCourses?: string[];
  currentCourseId?: string;
  onSelectCourse?: (courseId: string) => void;
}

export default function LearningPathMap({
  courses = [],
  completedCourses = [],
  currentCourseId,
  onSelectCourse,
}: LearningPathMapProps) {
  const router = useRouter();

  const safeCourses = Array.isArray(courses) ? courses : [];
  const safeCompletedCourses = Array.isArray(completedCourses) ? completedCourses : [];

  const getCourseStatus = (courseId: string, index: number) => {
    const isCompleted = safeCompletedCourses.includes(courseId);
    if (isCompleted) return "completed";
    if (
      currentCourseId === courseId ||
      (!currentCourseId && index === safeCompletedCourses.length)
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

  if (safeCourses.length === 0) {
    return (
      <div className="w-full rounded-2xl border-2 border-zinc-200 bg-white p-6 md:p-8 shadow-sm text-center py-12 space-y-3">
        <BookOpen className="w-8 h-8 text-zinc-400 mx-auto" />
        <h3 className="font-bold text-base text-zinc-900">Lộ trình học tập chưa có khóa học</h3>
        <p className="text-xs text-zinc-500 max-w-md mx-auto">
          Giảng viên đang cập nhật danh sách các bài học cho lộ trình này. Vui lòng quay lại sau!
        </p>
      </div>
    );
  }

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
                {safeCompletedCourses.length} / {safeCourses.length} Khóa hoàn thành
              </span>
            </div>
          </div>
        </div>

        {/* Bản Đồ Tương Tác */}
        <div className="relative max-w-2xl mx-auto py-2">
          {safeCourses.map((courseId, index) => {
            const status = getCourseStatus(courseId, index);
            const isLeft = index % 2 === 0;
            const isCompleted = status === "completed";
            const isCurrent = status === "current";
            const isLocked = status === "locked";
            const nextCourse = index < safeCourses.length - 1;

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
                        ? "border-red-300"
                        : "border-zinc-200"
                    }`}
                    style={{
                      left: isLeft ? "25%" : "auto",
                      right: isLeft ? "auto" : "25%",
                      top: "50%",
                      width: "50%",
                      height: "100%",
                      borderLeftWidth: isLeft ? "3px" : "0",
                      borderRightWidth: isLeft ? "0" : "3px",
                      borderBottomWidth: "3px",
                      borderBottomLeftRadius: isLeft ? "2rem" : "0",
                      borderBottomRightRadius: isLeft ? "0" : "2rem",
                    }}
                  />
                )}

                {/* Card Chặng Học */}
                <div
                  className={`relative z-10 flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
                    isCompleted
                      ? "bg-red-50/40 border-red-500"
                      : isCurrent
                      ? "bg-white border-red-600 shadow-md ring-4 ring-red-100"
                      : "bg-zinc-50/80 border-zinc-200 opacity-60"
                  } ${isLocked ? "cursor-not-allowed" : "cursor-pointer hover:scale-[1.01]"}`}
                  onClick={() => handleCourseClick(courseId, isLocked)}
                >
                  {/* Trạm Node Tròn */}
                  <div
                    className={`w-12 h-12 rounded-xl shrink-0 flex items-center justify-center font-bold text-base transition-colors ${
                      isCompleted
                        ? "bg-red-600 text-white"
                        : isCurrent
                        ? "bg-red-600 text-white animate-bounce"
                        : "bg-zinc-200 text-zinc-500"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6 stroke-[3]" />
                    ) : isCurrent ? (
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    ) : (
                      <Lock className="w-5 h-5 text-zinc-400" />
                    )}
                  </div>

                  {/* Thông Tin Chặng */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">
                        Chặng {index + 1}
                      </span>
                      {isCompleted && (
                        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
                          Đã Hoàn Thành
                        </span>
                      )}
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                          Đang Học
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm md:text-base text-zinc-900 truncate">
                      {cleanName}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {isCompleted
                        ? "Đã nắm vững toàn bộ kiến thức và thử thách."
                        : isCurrent
                        ? "Chặng học hiện tại — bấm vào để tiếp tục học ngay."
                        : "Khóa học bị khóa — cần hoàn thành các chặng trước."}
                    </p>
                  </div>

                  {/* Nút Điều Hướng */}
                  <div className="shrink-0 flex items-center gap-2">
                    <div
                      className={`p-2 rounded-xl border ${
                        isLocked
                          ? "bg-zinc-100 border-zinc-200 text-zinc-400"
                          : "bg-red-50 border-red-200 text-red-600 group-hover:bg-red-600 group-hover:text-white"
                      }`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </div>
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