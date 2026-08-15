"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  ArrowRight,
  GraduationCap,
  Loader2,
  User,
  CheckCircle2,
  FileText,
  Users,
  Search,
  Plus,
} from "lucide-react";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";

interface StudentLearningPath {
  id: string;
  learning_path_id: string;
  progress: number;
  status: string;
}

interface ClassItem {
  id: string;
  title: string;
  description: string;
  instructor: string;
  coursesCount: number;
  progress: number;
  difficulty: string;
  category: string;
}

export default function StudentClassPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          setClasses([]);
          setLoading(false);
          return;
        }

        // 1. Lấy enrollment của student
        const enrollmentQuery = query(
          collection(db, "student_learning_path"),
          where("student_id", "==", user.uid)
        );
        const enrollmentSnapshot = await getDocs(enrollmentQuery);

        const enrollments: StudentLearningPath[] = enrollmentSnapshot.docs
          .map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              learning_path_id: data.learning_path_id || "",
              progress: Number(data.progress) || 0,
              status: data.status || "active",
            };
          })
          .filter((item) => item.status === "active" && item.learning_path_id);

        // 2. Lấy Learning Path
        const classList: ClassItem[] = [];

        for (const enrollment of enrollments) {
          const pathQuery = query(
            collection(db, "learning_path"),
            where("__name__", "==", enrollment.learning_path_id)
          );
          const pathSnapshot = await getDocs(pathQuery);

          if (pathSnapshot.empty) continue;

          const pathDoc = pathSnapshot.docs[0];
          const pathData = pathDoc.data();

          // 3. Lấy teacher
          let teacherName = "Unknown Teacher";
          if (pathData.author_id) {
            const teacherQuery = query(
              collection(db, "users"),
              where("id", "==", pathData.author_id)
            );
            const teacherSnapshot = await getDocs(teacherQuery);
            if (!teacherSnapshot.empty) {
              const teacherData = teacherSnapshot.docs[0].data();
              teacherName =
                teacherData.name ||
                teacherData.displayName ||
                "Unknown Teacher";
            }
          }

          classList.push({
            id: pathDoc.id,
            title: pathData.title || "Untitled Learning Path",
            description: pathData.description || "",
            instructor: teacherName,
            coursesCount: Array.isArray(pathData.courses)
              ? pathData.courses.length
              : 0,
            progress: Math.min(enrollment.progress, 100),
            difficulty: pathData.difficulty || "Beginner",
            category: pathData.category || "General",
          });
        }

        setClasses(classList);
      } catch (error) {
        console.error("Error loading classes:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const filteredClasses = classes.filter((cls) => {
    const kw = search.toLowerCase().trim();
    if (!kw) return true;
    return (
      cls.title.toLowerCase().includes(kw) ||
      cls.instructor.toLowerCase().includes(kw) ||
      cls.category.toLowerCase().includes(kw)
    );
  });

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 rounded-full border-4 border-zinc-200 border-t-red-600 animate-spin" />
        <p className="text-red-600 font-medium text-sm">Đang tải danh sách lớp học...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* ── HEADER ── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 mb-1.5">
            <GraduationCap className="w-4 h-4" /> Danh Sách Lớp Học Của Tôi
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
            Lớp Học Đang Theo Học 
          </h1>
          <p className="text-xs md:text-sm text-zinc-600 mt-1">
            Không gian học tập tương tác, theo dõi lộ trình và hoàn thành các bài học.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <Link
            href="/student/classes/assignments"
            className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 font-bold text-xs md:text-sm transition-colors flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-red-600" /> Bài Tập
          </Link>
          <Link
            href="/student/classes/members"
            className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 font-bold text-xs md:text-sm transition-colors flex items-center gap-2"
          >
            <Users className="w-4 h-4 text-red-600" /> Bạn Cùng Lớp
          </Link>
          <Link
            href="/student/learning-paths"
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs md:text-sm shadow-md transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Đăng Ký Thêm
          </Link>
        </div>
      </header>

      {/* ── SEARCH & STATS ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-bold text-zinc-700">
          <span>Tổng số:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 font-extrabold border border-red-200">
            {classes.length} Lớp
          </span>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm theo tên lớp, giảng viên..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs md:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition"
          />
        </div>
      </div>

      {/* ── CLASS LIST ── */}
      {filteredClasses.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-zinc-200 bg-white p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-lg font-bold text-zinc-900">
            {search ? "Không tìm thấy lớp học phù hợp" : "Bạn chưa đăng ký lớp học nào"}
          </h2>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            {search
              ? "Hãy thử tìm kiếm với từ khóa khác."
              : "Khám phá danh sách các Lộ trình học tập để bắt đầu tham gia các khóa học tương tác."}
          </p>
          <Link
            href="/student/learning-paths"
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition"
          >
            Khám Phá Lộ Trình <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((cls) => (
            <div
              key={cls.id}
              className="group flex flex-col justify-between rounded-2xl bg-white border border-zinc-200 p-6 shadow-sm hover:border-red-600 hover:shadow-md transition-all duration-200"
            >
              <div>
                {/* Badges */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                    {cls.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 text-[11px] font-medium">
                    {cls.difficulty}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-4 text-base font-extrabold text-zinc-900 group-hover:text-red-600 transition">
                  {cls.title}
                </h3>

                {/* Description */}
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-500">
                  {cls.description || "Chưa có mô tả chi tiết."}
                </p>

                {/* Instructor & Courses Count */}
                <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-600">
                  <div className="flex items-center gap-1.5 font-medium">
                    <User className="w-3.5 h-3.5 text-red-600" />
                    <span>{cls.instructor}</span>
                  </div>

                  <div className="flex items-center gap-1 font-bold text-zinc-800">
                    <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{cls.coursesCount} bài học</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 bg-zinc-50 rounded-xl p-3 border border-zinc-100">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-semibold text-zinc-600">Tiến độ hoàn thành</span>
                    <span className="font-black text-red-600">{cls.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-600 rounded-full transition-all duration-500"
                      style={{ width: `${cls.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-5 pt-4 border-t border-zinc-100">
                <Link
                  href={`/student/classes/${cls.id}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition"
                >
                  {cls.progress >= 100 ? "Xem Lại Lớp Học" : "Tiếp Tục Học Tập"}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
