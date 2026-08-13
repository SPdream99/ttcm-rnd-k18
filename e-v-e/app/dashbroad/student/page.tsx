"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Rocket,
  BookOpen,
  Gamepad2,
  Trophy,
  ShoppingBag,
  UserCheck,
  Coins,
  Flame,
  Award,
  LogOut,
  Play,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { useLearningPathAdapter } from "@/hooks/useLearningPathAdapter";
import { useGameAdapter } from "@/hooks/useGameAdapter";
import { useGameResultAdapter } from "@/hooks/useGameResultAdapter";
import { useShopAdapter } from "@/hooks/useShopAdapter";

export default function StudentDashboard() {
  const { currentUser, profile } = useAuthAdapter();
  const uid = currentUser?.uid || currentUser?.id || profile?.id || "usr_student_001";

  const { learningPaths, loading: lpathLoading } = useLearningPathAdapter();
  const { games, loading: gamesLoading } = useGameAdapter();
  const { topStudents, submitResult } = useGameResultAdapter(uid);
  const { shopItems, userDecorations, buyItem } = useShopAdapter(uid);

  const [activeTab, setActiveTab] = useState<"paths" | "games" | "leaderboard" | "shop">("paths");
  const [selectedGameUrl, setSelectedGameUrl] = useState<string | null>(null);
  const [selectedGameTitle, setSelectedGameTitle] = useState<string>("");
  const [buyingItemId, setBuyingItemId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const currentCoins = currentUser?.coins ?? profile?.coins ?? 250;

  // Handle Game Completion & Coin Reward via postMessage
  const handleLaunchGame = (gameUrl: string, title: string) => {
    setSelectedGameUrl(gameUrl);
    setSelectedGameTitle(title);
  };

  const handleSimulateGameFinish = async () => {
    if (!selectedGameUrl) return;
    const rewardCoins = 50;
    const score = 95;
    const res = await submitResult({
      uid,
      cid: "crs_quantum_101",
      gid: "game_space_quiz_3d",
      result: score,
      reward: rewardCoins,
    });

    if (res.success) {
      setFeedbackMsg(`🎉 Chúc mừng! Bạn đã hoàn thành trò chơi, đạt ${score} điểm và nhận được +${rewardCoins} Coins!`);
      setSelectedGameUrl(null);
      setTimeout(() => setFeedbackMsg(null), 4000);
    }
  };

  const handleBuyItem = async (itemId: string, price: number) => {
    setBuyingItemId(itemId);
    const res = await buyItem(itemId, price);
    if (res.success) {
      setFeedbackMsg("🛒 Mua vật phẩm trang trí thành công! Đã thêm vào Profile.");
    } else {
      setFeedbackMsg(`❌ ${res.error || "Giao dịch thất bại."}`);
    }
    setBuyingItemId(null);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-[#e1e2ec] font-sans flex flex-col md:flex-row relative overflow-hidden">
      {/* Background Starfield */}
      <div
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0f1524]/80 backdrop-blur-xl border-r border-[#7bd1fa]/15 p-6 flex flex-col justify-between z-10">
        <div className="space-y-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1px] flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)]">
              <div className="w-full h-full rounded-xl bg-[#0a0e1a] flex items-center justify-center">
                <Rocket className="w-5 h-5 text-cyan-300" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-widest block">E-V-E</span>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">Student Hub</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2 font-medium text-sm">
            <button
              onClick={() => setActiveTab("paths")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === "paths"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                  : "text-[#8e9bb4] hover:text-white hover:bg-white/5"
              }`}
            >
              <BookOpen className="w-4 h-4" /> Lộ Trình Học Tập
            </button>

            <button
              onClick={() => setActiveTab("games")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === "games"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                  : "text-[#8e9bb4] hover:text-white hover:bg-white/5"
              }`}
            >
              <Gamepad2 className="w-4 h-4" /> Game Engine Quiz
            </button>

            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === "leaderboard"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                  : "text-[#8e9bb4] hover:text-white hover:bg-white/5"
              }`}
            >
              <Trophy className="w-4 h-4" /> Bảng Xếp Hạng Tháng
            </button>

            <button
              onClick={() => setActiveTab("shop")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === "shop"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                  : "text-[#8e9bb4] hover:text-white hover:bg-white/5"
              }`}
            >
              <ShoppingBag className="w-4 h-4" /> Cửa Hàng Đổi Coin
            </button>

            <Link
              href="/dashbroad/student/profile"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#8e9bb4] hover:text-white hover:bg-white/5 transition-all"
            >
              <UserCheck className="w-4 h-4" /> Trang Cá Nhân
            </Link>
          </nav>
        </div>

        {/* User Quick Info */}
        <div className="pt-6 border-t border-[#7bd1fa]/10 space-y-4">
          <div className="p-3 rounded-xl bg-[#151b2c] border border-[#7bd1fa]/15 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono font-bold text-amber-300">{currentCoins} Coins</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {currentUser?.role || profile?.role || "STUDENT"}
            </span>
          </div>

          <Link href="/public/login">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-mono transition-all cursor-pointer">
              <LogOut className="w-3.5 h-3.5" /> Đăng Xuất
            </button>
          </Link>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 p-4 md:p-8 z-10 space-y-8 overflow-y-auto">
        {/* Banner Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/10">
          <div>
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono mb-1">
              <Flame className="w-4 h-4 text-amber-400" /> Chuỗi 7 Ngày Học Liên Tục • Chào mừng Explorer!
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Trung Tâm Điều Hành Học Sinh 🚀
            </h1>
            <p className="text-sm text-[#8e9bb4] mt-1">
              Khám phá lộ trình tri thức, chơi game trắc nghiệm và tích lũy Coin đổi phần thưởng.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-4 py-2.5 rounded-2xl bg-[#0f1524] border border-amber-500/30 flex items-center gap-3 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
              <Coins className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-[10px] text-slate-400 font-mono uppercase">Số Dư Coins</div>
                <div className="text-base font-bold text-amber-300 font-mono">{currentCoins} Coins</div>
              </div>
            </div>
          </div>
        </header>

        {/* Global Feedback Banner */}
        {feedbackMsg && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-900/60 to-blue-900/60 border border-cyan-400/40 text-cyan-200 text-sm font-medium shadow-lg animate-fade-in flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-cyan-300 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* TAB 1: Learning Paths */}
        {activeTab === "paths" && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" /> Lộ Trình Học Tập Khuyên Dùng
              </h2>
              <span className="text-xs font-mono text-[#8e9bb4]">
                {learningPaths.length} Lộ Trình Đã Phê Duyệt
              </span>
            </div>

            {lpathLoading ? (
              <div className="text-center py-12 font-mono text-xs text-cyan-400 animate-pulse">
                Đang tải dữ liệu lộ trình học tập từ Firestore...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {learningPaths.map((path) => (
                  <div
                    key={path.lpathId || path.id}
                    className="p-6 rounded-2xl bg-[#0f1524]/80 backdrop-blur-md border border-[#7bd1fa]/15 hover:border-cyan-500/40 transition-all space-y-4 shadow-xl"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono border border-cyan-500/30">
                          {path.courses.length} Bài Học
                        </span>
                        <h3 className="text-lg font-bold text-white mt-2">{path.title}</h3>
                      </div>
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    </div>

                    <p className="text-xs text-[#8e9bb4] line-clamp-2">{path.description}</p>

                    <div className="pt-4 border-t border-[#7bd1fa]/10 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-400">
                        Tác giả: {path.authorId}
                      </span>
                      <button
                        onClick={() => {
                          setActiveTab("games");
                          setFeedbackMsg(`Đã chọn lộ trình "${path.title}". Hãy chọn Game tương ứng bên dưới để ôn tập!`);
                        }}
                        className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" /> Bắt Đầu Học
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 2: Games */}
        {activeTab === "games" && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-cyan-400" /> Game Engine Ôn Tập Tri Thức
              </h2>
              <span className="text-xs font-mono text-[#8e9bb4]">
                Tự động giao tiếp qua iframe window.postMessage()
              </span>
            </div>

            {gamesLoading ? (
              <div className="text-center py-12 font-mono text-xs text-cyan-400 animate-pulse">
                Đang tải danh sách Game Engine từ Firestore...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {games.map((game) => (
                  <div
                    key={game.gameId || game.id}
                    className="p-6 rounded-2xl bg-[#0f1524]/80 backdrop-blur-md border border-[#7bd1fa]/15 hover:border-cyan-500/40 transition-all space-y-4 shadow-xl"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono border border-emerald-500/30">
                          Game Trắc Nghiệm 3D
                        </span>
                        <h3 className="text-lg font-bold text-white mt-2">{game.title}</h3>
                      </div>
                      <Sparkles className="w-5 h-5 text-amber-400" />
                    </div>

                    <p className="text-xs text-[#8e9bb4]">{game.description}</p>

                    <div className="space-y-1 font-mono text-[11px] text-slate-400">
                      <div>Tác giả: {game.authors.join(", ")}</div>
                      <div>Khóa học tương thích: {game.coursesAllowed.join(", ")}</div>
                    </div>

                    <div className="pt-4 border-t border-[#7bd1fa]/10 flex items-center justify-between">
                      <span className="text-xs font-mono text-amber-300 flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5" /> Phấn thưởng: +50 Coins
                      </span>
                      <button
                        onClick={() => handleLaunchGame(game.sourceUrl, game.title)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-bold font-mono text-xs shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" /> Chơi Game Ngay
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 3: Leaderboard */}
        {activeTab === "leaderboard" && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" /> Bảng Xếp Hạng Học Sinh Nổi Bật Tháng 8
              </h2>
              <span className="text-xs font-mono text-amber-300">
                Cập nhật theo mốc thời gian played_at
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-[#0f1524]/80 backdrop-blur-md border border-[#7bd1fa]/15 space-y-4 shadow-xl">
              <div className="space-y-3">
                {topStudents.map((student) => (
                  <div
                    key={student.uid}
                    className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                      student.rank === 1
                        ? "bg-amber-500/10 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                        : "bg-[#151b2c] border-[#7bd1fa]/10"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-sm font-mono ${
                          student.rank === 1
                            ? "bg-amber-400 text-black"
                            : student.rank === 2
                            ? "bg-slate-300 text-black"
                            : "bg-amber-700 text-white"
                        }`}
                      >
                        #{student.rank}
                      </div>

                      <div>
                        <div className="font-bold text-white text-sm">{student.name}</div>
                        <div className="text-xs text-[#8e9bb4]">{student.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 font-mono text-xs">
                      <div>
                        <span className="text-[#8e9bb4] block text-[10px]">Số Lượt Chơi</span>
                        <span className="font-bold text-white">{student.gamesPlayed} Lượt</span>
                      </div>
                      <div>
                        <span className="text-[#8e9bb4] block text-[10px]">Tổng Điểm</span>
                        <span className="font-bold text-cyan-300">{student.totalScore} Pts</span>
                      </div>
                      <div>
                        <span className="text-[#8e9bb4] block text-[10px]">Coins Thưởng</span>
                        <span className="font-bold text-amber-300">+{student.totalCoins}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* TAB 4: Shop */}
        {activeTab === "shop" && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-cyan-400" /> Cửa Hàng Đổi Coin Lấy Vật Phẩm Trang Trí
              </h2>
              <span className="text-xs font-mono text-amber-300">
                Số Dư: {currentCoins} Coins
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {shopItems.map((item) => {
                const isOwned = userDecorations.includes(item.itemId || item.id);
                return (
                  <div
                    key={item.itemId || item.id}
                    className="p-5 rounded-2xl bg-[#0f1524]/80 backdrop-blur-md border border-[#7bd1fa]/15 flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-all shadow-xl text-center"
                  >
                    <div className="space-y-2">
                      <div className="w-16 h-16 mx-auto rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                        <Award className="w-8 h-8" />
                      </div>
                      <h3 className="font-bold text-white text-sm">{item.name}</h3>
                      <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                        {item.type}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-[#7bd1fa]/10 space-y-3">
                      <div className="text-sm font-bold font-mono text-amber-300 flex items-center justify-center gap-1">
                        <Coins className="w-4 h-4" /> {item.price} Coins
                      </div>

                      <button
                        onClick={() => handleBuyItem(item.itemId || item.id, item.price)}
                        disabled={isOwned || buyingItemId === (item.itemId || item.id)}
                        className={`w-full py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                          isOwned
                            ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                            : "bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                        }`}
                      >
                        {isOwned ? (
                          <span className="flex items-center justify-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Đã Sở Hữu
                          </span>
                        ) : (
                          "Mua Ngay"
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Modal Simulator for Running Game inside Iframe */}
        {selectedGameUrl && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-[#0f1524] rounded-2xl border border-cyan-500/40 p-6 space-y-4 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-cyan-400" /> {selectedGameTitle}
                </h3>
                <button
                  onClick={() => setSelectedGameUrl(null)}
                  className="text-slate-400 hover:text-white font-mono text-sm cursor-pointer"
                >
                  ✕ Đóng
                </button>
              </div>

              <div className="w-full h-96 bg-slate-950 rounded-xl flex flex-col items-center justify-center border border-slate-800 text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center animate-pulse">
                  <Gamepad2 className="w-8 h-8 text-cyan-300" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1">Mô Phỏng Trò Chơi Trắc Nghiệm 3D</h4>
                  <p className="text-xs text-slate-400 max-w-md">
                    Game Engine nạp dữ liệu câu hỏi từ bài học và truyền thông điệp kết quả lượt chơi qua window.postMessage().
                  </p>
                </div>

                <button
                  onClick={handleSimulateGameFinish}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-bold font-mono text-sm shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all cursor-pointer"
                >
                  🏆 Hoàn Thành Lượt Chơi & Nhận Coins
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
