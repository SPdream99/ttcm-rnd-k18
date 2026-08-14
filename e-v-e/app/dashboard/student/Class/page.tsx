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
  Users,
  Plus,
} from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useStudentAdapter } from "@/hooks/useStudentAdapter";

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
  const { courses: fallbackCourses } = useStudentAdapter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          setClasses([]);
          setLoading(false);
          return;
        }

        const studentPathQuery = query(
          collection(db, "student_learning_path"),
          where("student_id", "==", user.uid)
        );
        const studentPathSnapshot = await getDocs(studentPathQuery);

        if (studentPathSnapshot.empty) {
          setClasses([]);
          setLoading(false);
          return;
        }

        const studentPaths: StudentLearningPath[] = studentPathSnapshot.docs
          .map((d) => {
            const data = d.data();
            return {
              id: d.id,
              learning_path_id: data.learning_path_id,
              progress: Number(data.progress) || 0,
              status: data.status || "active",
            };
          })
          .filter((sp) => sp.status === "active" && sp.learning_path_id);

        if (studentPaths.length === 0) {
          setClasses([]);
          setLoading(false);
          return;
        }

        const pathIds = studentPaths.map((sp) => sp.learning_path_id);
        const pathQuery = query(collection(db, "learning_path"));
        const pathSnapshot = await getDocs(pathQuery);

        const teacherIds = new Set<string>();
        const matchedPathDocs = pathSnapshot.docs.filter((d) => pathIds.includes(d.id));

        matchedPathDocs.forEach((doc) => {
          const data = doc.data();
          if (data.author_id) teacherIds.add(data.author_id);
        });

        const teacherMap: Record<string, string> = {};
        if (teacherIds.size > 0) {
          const teacherSnapshot = await getDocs(collection(db, "teachers"));
          teacherSnapshot.docs.forEach((doc) => {
            if (teacherIds.has(doc.id)) {
              const data = doc.data();
              teacherMap[doc.id] = data.name || data.fullName || "Giảng viên E-V-E";
            }
          });
        }

        const progressMap: Record<string, number> = {};
        studentPaths.forEach((sp) => {
          progressMap[sp.learning_path_id] = sp.progress;
        });

        const result: ClassItem[] = matchedPathDocs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "Lớp Học",
            description: data.description || "",
            instructor: teacherMap[data.author_id] || "Giảng viên E-V-E",
            coursesCount: Array.isArray(data.courses) ? data.courses.length : 0,
            progress: progressMap[doc.id] || 0,
            difficulty: data.difficulty || "Beginner",
            category: data.category || "General",
          };
        });

        setClasses(result);
      } catch (err) {
        console.error("Error loading student classes:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const displayClasses = classes.length > 0 ? classes : fallbackCourses.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.currentChapter,
    instructor: c.instructor,
    coursesCount: 4,
    progress: c.progress,
    difficulty: "Intermediate",
    category: c.tag,
  }));

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0e1a] text-[#e1e2ec]">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
          <span className="text-cyan-400 font-medium">Đang tải danh sách lớp học...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] p-4 text-[#e1e2ec] font-sans md:p-8 space-y-8">
      {/* Header */}
      <header className="border-b border-[#7bd1fa]/10 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2 text-sm font-medium text-cyan-400">
            <GraduationCap className="h-4 w-4" /> Danh sách lớp học
          </div>
          <h1 className="text-2xl font-extrabold text-white md:text-3xl tracking-tight">
            Learning Paths & Lớp Học Đang Tham Gia 📚
          </h1>
          <p className="mt-1 text-sm text-[#8e9bb4]">
            Các Lộ trình học tập và khóa học trực tuyến bạn đã đăng ký kỳ này.
          </p>
        </div>

        <Link
          href="/dashboard/student/LearningPath"
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-medium text-sm shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Khám Phá Thêm Lộ Trình
        </Link>
      </header>

      {/* Grid of Classes */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayClasses.map((cls) => (
          <div
            key={cls.id}
            className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#7bd1fa]/15 bg-[#0f1524]/60 p-5 backdrop-blur-md transition-all hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.08)]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded-md border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
                  {cls.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-[#8e9bb4]">
                  <BookOpen className="h-3.5 w-3.5" />
                  {cls.coursesCount} Khóa học
                </span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                {cls.title}
              </h3>

              <div className="flex items-center gap-2 text-xs text-[#8e9bb4]">
                <User className="h-3.5 w-3.5 text-cyan-400" />
                <span>Giảng viên: <strong className="text-slate-200">{cls.instructor}</strong></span>
              </div>

              <p className="line-clamp-2 text-xs text-[#8e9bb4] leading-relaxed">
                {cls.description}
              </p>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#8e9bb4]">Tiến độ học</span>
                  <span className="font-bold text-cyan-400 font-mono">{cls.progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#0a0e1a]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 transition-all duration-500"
                    style={{ width: `${cls.progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 border-t border-[#7bd1fa]/10 pt-3 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-xs text-[#8e9bb4]">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                {cls.progress === 100 ? "Đã hoàn thành" : "Đang học"}
              </span>

              <Link
                href={`/dashboard/student/Class/${cls.id}`}
                className="flex items-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
              >
                Vào Học <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
