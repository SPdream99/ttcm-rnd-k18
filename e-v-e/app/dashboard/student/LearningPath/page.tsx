"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Search,
  GraduationCap,
  Clock,
  User,
  ArrowRight,
  Loader2,
  Compass,
} from "lucide-react";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useToast } from "@/components/student/Toast";

// ============================================================
// TYPES
// ============================================================

interface LearningPath {
  id: string;
  title: string;
  description: string;
  author_id: string;
  courses: string[];
  is_accepted: boolean;
  thumbnail?: string;
  difficulty: string;
  category: string;
  teacherName: string;
  estimated_hours: number;
}

const DIFFICULTY_COLOR: Record<string, string> = {
  Beginner: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Intermediate: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Advanced: "text-red-400 bg-red-500/10 border-red-500/20",
};

// ============================================================
// PAGE
// ============================================================

export default function StudentLearningPathPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // ============================================================
  // FETCH
  // ============================================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          setLearningPaths([]);
          setLoading(false);
          return;
        }

        // 1. All accepted paths
        const pathQuery = query(
          collection(db, "learning_path"),
          where("is_accepted", "==", true)
        );
        const pathSnapshot = await getDocs(pathQuery);

        // 2. Already enrolled
        const enrollmentQuery = query(
          collection(db, "student_learning_path"),
          where("student_id", "==", user.uid)
        );
        const enrollmentSnapshot = await getDocs(enrollmentQuery);

        const enrolledPathIds = new Set(
          enrollmentSnapshot.docs
            .map((d) => {
              const data = d.data();
              return data.status === "active" ? data.learning_path_id : null;
            })
            .filter(Boolean)
        );

        // 3. Filter unenrolled
        const availablePaths = pathSnapshot.docs.filter(
          (d) => !enrolledPathIds.has(d.id)
        );

        // 4. Fetch teacher names
        const paths: LearningPath[] = await Promise.all(
          availablePaths.map(async (docSnap) => {
            const data = docSnap.data();
            let teacherName = "Unknown Teacher";

            if (data.author_id) {
              const tq = query(
                collection(db, "users"),
                where("id", "==", data.author_id)
              );
              const ts = await getDocs(tq);
              if (!ts.empty) {
                const td = ts.docs[0].data();
                teacherName = td.name || td.displayName || "Unknown Teacher";
              }
            }

            return {
              id: docSnap.id,
              title: data.title || "Untitled Learning Path",
              description: data.description || "",
              author_id: data.author_id || "",
              courses: Array.isArray(data.courses) ? data.courses : [],
              is_accepted: data.is_accepted ?? false,
              thumbnail: data.thumbnail || "",
              difficulty: data.difficulty || "Beginner",
              category: data.category || "General",
              teacherName,
              estimated_hours: Number(data.estimated_hours) || 0,
            };
          })
        );

        setLearningPaths(paths);
      } catch (err) {
        console.error("🔥 Error loading learning paths:", err);
        toast.error("Không thể tải danh sách Learning Path.", "Lỗi");
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // ============================================================
  // SEARCH FILTER
  // ============================================================

  const filteredPaths = learningPaths.filter((path) => {
    const kw = search.toLowerCase().trim();
    if (!kw) return true;
    return (
      path.title.toLowerCase().includes(kw) ||
      path.description.toLowerCase().includes(kw) ||
      path.category.toLowerCase().includes(kw) ||
      path.teacherName.toLowerCase().includes(kw)
    );
  });

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <Loader2 className="h-10 w-10 animate-spin text-cyan-500" />
            <div className="absolute inset-0 rounded-full blur-md bg-cyan-500/20" />
          </div>
          <p className="text-sm text-[#8e9bb4]">Đang tải Learning Paths...</p>
        </div>
      </main>
    );
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="min-h-screen text-[#e1e2ec]">

      {/* ── HEADER ─────────────────────────────────────────── */}
      <div className="mb-8 border-b border-[#7bd1fa]/10 pb-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-cyan-400">
          <Compass className="h-4 w-4" />
          Learning Paths
        </div>

        <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
              Khám phá lộ trình học tập
              <span className="ml-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                🗺️
              </span>
            </h1>
            <p className="mt-1 text-sm text-[#8e9bb4]">
              Chọn một Learning Path phù hợp với mục tiêu của bạn.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8e9bb4]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm Learning Path..."
              className="w-full rounded-xl border border-[#7bd1fa]/15 bg-[#0f1524]/60 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-[#8e9bb4] outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition backdrop-blur-md"
            />
          </div>
        </div>
      </div>

      {/* ── CONTENT ────────────────────────────────────────── */}

      {filteredPaths.length === 0 ? (

        /* Empty state */
        <div className="rounded-3xl border border-dashed border-[#7bd1fa]/20 bg-[#0f1524]/40 p-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0a0e1a] border border-[#7bd1fa]/10">
            <BookOpen className="h-8 w-8 text-[#8e9bb4]" />
          </div>
          <h2 className="mt-5 text-xl font-bold text-white">
            {search ? "Không tìm thấy kết quả" : "Bạn đã đăng ký tất cả Learning Path"}
          </h2>
          <p className="mt-2 text-sm text-[#8e9bb4]">
            {search
              ? "Thử tìm kiếm với từ khóa khác."
              : "Hiện chưa có Learning Path mới nào để khám phá."}
          </p>
        </div>

      ) : (

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredPaths.map((path) => (
            <div
              key={path.id}
              onClick={() => router.push(`/dashboard/student/LearningPath/${path.id}`)}
              className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#7bd1fa]/15 bg-[#0f1524]/60 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.08)] hover:-translate-y-0.5"
            >
              {/* Thumbnail */}
              {path.thumbnail ? (
                <img
                  src={path.thumbnail}
                  alt={path.title}
                  className="h-40 w-full object-cover"
                />
              ) : (
                <div className="flex h-40 items-center justify-center bg-gradient-to-br from-[#0f1a2e] via-[#0f1524] to-[#0a1020]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                    <GraduationCap className="h-7 w-7 text-cyan-400" />
                  </div>
                </div>
              )}

              {/* Body */}
              <div className="flex flex-1 flex-col p-5">

                {/* Top badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-cyan-300">
                    {path.category}
                  </span>
                  <span className={`rounded-md border px-2.5 py-0.5 text-xs font-medium ${DIFFICULTY_COLOR[path.difficulty] ?? "text-[#8e9bb4] bg-white/5 border-white/10"}`}>
                    {path.difficulty}
                  </span>
                </div>

                {/* Title */}
                <h2 className="mt-3 line-clamp-2 text-base font-bold text-white transition group-hover:text-cyan-300">
                  {path.title}
                </h2>

                {/* Description */}
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#8e9bb4]">
                  {path.description || "Chưa có mô tả."}
                </p>

                {/* Stats row */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="flex items-center gap-1 rounded-lg bg-[#0a0e1a]/50 border border-white/5 px-2.5 py-1 text-xs text-[#8e9bb4]">
                    <BookOpen className="h-3.5 w-3.5 text-cyan-500" />
                    {path.courses.length} courses
                  </span>
                  {path.estimated_hours > 0 && (
                    <span className="flex items-center gap-1 rounded-lg bg-[#0a0e1a]/50 border border-white/5 px-2.5 py-1 text-xs text-[#8e9bb4]">
                      <Clock className="h-3.5 w-3.5 text-cyan-500" />
                      {path.estimated_hours}h
                    </span>
                  )}
                </div>

                {/* Teacher */}
                <div className="mt-3 flex items-center gap-2 text-xs text-[#8e9bb4]">
                  <User className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{path.teacherName}</span>
                </div>

                {/* CTA button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/dashboard/student/LearningPath/${path.id}`);
                  }}
                  className="mt-auto pt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-cyan-500/20 px-4 py-2.5 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-600 hover:text-white hover:border-cyan-500"
                >
                  Xem Learning Path
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
