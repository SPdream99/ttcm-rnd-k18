"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Rocket,
  BookOpen,
  Gamepad2,
  Trophy,
  Coins,
  Play,
  ArrowRight,
  Flame,
  Bot,
  GraduationCap,
  PlusCircle,
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function StudentDashboardPage() {
  const { currentUser, profile } = useAuthAdapter();
  const displayName = currentUser?.name || profile?.fullName || "Học Viên E-V-E";
  const displayCoins = currentUser?.coins ?? profile?.coins ?? 250;

  const [enrolledClasses, setEnrolledClasses] = useState<any[]>([]);
  const [availableGames, setAvailableGames] = useState<any[]>([]);
  const [topRankings, setTopRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const user = auth.currentUser;

        // 1. Fetch Enrolled Classes
        if (user) {
          try {
            const enrollSnap = await getDocs(
              query(collection(db, "student_learning_path"), where("student_id", "==", user.uid))
            );

            const classesData: any[] = [];
            for (const docItem of enrollSnap.docs) {
              const eData = docItem.data();
              const pathId = eData.learning_path_id;

              const pathDoc = await getDoc(doc(db, "learning_path", pathId));
              if (pathDoc.exists()) {
                const pData = pathDoc.data();
                const courses = Array.isArray(pData.courses) ? pData.courses : [];
                classesData.push({
                  id: pathDoc.id,
                  title: pData.title || "Lớp học E-V-E",
                  description: pData.description || "",
                  progress: Number(eData.progress) || 0,
                  coursesCount: courses.length,
                  category: pData.category || "Công nghệ & Lập trình",
                  teacherName: pData.authorName || pData.teacherName || "Giáo Viên E-V-E",
                });
              }
            }
            setEnrolledClasses(classesData);
          } catch (e) {
            console.error("Lỗi khi tải thông tin lớp học:", e);
          }
        }

        // 2. Fetch Games List
        const gamesSnap = await getDocs(collection(db, "game_info"));
        let gamesList: any[] = [];

        gamesList.push({
          id: "game_card_match_vr",
          title: "Memory Matching Game ",
          courseName: "Lật Thẻ Trí Nhớ & Khái Niệm",
          genre: "Game Trí Nhớ 3D",
          reward: "+50 Coins",
          badge: "NỔI BẬT",
          href: "/student/play/game_card_match_vr/crs_coding_basics",
        });

        gamesList.push({
          id: "boss_battle_quiz",
          title: "Boss Slayer Marathon Quiz ",
          courseName: "Giải Đố Phản Xạ Đấu Trùm",
          genre: "Trắc Nghiệm Phản Xạ",
          reward: "+60 Coins",
          badge: "THỬ THÁCH",
          href: "/student/play/boss_battle_quiz/crs_python_foundation",
        });

        gamesSnap.docs.forEach((d) => {
          const data = d.data();
          if (data.status === "approved" || data.status === "active") {
            gamesList.push({
              id: d.id,
              title: data.name || data.title || "Minigame",
              courseName: data.category || "Minigame Giáo Dục",
              genre: data.genre || "HTML5 Game",
              reward: "+50 Coins",
              badge: "MỚI",
              href: `/student/play/${d.id}/default`,
            });
          }
        });
        setAvailableGames(gamesList.slice(0, 3));

        // 3. Top Rankings
        setTopRankings([
          { rank: 1, name: "Nguyễn Nhật Anh", points: 2850, badge: "Thủ Khoa", title: "Học Viên Xuất Sắc" },
          { rank: 2, name: "Nguyễn Thành Đạt", points: 2420, badge: "Á Khoa", title: "Chuyên Gia Thuật Toán" },
          { rank: 3, name: "Đàm Tuấn Nhiên", points: 1980, badge: "Khám Phá", title: "Thành Viên Tích Cực" },
        ]);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* ================= HERO CHÀO MỪNG (ĐỎ & TRẮNG, NO GRADIENT) ================= */}
      <div className="rounded-2xl border-2 border-red-600 bg-white p-6 md:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold">
                E-V-E Educational Ecosystem
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-bold">
                <Flame className="w-3.5 h-3.5 text-red-600" /> Chuỗi học 7 ngày 
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">
              Chào mừng trở lại, <span className="text-red-600">{displayName}</span>
            </h1>

            <p className="text-xs md:text-sm text-zinc-600 leading-relaxed">
              Theo dõi tiến độ bài học, khám phá bản đồ lộ trình học tập và rèn luyện kiến thức cùng kho minigame tương tác.
            </p>
          </div>

          {/* Khối Thao Tác & Điểm Thưởng */}
          <div className="flex items-center gap-3 self-start lg:self-auto shrink-0">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200">
              <div className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block font-bold uppercase">Số dư Coins</span>
                <span className="text-base font-bold text-red-600 font-mono">{displayCoins} Coins</span>
              </div>
            </div>

            <Link
              href="/student/ai-tutor"
              className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors flex items-center gap-2"
            >
              <Bot className="w-4 h-4" /> Hỏi Gia Sư
            </Link>
          </div>
        </div>
      </div>

      {/* ================= PHẦN 1: LỚP HỌC ĐÃ ĐĂNG KÝ ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-red-600" />
            <h2 className="text-lg md:text-xl font-bold text-zinc-900 tracking-tight">
              Lớp Học Đã Đăng Ký ({enrolledClasses.length})
            </h2>
          </div>

          <Link
            href="/student/learning-paths"
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
          >
            <PlusCircle className="w-4 h-4" /> Khám phá lộ trình mới <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {enrolledClasses.length === 0 ? (
          <div className="p-8 rounded-2xl border-2 border-dashed border-zinc-200 bg-white text-center space-y-4">
            <BookOpen className="w-12 h-12 text-zinc-400 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-zinc-900">Bạn Chưa Đăng Ký Lớp Học Nào</h3>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">
                Hãy lựa chọn lộ trình chuyên sâu để tham gia lớp học và mở khóa các chặng bài học theo bản đồ.
              </p>
            </div>
            <Link
              href="/student/learning-paths"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition"
            >
              <Rocket className="w-4 h-4" /> Khám Phá Lộ Trình Học Ngay
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {enrolledClasses.map((cls) => (
              <div
                key={cls.id}
                className="group rounded-2xl border border-zinc-200 bg-white p-5 hover:border-red-600 transition-all flex flex-col justify-between shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-red-50 border border-red-200 text-red-700 text-[10px] font-bold uppercase">
                      {cls.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-red-600">
                      {cls.progress}% Hoàn thành
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-zinc-900 group-hover:text-red-600 transition-colors line-clamp-1">
                    {cls.title}
                  </h3>

                  <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                    {cls.description}
                  </p>

                  {/* Thanh tiến độ */}
                  <div className="space-y-1.5 pt-1">
                    <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-red-600 transition-all duration-500"
                        style={{ width: `${cls.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-zinc-500">
                      <span>{cls.coursesCount} Khóa học</span>
                      <span>GV: {cls.teacherName}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-100 mt-4">
                  <Link
                    href={`/student/classes/${cls.id}`}
                    className="w-full py-2.5 rounded-xl bg-zinc-50 hover:bg-red-600 text-zinc-800 hover:text-white border border-zinc-200 hover:border-red-600 text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Vào Lớp Học
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= PHẦN 2: MINIGAME & BẢNG XẾP HẠNG ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Minigame (2 Cột) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-red-600" />
              <h2 className="text-lg md:text-xl font-bold text-zinc-900 tracking-tight">
                Kho Minigame Sẵn Sàng 
              </h2>
            </div>

            <Link
              href="/student/games"
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {availableGames.map((game) => (
              <div
                key={game.id}
                className="rounded-2xl border border-zinc-200 bg-white p-5 hover:border-red-600 transition-all flex flex-col justify-between shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold">
                      {game.badge}
                    </span>
                    <span className="text-xs font-mono font-bold text-red-600">{game.reward}</span>
                  </div>

                  <h3 className="text-sm font-bold text-zinc-900 line-clamp-1">{game.title}</h3>
                  <p className="text-xs text-zinc-500 line-clamp-2">{game.courseName}</p>
                </div>

                <div className="pt-4 border-t border-zinc-100 mt-3">
                  <Link
                    href={game.href}
                    className="w-full py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" /> Chơi Ngay
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Xếp Hạng (1 Cột) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-red-600" />
              <h2 className="text-lg md:text-xl font-bold text-zinc-900 tracking-tight">
                Bảng Vinh Danh 
              </h2>
            </div>

            <Link
              href="/student/leaderboard"
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              Chi tiết <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-4 space-y-3 shadow-sm">
            {topRankings.map((user) => (
              <div
                key={user.rank}
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-red-300 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 text-center font-bold font-mono text-sm ${
                    user.rank === 1 ? "text-red-600" : "text-zinc-700"
                  }`}>
                    #{user.rank}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900">{user.name}</h4>
                    <span className="text-[10px] text-zinc-500 block">{user.title}</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-red-600">{user.points} EXP</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
