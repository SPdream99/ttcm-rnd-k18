"use client";

import React, { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Zap,
  Flame,
  Volume2,
  Cpu,
  HardDrive,
  Activity,
  Layers,
  Power,
  Eye,
  Check,
  HelpCircle,
  Clock,
  Sparkle,
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CourseContentPair } from "@/core/entities/Course";

interface PlayPageProps {
  params: Promise<{
    game_id: string;
    course_id: string;
  }>;
}

// Fallback dataset for simulation & demo across physics, astronomy, and computer hardware
const FALLBACK_COURSE_DATA: Record<string, { title: string; pairs: CourseContentPair[] }> = {
  crs_computer_hardware: {
    title: "Kiến Trúc Máy Tính & Phần Cứng 3D (Computer Hardware)",
    pairs: [
      {
        id: "hw1",
        title: "CPU (Central Processing Unit)",
        description: "Bộ vi xử lý trung tâm, đóng vai trò bộ não thực thi các lệnh và tính toán số học/logic của hệ thống.",
        distractions: ["Bộ nhớ tạm thời RAM", "Card hiển thị đồ họa", "Nguồn điện PSU"],
        image_url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600",
      },
      {
        id: "hw2",
        title: "GPU (Graphics Processing Unit)",
        description: "Bộ xử lý đồ họa chuyên dụng với hàng ngàn lõi song song để kết xuất hình ảnh 3D và tính toán AI.",
        distractions: ["Ổ cứng thể rắn SSD", "Bo mạch chủ Motherboard", "Quạt tản nhiệt"],
        image_url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600",
      },
      {
        id: "hw3",
        title: "RAM (Random Access Memory)",
        description: "Bộ nhớ truy xuất ngẫu nhiên tốc độ cao, lưu trữ dữ liệu tạm thời khi các ứng dụng đang chạy.",
        distractions: ["Lưu trữ vĩnh viễn ROM", "Cổng kết nối USB", "Chipset bán cầu nam"],
      },
      {
        id: "hw4",
        title: "SSD M.2 NVMe",
        description: "Ổ lưu trữ thể rắn chuẩn giao tiếp PCIe siêu tốc, lưu trữ hệ điều hành và file dữ liệu không bị mất khi tắt nguồn.",
        distractions: ["Bộ nhớ đệm L3 Cache", "Thanh RAM DDR5", "Khối nguồn PSU"],
      },
    ],
  },
  crs_quantum_101: {
    title: "Vật Lý Lượng Tử Cơ Bản (Quantum 101)",
    pairs: [
      {
        id: "p1",
        title: "Hiện tượng quang điện chứng minh tính chất gì của ánh sáng?",
        description: "Tính chất hạt (Photon)",
        distractions: ["Tính chất sóng", "Tính chất phản xạ", "Tính chất tán sắc"],
        image_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600",
      },
      {
        id: "p2",
        title: "Ai là người đề xuất phương trình hàm sóng mô tả trạng thái lượng tử?",
        description: "Erwin Schrödinger",
        distractions: ["Albert Einstein", "Niels Bohr", "Isaac Newton"],
      },
      {
        id: "p3",
        title: "Hằng số Planck có ký hiệu là gì?",
        description: "h",
        distractions: ["c", "e", "k"],
      },
    ],
  },
  crs_astrophysics: {
    title: "Thiên Văn Học & Hố Đen Vũ Trụ",
    pairs: [
      {
        id: "p4",
        title: "Ranh giới mà không vật chất nào có thể thoát khỏi hố đen gọi là gì?",
        description: "Chân trời sự kiện (Event Horizon)",
        distractions: ["Điểm kỳ dị", "Vùng bồi tụ", "Vành đai Kuiper"],
      },
      {
        id: "p5",
        title: "Bức xạ nhiệt được dự đoán phát ra từ rìa hố đen mang tên nhà khoa học nào?",
        description: "Stephen Hawking",
        distractions: ["Carl Sagan", "Edwin Hubble", "Kip Thorne"],
      },
    ],
  },
};

