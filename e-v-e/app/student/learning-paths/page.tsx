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
  Compass,
} from "lucide-react";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";

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

export default function StudentLearningPathPage() {
  const router = useRouter();
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          const pathQuery = query(collection(db, "learning_path"));
          const pathSnapshot = await getDocs(pathQuery);
          const availablePaths = pathSnapshot.docs;
          await loadTeachersAndSetPaths(availablePaths);
          setLoading(false);
          return;
        }

        const pathQuery = query(collection(db, "learning_path"));
        const pathSnapshot = await getDocs(pathQuery);

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

  const loadTeachersAndSetPaths = async (docs: any[]) => {
    const pathsData: LearningPath[] = [];

    for (const docItem of docs) {
      const data = docItem.data();
      let teacherName = data.authorName || data.teacherName || "Giáo Viên E-V-E";

      if (data.author_id) {
        try {
          const teacherDoc = await getDoc(doc(db, "teachers", data.author_id));
          if (teacherDoc.exists()) {
            teacherName = teacherDoc.data()?.name || teacherDoc.data()?.fullName || teacherName;
          }
        } catch {}
      }

      pathsData.push({
        id: docItem.id,
        title: data.title || "Lộ trình học tập",
        description: data.description || "",
        author_id: data.author_id || "",
        courses: Array.isArray(data.courses) ? data.courses : [],
        is_accepted: data.is_accepted ?? true,
        thumbnail: data.thumbnail,
        difficulty: data.difficulty || "Intermediate",
        category: data.category || "Công nghệ & Lập trình",
        teacherName,
        estimated_hours: Number(data.estimated_hours) || 6,
      });
    }

    setLearningPaths(pathsData);
  };

  const filteredPaths = learningPaths.filter((path) => {
    const q = search.toLowerCase();
    return (
      path.title.toLowerCase().includes(q) ||
      path.teacherName.toLowerCase().includes(q) ||
      path.category.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 rounded-full border-4 border-zinc-200 border-t-red-600 animate-spin" />
        <p className="text-red-600 font-medium text-sm">Đang tải danh mục Lộ Trình Học Tập...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 mb-1.5">
            <Compass className="w-4 h-4" /> Khám Phá Lộ Trình Học Tập
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
            Learning Paths Chuyên Sâu 🗺️
          </h1>
          <p className="text-xs md:text-sm text-zinc-600 mt-1">
            Các lộ trình bài học chuẩn hóa kết hợp cùng minigame tương tác do Giảng viên phát triển.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/student/classes"
            className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 font-bold text-xs md:text-sm transition-colors flex items-center gap-2"
          >
            <GraduationCap className="w-4 h-4 text-red-600" /> Xem Lớp Đã Đăng Ký
          </Link>
        </div>
      </header>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder="Tìm theo tên lộ trình, giảng viên, môn học..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border-2 border-zinc-200 rounded-xl pl-9 pr-4 py-2.5 text-xs md:text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-red-600 transition-colors"
        />
      </div>

      {/* Learning Path Grid */}
      {filteredPaths.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-zinc-200 space-y-3">
          <BookOpen className="w-12 h-12 text-zinc-300 mx-auto" />
          <h3 className="text-lg font-bold text-zinc-900">Không tìm thấy Lộ Trình Học Tập phù hợp</h3>
          <p className="text-xs text-zinc-500">
            {search ? "Vui lòng thử tìm với từ khóa khác." : "Bạn đã đăng ký toàn bộ các lộ trình hiện có!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPaths.map((path) => (
            <div
              key={path.id}
              className="group flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:border-red-600 transition-all space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-bold">
                    {path.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-zinc-100 text-zinc-700 border border-zinc-200">
                    {path.difficulty}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-zinc-900 group-hover:text-red-600 transition-colors">
                    {path.title}
                  </h3>
                  <p className="line-clamp-2 text-xs text-zinc-500 mt-1.5 leading-relaxed">
                    {path.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-zinc-100 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-red-600" />
                    <span>Giảng viên: <strong className="text-zinc-900">{path.teacherName}</strong></span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1 font-medium">
                      <BookOpen className="w-3.5 h-3.5 text-red-600" /> {path.courses.length} Khóa học
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-red-600" /> ~{path.estimated_hours} Giờ học
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href={`/student/learning-paths/${path.id}`}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
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
