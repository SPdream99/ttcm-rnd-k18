"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Gamepad2,
  Play,
  Search,
  Filter,
  Sparkles,
  BookOpen,
  Trophy,
  Flame,
  Zap,
  Layers,
  Swords,
  Cpu,
  HelpCircle,
  ArrowRight,
  X,
  CheckCircle2,
  Shuffle,
  ShieldCheck,
  Tag,
  Star,
  Users,
  Coins,
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Course, CourseContentPair } from "@/core/entities/Course";

// ── Standard Built-in Games Catalog ──
interface ArcadeGameItem {
  id: string;
  title: string;
  subtitle: string;
  genre: string;
  category: "quiz" | "memory" | "simulation" | "boss" | "custom";
  description: string;
  author: string;
  difficulty: "Dễ" | "Trung Bình" | "Thử Thách" | "Cao Cấp";
  rewardCoins: number;
  needExtraData: boolean; // Yêu cầu chọn Course để inject câu hỏi
  coursesAllowed?: string[] | "all";
  thumbnailUrl: string;
  badge?: string;
  rating: number;
  playsCount: number;
  tags: string[];
}

const DEFAULT_GAMES: ArcadeGameItem[] = [];

export default function StudentGamesArcadePage() {
  const router = useRouter();
  const { currentUser, profile } = useAuthAdapter();
  const studentCoins = currentUser?.coins ?? profile?.coins ?? 250;

  // Games & Courses State
  const [games, setGames] = useState<ArcadeGameItem[]>(DEFAULT_GAMES);
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [extraDataFilter, setExtraDataFilter] = useState<"all" | "dynamic" | "standalone">("all");

  // Course Selector Modal State
  const [selectedGameForPlay, setSelectedGameForPlay] = useState<ArcadeGameItem | null>(null);
  const [courseSearchTerm, setCourseSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Fetch Real Games & Real Courses from Firestore
  useEffect(() => {
    async function loadArcadeData() {
      try {
        setLoading(true);
        // Fetch custom/approved games from Firestore
        const gamesSnap = await getDocs(collection(db, "game_info"));
        let fetchedGames: ArcadeGameItem[] = [];

        if (!gamesSnap.empty) {
          fetchedGames = gamesSnap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              title: data.title || "Trò Chơi Giáo Dục",
              subtitle: data.subtitle || "Minigame Tương Tác Học Tập",
              genre: data.genre || (data.need_extra_data ? "Dynamic Quiz Game" : "Standalone Lab"),
              category: "custom",
              description: data.description || "Trò chơi học tập tích hợp ngân hàng câu hỏi.",
              author: Array.isArray(data.authors) ? data.authors.join(", ") : (data.authorName || "Giáo Viên E-V-E"),
              difficulty: "Trung Bình",
              rewardCoins: 50,
              needExtraData: Boolean(data.need_extra_data),
              coursesAllowed: data.courses_allowed || "all",
              thumbnailUrl:
                data.thumbnail_url ||
                "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80",
              badge: "CỘNG ĐỒNG 🌟",
              rating: 5.0,
              playsCount: Number(data.plays_count) || 0,
              tags: ["Giáo Trình", "Tương Tác"],
            };
          });
        }

        // Merge with local storage uploaded games
        try {
          if (typeof window !== "undefined") {
            const localGames = JSON.parse(localStorage.getItem("eve_uploaded_games") || "[]");
            localGames.forEach((lg: any) => {
              const existingIdx = fetchedGames.findIndex((g) => g.id === lg.id || g.title === lg.title);
              const formatted: ArcadeGameItem = {
                id: lg.id || lg.gameId,
                title: lg.title || "Trò Chơi Tương Tác",
                subtitle: lg.subtitle || "Minigame Tương Tác Học Tập",
                genre: lg.genre || (lg.needExtraData || lg.need_extra_data ? "Dynamic Quiz Game" : "Standalone Lab"),
                category: "custom",
                description: lg.description || "Trò chơi học tập tích hợp ngân hàng câu hỏi.",
                author: Array.isArray(lg.authors) ? lg.authors.join(", ") : (lg.authorName || "Giáo Viên"),
                difficulty: "Trung Bình",
                rewardCoins: 50,
                needExtraData: Boolean(lg.needExtraData ?? lg.need_extra_data),
                coursesAllowed: lg.coursesAllowed || lg.courses_allowed || "all",
                thumbnailUrl: lg.thumbnailUrl || lg.thumbnail_url || "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80",
                badge: (lg.isAccepted ?? lg.is_accepted) ? "ĐÃ DUYỆT ✅" : "CHỜ DUYỆT ⏳",
                rating: 5.0,
                playsCount: Number(lg.playsCount || lg.plays_count || 0),
                tags: ["Giáo Trình", "Tương Tác"],
              };

              if (existingIdx === -1) {
                fetchedGames.unshift(formatted);
              } else {
                fetchedGames[existingIdx] = { ...fetchedGames[existingIdx], ...formatted };
              }
            });
          }
        } catch {}

        // Merge without duplicating built-in games
        const existingIds = new Set(DEFAULT_GAMES.map((g) => g.id));
        const customUnique = fetchedGames.filter((g) => !existingIds.has(g.id));
        setGames([...DEFAULT_GAMES, ...customUnique]);

        // Fetch ONLY real courses from Firestore
        const coursesSnap = await getDocs(collection(db, "courses"));
        if (!coursesSnap.empty) {
          const realCourses = coursesSnap.docs.map((d) => {
            const data = d.data();
            const pairs = Array.isArray(data.content_data?.pairs)
              ? data.content_data.pairs
              : Array.isArray(data.contentData?.pairs)
              ? data.contentData.pairs
              : [];

            return {
              id: d.id,
              title: data.title || "Khóa Học E-V-E",
              authorName: data.author_name || data.authorName || "Giáo Viên",
              description: data.description || "Bài học tương tác kèm câu hỏi và giải thích.",
              pairsCount: pairs.length,
              tags: Array.isArray(data.tags) ? data.tags : ["Bài Học"],
            };
          });

          setCoursesList(realCourses);
        } else {
          setCoursesList([]);
        }
      } catch (err) {
        console.warn("Arcade load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadArcadeData();

    if (typeof window !== "undefined") {
      window.addEventListener("eve_games_updated", loadArcadeData);
      window.addEventListener("storage", loadArcadeData);
      return () => {
        window.removeEventListener("eve_games_updated", loadArcadeData);
        window.removeEventListener("storage", loadArcadeData);
      };
    }
  }, []);

  // Filtered Games
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      // Search
      const matchSearch =
        game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

      // Category
      const matchCategory =
        selectedCategory === "all" ||
        game.category === selectedCategory ||
        (selectedCategory === "dynamic" && game.needExtraData) ||
        (selectedCategory === "standalone" && !game.needExtraData);

      // Extra Data Mode
      const matchExtraData =
        extraDataFilter === "all" ||
        (extraDataFilter === "dynamic" && game.needExtraData) ||
        (extraDataFilter === "standalone" && !game.needExtraData);

      return matchSearch && matchCategory && matchExtraData;
    });
  }, [games, searchTerm, selectedCategory, extraDataFilter]);

  // Click on Game Card
  const handleSelectGame = (game: ArcadeGameItem) => {
    if (game.needExtraData) {
      // Game requires course data -> Open Course Selector Modal
      setSelectedGameForPlay(game);
      setCourseSearchTerm("");
      setIsModalOpen(true);
    } else {
      // Game is standalone -> Launch immediately with standalone route or default course
      const defaultCourse =
        Array.isArray(game.coursesAllowed) && game.coursesAllowed.length > 0
          ? game.coursesAllowed[0]
          : "crs_computer_hardware";
      router.push(`/student/play/${game.id}/${defaultCourse}`);
    }
  };

  // Launch Game with Selected Course
  const handleLaunchWithCourse = (courseId: string) => {
    if (!selectedGameForPlay) return;
    setIsModalOpen(false);
    router.push(`/student/play/${selectedGameForPlay.id}/${courseId}`);
  };

  // Quick Random Game Play
  const handleRandomPlay = () => {
    if (games.length === 0) return;
    const randomGame = games[Math.floor(Math.random() * games.length)];
    handleSelectGame(randomGame);
  };

  // Filtered courses for Modal
  const modalFilteredCourses = useMemo(() => {
    if (!selectedGameForPlay) return coursesList;

    return coursesList.filter((course) => {
      // Check if course is whitelisted
      if (
        selectedGameForPlay.coursesAllowed &&
        selectedGameForPlay.coursesAllowed !== "all" &&
        Array.isArray(selectedGameForPlay.coursesAllowed)
      ) {
        if (!selectedGameForPlay.coursesAllowed.includes(course.id)) {
          return false;
        }
      }

      // Search match
      if (!courseSearchTerm) return true;
      return (
        course.title.toLowerCase().includes(courseSearchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(courseSearchTerm.toLowerCase()) ||
        course.tags.some((t: string) => t.toLowerCase().includes(courseSearchTerm.toLowerCase()))
      );
    });
  }, [selectedGameForPlay, coursesList, courseSearchTerm]);

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-16">
      {/* ══════════════════════════════════════════════════════════════════════════
          1. HERO HEADER: E-V-E ARCADE KHO TRÒ CHƠI HỌC TẬP TƯƠNG TÁC
         ══════════════════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0b1329] via-[#0f172a] to-[#151336] border border-cyan-500/30 p-6 md:p-10 shadow-[0_0_50px_rgba(6,182,212,0.15)]">
        {/* Background Decorative Grid */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #06b6d4 1px, transparent 1px), linear-gradient(to bottom, #06b6d4 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Gamepad2 className="w-4 h-4 text-cyan-400" />
                E-V-E ARCADE CENTER
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Tự Do Lựa Chọn Khóa Học
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
              Kho Trò Chơi Giáo Dục &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                Thực Chiến Kiến Thức
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Khám phá toàn bộ hệ sinh thái Game Engine tương tác. Bạn có thể chọn bất kỳ trò chơi nào mình yêu thích,
              chọn bài học để hệ thống **tự động nạp bộ câu hỏi & đáp án (JSON Pairs)** và chinh phục đỉnh cao bảng xếp hạng!
            </p>
          </div>

          {/* Quick Stats & Action Button */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#151b2c]/80 border border-slate-800 text-center">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Tổng Trò Chơi</div>
                <div className="text-xl font-bold font-mono text-cyan-300">{games.length} Games</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#151b2c]/80 border border-slate-800 text-center">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Khóa Học Sẵn Sàng</div>
                <div className="text-xl font-bold font-mono text-emerald-300">{coursesList.length} Chủ Đề</div>
              </div>
            </div>

            <button
              onClick={handleRandomPlay}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-mono font-bold text-xs shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <Shuffle className="w-4 h-4" />
              <span>Chơi Ngẫu Nhiên Một Game 🎲</span>
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          2. FILTER TABS & REAL-TIME SEARCH BAR
         ══════════════════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm trò chơi theo tên, thể loại, từ khóa..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0f1524] border border-slate-800 focus:border-cyan-500/60 text-xs text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Extra Data Mode Filter (Dynamic vs Standalone) */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0f1524] border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setExtraDataFilter("all")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold ${
                extraDataFilter === "all"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Tất Cả
            </button>
            <button
              onClick={() => setExtraDataFilter("dynamic")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 font-semibold ${
                extraDataFilter === "dynamic"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Các game nhận câu hỏi từ khóa học"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Nhận Khóa Học
            </button>
            <button
              onClick={() => setExtraDataFilter("standalone")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 font-semibold ${
                extraDataFilter === "standalone"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Các game mô phỏng / thực hành độc lập"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" /> Chơi Độc Lập
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono scrollbar-none">
          {[
            { id: "all", label: "🌟 Tất Cả", icon: Gamepad2 },
            { id: "boss", label: "⚔️ Đấu Trùm Boss", icon: Swords },
            { id: "quiz", label: "🚀 Trắc Nghiệm Tốc Độ", icon: Zap },
            { id: "memory", label: "🃏 Luyện Trí Nhớ", icon: Sparkles },
            { id: "simulation", label: "💻 Mô Phỏng Phần Cứng", icon: Cpu },
            { id: "custom", label: "🌐 Game Cộng Đồng", icon: Users },
          ].map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer font-bold border ${
                  active
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                    : "bg-[#151b2c] text-slate-400 border-slate-800 hover:text-white hover:border-slate-700"
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          3. ARCADE GAME CARDS GRID
         ══════════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredGames.map((game, idx) => (
          <div
            key={`${game.id || idx}_${idx}`}
            className="rounded-3xl bg-[#0f1524]/90 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] hover:-translate-y-1"
          >
            {/* Card Header & Thumbnail */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-900">
              <img
                src={game.thumbnailUrl}
                alt={game.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f1524] via-[#0f1524]/40 to-transparent" />

              {/* Top Badges Overlay */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-cyan-500/30 text-[10px] font-mono font-bold text-cyan-300 flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {game.rating}
                </span>

                {game.badge && (
                  <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-600/80 to-pink-600/80 backdrop-blur-md border border-purple-400/40 text-[10px] font-mono font-black text-white shadow-lg">
                    {game.badge}
                  </span>
                )}
              </div>

              {/* Extra Data Support Indicator */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                {game.needExtraData ? (
                  <span className="px-2.5 py-0.5 rounded-lg bg-cyan-950/80 backdrop-blur-md border border-cyan-400/40 text-[11px] font-mono font-bold text-cyan-300 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" /> Nhận Câu Hỏi Khóa Học
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-lg bg-emerald-950/80 backdrop-blur-md border border-emerald-400/40 text-[11px] font-mono font-bold text-emerald-300 flex items-center gap-1">
                    <Layers className="w-3 h-3 text-emerald-400" /> Mô Phỏng Độc Lập
                  </span>
                )}

                <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-[11px] font-mono font-bold text-amber-300">
                  +{game.rewardCoins} 🪙
                </span>
              </div>
            </div>

            {/* Card Body Information */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-[11px] font-mono text-purple-400 font-bold uppercase tracking-wider">
                  {game.genre}
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {game.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {game.description}
                </p>
              </div>

              {/* Tags & Metadata */}
              <div className="space-y-3 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Tác giả: <strong className="text-slate-300">{game.author.split("&")[0]}</strong></span>
                  <span>Lượt chơi: <strong className="text-cyan-400">{game.playsCount.toLocaleString()}</strong></span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {game.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-[#151b2c] border border-slate-800 text-[10px] font-mono text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Main Action Button */}
                <button
                  onClick={() => handleSelectGame(game)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-mono font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{game.needExtraData ? "Chọn Khóa Học & Bắt Đầu Chơi" : "Vào Chơi Trực Tiếp"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredGames.length === 0 && (
        <div className="p-12 rounded-3xl bg-[#0f1524] border border-slate-800 text-center space-y-3 max-w-md mx-auto">
          <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">Không tìm thấy trò chơi phù hợp</h3>
          <p className="text-xs text-slate-400">
            Hãy thử tìm kiếm với từ khóa khác hoặc chuyển bộ lọc về "Tất Cả".
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
              setExtraDataFilter("all");
            }}
            className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold cursor-pointer"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          4. COURSE SELECTION MODAL (POPUP CHỌN BÀI HỌC KHI GAME CẦN EXTRA DATA)
         ══════════════════════════════════════════════════════════════════════════ */}
      {isModalOpen && selectedGameForPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-[#0d1220] border border-cyan-500/40 p-6 md:p-8 shadow-[0_0_50px_rgba(6,182,212,0.3)] space-y-6 relative max-h-[90vh] flex flex-col justify-between">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="text-[11px] font-mono text-cyan-400 font-bold uppercase flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Tự động inject dữ liệu câu hỏi (JSON Pairs)
                </div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  Chọn Khóa Học Cho Trò Chơi:
                </h3>
                <div className="font-mono text-sm text-cyan-300 font-black">
                  🎮 {selectedGameForPlay.title}
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-[#151b2c] hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Course Search in Modal */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={courseSearchTerm}
                onChange={(e) => setCourseSearchTerm(e.target.value)}
                placeholder="Tìm khóa học để nạp vào game..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#151b2c] border border-slate-700 focus:border-cyan-400 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Courses List */}
            <div className="space-y-3 overflow-y-auto pr-1 flex-1 max-h-[360px] scrollbar-thin scrollbar-thumb-cyan-500/20">
              {modalFilteredCourses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => handleLaunchWithCourse(course.id)}
                  className="p-4 rounded-2xl bg-[#151b2c]/80 hover:bg-[#1a233a] border border-slate-800 hover:border-cyan-500/50 transition-all flex items-center justify-between gap-4 cursor-pointer group shadow-md"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-[10px] font-mono font-bold text-cyan-300">
                        {course.pairsCount} Cặp câu hỏi & giải thích
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        👨‍🏫 {course.authorName}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                      {course.title}
                    </h4>

                    <p className="text-xs text-slate-400 line-clamp-1">
                      {course.description}
                    </p>
                  </div>

                  <button className="px-4 py-2.5 rounded-xl bg-cyan-500/20 group-hover:bg-cyan-500 text-cyan-300 group-hover:text-black font-mono font-bold text-xs border border-cyan-500/40 transition-all shrink-0 flex items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                    <span>Chọn Bài Này</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {modalFilteredCourses.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs font-mono">
                  Không tìm thấy khóa học nào phù hợp với từ khóa.
                </div>
              )}
            </div>

            {/* Modal Footer Note */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Mỗi câu hỏi hoàn thành sẽ được cộng điểm trực tiếp vào hồ sơ.
              </span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white underline cursor-pointer"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
