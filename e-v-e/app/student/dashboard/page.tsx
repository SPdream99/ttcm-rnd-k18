"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Rocket,
  BookOpen,
  Gamepad2,
  Trophy,
  ShoppingBag,
  Coins,
  Play,
  CheckCircle2,
  ArrowRight,
  Flame,
  Sparkles,
  Award,
  Swords,
  Bot,
  Zap,
  Target,
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function StudentDashboardPage() {
  const { currentUser, profile } = useAuthAdapter();
  const displayName = currentUser?.name || profile?.fullName || "Học Viên E-V-E";
  const displayCoins = currentUser?.coins ?? profile?.coins ?? 250;

  const [learningPaths, setLearningPaths] = useState<any[]>([]);
  const [availableGames, setAvailableGames] = useState<any[]>([]);
  const [topRankings, setTopRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);

        // 1. Fetch Learning Paths from Firestore
        const pathsSnap = await getDocs(collection(db, "learning_path"));
        const realPaths = pathsSnap.docs.map((d) => {
          const data = d.data();
          const coursesList = Array.isArray(data.courses) ? data.courses : [];
          return {
            id: d.id,
            title: data.title || "Lộ trình học tập",
            progress: 0,
            currentCourseId: coursesList[0] || "default",
            currentCourseTitle: data.title || "Bài học số 1",
            nextGameId: "boss_battle_quiz",
            totalCourses: coursesList.length || 1,
            completedCourses: 0,
          };
        });
        setLearningPaths(realPaths.slice(0, 4));

        // 2. Fetch Custom / Approved Games from Firestore
        const gamesSnap = await getDocs(collection(db, "game_info"));
        let gamesList: any[] = [];

        // Add standard built-in engines
        gamesList.push({
          id: "boss_battle_quiz",
          title: "Boss Slayer Marathon Quiz 🗡️",
          courseId: "all",
          courseName: "Tất Cả Khóa Học",
          genre: "Action QTE Quiz",
          reward: "+100 Coins",
          badge: "HOT 🔥",
          description: "Đánh trùm 1000 HP marathon 10s liên tục, né đòn phản công QTE bằng phím mũi tên!",
        });

        gamesList.push({
          id: "game_card_match_vr",
          title: "Quantum Memory Card Matrix 🃏",
          courseId: "all",
          courseName: "Tất Cả Khóa Học",
          genre: "Memory Match 3D",
          reward: "+40 Coins",
          badge: "TRÍ TUỆ 💡",
          description: "Lật và ghi nhớ các cặp định nghĩa để nhận thưởng điểm cao.",
        });

        gamesList.push({
          id: "game_hardware_3d_lab",
          title: "Phòng Thí Nghiệm Lắp Ráp Máy Tính 3D 💻",
          courseId: "all",
          courseName: "Phần Cứng & Kiến Trúc",
          genre: "Hardware Assembly Simulator",
          reward: "+60 Coins",
          badge: "MÔ PHỎNG 🖥️",
          description: "Lắp ráp linh kiện CPU, RAM, GPU, SSD vào Bo mạch chủ PC trực quan.",
        });

        // Add custom teacher games
        gamesSnap.docs.forEach((d) => {
          const data = d.data();
          gamesList.push({
            id: d.id,
            title: `${data.title || "Minigame"} 🎮`,
            courseId: (data.courses_allowed && data.courses_allowed[0]) || "all",
            courseName: "Khóa Học Tương Tác",
            genre: data.genre || "Interactive Quiz",
            reward: "+50 Coins",
            badge: "GIẢNG VIÊN TẢI LÊN",
            description: data.description || "Trò chơi học tập tích hợp câu hỏi trắc nghiệm.",
          });
        });

        setAvailableGames(gamesList);

        // 3. Fetch Real Leaderboard
        const userDocsSnap = await getDocs(collection(db, "users"));
        const gameResSnap = await getDocs(collection(db, "game_results"));

        const studentScores = new Map<string, { name: string; score: number; coins: number }>();
        userDocsSnap.docs.forEach((d) => {
          const u = d.data();
          if (u.role === "student" || (!u.role && u.email)) {
            studentScores.set(d.id, {
              name: u.displayName || u.fullName || u.name || "Học viên",
              score: Number(u.score) || 0,
              coins: Number(u.coins) || 0,
            });
          }
        });

        gameResSnap.docs.forEach((gr) => {
          const data = gr.data();
          const uid = data.uid || data.userId;
          if (uid && studentScores.has(uid)) {
            const st = studentScores.get(uid)!;
            st.score += Number(data.score) || Number(data.result) || 0;
            st.coins += Number(data.reward) || 0;
          }
        });

        const sortedRankings = Array.from(studentScores.values())
          .sort((a, b) => b.score - a.score || b.coins - a.coins)
          .slice(0, 5)
          .map((item, idx) => ({
            rank: idx + 1,
            name: item.name,
            score: item.score,
            coins: item.coins,
            badge: idx === 0 ? "Thủ Khoa 👑" : idx === 1 ? "Chuyên Gia 💡" : "Bứt Phá 🔥",
          }));

        setTopRankings(sortedRankings);
      } catch (err) {
        console.warn("Lỗi tải dữ liệu dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/15">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-mono mb-2">
            <Flame className="w-3.5 h-3.5 text-amber-400" /> Không Gian Học Tập Trực Tuyến • Chào mừng {displayName} 🌟
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Bảng Điều Khiển Học Viên E-V-E 🚀
          </h1>
          <p className="text-sm text-[#8e9bb4] mt-1">
            Tiếp tục hành trình học tập, hoàn thành các bài học & minigame tương tác để tích lũy Coins và vinh danh trên BXH.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="font-mono font-bold text-sm text-amber-300">{displayCoins} Coins</span>
          </div>
          <Link href="/student/shop">
            <button className="px-3.5 py-2 rounded-xl bg-[#151b2c] hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" /> Đổi Thưởng
            </button>
          </Link>
        </div>
      </div>

      {/* ── Active Learning Paths ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" /> Lộ Trình Đang Xuất Bản ({learningPaths.length})
          </h2>
          <Link
            href="/student/learning-paths"
            className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
          >
            Xem tất cả lộ trình <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {learningPaths.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#0f1524]/60 border border-slate-800 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-400">Chưa có lộ trình học tập nào được phát hành.</p>
            <Link href="/student/learning-paths">
              <button className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold hover:bg-cyan-500/30 transition-all cursor-pointer">
                Khám Phá Lộ Trình
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {learningPaths.map((path) => (
              <div
                key={path.id}
                className="p-6 rounded-2xl bg-gradient-to-r from-[#0f1524] via-[#151b2c] to-[#0f1524] border border-[#7bd1fa]/20 shadow-xl space-y-5 hover:border-cyan-500/40 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider">Lộ Trình Đào Tạo</span>
                    <h3 className="text-lg font-bold text-white mt-0.5">{path.title}</h3>
                    <p className="text-xs text-[#8e9bb4] mt-1">
                      Tổng số bài: <strong className="text-cyan-300">{path.totalCourses} bài học</strong>
                    </p>
                  </div>

                  <Link href="/student/learning-paths">
                    <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-cyan-300 text-white font-mono text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.35)] transition-all cursor-pointer flex items-center gap-2 shrink-0">
                      <Play className="w-3.5 h-3.5 fill-white" /> Khám Phá Ngay
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Games & Quick Challenge Grid ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-amber-400" /> Trò Chơi Học Tập Sẵn Sàng ({availableGames.length})
          </h2>
          <Link
            href="/student/games"
            className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1"
          >
            Vào Phòng Game Arcade <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {availableGames.slice(0, 3).map((game) => (
            <div
              key={game.id}
              className="p-5 rounded-2xl bg-[#0f1524]/90 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4 group shadow-lg"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
                    {game.badge}
                  </span>
                  <span className="text-xs font-mono text-amber-400 font-bold">{game.reward}</span>
                </div>
                <h3 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors">
                  {game.title}
                </h3>
                <p className="text-xs text-[#8e9bb4] line-clamp-2 leading-relaxed">
                  {game.description}
                </p>
              </div>

              <Link href="/student/games">
                <button className="w-full py-2.5 rounded-xl bg-[#151b2c] hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700 hover:border-amber-500/40 text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-2">
                  <Play className="w-3.5 h-3.5" /> Chọn Khóa & Chơi
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Leaderboard Preview ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" /> Bảng Xếp Hạng Học Viên
          </h2>
          <Link
            href="/student/leaderboard"
            className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
          >
            Xem toàn bộ BXH <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {topRankings.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#0f1524]/60 border border-slate-800 text-center">
            <p className="text-xs text-slate-500 font-mono">Chưa có điểm xếp hạng thực tế nào được ghi nhận.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topRankings.map((user) => (
              <div
                key={user.rank}
                className="p-4 rounded-2xl bg-[#0f1524]/90 border border-slate-800 flex items-center justify-between gap-3 shadow-md"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center font-mono ${
                      user.rank === 1
                        ? "bg-amber-400 text-black shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                        : user.rank === 2
                        ? "bg-slate-300 text-black"
                        : "bg-amber-700 text-white"
                    }`}
                  >
                    #{user.rank}
                  </span>
                  <div>
                    <div className="text-sm font-bold text-white truncate max-w-[120px] sm:max-w-[150px]">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">{user.badge}</div>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xs font-bold text-amber-300">{user.score} pts</div>
                  <div className="text-[10px] text-slate-400">{user.coins} Coins</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
