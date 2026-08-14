"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Gamepad2,
} from "lucide-react";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
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
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [path, setPath] = useState<LearningPath | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const user = auth.currentUser;
        const pathId = resolvedParams.id;

        // Fetch enrollment
        if (user) {
          try {
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
          } catch {}
        }

        // Fetch learning path
        const docRef = doc(db, "learning_path", pathId);
        const snapshot = await getDoc(docRef);

        let data: any = null;
        let documentId = pathId;

        if (snapshot.exists()) {
          data = snapshot.data();
        } else {
          const q = query(collection(db, "learning_path"), where("id", "==", pathId));
          const qs = await getDocs(q);
          if (!qs.empty) {
            data = qs.docs[0].data();
            documentId = qs.docs[0].id;
          }
        }

        if (data) {
          let teacherName = data.authorName || data.teacherName || "Giáo Viên E-V-E";
          if (data.author_id) {
            try {
              const teacherDoc = await getDoc(doc(db, "teachers", data.author_id));
              if (teacherDoc.exists()) {
                teacherName = teacherDoc.data()?.name || teacherDoc.data()?.fullName || teacherName;
              }
            } catch {}
          }

          setPath({
            id: documentId,
            title: data.title || "Lớp Học",
            description: data.description || "",
            author_id: data.author_id || "",
            courses: Array.isArray(data.courses) ? data.courses : ["crs_coding_basics", "crs_computer_hardware"],
            difficulty: data.difficulty || "Intermediate",
            category: data.category || "General",
            teacherName,
            estimated_hours: Number(data.estimated_hours) || 6,
          });
        } else {
          // Fallback demo class
          setPath({
            id: pathId,
            title: pathId.replace(/_/g, " ").toUpperCase(),
            description: "Khóa học trực tuyến thuộc chương trình đào tạo E-V-E.",
            author_id: "teacher_001",
            courses: ["crs_coding_basics", "crs_computer_hardware", "crs_python_mini_games"],
            difficulty: "Intermediate",
            category: "Công Nghệ",
            teacherName: "Giảng Viên E-V-E",
            estimated_hours: 6,
          });
        }
      } catch (err) {
        console.error("Error fetching class detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClass();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-3 text-cyan-400">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="font-medium">Đang tải thông tin lớp học...</span>
        </div>
      </div>
    );
  }

  if (!path) {
    return (
      <div className="p-12 text-center rounded-2xl bg-[#0f1524]/60 border border-[#7bd1fa]/10 space-y-4">
        <BookOpen className="w-12 h-12 text-slate-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Không tìm thấy thông tin lớp học</h2>
        <Link
          href="/student/classes"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Quay Lại Danh Sách Lớp
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#7bd1fa]/10">
        <Link
          href="/student/classes"
          className="p-2 rounded-xl bg-[#151b2c] hover:bg-slate-800 text-slate-300 hover:text-white transition-all border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <GraduationCap className="h-4 w-4" /> Chi Tiết Lớp Học & Tiến Độ
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1">
            {path.title}
          </h1>
        </div>
      </div>

      {/* Hero Overview */}
      <div className="rounded-3xl border border-[#7bd1fa]/20 bg-[#0f1524]/80 p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded-md border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
              {path.category}
            </span>
            <span className="text-xs text-[#8e9bb4]">
              Giảng viên: <strong className="text-slate-200">{path.teacherName}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#8e9bb4]">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Thời lượng: ~{path.estimated_hours} giờ</span>
          </div>
        </div>

        <p className="text-xs md:text-sm text-[#8e9bb4] leading-relaxed">
          {path.description}
        </p>

        {/* Progress bar */}
        <div className="space-y-2 p-4 rounded-2xl bg-[#151b2c] border border-[#7bd1fa]/10">
          <div className="flex justify-between text-xs">
            <span className="text-[#8e9bb4] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Tiến độ hoàn thành bài học
            </span>
            <span className="font-bold text-cyan-400 font-mono">{enrollment?.progress ?? 0}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#0a0e1a]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 transition-all duration-500"
              style={{ width: `${enrollment?.progress ?? 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Visual Roadmap Map */}
      <div className="rounded-3xl border border-[#7bd1fa]/15 bg-[#0f1524]/60 p-6 backdrop-blur-md">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" /> Bản Đồ Chặng Học Tập
          </h2>
          <p className="text-xs text-[#8e9bb4] mt-1">
            Hoàn thành lần lượt từng bài học để mở khóa chặng tiếp theo và minigame thử thách.
          </p>
        </div>

        <LearningPathMap courses={path.courses} />
      </div>
    </div>
  );
}
