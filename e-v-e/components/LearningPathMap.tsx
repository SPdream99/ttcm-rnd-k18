"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Lock,
  Play,
  BookOpen,
  Gamepad2,
  Trophy,
  ChevronRight,
  AlertCircle,
  Sparkles,
} from "lucide-react";

interface LearningPathMapProps {
  courses?: string[];
  completedCourses?: string[];
  coursePlayCounts?: Record<string, number>;
  requiredPlaysPerStage?: number;
  currentCourseId?: string;
  courseTitles?: Record<string, string>;
  onSelectCourse?: (courseId: string) => void;
}

const DEFAULT_COURSE_TITLES: Record<string, string> = {
  crs_coding_basics: "Bài 1: Nhập Môn Tư Duy Lập Trình & Thuật Toán",
  crs_computer_hardware: "Bài 2: Khám Phá Phần Cứng & Kiến Trúc Máy Tính",
  crs_python_foundation: "Bài 3: Lập Trình Python Căn Bản & Cấu Trúc Dữ Liệu",
  crs_generative_ai_projects: "Bài 4: Thiết Kế Ứng Dụng Trí Tuệ Nhân Tạo AI",
  crs_data_structures: "Bài 5: Cấu Trúc Dữ Liệu & Giải Thuật Chuyên Sâu",
  crs_python_mini_games: "Bài 6: Lập Trình Trò Chơi Mini Với Python",
  crs_ai_robotics: "Bài 7: Khám Phá Trí Tuệ Nhân Tạo & Robotics",
};

export default function LearningPathMap({
  courses = [],
  completedCourses = [],
  coursePlayCounts = {},
  requiredPlaysPerStage = 1,
  currentCourseId,
  courseTitles = {},
  onSelectCourse,
}: LearningPathMapProps) {
  const router = useRouter();
  const [lockedNotice, setLockedNotice] = useState<{ stageNum: number; prevStageNum: number } | null>(null);

  const safeCourses = Array.isArray(courses) ? courses : [];
  const safeCompletedCourses = Array.isArray(completedCourses) ? completedCourses : [];

  // Kiểm tra trạng thái mở khóa tuần tự:
  // Chặng 0 luôn mở khóa. Chặng i chỉ mở khóa khi Chặng i-1 đã HOÀN THÀNH ĐỦ LƯỢT CHƠI.
  const getCourseStatus = (courseId: string, index: number) => {
    const plays = coursePlayCounts[courseId] || 0;
    const isCompleted = safeCompletedCourses.includes(courseId) || plays >= requiredPlaysPerStage;

    if (isCompleted) return "completed";

    // Kiểm tra xem chặng trước đó có hoàn thành hay chưa
    if (index === 0) return "current";

    const prevCourseId = safeCourses[index - 1];
    const prevPlays = coursePlayCounts[prevCourseId] || 0;
    const isPrevCompleted = safeCompletedCourses.includes(prevCourseId) || prevPlays >= requiredPlaysPerStage;

    if (isPrevCompleted) {
      return "current";
    }

    return "locked";
  };

  const handleCourseClick = (courseId: string, index: number, status: string) => {
    if (status === "locked") {
      setLockedNotice({ stageNum: index + 1, prevStageNum: index });
      return;
    }
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
    <div className="w-full space-y-6">
      {/* Modal Thông Báo Khi Bấm Chặng Đang Khóa */}
      {lockedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white border-2 border-red-600 p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 border border-red-200 flex items-center justify-center mx-auto text-red-600">
              <Lock className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-zinc-900">
                Chặng {lockedNotice.stageNum} Đang Bị Khóa
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Để đảm bảo tiến độ học tập tuần tự, bạn cần <strong>hoàn thành đủ lượt chơi minigame của Chặng {lockedNotice.prevStageNum}</strong> trước khi mở khóa chặng này.
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={() => setLockedNotice(null)}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
              >
                Đã Hiểu & Quay Lại
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border-2 border-zinc-200 bg-white p-6 md:p-8 shadow-sm">
        {/* Header Hành Trình */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-6 mb-8">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold">
              <BookOpen className="w-3.5 h-3.5" /> Lộ Trình Học Tập Tuần Tự
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
              Bản Đồ Mở Khóa Tuần Tự Từng Chặng
            </h2>
            <p className="text-xs md:text-sm text-zinc-500">
              Mỗi chặng yêu cầu hoàn thành đủ lượt chơi minigame của chặng trước để mở khóa bài học tiếp theo.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-zinc-50 px-4 py-2.5 rounded-xl border border-zinc-200 self-start md:self-auto">
            <Trophy className="w-5 h-5 text-red-600" />
            <div>
              <span className="text-[11px] text-zinc-500 block font-medium">Tiến độ mở khóa:</span>
              <span className="font-bold text-zinc-900 text-sm">
                {safeCourses.filter((c, i) => getCourseStatus(c, i) === "completed").length} / {safeCourses.length} Chặng hoàn thành
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
            const plays = coursePlayCounts[courseId] || (isCompleted ? requiredPlaysPerStage : 0);

            const displayTitle = courseTitles[courseId] || DEFAULT_COURSE_TITLES[courseId] || courseId
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
                      ? "bg-red-50/40 border-red-500 hover:border-red-600"
                      : isCurrent
                      ? "bg-white border-red-600 shadow-md ring-4 ring-red-100"
                      : "bg-zinc-50/80 border-zinc-200 opacity-60"
                  } ${isLocked ? "cursor-not-allowed" : "cursor-pointer hover:scale-[1.01]"}`}
                  onClick={() => handleCourseClick(courseId, index, status)}
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
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">
                        Chặng {index + 1}
                      </span>
                      {isCompleted && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          ✓ Đã Hoàn Thành ({plays}/{requiredPlaysPerStage} lượt)
                        </span>
                      )}
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Đang Học ({plays}/{requiredPlaysPerStage} lượt)
                        </span>
                      )}
                      {isLocked && (
                        <span className="px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-600 text-[10px] font-bold flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Khóa — Cần hoàn thành Chặng {index}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm md:text-base text-zinc-900 truncate">
                      {displayTitle}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {isCompleted
                        ? "Đã hoàn thành đủ điều kiện lượt chơi của chặng."
                        : isCurrent
                        ? `Bấm vào để chơi game thực hành và hoàn thành ${requiredPlaysPerStage} lượt chơi mở chặng kế tiếp.`
                        : `Chặng học bị khóa — Phải hoàn thành đủ lượt chơi của Chặng ${index} trước.`}
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
                      {isLocked ? <Lock className="w-4 h-4" /> : <ChevronRight className="w-5 h-5" />}
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