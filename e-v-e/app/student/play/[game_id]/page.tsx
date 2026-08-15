"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  Gamepad2,
  BookOpen,
  ArrowLeft,
  Play,
  Lock,
  Sparkles,
} from "lucide-react";
import { collection, getDocs, query, where, getDoc, doc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface GameLobbyProps {
  params: Promise<{
    game_id: string;
  }>;
}

const GAME_CATALOG: Record<
  string,
  {
    title: string;
    subtitle: string;
    category: string;
    description: string;
    author: string;
  }
> = {
  game_card_match_vr: {
    title: "Ghép Cặp Thẻ Bài Thuật Toán (Memory Match)",
    subtitle: "Luyện Trí Nhớ & Khắc Sâu Định Nghĩa",
    category: "Memory Card Matrix",
    description: "Trò chơi lật thẻ bài: Tìm và ghép đôi thẻ chứa Khái niệm với thẻ chứa Định nghĩa tương ứng của bài học.",
    author: "TS. Lê Thị Mai",
  },
  boss_battle_quiz: {
    title: "Boss Slayer Marathon Quiz",
    subtitle: "Đấu trùm trắc nghiệm phản xạ kiến thức",
    category: "Boss Battle Quiz",
    description: "Mỗi câu trả lời đúng sẽ giáng một đòn chí mạng vào Boss quái vật. Hỗ trợ mọi khóa học!",
    author: "E-V-E Dev Team",
  },
};

export default function GameLobbyPage({ params }: GameLobbyProps) {
  const resolvedParams = use(params);
  const { game_id: gameId } = resolvedParams;

  const [activeCourses, setActiveCourses] = useState<Array<{ id: string; title: string; description: string }>>([]);
  const [loading, setLoading] = useState(true);

  const gameInfo = GAME_CATALOG[gameId] || {
    title: gameId.replace(/_/g, " ").toUpperCase(),
    subtitle: "Minigame Tương Tác Học Tập",
    category: "Interactive Minigame",
    description: "Minigame giáo dục trực quan, tương tác học liệu và củng cố kiến thức theo từng bài học.",
    author: "Giảng Viên E-V-E",
  };

  useEffect(() => {
    async function loadActiveCourses() {
      try {
        setLoading(true);
        const user = auth.currentUser;
        if (!user) {
          setActiveCourses([]);
          return;
        }

        const enSnap = await getDocs(
          query(collection(db, "student_learning_path"), where("student_id", "==", user.uid))
        );

        const activeCourseIds = new Set<string>();
        for (const d of enSnap.docs) {
          const data = d.data();
          if (data.status === "active") {
            const lpDoc = await getDoc(doc(db, "learning_path", data.learning_path_id));
            if (lpDoc.exists()) {
              const cList = lpDoc.data().courses || [];
              cList.forEach((cId: string) => activeCourseIds.add(cId));
            }
          }
        }

        const coursesSnap = await getDocs(collection(db, "courses"));
        const list: Array<{ id: string; title: string; description: string }> = [];
        coursesSnap.docs.forEach((d) => {
          if (activeCourseIds.has(d.id)) {
            const data = d.data();
            list.push({
              id: d.id,
              title: data.title || d.id,
              description: data.description || "Nội dung bài học và học liệu tương tác.",
            });
          }
        });

        setActiveCourses(list);
      } catch (err) {
        console.error("Lỗi khi tải danh sách khóa học active cho game:", err);
      } finally {
        setLoading(false);
      }
    }

    loadActiveCourses();
  }, [gameId]);

  return (
    <div className="space-y-8 font-sans pb-12">
      {/* Header Bar */}
      <div className="flex items-center gap-3 pb-6 border-b-2 border-zinc-200">
        <Link
          href="/student/games"
          className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-900 transition-colors cursor-pointer border border-zinc-200"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="text-xs text-red-600 uppercase font-bold flex items-center gap-1.5">
            <Gamepad2 className="w-3.5 h-3.5" /> Thông Tin Trò Chơi
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight mt-1">
            {gameInfo.title}
          </h1>
        </div>
      </div>

      {/* Main Showcase Hero */}
      <div className="p-6 md:p-8 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-5">
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
              {gameInfo.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-bold">
              {activeCourses.length} Khóa Học Hợp Lệ Đang Học
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-zinc-900">{gameInfo.subtitle}</h2>
          <p className="text-sm text-zinc-600 leading-relaxed">{gameInfo.description}</p>
          <div className="text-xs text-zinc-500">
            Tác giả: <strong className="text-zinc-900">{gameInfo.author}</strong>
          </div>
        </div>

        {activeCourses.length > 0 && (
          <div className="pt-2 flex items-center gap-4">
            <Link href={`/student/play/${gameId}/${activeCourses[0].id}`}>
              <button className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer flex items-center gap-2">
                <Play className="w-4 h-4" /> Vào Chơi Khóa Đầu Tiên →
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Compatible Courses Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-red-600" /> Chọn Khóa Học Đang Hoạt Động Để Trải Nghiệm
        </h3>

        {loading ? (
          <div className="p-8 text-center text-xs text-zinc-400">Đang tải danh sách bài học khả dụng...</div>
        ) : activeCourses.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white border border-zinc-200 space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-zinc-900">
                Bạn chưa có khóa học nào đang hoạt động
              </h4>
              <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
                Để chơi game với dữ liệu bài học, bạn cần tham gia một lớp học và lộ trình ở trạng thái đang học (không tạm dừng/bảo lưu).
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <Link href="/student/learning-paths">
                <button className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-sm cursor-pointer">
                  Khám Phá Lộ Trình Học Tập
                </button>
              </Link>
              <Link href="/student/classes">
                <button className="px-5 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold transition border border-zinc-200 cursor-pointer">
                  Lớp Học Của Tôi
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeCourses.map((crs) => (
              <div
                key={crs.id}
                className="p-5 rounded-2xl bg-white border border-zinc-200 hover:border-red-600 transition-colors flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-red-50 border border-red-200 text-[10px] font-bold text-red-700">
                      Đang Học
                    </span>
                    <span className="text-xs text-amber-600 font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> +100 Coins
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-zinc-900">{crs.title}</h4>
                  <p className="text-xs text-zinc-500 line-clamp-2">{crs.description}</p>
                </div>

                <Link href={`/student/play/${gameId}/${crs.id}`}>
                  <button className="w-full py-2.5 rounded-xl bg-zinc-100 hover:bg-red-600 text-zinc-800 hover:text-white text-xs font-bold border border-zinc-200 hover:border-red-600 transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                    <Play className="w-3.5 h-3.5" /> Bắt Đầu Chơi Khóa Này →
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
