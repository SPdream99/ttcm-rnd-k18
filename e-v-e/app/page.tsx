"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  ArrowRight,
  Play,
  Rocket,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Layers,
  ChevronRight,
  Zap,
  Cpu,
  Star,
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { getAuthCookie } from "@/lib/cookies";

const ROTATING_TOPICS = [
  "Lập Trình Python",
  "Tư Duy Thuật Toán",
  "Minigame Tương Tác",
  "Cấu Trúc Dữ Liệu",
  "Gia Sư Trực Tuyến AI",
];

const MODULE_TILES = [
  {
    id: "tile_1",
    title: "Lớp Học & Bài Tập Trực Tuyến",
    desc: "Quản lý lớp học, giao bài tập và theo dõi tiến độ của từng học viên.",
  },
  {
    id: "tile_2",
    title: "Bảng Xếp Hạng & Thành Tích",
    desc: "Thi đua bạn bè qua bảng xếp hạng thời gian thực và thống kê thành tích cá nhân.",
  },
  {
    id: "tile_3",
    title: "Bản Đồ Lộ Trình Phân Chặng",
    desc: "Vượt qua từng chặng bài học theo thứ tự logic, mở khóa chặng mới khi đạt chuẩn.",
  },
  {
    id: "tile_4",
    title: "Trợ Lý Sư Phạm AI 24/7",
    desc: "Giải thích chi tiết thuật toán, gợi ý sửa lỗi code và hỗ trợ học sinh tức thì.",
  },
  {
    id: "tile_5",
    title: "Tích Lũy Coins & Đổi Quà",
    desc: "Học tập để cày Coins, đổi Khung Avatar và Huy hiệu danh giá.",
  },
  {
    id: "tile_6",
    title: "Tự Do Xuất Bản Game & Bài Học",
    desc: "Giáo viên tải gói Game .zip hoặc soạn cặp câu hỏi chỉ với vài cú click.",
  },
];

const STEPS_DATA = [
  {
    step: "01",
    title: "Chọn Lộ Trình Học Tập Cá Nhân Hóa",
    tagline: "Bản đồ phân nhánh từ Căn bản đến Nâng cao",
    desc: "Khám phá các lộ trình lập trình Python, Web, Cấu trúc dữ liệu hoặc các bài học mở rộng do giáo viên thiết kế. Mọi tiến độ đều được lưu vết thời gian thực trên đám mây.",
    tags: ["Learning Path", "Phân Chặng Tự Động", "Lưu Trữ Đám Mây"],
  },
  {
    step: "02",
    title: "Chinh Phục Thử Thách Cùng Game SDK",
    tagline: "Biến lý thuyết khô khan thành màn chơi lôi cuốn",
    desc: "Mỗi chặng bài học gắn liền với trò chơi tương tác: Lật thẻ bài, đấu Boss phản xạ, giải đố ma trận. Game tự động nạp câu hỏi và chấm điểm chính xác.",
    tags: ["Game Hóa", "E-V-E SDK v2.0", "Leaderboard Realtime"],
  },
  {
    step: "03",
    title: "Trợ Giảng AI & Đổi Thưởng Cực Đã",
    tagline: "Đồng hành 24/7 và hệ sinh thái quà tặng hấp dẫn",
    desc: "Gặp khó khăn khi giải bài? Hỏi ngay Gia Sư AI. Hoàn thành nhiệm vụ nhận Coins để mở khóa vật phẩm độc quyền trong Cửa Hàng E-V-E.",
    tags: ["Gia Sư AI", "Coins Đổi Quà", "Khung Avatar Độc Quyền"],
  },
];

