"use client";

import { useRouter } from "next/navigation";
import {
  Check,
  Lock,
  Play,
  BookOpen,
  Trophy,
} from "lucide-react";

interface LearningPathMapProps {
  courses: string[];

  // Course đã hoàn thành
  completedCourses?: string[];

  // Course đang học
  currentCourseId?: string;
}

export default function LearningPathMap({
  courses,
  completedCourses = [],
  currentCourseId,
}: LearningPathMapProps) {
  const router = useRouter();

  const getCourseStatus = (courseId: string, index: number) => {
    const isCompleted = completedCourses.includes(courseId);

    if (isCompleted) {
      return "completed";
    }

    if (
      currentCourseId === courseId ||
      (!currentCourseId && index === completedCourses.length)
    ) {
      return "current";
    }

    return "locked";
  };

  return (
    <section className="mx-auto w-full">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        {/* ================= HEADER ================= */}

        <div className="border-b border-slate-100 px-6 py-7 text-center md:px-10">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50">
            <BookOpen className="h-6 w-6 text-cyan-600" />
          </div>

          <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-cyan-600">
            Your Journey
          </p>

          <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
            Learning Path
          </h2>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
            Hoàn thành từng khóa học để mở khóa chặng tiếp theo
            trong hành trình của bạn.
          </p>
        </div>

        {/* ================= MAP ================= */}

        <div className="px-5 py-10 md:px-10 md:py-14">

          <div className="relative mx-auto max-w-3xl">

            {courses.map((courseId, index) => {
              const status = getCourseStatus(courseId, index);

              const isLeft = index % 2 === 0;

              const isCompleted = status === "completed";
              const isCurrent = status === "current";
              const isLocked = status === "locked";

              const nextCourse =
                index < courses.length - 1;

              return (
                <div
                  key={courseId}
                  className="relative"
                >

                  {/* ================= CONNECTOR ================= */}

                  {nextCourse && (
                    <div
                      className={`absolute z-0 hidden md:block ${isCompleted
                          ? "border-cyan-300"
                          : "border-slate-200"
                        } ${isLeft
                          ? "left-[32%] top-18 h-47 w-[45%] border-r-2 border-t-2 rounded-tr-[50px]"
                          : "right-[32%] top-18 h-47 w-[45%] border-l-2 border-t-2 rounded-tl-[50px]"
                        } border-dashed`}
                    />
                  )}

                  {/* ================= COURSE ================= */}

                  <div
                    className={`relative z-10 flex min-h-[250px] items-center ${isLeft
                        ? "justify-start"
                        : "justify-end"
                      }`}
                  >

                    <button
                      type="button"
                      disabled={isLocked}
                      onClick={() => {
                        if (!isLocked) {
                          router.push(
                            `/dashbroad/student/Course/${courseId}`
                          );
                        }
                      }}
                      className={`
                        group
                        flex
                        w-full
                        max-w-[280px]
                        flex-col
                        items-center
                        text-center
                        transition-all
                        duration-300
                        md:w-[280px]

                        ${isLocked
                          ? "cursor-not-allowed"
                          : "cursor-pointer hover:-translate-y-2"
                        }
                      `}
                    >

                      {/* ================= CIRCLE ================= */}

                      <div
                        className={`
                          relative
                          flex
                          h-28
                          w-28
                          items-center
                          justify-center
                          rounded-full
                          border-[7px]
                          shadow-lg
                          transition-all
                          duration-300

                          ${isCompleted
                            ? `
                                border-cyan-100
                                bg-cyan-500
                                shadow-cyan-200/70
                                group-hover:bg-cyan-600
                                group-hover:shadow-cyan-300
                              `
                            : isCurrent
                              ? `
                                  border-blue-100
                                  bg-blue-500
                                  shadow-blue-200/70
                                  group-hover:bg-blue-600
                                  group-hover:shadow-blue-300
                                  animate-pulse
                                `
                              : `
                                  border-slate-100
                                  bg-slate-100
                                  shadow-slate-200/50
                                `
                          }
                        `}
                      >

                        {/* ICON */}

                        {isCompleted ? (
                          <Check className="h-10 w-10 text-white" />
                        ) : isCurrent ? (
                          <Play className="ml-1 h-9 w-9 fill-white text-white" />
                        ) : (
                          <Lock className="h-8 w-8 text-slate-400" />
                        )}

                        {/* NUMBER */}

                        <span
                          className={`
                            absolute
                            -right-2
                            -top-2
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-full
                            text-xs
                            font-bold
                            shadow-md

                            ${isCompleted
                              ? "bg-cyan-700 text-white"
                              : isCurrent
                                ? "bg-blue-700 text-white"
                                : "bg-slate-200 text-slate-500"
                            }
                          `}
                        >
                          {index + 1}
                        </span>

                      </div>

                      {/* ================= INFO ================= */}

                      <div className="mt-5">

                        <p
                          className={`
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-wider

                            ${isCompleted
                              ? "text-cyan-600"
                              : isCurrent
                                ? "text-blue-600"
                                : "text-slate-400"
                            }
                          `}
                        >
                          Course {index + 1}
                        </p>

                        <h3
                          className={`
                            mt-1
                            text-base
                            font-bold

                            ${isLocked
                              ? "text-slate-400"
                              : "text-slate-900 group-hover:text-cyan-600"
                            }
                          `}
                        >
                          {formatCourseName(courseId)}
                        </h3>

                        {/* STATUS */}

                        <span
                          className={`
                            mt-3
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-full
                            px-3
                            py-1.5
                            text-xs
                            font-semibold

                            ${isCompleted
                              ? "bg-cyan-50 text-cyan-700"
                              : isCurrent
                                ? "bg-blue-50 text-blue-700"
                                : "bg-slate-100 text-slate-400"
                            }
                          `}
                        >
                          {isCompleted && (
                            <Check className="h-3 w-3" />
                          )}

                          {isCurrent && (
                            <Play className="h-3 w-3 fill-current" />
                          )}

                          {isLocked && (
                            <Lock className="h-3 w-3" />
                          )}

                          {isCompleted
                            ? "Đã hoàn thành"
                            : isCurrent
                              ? "Đang học"
                              : "Chưa mở khóa"}
                        </span>

                      </div>
                    </button>
                  </div>
                </div>
              );
            })}

          </div>
        </div>

        {/* ================= LEGEND ================= */}

        <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-6">

          <div className="flex flex-wrap justify-center gap-3">

            <Legend
              icon={<Check className="h-3.5 w-3.5" />}
              label="Đã hoàn thành"
              className="bg-cyan-50 text-cyan-700"
            />

            <Legend
              icon={
                <Play className="h-3.5 w-3.5 fill-current" />
              }
              label="Đang học"
              className="bg-blue-50 text-blue-700"
            />

            <Legend
              icon={<Lock className="h-3.5 w-3.5" />}
              label="Chưa mở khóa"
              className="bg-slate-100 text-slate-500"
            />

          </div>

        </div>

        {/* ================= BOTTOM ================= */}

        <div className="px-5 pb-7 pt-2">

          <div className="mx-auto flex max-w-xl items-center gap-3 rounded-2xl border border-cyan-100 bg-gradient-to-r from-cyan-50 to-blue-50 px-5 py-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
              <Trophy className="h-5 w-5 text-cyan-600" />
            </div>

            <div>

              <p className="text-sm font-bold text-slate-800">
                Hoàn thành hành trình của bạn
              </p>

              <p className="mt-0.5 text-xs leading-5 text-slate-500">
                Hoàn thành tất cả các course để hoàn thành
                Learning Path.
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

/* ========================================= */
/* LEGEND */
/* ========================================= */

function Legend({
  icon,
  label,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  className: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${className}`}
    >
      {icon}
      {label}
    </div>
  );
}

/* ========================================= */
/* COURSE NAME */
/* ========================================= */

function formatCourseName(courseId: string) {
  const names: Record<string, string> = {
    crs_classical_physics:
      "Cơ học cổ điển",

    crs_quantum_101:
      "Nhập môn Vật lý Lượng tử",

    crs_wave_particle:
      "Lưỡng tính Sóng – Hạt",

    crs_quantum_mechanics:
      "Cơ học Lượng tử",

    crs_quantum_entanglement:
      "Vướng víu Lượng tử",

    crs_quantum_computing:
      "Máy tính Lượng tử",
  };

  return names[courseId] || courseId;
}