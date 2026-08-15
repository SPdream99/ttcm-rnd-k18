"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Crown,
  Search,
  X,
  Layers,
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { cacheService } from "@/lib/cacheService";

export default function StudentDashboardPage() {
  const router = useRouter();
  const { currentUser, profile } = useAuthAdapter();
  const displayName = currentUser?.name || currentUser?.displayName || profile?.fullName || "Học Viên E-V-E";
  const displayCoins = currentUser?.coins ?? profile?.coins ?? 450;

  const [enrolledClasses, setEnrolledClasses] = useState<any[]>([]);
  const [availableGames, setAvailableGames] = useState<any[]>([]);
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [topRankings, setTopRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State for Extra Data Selection
  const [selectedGameForPlay, setSelectedGameForPlay] = useState<any | null>(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [courseSearch, setCourseSearch] = useState("");

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
            const seenPathIds = new Set<string>();

            for (const docItem of enrollSnap.docs) {
              const eData = docItem.data();
              // Lớp học đang tạm dừng/bảo lưu thì KHÔNG hiển thị ở Dashboard
              if (eData.status === "paused") {
                continue;
              }
              const pathId = eData.learning_path_id;
              if (seenPathIds.has(pathId)) {
                continue;
              }
              seenPathIds.add(pathId);

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
                  teacherName: pData.authorName || pData.teacherName || "ThS. Nguyễn Thành Đạt",
                });
              }
            }
            if (classesData.length === 0 && enrollSnap.empty) {
              // Fallback fetch all active learning paths ONLY if student has zero enrollments
              const allPathsSnap = await getDocs(collection(db, "learning_path"));
              allPathsSnap.docs.forEach((d) => {
                const pData = d.data();
                classesData.push({
                  id: d.id,
                  title: pData.title || "Lộ trình học",
                  description: pData.description || "",
                  progress: 60,
                  coursesCount: pData.courses?.length || 3,
                  category: pData.category || "Công nghệ & Lập trình",
                  teacherName: "ThS. Nguyễn Thành Đạt",
                });
              });
            }
            setEnrolledClasses(classesData);
          } catch (e) {
            console.error("Lỗi khi tải thông tin lớp học:", e);
          }
        }

        // 2. Fetch Courses List for extra data injection
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
          cl.push(
            {
              id: "crs_python_foundation",
              title: "Lập Trình Python Cơ Bản",
              description: "Biến, kiểu dữ liệu, vòng lặp và câu lệnh rẽ nhánh trong Python.",
              pairsCount: 12,
              authorName: "ThS. Nguyễn Nhật Anh",
              tags: ["Python", "Cơ bản"],
            },
            {
              id: "crs_data_structures",
              title: "Cấu Trúc Dữ Liệu & Giải Thuật",
              description: "Mảng, danh sách liên kết, cây nhị phân và đồ thị.",
              pairsCount: 15,
              authorName: "ThS. Nguyễn Thành Đạt",
              tags: ["Thuật toán", "DSA"],
            }
          );
        }
        setCoursesList(cl);

        // 3. Fetch Games List from Firestore
        const gamesSnap = await getDocs(collection(db, "game_info"));
        let gamesList: any[] = [];

        gamesSnap.docs.forEach((d) => {
          const data = d.data();
          const needExtraData = data.needExtraData !== false;
          gamesList.push({
            id: d.id,
            title: data.title || data.name || "Minigame Giáo Dục",
            courseName: data.subtitle || data.description || "Thực hành tương tác",
            genre: data.genre || "Minigame",
            reward: `+${data.rewardCoins || 50} Coins`,
            badge: data.badge || "HOT",
            needExtraData,
          });
        });

        if (gamesList.length === 0) {
          gamesList = [
            {
              id: "game_card_match_vr",
              title: "Memory Matching Game",
              courseName: "Lật Thẻ Trí Nhớ & Khái Niệm",
              genre: "Game Trí Nhớ 3D",
              reward: "+50 Coins",
              badge: "NỔI BẬT",
              needExtraData: true,
            },
            {
              id: "boss_battle_quiz",
              title: "Boss Slayer Marathon Quiz",
              courseName: "Giải Đố Phản Xạ Đấu Trùm",
              genre: "Trắc Nghiệm Phản Xạ",
              reward: "+60 Coins",
              badge: "THỬ THÁCH",
              needExtraData: true,
            },
          ];
        }

        setAvailableGames(gamesList.slice(0, 3));

        // 4. Fetch Real Top Rankings from Users
        const userSnap = await getDocs(collection(db, "users"));
        const students = userSnap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((u: any) => u.role === "student" || (!u.role && u.email))
          .map((u: any, idx: number) => ({
            rank: idx + 1,
            name: u.name || u.displayName || u.email || "Học Viên",
            points: Number(u.score) || (Number(u.coins) ? Number(u.coins) * 3 : 250),
            badge: idx === 0 ? "Thủ Khoa" : idx === 1 ? "Á Khoa" : "Ưu Tú",
            title: "Học Viên Tiêu Biểu",
          }))
          .sort((a, b) => b.points - a.points);

        setTopRankings(students.slice(0, 3));
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const handleLaunchGame = (game: any) => {
    if (game.needExtraData) {
      setSelectedGameForPlay(game);
      setCourseSearch("");
      setIsCourseModalOpen(true);
    } else {
      router.push(`/student/play/${game.id}/default`);
    }
  };

  const handleSelectCourseToPlay = (courseId: string) => {
    if (!selectedGameForPlay) return;
    setIsCourseModalOpen(false);
    router.push(`/student/play/${selectedGameForPlay.id}/${courseId}`);
  };

  const filteredCourses = coursesList.filter((c) => {
    if (!courseSearch.trim()) return true;
    const q = courseSearch.toLowerCase();
    return c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
  });

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
            href="/student/classes"
            className="text-xs md:text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-zinc-200">
            <div className="w-8 h-8 rounded-full border-2 border-red-600 border-t-transparent animate-spin mx-auto mb-2" />
            <p className="text-xs text-zinc-500">Đang tải lớp học...</p>
          </div>
        ) : enrolledClasses.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-zinc-300">
            <p className="text-sm font-bold text-zinc-700 mb-2">Bạn chưa tham gia lớp học nào</p>
            <Link
              href="/student/learning-paths"
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors"
            >
              <PlusCircle className="w-4 h-4" /> Khám Phá Lộ Trình Mới
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {enrolledClasses.map((cls, idx) => (
              <div
                key={`${cls.id}_${idx}`}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4 hover:border-red-600 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-[10px] font-bold border border-red-200">
                      {cls.category}
                    </span>
                    <span className="text-xs font-bold text-zinc-900 font-mono">{cls.progress}%</span>
                  </div>
                  <h3 className="font-bold text-base text-zinc-900 line-clamp-1">{cls.title}</h3>
                  <p className="text-xs text-zinc-500 line-clamp-2">{cls.description}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-zinc-100">
                  <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-red-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${cls.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500 font-medium">GV: {cls.teacherName}</span>
                    <Link
                      href={`/student/learning-paths/${cls.id}`}
                      className="font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      Học tiếp <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= PHẦN 2: MINIGAME GIÁO DỤC NỔI BẬT ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-red-600" />
            <h2 className="text-lg md:text-xl font-bold text-zinc-900 tracking-tight">
              Minigame Giáo Dục Nổi Bật ({availableGames.length})
            </h2>
          </div>
          <Link
            href="/student/games"
            className="text-xs md:text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            Xem tất cả game <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {availableGames.map((game) => (
            <div
              key={game.id}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4 hover:border-red-600 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-[10px] font-bold border border-red-200">
                    {game.badge}
                  </span>
                  <span className="text-xs font-bold text-amber-600">{game.reward}</span>
                </div>
                <h3 className="font-bold text-base text-zinc-900">{game.title}</h3>
                <p className="text-xs text-zinc-500 line-clamp-2">{game.courseName}</p>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-xs text-zinc-500">{game.genre}</span>
                <button
                  onClick={() => handleLaunchGame(game)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-white" />
                  <span>{game.needExtraData ? "Chọn Khóa Học & Chơi" : "Chơi Ngay"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= PHẦN 3: BẢNG VINH DANH ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-red-600" />
            <h2 className="text-lg md:text-xl font-bold text-zinc-900 tracking-tight">
              Top Học Viên Tiêu Biểu
            </h2>
          </div>
          <Link
            href="/student/leaderboard"
            className="text-xs md:text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            Bảng xếp hạng đầy đủ <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {topRankings.map((rk) => (
            <div
              key={rk.rank}
              className={`p-5 rounded-2xl bg-white border-2 shadow-sm space-y-3 flex flex-col justify-between ${
                rk.rank === 1
                  ? "border-amber-400 bg-amber-50/20"
                  : rk.rank === 2
                  ? "border-zinc-300"
                  : "border-red-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-red-50 text-red-700 border border-red-200 flex items-center justify-center font-bold text-xs font-mono">
                  #{rk.rank}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 text-[10px] font-bold border border-zinc-200">
                  {rk.badge}
                </span>
              </div>
              <div>
                <h4 className="font-black text-base text-zinc-900">{rk.name}</h4>
                <p className="text-xs text-zinc-500">{rk.title}</p>
              </div>
              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="text-zinc-500">Điểm xếp hạng:</span>
                <strong className="text-red-600 font-mono font-bold">{rk.points.toLocaleString()} pts</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= MODAL CHỌN KHÓA HỌC CHO MINIGAME ================= */}
      {isCourseModalOpen && selectedGameForPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-xl rounded-2xl bg-white border-2 border-red-600 p-6 shadow-2xl space-y-5 max-h-[85vh] flex flex-col justify-between animate-in fade-in zoom-in duration-150">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-zinc-200">
              <div>
                <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider block">
                  Nạp câu hỏi & học liệu bài giảng
                </span>
                <h3 className="text-lg font-bold text-zinc-900 mt-0.5">
                  Chọn Khóa Học Cho &ldquo;{selectedGameForPlay.title}&rdquo;
                </h3>
              </div>
              <button
                onClick={() => setIsCourseModalOpen(false)}
                className="p-1.5 rounded-lg bg-zinc-100 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed">
              Trò chơi này yêu cầu nạp bộ câu hỏi / thuật ngữ từ bài học để tính điểm và tạo màn chơi tương tác. Hãy chọn một khóa học bên dưới:
            </p>

            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                placeholder="Tìm tên khóa học hoặc chủ đề..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-red-600 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none"
              />
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-[280px] pr-1">
              {filteredCourses.length === 0 ? (
                <div className="py-8 text-center text-xs text-zinc-500">
                  Không tìm thấy khóa học phù hợp với từ khóa.
                </div>
              ) : (
                filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => handleSelectCourseToPlay(course.id)}
                    className="p-3.5 rounded-xl bg-zinc-50 hover:bg-red-50 border border-zinc-200 hover:border-red-400 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 group-hover:text-red-600 transition-colors">
                        {course.title}
                      </h4>
                      <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">{course.description}</p>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-[11px] font-bold shrink-0 hover:bg-red-700 transition">
                      Nạp & Chơi
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-zinc-200 text-right">
              <button
                onClick={() => setIsCourseModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold transition cursor-pointer"
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