export default function Home() {
  const router = useRouter();
  const { currentUser, profile } = useAuthAdapter();

  const [topicIndex, setTopicIndex] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const [splashFade, setSplashFade] = useState(false);

  // Splash Screen Intro Animation (Flash / Pulse then Fade Out)
  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setSplashFade(true);
    }, 1500);

    const removeTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2200);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  useEffect(() => {
    // Chỉ tự động chuyển hướng sang Dashboard nếu có login cookie hợp lệ
    const authCookie = getAuthCookie();
    if (!authCookie || !authCookie.email || !authCookie.role) return;

    if (authCookie.role === "admin" || authCookie.role === "school") {
      router.replace("/admin/dashboard");
    } else if (authCookie.role === "teacher") {
      if (authCookie.status === "pending") {
        router.replace("/pending");
      } else {
        router.replace("/teacher/dashboard");
      }
    } else {
      router.replace("/student/dashboard");
    }
  }, [router]);

  // Topic text animation ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setTopicIndex((prev) => (prev + 1) % ROTATING_TOPICS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans overflow-x-hidden selection:bg-red-600 selection:text-white">
      {/* ══════════════════════════════════════════════════════════════════════════════
          0. INTRO SPLASH SCREEN (LOGO FLASH & PULSE -> FULLSCREEN FADE OUT)
         ══════════════════════════════════════════════════════════════════════════════ */}
      {showSplash && (
        <div
          className={`fixed inset-0 z-[100] bg-zinc-950 flex flex-col items-center justify-center transition-all duration-700 pointer-events-none ${
            splashFade ? "opacity-0 scale-105" : "opacity-100 scale-100"
          }`}
        >
          {/* Ambient Lighting / Glow Effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.25),transparent_65%)]" />
          
          {/* Pulsing / Glowing Center Logo */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="relative p-8">
              {/* Outer Glowing Pulsing Rings */}
              <div className="absolute inset-0 rounded-full bg-red-600/30 blur-3xl animate-ping opacity-75" />
              <div className="absolute inset-4 rounded-full bg-red-500/20 blur-2xl animate-pulse" />

              {/* Center Logo with Flicker / Glow */}
              <img
                src="/logo.png"
                alt="E-V-E"
                className="relative z-10 w-48 sm:w-64 md:w-80 h-auto object-contain drop-shadow-[0_0_40px_rgba(239,68,68,0.7)] animate-pulse"
                style={{ maxHeight: "240px", width: "auto" }}
              />
            </div>
          </div>
        </div>
      )}

      <Navbar />

      {/* ══════════════════════════════════════════════════════════════════════════════
          1. HERO SECTION (DIGITAL METAL INSPIRED INDUSTRIAL PRECISION GRID)
         ══════════════════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-24 lg:pt-32 pb-16 md:pb-24 border-b border-zinc-200 overflow-hidden bg-zinc-50/60">
        {/* Precision Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">


          {/* Main Hero Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Bold Typography & Ticker */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="space-y-2">
                <span className="font-mono text-xs uppercase tracking-widest text-red-600 font-bold block">
                  E - V - E
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950 uppercase leading-[1.05]">
                  <span className="block text-zinc-400">Chinh Phục</span>
                  <span className="block text-red-600 h-[1.15em] overflow-hidden">
                    <span
                      key={topicIndex}
                      className="inline-block transition-transform duration-500 animate-in slide-in-from-bottom-6"
                    >
                      {ROTATING_TOPICS[topicIndex]}
                    </span>
                  </span>
                  <span className="block text-zinc-950">Qua Từng Màn Chơi.</span>
                </h1>
              </div>

              <p className="text-base sm:text-lg text-zinc-600 max-w-xl leading-relaxed">
                Nền tảng giáo dục game hóa thế hệ mới: Kết hợp bài giảng trực quan, minigame giải thuật kích thích tư duy, kinh tế thưởng Coins và Gia sư AI đồng hành thời gian thực.
              </p>

              {/* Action Button Row */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/register">
                  <button className="px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-mono text-xs uppercase font-bold tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-sm hover:shadow-md hover:scale-[1.02]">
                    <Rocket className="w-4 h-4" /> Bắt Đầu Học Miễn Phí
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>

                <Link href="/login">
                  <button className="px-6 py-3.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 font-mono text-xs uppercase font-bold tracking-wider transition-all cursor-pointer flex items-center gap-2 border border-zinc-300">
                    <Play className="w-4 h-4 text-red-600 fill-red-600" /> Cổng Đăng Nhập
                  </button>
                </Link>

                <Link href="/teacher/game-sdk-guide">
                  <span className="text-xs font-mono text-zinc-500 hover:text-red-600 underline font-bold px-2 py-1 transition-colors">
                    Tài liệu Game SDK →
                  </span>
                </Link>
              </div>

              {/* Motto Banner */}
              <div className="pt-6 border-t border-zinc-200">
                <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-600 block">Triết Lý Giáo Dục E-V-E</span>
                    <h3 className="text-sm md:text-base font-bold text-zinc-900 leading-tight">
                      Học bằng niềm vui và trải nghiệm
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Static Game Preview */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-5 shadow-xl text-white">
                <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 space-y-3">
                  <p className="text-sm text-zinc-100 font-semibold leading-relaxed">
                    Trong Python, lệnh nào dùng để xuất thông tin ra màn hình console?
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500 text-emerald-300 font-mono text-xs font-bold">
                      A. print()
                    </div>
                    <div className="p-2.5 rounded-lg bg-zinc-800/80 border border-zinc-700 text-zinc-400 font-mono text-xs">
                      B. echo()
                    </div>
                    <div className="p-2.5 rounded-lg bg-zinc-800/80 border border-zinc-700 text-zinc-400 font-mono text-xs">
                      C. console.log()
                    </div>
                    <div className="p-2.5 rounded-lg bg-zinc-800/80 border border-zinc-700 text-zinc-400 font-mono text-xs">
                      D. output()
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════════
           2. FEATURE MODULES
          ══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-24 bg-white border-b border-zinc-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">
              Tính Năng
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-950 tracking-tight">
              Các Khối Tính Năng Nền Tảng
            </h2>
            <p className="text-sm md:text-base text-zinc-600">
              Học tập, giảng dạy và quản lý nội dung trong một nền tảng duy nhất.
            </p>
          </div>

          {/* 6 Feature Modules */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MODULE_TILES.map((tile) => (
              <div
                key={tile.id}
                className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-base font-bold text-zinc-900 mb-2">
                  {tile.title}
                </h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  {tile.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════════
          3. MANIFESTO SECTION (LARGE STATEMENT WITH BOLD ACCENTS)
         ══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-zinc-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.15)_0,transparent_70%)] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-8">
          <span className="font-mono text-xs uppercase tracking-widest text-red-500 font-bold px-3 py-1 rounded-full border border-red-900 bg-red-950/50">
            E-V-E Philosophy
          </span>

          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight text-zinc-400 leading-tight">
            Mỗi giờ học thụ động là một cơ hội kích thích{" "}
            <span className="text-white">tư duy logic bị bỏ lỡ.</span>
          </p>

          <p className="text-lg sm:text-xl md:text-2xl text-zinc-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Học sinh cần một lộ trình thực chiến, minigame gắn liền kiến thức và phản hồi tức thì từ AI.
          </p>

          <p className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-red-500 tracking-tight">
            Chúng tôi xây dựng chính xác điều đó.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════════
          4. THREE STEPS ACCORDION (DIGITAL METAL DARK STEPPER)
         ══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-left space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-red-600 font-bold">
              Step-by-Step Workflow
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-zinc-950 uppercase tracking-tight">
              3 Bước Chinh Phục Kiến Thức Cùng E-V-E
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {STEPS_DATA.map((item, idx) => (
              <div
                key={item.step}
                onClick={() => setActiveStep(idx)}
                className={`p-6 md:p-8 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-6 ${
                  activeStep === idx
                    ? "bg-zinc-950 text-white border-red-600 shadow-xl scale-[1.01]"
                    : "bg-zinc-50 hover:bg-white text-zinc-900 border-zinc-200"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-mono text-3xl font-black ${
                        activeStep === idx ? "text-red-500" : "text-zinc-300"
                      }`}
                    >
                      {item.step}
                    </span>
                    <span
                      className={`text-[11px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                        activeStep === idx
                          ? "bg-zinc-800 text-zinc-300"
                          : "bg-zinc-200 text-zinc-600"
                      }`}
                    >
                      Giai đoạn {idx + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-black uppercase tracking-tight">
                    {item.title}
                  </h3>
                  <p
                    className={`font-mono text-xs font-bold ${
                      activeStep === idx ? "text-red-400" : "text-zinc-500"
                    }`}
                  >
                    {item.tagline}
                  </p>
                  <p
                    className={`text-xs leading-relaxed ${
                      activeStep === idx ? "text-zinc-300" : "text-zinc-600"
                    }`}
                  >
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-800/40 flex flex-wrap gap-1.5">
                  {item.tags.map((t) => (
                    <span
                      key={t}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        activeStep === idx
                          ? "bg-zinc-800 text-zinc-300"
                          : "bg-white border border-zinc-200 text-zinc-600"
                      }`}
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════════
          5. ROLE PORTALS (STUDENT, TEACHER, ADMIN)
         ══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-zinc-50 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-red-600 font-bold px-3 py-1 rounded-full bg-red-100/70 border border-red-200">
              Role Access & Permissions
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-zinc-950 uppercase tracking-tight mt-2">
              Không Gian Dành Cho Mọi Đối Tượng
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600">
              Hệ thống phân quyền thông minh đảm bảo từng trải nghiệm học tập, giảng dạy và quản trị đều mượt mà.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Student Card */}
            <div className="p-6 rounded-2xl bg-white border-2 border-zinc-200 hover:border-red-600 transition-all flex flex-col justify-between space-y-6 shadow-sm">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider block">Dành Cho</span>
                  <h3 className="text-xl font-black text-zinc-950 uppercase">Học Sinh (Student)</h3>
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-600 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Học theo lộ trình bản đồ trực quan</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Luyện tập minigame & cày Coins đổi thưởng</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Gia sư AI hỗ trợ giải đáp 24/7</span>
                  </li>
                </ul>
              </div>

              <Link href="/register" className="w-full">
                <button className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-mono text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2">
                  Đăng Ký Học Sinh <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>

            {/* Teacher Card */}
            <div className="p-6 rounded-2xl bg-white border-2 border-zinc-200 hover:border-red-600 transition-all flex flex-col justify-between space-y-6 shadow-sm">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center font-bold">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider block">Dành Cho</span>
                  <h3 className="text-xl font-black text-zinc-950 uppercase">Giáo Viên (Teacher)</h3>
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-600 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Soạn bài học & đính kèm tài liệu slide/code</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Tự xuất bản Minigame qua E-V-E Game SDK</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Quản lý lớp học, cấp mã tham gia lớp</span>
                  </li>
                </ul>
              </div>

              <Link href="/register" className="w-full">
                <button className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-black text-white font-mono text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2">
                  Cổng Giáo Viên <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════════
          6. FOOTER (HIGH-PRECISION TECHNICAL FOOTER)
         ══════════════════════════════════════════════════════════════════════════════ */}
      <footer className="bg-zinc-950 text-white border-t border-zinc-800 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="E-V-E"
                className="h-8 md:h-9 w-auto object-contain block"
                style={{ height: "36px", width: "auto" }}
              />
              <div>
                <span className="font-mono font-black text-lg tracking-wider block">E-V-E</span>
                <span className="text-[11px] text-zinc-400 block font-mono">Educational Value Elegant</span>
              </div>
            </div>

            <div className="flex items-center gap-6 font-mono text-xs text-zinc-400">
              <Link href="/student/leaderboard" className="hover:text-white transition-colors">Bảng Xếp Hạng</Link>
              <Link href="/teacher/game-sdk-guide" className="hover:text-white transition-colors">Game SDK</Link>
              <Link href="/login" className="hover:text-white transition-colors">Đăng Nhập</Link>
              <Link href="/register" className="hover:text-white transition-colors">Đăng Ký</Link>
            </div>
          </div>

          <div className="font-mono text-[11px] text-zinc-500 text-center sm:text-left">
            © 2026 E-V-E. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