interface MemoryCardItem {
  uid: string;
  pairId: string;
  type: "term" | "def";
  text: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface HardwareComponent {
  id: string;
  name: string;
  type: "cpu" | "gpu" | "ram" | "ssd" | "psu" | "cooler";
  specs: string;
  desc: string;
  isInstalled: boolean;
  color: string;
}

export default function StudentPlayPage({ params }: PlayPageProps) {
  const resolvedParams = use(params);
  const { game_id: gameId, course_id: courseId } = resolvedParams;

  const { currentUser, profile } = useAuthAdapter();
  const uid = currentUser?.uid || profile?.uid || "usr_student";

  const [courseTitle, setCourseTitle] = useState("Khóa Học Lượng Tử");
  const [pairs, setPairs] = useState<CourseContentPair[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [earnedCoins, setEarnedCoins] = useState(0);

  // ── Engine Type Selector ──
  // Determine game engine archetype based on gameId:
  // "card_match" -> Memory Matrix Game Engine
  // "hardware_3d" / "computer_3d" -> 3D Computer Hardware Assembly Lab Engine
  // other -> Quiz Space Flight Engine
  const isCardMatchingEngine = gameId.includes("card") || gameId.includes("matrix") || gameId.includes("match");
  const is3DHardwareLabEngine = gameId.includes("hardware") || gameId.includes("computer") || gameId.includes("3d_lab") || courseId.includes("computer");

  // ── Engine 1: Card Matching State ──
  const [cards, setCards] = useState<MemoryCardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<MemoryCardItem[]>([]);
  const [movesCount, setMovesCount] = useState(0);

  // ── Engine 2: 3D Hardware Lab & Assembly State ──
  const [hardwareParts, setHardwareParts] = useState<HardwareComponent[]>([
    { id: "p_cpu", name: "CPU Intel Core i9 / Ryzen 9", type: "cpu", specs: "16 Cores, 32 Threads, 5.7GHz", desc: "Bộ não thực thi mọi phép toán của hệ thống", isInstalled: false, color: "from-blue-500 to-indigo-600" },
    { id: "p_ram", name: "RAM 32GB DDR5 6000MHz", type: "ram", specs: "Dual Channel, RGB Heatsink", desc: "Bộ nhớ lưu trữ tạm tốc độ cao", isInstalled: false, color: "from-emerald-500 to-teal-600" },
    { id: "p_gpu", name: "GPU RTX 4090 24GB VRAM", type: "gpu", specs: "Ada Lovelace, 16384 CUDA Cores", desc: "Xử lý đồ họa 3D & mô phỏng thời gian thực", isInstalled: false, color: "from-purple-500 to-pink-600" },
    { id: "p_ssd", name: "SSD 2TB M.2 PCIe 4.0", type: "ssd", specs: "Read: 7400MB/s, Write: 6800MB/s", desc: "Lưu trữ hệ điều hành và dữ liệu vĩnh cửu", isInstalled: false, color: "from-amber-500 to-orange-600" },
    { id: "p_psu", name: "Bộ Nguồn PSU 850W Gold", type: "psu", specs: "80 Plus Gold, Fully Modular", desc: "Cung cấp điện áp ổn định cho toàn bộ máy", isInstalled: false, color: "from-cyan-500 to-blue-600" },
  ]);
  const [selectedHardware, setSelectedHardware] = useState<HardwareComponent | null>(hardwareParts[0]);
  const [systemPowerOn, setSystemPowerOn] = useState(false);
  const [bootingProgress, setBootingProgress] = useState(0);

  // ── Engine 3: Space Flight Quiz State ──
  const [currentPairIdx, setCurrentPairIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  // 1. Fetch Course Data & JSON Pairs
  useEffect(() => {
    async function loadCourse() {
      try {
        const cSnap = await getDoc(doc(db, "courses", courseId));
        if (cSnap.exists()) {
          const data = cSnap.data();
          setCourseTitle(data.title || "Khóa Học E-V-E");
          const loadedPairs = Array.isArray(data.contentData)
            ? data.contentData
            : data.contentData?.pairs || [];
          if (loadedPairs.length > 0) {
            setPairs(loadedPairs);
            return;
          }
        }
      } catch (e) {
        console.warn("Using fallback course pairs for game injection:", e);
      }

      // Fallback pairs
      const fallback = FALLBACK_COURSE_DATA[courseId] || FALLBACK_COURSE_DATA["crs_computer_hardware"] || FALLBACK_COURSE_DATA["crs_quantum_101"];
      setCourseTitle(fallback.title);
      setPairs(fallback.pairs);
    }
    loadCourse();
  }, [courseId]);

  // 2. Setup Card Matching Memory Grid when pairs load
  useEffect(() => {
    if (isCardMatchingEngine && pairs.length > 0) {
      const generatedCards: MemoryCardItem[] = [];
      // Pick up to 4 pairs for a neat 8-card grid
      const chosenPairs = pairs.slice(0, 4);

      chosenPairs.forEach((pair, idx) => {
        const pId = pair.id || `p_${idx}`;
        // Card 1: Term / Question (Shortened title)
        generatedCards.push({
          uid: `${pId}_term`,
          pairId: pId,
          type: "term",
          text: pair.title,
          isFlipped: false,
          isMatched: false,
        });
        // Card 2: Definition / Right Answer
        generatedCards.push({
          uid: `${pId}_def`,
          pairId: pId,
          type: "def",
          text: pair.description || pair.rightAnswer || "Khái niệm",
          isFlipped: false,
          isMatched: false,
        });
      });

      // Shuffle cards randomly
      setCards(generatedCards.sort(() => Math.random() - 0.5));
      setSelectedCards([]);
      setMovesCount(0);
    }
  }, [pairs, isCardMatchingEngine]);

  // 3. Card Matching Click Logic
  const handleCardClick = (card: MemoryCardItem) => {
    if (card.isFlipped || card.isMatched || selectedCards.length >= 2) return;

    // Flip this card
    const flippedCard = { ...card, isFlipped: true };
    const updatedCards = cards.map((c) => (c.uid === card.uid ? flippedCard : c));
    setCards(updatedCards);

    const newSelected = [...selectedCards, flippedCard];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMovesCount((prev) => prev + 1);
      const [first, second] = newSelected;

      if (first.pairId === second.pairId && first.type !== second.type) {
        // MATCHED!
        setTimeout(() => {
          const matchedCards = updatedCards.map((c) =>
            c.pairId === first.pairId ? { ...c, isMatched: true } : c
          );
          setCards(matchedCards);
          setSelectedCards([]);
          setScore((prev) => prev + 50 + streak * 15);
          setStreak((prev) => prev + 1);

          // Check if all matched
          if (matchedCards.every((c) => c.isMatched)) {
            finishGameSession(100, 60);
          }
        }, 500);
      } else {
        // NOT MATCHED -> Flip back
        setStreak(0);
        setTimeout(() => {
          const resetCards = updatedCards.map((c) =>
            c.uid === first.uid || c.uid === second.uid ? { ...c, isFlipped: false } : c
          );
          setCards(resetCards);
          setSelectedCards([]);
        }, 1000);
      }
    }
  };

  // 4. Hardware Assembly Component Click Logic
  const handleInstallComponent = (partId: string) => {
    setHardwareParts((prev) =>
      prev.map((p) => (p.id === partId ? { ...p, isInstalled: true } : p))
    );
    setScore((prev) => prev + 25);
  };

  const handleBootSystem = () => {
    const allInstalled = hardwareParts.every((p) => p.isInstalled);
    if (!allInstalled) {
      alert("⚠️ Hệ thống chưa đầy đủ linh kiện! Hãy lắp đủ CPU, RAM, GPU, SSD và Nguồn PSU trước khi khởi động.");
      return;
    }

    setSystemPowerOn(true);
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 20;
      setBootingProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          finishGameSession(120, 70);
        }, 800);
      }
    }, 400);
  };

  // 5. Space Quiz Logic (for regular quiz games)
  useEffect(() => {
    if (!isCardMatchingEngine && !is3DHardwareLabEngine && pairs.length > 0 && currentPairIdx < pairs.length) {
      const current = pairs[currentPairIdx];
      const right = current.description || current.rightAnswer || "";
      const wrongs = current.distractions || current.wrongAnswers || [];
      const all = [right, ...wrongs].sort(() => Math.random() - 0.5);
      setShuffledOptions(all);
      setSelectedAnswer(null);
      setIsCorrect(null);
    }
  }, [pairs, currentPairIdx, isCardMatchingEngine, is3DHardwareLabEngine]);

  const handleSelectQuizOption = (opt: string) => {
    if (selectedAnswer !== null) return;
    const current = pairs[currentPairIdx];
    const right = current.description || current.rightAnswer || "";
    const correct = opt.trim() === right.trim();

    setSelectedAnswer(opt);
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 30 + streak * 10);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (currentPairIdx + 1 < pairs.length) {
        setCurrentPairIdx((prev) => prev + 1);
      } else {
        finishGameSession(score + 30, 50);
      }
    }, 1200);
  };

  // 6. Finish game and update coins
  const finishGameSession = async (finalScore: number, reward: number) => {
    setScore(finalScore);
    setEarnedCoins(reward);
    setIsGameOver(true);

    try {
      if (uid) {
        await updateDoc(doc(db, "users", uid), {
          coins: increment(reward),
        });
      }
    } catch {}

    // Call REST finish API in background
    try {
      fetch("/api/games/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId,
          courseId,
          userId: uid,
          score: finalScore,
          isWin: true,
        }),
      });
    } catch {}
  };

  const handleRestart = () => {
    setScore(0);
    setStreak(0);
    setIsGameOver(false);
    setEarnedCoins(0);
    setCurrentPairIdx(0);
    setMovesCount(0);
    setSystemPowerOn(false);
    setBootingProgress(0);
    setHardwareParts((prev) => prev.map((p) => ({ ...p, isInstalled: false })));
    if (isCardMatchingEngine) {
      setCards((prev) => prev.map((c) => ({ ...c, isFlipped: false, isMatched: false })).sort(() => Math.random() - 0.5));
    }
  };

  const currentPair = pairs[currentPairIdx];

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-16">
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#7bd1fa]/15">
        <Link
          href="/student/dashboard"
          className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Về Bàn Học Tập
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Combo: {streak}x
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold">
            <Trophy className="w-3.5 h-3.5 text-cyan-400" /> Điểm: {score}
          </div>
        </div>
      </div>

      {!isGameOver ? (
        <div>
          {/* ══════════════════════════════════════════════════════════════════════════════
              ENGINE 1: QUANTUM MEMORY CARD MATCHING GAME (Ghép Cặp Thẻ Bài Tri Thức)
             ══════════════════════════════════════════════════════════════════════════════ */}
          {isCardMatchingEngine ? (
            <div className="max-w-4xl mx-auto rounded-3xl bg-[#0b0f19] border-2 border-purple-500/30 p-6 md:p-10 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <span className="font-mono text-[10px] uppercase text-purple-400 font-bold px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30">
                    🃏 Memory Card Matching Engine • Random Course Pairs
                  </span>
                  <h1 className="text-xl md:text-2xl font-bold text-white mt-1.5">{courseTitle}</h1>
                  <p className="text-xs text-[#8e9bb4]">
                    Lật và ghép đúng cặp <span className="text-cyan-300 font-bold">[Khái Niệm] ↔ [Định Nghĩa / Đáp Án]</span> để ghi điểm!
                  </p>
                </div>

                <div className="text-xs font-mono text-slate-400 bg-[#151b2c] px-3.5 py-2 rounded-xl border border-slate-800">
                  Lượt lật: <strong className="text-amber-300">{movesCount}</strong> | Đã khớp: <strong className="text-emerald-300">{cards.filter((c) => c.isMatched).length / 2} / {cards.length / 2}</strong>
                </div>
              </div>

              {/* Memory Grid (4x2 or 3x2) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {cards.map((card) => (
                  <div
                    key={card.uid}
                    onClick={() => handleCardClick(card)}
                    className={`h-40 md:h-48 rounded-2xl border-2 p-4 flex flex-col justify-between items-center text-center cursor-pointer transition-all duration-300 transform select-none relative ${
                      card.isMatched
                        ? "bg-gradient-to-b from-emerald-950/60 to-[#0f291e] border-emerald-500 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.35)] scale-[0.98]"
                        : card.isFlipped
                        ? "bg-gradient-to-b from-indigo-950/80 to-[#151b2c] border-cyan-400 text-white shadow-[0_0_25px_rgba(6,182,212,0.4)] scale-105"
                        : "bg-gradient-to-b from-[#131929] to-[#0d121f] border-slate-800 hover:border-purple-500/60 hover:scale-102"
                    }`}
                  >
                    {card.isFlipped || card.isMatched ? (
                      <div className="flex flex-col justify-between h-full w-full animate-fade-in">
                        <span
                          className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full self-start border ${
                            card.type === "term"
                              ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                              : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                          }`}
                        >
                          {card.type === "term" ? "Khái Niệm / Câu Hỏi" : "Đáp Án Đúng"}
                        </span>

                        <p className="text-xs md:text-sm font-bold my-auto line-clamp-4 leading-snug">
                          {card.text}
                        </p>

                        {card.isMatched && (
                          <span className="text-[10px] font-mono text-emerald-400 flex items-center justify-center gap-1 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Khớp Thành Công
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">E-V-E CARD</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : is3DHardwareLabEngine ? (
            /* ══════════════════════════════════════════════════════════════════════════════
                ENGINE 2: 3D COMPUTER HARDWARE LAB & ASSEMBLY SIMULATION
               ══════════════════════════════════════════════════════════════════════════════ */
            <div className="max-w-5xl mx-auto rounded-3xl bg-[#090d18] border-2 border-cyan-500/30 p-6 md:p-8 space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <span className="font-mono text-[10px] uppercase text-cyan-400 font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center gap-1 w-fit">
                    <Cpu className="w-3 h-3" /> 3D Spatial Hardware Lab & Assembly
                  </span>
                  <h1 className="text-xl md:text-2xl font-bold text-white mt-1.5">{courseTitle}</h1>
                  <p className="text-xs text-[#8e9bb4]">
                    Khám phá mô hình linh kiện phần cứng 3D, lắp ráp vào bo mạch chủ và kích hoạt công tắc nguồn để kiểm tra!
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleBootSystem}
                    className={`px-5 py-3 rounded-2xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      hardwareParts.every((p) => p.isInstalled)
                        ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-black shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:scale-105"
                        : "bg-[#151b2c] text-slate-500 border border-slate-800"
                    }`}
                  >
                    <Power className={`w-4 h-4 ${systemPowerOn ? "animate-spin text-emerald-700" : ""}`} />
                    {systemPowerOn ? "ĐANG KHỞI ĐỘNG..." : "BẬT NGUỒN PC (POWER ON)"}
                  </button>
                </div>
              </div>

              {/* 3D Motherboard Chassis & Component Selector */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 3D Interactive Motherboard Canvas View */}
                <div className="lg:col-span-2 rounded-2xl bg-[#060810] border-2 border-slate-800 p-6 flex flex-col justify-between min-h-[380px] relative overflow-hidden">
                  {/* Subtle PCB Grid Lines */}
                  <div
                    className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{
                      backgroundImage: "radial-gradient(#38bdf8 1px, transparent 1px)",
                      backgroundSize: "24px 24px",
                    }}
                  />

                  {/* Motherboard Header */}
                  <div className="flex items-center justify-between relative z-10">
                    <span className="font-mono text-[11px] text-cyan-400 font-bold flex items-center gap-1.5">
                      <Layers className="w-4 h-4" /> BO MẠCH CHỦ E-V-E Z790 AERO (LGA1700 / AM5)
                    </span>
                    <span className={`font-mono text-[10px] px-2.5 py-0.5 rounded-full border ${systemPowerOn ? "bg-emerald-500/20 text-emerald-300 border-emerald-400 animate-pulse" : "bg-slate-800 text-slate-500 border-slate-700"}`}>
                      {systemPowerOn ? "⚡ RGB POWERED ON" : "⚪ STANDBY"}
                    </span>
                  </div>

                  {/* Visual Hardware Slots on Motherboard */}
                  <div className="grid grid-cols-3 gap-3 my-auto py-6 relative z-10">
                    {hardwareParts.map((part) => (
                      <div
                        key={part.id}
                        onClick={() => setSelectedHardware(part)}
                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-2 relative ${
                          part.isInstalled
                            ? "bg-[#0c1824] border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                            : selectedHardware?.id === part.id
                            ? "bg-[#151b2c] border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                            : "bg-[#0e1320] border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${part.isInstalled ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"}`}>
                          {part.type.toUpperCase()}
                        </div>
                        <div className="text-[11px] font-bold font-sans">{part.name.split(" ")[0]}</div>
                        <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded ${part.isInstalled ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-800 text-slate-500"}`}>
                          {part.isInstalled ? "✓ Đã Lắp" : "+ Chưa Lắp"}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Boot Diagnostic Log */}
                  {systemPowerOn && (
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-[11px] font-mono text-emerald-300 flex items-center justify-between relative z-10">
                      <span>POST Test: OK | BIOS Loaded | Booting OS ({bootingProgress}%)</span>
                      <Activity className="w-4 h-4 animate-spin text-emerald-400" />
                    </div>
                  )}
                </div>

                {/* Component Inspector & Specs Drawer */}
                <div className="rounded-2xl bg-[#0f1524] border border-[#7bd1fa]/15 p-5 flex flex-col justify-between space-y-4">
                  {selectedHardware ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <span className="font-mono text-[10px] text-cyan-400 uppercase font-bold">
                          🔍 Chi Tiết Linh Kiện
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${selectedHardware.isInstalled ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}`}>
                          {selectedHardware.isInstalled ? "Đã lắp ráp" : "Sẵn sàng lắp"}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-bold text-base text-white">{selectedHardware.name}</h3>
                        <p className="text-xs text-[#8e9bb4] mt-1">{selectedHardware.desc}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-[#151b2c] border border-slate-800 text-xs font-mono space-y-1 text-slate-300">
                        <div className="text-cyan-300 font-bold">Thông số kỹ thuật (Specs):</div>
                        <div className="text-[11px]">{selectedHardware.specs}</div>
                      </div>

                      {!selectedHardware.isInstalled ? (
                        <button
                          onClick={() => handleInstallComponent(selectedHardware.id)}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-mono text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" /> Lắp Vào Bo Mạch Chủ (+25 pts)
                        </button>
                      ) : (
                        <div className="text-center p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-300 flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Linh kiện đã gắn hoàn hảo!
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-500 text-xs font-mono">
                      Chọn một linh kiện trên bo mạch chủ để xem thông số và lắp ráp.
                    </div>
                  )}

                  <div className="text-[10px] text-slate-500 font-mono text-center pt-2 border-t border-slate-800">
                    Tiến độ: {hardwareParts.filter((p) => p.isInstalled).length} / {hardwareParts.length} linh kiện
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ══════════════════════════════════════════════════════════════════════════════
                ENGINE 3: SPACE FLIGHT QUANTUM QUIZ ENGINE
               ══════════════════════════════════════════════════════════════════════════════ */
            <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-b from-[#0f1524] to-[#151b2c] border border-cyan-500/30 shadow-2xl p-6 md:p-10 space-y-8 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <span className="font-mono text-[10px] uppercase text-cyan-400 font-bold tracking-wider">
                    Game Engine: Space Flight Quiz 3D • Injecting Course Data
                  </span>
                  <h1 className="text-xl md:text-2xl font-bold text-white mt-1">{courseTitle}</h1>
                </div>

                <div className="font-mono text-xs text-slate-400">
                  Câu hỏi: <strong className="text-white">{currentPairIdx + 1}</strong> / {pairs.length}
                </div>
              </div>

              {currentPair && (
                <div className="space-y-6">
                  <div className="p-6 md:p-8 rounded-2xl bg-[#0a0e1a]/80 border border-cyan-500/20 text-center space-y-4">
                    {currentPair.image_url && (
                      <img
                        src={currentPair.image_url}
                        alt="Question visual"
                        className="max-h-48 rounded-xl mx-auto object-cover border border-slate-700 shadow-md"
                      />
                    )}
                    <h2 className="text-lg md:text-2xl font-bold text-white leading-relaxed">
                      {currentPair.title}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {shuffledOptions.map((opt, idx) => {
                      const isThisSelected = selectedAnswer === opt;
                      const right = currentPair.description || currentPair.rightAnswer;
                      const isThisRight = opt.trim() === right?.trim();

                      let btnStyle = "bg-[#151b2c] border-slate-800 text-white hover:border-cyan-400 hover:bg-cyan-950/20";
                      if (selectedAnswer !== null) {
                        if (isThisRight) {
                          btnStyle = "bg-emerald-500/25 border-emerald-500 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.4)]";
                        } else if (isThisSelected && !isCorrect) {
                          btnStyle = "bg-rose-500/25 border-rose-500 text-rose-200";
                        } else {
                          btnStyle = "bg-[#151b2c]/50 border-slate-900 text-slate-500";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectQuizOption(opt)}
                          disabled={selectedAnswer !== null}
                          className={`p-4 md:p-5 rounded-2xl border text-left font-sans text-sm md:text-base font-semibold transition-all cursor-pointer flex items-center justify-between gap-3 ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {selectedAnswer !== null && isThisRight && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                          )}
                          {selectedAnswer !== null && isThisSelected && !isCorrect && (
                            <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════════════════════════════
            GAME OVER VICTORY SCREEN
           ══════════════════════════════════════════════════════════════════════════════ */
        <div className="max-w-lg mx-auto rounded-3xl bg-[#0f1524]/95 backdrop-blur-xl border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.25)] p-8 md:p-10 text-center space-y-6 animate-scale-up">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 p-[2px] mx-auto shadow-[0_0_30px_rgba(245,158,11,0.5)]">
            <div className="w-full h-full bg-[#0a0e1a] rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-amber-400 animate-bounce" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Xuất Sắc Hoàn Thành! 🎉</h2>
            <p className="text-xs text-[#8e9bb4]">
              Bạn đã hoàn thành xuất sắc thử thách trò chơi và tích lũy kiến thức từ khóa học {courseTitle}.
            </p>
          </div>

          {/* Reward Box */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-around font-mono">
            <div>
              <div className="text-[11px] text-amber-300/80">Tổng Điểm</div>
              <div className="text-2xl font-bold text-white">{score}</div>
            </div>
            <div className="h-8 w-px bg-amber-500/20" />
            <div>
              <div className="text-[11px] text-amber-300/80">Thưởng Coins</div>
              <div className="text-2xl font-bold text-amber-400 flex items-center justify-center gap-1">
                <Coins className="w-5 h-5" /> +{earnedCoins}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="flex-1 py-3 rounded-xl bg-[#151b2c] hover:bg-white/5 border border-slate-700 text-white font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Chơi Lại
            </button>

            <Link href="/student/dashboard" className="flex-1">
              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-mono text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" /> Về Dashboard
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
