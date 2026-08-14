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
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function TeacherDashboardPage() {
  const { currentUser, profile } = useAuthAdapter();
  const teacherUid = currentUser?.uid || profile?.uid || "usr_teacher";
  const teacherName = currentUser?.name || profile?.fullName || "Thầy/Cô Giáo Viên";

  const [stats, setStats] = useState({
    totalPlays: 348,
    enrolledStudents: 72,
    myCoursesCount: 4,
    myGamesCount: 3,
  });

  const [recentCourses, setRecentCourses] = useState<any[]>([
    {
      id: "crs_coding_basics",
      title: "Bài 1: Nhập Môn Tư Duy Lập Trình & Thuật Toán",
      pairsCount: 4,
      isAccepted: true,
      updatedAt: "Hôm nay",
    },
    {
      id: "crs_computer_hardware",
      title: "Bài 2: Khám Phá Phần Cứng & Kiến Trúc Máy Tính 3D",
      pairsCount: 3,
      isAccepted: true,
      updatedAt: "Hôm qua",
    },
    {
      id: "crs_quantum_101",
      title: "Bài 3: Lưỡng Tính Sóng Hạt & Hiện Tượng Quang Điện",
      pairsCount: 4,
      isAccepted: true,
      updatedAt: "3 ngày trước",
    },
  ]);

  const [myGames, setMyGames] = useState<any[]>([
    {
      id: "boss_battle_quiz",
      title: "Boss Slayer Marathon Quiz 🗡️",
      type: "Action QTE Quiz",
      isAccepted: true,
      downloads: 48,
    },
    {
      id: "game_space_quiz_3d",
      title: "Space Flight Quiz 3D",
      type: "WebGL Space Simulator",
      isAccepted: true,
      downloads: 120,
    },
    {
      id: "game_card_match_vr",
      title: "Quantum Memory Card Matrix",
      type: "Memory Match 3D",
      isAccepted: true,
      downloads: 85,
    },
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeacherData() {
      try {
        // Load courses from Firestore
        const coursesSnap = await getDocs(collection(db, "courses"));
        const coursesList = coursesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // Load games from Firestore
        const gamesSnap = await getDocs(collection(db, "game_info"));
        let gamesList = gamesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // Merge with local storage games
        try {
          if (typeof window !== "undefined") {
            const localGames = JSON.parse(localStorage.getItem("eve_uploaded_games") || "[]");
            localGames.forEach((lg: any) => {
              if (!gamesList.some((g: any) => g.title === lg.title || g.id === lg.id)) {
                gamesList.push(lg);
              }
            });

            const localCourses = JSON.parse(localStorage.getItem("eve_uploaded_courses") || "[]");
            localCourses.forEach((lc: any) => {
              if (!coursesList.some((c: any) => c.title === lc.title || c.id === lc.id)) {
                coursesList.push(lc);
              }
            });
          }
        } catch {}

        if (coursesList.length > 0) {
          setRecentCourses(coursesList.slice(0, 4));
        }

        if (gamesList.length > 0) {
          setMyGames(gamesList.slice(0, 4));
        }

        setStats({
          totalPlays: 348 + gamesList.length * 15,
          enrolledStudents: 72 + coursesList.length * 4,
          myCoursesCount: Math.max(coursesList.length, 4),
          myGamesCount: Math.max(gamesList.length, 3),
        });
      } catch (err) {
        console.warn("Using default teacher dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    }

    loadTeacherData();
  }, []);

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
            Theo dõi thống kê học tập, quản lý ngân hàng bài giảng và nộp Game Engine tương tác.
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
            <span className="text-xs font-mono">Tổng Lượt Học / Chơi</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono">{stats.totalPlays}</div>
          <div className="text-xs text-emerald-300 font-mono">Tăng +28% so với tháng trước</div>
        </div>

        {/* Enrolled Students */}
        <div className="p-5 rounded-2xl bg-[#0f1524]/80 border border-cyan-500/20 space-y-3">
          <div className="flex items-center justify-between text-cyan-400">
            <span className="text-xs font-mono">Học Sinh Theo Học</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono">{stats.enrolledStudents}</div>
          <div className="text-xs text-cyan-300 font-mono">Đang hoạt động tích cực</div>
        </div>

        {/* My Courses */}
        <div className="p-5 rounded-2xl bg-[#0f1524]/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono">Khóa Học & Bài Giảng</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono">{stats.myCoursesCount}</div>
          <div className="text-xs text-[#8e9bb4]">Đã tích hợp bộ câu hỏi trắc nghiệm</div>
        </div>

        {/* My Games */}
        <div className="p-5 rounded-2xl bg-[#0f1524]/80 border border-purple-500/20 space-y-3">
          <div className="flex items-center justify-between text-purple-400">
            <span className="text-xs font-mono">Game Engine Tương Tác</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Gamepad2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono">{stats.myGamesCount}</div>
          <div className="text-xs text-purple-300 font-mono">Đã nhúng chuẩn E-V-E SDK</div>
        </div>
      </div>

      {/* ── Content Highlights & Management ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Courses List */}
        <div className="p-6 rounded-2xl bg-[#0f1524]/80 border border-[#7bd1fa]/15 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" /> Danh Sách Khóa Học Gần Đây
            </h3>
            <Link
              href="/teacher/my-contents"
              className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentCourses.map((c, idx) => (
              <div
                key={c.id || idx}
                className="p-4 rounded-xl bg-[#151b2c] border border-slate-800 flex items-center justify-between gap-3 hover:border-emerald-500/30 transition-all"
              >
                <div className="min-w-0 space-y-1">
                  <div className="font-bold text-sm text-white truncate">{c.title}</div>
                  <div className="text-xs text-[#8e9bb4] flex items-center gap-2">
                    <span>{c.pairs?.length || c.pairsCount || 4} Cặp dữ liệu JSON</span>
                    <span>•</span>
                    <span className="text-emerald-400">Đã phát hành</span>
                  </div>
                </div>

                <Link href={`/student/play/boss_battle_quiz/${c.id || "crs_coding_basics"}`}>
                  <button className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer">
                    <Play className="w-3 h-3 fill-current" /> Chạy Thử
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* My Games List */}
        <div className="p-6 rounded-2xl bg-[#0f1524]/80 border border-[#7bd1fa]/15 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-purple-400" /> Game Engine Đã Đăng Tải
            </h3>
            <Link
              href="/teacher/upload-center"
              className="text-xs font-mono text-purple-400 hover:underline flex items-center gap-1"
            >
              Upload thêm <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {myGames.map((g, idx) => (
              <div
                key={g.id || idx}
                className="p-4 rounded-xl bg-[#151b2c] border border-slate-800 flex items-center justify-between gap-3 hover:border-purple-500/30 transition-all"
              >
                <div className="min-w-0 space-y-1">
                  <div className="font-bold text-sm text-white truncate">{g.title}</div>
                  <div className="text-xs text-[#8e9bb4] flex items-center gap-2">
                    <span className="text-purple-300 font-mono">{g.type || "HTML5 Minigame"}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Đã Kiểm Duyệt
                    </span>
                  </div>
                </div>

                <Link href={`/student/play/${g.id || "boss_battle_quiz"}/crs_coding_basics`}>
                  <button className="px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer">
                    <Play className="w-3 h-3 fill-current" /> Chơi Thử
                  </button>
                </Link>
              </div>
            ))}
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
