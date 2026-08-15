"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Gamepad2,
  Play,
  Search,
  BookOpen,
  Zap,
  Layers,
  Swords,
  Cpu,
  ArrowRight,
  X,
  Shuffle,
  ShieldCheck,
  Star,
  Users,
  Coins,
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
  needExtraData: boolean;
  coursesAllowed?: string[] | "all";
  thumbnailUrl: string;
  badge?: string;
  rating: number;
  playsCount: number;
  tags: string[];
}

export default function StudentGamesArcadePage() {
  const router = useRouter();
  const { currentUser, profile } = useAuthAdapter();
  const studentCoins = currentUser?.coins ?? profile?.coins ?? 250;

  const [games, setGames] = useState<ArcadeGameItem[]>([]);
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [extraDataFilter, setExtraDataFilter] = useState<"all" | "dynamic" | "standalone">("all");

  const [selectedGameForPlay, setSelectedGameForPlay] = useState<ArcadeGameItem | null>(null);
  const [courseSearchTerm, setCourseSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadArcadeData() {
      try {
        setLoading(true);
        const gamesSnap = await getDocs(collection(db, "game_info"));
        let fetchedGames: ArcadeGameItem[] = [];

        // Built-in standard games
        fetchedGames.push({
          id: "game_card_match_vr",
          title: "Memory Matching Game (Lật Thẻ Trí Nhớ) ",
          subtitle: "Rèn luyện trí nhớ và liên kết thuật ngữ 3D",
          genre: "Game Trí Nhớ 3D",
          category: "memory",
          description: "Lật và ghép đúng các cặp thuật ngữ lập trình và giải thích trước khi hết thời gian.",
          author: "E-V-E Studio",
          difficulty: "Trung Bình",
          rewardCoins: 50,
          needExtraData: true,
          coursesAllowed: "all",
          thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
          badge: "NỔI BẬT",
          rating: 4.9,
          playsCount: 1420,
          tags: ["Memory", "Flashcards", "Logic"],
        });

        fetchedGames.push({
          id: "boss_battle_quiz",
          title: "Boss Slayer Marathon Quiz ",
          subtitle: "Đấu trùm trắc nghiệm phản xạ kiến thức",
          genre: "Trắc Nghiệm Phản Xạ",
          category: "boss",
          description: "Mỗi câu trả lời đúng sẽ giáng một đòn chí mạng vào Boss quái vật. Hỗ trợ mọi khóa học!",
          author: "E-V-E Dev Team",
          difficulty: "Thử Thách",
          rewardCoins: 60,
          needExtraData: true,
          coursesAllowed: "all",
          thumbnailUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80",
          badge: "HOT ",
          rating: 4.8,
          playsCount: 2350,
          tags: ["Boss Battle", "Quiz", "Speed"],
        });

        if (!gamesSnap.empty) {
          gamesSnap.docs.forEach((d) => {
            const data = d.data();
            if (data.status === "approved" || data.status === "active") {
              fetchedGames.push({
                id: d.id,
                title: data.name || data.title || "Minigame",
                subtitle: data.subtitle || "Minigame Giáo Dục",
                genre: data.genre || "HTML5 Game",
                category: "custom",
                description: data.description || "Trò chơi học tập tương tác.",
                author: data.authorName || "Giáo Viên E-V-E",
                difficulty: "Trung Bình",
                rewardCoins: 50,
                needExtraData: Boolean(data.need_extra_data),
                coursesAllowed: data.courses_allowed || "all",
                thumbnailUrl: data.thumbnailUrl || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80",
                rating: 4.7,
                playsCount: 420,
                tags: ["Custom", "HTML5"],
              });
            }
          });
        }

        setGames(fetchedGames);

        // Fetch courses for modal
        const coursesSnap = await getDocs(collection(db, "courses"));
        const cl: any[] = [];
        coursesSnap.docs.forEach((d) => {
          const cd = d.data();
          cl.push({
            id: d.id,
            title: cd.title || d.id,
            description: cd.description || "",
            pairsCount: Array.isArray(cd.pairs) ? cd.pairs.length : 10,
            authorName: cd.authorName || "Giảng viên",
            tags: Array.isArray(cd.tags) ? cd.tags : ["Lập trình"],
          });
        });

        if (cl.length === 0) {
          cl.push({
            id: "crs_python_foundation",
            title: "Lập Trình Python Cơ Bản",
            description: "Biến, kiểu dữ liệu, vòng lặp và câu lệnh rẽ nhánh trong Python.",
            pairsCount: 12,
            authorName: "ThS. Nguyễn Nhật Anh",
            tags: ["Python", "Cơ bản"],
          });
          cl.push({
            id: "crs_data_structures",
            title: "Cấu Trúc Dữ Liệu & Giải Thuật",
            description: "Mảng, danh sách liên kết, cây nhị phân và đồ thị.",
            pairsCount: 15,
            authorName: "ThS. Nguyễn Thành Đạt",
            tags: ["Thuật toán", "DSA"],
          });
        }

        setCoursesList(cl);
      } catch (e) {
        console.error("Lỗi khi nạp danh sách Arcade:", e);
      } finally {
        setLoading(false);
      }
    }

    loadArcadeData();
  }, []);

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchSearch =
        !searchTerm ||
        game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.genre.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory =
        selectedCategory === "all" ||
        game.category === selectedCategory;

      const matchExtraData =
        extraDataFilter === "all" ||
        (extraDataFilter === "dynamic" && game.needExtraData) ||
        (extraDataFilter === "standalone" && !game.needExtraData);

      return matchSearch && matchCategory && matchExtraData;
    });
  }, [games, searchTerm, selectedCategory, extraDataFilter]);

  const handleSelectGame = (game: ArcadeGameItem) => {
    if (game.needExtraData) {
      setSelectedGameForPlay(game);
      setCourseSearchTerm("");
      setIsModalOpen(true);
    } else {
      router.push(`/student/play/${game.id}/default`);
    }
  };

  const handleLaunchWithCourse = (courseId: string) => {
    if (!selectedGameForPlay) return;
    setIsModalOpen(false);
    router.push(`/student/play/${selectedGameForPlay.id}/${courseId}`);
  };

  const handleRandomPlay = () => {
    if (games.length === 0) return;
    const randomGame = games[Math.floor(Math.random() * games.length)];
    handleSelectGame(randomGame);
  };

  const modalFilteredCourses = useMemo(() => {
    return coursesList.filter((c) => {
      if (!courseSearchTerm) return true;
      return (
        c.title.toLowerCase().includes(courseSearchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(courseSearchTerm.toLowerCase())
      );
    });
  }, [coursesList, courseSearchTerm]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 rounded-full border-4 border-zinc-200 border-t-red-600 animate-spin" />
        <p className="text-red-600 font-bold text-sm">Đang nạp kho Minigame...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans pb-16">
      {/* ================= HERO (RED & WHITE, NO GRADIENT) ================= */}
      <div className="rounded-2xl border-2 border-red-600 bg-white p-6 md:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold flex items-center gap-1.5">
                <Gamepad2 className="w-4 h-4 text-red-600" /> KHO MINIGAME TƯƠNG TÁC
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">
              Đấu Trường Minigame & <span className="text-red-600">Thực Chiến Kiến Thức</span>
            </h1>

            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Trải nghiệm học tập qua trò chơi tương tác. Tự động nạp bộ câu hỏi theo từng khóa học và tích lũy Coins để đổi thưởng.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-center justify-around">
              <div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase block">Tổng Games</span>
                <span className="text-lg font-black text-zinc-900 font-mono">{games.length} Games</span>
              </div>
              <div className="w-[1px] h-8 bg-zinc-200" />
              <div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase block">Số Dư Coins</span>
                <span className="text-lg font-black text-red-600 font-mono">{studentCoins} </span>
              </div>
            </div>

            <button
              onClick={handleRandomPlay}
              className="py-3 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <Shuffle className="w-4 h-4" />
              <span>Chơi Ngẫu Nhiên Một Game </span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= CONTROLS & FILTER ================= */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm trò chơi theo tên, thể loại..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border-2 border-zinc-200 focus:border-red-600 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100 border border-zinc-200 text-xs">
            <button
              onClick={() => setExtraDataFilter("all")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-bold ${
                extraDataFilter === "all" ? "bg-red-600 text-white" : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Tất Cả
            </button>
            <button
              onClick={() => setExtraDataFilter("dynamic")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-bold ${
                extraDataFilter === "dynamic" ? "bg-red-600 text-white" : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Nhận Khóa Học
            </button>
            <button
              onClick={() => setExtraDataFilter("standalone")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-bold ${
                extraDataFilter === "standalone" ? "bg-red-600 text-white" : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Chơi Độc Lập
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {[
            { id: "all", label: " Tất Cả" },
            { id: "boss", label: " Đấu Trùm Boss" },
            { id: "memory", label: "🃏 Luyện Trí Nhớ" },
            { id: "custom", label: " Game Cộng Đồng" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer font-bold ${
                selectedCategory === cat.id
                  ? "bg-red-600 text-white"
                  : "bg-white text-zinc-700 border border-zinc-200 hover:border-red-300"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ================= GAME CARDS GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            className="rounded-2xl bg-white border border-zinc-200 hover:border-red-600 transition-all flex flex-col justify-between overflow-hidden shadow-sm group"
          >
            {/* Thumbnail */}
            <div className="relative h-44 w-full overflow-hidden bg-zinc-100">
              <img
                src={game.thumbnailUrl}
                alt={game.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-full bg-white/90 border border-zinc-200 text-[10px] font-bold text-zinc-900 flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {game.rating}
                </span>
                {game.badge && (
                  <span className="px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-bold shadow-sm">
                    {game.badge}
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                  {game.genre}
                </div>
                <h3 className="text-base font-bold text-zinc-900 group-hover:text-red-600 transition-colors line-clamp-1">
                  {game.title}
                </h3>
                <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                  {game.description}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-zinc-100">
                <div className="flex items-center justify-between text-[11px] text-zinc-500 font-medium">
                  <span>Tác giả: <strong className="text-zinc-800">{game.author}</strong></span>
                  <span className="text-red-600 font-bold">+{game.rewardCoins} Coins</span>
                </div>

                <button
                  onClick={() => handleSelectGame(game)}
                  className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{game.needExtraData ? "Chọn Khóa Học & Bắt Đầu" : "Chơi Ngay"}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= COURSE SELECTION MODAL ================= */}
      {isModalOpen && selectedGameForPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-xl rounded-2xl bg-white border-2 border-red-600 p-6 shadow-2xl space-y-5 max-h-[85vh] flex flex-col justify-between">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-zinc-200">
              <div>
                <span className="text-[10px] text-red-600 font-bold uppercase block">Nạp dữ liệu khóa học</span>
                <h3 className="text-lg font-bold text-zinc-900">
                  Chọn Khóa Học Cho {selectedGameForPlay.title}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-zinc-100 text-zinc-600 hover:text-zinc-900 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={courseSearchTerm}
                onChange={(e) => setCourseSearchTerm(e.target.value)}
                placeholder="Tìm khóa học..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-red-600 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none"
              />
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-[300px] pr-1">
              {modalFilteredCourses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => handleLaunchWithCourse(course.id)}
                  className="p-3.5 rounded-xl bg-zinc-50 hover:bg-red-50 border border-zinc-200 hover:border-red-400 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 group-hover:text-red-600 transition-colors">
                      {course.title}
                    </h4>
                    <p className="text-[11px] text-zinc-500 line-clamp-1">{course.description}</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-[11px] font-bold shrink-0">
                    Chọn Bài Này
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-zinc-200 text-right">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
