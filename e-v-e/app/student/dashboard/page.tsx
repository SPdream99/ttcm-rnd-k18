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
  Sparkles,
  Bot,
  Zap,
  GraduationCap,
  PlusCircle,
  Terminal,
  Activity,
  ShieldAlert,
  Radio,
  Cpu,
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

        // 1. Fetch Enrolled Classes (My Classes from student_learning_path)
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
                  category: pData.category || "AI & Computing",
                  teacherName: pData.authorName || pData.teacherName || "Giáo Viên E-V-E",
                });
              }
            }
            setEnrolledClasses(classesData);
          } catch (e) {
            console.warn("// Telemetry: Failed to fetch student enrollment", e);
          }
        }

        // 2. Fetch Games from Firestore or Built-in Catalog
        const gamesSnap = await getDocs(collection(db, "game_info"));
        let gamesList: any[] = [];

        gamesList.push({
          id: "game_card_match_vr",
          title: "Memory Matching Game 🎴",
          courseName: "Lật Thẻ Trí Nhớ & Khái Niệm",
          genre: "Spatial Memory 3D",
          reward: "+50 Coins",
          badge: "POPULAR 🔥",
          accentColor: "#00F0FF",
          href: "/game/MemoryMatchingGame/play",
        });

        gamesList.push({
          id: "boss_battle_quiz",
          title: "Boss Slayer Marathon Quiz 🗡️",
          courseName: "Giải Đố Phản Xạ Đấu Trùm",
          genre: "Action QTE Quiz",
          reward: "+60 Coins",
          badge: "INTENSE ⚡",
          accentColor: "#FF4F00",
          href: "/student/play/boss_battle_quiz/crs_python_foundation",
        });

        gamesSnap.docs.forEach((d) => {
          const data = d.data();
          if (data.status === "approved" || data.status === "active") {
            gamesList.push({
              id: d.id,
              title: data.name || data.title || "Minigame",
              courseName: data.category || "Custom Game Engine",
              genre: data.genre || "HTML5 Canvas",
              reward: "+50 Coins",
              badge: "COMMUNITY ⭐",
              accentColor: "#E2F952",
              href: `/student/play/${d.id}/default`,
            });
          }
        });
        setAvailableGames(gamesList.slice(0, 3));

        // 3. Hall of Fame Top Rankings
        setTopRankings([
          { rank: 1, name: "Nguyễn Nhật Anh", points: 2850, badge: "🥇 Đại Sư Phụ AI", title: "Bậc Thầy Vũ Trụ", borderClass: "border-[#E2F952] text-[#E2F952]" },
          { rank: 2, name: "Nguyễn Thành Đạt", points: 2420, badge: "🥈 Chiến Binh Thuật Toán", title: "Thiên Tài Lượng Tử", borderClass: "border-[#00F0FF] text-[#00F0FF]" },
          { rank: 3, name: "Đàm Tuấn Nhiên", points: 1980, badge: "🥉 Nhà Khám Phá Vũ Trụ", title: "Nhà Thám Hiểm", borderClass: "border-[#FF4F00] text-[#FF4F00]" },
        ]);
      } catch (err) {
        console.error("// Telemetry: Dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div className="space-y-10 pb-16 font-sans">
      {/* ================= HERO MISSION BRIEFING (CONTROLLED CHAOS) ================= */}
      <div className="relative rounded-3xl border-2 border-zinc-800 bg-[#0c1017] p-6 md:p-10 shadow-[8px_8px_0px_0px_#000] overflow-hidden">
        {/* Physical Industrial Tape Accent */}
        <div className="absolute -top-3 left-10 bg-[#E2F952] text-black px-4 py-0.5 text-[10px] font-mono font-black tracking-widest uppercase rotate-[-2deg] border border-black shadow-[2px_2px_0px_0px_#000]">
          TERMINAL // RUNNING AT 60FPS
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pt-2">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 font-mono">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#00F0FF]/15 border border-[#00F0FF]/60 text-[#00F0FF] text-xs font-black tracking-wider">
                <Radio className="w-3.5 h-3.5 animate-pulse" /> E-V-E OPERATING SYSTEM
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#FF4F00]/15 border border-[#FF4F00]/60 text-[#FF4F00] text-xs font-black tracking-wider rotate-[1deg]">
                <Flame className="w-3.5 h-3.5 animate-bounce" /> 7-DAY STREAK
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Xin chào, <span className="text-[#00F0FF] underline decoration-[#E2F952] decoration-4 underline-offset-4">{displayName}</span>
            </h1>

            <p className="text-xs md:text-sm text-zinc-400 font-sans leading-relaxed">
              Trung tâm điều khiển học tập cá nhân hóa. Lựa chọn lớp học theo lộ trình, giải mã các node kiến thức và tham gia các đấu trường minigame chuẩn <strong className="text-zinc-200">E-V-E SDK v2.0</strong>.
            </p>
          </div>

          {/* Physical Tactile Stats Block */}
          <div className="flex flex-col sm:flex-row items-stretch gap-4 shrink-0 font-mono">
            {/* Coins Counter with Hard Shadow */}
            <div className="flex items-center gap-3 p-4 rounded-tl-2xl rounded-br-2xl bg-[#141b26] border-2 border-zinc-700 shadow-[5px_5px_0px_0px_#000] rotate-[-1deg] hover:rotate-0 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-black flex items-center justify-center font-black text-lg border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                🪙
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase font-bold">Số Dư E-V-E Coins</span>
                <span className="text-xl font-black text-[#E2F952]">{displayCoins} COINS</span>
              </div>
            </div>

            {/* AI Tutor Primary CTA with Physical Push Action */}
            <Link
              href="/student/ai-tutor"
              className="px-6 py-4 rounded-tr-2xl rounded-bl-2xl bg-[#00F0FF] hover:bg-[#38f4ff] text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[5px_5px_0px_0px_#000] hover:-translate-y-1 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Bot className="w-5 h-5 stroke-[2.5]" /> HỎI GIA SƯ AI TUTOR
            </Link>
          </div>
        </div>
      </div>

      {/* ================= SECTION 1: MY CLASSES (LỚP HỌC ĐÃ ĐĂNG KÝ) ================= */}
      <div className="space-y-5">
        <div className="flex items-center justify-between border-b-2 border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-[#00F0FF] text-black font-black border border-black shadow-[2px_2px_0px_0px_#000]">
              <GraduationCap className="w-4 h-4 stroke-[3]" />
            </div>
            <h2 className="text-xl font-black text-white tracking-tight uppercase font-mono">
              LỚP HỌC ĐÃ GHI DANH <span className="text-zinc-500 text-sm font-normal">({enrolledClasses.length})</span>
            </h2>
          </div>

          <Link
            href="/student/learning-paths"
            className="text-xs font-mono font-bold text-[#00F0FF] hover:text-[#E2F952] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> KHÁM PHÁ LỘ TRÌNH MỚI <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {enrolledClasses.length === 0 ? (
          <div className="p-10 rounded-3xl border-2 border-dashed border-zinc-800 bg-[#0c1017] text-center space-y-4 font-mono">
            <BookOpen className="w-12 h-12 text-zinc-600 mx-auto animate-bounce" />
            <div className="space-y-1">
              <h3 className="text-base font-black text-white uppercase">Chưa Ghi Danh Lớp Học Nào</h3>
              <p className="text-xs font-sans text-zinc-400 max-w-md mx-auto">
                Hãy lựa chọn lộ trình chuyên sâu để mở khóa lớp học, tham gia cộng đồng và thử thách minigame.
              </p>
            </div>
            <Link
              href="/student/learning-paths"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E2F952] text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
              <Rocket className="w-4 h-4" /> KHÁM PHÁ LEARNING PATHS NGAY
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledClasses.map((cls, idx) => {
              // Asymmetrical rotation per card
              const cardTilt = idx % 2 === 0 ? "rotate-[-0.8deg]" : "rotate-[0.8deg]";

              return (
                <div
                  key={cls.id}
                  className={`group rounded-tl-3xl rounded-br-3xl rounded-tr-md rounded-bl-md border-2 border-zinc-800 bg-[#121620] p-6 shadow-[6px_6px_0px_0px_#000] hover:border-[#00F0FF] hover:shadow-[6px_6px_0px_0px_#00F0FF] transition-all duration-200 flex flex-col justify-between ${cardTilt} hover:rotate-0`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-800 font-mono">
                      <span className="px-2.5 py-0.5 rounded-sm bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] text-[10px] font-bold uppercase tracking-wider">
                        {cls.category}
                      </span>
                      <span className="text-xs font-bold text-[#E2F952]">
                        {cls.progress}% COMPLETED
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-white group-hover:text-[#00F0FF] transition-colors line-clamp-1">
                      {cls.title}
                    </h3>

                    <p className="text-xs text-zinc-400 font-sans line-clamp-2 leading-relaxed">
                      {cls.description}
                    </p>

                    {/* Industrial Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="h-3 w-full rounded-sm bg-black border border-zinc-700 p-0.5 overflow-hidden">
                        <div
                          className="h-full rounded-xs bg-gradient-to-r from-[#00F0FF] to-[#E2F952] transition-all duration-500"
                          style={{ width: `${cls.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                        <span>{cls.coursesCount} KHÓA HỌC CHẶNG</span>
                        <span>GV: {cls.teacherName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-zinc-800 mt-5">
                    <Link
                      href={`/student/classes/${cls.id}`}
                      className="w-full py-3 rounded-xl bg-[#1a2332] hover:bg-[#00F0FF] text-white hover:text-black font-mono font-bold text-xs uppercase tracking-wider border-2 border-zinc-700 hover:border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> VÀO LỚP HỌC NGAY
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= SECTION 2: FAST MINIGAME HUB & LEADERBOARD ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Playable Minigames (2 Cols) */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between border-b-2 border-zinc-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-[#FF4F00] text-black font-black border border-black shadow-[2px_2px_0px_0px_#000]">
                <Gamepad2 className="w-4 h-4 stroke-[3]" />
              </div>
              <h2 className="text-xl font-black text-white tracking-tight uppercase font-mono">
                MINIGAME SẴN SÀNG CHIẾN ĐẤU 🎮
              </h2>
            </div>

            <Link
              href="/student/games"
              className="text-xs font-mono font-bold text-[#00F0FF] hover:text-[#E2F952] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              TẤT CẢ GAME <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {availableGames.map((game, i) => (
              <div
                key={game.id}
                className="rounded-2xl border-2 border-zinc-800 bg-[#121620] p-5 shadow-[5px_5px_0px_0px_#000] hover:border-[#E2F952] transition-all flex flex-col justify-between font-mono"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-sm bg-zinc-800 text-zinc-300 border border-zinc-700 text-[10px] font-bold uppercase">
                      {game.badge}
                    </span>
                    <span className="text-xs font-bold text-[#E2F952]">{game.reward}</span>
                  </div>

                  <h3 className="text-base font-black text-white line-clamp-1">{game.title}</h3>
                  <p className="text-xs text-zinc-400 font-sans line-clamp-2">{game.courseName}</p>
                </div>

                <div className="pt-4 border-t border-zinc-800 mt-4">
                  <Link
                    href={game.href}
                    className="w-full py-2.5 rounded-lg bg-[#E2F952] hover:bg-[#d6f03d] text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" /> BẮT ĐẦU CHƠI
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hall of Fame Ranking (1 Col) */}
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b-2 border-zinc-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-[#E2F952] text-black font-black border border-black shadow-[2px_2px_0px_0px_#000]">
                <Trophy className="w-4 h-4 stroke-[3]" />
              </div>
              <h2 className="text-xl font-black text-white tracking-tight uppercase font-mono">
                HALL OF FAME 🏆
              </h2>
            </div>

            <Link
              href="/student/leaderboard"
              className="text-xs font-mono font-bold text-[#00F0FF] hover:text-[#E2F952] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              CHI TIẾT <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="rounded-3xl border-2 border-zinc-800 bg-[#0c1017] p-5 space-y-3.5 shadow-[6px_6px_0px_0px_#000] font-mono">
            {topRankings.map((user) => (
              <div
                key={user.rank}
                className={`flex items-center justify-between p-3 rounded-xl bg-[#141b26] border-2 ${user.borderClass} shadow-[3px_3px_0px_0px_#000]`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-black text-sm">
                    #{user.rank}
                  </span>
                  <div>
                    <h4 className="text-xs font-black text-white font-sans">{user.name}</h4>
                    <span className="text-[10px] text-zinc-400 block">{user.title}</span>
                  </div>
                </div>
                <span className="text-xs font-black text-[#E2F952]">{user.points} EXP</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
