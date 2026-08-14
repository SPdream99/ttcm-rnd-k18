"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import {
  BookOpen,
  Clock,
  ArrowRight,
  GraduationCap,
  Loader2,
  User,
  CheckCircle2,
} from "lucide-react";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";

interface StudentLearningPath {
  id: string;
  learning_path_id: string;
  progress: number;
  status: string;
}

interface ClassItem {
  id: string;
  title: string;
  description: string;
  instructor: string;
  coursesCount: number;
  progress: number;
  difficulty: string;
  category: string;
}

export default function StudentClassPage() {

  const [classes, setClasses] =
    useState<ClassItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  // =========================================================
  // LOAD CLASSES
  // =========================================================

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (user) => {

      try {

        console.log(
          "🔥 CLASS USER:",
          user?.uid
        );

        if (!user) {
          setClasses([]);
          setLoading(false);
          return;
        }

        // ===================================================
        // 1. Lấy enrollment của student
        // ===================================================

        const enrollmentQuery =
          query(
            collection(
              db,
              "student_learning_path"
            ),
            where(
              "student_id",
              "==",
              user.uid
            )
          );

        const enrollmentSnapshot =
          await getDocs(
            enrollmentQuery
          );

        console.log(
          "✅ ENROLLMENTS:",
          enrollmentSnapshot.size
        );

        const enrollments: StudentLearningPath[] =
          enrollmentSnapshot.docs
            .map((docSnap) => {

              const data =
                docSnap.data();

              return {
                id: docSnap.id,

                learning_path_id:
                  data.learning_path_id ||
                  "",

                progress:
                  Number(
                    data.progress
                  ) || 0,

                status:
                  data.status ||
                  "active",
              };

            })
            .filter(
              (item) =>
                item.status ===
                  "active" &&
                item.learning_path_id
            );

        console.log(
          "🔥 ACTIVE ENROLLMENTS:",
          enrollments
        );

        // ===================================================
        // 2. Lấy Learning Path
        // ===================================================

        const classList: ClassItem[] =
          [];

        for (
          const enrollment of enrollments
        ) {

          const pathQuery =
            query(
              collection(
                db,
                "learning_path"
              ),
              where(
                "__name__",
                "==",
                enrollment.learning_path_id
              )
            );

          const pathSnapshot =
            await getDocs(
              pathQuery
            );

          if (
            pathSnapshot.empty
          ) {

            console.log(
              "⚠️ Không tìm thấy path:",
              enrollment.learning_path_id
            );

            continue;
          }

          const pathDoc =
            pathSnapshot.docs[0];

          const pathData =
            pathDoc.data();

          // =================================================
          // 3. Lấy teacher
          // =================================================

          let teacherName =
            "Unknown Teacher";

          if (
            pathData.author_id
          ) {

            const teacherQuery =
              query(
                collection(
                  db,
                  "users"
                ),
                where(
                  "id",
                  "==",
                  pathData.author_id
                )
              );

            const teacherSnapshot =
              await getDocs(
                teacherQuery
              );

            if (
              !teacherSnapshot.empty
            ) {

              const teacherData =
                teacherSnapshot
                  .docs[0]
                  .data();

              teacherName =
                teacherData.name ||
                teacherData.displayName ||
                "Unknown Teacher";
            }
          }

          // =================================================
          // 4. Tạo Class
          // =================================================

          classList.push({

            id: pathDoc.id,

            title:
              pathData.title ||
              "Untitled Learning Path",

            description:
              pathData.description ||
              "",

            instructor:
              teacherName,

            coursesCount:
              Array.isArray(
                pathData.courses
              )
                ? pathData
                    .courses
                    .length
                : 0,

            progress:
              Math.min(
                enrollment.progress,
                100
              ),

            difficulty:
              pathData.difficulty ||
              "Beginner",

            category:
              pathData.category ||
              "General",

          });

        }

        console.log(
          "✅ FINAL CLASSES:",
          classList
        );

        setClasses(
          classList
        );

      } catch (error) {

        console.error(
          "🔥 Error loading classes:",
          error
        );

      } finally {

        setLoading(false);

      }

    });

    // Dọn dẹp listener khi component unmount
    return () => unsubscribe();

  }, []);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a0e1a]">

        <div className="flex flex-col items-center gap-3">

          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />

          <p className="text-sm text-[#8e9bb4]">
            Đang tải lớp học...
          </p>

        </div>

      </main>
    );

  }

  // =========================================================
  // UI
  // =========================================================

  return (

    <div className="min-h-screen bg-[#0a0e1a] p-4 font-sans text-[#e1e2ec] md:p-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="mb-8 border-b border-[#7bd1fa]/10 pb-6">

        <div className="flex items-center gap-2 text-sm font-medium text-cyan-400">

          <GraduationCap className="h-4 w-4" />

          Lớp học của tôi

        </div>

        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
          Learning Paths đang học 📚
        </h1>

        <p className="mt-1 text-sm text-[#8e9bb4]">
          Các Learning Path bạn đã đăng ký.
        </p>

      </header>

      {/* =====================================================
          EMPTY
      ===================================================== */}

      {classes.length === 0 ? (

        <div className="rounded-3xl border border-[#7bd1fa]/10 bg-[#0f1524]/60 p-12 text-center">

          <BookOpen className="mx-auto h-12 w-12 text-[#8e9bb4]" />

          <h2 className="mt-4 text-xl font-bold text-white">
            Bạn chưa đăng ký Learning Path
          </h2>

          <p className="mt-2 text-sm text-[#8e9bb4]">
            Hãy khám phá các Learning Path
            và bắt đầu hành trình học tập.
          </p>

          <Link
            href="/dashbroad/student/LearningPath"
            className="mx-auto mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500"
          >
            Khám phá Learning Path

            <ArrowRight className="h-4 w-4" />

          </Link>

        </div>

      ) : (

        /* ===================================================
           GRID
        =================================================== */

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

          {classes.map(
            (cls) => (

              <div
                key={cls.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#7bd1fa]/15 bg-[#0f1524]/60 p-5 backdrop-blur-md transition-all hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.08)]"
              >

                <div>

                  {/* Category */}

                  <div className="flex items-center justify-between">

                    <span className="rounded-md border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-cyan-300">
                      {cls.category}
                    </span>

                    <span className="text-xs text-[#8e9bb4]">
                      {cls.difficulty}
                    </span>

                  </div>

                  {/* Title */}

                  <h3 className="mt-4 text-lg font-bold text-white transition group-hover:text-cyan-300">
                    {cls.title}
                  </h3>

                  {/* Description */}

                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#8e9bb4]">
                    {cls.description ||
                      "Chưa có mô tả."}
                  </p>

                  {/* Teacher */}

                  <div className="mt-4 flex items-center gap-2 text-xs text-[#8e9bb4]">

                    <User className="h-4 w-4 text-cyan-400" />

                    <span>
                      Giảng viên:
                    </span>

                    <span className="font-medium text-cyan-300">
                      {cls.instructor}
                    </span>

                  </div>

                  {/* Course */}

                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/5 bg-[#0a0e1a]/50 p-3">

                    <BookOpen className="h-5 w-5 text-cyan-400" />

                    <div>

                      <p className="text-[11px] text-[#8e9bb4]">
                        Khóa học
                      </p>

                      <p className="text-sm font-semibold text-white">
                        {cls.coursesCount}{" "}
                        courses
                      </p>

                    </div>

                  </div>

                  {/* Progress */}

                  <div className="mt-5">

                    <div className="flex justify-between text-xs">

                      <span className="text-[#8e9bb4]">
                        Tiến độ học
                      </span>

                      <span className="font-bold text-cyan-400">
                        {cls.progress}%
                      </span>

                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#0a0e1a]">

                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700"
                        style={{
                          width: `${cls.progress}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* Status */}

                  <div className="mt-4 flex items-center gap-2 text-xs">

                    <CheckCircle2
                      className={`h-4 w-4 ${
                        cls.progress >=
                        100
                          ? "text-green-400"
                          : "text-cyan-400"
                      }`}
                    />

                    <span className="text-[#8e9bb4]">

                      {cls.progress >=
                      100
                        ? "Đã hoàn thành"
                        : "Đang học"}

                    </span>

                  </div>

                </div>

                {/* BUTTON */}

                <div className="mt-6 border-t border-[#7bd1fa]/10 pt-4">

                  <Link
                    href={`/dashbroad/student/Class/${cls.id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600/20 px-4 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-600 hover:text-white"
                  >

                    {cls.progress >=
                    100
                      ? "Xem lại"
                      : "Tiếp tục học"}

                    <ArrowRight className="h-4 w-4" />

                  </Link>

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>

  );
}