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
  Beginner: "text-emerald-700 bg-emerald-50 border-emerald-200",
  Intermediate: "text-amber-700 bg-amber-50 border-amber-200",
  Advanced: "text-red-700 bg-red-50 border-red-200",
};

export default function StudentLearningPathPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          const pathQuery = query(
            collection(db, "learning_path"),
            where("is_accepted", "==", true)
          );
          const pathSnapshot = await getDocs(pathQuery);
          await loadTeachersAndSet(pathSnapshot.docs);
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
        } catch {
          // ignore
        }

        // 3. Filter unenrolled or all
        const availablePaths = pathSnapshot.docs.filter(
          (d) => !enrolledPathIds.has(d.id)
        );

        await loadTeachersAndSet(availablePaths.length > 0 ? availablePaths : pathSnapshot.docs);
      } catch (err) {
        console.error("Error loading learning paths:", err);
        toast.error("Không thể tải danh sách Learning Path.", "Lỗi");
      } finally {
        setLoading(false);
      }
    });

    async function loadTeachersAndSet(docsList: any[]) {
      const paths: LearningPath[] = await Promise.all(
        docsList.map(async (docSnap) => {
          const data = docSnap.data();
          let teacherName = "Unknown Teacher";

          if (data.author_id) {
            try {
              const tq = query(
                collection(db, "users"),
                where("id", "==", data.author_id)
              );
              const ts = await getDocs(tq);
              if (!ts.empty) {
                const td = ts.docs[0].data();
                teacherName = td.name || td.displayName || "Unknown Teacher";
              }
            } catch {
              // ignore
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
    }

    return () => unsubscribe();
  }, []);

  const filteredPaths = learningPaths.filter((path) => {
    const kw = search.toLowerCase().trim();
    const matchesSearch =
      !kw ||
      path.title.toLowerCase().includes(kw) ||
      path.description.toLowerCase().includes(kw) ||
      path.category.toLowerCase().includes(kw) ||
      path.teacherName.toLowerCase().includes(kw);

    const matchesDiff =
      difficultyFilter === "all" ||
      path.difficulty.toLowerCase() === difficultyFilter.toLowerCase();

    return matchesSearch && matchesDiff;
  });

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 font-sans">
        <div className="w-10 h-10 rounded-full border-4 border-zinc-200 border-t-red-600 animate-spin" />
        <p className="text-red-600 font-medium text-sm">Đang tải lộ trình học tập...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* ── HEADER ── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 mb-1.5">
            <Compass className="w-4 h-4" /> Hệ Thống Lộ Trình Toàn Diện
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
            Khám Phá Lộ Trình Học Tập 
          </h1>
          <p className="text-xs md:text-sm text-zinc-600 mt-1">
            Chọn lộ trình phù hợp với định hướng để rèn luyện kỹ năng và mở khóa các thử thách.
          </p>
        </div>
      </header>

      {/* ── FILTER & SEARCH STRIP ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Difficulty Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-xl border border-zinc-200 self-start md:self-auto">
          {["all", "Beginner", "Intermediate", "Advanced"].map((tab) => (
            <button
              key={tab}
              onClick={() => setDifficultyFilter(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                difficultyFilter === tab
                  ? "bg-red-600 text-white shadow-sm"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              {tab === "all" ? "Tất cả độ khó" : tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên lộ trình, môn học..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs md:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition"
          />
        </div>
      </div>

      {/* ── LEARNING PATH GRID ── */}
      {filteredPaths.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-zinc-200 bg-white p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-lg font-bold text-zinc-900">
            {search ? "Không tìm thấy kết quả phù hợp" : "Chưa có lộ trình học tập mới"}
          </h2>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            {search ? "Thử tìm kiếm với từ khóa khác." : "Bạn đã tham gia hoặc hoàn thành các lộ trình hiện có."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPaths.map((path) => (
            <div
              key={path.id}
              onClick={() => router.push(`/student/learning-paths/${path.id}`)}
              className="group flex flex-col justify-between rounded-2xl bg-white border border-zinc-200 overflow-hidden shadow-sm hover:border-red-600 hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              {/* Thumbnail */}
              {path.thumbnail ? (
                <div className="h-44 w-full overflow-hidden bg-zinc-100 relative">
                  <img
                    src={path.thumbnail}
                    alt={path.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-lg border text-xs font-bold shadow-sm ${DIFFICULTY_COLOR[path.difficulty] || "bg-white text-zinc-700 border-zinc-200"}`}>
                      {path.difficulty}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="h-44 w-full bg-gradient-to-br from-red-600 to-rose-700 p-6 flex flex-col justify-between text-white relative">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg border text-xs font-bold shadow-sm ${DIFFICULTY_COLOR[path.difficulty] || "bg-white text-zinc-700 border-zinc-200"}`}>
                      {path.difficulty}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/20">
                      {path.category}
                    </span>
                  </div>
                </div>
              )}

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-zinc-900 group-hover:text-red-600 transition line-clamp-2">
                    {path.title}
                  </h2>

                  <p className="mt-2 text-xs leading-relaxed text-zinc-500 line-clamp-2">
                    {path.description || "Chưa có mô tả chi tiết."}
                  </p>

                  <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-600">
                    <span className="flex items-center gap-1.5 font-medium">
                      <User className="w-3.5 h-3.5 text-red-600" />
                      {path.teacherName}
                    </span>

                    <span className="flex items-center gap-1 font-bold text-zinc-800">
                      <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                      {path.courses.length} Bài
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-zinc-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/student/learning-paths/${path.id}`);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-zinc-100 group-hover:bg-red-600 text-zinc-800 group-hover:text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    Xem Chi Tiết Lộ Trình
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
