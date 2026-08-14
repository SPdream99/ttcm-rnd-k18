"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  Loader2,
  User,
  Sparkles,
  Lock,
} from "lucide-react";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
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
  teacher: string;
  estimated_hours: number;
  learning_objectives: string[];
}

const DIFFICULTY_COLOR: Record<string, string> = {
  Beginner: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Intermediate: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Advanced: "text-red-400 bg-red-500/10 border-red-500/20",
};

// ============================================================
// PAGE
// ============================================================

export default function LearningPathDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [path, setPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);

  // ============================================================
  // FETCH
  // ============================================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      const fetchPath = async () => {
        try {
          const id = params.id as string;
          if (!id) { setPath(null); setLoading(false); return; }

          let data: any = null;
          let documentId = "";

          // Try by Document ID first
          const docRef = doc(db, "learning_path", id);
          const snapshot = await getDoc(docRef);

          if (snapshot.exists()) {
            data = snapshot.data();
            documentId = snapshot.id;
          } else {
            const q = query(collection(db, "learning_path"), where("id", "==", id));
            const qs = await getDocs(q);
            if (qs.empty) { setPath(null); setLoading(false); return; }
            const d = qs.docs[0];
            data = d.data();
            documentId = d.id;
          }

          // Teacher name
          let teacherName = "Unknown Teacher";
          if (data.author_id) {
            try {
              const tRef = doc(db, "users", data.author_id);
              const tSnap = await getDoc(tRef);
              if (tSnap.exists()) {
                const td = tSnap.data();
                teacherName = td.name || td.displayName || "Unknown Teacher";
              }
            } catch { /* silent */ }
          }

          const learningPath: LearningPath = {
            id: documentId,
            title: data.title || "Untitled Learning Path",
            description: data.description || "",
            author_id: data.author_id || "",
            courses: Array.isArray(data.courses) ? data.courses : [],
            is_accepted: data.is_accepted ?? false,
            thumbnail: data.thumbnail || "",
            difficulty: data.difficulty || "Beginner",
            category: data.category || "General",
            teacher: teacherName,
            estimated_hours: Number(data.estimated_hours) || 0,
            learning_objectives: Array.isArray(data.learning_objectives) ? data.learning_objectives : [],
          };
          setPath(learningPath);

          // Check enrollment
          if (currentUser) {
            const eq = query(
              collection(db, "student_learning_path"),
              where("student_id", "==", currentUser.uid),
              where("learning_path_id", "==", documentId),
              where("status", "==", "active")
            );
            const es = await getDocs(eq);
            if (!es.empty) setAlreadyEnrolled(true);
          }
        } catch (err) {
          console.error("🔥", err);
          setPath(null);
        } finally {
          setLoading(false);
        }
      };
      fetchPath();
    });
    return () => unsubscribe();
  }, [params.id]);

  // ============================================================
  // ENROLL
  // ============================================================

  const handleEnroll = async () => {
    const user = auth.currentUser;
    if (!user) { toast.error("Bạn chưa đăng nhập.", "Lỗi"); return; }
    if (!path?.id) { toast.error("Không tìm thấy Learning Path.", "Lỗi"); return; }
    if (alreadyEnrolled) { toast.warning("Bạn đã đăng ký Learning Path này rồi."); return; }

    setEnrolling(true);
    try {
      // Double-check
      const checkQ = query(
        collection(db, "student_learning_path"),
        where("student_id", "==", user.uid),
        where("learning_path_id", "==", path.id),
        where("status", "==", "active")
      );
      const existing = await getDocs(checkQ);
      if (!existing.empty) {
        setAlreadyEnrolled(true);
        toast.warning("Bạn đã đăng ký Learning Path này rồi.");
        return;
      }

      await addDoc(collection(db, "student_learning_path"), {
        student_id: user.uid,
        learning_path_id: path.id,
        progress: 0,
        status: "active",
        current_course_index: 0,
        enrolled_at: serverTimestamp(),
      });

      setAlreadyEnrolled(true);
      toast.success("Đăng ký Learning Path thành công! Chuyển đến lớp học...", "Thành công 🎉");

      setTimeout(() => router.push("/dashbroad/student/Class"), 1500);
    } catch (err) {
      console.error("🔥 ENROLL ERROR:", err);
      toast.error("Không thể đăng ký. Vui lòng thử lại.", "Lỗi");
    } finally {
      setEnrolling(false);
    }
  };

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
          <p className="text-sm text-[#8e9bb4]">Đang tải Learning Path...</p>
        </div>
      </main>
    );
  }

  if (!path) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0f1524] border border-[#7bd1fa]/15">
          <BookOpen className="h-7 w-7 text-[#8e9bb4]" />
        </div>
        <h1 className="text-xl font-bold text-white">Learning Path không tồn tại</h1>
        <p className="text-sm text-[#8e9bb4]">Không tìm thấy Learning Path này.</p>
        <button
          onClick={() => router.push("/dashbroad/student/LearningPath")}
          className="mt-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cyan-500 transition"
        >
          Quay lại danh sách
        </button>
      </main>
    );
  }

  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <div className="min-h-screen text-[#e1e2ec]">

      {/* ── BACK ─────────────────────────────────────────────── */}
      <button
        onClick={() => router.push("/dashbroad/student/LearningPath")}
        className="mb-6 flex items-center gap-2 text-sm text-[#8e9bb4] hover:text-cyan-400 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại danh sách
      </button>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">

        {/* LEFT — Info */}
        <div className="rounded-2xl border border-[#7bd1fa]/15 bg-[#0f1524]/60 backdrop-blur-md p-6">

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <span className="rounded-md border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-300">
              {path.category}
            </span>
            <span className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${DIFFICULTY_COLOR[path.difficulty] ?? "text-[#8e9bb4] bg-white/5 border-white/10"}`}>
              {path.difficulty}
            </span>
            {path.is_accepted && (
              <span className="flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="h-3 w-3" /> Approved
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
            {path.title}
          </h1>

          {/* Description */}
          <p className="mt-3 text-sm leading-7 text-[#8e9bb4]">
            {path.description || "Chưa có mô tả."}
          </p>

          {/* Teacher */}
          <div className="mt-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-500/20">
              <User className="h-4 w-4 text-cyan-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#8e9bb4]">Giảng viên</p>
              <p className="text-sm font-semibold text-white">{path.teacher}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-5 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-[#0a0e1a]/50 px-4 py-2.5">
              <BookOpen className="h-4 w-4 text-cyan-400" />
              <div>
                <p className="text-[10px] text-[#8e9bb4]">Courses</p>
                <p className="text-sm font-semibold text-white">{path.courses.length}</p>
              </div>
            </div>
            {path.estimated_hours > 0 && (
              <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-[#0a0e1a]/50 px-4 py-2.5">
                <Clock className="h-4 w-4 text-cyan-400" />
                <div>
                  <p className="text-[10px] text-[#8e9bb4]">Thời lượng</p>
                  <p className="text-sm font-semibold text-white">{path.estimated_hours} giờ</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Enroll card */}
        <div className="rounded-2xl border border-[#7bd1fa]/15 bg-[#0f1524]/60 backdrop-blur-md p-6 flex flex-col">

          {/* Thumbnail */}
          {path.thumbnail ? (
            <img src={path.thumbnail} alt={path.title} className="h-44 w-full rounded-xl object-cover" />
          ) : (
            <div className="flex h-44 w-full items-center justify-center rounded-xl bg-gradient-to-br from-[#0f1a2e] via-[#0f1524] to-[#0a1020] border border-[#7bd1fa]/10">
              <GraduationCap className="h-16 w-16 text-cyan-400/40" />
            </div>
          )}

          {/* Enroll area */}
          <div className="mt-6 flex-1 flex flex-col justify-end">
            {alreadyEnrolled ? (
              <>
                <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-5 py-4 font-semibold text-emerald-400">
                  <CheckCircle2 className="h-5 w-5" />
                  Đã đăng ký
                </div>
                <button
                  onClick={() => router.push("/dashbroad/student/Class")}
                  className="mt-3 w-full rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-6 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-600 hover:text-white hover:border-cyan-500"
                >
                  Đi tới lớp học →
                </button>
              </>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-4 font-semibold text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] transition hover:from-blue-500 hover:to-cyan-400 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {enrolling ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Đang đăng ký...</>
                ) : (
                  <><Sparkles className="h-5 w-5" /> Đăng ký Learning Path</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── LEARNING OBJECTIVES ──────────────────────────────── */}
      {path.learning_objectives.length > 0 && (
        <div className="mt-6 rounded-2xl border border-[#7bd1fa]/15 bg-[#0f1524]/60 backdrop-blur-md p-6">
          <h2 className="text-lg font-bold text-white">Bạn sẽ học được gì?</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {path.learning_objectives.map((obj, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl bg-[#0a0e1a]/50 border border-white/5 p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <p className="text-xs leading-5 text-[#8e9bb4]">{obj}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── COURSES IN PATH ──────────────────────────────────── */}
      <div className="mt-6 rounded-2xl border border-[#7bd1fa]/15 bg-[#0f1524]/60 backdrop-blur-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Courses trong Path</h2>
            <p className="mt-0.5 text-xs text-[#8e9bb4]">Các khóa học thuộc Learning Path này.</p>
          </div>
          <span className="rounded-md border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-300">
            {path.courses.length} Courses
          </span>
        </div>

        <div className="mt-4 space-y-2">
          {path.courses.map((courseId, index) => (
            <div
              key={courseId}
              className="flex items-center gap-4 rounded-xl border border-white/5 bg-[#0a0e1a]/40 p-3.5 transition hover:border-cyan-500/20"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white">
                {index + 1}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-[#8e9bb4]">Course {index + 1}</p>
                <p className="truncate text-sm font-semibold text-white">{courseId}</p>
              </div>
              {alreadyEnrolled ? (
                <div className="ml-auto shrink-0">
                  <Lock className="h-4 w-4 text-[#8e9bb4]" />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}