"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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
  Sparkles,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";
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
  teacherName: string;
  estimated_hours: number;
}

const DIFFICULTY_COLOR: Record<string, string> = {
  Beginner: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Intermediate: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Advanced: "text-red-400 bg-red-500/10 border-red-500/20",
};

export default function StudentLearningPathPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          // If not logged in, show all accepted paths
          const pathQuery = query(collection(db, "learning_path"));
          const pathSnapshot = await getDocs(pathQuery);
          const availablePaths = pathSnapshot.docs;
          await loadTeachersAndSetPaths(availablePaths);
          setLoading(false);
          return;
        }

        // 1. All accepted paths (or all paths)
        const pathQuery = query(collection(db, "learning_path"));
        const pathSnapshot = await getDocs(pathQuery);

        // 2. Enrolled paths check
        let enrolledPathIds = new Set<string>();
        try {
          const enrollmentQuery = query(
            collection(db, "student_learning_path"),
            where("student_id", "==", user.uid)
          );
          const enrollmentSnapshot = await getDocs(enrollmentQuery);
          enrolledPathIds = new Set(
            enrollmentSnapshot.docs
              .map((d) => {
                const data = d.data();
                return data.status === "active" ? data.learning_path_id : null;
              })
              .filter(Boolean)
          );
        } catch {}

        // 3. Filter paths
        const availablePaths = pathSnapshot.docs.filter(
          (doc) => !enrolledPathIds.has(doc.id)
        );

        await loadTeachersAndSetPaths(availablePaths);
      } catch (error) {
        console.error("Error fetching learning paths:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  async function loadTeachersAndSetPaths(docs: any[]) {
    const teacherIds = new Set<string>();
    docs.forEach((doc) => {
      const data = doc.data();
      if (data.author_id) teacherIds.add(data.author_id);
    });

    const teacherMap: Record<string, string> = {};
    if (teacherIds.size > 0) {
      try {
        const teacherSnapshot = await getDocs(collection(db, "teachers"));
        teacherSnapshot.docs.forEach((doc) => {
          if (teacherIds.has(doc.id)) {
            const data = doc.data();
            teacherMap[doc.id] = data.name || data.fullName || "Giảng viên E-V-E";
          }
        });
      } catch {}
    }

    const paths: LearningPath[] = docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "Lộ trình học tập",
        description: data.description || "",
        author_id: data.author_id,
        courses: Array.isArray(data.courses) ? data.courses : [],
        is_accepted: Boolean(data.is_accepted ?? true),
        thumbnail: data.thumbnail,
        difficulty: data.difficulty || "Intermediate",
        category: data.category || "General",
        teacherName: teacherMap[data.author_id] || data.authorName || "Giáo Viên E-V-E",
        estimated_hours: Number(data.estimated_hours) || (Array.isArray(data.courses) ? data.courses.length * 2 : 4),
      };
    });

    setLearningPaths(paths);
  }

  const filteredPaths = learningPaths.filter((path) => {
    const q = search.toLowerCase();
    return (
      path.title.toLowerCase().includes(q) ||
      path.description.toLowerCase().includes(q) ||
      path.category.toLowerCase().includes(q) ||
      path.teacherName.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
        <p className="text-cyan-400 font-medium text-sm">Đang tải danh mục Lộ Trình Học Tập...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1.5">
            <Compass className="w-4 h-4" /> Khám Phá Lộ Trình Học Tập
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Learning Paths Chuyên Sâu 🗺️
          </h1>
          <p className="text-xs md:text-sm text-[#8e9bb4] mt-1">
            Các lộ trình bài học chuẩn hóa kết hợp cùng minigame tương tác do Giảng viên phát triển.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/student/classes"
            className="px-4 py-2.5 rounded-xl bg-[#151b2c] hover:bg-[#1f273d] text-cyan-300 border border-[#7bd1fa]/20 font-semibold text-xs md:text-sm transition-all flex items-center gap-2"
          >
            <GraduationCap className="w-4 h-4 text-cyan-400" /> Xem Lớp Đã Đăng Ký
          </Link>
        </div>
      </header>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e9bb4]" />
        <input
          type="text"
          placeholder="Tìm theo tên lộ trình, giảng viên, môn học..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#151b2c] border border-[#7bd1fa]/20 rounded-xl pl-9 pr-4 py-2.5 text-xs md:text-sm text-white placeholder-[#8e9bb4] focus:outline-none focus:border-cyan-400 transition-all"
        />
      </div>

      {/* Learning Path Grid */}
      {filteredPaths.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0f1524]/60 border border-[#7bd1fa]/10 space-y-3">
          <BookOpen className="w-12 h-12 text-cyan-400/40 mx-auto" />
          <h3 className="text-lg font-bold text-white">Không tìm thấy Lộ Trình Học Tập phù hợp</h3>
          <p className="text-xs text-[#8e9bb4]">
            {search ? "Vui lòng thử tìm với từ khóa khác." : "Bạn đã đăng ký toàn bộ các lộ trình hiện có!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPaths.map((path) => (
            <div
              key={path.id}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#7bd1fa]/15 bg-[#0f1524]/70 p-6 backdrop-blur-xl transition-all hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 text-xs font-bold">
                    {path.category}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                      DIFFICULTY_COLOR[path.difficulty] || "text-slate-300 bg-slate-500/10 border-slate-500/20"
                    }`}
                  >
                    {path.difficulty}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {path.title}
                  </h3>
                  <p className="line-clamp-2 text-xs text-[#8e9bb4] mt-1.5 leading-relaxed">
                    {path.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#7bd1fa]/10 text-xs text-[#8e9bb4]">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Giảng viên: <strong className="text-slate-200">{path.teacherName}</strong></span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> {path.courses.length} Khóa học
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" /> ~{path.estimated_hours} Giờ học
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href={`/dashboard/student/LearningPath/${path.id}`}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-cyan-300 text-white font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2"
              >
                Khám Phá & Đăng Ký <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

