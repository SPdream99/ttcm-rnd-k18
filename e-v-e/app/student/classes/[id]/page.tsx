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
  Sparkles,
} from "lucide-react";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
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

export default function StudentClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const router = useRouter();
  const nextParams = useParams();
  const rawId = (nextParams?.id as string) || "";

  const [path, setPath] = useState<LearningPath | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          router.push("/student/classes");
          return;
        }

        const pathId = rawId;
        if (!pathId) return;

        // 1. Enrollment
        const enrollmentQuery = query(
          collection(db, "student_learning_path"),
          where("student_id", "==", user.uid),
          where("learning_path_id", "==", pathId)
        );

        const enrollmentSnapshot = await getDocs(enrollmentQuery);

        if (!enrollmentSnapshot.empty) {
          const enrollmentData = enrollmentSnapshot.docs[0].data();
          setEnrollment({
            progress: Number(enrollmentData.progress) || 0,
            status: enrollmentData.status || "active",
          });
        }

        // 2. Learning Path
        const pathQuery = query(
          collection(db, "learning_path"),
          where("__name__", "==", pathId)
        );

        const pathSnapshot = await getDocs(pathQuery);

        if (pathSnapshot.empty) {
          const fallbackQ = query(
            collection(db, "learning_path"),
            where("id", "==", pathId)
          );
          const fallbackSnap = await getDocs(fallbackQ);
          if (fallbackSnap.empty) {
            router.push("/student/classes");
            return;
          }
          const pathDoc = fallbackSnap.docs[0];
          await parseAndSetPath(pathDoc.id, pathDoc.data());
        } else {
          const pathDoc = pathSnapshot.docs[0];
          await parseAndSetPath(pathDoc.id, pathDoc.data());
        }
      } catch (error) {
        console.error("Error loading class:", error);
      } finally {
        setLoading(false);
      }
    });

    async function parseAndSetPath(docId: string, data: any) {
      let teacherName = "Unknown Teacher";
      if (data.author_id) {
        try {
          const teacherQuery = query(
            collection(db, "users"),
            where("id", "==", data.author_id)
          );
          const teacherSnapshot = await getDocs(teacherQuery);
          if (!teacherSnapshot.empty) {
            const teacherData = teacherSnapshot.docs[0].data();
            teacherName =
              teacherData.name ||
              teacherData.displayName ||
              "Unknown Teacher";
          }
        } catch {
          // ignore
        }
      }

      setPath({
        id: docId,
        title: data.title || "Untitled Learning Path",
        description: data.description || "",
        author_id: data.author_id || "",
        courses: Array.isArray(data.courses) ? data.courses : [],
        difficulty: data.difficulty || "Beginner",
        category: data.category || "General",
        teacherName,
        estimated_hours: Number(data.estimated_hours) || 0,
      });

      if (!enrollment) {
        setEnrollment({ progress: 0, status: "active" });
      }
    }

    return () => unsubscribe();
  }, [rawId, router]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 rounded-full border-4 border-zinc-200 border-t-red-600 animate-spin" />
        <p className="text-red-600 font-medium text-sm">Đang tải thông tin lớp học...</p>
      </div>
    );
  }

  if (!path) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center font-sans">
        <BookOpen className="w-12 h-12 text-zinc-400 mb-4" />
        <h1 className="text-xl font-bold text-zinc-900 mb-2">Không tìm thấy Lớp học</h1>
        <Link
          href="/student/classes"
          className="mt-4 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition"
        >
          Quay lại danh sách lớp
        </Link>
      </div>
    );
  }

  const progress = Math.min(enrollment?.progress || 0, 100);

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* ── HEADER BANNER ── */}
      <section className="bg-white rounded-2xl border border-zinc-200 p-6 md:p-8 shadow-sm">
        <Link
          href="/student/classes"
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-red-600 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại Lớp Học Của Tôi
        </Link>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                {path.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-zinc-100 text-zinc-600 text-xs font-medium">
                {path.difficulty}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">
              {path.title}
            </h1>

            <p className="mt-2.5 max-w-3xl text-xs md:text-sm leading-relaxed text-zinc-600">
              {path.description || "Lộ trình đào tạo toàn diện với hệ thống học liệu và minigame tương tác."}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-5 text-xs text-zinc-600">
              <span className="flex items-center gap-1.5 font-bold text-zinc-800">
                <User className="w-4 h-4 text-red-600" />
                Giảng viên: <span className="text-red-700">{path.teacherName}</span>
              </span>

              <span className="flex items-center gap-1.5 font-medium">
                <BookOpen className="w-4 h-4 text-zinc-400" />
                {path.courses.length} Khóa học (Courses)
              </span>

              {path.estimated_hours > 0 && (
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-4 h-4 text-zinc-400" />
                  Thời lượng: {path.estimated_hours} giờ
                </span>
              )}
            </div>
          </div>

          {/* Progress Card */}
          <div className="rounded-2xl bg-red-50 border border-red-200 p-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-bold text-zinc-700 uppercase tracking-wider">Tiến Độ Lớp Học</span>
                <span className="text-base font-black text-red-600">{progress}%</span>
              </div>

              <div className="h-3 w-full bg-zinc-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-600 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="mt-3 text-xs text-zinc-600">
                {progress >= 100
                  ? " Bạn đã hoàn thành toàn bộ lộ trình!"
                  : "Hoàn thành các minigame để nâng cao tiến độ học tập."}
              </p>
            </div>

            <Link
              href={
                path.courses && path.courses.length > 0
                  ? `/student/play/game_card_match_vr/${path.courses[0]}`
                  : `/student/play/game_card_match_vr/crs_coding_basics`
              }
              className="mt-4 w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              Tiếp Tục Học Tập <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── MAP & SIDEBAR ── */}
      <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Learning Journey Map */}
        <div>
          <LearningPathMap courses={path.courses} />
        </div>

        {/* Sidebar Goal & Quick Stats */}
        <aside className="space-y-5">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Mục Tiêu Hiện Tại</p>
                <h3 className="font-extrabold text-sm text-zinc-900">Hoàn Thành Bài Tiếp Theo</h3>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 leading-relaxed">
              Vượt qua thử thách thẻ bài Memory Match và kiểm tra Quiz để mở khóa chứng nhận học phần.
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-zinc-900 border-b border-zinc-100 pb-3">
              Thông Tin Khóa Học
            </h3>

            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-medium flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-zinc-400" /> Tổng Số Bài Học
              </span>
              <span className="font-bold text-zinc-900">{path.courses.length} Bài</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-red-600" /> Trạng Thái
              </span>
              <span className="font-bold text-red-600">
                {progress >= 100 ? "Đã Tốt Nghiệp" : "Đang Học"}
              </span>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
