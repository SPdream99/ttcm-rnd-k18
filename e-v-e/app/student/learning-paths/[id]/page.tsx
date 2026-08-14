"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Compass,
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

export default function StudentLearningPathDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { toast } = useToast();

  const [path, setPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      const fetchPath = async () => {
        try {
          const id = resolvedParams.id;
          if (!id) {
            setPath(null);
            setLoading(false);
            return;
          }

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
            if (qs.empty) {
              setPath(null);
              setLoading(false);
              return;
            }
            const d = qs.docs[0];
            data = d.data();
            documentId = d.id;
          }

          let teacherName = data.authorName || data.teacherName || "Giáo Viên E-V-E";
          if (data.author_id) {
            try {
              const teacherDoc = await getDoc(doc(db, "teachers", data.author_id));
              if (teacherDoc.exists()) {
                teacherName = teacherDoc.data()?.name || teacherDoc.data()?.fullName || teacherName;
              }
            } catch {}
          }

          if (currentUser) {
            try {
              const enrollQ = query(
                collection(db, "student_learning_path"),
                where("student_id", "==", currentUser.uid),
                where("learning_path_id", "==", documentId)
              );
              const enrollSnap = await getDocs(enrollQ);
              const active = enrollSnap.docs.some((d) => d.data().status === "active");
              setAlreadyEnrolled(active);
            } catch {}
          }

          setPath({
            id: documentId,
            title: data.title || "Lộ Trình Học Tập",
            description: data.description || "",
            author_id: data.author_id || "",
            courses: Array.isArray(data.courses) ? data.courses : [],
            is_accepted: Boolean(data.is_accepted ?? true),
            thumbnail: data.thumbnail,
            difficulty: data.difficulty || "Intermediate",
            category: data.category || "General",
            teacher: teacherName,
            estimated_hours: Number(data.estimated_hours) || (Array.isArray(data.courses) ? data.courses.length * 2 : 4),
            learning_objectives: Array.isArray(data.learning_objectives)
              ? data.learning_objectives
              : [
                  "Nắm vững nền tảng lý thuyết và tư duy phân tích theo chuẩn E-V-E",
                  "Thực hành giải bài tập và vượt qua các thử thách minigame tương tác",
                  "Hoàn thiện các kỹ năng thực chiến và bài kiểm tra đánh giá tự động",
                ],
          });
        } catch (err) {
          console.error("Error fetching path detail:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchPath();
    });

    return () => unsubscribe();
  }, [resolvedParams.id]);

  const handleEnroll = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast.warning("Vui lòng đăng nhập để đăng ký lộ trình này!");
      router.push("/login");
      return;
    }
    if (!path) return;

    setEnrolling(true);
    try {
      await addDoc(collection(db, "student_learning_path"), {
        student_id: user.uid,
        learning_path_id: path.id,
        progress: 0,
        status: "active",
        enrolled_at: serverTimestamp(),
      });

      toast.success("Đăng ký thành công! Bạn có thể bắt đầu học ngay bây giờ.");
      router.push(`/dashbroad/student/Class/${path.id}`);
    } catch (err) {
      console.error("Enroll error:", err);
      toast.error("Không thể đăng ký lúc này. Vui lòng thử lại!");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
        <p className="text-cyan-400 font-medium text-sm">Đang tải thông tin Lộ Trình...</p>
      </div>
    );
  }

  if (!path) {
    return (
      <div className="p-12 text-center rounded-2xl bg-[#0f1524]/60 border border-[#7bd1fa]/10 space-y-4">
        <BookOpen className="w-12 h-12 text-slate-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Không tìm thấy Lộ Trình Học Tập</h2>
        <p className="text-xs text-[#8e9bb4]">Lộ trình này không tồn tại hoặc đã bị gỡ xuống.</p>
        <Link
          href="/student/learning-paths"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Quay Lại Danh Sách
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 font-sans">
      {/* Back Button */}
      <Link
        href="/student/learning-paths"
        className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Quay Lại Danh Sách Lộ Trình
      </Link>

      {/* Main Hero Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#0f1524]/80 border border-[#7bd1fa]/20 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 text-xs font-bold">
              {path.category}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                DIFFICULTY_COLOR[path.difficulty] || "text-slate-300 bg-slate-500/10 border-slate-500/20"
              }`}
            >
              {path.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#8e9bb4]">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-400" /> ~{path.estimated_hours} Giờ
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-cyan-400" /> {path.courses.length} Khóa học
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {path.title}
          </h1>
          <p className="text-sm text-[#8e9bb4] mt-3 leading-relaxed">
            {path.description}
          </p>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#151b2c] border border-[#7bd1fa]/10">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-[#8e9bb4]">Giảng viên phụ trách</div>
            <div className="text-sm font-bold text-white">{path.teacher}</div>
          </div>
        </div>

        {/* Action Button */}
        <div>
          {alreadyEnrolled ? (
            <Link
              href={`/dashbroad/student/Class/${path.id}`}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Bạn Đã Đăng Ký — Vào Học Ngay
            </Link>
          ) : (
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-cyan-300 text-white font-bold text-sm shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {enrolling ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Đang xử lý đăng ký...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Đăng Ký Tham Gia Lộ Trình Này
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Learning Objectives */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#0f1524]/60 border border-[#7bd1fa]/15 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" /> Mục Tiêu Đạt Được Sau Lộ Trình
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {path.learning_objectives.map((obj, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-[#151b2c]/80 border border-[#7bd1fa]/10 text-xs text-slate-200"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{obj}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Curriculum Outline */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#0f1524]/60 border border-[#7bd1fa]/15 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" /> Danh Sách Khóa Học & Bài Giảng ({path.courses.length})
        </h2>
        <div className="space-y-3">
          {path.courses.map((courseId, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 rounded-xl bg-[#151b2c] border border-[#7bd1fa]/10 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <div>
                  <div className="font-bold text-white text-sm">Chặng {idx + 1}: {courseId.replace(/_/g, " ").toUpperCase()}</div>
                  <div className="text-[11px] text-[#8e9bb4]">Bài giảng lý thuyết & minigame thực hành tương tác</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-white/5 text-slate-400 text-[11px]">
                Chặng {idx + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
