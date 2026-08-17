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
  FolderOpen,
  FileText,
  Sparkles,
  Layers,
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cacheService } from "@/lib/cacheService";
import { formatDisplayDate } from "@/lib/dateUtils";

function sanitizeCourse(c: any) {
  return {
    id: String(c.id || ""),
    title: String(c.title || "Khóa học"),
    description: String(c.description || c.subtitle || ""),
    pairsCount: Number(c.pairsCount || 0),
    authorId: String(c.authorId || ""),
    visibility: String(c.visibility || "public"),
    createdAt: formatDisplayDate(c.createdAt, "2026-08-10"),
  };
}

function sanitizeClass(cls: any) {
  return {
    id: String(cls.id || ""),
    name: String(cls.name || "Lớp học"),
    code: String(cls.code || "K18"),
    subject: String(cls.subject || "Lập trình"),
    schedule: typeof cls.schedule === "string" ? cls.schedule : "19h30 - 21h30",
    total_students: Number(cls.total_students || cls.totalStudents || 0),
    description: String(cls.description || "Lớp học do giảng viên trực tiếp phụ trách."),
  };
}

function sanitizeGame(g: any) {
  return {
    id: String(g.id || ""),
    gameId: String(g.gameId || g.id || ""),
    title: String(g.title || "Game học tập"),
    description: String(g.description || g.subtitle || "Trò chơi tương tác"),
    genre: String(g.genre || "3D Interactive"),
    playsCount: Number(g.playsCount || 0),
  };
}

