"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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
  ArrowRight,
} from "lucide-react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useToast } from "@/components/student/Toast";

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
  Beginner: "text-emerald-700 bg-emerald-50 border-emerald-200",
  Intermediate: "text-amber-700 bg-amber-50 border-amber-200",
  Advanced: "text-red-700 bg-red-50 border-red-200",
};

export default function LearningPathDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const router = useRouter();
  const nextParams = useParams();
  const rawId = (nextParams?.id as string) || "";
  const { toast } = useToast();

  const [path, setPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      const fetchPath = async () => {
        try {
          const id = rawId;
          if (!id) { setPath(null); setLoading(false); return; }

          let data: any = null;
          let documentId = "";

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

          let teacherName = "Unknown Teacher";
          if (data.author_id) {
            try {
              const tRef = doc(db, "users", data.author_id);
              const tSnap = await getDoc(tRef);
              if (tSnap.exists()) {
                const td = tSnap.data();
                teacherName = td.name || td.displayName || "Unknown Teacher";
              }
            } catch {
              // ignore
            }
          }

          // Kiểm tra điều kiện một chiều: Tất cả khóa học con phải được duyệt
          const coursesSnap = await getDocs(collection(db, "courses"));
          const acceptedCourseIds = new Set<string>();
          coursesSnap.docs.forEach((d) => {
            const cd = d.data();
            if (cd.isAccepted ?? cd.is_accepted) {
              acceptedCourseIds.add(d.id);
            }
          });

          const isPathAccepted = Boolean(data.is_accepted ?? data.isAccepted);
          const pathCourses: string[] = Array.isArray(data.courses) ? data.courses : [];
          const allCoursesApproved = pathCourses.length > 0 && pathCourses.every((cId: any) => acceptedCourseIds.has(typeof cId === "string" ? cId : cId.id));

          if (!isPathAccepted || !allCoursesApproved) {
            setPath(null);
            setLoading(false);
            return;
          }

          const learningPath: LearningPath = {
            id: documentId,
            title: data.title || "Untitled Learning Path",
            description: data.description || "",
            author_id: data.author_id || "",
            courses: pathCourses,
            is_accepted: isPathAccepted,
            thumbnail: data.thumbnail || "",
            difficulty: data.difficulty || "Beginner",
            category: data.category || "General",
            teacher: teacherName,
            estimated_hours: Number(data.estimated_hours) || 0,
            learning_objectives: Array.isArray(data.learning_objectives) ? data.learning_objectives : [],
          };
          setPath(learningPath);

          if (currentUser) {
            const eq = query(
              collection(db, "student_learning_path"),
              where("student_id", "==", currentUser.uid),
              where("learning_path_id", "==", documentId)
            );
            const es = await getDocs(eq);
            if (!es.empty) {
              setAlreadyEnrolled(true);
            } else {
              setAlreadyEnrolled(false);
            }
          }
        } catch (err) {
          console.error("Error fetching path:", err);
          setPath(null);
        } finally {
          setLoading(false);
        }
      };
      fetchPath();
    });
    return () => unsubscribe();
  }, [rawId]);

  const handleEnroll = async () => {
    const user = auth.currentUser;
    if (!user) { toast.error("Bạn chưa đăng nhập.", "Lỗi"); return; }
    if (!path?.id) { toast.error("Không tìm thấy Learning Path.", "Lỗi"); return; }

    setEnrolling(true);
    try {
      const docKey = `${user.uid}_${path.id}`;
      // Xóa các bản ghi trùng lặp nếu có
      const checkQ = query(
        collection(db, "student_learning_path"),
        where("student_id", "==", user.uid),
        where("learning_path_id", "==", path.id)
      );
      const existing = await getDocs(checkQ);
      let existingProgress = 0;
      let existingIndex = 0;

      for (const d of existing.docs) {
        const data = d.data();
        if (typeof data.progress === "number") existingProgress = data.progress;
        if (typeof data.current_course_index === "number") existingIndex = data.current_course_index;
        if (d.id !== docKey) {
          await deleteDoc(d.ref).catch(() => {});
        }
      }

      await setDoc(doc(db, "student_learning_path", docKey), {
        student_id: user.uid,
        student_name: user.displayName || "Học Viên E-V-E",
        learning_path_id: path.id,
        progress: existingProgress,
        status: "active",
        current_course_index: existingIndex,
        enrolled_at: serverTimestamp(),
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      setAlreadyEnrolled(true);
      toast.success("Tham gia Lộ trình thành công! Đang chuyển đến lớp học...", "Thành công");

      setTimeout(() => router.push("/student/classes"), 1200);
    } catch (err) {
      console.error("Enroll error:", err);
      toast.error("Không thể đăng ký. Vui lòng thử lại.", "Lỗi");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 font-sans">
        <div className="w-10 h-10 rounded-full border-4 border-zinc-200 border-t-red-600 animate-spin" />
        <p className="text-red-600 font-medium text-sm">Đang tải thông tin lộ trình...</p>
      </div>
    );
  }

  if (!path) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center font-sans">
        <BookOpen className="w-12 h-12 text-zinc-400 mb-4" />
        <h1 className="text-xl font-bold text-zinc-900 mb-2">Lộ trình học tập không tồn tại</h1>
        <button
          onClick={() => router.push("/student/learning-paths")}
          className="mt-4 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* ── BACK BUTTON ── */}
      <button
        onClick={() => router.push("/student/learning-paths")}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-red-600 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách Lộ trình
      </button>

      {/* ── HERO BANNER ── */}
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Left Information */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 md:p-8 shadow-sm">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
              {path.category}
            </span>
            <span className={`px-2.5 py-0.5 rounded-md border text-xs font-semibold ${DIFFICULTY_COLOR[path.difficulty] || "bg-zinc-100 text-zinc-700 border-zinc-200"}`}>
              {path.difficulty}
            </span>
            {path.is_accepted && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Đã Kiểm Định
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">
            {path.title}
          </h1>

          {/* Description */}
          <p className="mt-3 text-xs md:text-sm leading-relaxed text-zinc-600">
            {path.description || "Lộ trình đào tạo toàn diện, tích hợp hệ thống minigame tương tác thực hành cao."}
          </p>

          {/* Instructor & Stats */}
          <div className="mt-6 pt-6 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center font-bold text-red-600">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Giảng Viên Hướng Dẫn</p>
                <p className="text-sm font-extrabold text-zinc-900">{path.teacher}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold text-zinc-700">
              <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl">
                <BookOpen className="w-4 h-4 text-red-600" />
                <span>{path.courses.length} Khóa học</span>
              </div>
              {path.estimated_hours > 0 && (
                <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl">
                  <Clock className="w-4 h-4 text-red-600" />
                  <span>{path.estimated_hours} giờ học</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Enroll Card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            {path.thumbnail ? (
              <img src={path.thumbnail} alt={path.title} className="h-44 w-full rounded-xl object-cover border border-zinc-200" />
            ) : (
              <div className="h-44 w-full rounded-xl bg-gradient-to-br from-red-600 to-rose-700 p-6 flex flex-col items-center justify-center text-white text-center">
                <GraduationCap className="w-14 h-14 mb-2 text-white/90" />
                <span className="font-bold text-sm">E-V-E Official Path</span>
              </div>
            )}
          </div>

          <div className="mt-6">
            {alreadyEnrolled ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 py-3.5 font-bold text-emerald-700 text-sm">
                  <CheckCircle2 className="w-4 h-4" /> Bạn Đã Tham Gia Lớp Học
                </div>
                <button
                  onClick={() => router.push("/student/classes")}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  Đi Tới Lớp Học <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {enrolling ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Đang Đăng Ký...</>
                ) : (
                  <><Sparkles className="w-4 h-4 fill-white" /> Đăng Ký Học Lộ Trình</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── LEARNING OBJECTIVES ── */}
      {path.learning_objectives.length > 0 && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 md:p-8 shadow-sm">
          <h2 className="text-base font-extrabold text-zinc-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-600" /> Chuẩn Đầu Ra & Kiến Thức Thu Nhận
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {path.learning_objectives.map((obj, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl bg-zinc-50 border border-zinc-200 p-3.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                <p className="text-xs font-semibold text-zinc-700 leading-relaxed">{obj}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── COURSES IN PATH ── */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-100">
          <div>
            <h2 className="text-base font-extrabold text-zinc-900">Danh Sách Bài Học Trong Lộ Trình</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Các khóa học thành phần và minigame tương ứng.</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold">
            {path.courses.length} Khóa Học
          </span>
        </div>

        <div className="space-y-3">
          {path.courses.map((courseId, index) => (
            <div
              key={courseId}
              className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-red-600 transition"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-red-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                  #{index + 1}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-zinc-400">Khóa học {index + 1}</p>
                  <p className="text-sm font-extrabold text-zinc-900">{courseId}</p>
                </div>
              </div>

              <Link
                href={`/student/courses/${courseId}`}
                className="px-3.5 py-1.5 rounded-lg bg-white border border-zinc-200 hover:border-red-600 hover:text-red-600 text-zinc-700 text-xs font-bold shadow-sm transition flex items-center gap-1"
              >
                Chi Tiết <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
