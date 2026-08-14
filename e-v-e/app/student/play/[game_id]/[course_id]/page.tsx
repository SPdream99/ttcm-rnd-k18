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
  VolumeX,
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
  Maximize2,
  Minimize2,
  Crown,
  Medal,
  Calendar,
  User,
  Info,
  Play,
  Share2,
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
        image_url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600",
      },
      {
        id: "hw2",
        title: "GPU (Graphics Processing Unit)",
        description: "Bộ xử lý đồ họa chuyên dụng với hàng ngàn lõi song song để kết xuất hình ảnh 3D và tính toán AI.",
        explanation: "GPU được thiết kế kiến trúc song song khổng lồ, chuyên dụng cho việc xử lý ma trận điểm ảnh 3D, dựng hình đồ họa và huấn luyện mô hình AI.",
        distractions: ["Ổ cứng thể rắn SSD", "Bo mạch chủ Motherboard", "Quạt tản nhiệt"],
        image_url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600",
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
        explanation: "Hàm print() là hàm tích hợp sẵn (built-in function) chuẩn trong Python dùng để in các đối tượng, chuỗi văn bản ra luồng xuất chuẩn stdout.",
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
  crs_ai_robotics: {
    title: "Bài 4: Khám Phá Trí Tuệ Nhân Tạo AI & Tương Lai Số",
    pairs: [
      {
        id: "ai1",
        title: "Học máy (Machine Learning) là gì?",
        description: "Phương pháp cho phép máy tính tự học hỏi từ dữ liệu mẫu để đưa ra dự đoán.",
        explanation: "Machine Learning là nhánh con của AI, huấn luyện các thuật toán dựa trên tập dữ liệu lịch sử để tự động nhận dạng quy luật mà không cần lập trình luật cứng.",
        distractions: ["Viết code thủ công từng dòng", "Phần cứng lưu trữ", "Hệ điều hành"],
      },
      {
        id: "ai2",
        title: "Mạng nơ-ron nhân tạo (Neural Network) mô phỏng cơ chế nào?",
        description: "Mô phỏng mạng lưới tế bào thần kinh sinh học trong não người.",
        explanation: "Artificial Neural Networks (ANN) gồm nhiều lớp nơ-ron liên kết với các trọng số (weights) và hàm kích hoạt, mô phỏng cách não người truyền và xử lý tín hiệu.",
        distractions: ["Hệ thống mạng internet", "Động cơ đốt trong", "Bánh răng đồng hồ"],
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
        explanation: "Hiện tượng quang điện (Einstein 1905) chứng minh năng lượng ánh sáng được hấp thụ và phát xạ dưới dạng các gói năng lượng rời rạc gọi là photon.",
        distractions: ["Tính chất sóng", "Tính chất phản xạ", "Tính chất tán sắc"],
      },
      {
        id: "p2",
        title: "Ai là người đề xuất phương trình hàm sóng mô tả trạng thái lượng tử?",
        description: "Erwin Schrödinger",
        explanation: "Nhà vật lý học người Áo Erwin Schrödinger đã đề xuất phương trình vi phân hàm sóng Psi mô tả xác suất tìm thấy hạt lượng tử theo không gian và thời gian.",
        distractions: ["Albert Einstein", "Niels Bohr", "Isaac Newton"],
      },
      {
        id: "p3",
        title: "Hằng số Planck có ký hiệu là gì?",
        description: "h",
        explanation: "Hằng số Planck (h = 6.626 x 10^-34 J.s) do Max Planck khám phá, là hằng số nền tảng biểu diễn quy mô năng lượng lượng tử E = hf.",
        distractions: ["c", "e", "k"],
      },
    ],
  },
};

