"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  Loader2,
  Target,
  User,
} from "lucide-react";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

import LearningPathMap from "@/components/LearningPathMap";

interface LearningPath {
  id: string;
  title: string;
  description: string;
  author_id: string;
  courses: string[];
  difficulty: string;
  category: string;
  teacherName: string;
  estimated_hours: number;
}

interface Enrollment {
  progress: number;
  status: string;
}

export default function StudentClassDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [path, setPath] = useState<LearningPath | null>(null);
  const [enrollment, setEnrollment] =
    useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
          router.push("/dashbroad/student/Class");
          return;
        }

        const pathId = params.id as string;

        // ==============================
        // LẤY ENROLLMENT
        // ==============================

        const enrollmentQuery = query(
          collection(db, "student_learning_path"),
          where("student_id", "==", user.uid),
          where("learning_path_id", "==", pathId)
        );

        const enrollmentSnapshot =
          await getDocs(enrollmentQuery);

        if (enrollmentSnapshot.empty) {
          router.push("/dashbroad/student/Class");
          return;
        }

        const enrollmentData =
          enrollmentSnapshot.docs[0].data();

        setEnrollment({
          progress: Number(enrollmentData.progress) || 0,
          status: enrollmentData.status || "active",
        });

        // ==============================
        // LẤY LEARNING PATH
        // ==============================

        const pathQuery = query(
          collection(db, "learning_path"),
          where("__name__", "==", pathId)
        );

        const pathSnapshot = await getDocs(pathQuery);

        if (pathSnapshot.empty) {
          router.push("/dashbroad/student/Class");
          return;
        }

        const pathDoc = pathSnapshot.docs[0];
        const data = pathDoc.data();

        // ==============================
        // LẤY TEACHER
        // ==============================

        let teacherName = "Unknown Teacher";

        if (data.author_id) {
          const teacherQuery = query(
            collection(db, "users"),
            where("id", "==", data.author_id)
          );

          const teacherSnapshot =
            await getDocs(teacherQuery);

          if (!teacherSnapshot.empty) {
            const teacherData =
              teacherSnapshot.docs[0].data();

            teacherName =
              teacherData.name ||
              teacherData.displayName ||
              "Unknown Teacher";
          }
        }

        // ==============================
        // SET PATH
        // ==============================

        setPath({
          id: pathDoc.id,
          title: data.title || "Untitled Learning Path",
          description: data.description || "",
          author_id: data.author_id || "",

          courses: Array.isArray(data.courses)
            ? data.courses
            : [],

          difficulty: data.difficulty || "Beginner",
          category: data.category || "General",

          teacherName,

          estimated_hours:
            Number(data.estimated_hours) || 0,
        });
      } catch (error) {
        console.error("Error loading class:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClass();
  }, [params.id, router]);

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a0e1a]">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </main>
    );
  }

  // ==============================
  // NOT FOUND
  // ==============================

  if (!path || !enrollment) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a0e1a] text-white">
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 text-slate-600" />

          <h1 className="mt-4 text-xl font-bold">
            Không tìm thấy Learning Path
          </h1>

          <Link
            href="/dashbroad/student/Class"
            className="mt-5 inline-flex rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-500"
          >
            Quay lại Class
          </Link>
        </div>
      </main>
    );
  }

  const progress = Math.min(enrollment.progress, 100);

  // ==============================
  // MAIN PAGE
  // ==============================

  return (
    <main className="min-h-screen bg-[#0a0e1a] text-[#e1e2ec]">

      {/* HEADER */}

      <section className="border-b border-[#7bd1fa]/10 bg-[#0c1220]">
        <div className="mx-auto max-w-7xl px-5 py-7 md:px-8">

          <Link
            href="/dashbroad/student/Class"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-cyan-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Lớp học của tôi
          </Link>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">

            {/* INFORMATION */}

            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                  {path.category}
                </span>

                <span className="text-xs text-slate-500">
                  {path.difficulty}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-extrabold text-white md:text-4xl">
                {path.title}
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                {path.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-5 text-xs text-slate-400">

                <span className="flex items-center gap-2">
                  <User className="h-4 w-4 text-cyan-400" />
                  {path.teacherName}
                </span>

                <span className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-cyan-400" />
                  {path.courses.length} courses
                </span>

                {path.estimated_hours > 0 && (
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-cyan-400" />
                    {path.estimated_hours} giờ
                  </span>
                )}

              </div>
            </div>

            {/* PROGRESS */}

            <div className="rounded-2xl border border-cyan-500/10 bg-cyan-500/5 p-5">

              <div className="flex justify-between text-sm">
                <span className="text-slate-400">
                  Tiến độ
                </span>

                <span className="font-bold text-cyan-400">
                  {progress}%
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#070b13]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <p className="mt-3 text-xs text-slate-500">
                {progress >= 100
                  ? "🎉 Bạn đã hoàn thành!"
                  : "Tiếp tục học để hoàn thành lộ trình."}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CONTENT */}

      <section className="mx-auto max-w-7xl px-5 py-8 md:px-8">

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">

          {/* LEARNING MAP */}

          <div className="rounded-3xl border border-[#7bd1fa]/10 bg-[#0f1524]/60 p-6 md:p-8">

            <div className="mb-8 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
                <GraduationCap className="h-5 w-5 text-cyan-400" />
              </div>

              <div>
                <h2 className="font-bold text-white">
                  Learning Journey
                </h2>

                <p className="text-xs text-slate-500">
                  Hành trình học tập của bạn
                </p>
              </div>

            </div>

            {/* QUAN TRỌNG */}

            <LearningPathMap
              courses={path.courses}
            />

          </div>

          {/* SIDEBAR */}

          <aside className="space-y-5">

            {/* GOAL */}

            <div className="rounded-3xl border border-cyan-500/10 bg-[#0f1524]/60 p-6">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
                  <Target className="h-5 w-5 text-cyan-400" />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">
                    Current Goal
                  </p>

                  <h3 className="font-bold text-white">
                    Mục tiêu tiếp theo
                  </h3>
                </div>

              </div>

              <div className="mt-5 rounded-xl border border-white/5 bg-[#0a0e1a]/60 p-4">

                <p className="text-sm font-semibold text-cyan-300">
                  Hoàn thành course tiếp theo
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Tiếp tục hoàn thành bài học hiện tại
                  để mở khóa nội dung tiếp theo.
                </p>

              </div>
            </div>

            {/* STATS */}

            <div className="rounded-3xl border border-white/5 bg-[#0f1524]/60 p-6">

              <h3 className="font-bold text-white">
                Thống kê
              </h3>

              <div className="mt-5 space-y-4">

                <div className="flex items-center justify-between">

                  <span className="flex items-center gap-2 text-xs text-slate-400">
                    <BookOpen className="h-4 w-4 text-cyan-400" />
                    Courses
                  </span>

                  <span className="font-bold text-white">
                    {path.courses.length}
                  </span>

                </div>

                <div className="flex items-center justify-between">

                  <span className="flex items-center gap-2 text-xs text-slate-400">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                    Progress
                  </span>

                  <span className="font-bold text-cyan-400">
                    {progress}%
                  </span>

                </div>

              </div>
            </div>

            {/* CONTINUE */}

            <button
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:from-blue-500 hover:to-cyan-400"
            >
              Tiếp tục học
              <ArrowRight className="h-4 w-4" />
            </button>

          </aside>

        </div>
      </section>

    </main>
  );
}