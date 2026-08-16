"use client";

import React, { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import {
  Gamepad2,
  BookOpen,
  Trophy,
  Coins,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Flame,
  Volume2,
  VolumeX,
  Layers,
  Power,
  Check,
  Maximize2,
  Minimize2,
  User,
  Info,
  Play,
  Heart,
  HelpCircle,
  Clock,
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { doc, getDoc, getDocs, query, collection, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CourseContentPair } from "@/core/entities/Course";

interface PlayPageProps {
  params: Promise<{
    game_id: string;
    course_id: string;
  }>;
}

const FALLBACK_COURSE_DATA: Record<string, { title: string; pairs: CourseContentPair[] }> = {
  crs_coding_basics: {
    title: "Bài 1: Nhập Môn Tư Duy Lập Trình & Thuật Toán",
    pairs: [
      {
        id: "cb1",
        title: "Biến số (Variable) trong lập trình dùng để làm gì?",
        description: "Dùng để lưu trữ giá trị dữ liệu và có thể thay đổi trong quá trình chạy chương trình.",
        explanation: "Biến số là ô nhớ trong bộ nhớ RAM được đặt tên để lưu trữ các giá trị (số, chuỗi, boolean) và có thể tái sử dụng hoặc cập nhật giá trị trong suốt quá trình thực thi.",
        distractions: ["Dùng để tắt máy tính", "Dùng để in ra giấy", "Dùng để xóa mã nguồn"],
      },
      {
        id: "cb2",
        title: "Cấu trúc điều kiện IF - ELSE có chức năng gì?",
        description: "Kiểm tra điều kiện đúng/sai để quyết định luồng rẽ nhánh thực thi của thuật toán.",
        explanation: "Cấu trúc rẽ nhánh IF - ELSE cho phép chương trình đưa ra quyết định thực thi khối lệnh A nếu điều kiện thỏa mãn (True), ngược lại thực thi khối lệnh B (False).",
        distractions: ["Lặp lại vô tận câu lệnh", "Khai báo hàm mới", "Lưu trữ dữ liệu vào ổ cứng"],
      },
      {
        id: "cb3",
        title: "Vòng lặp (Loop) sinh ra để giải quyết bài toán nào?",
        description: "Tự động hóa việc lặp đi lặp lại một khối lệnh nhiều lần mà không cần viết lại mã.",
        explanation: "Vòng lặp (For, While) giúp tối ưu mã nguồn, giảm trùng lặp bằng cách tự động thực hiện lại một nhóm lệnh cho đến khi thỏa mãn điều kiện dừng.",
        distractions: ["Thay đổi độ phân giải màn hình", "Nâng cấp phần cứng", "Tăng tốc độ mạng"],
      },
      {
        id: "cb4",
        title: "Thuật toán (Algorithm) là gì?",
        description: "Tập hợp các bước chỉ dẫn tuần tự, rõ ràng nhằm giải quyết một vấn đề cụ thể.",
        explanation: "Thuật toán là quy trình hữu hạn các bước logic, có đầu vào (Input) và đầu ra (Output) xác định nhằm giải quyết một bài toán cụ thể.",
        distractions: ["Tên của một loại máy tính", "Bộ nhớ tạm thời RAM", "Trình duyệt web"],
      },
    ],
  },
  crs_computer_hardware: {
    title: "Bài 2: Khám Phá Phần Cứng & Kiến Trúc Máy Tính 3D",
    pairs: [
      {
        id: "hw1",
        title: "CPU (Central Processing Unit)",
        description: "Bộ vi xử lý trung tâm, đóng vai trò bộ não thực thi các lệnh và tính toán số học/logic của hệ thống.",
        explanation: "CPU là linh kiện quan trọng nhất của máy tính, điều khiển mọi hoạt động, giải mã lệnh và thực hiện các phép toán số học ALU.",
        distractions: ["Bộ nhớ tạm thời RAM", "Card hiển thị đồ họa GPU", "Khối nguồn PSU"],
      },
      {
        id: "hw2",
        title: "GPU (Graphics Processing Unit)",
        description: "Bộ xử lý đồ họa chuyên dụng với hàng ngàn lõi song song để kết xuất hình ảnh 3D và tính toán AI.",
        explanation: "GPU được thiết kế kiến trúc song song khổng lồ, chuyên dụng cho việc xử lý ma trận điểm ảnh 3D, dựng hình đồ họa và huấn luyện mô hình AI.",
        distractions: ["Ổ cứng thể rắn SSD", "Bo mạch chủ Motherboard", "Quạt tản nhiệt"],
      },
      {
        id: "hw3",
        title: "RAM (Random Access Memory)",
        description: "Bộ nhớ truy xuất ngẫu nhiên tốc độ cao, lưu trữ dữ liệu tạm thời khi các ứng dụng đang chạy.",
        explanation: "RAM là bộ nhớ bay hơi (volatile memory) có tốc độ truy xuất cực nhanh, chứa dữ liệu làm việc của hệ điều hành và phần mềm đang mở.",
        distractions: ["Lưu trữ vĩnh viễn ROM", "Cổng kết nối USB", "Chipset bán cầu nam"],
      },
      {
        id: "hw4",
        title: "SSD M.2 NVMe",
        description: "Ổ lưu trữ thể rắn chuẩn giao tiếp PCIe siêu tốc, lưu trữ hệ điều hành và file dữ liệu không bị mất khi tắt nguồn.",
        explanation: "SSD sử dụng chip nhớ flash NAND non-volatile với giao thức NVMe qua làn PCIe, cho tốc độ đọc ghi lên tới hàng nghìn MB/s.",
        distractions: ["Bộ nhớ đệm L3 Cache", "Thanh RAM DDR5", "Khối nguồn PSU"],
      },
    ],
  },
  crs_python_mini_games: {
    title: "Bài 3: Lập Trình Trò Chơi Mini Với Python",
    pairs: [
      {
        id: "py1",
        title: "Hàm `print()` trong Python có tác dụng gì?",
        description: "Xuất dữ liệu hoặc chuỗi thông báo ra màn hình console.",
        explanation: "Hàm print() là hàm tích hợp sẵn trong Python dùng để in các đối tượng, chuỗi văn bản ra luồng xuất chuẩn stdout.",
        distractions: ["Nhập dữ liệu từ bàn phím", "Xóa biến số", "Đóng chương trình"],
      },
      {
        id: "py2",
        title: "Kiểu dữ liệu Boolean trong Python nhận những giá trị nào?",
        description: "True hoặc False",
        explanation: "Kiểu Boolean (bool) trong Python là kiểu logic chỉ có 2 giá trị phân biệt được viết hoa chữ cái đầu là True và False.",
        distractions: ["1 hoặc 0", "Yes hoặc No", "Chuỗi văn bản"],
      },
    ],
  },
};

const GAME_METADATA: Record<string, { title: string; subtitle: string; category: string; description: string; author: string; controls: string; instructions: string[] }> = {
  game_card_match_vr: {
    title: "Ghép Cặp Thẻ Bài Thuật Toán (Memory Match)",
    subtitle: "Luyện Trí Nhớ & Khắc Sâu Định Nghĩa",
    category: "Memory Card Matrix",
    description: "Trò chơi lật thẻ bài: Tìm và ghép đôi thẻ chứa Khái niệm với thẻ chứa Định nghĩa & Dữ liệu bổ sung tương ứng của bài học.",
    author: "TS. Lê Thị Mai",
    controls: "Nhấp chuột vào từng thẻ bài để lật và tìm cặp tương ứng.",
    instructions: [
      "Xem trước các thẻ bài trong thời gian Preview ban đầu.",
      "Lật 2 thẻ bài trong mỗi lượt.",
      "Nếu khớp đúng Khái niệm và Định nghĩa, cặp thẻ sẽ được mở vĩnh viễn.",
      "Giữ lượng Mạng (Hearts) không bị cạn kiệt để đạt chiến thắng.",
    ],
  },
};

interface MemoryCardItem {
  uid: string;
  pairId: string;
  type: "term" | "def";
  text: string;
  extraData?: string;
  icon?: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface LeaderboardRecord {
  id?: string;
  rank: number;
  userId: string;
  userName?: string;
  name: string;
  score: number;
  playTime: string;
  accuracy: number;
  date: string;
  isCurrentUser?: boolean;
}

export default function StudentPlayPage({ params }: PlayPageProps) {
  const resolvedParams = use(params);
  const { game_id: gameId, course_id: courseId } = resolvedParams;

  const { currentUser, profile } = useAuthAdapter();
  const uid = currentUser?.uid || profile?.uid || "usr_student";
  const studentName = currentUser?.name || profile?.fullName || "Học Viên E-V-E";
  const userRole = currentUser?.role || profile?.role || "student";

  const currentGameMeta = GAME_METADATA[gameId] || {
    title: gameId.replace(/_/g, " ").toUpperCase(),
    subtitle: "Minigame Tương Tác Học Tập",
    category: "Interactive Minigame",
    description: "Minigame giáo dục trực quan, tương tác học liệu và củng cố kiến thức theo từng bài học.",
    author: "Giảng Viên E-V-E",
    controls: "Sử dụng Chuột hoặc Bàn phím để tương tác.",
    instructions: ["Hoàn thành các thử thách để nhận điểm và mở khóa bài học tiếp theo."],
  };

  // Game Engine & State
  const [gameState, setGameState] = useState<"menu" | "playing">("menu");
  const [courseTitle, setCourseTitle] = useState("Đang tải bài học...");
  const [pairs, setPairs] = useState<CourseContentPair[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(5);
  const [isGameOver, setIsGameOver] = useState(false);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const gameViewportRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [rankingList, setRankingList] = useState<LeaderboardRecord[]>([]);
  const [activeTab, setActiveTab] = useState<"game" | "leaderboard" | "guide">("game");

  const isCardMatchingEngine = gameId.includes("card") || gameId.includes("matrix") || gameId.includes("match");

  // Memory Match state
  const [cards, setCards] = useState<MemoryCardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<MemoryCardItem[]>([]);
  const [movesCount, setMovesCount] = useState(0);
  const [previewTimer, setPreviewTimer] = useState(0);
  const [matchedPairsCount, setMatchedPairsCount] = useState(0);

  // Quiz state
  const [currentPairIdx, setCurrentPairIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  // ── Extra Data Preloader States ──
  const [dataStatus, setDataStatus] = useState<"loading" | "ready" | "error">("loading");
  const [loadProgress, setLoadProgress] = useState(20);
  const [loadStepMessage, setLoadStepMessage] = useState("1/3: Đang kết nối máy chủ và xác thực Game Session...");
  const [loadErrorDetails, setLoadErrorDetails] = useState<string | null>(null);

  // Background audio
  useEffect(() => {
    const audio = new Audio("/sounds/BGM_MemoryMatchingGame.mp3");
    audio.loop = true;
    audio.volume = 0.25;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isSoundMuted || gameState === "menu" || dataStatus !== "ready") {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
  }, [isSoundMuted, gameState, dataStatus]);

  // Load Course Extra Data
  useEffect(() => {
    let isCancelled = false;

    async function loadCourseExtraData() {
      setDataStatus("loading");
      setLoadProgress(20);
      setLoadStepMessage("1/3: Đang kết nối máy chủ và xác thực Game Session...");

      try {
        await new Promise((r) => setTimeout(r, 250));
        if (isCancelled) return;

        setLoadProgress(50);
        setLoadStepMessage("2/3: Đang nạp bộ câu hỏi tương tác & Extra Data bài học...");

        let loadedPairs: CourseContentPair[] = [];
        let loadedTitle = "Khóa Học E-V-E";

        try {
          const res = await fetch("/api/games/init", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gameId, courseId, userId: uid }),
          });
          const data = await res.json();
          if (data.success && Array.isArray(data.pairs) && data.pairs.length > 0) {
            loadedTitle = data.courseTitle || loadedTitle;
            loadedPairs = data.pairs;
          } else if (!data.success && (data.error === "not_enrolled" || data.error === "paused")) {
            setDataStatus("error");
            setLoadErrorDetails(data.message || "Bạn chưa tham gia hoặc đang tạm dừng lớp học chứa khóa học này.");
            return;
          }
        } catch (apiErr) {
          console.warn("API init fetch warning:", apiErr);
        }

        // Kiểm tra quyền trên client Firestore: Chỉ học sinh đang/đã học lộ trình có chứa bài này mới được chơi
        if (uid && userRole !== "admin" && userRole !== "teacher") {
          try {
            const enSnap = await getDocs(
              query(collection(db, "student_learning_path"), where("student_id", "==", uid))
            );
            let hasEnrolled = false;
            let isPaused = false;
            for (const d of enSnap.docs) {
              const dData = d.data();
              const lpSnap = await getDoc(doc(db, "learning_path", dData.learning_path_id));
              if (lpSnap.exists()) {
                const lpCourses = lpSnap.data()?.courses || [];
                if (lpCourses.includes(courseId)) {
                  hasEnrolled = true;
                  if (dData.status === "paused") {
                    isPaused = true;
                  }
                  break;
                }
              }
            }

            if (isPaused) {
              setDataStatus("error");
              setLoadErrorDetails("Lớp học chứa bài học này đang ở trạng thái TẠM DỪNG (BẢO LƯU). Bạn cần kích hoạt lại lớp học để tiếp tục chơi.");
              return;
            }

            if (!hasEnrolled) {
              setDataStatus("error");
              setLoadErrorDetails("Bạn chưa đăng ký hoặc chưa từng học lộ trình chứa bài học này. Vui lòng tham gia lớp học để mở khóa và chơi trò chơi với dữ liệu này!");
              return;
            }
          } catch (enErr) {
            console.warn("Client enrollment check warning:", enErr);
          }
        }

        if (loadedPairs.length === 0) {
          try {
            const cSnap = await getDoc(doc(db, "courses", courseId));
            if (cSnap.exists()) {
              const data = cSnap.data();
              loadedTitle = data.title || loadedTitle;
              const cp = Array.isArray(data.contentData)
                ? data.contentData
                : data.contentData?.pairs || data.content_data?.pairs || data.pairs || [];
              if (cp.length > 0) {
                loadedPairs = cp;
              }
            }
          } catch (dbErr) {
            console.warn("Firestore fetch warning:", dbErr);
          }
        }

        if (loadedPairs.length === 0) {
          const fallback = FALLBACK_COURSE_DATA[courseId] || FALLBACK_COURSE_DATA["crs_coding_basics"];
          if (fallback && Array.isArray(fallback.pairs) && fallback.pairs.length > 0) {
            loadedTitle = fallback.title;
            loadedPairs = fallback.pairs;
          }
        }

        if (loadedPairs.length === 0) {
          throw new Error("Không tìm thấy bộ câu hỏi Extra Data cho bài học này.");
        }

        if (isCancelled) return;

        setCourseTitle(loadedTitle);
        setPairs(loadedPairs);
        setLoadProgress(85);
        setLoadStepMessage(`3/3: Đã nạp thành công ${loadedPairs.length} câu hỏi Extra Data! Chuẩn bị khởi chạy game...`);

        await new Promise((r) => setTimeout(r, 350));
        if (isCancelled) return;

        setLoadProgress(100);
        setDataStatus("ready");
      } catch (err: any) {
        console.error("Lỗi tải Extra Data:", err);
        if (isCancelled) return;
        setDataStatus("error");
        setLoadErrorDetails(err?.message || "Không thể tải dữ liệu câu hỏi Extra Data của bài học.");
      }
    }

    loadCourseExtraData();

    return () => {
      isCancelled = true;
    };
  }, [gameId, courseId, uid]);

  const loadLeaderboard = async () => {
    try {
      const res = await fetch(`/api/games/leaderboard?gameId=${encodeURIComponent(gameId)}&courseId=${encodeURIComponent(courseId)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.rankings)) {
        setRankingList(data.rankings);
      }
    } catch {}
  };

  useEffect(() => {
    loadLeaderboard();
  }, [gameId, courseId]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!gameViewportRef.current) return;
    if (!document.fullscreenElement) {
      gameViewportRef.current.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Generate memory cards from course data
  const initializeMemoryDeck = () => {
    if (pairs.length === 0) return;
    const generatedCards: MemoryCardItem[] = [];
    const chosenPairs = pairs.slice(0, 6);

    const icons = ["", "", "", "", "", "", "", ""];

    chosenPairs.forEach((pair, idx) => {
      const pId = pair.id || `p_${idx}`;
      const icon = icons[idx % icons.length];

      // Card 1: Khái niệm (Term)
      generatedCards.push({
        uid: `${pId}_term`,
        pairId: pId,
        type: "term",
        text: pair.title,
        extraData: pair.explanation,
        icon: icon,
        isFlipped: true, // Initially shown for preview
        isMatched: false,
      });

      // Card 2: Định nghĩa & Giải thích (Definition & Extra Data)
      generatedCards.push({
        uid: `${pId}_def`,
        pairId: pId,
        type: "def",
        text: pair.description || (pair as any).rightAnswer || "Định nghĩa chi tiết",
        extraData: pair.explanation,
        icon: icon,
        isFlipped: true, // Initially shown for preview
        isMatched: false,
      });
    });

    const shuffled = generatedCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setSelectedCards([]);
    setMovesCount(0);
    setLives(5);
    setMatchedPairsCount(0);
    setPreviewTimer(4);

    // Preview timer: reveal for 4 seconds then flip back
    let timeLeft = 4;
    const interval = setInterval(() => {
      timeLeft -= 1;
      setPreviewTimer(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(interval);
        setCards((prev) => prev.map((c) => ({ ...c, isFlipped: false })));
      }
    }, 1000);
  };

  const handleStartGame = () => {
    setGameState("playing");
    setIsGameOver(false);
    setScore(0);
    setStreak(0);
    setCurrentPairIdx(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setMovesCount(0);

    if (isCardMatchingEngine) {
      initializeMemoryDeck();
    }
  };

  const handleCardClick = (card: MemoryCardItem) => {
    if (previewTimer > 0 || card.isFlipped || card.isMatched || selectedCards.length >= 2) return;

    const newFlipped = cards.map((c) => (c.uid === card.uid ? { ...c, isFlipped: true } : c));
    setCards(newFlipped);
    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMovesCount((m) => m + 1);
      const [first, second] = newSelected;

      // Check match: Same pairId and different type (one is term, one is def)
      if (first.pairId === second.pairId && first.type !== second.type) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.pairId === first.pairId ? { ...c, isMatched: true, isFlipped: true } : c
            )
          );
          setSelectedCards([]);
          setScore((s) => s + 30);
          setStreak((st) => st + 1);
          setMatchedPairsCount((m) => {
            const nextCount = m + 1;
            const totalPairsCount = cards.length / 2;
            if (nextCount >= totalPairsCount) {
              handleGameWin(score + 30 + lives * 10);
            }
            return nextCount;
          });
        }, 500);
      } else {
        // Wrong pair
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.uid === first.uid || c.uid === second.uid ? { ...c, isFlipped: false } : c))
          );
          setSelectedCards([]);
          setStreak(0);
          setLives((l) => {
            const nextLives = Math.max(0, l - 1);
            if (nextLives === 0) {
              // Game Over
              setIsGameOver(true);
            }
            return nextLives;
          });
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (!isCardMatchingEngine && pairs.length > 0) {
      const current = pairs[currentPairIdx];
      if (current) {
        const correct = current.description || (current as any).rightAnswer || "Đáp án đúng";
        const distractions = current.distractions || ["Lựa chọn A", "Lựa chọn B", "Lựa chọn C"];
        const opts = [correct, ...distractions].sort(() => Math.random() - 0.5);
        setShuffledOptions(opts);
        setSelectedAnswer(null);
        setIsCorrect(null);
      }
    }
  }, [pairs, currentPairIdx, isCardMatchingEngine]);

  const handleSelectQuizAnswer = (option: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(option);

    const current = pairs[currentPairIdx];
    const correct = current?.description || (current as any)?.rightAnswer || "Đáp án đúng";
    const correctBool = option === correct;
    setIsCorrect(correctBool);

    if (correctBool) {
      setScore((s) => s + 25);
      setStreak((st) => st + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (currentPairIdx + 1 < pairs.length) {
        setCurrentPairIdx((i) => i + 1);
      } else {
        handleGameWin(score + (correctBool ? 25 : 0));
      }
    }, 1500);
  };

  const handleGameWin = async (finalScoreValue: number) => {
    setIsGameOver(true);
    const coinsWon = Math.round(finalScoreValue * 0.5);
    setEarnedCoins(coinsWon);

    try {
      const res = await fetch("/api/games/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId,
          courseId,
          userId: uid,
          userName: studentName,
          score: finalScoreValue,
          isWin: true,
          accuracyPercent: 100,
          playTimeSeconds: 45,
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.earnedCoins) {
        setEarnedCoins(data.data.earnedCoins);
      }
    } catch {}

    setTimeout(() => {
      loadLeaderboard();
    }, 1000);
  };

  const handleRestart = () => {
    setGameState("menu");
    setIsGameOver(false);
    setScore(0);
    setStreak(0);
    setLives(5);
    setCurrentPairIdx(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setMovesCount(0);
  };

  const currentPair = pairs[currentPairIdx];

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* 1. Top Navigation & Breadcrumb */}
      <div className="p-4 md:p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/student/games"
            className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-900 transition-colors cursor-pointer border border-zinc-200"
            title="Quay lại Kho Trò Chơi"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 font-bold flex items-center gap-1.5">
              <Gamepad2 className="w-3.5 h-3.5 text-red-600" />
              Trò chơi: {currentGameMeta.title}
            </span>
            <span className="text-zinc-400">▶</span>
            <span className="px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 font-bold flex items-center gap-1.5 truncate max-w-md">
              <BookOpen className="w-3.5 h-3.5 text-red-600" />
              Bài học: {courseTitle}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
          <button
            onClick={toggleFullscreen}
            className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
            title="Mở toàn màn hình"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span>{isFullscreen ? "Thu Nhỏ" : "Toàn Màn Hình"}</span>
          </button>

          <button
            onClick={() => setIsSoundMuted(!isSoundMuted)}
            className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 transition-colors cursor-pointer"
            title={isSoundMuted ? "Bật âm thanh" : "Tắt âm thanh"}
          >
            {isSoundMuted ? <VolumeX className="w-4 h-4 text-red-600" /> : <Volume2 className="w-4 h-4 text-zinc-700" />}
          </button>

          <div className="px-3.5 py-2 rounded-xl bg-red-50 border border-red-200 flex items-center gap-1.5 text-xs font-bold text-red-700">
            <Coins className="w-4 h-4 text-red-600" />
            <span>{score} Điểm</span>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs (LUÔN HIỂN THỊ) */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-3">
        <button
          onClick={() => setActiveTab("game")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 border ${
            activeTab === "game"
              ? "bg-red-600 text-white border-red-600 shadow-sm"
              : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
          }`}
        >
          <Play className="w-3.5 h-3.5" /> Màn Chơi Tương Tác
        </button>

        <button
          onClick={() => setActiveTab("leaderboard")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 border ${
            activeTab === "leaderboard"
              ? "bg-red-600 text-white border-red-600 shadow-sm"
              : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
          }`}
        >
          <Trophy className="w-3.5 h-3.5" /> Bảng Xếp Hạng ({rankingList.length})
        </button>

        <button
          onClick={() => setActiveTab("guide")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 border ${
            activeTab === "guide"
              ? "bg-red-600 text-white border-red-600 shadow-sm"
              : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
          }`}
        >
          <Info className="w-3.5 h-3.5" /> Hướng Dẫn Cách Chơi
        </button>
      </div>

      {/* 3. Main Content Viewport */}
      {activeTab === "game" && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
          {/* Game Viewport Container */}
          <div
            ref={gameViewportRef}
            className={`xl:col-span-3 rounded-2xl bg-white border border-zinc-200 shadow-sm relative overflow-hidden transition-all flex flex-col justify-between ${
              isFullscreen ? "p-6 md:p-10 min-h-screen" : "p-5 md:p-8 min-h-[580px]"
            }`}
          >
            {/* PRELOADER SCREEN BÊN TRONG CONTAINER CỦA GAME */}
            {dataStatus === "loading" && (
              <div className="my-auto py-10 text-center space-y-7 relative z-10">
                {/* Top Engine Badge */}
                <div className="flex items-center justify-center gap-2">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-mono font-bold uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                    Đang Preload Dữ Liệu Bài Học • {loadProgress}%
                  </span>
                </div>

                {/* Center Graphic */}
                <div className="relative inline-block mx-auto">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-red-600 to-red-500 border-2 border-red-400 flex items-center justify-center text-white shadow-xl shadow-red-600/20">
                    <Gamepad2 className="w-10 h-10 animate-pulse" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded bg-zinc-900 text-[10px] font-mono font-bold text-white">
                    v2.4
                  </div>
                </div>

                {/* Title & Info */}
                <div className="space-y-1.5 max-w-md mx-auto">
                  <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-zinc-900">
                    Đang Chuẩn Bị Màn Chơi...
                  </h2>
                  <p className="text-xs text-zinc-500 font-mono">
                    Bài học: <span className="text-red-600 font-bold">{courseTitle || "Đang nạp dữ liệu..."}</span>
                  </p>
                </div>

                {/* Interactive Loading Bar */}
                <div className="max-w-lg mx-auto space-y-3.5 bg-zinc-50 border border-zinc-200 p-5 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-2 text-zinc-700 font-bold">
                      <Sparkles className="w-4 h-4 text-red-600 animate-spin" /> {loadStepMessage}
                    </span>
                    <span className="text-xs font-black font-mono text-red-600 px-2 py-0.5 rounded bg-red-50 border border-red-200">
                      {loadProgress}%
                    </span>
                  </div>

                  {/* Progress Bar Container */}
                  <div className="w-full h-3.5 rounded-full bg-zinc-200 overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-red-600 via-red-500 to-orange-400 transition-all duration-300 relative shadow-sm"
                      style={{ width: `${Math.max(5, loadProgress)}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </div>
                  </div>

                  {/* Visual Milestones */}
                  <div className="grid grid-cols-3 gap-2 pt-1 text-[10px] md:text-[11px] font-mono text-left">
                    <div className={`p-2 rounded-xl border flex items-center gap-1.5 transition-colors ${loadProgress >= 30 ? "bg-red-50 border-red-200 text-red-700 font-bold" : "bg-white border-zinc-200 text-zinc-400"}`}>
                      <Check className={`w-3.5 h-3.5 flex-shrink-0 ${loadProgress >= 30 ? "text-red-600" : "text-zinc-300"}`} />
                      <span className="truncate">1. Token Session</span>
                    </div>
                    <div className={`p-2 rounded-xl border flex items-center gap-1.5 transition-colors ${loadProgress >= 70 ? "bg-red-50 border-red-200 text-red-700 font-bold" : "bg-white border-zinc-200 text-zinc-400"}`}>
                      <Check className={`w-3.5 h-3.5 flex-shrink-0 ${loadProgress >= 70 ? "text-red-600" : "text-zinc-300"}`} />
                      <span className="truncate">2. Extra Data</span>
                    </div>
                    <div className={`p-2 rounded-xl border flex items-center gap-1.5 transition-colors ${loadProgress >= 100 ? "bg-red-50 border-red-200 text-red-700 font-bold" : "bg-white border-zinc-200 text-zinc-400"}`}>
                      <Check className={`w-3.5 h-3.5 flex-shrink-0 ${loadProgress >= 100 ? "text-red-600" : "text-zinc-300"}`} />
                      <span className="truncate">3. Khởi Chạy</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ERROR RECOVERY SCREEN BÊN TRONG CONTAINER CỦA GAME */}
            {dataStatus === "error" && (
              <div className="my-auto py-10 text-center space-y-6 relative z-10 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-red-100 border-2 border-red-300 flex items-center justify-center mx-auto text-red-600 shadow-sm">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono font-bold text-red-600 uppercase tracking-widest px-3 py-1 rounded-full bg-red-50 border border-red-200">
                    Cảnh Báo Lỗi Tải Dữ Liệu
                  </span>
                  <h2 className="text-xl font-black uppercase tracking-tight text-zinc-900 mt-2">
                    Không Thể Nạp Extra Data Của Bài Học
                  </h2>
                  <p className="text-xs text-zinc-500 leading-relaxed font-mono">
                    {loadErrorDetails || "Đã xảy ra lỗi kết nối khi lấy bộ câu hỏi bài học từ máy chủ. Vui lòng bấm Tải Lại Trang bên dưới để thử lại."}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <Link href="/student/classes">
                    <button
                      type="button"
                      className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
                    >
                      <BookOpen className="w-4 h-4" /> Lớp Học Của Tôi
                    </button>
                  </Link>

                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-900 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
                  >
                    <RotateCcw className="w-4 h-4" /> Tải Lại (Refresh)
                  </button>

                  <Link href="/student/games">
                    <button
                      type="button"
                      className="px-5 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-300 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" /> Kho Trò Chơi
                    </button>
                  </Link>
                </div>
              </div>
            )}

            {/* MÀN CHƠI GAME & HUD KHI DỮ LIỆU ĐÃ SẴN SÀNG */}
            {dataStatus === "ready" && (
              <>
            {/* Top HUD Bar */}
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-zinc-100 relative z-10">
              <div className="space-y-0.5">
                <div className="text-[11px] text-red-600 uppercase font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                  {currentGameMeta.category} • {courseTitle}
                </div>
                <h2 className="text-lg md:text-xl font-black text-zinc-900">{currentGameMeta.title}</h2>
              </div>

              {/* Lives & Streak HUD */}
              <div className="flex items-center gap-3">
                {isCardMatchingEngine && gameState === "playing" && (
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Heart
                        key={i}
                        className={`w-4 h-4 ${i < lives ? "text-red-600 fill-red-600" : "text-zinc-300"}`}
                      />
                    ))}
                    <span className="ml-1 text-xs font-bold text-red-700">{lives}/5</span>
                  </div>
                )}

                {streak > 1 && (
                  <div className="px-3 py-1 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-red-600 text-red-600" /> Combo x{streak}
                  </div>
                )}

                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 transition-colors cursor-pointer"
                  title="Toàn màn hình"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Game Canvas Area */}
            <div className="my-auto py-6 relative z-10 w-full">
              {/* STATE 1: START MENU SCREEN */}
              {gameState === "menu" ? (
                <div className="max-w-md mx-auto p-8 rounded-3xl bg-white border border-zinc-200 shadow-xl text-center space-y-6">
                  {/* Game Logo */}
                  <div className="w-24 h-24 mx-auto rounded-3xl bg-white border-2 border-red-600 shadow-lg flex items-center justify-center p-3">
                    <img
                      src="/game_content/Logo_MemoryMatchingGame.png"
                      alt="Game Logo"
                      className="w-16 h-16 object-contain"
                      onError={(e) => {
                        (e.target as any).style.display = "none";
                      }}
                    />
                    <Gamepad2 className="w-12 h-12 text-red-600" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
                      {isCardMatchingEngine ? "MEMORY MATCHING" : currentGameMeta.title}
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      {currentGameMeta.subtitle}
                    </p>
                  </div>

                  {/* Course Data Summary */}
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-left space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500 font-medium">Khóa học:</span>
                      <span className="font-bold text-zinc-900 truncate max-w-[200px]">{courseTitle}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500 font-medium">Học liệu nạp vào card:</span>
                      <span className="font-bold text-red-600">{pairs.length} Cặp ({pairs.length * 2} Thẻ bài)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500 font-medium">Phần thưởng tối đa:</span>
                      <span className="font-extrabold text-amber-600 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> +100 Coins
                      </span>
                    </div>
                  </div>

                  {/* Start Button */}
                  <button
                    onClick={handleStartGame}
                    className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-base shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Play className="w-5 h-5 fill-white" /> BẮT ĐẦU CHƠI (START GAME)
                  </button>

                  <p className="text-[11px] text-zinc-400">
                    Dữ liệu câu hỏi và giải thích được trích xuất trực tiếp từ bài học của bạn.
                  </p>
                </div>
              ) : isGameOver ? (
                /* STATE 2: GAME OVER / VICTORY SCREEN */
                <div className="max-w-md mx-auto p-8 rounded-3xl bg-white border-2 border-red-600 shadow-2xl text-center space-y-5">
                  <div className="w-16 h-16 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                    {lives > 0 ? <Trophy className="w-8 h-8" /> : <Heart className="w-8 h-8 text-red-500" />}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-zinc-900">
                      {lives > 0 ? "Xuất Sắc! Hoàn Thành " : "Game Over! Hết Lượt Chơi "}
                    </h3>
                    <p className="text-xs text-zinc-500">
                      {lives > 0
                        ? `Bạn đã hoàn thành thử thách ghép bài cho: ${courseTitle}`
                        : "Đừng nản lòng! Hãy ôn lại định nghĩa bài học và thử lại."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                    <div>
                      <div className="text-[10px] text-zinc-500 uppercase font-bold">Tổng Điểm</div>
                      <div className="text-xl font-black text-zinc-900 font-mono">{score} PTS</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-red-600 uppercase font-bold">Coins Thưởng</div>
                      <div className="text-xl font-black text-red-600 font-mono">+{earnedCoins} </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleRestart}
                      className="flex-1 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold border border-zinc-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" /> Về Menu
                    </button>
                    <button
                      onClick={handleStartGame}
                      className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
                    >
                      Chơi Lại Ngay
                    </button>
                  </div>
                </div>
              ) : (
                /* STATE 3: PLAYING MEMORY CARD MATCH */
                <div className="space-y-6">
                  {/* Status Banner */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-zinc-50 p-3.5 rounded-xl border border-zinc-200">
                    <div className="flex items-center gap-4">
                      <span>Lượt lật: <strong className="text-zinc-900">{movesCount}</strong></span>
                      <span>Đã ghép: <strong className="text-red-600">{matchedPairsCount} / {cards.length / 2} cặp</strong></span>
                    </div>

                    {previewTimer > 0 ? (
                      <div className="px-3 py-1 rounded-lg bg-amber-500 text-white font-bold text-xs animate-pulse flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Ghi nhớ vị trí thẻ: {previewTimer}s
                      </div>
                    ) : (
                      <div className="text-zinc-500">
                         Tìm cặp <span className="font-bold text-red-600">Khái niệm</span> & <span className="font-bold text-zinc-900">Định nghĩa</span>
                      </div>
                    )}
                  </div>

                  {/* Cards Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto">
                    {cards.map((card) => {
                      const isRevealed = previewTimer > 0 || card.isFlipped || card.isMatched;

                      return (
                        <div
                          key={card.uid}
                          onClick={() => handleCardClick(card)}
                          className={`min-h-[140px] md:min-h-[160px] rounded-2xl border-2 p-3.5 flex flex-col items-center justify-between text-center cursor-pointer transition-all duration-300 select-none shadow-sm relative overflow-hidden ${
                            card.isMatched
                              ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200"
                              : isRevealed
                              ? "bg-white border-red-600 shadow-md scale-100"
                              : "bg-gradient-to-br from-red-600 to-rose-700 border-red-500 text-white hover:shadow-md hover:scale-[1.02] active:scale-95"
                          }`}
                        >
                          {isRevealed ? (
                            <div className="h-full w-full flex flex-col justify-between">
                              <div className="flex items-center justify-between w-full">
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                                  card.type === "term" ? "bg-red-100 text-red-700" : "bg-zinc-100 text-zinc-700"
                                }`}>
                                  {card.type === "term" ? "Khái Niệm" : "Định Nghĩa"}
                                </span>
                                <span className="text-base">{card.icon}</span>
                              </div>

                              <p className="text-xs font-bold text-zinc-900 leading-snug my-auto line-clamp-3">
                                {card.text}
                              </p>

                              {card.isMatched && (
                                <div className="text-[10px] text-emerald-700 font-extrabold flex items-center justify-center gap-1 pt-1 border-t border-emerald-200">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Chính xác
                                </div>
                              )}
                            </div>
                          ) : (
                            /* Card Back */
                            <div className="h-full w-full flex flex-col items-center justify-center space-y-1">
                              <span className="text-4xl font-black text-white drop-shadow">?</span>
                              <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">E-V-E</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Status Bar */}
            <div className="flex items-center justify-between text-xs text-zinc-500 pt-4 border-t border-zinc-100 relative z-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600" />
                <span>Người chơi: <strong className="text-zinc-900">{studentName}</strong></span>
              </div>
              <button
                onClick={handleRestart}
                className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors cursor-pointer border border-zinc-200 flex items-center gap-1.5 text-xs font-bold"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Về Menu
              </button>
            </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="p-5 md:p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 font-bold border border-red-200">
                  {currentGameMeta.category}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-zinc-900">{currentGameMeta.title}</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {currentGameMeta.description}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-100 space-y-1 text-xs text-zinc-500">
                <div>Biên soạn: <strong className="text-zinc-900">{currentGameMeta.author}</strong></div>
                <div>Điều khiển: <strong className="text-zinc-900">{currentGameMeta.controls}</strong></div>
              </div>
            </div>

            <div className="p-5 md:p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-red-600" /> BXH Game Trong Khóa
                </h4>
                <button
                  onClick={() => setActiveTab("leaderboard")}
                  className="text-xs text-red-600 hover:underline cursor-pointer font-bold"
                >
                  Xem tất cả →
                </button>
              </div>

              <div className="space-y-2 text-xs">
                {rankingList.slice(0, 4).map((rec, idx) => (
                  <div
                    key={rec.id || idx}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                      idx === 0
                        ? "bg-red-50 border-red-200 text-red-700 font-bold"
                        : "bg-zinc-50 border-zinc-200 text-zinc-700"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-bold w-4 text-center">
                        {idx === 0 ? "#1" : idx === 1 ? "#2" : idx === 2 ? "#3" : `#${idx + 1}`}
                      </span>
                      <span className="truncate">{rec.name}</span>
                    </div>
                    <span className="font-bold text-zinc-900 shrink-0 font-mono">{rec.score} pts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Full Leaderboard */}
      {activeTab === "leaderboard" && (
        <div className="p-6 md:p-8 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100">
            <div>
              <div className="text-xs text-red-600 font-bold uppercase flex items-center gap-2">
                <Trophy className="w-4 h-4" /> Bảng Xếp Hạng Thành Tích Riêng
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-zinc-900 mt-1">
                {currentGameMeta.title} • {courseTitle}
              </h2>
            </div>

            <button
              onClick={() => setActiveTab("game")}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Play className="w-3.5 h-3.5" /> Vào Chơi Ngay
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-500 uppercase text-[11px] font-bold">
                  <th className="py-3 px-4">Hạng</th>
                  <th className="py-3 px-4">Học Viên</th>
                  <th className="py-3 px-4 text-center">Điểm Số</th>
                  <th className="py-3 px-4 text-center">Thời Gian</th>
                  <th className="py-3 px-4 text-center">Độ Chính Xác</th>
                  <th className="py-3 px-4 text-right">Ngày</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {rankingList.map((record, index) => {
                  const isMe = record.userId === uid;
                  return (
                    <tr
                      key={record.id || index}
                      className={`transition-colors ${
                        isMe
                          ? "bg-red-50/80 border-l-2 border-red-600 font-bold"
                          : index === 0
                          ? "bg-amber-50/50 font-bold"
                          : "hover:bg-zinc-50 text-zinc-700"
                      }`}
                    >
                      <td className="py-3 px-4 font-bold">
                        {index === 0 ? "Hạng 1" : index === 1 ? "Hạng 2" : index === 2 ? "Hạng 3" : `#${index + 1}`}
                      </td>
                      <td className="py-3 px-4 font-semibold text-zinc-900">
                        <div className="relative group/user inline-flex items-center gap-2 cursor-pointer">
                          <User className="w-3.5 h-3.5 text-red-600" />
                          <span>{record.name}{isMe ? " (Bạn)" : ""}</span>
                          {/* Hover Profile Tooltip */}
                          <div className="absolute left-0 top-full mt-1 z-50 hidden group-hover/user:block w-52 p-3 rounded-xl bg-white border border-zinc-200 shadow-xl text-left">
                            <div className="text-[11px] text-zinc-500 font-normal">Hồ sơ học viên</div>
                            <div className="text-xs font-bold text-zinc-900 mt-0.5">{record.name}</div>
                            <div className="text-[10px] text-zinc-400 font-mono mt-0.5">ID: {record.userId?.slice(-8) || "--"}</div>
                            <div className="mt-2 pt-2 border-t border-zinc-100 text-[11px] text-zinc-600 font-normal space-y-0.5">
                              <div>Điểm cao nhất: <span className="font-bold text-red-600">{record.score} pts</span></div>
                              <div>Độ chính xác: <span className="font-bold text-emerald-600">{record.accuracy}%</span></div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-bold font-mono text-zinc-900">
                        {record.score} pts
                      </td>
                      <td className="py-3 px-4 text-center text-zinc-500">
                        {record.playTime}
                      </td>
                      <td className="py-3 px-4 text-center text-emerald-700 font-bold">
                        {record.accuracy}%
                      </td>
                      <td className="py-3 px-4 text-right text-zinc-500">
                        {record.date}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Guide */}
      {activeTab === "guide" && (
        <div className="p-6 md:p-8 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-6">
          <div>
            <div className="text-xs text-red-600 font-bold uppercase flex items-center gap-2">
              <Info className="w-4 h-4" /> Hướng Dẫn Trò Chơi
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-zinc-900 mt-1">
              Luật Chơi & Thưởng Coins: {currentGameMeta.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
              <h3 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-red-600" /> Hướng Dẫn Từng Bước
              </h3>
              <ul className="space-y-2 text-xs text-zinc-600 list-disc list-inside leading-relaxed">
                {currentGameMeta.instructions.map((inst, i) => (
                  <li key={i}>{inst}</li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
              <h3 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
                <Coins className="w-4 h-4 text-red-600" /> Cơ Chế Tích Lũy Coins
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Khi hoàn thành màn chơi với điểm số cao, hệ thống tự động cộng Coins vào tài khoản học viên và mở khóa bài học tiếp theo.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setActiveTab("game")}
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
                >
                  Bắt Đầu Chơi Ngay →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
