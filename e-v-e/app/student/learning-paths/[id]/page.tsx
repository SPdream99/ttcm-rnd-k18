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

          const objectives: string[] = Array.isArray(data.learning_objectives)
            ? data.learning_objectives
            : [
                "Nắm vững tư duy logic và cấu trúc giải quyết bài toán",
                "Thực hành qua các Minigame chuẩn E-V-E Game SDK v2.0",
                "Mở khóa các chặng bài giảng nâng cao theo bản đồ học tập",
                "Tích lũy E-V-E Coins để đổi huy hiệu vinh danh",
              ];

          setPath({
            id: documentId,
            title: data.title || "Lộ Trình Học Tập",
            description: data.description || "",
            author_id: data.author_id || "",
            courses: Array.isArray(data.courses) ? data.courses : [],
            is_accepted: data.is_accepted ?? true,
            thumbnail: data.thumbnail,
            difficulty: data.difficulty || "Intermediate",
            category: data.category || "Công nghệ & Lập trình",
            teacher: teacherName,
            estimated_hours: Number(data.estimated_hours) || 6,
            learning_objectives: objectives,
          });

          // Check if user is already enrolled
          if (currentUser) {
            try {
              const enrollmentQuery = query(
                collection(db, "student_learning_path"),
                where("student_id", "==", currentUser.uid),
                where("learning_path_id", "==", documentId)
              );
              const enrollmentSnapshot = await getDocs(enrollmentQuery);
              if (!enrollmentSnapshot.empty) {
                setAlreadyEnrolled(true);
              }
            } catch {}
          }
        } catch (error) {
          console.error("Error fetching learning path detail:", error);
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
      toast.error("Vui lòng đăng nhập để đăng ký lộ trình học tập.");
      router.push("/login");
      return;
    }

    if (!path) return;

    setEnrolling(true);
    try {
      await addDoc(collection(db, "student_learning_path"), {
        student_id: user.uid,
        learning_path_id: path.id,
        status: "active",
        progress: 0,
        completed_courses: [],
        created_at: serverTimestamp(),
      });

      toast.success("Đăng ký lộ trình học tập thành công!");
      setAlreadyEnrolled(true);
      router.push(`/student/classes/${path.id}`);
    } catch (error) {
      console.error("Error enrolling in path:", error);
      toast.error("Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại!");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 rounded-full border-4 border-zinc-200 border-t-red-600 animate-spin" />
        <p className="text-red-600 font-medium text-sm">Đang tải thông tin lộ trình...</p>
      </div>
    );
  }

  if (!path) {
    return (
      <div className="p-12 text-center rounded-2xl bg-white border border-zinc-200 space-y-4">
        <BookOpen className="w-12 h-12 text-zinc-300 mx-auto" />
        <h2 className="text-xl font-bold text-zinc-900">Không tìm thấy Lộ Trình Học Tập</h2>
        <Link
          href="/student/learning-paths"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
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
        className="inline-flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Quay Lại Danh Sách Lộ Trình
      </Link>

      {/* Main Hero Card (Solid Red & White) */}
      <div className="p-6 md:p-8 rounded-2xl bg-white border-2 border-red-600 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-md bg-red-50 text-red-700 border border-red-200 text-xs font-bold">
              {path.category}
            </span>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-zinc-100 text-zinc-700 border border-zinc-200">
              {path.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-600">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-4 h-4 text-red-600" /> ~{path.estimated_hours} Giờ
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <BookOpen className="w-4 h-4 text-red-600" /> {path.courses.length} Khóa học
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight leading-tight">
            {path.title}
          </h1>
          <p className="text-sm text-zinc-600 mt-2 leading-relaxed">
            {path.description}
          </p>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
          <div className="w-10 h-10 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-zinc-500 font-medium">Giảng viên phụ trách</div>
            <div className="text-sm font-bold text-zinc-900">{path.teacher}</div>
          </div>
        </div>

        {/* Action Button */}
        <div>
          {alreadyEnrolled ? (
            <Link
              href={`/student/classes/${path.id}`}
              className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-900 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Bạn Đã Đăng Ký — Vào Lớp Học Ngay
            </Link>
          ) : (
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
      <div className="p-6 md:p-8 rounded-2xl bg-white border border-zinc-200 space-y-4 shadow-sm">
        <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-red-600" /> Mục Tiêu Đạt Được Sau Lộ Trình
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {path.learning_objectives.map((obj, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800"
            >
              <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{obj}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Curriculum Outline */}
      <div className="p-6 md:p-8 rounded-2xl bg-white border border-zinc-200 space-y-4 shadow-sm">
        <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-red-600" /> Danh Sách Khóa Học & Bài Giảng ({path.courses.length})
        </h2>
        <div className="space-y-3">
          {path.courses.map((courseId, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-md bg-red-600 text-white font-bold flex items-center justify-center text-xs font-mono">
                  {idx + 1}
                </span>
                <div>
                  <div className="font-bold text-zinc-900 text-sm">Chặng {idx + 1}: {courseId.replace(/^crs_/, "").replace(/_/g, " ").toUpperCase()}</div>
                  <div className="text-[11px] text-zinc-500">Bài giảng lý thuyết & minigame thực hành tương tác</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-zinc-200 text-zinc-700 text-[11px] font-bold">
                Chặng {idx + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