// Metadata for standard built-in games
const GAME_METADATA: Record<string, { title: string; subtitle: string; category: string; description: string; author: string; controls: string; instructions: string[] }> = {
  game_space_quiz_3d: {
    title: "Quiz Runner 3D - Trắc Nghiệm Tốc Độ",
    subtitle: "Thử Thách Phản Xạ & Kiểm Tra Kiến Thức",
    category: "Action Quiz 3D",
    description: "Trò chơi trắc nghiệm tốc độ kết hợp phản xạ: Đọc kỹ câu hỏi trích xuất từ bài học và chọn đáp án chính xác nhất để ghi điểm, duy trì chuỗi combo và tích lũy Coins thưởng.",
    author: "GS. Nguyễn Văn An & Ban Học Thuật E-V-E",
    controls: "Sử dụng Chuột hoặc Phím Số (1, 2, 3, 4) để chọn nhanh đáp án.",
    instructions: [
      "Mỗi câu hỏi có 1 đáp án đúng và các phương án gây nhiễu.",
      "Trả lời đúng liên tiếp để kích hoạt hệ số nhân Combo x1.5, x2.0.",
      "Hoàn thành toàn bộ câu hỏi với độ chính xác cao để đạt chuẩn qua bài.",
    ],
  },
  game_hardware_3d_lab: {
    title: "Phòng Thí Nghiệm Lắp Ráp Máy Tính 3D",
    subtitle: "Mô Phỏng Kiến Trúc Phần Cứng Trực Quan",
    category: "3D Hardware Assembly",
    description: "Khám phá cấu tạo bên trong thùng máy PC: Chọn các linh kiện quan trọng (CPU, RAM, GPU, SSD, Bộ Nguồn PSU) và lắp ráp chuẩn xác vào Bo mạch chủ Motherboard để kích nguồn kiểm tra hệ thống.",
    author: "ThS. Phạm Hoàng Nam",
    controls: "Nhấp chuột chọn linh kiện trong khay và ấn 'Lắp Vào Bo Mạch'.",
    instructions: [
      "Chọn linh kiện từ danh sách bên trái để đọc thông số kỹ thuật (Specs).",
      "Bấm nút 'Lắp Vào Bo Mạch' để đưa linh kiện vào đúng khe cắm.",
      "Khi đã lắp đủ 5 linh kiện, bấm nút 'Kích Hoạt Nguồn & Khởi Động' để hoàn thành bài test.",
    ],
  },
  game_card_match_vr: {
    title: "Ghép Cặp Thẻ Bài Thuật Toán (Memory Match)",
    subtitle: "Luyện Trí Nhớ & Khắc Sâu Định Nghĩa",
    category: "Memory Card Matrix",
    description: "Trò chơi lật thẻ bài kinh điển: Tìm và ghép đôi thẻ chứa Khái niệm (Thuật ngữ) với thẻ chứa Định nghĩa tương ứng của bài học.",
    author: "TS. Lê Thị Mai",
    controls: "Nhấp chuột vào từng thẻ bài để lật và tìm cặp tương ứng.",
    instructions: [
      "Lật 2 thẻ bài trong mỗi lượt.",
      "Nếu 1 thẻ là Khái niệm và 1 thẻ là Định nghĩa chính xác của khái niệm đó, cặp thẻ sẽ được mở vĩnh viễn.",
      "Cố gắng hoàn thành với số lượt lật ít nhất để đạt điểm tối đa.",
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

interface LeaderboardRecord {
  id?: string;
  rank: number;
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

  // Game Metadata
  const currentGameMeta = GAME_METADATA[gameId] || {
    title: gameId.replace(/_/g, " ").toUpperCase(),
    subtitle: "Minigame Tương Tác Học Tập",
    category: "Interactive Minigame",
    description: "Minigame giáo dục trực quan, tương tác học liệu và củng cố kiến thức theo từng bài học.",
    author: "Giảng Viên E-V-E",
    controls: "Sử dụng Chuột hoặc Bàn phím để tương tác.",
    instructions: ["Hoàn thành các thử thách để nhận điểm và mở khóa bài học tiếp theo."],
  };

  const [courseTitle, setCourseTitle] = useState("Đang tải bài học...");
  const [pairs, setPairs] = useState<CourseContentPair[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [isSoundMuted, setIsSoundMuted] = useState(false);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const gameViewportRef = useRef<HTMLDivElement | null>(null);

  // Leaderboard state for THIS game in THIS course
  const [rankingList, setRankingList] = useState<LeaderboardRecord[]>([]);
  const [activeTab, setActiveTab] = useState<"game" | "leaderboard" | "guide">("game");

  // ── Engine Type Selector ──
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

  // ── Engine 3: Quiz Runner State ──
  const [currentPairIdx, setCurrentPairIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  // 1. Fetch Course Data & JSON Pairs
  useEffect(() => {
    async function loadCourse() {
      try {
        // Try server API first (which uses adminDb)
        const res = await fetch("/api/games/init", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gameId, courseId, userId: uid }),
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.pairs) && data.pairs.length > 0) {
          setCourseTitle(data.courseTitle || "Khóa Học E-V-E");
          setPairs(data.pairs);
          return;
        }
      } catch {
        // Fallback to client getDoc
      }

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
        // Fallback
      }

      // Fallback pairs
      const fallback = FALLBACK_COURSE_DATA[courseId] || FALLBACK_COURSE_DATA["crs_coding_basics"] || FALLBACK_COURSE_DATA["crs_computer_hardware"];
      setCourseTitle(fallback.title);
      setPairs(fallback.pairs);
    }
    loadCourse();
  }, [gameId, courseId, uid]);

  // 2. Fetch Leaderboard for THIS game in THIS course
  const loadLeaderboard = async () => {
    try {
      const res = await fetch(`/api/games/leaderboard?gameId=${encodeURIComponent(gameId)}&courseId=${encodeURIComponent(courseId)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.rankings)) {
        setRankingList(data.rankings);
      }
    } catch (e) {
      console.warn("Leaderboard fetch error:", e);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, [gameId, courseId]);

  // 3. Fullscreen Listeners
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
      gameViewportRef.current.requestFullscreen().catch((err) => {
        console.warn("Fullscreen request error:", err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // 4. Setup Card Matching Memory Grid
  useEffect(() => {
    if (isCardMatchingEngine && pairs.length > 0) {
      const generatedCards: MemoryCardItem[] = [];
      const chosenPairs = pairs.slice(0, 4);

      chosenPairs.forEach((pair, idx) => {
        const pId = pair.id || `p_${idx}`;
        generatedCards.push({
          uid: `${pId}_term`,
          pairId: pId,
          type: "term",
          text: pair.title,
          isFlipped: false,
          isMatched: false,
        });
        generatedCards.push({
          uid: `${pId}_def`,
          pairId: pId,
          type: "def",
          text: pair.description || (pair as any).rightAnswer || "Định nghĩa",
          isFlipped: false,
          isMatched: false,
        });
      });

      setCards(generatedCards.sort(() => Math.random() - 0.5));
      setSelectedCards([]);
      setMovesCount(0);
    }
  }, [pairs, isCardMatchingEngine]);

  // 5. Card Matching Click Logic
  const handleCardClick = (card: MemoryCardItem) => {
    if (card.isFlipped || card.isMatched || selectedCards.length >= 2) return;

    const newFlipped = cards.map((c) => (c.uid === card.uid ? { ...c, isFlipped: true } : c));
    setCards(newFlipped);
    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMovesCount((m) => m + 1);
      const [first, second] = newSelected;

      if (first.pairId === second.pairId && first.type !== second.type) {
        // MATCH!
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.pairId === first.pairId ? { ...c, isMatched: true, isFlipped: true } : c
            )
          );
          setSelectedCards([]);
          setScore((s) => s + 25);
          setStreak((st) => st + 1);

          // Check if all matched
          const allDone = newFlipped.every((c) => c.isMatched || c.pairId === first.pairId);
          if (allDone) {
            handleGameWin(100);
          }
        }, 500);
      } else {
        // MISMATCH
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.uid === first.uid || c.uid === second.uid ? { ...c, isFlipped: false } : c))
          );
          setSelectedCards([]);
          setStreak(0);
        }, 1000);
      }
    }
  };

  // 6. 3D Hardware Lab Component Install
  const handleInstallPart = (part: HardwareComponent) => {
    if (part.isInstalled) return;

    setHardwareParts((prev) =>
      prev.map((p) => (p.id === part.id ? { ...p, isInstalled: true } : p))
    );
    setScore((s) => s + 20);

    const nextUninstalled = hardwareParts.find((p) => !p.isInstalled && p.id !== part.id);
    if (nextUninstalled) {
      setSelectedHardware(nextUninstalled);
    }
  };

  // 7. 3D Hardware Lab Power On Boot sequence
  const handlePowerOn = () => {
    const allInstalled = hardwareParts.every((p) => p.isInstalled);
    if (!allInstalled) return;

    setSystemPowerOn(true);
    let prog = 0;
    const interval = setInterval(() => {
      prog += 20;
      setBootingProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        handleGameWin(100);
      }
    }, 400);
  };

  // 8. Quiz Runner Option Shuffle
  useEffect(() => {
    if (!isCardMatchingEngine && !is3DHardwareLabEngine && pairs.length > 0) {
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
  }, [pairs, currentPairIdx, isCardMatchingEngine, is3DHardwareLabEngine]);

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

  // 9. Game Win Completion Handler & Anti-Cheat sync
  const handleGameWin = async (finalScoreValue: number) => {
    setIsGameOver(true);
    const coinsWon = Math.round(finalScoreValue * 0.5);
    setEarnedCoins(coinsWon);

    // Call /api/games/finish
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
    } catch (e) {
      console.warn("Finish API call error:", e);
    }

    // Refresh Leaderboard
    setTimeout(() => {
      loadLeaderboard();
    }, 1000);
  };

  // Reset Game
  const handleRestart = () => {
    setIsGameOver(false);
    setScore(0);
    setStreak(0);
    setCurrentPairIdx(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setMovesCount(0);
    setSystemPowerOn(false);
    setBootingProgress(0);

    if (isCardMatchingEngine && pairs.length > 0) {
      const regenerated: MemoryCardItem[] = [];
      pairs.slice(0, 4).forEach((pair, idx) => {
        const pId = pair.id || `p_${idx}`;
        regenerated.push({
          uid: `${pId}_term`,
          pairId: pId,
          type: "term",
          text: pair.title,
          isFlipped: false,
          isMatched: false,
        });
        regenerated.push({
          uid: `${pId}_def`,
          pairId: pId,
          type: "def",
          text: pair.description || (pair as any).rightAnswer || "Định nghĩa",
          isFlipped: false,
          isMatched: false,
        });
      });
      setCards(regenerated.sort(() => Math.random() - 0.5));
      setSelectedCards([]);
    }

    if (is3DHardwareLabEngine) {
      setHardwareParts((prev) => prev.map((p) => ({ ...p, isInstalled: false })));
      setSelectedHardware(hardwareParts[0]);
    }
  };

  const currentPair = pairs[currentPairIdx];

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-12">
      {/* ══════════════════════════════════════════════════════════════════════════
          1. TOP NAVIGATION & BREADCRUMB: TÊN TRÒ CHƠI KÈM TÊN KHÓA HỌC
         ══════════════════════════════════════════════════════════════════════════ */}
      <div className="p-4 md:p-5 rounded-2xl bg-[#0f1524]/90 border border-cyan-500/25 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/student/games"
            className="p-2 rounded-xl bg-[#151b2c] hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer border border-slate-700"
            title="Quay lại Kho Trò Chơi Arcade"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          {/* Breadcrumb badges */}
          <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
            <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-bold flex items-center gap-1.5">
              <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
              Trò chơi: {currentGameMeta.title}
            </span>
            <span className="text-slate-500">▶</span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold flex items-center gap-1.5 truncate max-w-md">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              Khóa học: {courseTitle}
            </span>
          </div>
        </div>

        {/* Action Controls: Fullscreen, Sound, Tabs */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-mono text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer flex items-center gap-1.5 hover:scale-105"
            title="Mở toàn màn hình trò chơi"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span>{isFullscreen ? "Thu Nhỏ" : "Toàn Màn Hình"}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setIsSoundMuted(!isSoundMuted)}
            className="p-2 rounded-xl bg-[#151b2c] hover:bg-slate-800 text-slate-300 border border-slate-700 transition-all cursor-pointer"
            title={isSoundMuted ? "Bật âm thanh" : "Tắt âm thanh"}
          >
            {isSoundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Score & Streak counter */}
          <div className="px-3.5 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>{score} Điểm</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          2. NAVIGATION TABS (GAME VIEW | LEADERBOARD CỦA GAME | HƯỚNG DẪN)
         ══════════════════════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab("game")}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
            activeTab === "game"
              ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
              : "bg-[#151b2c] text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          <Play className="w-3.5 h-3.5 text-cyan-400" /> Màn Chơi Tương Tác
        </button>

        <button
          onClick={() => setActiveTab("leaderboard")}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
            activeTab === "leaderboard"
              ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.25)]"
              : "bg-[#151b2c] text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-amber-400" /> Bảng Xếp Hạng Game Này ({rankingList.length})
        </button>

        <button
          onClick={() => setActiveTab("guide")}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
            activeTab === "guide"
              ? "bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.25)]"
              : "bg-[#151b2c] text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          <Info className="w-3.5 h-3.5 text-purple-400" /> Thông Tin & Cách Chơi
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          3. MAIN CONTENT (GAME CONTAINER / LEADERBOARD TAB / GUIDE TAB)
         ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === "game" && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
          {/* Game Viewport Container (Supports Fullscreen API) */}
          <div
            ref={gameViewportRef}
            className={`xl:col-span-3 rounded-3xl bg-[#0a0e1a] border border-[#7bd1fa]/20 shadow-2xl relative overflow-hidden transition-all flex flex-col justify-between ${
              isFullscreen ? "p-6 md:p-10 min-h-screen bg-gradient-to-b from-[#080c16] via-[#0a0e1a] to-[#04060b]" : "p-5 md:p-8 min-h-[560px]"
            }`}
          >
            {/* Ambient Background Grid */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: "linear-gradient(to right, #06b6d4 1px, transparent 1px), linear-gradient(to bottom, #06b6d4 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* In-Game Top HUD Bar */}
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-800 relative z-10">
              <div className="space-y-0.5">
                <div className="text-[11px] font-mono text-cyan-400 uppercase font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  {currentGameMeta.category} • {courseTitle}
                </div>
                <h2 className="text-lg md:text-xl font-bold text-white tracking-wide">{currentGameMeta.title}</h2>
              </div>

              <div className="flex items-center gap-2">
                {streak > 1 && (
                  <div className="px-3 py-1 rounded-lg bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-mono font-bold flex items-center gap-1 animate-bounce">
                    <Flame className="w-3.5 h-3.5 fill-orange-400" /> Combo x{streak}
                  </div>
                )}
                {/* Fullscreen Floating Toggle inside game viewport */}
                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-lg bg-[#151b2c] hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700 transition-all cursor-pointer"
                  title="Bật/Tắt Toàn Màn Hình"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Game Canvas / Active Engine Content */}
            <div className="my-auto py-6 relative z-10">
              {isGameOver ? (
                /* Win Celebration Modal View */
                <div className="max-w-md mx-auto p-8 rounded-3xl bg-[#0f1524] border border-cyan-500/40 shadow-2xl text-center space-y-6 animate-scale-up">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 p-1 shadow-[0_0_30px_rgba(245,158,11,0.5)] flex items-center justify-center">
                    <Trophy className="w-10 h-10 text-black" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-white">Xuất Sắc! Hoàn Thành Bài Chơi 🎉</h3>
                    <p className="text-xs text-slate-300">
                      Bạn đã hoàn thành thử thách tương tác cho bài học <strong className="text-cyan-300">{courseTitle}</strong>.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#151b2c] border border-slate-800">
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Tổng Điểm</div>
                      <div className="text-xl font-bold font-mono text-white">{score} PTS</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-amber-400 uppercase">Coins Thưởng</div>
                      <div className="text-xl font-bold font-mono text-amber-300">+{earnedCoins} 🪙</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleRestart}
                      className="flex-1 py-3 rounded-xl bg-[#151b2c] hover:bg-slate-800 text-slate-200 font-mono text-xs font-bold border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" /> Chơi Lại
                    </button>
                    <Link href="/student/learning-paths" className="flex-1">
                      <button className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-mono text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer">
                        Tiếp Tục Lộ Trình →
                      </button>
                    </Link>
                  </div>
                </div>
              ) : isCardMatchingEngine ? (
                /* ═══════════════════════════════════════════════════════════════
                   ENGINE 1: MEMORY CARD MATCH MATRIX
                   ═══════════════════════════════════════════════════════════════ */
                <div className="space-y-6">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Số lượt lật: <strong className="text-white">{movesCount}</strong></span>
                    <span>Đã ghép: <strong className="text-cyan-300">{cards.filter((c) => c.isMatched).length / 2} / {cards.length / 2} cặp</strong></span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
                    {cards.map((card) => {
                      const isRevealed = card.isFlipped || card.isMatched;

                      return (
                        <div
                          key={card.uid}
                          onClick={() => handleCardClick(card)}
                          className={`h-36 rounded-2xl border p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 select-none shadow-lg relative ${
                            card.isMatched
                              ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                              : isRevealed
                              ? "bg-[#151b2c] border-cyan-500/60 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] scale-105"
                              : "bg-[#0f1524] hover:bg-[#151b2c] border-slate-800 text-slate-400 hover:border-cyan-500/40"
                          }`}
                        >
                          {isRevealed ? (
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-cyan-300">
                                {card.type === "term" ? "Khái Niệm" : "Định Nghĩa"}
                              </span>
                              <p className="text-xs font-semibold leading-snug line-clamp-4">{card.text}</p>
                              {card.isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto mt-1" />}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Sparkles className="w-6 h-6 text-cyan-400/50 mx-auto" />
                              <div className="text-[11px] font-mono text-slate-500">Lật Thẻ</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : is3DHardwareLabEngine ? (
                /* ═══════════════════════════════════════════════════════════════
                   ENGINE 2: 3D HARDWARE ASSEMBLY LAB
                   ═══════════════════════════════════════════════════════════════ */
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    {/* Component Selector Tray */}
                    <div className="space-y-2.5">
                      <div className="text-xs font-mono text-cyan-400 uppercase font-bold">Khay Linh Kiện ({hardwareParts.filter((p) => p.isInstalled).length}/5)</div>
                      {hardwareParts.map((part) => (
                        <button
                          key={part.id}
                          onClick={() => setSelectedHardware(part)}
                          className={`w-full p-3 rounded-xl text-left font-mono text-xs transition-all flex items-center justify-between border cursor-pointer ${
                            selectedHardware?.id === part.id
                              ? "bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                              : part.isInstalled
                              ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                              : "bg-[#151b2c] border-slate-800 text-slate-400 hover:text-white"
                          }`}
                        >
                          <div className="truncate font-semibold">{part.name}</div>
                          {part.isInstalled ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <Layers className="w-4 h-4 text-slate-500 shrink-0" />}
                        </button>
                      ))}
                    </div>

                    {/* Central 3D Motherboard View */}
                    <div className="md:col-span-2 p-6 rounded-3xl bg-[#090d18] border border-cyan-500/30 shadow-2xl text-center space-y-4 relative">
                      <div className="text-xs font-mono text-slate-400">
                        Bo Mạch Chủ Motherboard • ATX Gaming Form Factor
                      </div>

                      {/* Motherboard Layout Mock */}
                      <div className="p-6 rounded-2xl bg-[#05070d] border border-slate-800 grid grid-cols-3 gap-3 min-h-[180px] items-center">
                        <div className={`p-3 rounded-xl border text-xs font-mono ${hardwareParts.find((p) => p.id === "p_cpu")?.isInstalled ? "bg-blue-950/40 border-blue-400 text-blue-300" : "border-dashed border-slate-800 text-slate-600"}`}>
                          [Socket CPU] {hardwareParts.find((p) => p.id === "p_cpu")?.isInstalled ? "✓ Đã Lắp CPU" : "Trống"}
                        </div>
                        <div className={`p-3 rounded-xl border text-xs font-mono ${hardwareParts.find((p) => p.id === "p_ram")?.isInstalled ? "bg-emerald-950/40 border-emerald-400 text-emerald-300" : "border-dashed border-slate-800 text-slate-600"}`}>
                          [Khe DIMM RAM] {hardwareParts.find((p) => p.id === "p_ram")?.isInstalled ? "✓ Đã Lắp RAM" : "Trống"}
                        </div>
                        <div className={`p-3 rounded-xl border text-xs font-mono ${hardwareParts.find((p) => p.id === "p_ssd")?.isInstalled ? "bg-amber-950/40 border-amber-400 text-amber-300" : "border-dashed border-slate-800 text-slate-600"}`}>
                          [Khe M.2 NVMe] {hardwareParts.find((p) => p.id === "p_ssd")?.isInstalled ? "✓ Đã Lắp SSD" : "Trống"}
                        </div>
                        <div className={`col-span-2 p-3 rounded-xl border text-xs font-mono ${hardwareParts.find((p) => p.id === "p_gpu")?.isInstalled ? "bg-purple-950/40 border-purple-400 text-purple-300" : "border-dashed border-slate-800 text-slate-600"}`}>
                          [Khe PCIe x16 GPU] {hardwareParts.find((p) => p.id === "p_gpu")?.isInstalled ? "✓ Đã Lắp Card Đồ Họa RTX" : "Trống"}
                        </div>
                        <div className={`p-3 rounded-xl border text-xs font-mono ${hardwareParts.find((p) => p.id === "p_psu")?.isInstalled ? "bg-cyan-950/40 border-cyan-400 text-cyan-300" : "border-dashed border-slate-800 text-slate-600"}`}>
                          [Đầu Cấp Nguồn 24-Pin] {hardwareParts.find((p) => p.id === "p_psu")?.isInstalled ? "✓ Đã Cắm PSU" : "Trống"}
                        </div>
                      </div>

                      {/* Selected Part Action */}
                      {selectedHardware && !selectedHardware.isInstalled && (
                        <div className="p-4 rounded-xl bg-[#151b2c] border border-cyan-500/30 flex items-center justify-between gap-3">
                          <div className="text-left">
                            <div className="font-bold text-xs text-white">{selectedHardware.name}</div>
                            <div className="text-[11px] text-slate-400">{selectedHardware.desc}</div>
                          </div>
                          <button
                            onClick={() => handleInstallPart(selectedHardware)}
                            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer shrink-0"
                          >
                            + Lắp Vào Bo Mạch
                          </button>
                        </div>
                      )}

                      {/* Power Boot Trigger Button */}
                      {hardwareParts.every((p) => p.isInstalled) && !systemPowerOn && (
                        <button
                          onClick={handlePowerOn}
                          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-mono font-black text-sm shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2 animate-pulse"
                        >
                          <Power className="w-5 h-5" /> KÍCH HOẠT NGUỒN & KHỞI ĐỘNG HỆ THỐNG
                        </button>
                      )}

                      {systemPowerOn && (
                        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 space-y-2">
                          <div className="font-mono text-xs font-bold flex items-center justify-center gap-2">
                            <Activity className="w-4 h-4 animate-spin" /> Đang chạy POST Diagnostic & Boot OS... ({bootingProgress}%)
                          </div>
                          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                            <div className="bg-emerald-400 h-full transition-all duration-300" style={{ width: `${bootingProgress}%` }} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* ═══════════════════════════════════════════════════════════════
                   ENGINE 3: QUIZ RUNNER 3D
                   ═══════════════════════════════════════════════════════════════ */
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Câu hỏi: <strong className="text-white">{currentPairIdx + 1}</strong> / {pairs.length}</span>
                    <span>Tiến độ: <strong className="text-cyan-300">{Math.round(((currentPairIdx + 1) / pairs.length) * 100)}%</strong></span>
                  </div>

                  {currentPair && (
                    <div className="p-6 md:p-8 rounded-3xl bg-[#0f1524] border border-cyan-500/30 shadow-2xl space-y-6">
                      <h3 className="text-base md:text-lg font-bold text-white text-center leading-relaxed">
                        {currentPair.title}
                      </h3>

                      <div className="grid grid-cols-1 gap-3">
                        {shuffledOptions.map((option, idx) => {
                          const isPicked = selectedAnswer === option;
                          const isRightAnswer = option === (currentPair.description || (currentPair as any).rightAnswer);

                          let style = "bg-[#151b2c] hover:bg-slate-800 border-slate-700 text-slate-200";
                          if (selectedAnswer !== null) {
                            if (isRightAnswer) {
                              style = "bg-emerald-950/60 border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.3)]";
                            } else if (isPicked) {
                              style = "bg-rose-950/60 border-rose-500 text-rose-200";
                            } else {
                              style = "bg-[#0f1524] border-slate-800 text-slate-500 opacity-50";
                            }
                          }

                          return (
                            <button
                              key={idx}
                              disabled={selectedAnswer !== null}
                              onClick={() => handleSelectQuizAnswer(option)}
                              className={`p-4 rounded-2xl border text-left font-sans text-xs md:text-sm font-medium transition-all flex items-center justify-between gap-3 cursor-pointer ${style}`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                                  {String.fromCharCode(65 + idx)}
                                </span>
                                <span>{option}</span>
                              </div>
                              {selectedAnswer !== null && isRightAnswer && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                              {selectedAnswer !== null && isPicked && !isRightAnswer && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Knowledge Explanation Banner */}
                      {selectedAnswer !== null && (currentPair.explanation || (currentPair as any).explain) && (
                        <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 text-xs space-y-1.5 animate-fade-in shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                          <div className="font-bold font-mono text-[11px] text-cyan-300 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Giải thích kiến thức:
                          </div>
                          <p className="leading-relaxed text-slate-200">
                            {currentPair.explanation || (currentPair as any).explain}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* In-Game Bottom Status Bar */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-4 border-t border-slate-800 relative z-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>Người chơi: <strong className="text-white">{studentName}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRestart}
                  className="px-3 py-1.5 rounded-lg bg-[#151b2c] hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer border border-slate-700 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Chơi Lại
                </button>
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════════
              SIDEBAR: TITLE, MÔ TẢ GAME & BẢNG XẾP HẠNG CỦA GAME NÀY TRONG COURSE
             ════════════════════════════════════════════════════════════════════ */}
          <div className="space-y-6">
            {/* Game Description & Metadata Card */}
            <div className="p-5 md:p-6 rounded-3xl bg-[#0f1524]/90 border border-[#7bd1fa]/15 shadow-xl space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  {currentGameMeta.category}
                </span>
                <span className="font-mono text-[10px] text-slate-400">v2.0 E-V-E SDK</span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">{currentGameMeta.title}</h3>
                <p className="text-xs text-[#8e9bb4] leading-relaxed">
                  {currentGameMeta.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2 text-xs font-mono">
                <div className="text-slate-400">
                  Biên soạn: <strong className="text-white">{currentGameMeta.author}</strong>
                </div>
                <div className="text-slate-400">
                  Điều khiển: <strong className="text-cyan-300">{currentGameMeta.controls}</strong>
                </div>
              </div>
            </div>

            {/* Quick Leaderboard Preview for this Game in this Course */}
            <div className="p-5 md:p-6 rounded-3xl bg-[#0f1524]/90 border border-amber-500/20 shadow-xl space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" /> BXH Game Trong Khóa Học
                </h4>
                <button
                  onClick={() => setActiveTab("leaderboard")}
                  className="text-xs font-mono text-cyan-400 hover:underline cursor-pointer"
                >
                  Xem tất cả →
                </button>
              </div>

              <div className="space-y-2 font-mono text-xs">
                {rankingList.slice(0, 4).map((rec, idx) => (
                  <div
                    key={rec.id || idx}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                      idx === 0
                        ? "bg-amber-500/15 border-amber-500/30 text-amber-300"
                        : "bg-[#151b2c] border-slate-800 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-bold w-4 text-center">
                        {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                      </span>
                      <span className="truncate">{rec.name}</span>
                    </div>
                    <span className="font-bold text-white shrink-0">{rec.score} pts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          TAB 2: FULL LEADERBOARD CỦA RIÊNG GAME NÀY TRONG COURSE NÀY
         ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === "leaderboard" && (
        <div className="p-6 md:p-8 rounded-3xl bg-[#0f1524]/90 border border-amber-500/30 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="font-mono text-xs text-amber-400 font-bold uppercase flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" /> Bảng Xếp Hạng Thành Tích Riêng
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
                {currentGameMeta.title} • {courseTitle}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Danh sách những học viên đạt điểm cao nhất khi chơi trò chơi này trong khuôn khổ bài học.
              </p>
            </div>

            <button
              onClick={() => setActiveTab("game")}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" /> Vào Chơi Ngay
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-3 px-4">Hạng</th>
                  <th className="py-3 px-4">Học Viên</th>
                  <th className="py-3 px-4 text-center">Điểm Số</th>
                  <th className="py-3 px-4 text-center">Thời Gian Hoàn Thành</th>
                  <th className="py-3 px-4 text-center">Độ Chính Xác</th>
                  <th className="py-3 px-4 text-right">Ngày Ghi Danh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {rankingList.map((record, index) => (
                  <tr
                    key={record.id || index}
                    className={`hover:bg-white/5 transition-colors ${
                      index === 0
                        ? "bg-amber-500/10 text-amber-300 font-bold"
                        : index === 1
                        ? "bg-slate-500/10 text-slate-200"
                        : index === 2
                        ? "bg-amber-800/10 text-amber-400"
                        : "text-slate-300"
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold">
                      {index === 0 ? "🥇 Hạng 1" : index === 1 ? "🥈 Hạng 2" : index === 2 ? "🥉 Hạng 3" : `#${index + 1}`}
                    </td>
                    <td className="py-3.5 px-4 font-sans font-semibold text-white flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-cyan-400" />
                      {record.name}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-amber-300">
                      {record.score} pts
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-400">
                      {record.playTime}
                    </td>
                    <td className="py-3.5 px-4 text-center text-emerald-400 font-bold">
                      {record.accuracy}%
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-400">
                      {record.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          TAB 3: HƯỚNG DẪN CHI TIẾT & CƠ CHẾ TÍCH ĐIỂM
         ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === "guide" && (
        <div className="p-6 md:p-8 rounded-3xl bg-[#0f1524]/90 border border-purple-500/30 shadow-2xl space-y-6">
          <div>
            <div className="font-mono text-xs text-purple-400 font-bold uppercase flex items-center gap-2">
              <Info className="w-4 h-4 text-purple-400" /> Hướng Dẫn Trò Chơi & Cơ Chế Đổi Thưởng
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
              Luật Chơi & Thưởng Coins: {currentGameMeta.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-[#151b2c] border border-slate-800 space-y-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Sparkle className="w-4 h-4 text-cyan-400" /> Hướng Dẫn Từng Bước
              </h3>
              <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside leading-relaxed">
                {currentGameMeta.instructions.map((inst, i) => (
                  <li key={i}>{inst}</li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-[#151b2c] border border-slate-800 space-y-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-400" /> Cơ Chế Tích Lũy Coins
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Khi hoàn thành màn chơi với điểm số $\ge 80\%$, hệ thống tự động cộng Coins vào tài khoản học viên và mở khóa bài học kế tiếp trên Lộ trình học tập.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setActiveTab("game")}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-mono text-xs font-bold transition-all cursor-pointer"
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
