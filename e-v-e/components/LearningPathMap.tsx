"use client";

import { useRouter } from "next/navigation";

interface LearningPathMapProps {
  courses: string[];
}

export default function LearningPathMap({
  courses,
}: LearningPathMapProps) {
  const router = useRouter();

  return (
    <section className="mx-auto max-w-5xl px-6 pb-20 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-cyan-600">
            Your Journey
          </span>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Learning Path
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
            Complete each course to continue your learning journey.
          </p>
        </div>

        {/* Map */}
        <div className="relative mx-auto max-w-2xl">
          {courses.map((courseId, index) => {
            const isLeft = index % 2 === 0;

            // Demo state
            const isCompleted = index === 0;
            const isCurrent = index === 1;
            const isLocked = index > 1;

            return (
              <div
                key={courseId}
                className="relative"
              >
                {/* Connecting line */}
                {index < courses.length - 1 && (
                  <div
                    className={`absolute top-[145px] h-[120px] w-[50%] border-t-4 border-dashed border-cyan-200 ${
                      isLeft
                        ? "left-[50%] rotate-[25deg] origin-left"
                        : "right-[50%] -rotate-[25deg] origin-right"
                    }`}
                  />
                )}

                {/* Course */}
                <div
                  className={`relative flex h-[250px] items-center ${
                    isLeft
                      ? "justify-start"
                      : "justify-end"
                  }`}
                >
                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={() => {
                      if (!isLocked) {
                        router.push(`/course/${courseId}`);
                      }
                    }}
                    className={`group relative flex w-[240px] flex-col items-center text-center transition-all duration-300 ${
                      isLocked
                        ? "cursor-not-allowed"
                        : "cursor-pointer hover:-translate-y-2"
                    }`}
                  >
                    {/* Course Circle */}
                    <div
                      className={`relative flex h-28 w-28 items-center justify-center rounded-full border-[8px] shadow-xl transition-all duration-300 ${
                        isCompleted
                          ? "border-cyan-100 bg-cyan-500 shadow-cyan-200 group-hover:bg-cyan-600"
                          : isCurrent
                            ? "border-blue-100 bg-blue-500 shadow-blue-200 group-hover:bg-blue-600"
                            : "border-slate-100 bg-slate-100 shadow-slate-200"
                      }`}
                    >
                      {/* Icon */}
                      <span className="text-4xl">
                        {isCompleted
                          ? "✓"
                          : isCurrent
                            ? "▶"
                            : "🔒"}
                      </span>

                      {/* Number */}
                      <span
                        className={`absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shadow-md ${
                          isCompleted || isCurrent
                            ? "bg-slate-900 text-white"
                            : "bg-slate-300 text-slate-600"
                        }`}
                      >
                        {index + 1}
                      </span>
                    </div>

                    {/* Course information */}
                    <div className="mt-5">
                      <h3
                        className={`text-base font-bold transition-colors ${
                          isLocked
                            ? "text-slate-400"
                            : "text-slate-900 group-hover:text-blue-600"
                        }`}
                      >
                        Course {index + 1}
                      </h3>

                      <p className="mt-1 max-w-[220px] truncate text-xs text-slate-400">
                        {courseId}
                      </p>

                      {/* Status */}
                      <span
                        className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          isCompleted
                            ? "bg-cyan-50 text-cyan-600"
                            : isCurrent
                              ? "bg-blue-50 text-blue-600"
                              : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {isCompleted
                          ? "Completed"
                          : isCurrent
                            ? "Continue"
                            : "Locked"}
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-xs text-white">
              ✓
            </span>

            <span className="text-xs font-medium text-cyan-700">
              Completed
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
              ▶
            </span>

            <span className="text-xs font-medium text-blue-700">
              Current
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-300 text-xs">
              🔒
            </span>

            <span className="text-xs font-medium text-slate-500">
              Locked
            </span>
          </div>
        </div>

        {/* Bottom message */}
        <div className="mt-8 flex justify-center">
          <div className="rounded-2xl bg-gradient-to-r from-cyan-50 to-blue-50 px-6 py-4 text-center">
            <p className="text-sm font-semibold text-slate-700">
              🗺️ Complete your journey
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Finish all courses to complete this Learning Path.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}