export default function TeacherDashboardPage() {
  const { currentUser, profile } = useAuthAdapter();
  const teacherUid = currentUser?.uid || currentUser?.id || profile?.uid || profile?.id || "";
  const teacherEmail = currentUser?.email || profile?.email || "";
  const teacherName =
    currentUser?.name ||
    (currentUser as any)?.fullName ||
    profile?.fullName ||
    "Thầy/Cô";

  const [stats, setStats] = useState({
    totalPlays: 0,
    enrolledStudents: 0,
    myCoursesCount: 0,
    myGamesCount: 0,
    myClassesCount: 0,
    myAssignmentsCount: 0,
  });

  const [recentCourses, setRecentCourses] = useState<any[]>([]);
  const [myGames, setMyGames] = useState<any[]>([]);
  const [myClasses, setMyClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeacherData() {
      try {
        setLoading(true);

        const cacheKey = `teacher_dashboard_exact_v2_${teacherUid || teacherEmail || "me"}`;
        const cached = cacheService.get<any>(cacheKey);
        if (cached && cached.data) {
          setStats(cached.data.stats || { totalPlays: 0, enrolledStudents: 0, myCoursesCount: 0, myGamesCount: 0, myClassesCount: 0, myAssignmentsCount: 0 });
          setRecentCourses((cached.data.recentCourses || []).map(sanitizeCourse));
          setMyGames((cached.data.myGames || []).map(sanitizeGame));
          setMyClasses((cached.data.myClasses || []).map(sanitizeClass));
          setLoading(false);
          if (!cached.isStale) return;
        }

        // ── 1. Fetch & Filter Teacher's Courses ──
        const coursesSnap = await getDocs(collection(db, "courses"));
        let myCoursesList: any[] = [];
        coursesSnap.docs.forEach((d) => {
          const data = d.data();
          const docAuthorId = data.authorId || data.author_id || data.instructorId || data.instructor_id;
          const docEmail = data.authorEmail || data.email;
          const docAuthorName = data.author_name || data.authorName || data.author || data.instructor;

          const isMatch =
            (teacherUid && docAuthorId === teacherUid) ||
            (teacherEmail && docEmail && docEmail.toLowerCase() === teacherEmail.toLowerCase()) ||
            (teacherName && docAuthorName && docAuthorName.toLowerCase() === teacherName.toLowerCase());

          if (isMatch) {
            const pairs = Array.isArray(data.contentData)
              ? data.contentData
              : data.pairs || data.contentData?.pairs || data.content_data?.pairs || [];

            myCoursesList.push(
              sanitizeCourse({
                id: d.id,
                title: data.title,
                description: data.description || data.subtitle,
                pairsCount: pairs.length,
                authorId: docAuthorId,
                visibility: data.visibility || "public",
                createdAt: data.createdAt || data.created_at,
              })
            );
          }
        });

        // Merge local uploaded courses
        try {
          if (typeof window !== "undefined") {
            const localCourses = JSON.parse(localStorage.getItem("eve_uploaded_courses") || "[]");
            localCourses.forEach((lc: any) => {
              const lcAuthor = lc.authorId || lc.author_id || lc.instructorId || lc.instructor_id;
              if (!lcAuthor || lcAuthor === teacherUid) {
                const existingIdx = myCoursesList.findIndex((c) => c.id === lc.id);
                const formatted = sanitizeCourse({
                  id: lc.id,
                  title: lc.title || "Khóa học mới tạo",
                  description: lc.description || "",
                  pairsCount: (lc.pairs || lc.contentData?.pairs || []).length,
                  authorId: lcAuthor || teacherUid,
                  visibility: lc.visibility || "public",
                  createdAt: lc.createdAt || lc.created_at || "Vừa tạo",
                });
                if (existingIdx === -1) {
                  myCoursesList.unshift(formatted);
                } else {
                  myCoursesList[existingIdx] = { ...myCoursesList[existingIdx], ...formatted };
                }
              }
            });
          }
        } catch {}

        const myCourseIds = new Set(myCoursesList.map((c) => c.id));

        // ── 2. Fetch & Filter Teacher's Classes ──
        const classesSnap = await getDocs(collection(db, "classes"));
        let myClassesList: any[] = [];
        classesSnap.docs.forEach((d) => {
          const data = d.data();
          const docTeacherId = data.teacher_id || data.teacherId || data.instructorId || data.authorId;
          const docTeacherEmail = data.teacher_email || data.teacherEmail;
          const docTeacherName = data.teacher_name || data.teacherName || data.instructor;

          const isMatch =
            (teacherUid && docTeacherId === teacherUid) ||
            (teacherEmail && docTeacherEmail && docTeacherEmail.toLowerCase() === teacherEmail.toLowerCase()) ||
            (teacherName && docTeacherName && docTeacherName.toLowerCase() === teacherName.toLowerCase());

          if (isMatch) {
            myClassesList.push(
              sanitizeClass({
                id: d.id,
                name: data.name,
                code: data.code,
                subject: data.subject,
                schedule: data.schedule,
                total_students: data.total_students || data.totalStudents,
                description: data.description,
              })
            );
          }
        });

        const myClassIds = new Set(myClassesList.map((c) => c.id));

        // ── 3. Fetch & Filter Enrolled Students (Đếm thực tế từ class_members) ──
        const membersSnap = await getDocs(collection(db, "class_members"));
        const uniqueStudentKeys = new Set<string>();
        const classStudentCountMap: Record<string, number> = {};

        membersSnap.docs.forEach((d) => {
          const mData = d.data();
          const classId = mData.class_id || mData.classId;
          if (myClassIds.has(classId) && mData.role !== "Teacher") {
            const studentKey = mData.student_id || mData.studentId || mData.student_email || mData.studentEmail || d.id;
            if (studentKey) uniqueStudentKeys.add(String(studentKey));
            classStudentCountMap[classId] = (classStudentCountMap[classId] || 0) + 1;
          }
        });

        // Gán sĩ số thực tế từ DB vào từng lớp
        myClassesList.forEach((c) => {
          c.total_students = classStudentCountMap[c.id] || 0;
        });

        const enrolledStudentsCount = uniqueStudentKeys.size;

        // ── 4. Fetch & Filter Teacher's Games ──
        const gamesSnap = await getDocs(collection(db, "game_info"));
        let myGamesList: any[] = [];
        gamesSnap.docs.forEach((d) => {
          const data = d.data();
          const docAuthorId = data.authorId || data.author_id || data.uploaderId || data.uploader_id;
          const docEmail = data.authorEmail || data.uploaderEmail;
          const docAuthorName = data.author || data.author_name || data.authorName;

          const isMatch =
            (teacherUid && docAuthorId === teacherUid) ||
            (teacherEmail && docEmail && docEmail.toLowerCase() === teacherEmail.toLowerCase()) ||
            (teacherName && docAuthorName && docAuthorName.toLowerCase() === teacherName.toLowerCase());

          if (isMatch) {
            myGamesList.push(
              sanitizeGame({
                id: d.id,
                gameId: data.gameId || d.id,
                title: data.title,
                description: data.description || data.subtitle,
                genre: data.genre,
                playsCount: data.playsCount || data.plays_count || data.playCount,
              })
            );
          }
        });

        // Merge local uploaded games
        try {
          if (typeof window !== "undefined") {
            const localGames = JSON.parse(localStorage.getItem("eve_uploaded_games") || "[]");
            localGames.forEach((lg: any) => {
              const lgAuthor = lg.authorId || lg.author_id || lg.uploaderId || lg.uploader_id;
              if (!lgAuthor || lgAuthor === teacherUid) {
                const existingIdx = myGamesList.findIndex((g) => g.id === lg.id || g.title === lg.title);
                const formatted = sanitizeGame({
                  id: lg.id || lg.gameId,
                  gameId: lg.gameId || lg.id,
                  title: lg.title || "Game Tải Lên",
                  description: lg.description || "Trò chơi học tập tích hợp Game SDK.",
                  genre: lg.genre || "Custom SDK",
                  playsCount: lg.playsCount || lg.plays_count || 0,
                });
                if (existingIdx === -1) {
                  myGamesList.unshift(formatted);
                } else {
                  myGamesList[existingIdx] = { ...myGamesList[existingIdx], ...formatted };
                }
              }
            });
          }
        } catch {}

        const myGameIds = new Set(myGamesList.map((g) => g.id || g.gameId));

        // ── 5. Fetch & Filter Game Results (Plays specifically for this teacher's content) ──
        const gameResultsSnap = await getDocs(collection(db, "game_results"));
        let calculatedPlays = 0;

        gameResultsSnap.docs.forEach((d) => {
          const grData = d.data();
          const courseId = grData.course_id || grData.courseId;
          const gameId = grData.game_id || grData.gameId;
          const studentId = grData.student_id || grData.studentId || grData.user_id || grData.userId;

          if (
            (courseId && myCourseIds.has(courseId)) ||
            (gameId && myGameIds.has(gameId)) ||
            (studentId && uniqueStudentKeys.has(String(studentId)))
          ) {
            calculatedPlays += 1;
          }
        });

        myGamesList.forEach((g) => {
          const directPlays = Number(g.playsCount || 0);
          if (directPlays > calculatedPlays) {
            calculatedPlays = directPlays;
          }
        });

        // ── 6. Fetch Assignments Count ──
        const asmSnap = await getDocs(collection(db, "assignments"));
        let myAssignmentsCount = 0;
        asmSnap.docs.forEach((d) => {
          const aData = d.data();
          const docTeacherId = aData.teacher_id || aData.teacherId;
          const classId = aData.class_id || aData.classId;
          if ((teacherUid && docTeacherId === teacherUid) || (classId && myClassIds.has(classId))) {
            myAssignmentsCount += 1;
          }
        });

        const resultData = {
          stats: {
            totalPlays: calculatedPlays,
            enrolledStudents: enrolledStudentsCount,
            myCoursesCount: myCoursesList.length,
            myGamesCount: myGamesList.length,
            myClassesCount: myClassesList.length,
            myAssignmentsCount,
          },
          recentCourses: myCoursesList.slice(0, 5),
          myGames: myGamesList.slice(0, 5),
          myClasses: myClassesList.slice(0, 4),
        };

        setStats(resultData.stats);
        setRecentCourses(resultData.recentCourses);
        setMyGames(resultData.myGames);
        setMyClasses(resultData.myClasses);

        cacheService.set(cacheKey, resultData, 60000);
      } catch (err) {
        console.error("Error loading teacher dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadTeacherData();
  }, [teacherUid, teacherEmail, teacherName]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 font-sans">
        <div className="w-12 h-12 rounded-full border-4 border-red-200 border-t-red-600 animate-spin" />
        <p className="text-red-600 font-bold text-sm">Đang tải dữ liệu giảng viên từ hệ thống...</p>
      </div>
    );
  }

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
            Số liệu thống kê thực tế về các lớp học, học viên, khóa học và trò chơi tương tác do Thầy/Cô phụ trách.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link href="/teacher/upload-center">
            <button className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 shadow-sm">
              <PlusCircle className="w-4 h-4" /> Soạn Bài & Tạo Học Liệu
            </button>
          </Link>
          <Link href="/teacher/my-contents">
            <button className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 border border-zinc-300">
              <FolderOpen className="w-4 h-4" /> Quản Lý Đã Tạo ({stats.myCoursesCount})
            </button>
          </Link>
        </div>
      </div>

      {/* Metric Cards - Dynamic Real Counts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-2 hover:border-red-300 transition-colors">
          <div className="flex items-center justify-between text-red-600">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Lượt Chơi Học Liệu</span>
            <div className="p-2 rounded-lg bg-red-50 text-red-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-zinc-900 font-mono">
            {loading ? "..." : stats.totalPlays}
          </div>
          <div className="text-xs text-red-600 font-medium">Phiên minigame gắn với bài của Thầy/Cô</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-2 hover:border-red-300 transition-colors">
          <div className="flex items-center justify-between text-zinc-600">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Học Sinh Phụ Trách</span>
            <div className="p-2 rounded-lg bg-zinc-100 text-zinc-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-zinc-900 font-mono">
            {loading ? "..." : stats.enrolledStudents}
          </div>
          <div className="text-xs text-zinc-500">Học viên trong các lớp giảng dạy</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-2 hover:border-red-300 transition-colors">
          <div className="flex items-center justify-between text-zinc-600">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Khóa Học & Học Liệu</span>
            <div className="p-2 rounded-lg bg-zinc-100 text-zinc-700">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-zinc-900 font-mono">
            {loading ? "..." : stats.myCoursesCount}
          </div>
          <div className="text-xs text-zinc-500">Bài học & bộ cặp câu hỏi Flashcard</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-2 hover:border-red-300 transition-colors">
          <div className="flex items-center justify-between text-zinc-600">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Trò Chơi Giáo Dục</span>
            <div className="p-2 rounded-lg bg-zinc-100 text-zinc-700">
              <Gamepad2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-zinc-900 font-mono">
            {loading ? "..." : stats.myGamesCount}
          </div>
          <div className="text-xs text-zinc-500">Minigames đã xuất bản / tích hợp SDK</div>
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
            Quản lý lớp học <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {myClasses.length === 0 && !loading ? (
          <div className="p-8 rounded-2xl bg-white border-2 border-dashed border-zinc-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <FolderOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-zinc-900">Thầy/Cô chưa có lớp học nào được phân công</h3>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              Hãy tạo lớp học mới hoặc liên hệ Ban quản trị để phân công danh sách học sinh vào lớp giảng dạy của Thầy/Cô.
            </p>
            <Link href="/teacher/classes">
              <button className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 cursor-pointer">
                Tạo Lớp Đầu Tiên
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {myClasses.map((cls) => (
              <div
                key={cls.id}
                className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                    {cls.code || "K18"}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Đang hoạt động • {cls.total_students || 0} Học viên
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
                    Xem sĩ số & sổ điểm →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Courses and Games */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Courses */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-red-600" /> Khóa Học Của Thầy/Cô ({stats.myCoursesCount})
            </h2>
            <Link
              href="/teacher/my-contents"
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentCourses.length === 0 && !loading ? (
            <div className="p-6 rounded-2xl bg-white border border-zinc-200 text-center space-y-2">
              <p className="text-xs text-zinc-500">Thầy/Cô chưa đăng tải khóa học nào.</p>
              <Link href="/teacher/upload-center">
                <button className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 cursor-pointer">
                  Soạn Khóa Học Ngay
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentCourses.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center justify-between gap-4 hover:border-zinc-300 transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <h4 className="font-bold text-sm text-zinc-900 truncate">{c.title}</h4>
                    <p className="text-xs text-zinc-500 line-clamp-1">{c.description}</p>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                      <span>{c.pairsCount || 0} Cặp câu hỏi</span>
                      <span>•</span>
                      <span>{formatDisplayDate(c.createdAt)}</span>
                    </div>
                  </div>
                  <Link href={`/student/courses/${c.id}`}>
                    <button className="px-3 py-1.5 rounded-lg border border-zinc-200 hover:border-red-600 text-xs font-bold text-zinc-700 hover:text-red-600 cursor-pointer whitespace-nowrap">
                      Xem Thử
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Minigames */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-red-600" /> Trò Chơi Của Thầy/Cô ({stats.myGamesCount})
            </h2>
            <Link
              href="/teacher/game-sdk-guide"
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              Tài liệu Game SDK <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {myGames.length === 0 && !loading ? (
            <div className="p-6 rounded-2xl bg-white border border-zinc-200 text-center space-y-2">
              <p className="text-xs text-zinc-500">Thầy/Cô chưa tải lên minigame tùy chỉnh nào.</p>
              <Link href="/teacher/upload-center">
                <button className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-bold hover:bg-red-100 cursor-pointer">
                  Tải Lên Game Engine Mới
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myGames.map((g) => (
                <div
                  key={g.id}
                  className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center justify-between gap-4 hover:border-zinc-300 transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <h4 className="font-bold text-sm text-zinc-900 truncate">{g.title}</h4>
                    <p className="text-xs text-zinc-500 line-clamp-1">{g.description}</p>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                      <span>{g.genre}</span>
                      <span>•</span>
                      <span>{g.playsCount || 0} Lượt chơi</span>
                    </div>
                  </div>
                  <Link href={`/student/play/${g.id}/crs_coding_basics`}>
                    <button className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-600 hover:text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap">
                      <Play className="w-3 h-3" /> Chơi Thử
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
