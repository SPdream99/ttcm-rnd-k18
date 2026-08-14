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
  Clock,
  Sparkles,
  ArrowRight,
  Award,
  CheckCircle2,
  Play,
  FileCode2,
  FolderOpen,
  Bot,
  ExternalLink,
  Inbox,
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function TeacherDashboardPage() {
  const { currentUser, profile } = useAuthAdapter();
  const teacherUid = currentUser?.uid || currentUser?.id || profile?.uid || profile?.id || "";
  const teacherEmail = currentUser?.email || profile?.email || "";
  const teacherName = currentUser?.name || currentUser?.displayName || profile?.fullName || "Thầy/Cô Giáo Viên";

  const [stats, setStats] = useState({
    totalPlays: 0,
    enrolledStudents: 0,
    myCoursesCount: 0,
    myGamesCount: 0,
  });

  const [recentCourses, setRecentCourses] = useState<any[]>([]);
  const [myGames, setMyGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeacherData() {
      if (!teacherUid && !teacherEmail) {
        setLoading(false);
        return;
      }

      try {
        // 1. Load Courses belonging exclusively to this teacher
        const coursesSnap = await getDocs(collection(db, "courses"));
        let myCoursesList: any[] = [];

        coursesSnap.docs.forEach((d) => {
          const data = d.data();
          const docAuthor =
            data.authorId ||
            data.author_id ||
            data.instructorId ||
            data.instructor_id;
          const docEmail = data.authorEmail || data.email;

          if (
            (teacherUid && docAuthor === teacherUid) ||
            (teacherEmail && docEmail === teacherEmail)
          ) {
            myCoursesList.push({ id: d.id, ...data });
          }
        });

        // 2. Load Games belonging exclusively to this teacher
        const gamesSnap = await getDocs(collection(db, "game_info"));
        let myGamesList: any[] = [];

        gamesSnap.docs.forEach((d) => {
          const data = d.data();
          const docAuthor =
            data.authorId ||
            data.author_id ||
            data.uploaderId ||
            data.uploader_id;
          const docEmail = data.authorEmail || data.uploaderEmail;

          if (
            (teacherUid && docAuthor === teacherUid) ||
            (teacherEmail && docEmail === teacherEmail)
          ) {
            myGamesList.push({ id: d.id, ...data });
          }
        });

        // Merge with local storage items created by this teacher
        try {
          if (typeof window !== "undefined") {
            const localGames = JSON.parse(
              localStorage.getItem("eve_uploaded_games") || "[]"
            );
            localGames.forEach((lg: any) => {
              const lgAuthor =
                lg.authorId || lg.author_id || lg.uploaderId || lg.uploader_id;
              if (
                (!lgAuthor || lgAuthor === teacherUid) &&
                !myGamesList.some((g) => g.id === lg.id || g.title === lg.title)
              ) {
                myGamesList.unshift(lg);
              }
            });

            const localCourses = JSON.parse(
              localStorage.getItem("eve_uploaded_courses") || "[]"
            );
            localCourses.forEach((lc: any) => {
              const lcAuthor =
                lc.authorId || lc.author_id || lc.instructorId || lc.instructor_id;
              if (
                (!lcAuthor || lcAuthor === teacherUid) &&
                !myCoursesList.some((c) => c.id === lc.id || c.title === lc.title)
              ) {
                myCoursesList.push(lc);
              }
            });
          }
        } catch {}

        setRecentCourses(myCoursesList.slice(0, 4));

        const formattedGames = myGamesList.map((g: any) => ({
          id: g.id || g.gameId,
          title: g.title || "Game Quiz",
          genre:
            g.genre ||
            (g.needExtraData || g.need_extra_data
              ? "Dynamic Quiz Game"
              : "Standalone Engine"),
          playsCount: Number(g.playsCount || g.plays_count || 0),
          isAccepted: Boolean(g.isAccepted ?? g.is_accepted),
          authorName: g.authorName || "Tôi",
        }));
        setMyGames(formattedGames.slice(0, 4));

        // Tính toán số liệu thống kê riêng của giáo viên này
        const totalPlaysCount = myGamesList.reduce(
          (acc, cur) => acc + (Number(cur.playsCount || cur.plays_count || 0)),
          0
        );

        const totalStudentsCount = myCoursesList.reduce(
          (acc, cur) => acc + (Number(cur.students_count || cur.studentsCount || 0)),
          0
        );

        setStats({
          totalPlays: totalPlaysCount,
          enrolledStudents: totalStudentsCount,
          myCoursesCount: myCoursesList.length,
          myGamesCount: myGamesList.length,
        });
      } catch (err) {
        console.warn("Lỗi tải thông tin tổng quan của giáo viên:", err);
      } finally {
        setLoading(false);
      }
    }

    loadTeacherData();

    if (typeof window !== "undefined") {
      window.addEventListener("eve_games_updated", loadTeacherData);
      window.addEventListener("storage", loadTeacherData);
      return () => {
        window.removeEventListener("eve_games_updated", loadTeacherData);
        window.removeEventListener("storage", loadTeacherData);
      };
    }
  }, [teacherUid, teacherEmail]);

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/15">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-mono mb-2">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-400" /> Bàn Làm Việc Giảng Viên • {teacherName}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Educator Studio Dashboard 🚀
          </h1>
          <p className="text-sm text-[#8e9bb4] mt-1">
            Tổng quan các bài giảng, lộ trình và game tương tác thuộc quyền quản lý của riêng Thầy/Cô.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/teacher/upload-center">
            <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-mono text-xs font-bold shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all cursor-pointer flex items-center gap-2">
              <PlusCircle className="w-4 h-4" /> Tải Lên Nội Dung Mới
            </button>
          </Link>
        </div>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Student Plays */}
        <div className="p-5 rounded-2xl bg-[#0f1524]/80 border border-emerald-500/20 space-y-3">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-mono">Lượt Chơi Game Của Tôi</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono">{stats.totalPlays}</div>
          <div className="text-xs text-emerald-300 font-mono">Tổng tích lũy từ các game của tôi</div>
        </div>

        {/* Enrolled Students */}
        <div className="p-5 rounded-2xl bg-[#0f1524]/80 border border-cyan-500/20 space-y-3">
          <div className="flex items-center justify-between text-cyan-400">
            <span className="text-xs font-mono">Học Sinh Tham Gia</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono">{stats.enrolledStudents}</div>
          <div className="text-xs text-cyan-300 font-mono">Đăng ký vào khóa học của tôi</div>
        </div>

        {/* My Courses */}
        <div className="p-5 rounded-2xl bg-[#0f1524]/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono">Bài Học / Khóa Học</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono">{stats.myCoursesCount}</div>
          <div className="text-xs text-[#8e9bb4]">Đã tạo và đang quản lý</div>
        </div>

        {/* My Games */}
        <div className="p-5 rounded-2xl bg-[#0f1524]/80 border border-purple-500/20 space-y-3">
          <div className="flex items-center justify-between text-purple-400">
            <span className="text-xs font-mono">Game Engine Của Tôi</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Gamepad2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono">{stats.myGamesCount}</div>
          <div className="text-xs text-purple-300 font-mono">Game đã nộp lên hệ thống</div>
        </div>
      </div>

      {/* ── Content Highlights & Management ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Courses List */}
        <div className="p-6 rounded-2xl bg-[#0f1524]/80 border border-[#7bd1fa]/15 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" /> Khóa Học Gần Đây Của Tôi
            </h3>
            <Link
              href="/teacher/my-contents"
              className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              Xem tất cả ({stats.myCoursesCount}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentCourses.length === 0 && !loading ? (
              <div className="p-8 rounded-xl bg-[#151b2c]/60 border border-dashed border-slate-800 text-center space-y-2">
                <div className="text-xs text-slate-400">Thầy/Cô chưa có khóa học nào.</div>
                <Link href="/teacher/upload-center">
                  <button className="text-xs text-cyan-400 hover:underline font-mono font-bold">
                    + Tạo khóa học đầu tiên ngay
                  </button>
                </Link>
              </div>
            ) : (
              recentCourses.map((c, idx) => {
                const pairs = Array.isArray(c.contentData)
                  ? c.contentData
                  : c.contentData?.pairs || c.pairs || [];
                return (
                  <div
                    key={c.id || idx}
                    className="p-4 rounded-xl bg-[#151b2c] border border-slate-800 flex items-center justify-between gap-3 hover:border-emerald-500/30 transition-all"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="font-bold text-sm text-white truncate">{c.title}</div>
                      <div className="text-xs text-[#8e9bb4] flex items-center gap-2">
                        <span>{pairs.length || c.pairsCount || 0} Cặp câu hỏi</span>
                        <span>•</span>
                        <span
                          className={
                            (c.isAccepted ?? c.is_accepted)
                              ? "text-emerald-400"
                              : "text-amber-400"
                          }
                        >
                          {(c.isAccepted ?? c.is_accepted)
                            ? "Đã phê duyệt"
                            : "Đang chờ duyệt"}
                        </span>
                      </div>
                    </div>

                    <Link href={`/student/play/${myGames[0]?.id || "boss_battle_quiz"}/${c.id}`}>
                      <button className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer">
                        <Play className="w-3 h-3 fill-current" /> Chạy Thử
                      </button>
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* My Games List */}
        <div className="p-6 rounded-2xl bg-[#0f1524]/80 border border-[#7bd1fa]/15 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-purple-400" /> Game Engine Tôi Đã Nộp
            </h3>
            <Link
              href="/teacher/upload-center"
              className="text-xs font-mono text-purple-400 hover:underline flex items-center gap-1"
            >
              Upload thêm <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {myGames.length === 0 && !loading ? (
              <div className="p-8 rounded-xl bg-[#151b2c]/60 border border-dashed border-slate-800 text-center space-y-2">
                <div className="text-xs text-slate-400">Thầy/Cô chưa tải lên game nào.</div>
                <Link href="/teacher/upload-center">
                  <button className="text-xs text-purple-400 hover:underline font-mono font-bold">
                    + Nộp gói game (.zip) đầu tiên
                  </button>
                </Link>
              </div>
            ) : (
              myGames.map((g, idx) => (
                <div
                  key={g.id || idx}
                  className="p-4 rounded-xl bg-[#151b2c] border border-slate-800 flex items-center justify-between gap-3 hover:border-purple-500/30 transition-all"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="font-bold text-sm text-white truncate">{g.title}</div>
                    <div className="text-xs text-[#8e9bb4] flex items-center gap-2">
                      <span className="text-purple-300 font-mono">{g.genre}</span>
                      <span>•</span>
                      <span
                        className={
                          g.isAccepted
                            ? "text-emerald-400 font-bold flex items-center gap-1"
                            : "text-amber-400 font-bold flex items-center gap-1"
                        }
                      >
                        {g.isAccepted ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> Đã Kiểm Duyệt
                          </>
                        ) : (
                          "Chờ Admin Duyệt"
                        )}
                      </span>
                    </div>
                  </div>

                  <Link href={`/student/play/${g.id}/${recentCourses[0]?.id || "crs_coding_basics"}`}>
                    <button className="px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer">
                      <Play className="w-3 h-3 fill-current" /> Chơi Thử
                    </button>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Quick Feature Banners ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Banner 1: AI Tutor */}
        <Link
          href="/teacher/ai-tutor"
          className="p-5 rounded-2xl bg-gradient-to-br from-[#0f1524] to-[#172554] border border-cyan-500/30 hover:border-cyan-400 transition-all group shadow-lg"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300">
              <Bot className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors">
              Trợ Giảng Soạn Bài AI
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Sử dụng Google Gemini AI để tự động tạo đề thi, câu hỏi trắc nghiệm và cặp JSON thông minh chỉ trong vài giây.
          </p>
        </Link>

        {/* Banner 2: Upload Center */}
        <Link
          href="/teacher/upload-center"
          className="p-5 rounded-2xl bg-gradient-to-br from-[#0f1524] to-[#064e3b] border border-emerald-500/30 hover:border-emerald-400 transition-all group shadow-lg"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300">
              <FolderOpen className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base group-hover:text-emerald-300 transition-colors">
              Upload Center (Kéo Thả)
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Hỗ trợ kéo thả file zip game engine, theo dõi tiến trình upload thời gian thực và quản lý tài nguyên bài giảng.
          </p>
        </Link>

        {/* Banner 3: Game SDK Guide */}
        <Link
          href="/teacher/game-sdk-guide"
          className="p-5 rounded-2xl bg-gradient-to-br from-[#0f1524] to-[#581c87] border border-purple-500/30 hover:border-purple-400 transition-all group shadow-lg"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300">
              <FileCode2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base group-hover:text-purple-300 transition-colors">
              Hướng Dẫn Game SDK
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Tài liệu tích hợp `eve-game-sdk.js`, giao tiếp qua `window.postMessage` và chuẩn inject dữ liệu câu hỏi từ bài học.
          </p>
        </Link>
      </div>
    </div>
  );
}
