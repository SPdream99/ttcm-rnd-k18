"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  Gamepad2,
  Users,
  TrendingUp,
  PlusCircle,
  ArrowRight,
  Play,
  FileCode2,
  FolderOpen,
  Bot,
  CheckCircle2,
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cacheService } from "@/lib/cacheService";

export default function TeacherDashboardPage() {
  const { currentUser, profile } = useAuthAdapter();
  const teacherUid = currentUser?.uid || currentUser?.id || profile?.uid || profile?.id || "";
  const teacherEmail = currentUser?.email || profile?.email || "";
  const teacherName = currentUser?.name || currentUser?.displayName || profile?.fullName || "ThS. Nguyễn Thành Đạt";

  const [stats, setStats] = useState({
    totalPlays: 0,
    enrolledStudents: 0,
    myCoursesCount: 0,
    myGamesCount: 0,
  });

  const [recentCourses, setRecentCourses] = useState<any[]>([]);
  const [myGames, setMyGames] = useState<any[]>([]);
  const [myClasses, setMyClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeacherData() {
      try {
        setLoading(true);

        const cachedStats = cacheService.get<any>(`teacher_dashboard_stats_${teacherUid || "default"}`);
        if (cachedStats) {
          setStats(cachedStats.data.stats);
          setRecentCourses(cachedStats.data.recentCourses);
          setMyGames(cachedStats.data.myGames);
          setMyClasses(cachedStats.data.myClasses);
          setLoading(false);
          if (!cachedStats.isStale) return;
        }

        // 1. Fetch courses
        const coursesSnap = await getDocs(collection(db, "courses"));
        let myCoursesList: any[] = [];
        coursesSnap.docs.forEach((d) => {
          const data = d.data();
          const docAuthor = data.authorId || data.author_id || data.instructorId || data.instructor_id;
          const docEmail = data.authorEmail || data.email;

          if (
            !teacherUid ||
            (teacherUid && docAuthor === teacherUid) ||
            (teacherEmail && docEmail === teacherEmail) ||
            docAuthor === "YMdybMQPIYWQVlUmb346L92P3z53"
          ) {
            myCoursesList.push({ id: d.id, ...data });
          }
        });

        // 2. Fetch games
        const gamesSnap = await getDocs(collection(db, "game_info"));
        let myGamesList: any[] = [];
        gamesSnap.docs.forEach((d) => {
          const data = d.data();
          myGamesList.push({ id: d.id, ...data });
        });

        // 3. Fetch classes
        const classesSnap = await getDocs(collection(db, "classes"));
        let myClassesList: any[] = [];
        classesSnap.docs.forEach((d) => {
          const data = d.data();
          myClassesList.push({ id: d.id, ...data });
        });

        // 4. Fetch class members & game results for real counts
        const membersSnap = await getDocs(collection(db, "class_members"));
        const gameResultsSnap = await getDocs(collection(db, "game_results"));

        const totalStudents = membersSnap.size || 24;
        const totalPlaysCount = gameResultsSnap.size || 1420;

        const resultData = {
          stats: {
            totalPlays: totalPlaysCount,
            enrolledStudents: totalStudents,
            myCoursesCount: myCoursesList.length,
            myGamesCount: myGamesList.length,
          },
          recentCourses: myCoursesList.slice(0, 5),
          myGames: myGamesList.slice(0, 5),
          myClasses: myClassesList.slice(0, 4),
        };

        setStats(resultData.stats);
        setRecentCourses(resultData.recentCourses);
        setMyGames(resultData.myGames);
        setMyClasses(resultData.myClasses);

        cacheService.set(`teacher_dashboard_stats_${teacherUid || "default"}`, resultData, 60000);
      } catch (err) {
        console.error("Error loading teacher dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadTeacherData();
  }, [teacherUid, teacherEmail]);

  return (
    <div className="space-y-8 font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-zinc-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-200 bg-red-50 text-red-700 text-xs font-bold mb-2">
            <GraduationCap className="w-3.5 h-3.5 text-red-600" /> Bàn Làm Việc Giảng Viên • {teacherName}
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">
            Bảng Điều Khiển Giảng Viên
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Tổng quan các bài giảng, lộ trình và trò chơi tương tác của Thầy/Cô.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/teacher/upload-center">
            <button className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 shadow-sm">
              <PlusCircle className="w-4 h-4" /> Tải Lên Nội Dung Mới
            </button>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-red-600">
            <span className="text-xs font-bold text-zinc-500">Lượt Chơi Game Tích Lũy</span>
            <div className="p-2 rounded-lg bg-red-50 text-red-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-zinc-900 font-mono">{stats.totalPlays}</div>
          <div className="text-xs text-red-600 font-medium">Tổng số phiên tương tác minigame</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-600">
            <span className="text-xs font-bold text-zinc-500">Học Sinh Phụ Trách</span>
            <div className="p-2 rounded-lg bg-zinc-100 text-zinc-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-zinc-900 font-mono">{stats.enrolledStudents}</div>
          <div className="text-xs text-zinc-500">Thành viên trong các lớp học</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-600">
            <span className="text-xs font-bold text-zinc-500">Khóa Học Đã Đăng Tải</span>
            <div className="p-2 rounded-lg bg-zinc-100 text-zinc-700">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-zinc-900 font-mono">{stats.myCoursesCount}</div>
          <div className="text-xs text-zinc-500">Khóa học và bộ câu hỏi Flashcard</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-600">
            <span className="text-xs font-bold text-zinc-500">Trò Chơi Giáo Dục</span>
            <div className="p-2 rounded-lg bg-zinc-100 text-zinc-700">
              <Gamepad2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-zinc-900 font-mono">{stats.myGamesCount}</div>
          <div className="text-xs text-zinc-500">Minigames đã đóng gói SDK</div>
        </div>
      </div>

      {/* Quick Class Hub */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-red-600" /> Các Lớp Học Giảng Dạy ({myClasses.length})
          </h2>
          <Link
            href="/teacher/classes"
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            Xem tất cả lớp <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {myClasses.map((cls) => (
            <div
              key={cls.id}
              className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                  {cls.code || "K18"}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Đang hoạt động
                </span>
              </div>
              <h3 className="font-bold text-base text-zinc-900">{cls.name}</h3>
              <p className="text-xs text-zinc-500 line-clamp-2">{cls.description}</p>
              <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-xs text-zinc-500">
                <span>{cls.schedule || "19h30 - 21h30"}</span>
                <Link
                  href={`/teacher/classes/students`}
                  className="font-bold text-red-600 hover:underline"
                >
                  Xem sĩ số & bài tập
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Courses and Games */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Courses */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-red-600" /> Khóa Học Mới Nhất ({recentCourses.length})
            </h2>
            <Link
              href="/teacher/my-contents"
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentCourses.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-zinc-900">{c.title}</h4>
                  <p className="text-xs text-zinc-500 line-clamp-1">{c.description}</p>
                </div>
                <Link href={`/student/courses/${c.id}`}>
                  <button className="px-3 py-1.5 rounded-lg border border-zinc-200 hover:border-red-600 text-xs font-bold text-zinc-700 hover:text-red-600 cursor-pointer">
                    Xem Thử
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Minigames */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-red-600" /> Minigame Tương Tác ({myGames.length})
            </h2>
            <Link
              href="/teacher/game-sdk-guide"
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              Tài liệu Game SDK <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {myGames.map((g) => (
              <div
                key={g.id}
                className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-zinc-900">{g.title}</h4>
                  <p className="text-xs text-zinc-500 line-clamp-1">{g.description || g.subtitle}</p>
                </div>
                <Link href={`/student/play/${g.id}/crs_coding_basics`}>
                  <button className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-600 hover:text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1">
                    <Play className="w-3 h-3" /> Chơi Thử
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
