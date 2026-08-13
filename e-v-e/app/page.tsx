"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Code,
  Compass,
  Gamepad2,
  Bot,
  Trophy,
  BookOpen,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle2,
  Lock,
  Cpu,
  Layers,
} from "lucide-react";
import HeaderEffect from "@/components/HeaderEffect";
import Navbar from "@/components/Navbar";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { getAuthCookie } from "@/lib/cookies";

export default function Home() {
  const router = useRouter();
  const { currentUser, profile } = useAuthAdapter();

  useEffect(() => {
    const user = currentUser || profile || getAuthCookie();
    if (user && user.email) {
      if (user.role === "admin" || user.role === "school") {
        router.replace("/admin/dashboard");
      } else if (user.role === "teacher") {
        if ((user as any).status === "pending") {
          router.replace("/pending");
        } else {
          router.replace("/teacher/dashboard");
        }
      } else {
        router.replace("/student/dashboard");
      }
    }
  }, [currentUser, profile, router]);

  return (
    <div className="min-h-screen bg-[#070b14] text-[#e2e8f0] font-sans overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      <HeaderEffect />
      <Navbar />

      {/* Subtle Background Glows */}
      <div className="fixed top-20 left-1/4 w-[450px] h-[450px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none" />
      <div className="fixed top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

      <main className="relative z-10 pt-24 md:pt-32 pb-20 space-y-24 md:space-y-32">
        {/* ══════════════════════════════════════════════════════════════════════════════
            1. HERO SECTION (Học Lập Trình & Công Nghệ Cho Trẻ Em)
           ══════════════════════════════════════════════════════════════════════════════ */}
        <section className="max-w-6xl mx-auto px-4 md:px-8 text-center flex flex-col items-center">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 backdrop-blur-md text-cyan-300 text-xs font-mono mb-6 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>NỀN TẢNG HỌC LẬP TRÌNH & CÔNG NGHỆ QUA TRÒ CHƠI CHO TRẺ EM</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.2] mb-6">
            Học Lập Trình Vui Nhộn Qua{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400">
              Lộ Trình Từng Bước
            </span>{" "}
            & Trò Chơi Tương Tác
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mb-10 leading-relaxed">
            Giúp học sinh tiếp cận tư duy máy tính tự nhiên: Vượt qua các bài học bằng <strong className="text-cyan-300 font-semibold">Minigame thực hành</strong>, tích lũy điểm thưởng, nhận tài liệu học tập từ giáo viên và có <strong className="text-cyan-300 font-semibold">Trợ lý AI hỗ trợ 24/7</strong>.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16">
            <Link href="/register" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-mono font-bold text-sm shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2">
                <Code className="w-4 h-4" /> Bắt Đầu Học Miễn Phí
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>

            <Link href="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#0f1524] hover:bg-[#151b2c] border border-slate-700 hover:border-cyan-500/50 text-slate-200 hover:text-white font-mono font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2">
                <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" /> Đăng Nhập
              </button>
            </Link>
          </div>

          {/* Hero Teaser Cards */}
          <div className="w-full max-w-5xl rounded-3xl bg-[#0e1422]/90 border border-cyan-500/20 p-6 md:p-8 shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            <div className="p-5 rounded-2xl bg-[#141b2d] border border-cyan-500/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                  Lộ Trình Trực Quan
                </span>
                <span className="text-xs font-mono text-emerald-300 font-bold">Bài 1 → Bài 4</span>
              </div>
              <h3 className="font-bold text-base text-white">Mở Khóa Từng Bước</h3>
              <p className="text-xs text-slate-400">
                Mỗi bài học yêu cầu hoàn thành đủ số trò chơi thực hành để mở khóa bài học tiếp theo.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#141b2d] border border-purple-500/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-purple-400 font-bold px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                  Thực Hành Đa Dạng
                </span>
                <span className="text-xs font-mono text-amber-300 font-bold">+Coins Thưởng</span>
              </div>
              <h3 className="font-bold text-base text-white">Trò Chơi & Mô Hình 3D</h3>
              <p className="text-xs text-slate-400">
                Ghép thẻ bài thuật toán, khám phá linh kiện máy tính 3D và mini-game thú vị.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#141b2d] border border-emerald-500/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  Gia Sư AI 24/7
                </span>
                <span className="text-xs font-mono text-cyan-300 font-bold">Hỗ Trợ Tức Thì</span>
              </div>
              <h3 className="font-bold text-base text-white">Giải Đáp Bài Học</h3>
              <p className="text-xs text-slate-400">
                Trợ lý AI hướng dẫn học sinh sửa lỗi code và giải thích cặn kẽ từng khái niệm.
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════════════
            2. TÍNH NĂNG CHÍNH
           ══════════════════════════════════════════════════════════════════════════════ */}
        <section className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              PHƯƠNG PHÁP HIỆN ĐẠI
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-3">
              Môi Trường Học Tập Trực Quan Cho Trẻ
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto mt-2">
              Kết hợp giữa lý thuyết sinh động, tài liệu học tập chất lượng và các trò chơi kích thích tư duy logic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 rounded-2xl bg-[#0e1422] border border-cyan-500/20 space-y-3 flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Lộ Trình Tự Do</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Học sinh có thể tham gia nhiều lộ trình cùng lúc, theo dõi tiến độ rõ ràng từng bài.
                </p>
              </div>
              <div className="text-xs text-cyan-400 font-bold">Xem chi tiết →</div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0e1422] border border-purple-500/20 space-y-3 flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Minigame Giáo Dục</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Trò chơi tự động lấy dữ liệu từ khóa học giúp rèn luyện phản xạ và ghi nhớ kiến thức.
                </p>
              </div>
              <div className="text-xs text-purple-300 font-bold">Xem chi tiết →</div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0e1422] border border-emerald-500/20 space-y-3 flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Tài Liệu & Code Mẫu</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Giáo viên cung cấp link slide, file PDF bài giảng và kho mã nguồn thực hành đính kèm.
                </p>
              </div>
              <div className="text-xs text-emerald-300 font-bold">Xem chi tiết →</div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0e1422] border border-amber-500/20 space-y-3 flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Tích Điểm & Đổi Quà</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Nhận Coins sau mỗi bài học hoàn thành để mở khóa Khung Avatar và Huy hiệu học tập.
                </p>
              </div>
              <div className="text-xs text-amber-300 font-bold">Xem chi tiết →</div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════════════
            3. DÀNH CHO CẢ HỌC SINH VÀ GIÁO VIÊN
           ══════════════════════════════════════════════════════════════════════════════ */}
        <section className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white">
              Phân Quyền Rõ Ràng & Bảo Mật Dữ Liệu
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto mt-1">
              Đảm bảo nội dung của mỗi giáo viên luôn được bảo mật và chỉ người tạo hoặc Admin mới có quyền chỉnh sửa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Student */}
            <div className="p-7 rounded-3xl bg-[#0e1422] border border-cyan-500/30 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-lg">
                  👨‍🎓
                </div>
                <h3 className="text-lg font-bold text-white">Học Sinh (Student)</h3>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li className="flex items-center gap-2">✓ Đăng ký số lượng lộ trình học tùy thích</li>
                  <li className="flex items-center gap-2">✓ Chơi game thực hành để mở khóa bài tiếp theo</li>
                  <li className="flex items-center gap-2">✓ Tải slide, code mẫu do thầy cô cung cấp</li>
                  <li className="flex items-center gap-2">✓ Hỏi đáp bài học với Trợ lý AI 24/7</li>
                </ul>
              </div>

              <Link href="/register" className="w-full">
                <button className="w-full py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold transition-all cursor-pointer">
                  Tham Gia Học Sinh →
                </button>
              </Link>
            </div>

            {/* Teacher */}
            <div className="p-7 rounded-3xl bg-[#0e1422] border border-emerald-500/30 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-lg">
                  👨‍🏫
                </div>
                <h3 className="text-lg font-bold text-white">Giáo Viên (Teacher)</h3>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li className="flex items-center gap-2">✓ Soạn bài học & đính kèm tài liệu, slide, code mẫu</li>
                  <li className="flex items-center gap-2">✓ Tạo lộ trình học tập gồm nhiều bài liên kết</li>
                  <li className="flex items-center gap-2">✓ Nộp trò chơi riêng qua REST API & Game SDK</li>
                  <li className="flex items-center gap-2">✓ Toàn quyền quản lý bài viết của chính mình</li>
                </ul>
              </div>

              <Link href="/register" className="w-full">
                <button className="w-full py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold transition-all cursor-pointer">
                  Đăng Ký Giáo Viên →
                </button>
              </Link>
            </div>

            {/* Admin */}
            <div className="p-7 rounded-3xl bg-[#0e1422] border border-rose-500/30 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center font-bold text-lg">
                  🏛️
                </div>
                <h3 className="text-lg font-bold text-white">Quản Trị Viên (Admin)</h3>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li className="flex items-center gap-2">✓ Phê duyệt tài khoản giáo viên đăng ký mới</li>
                  <li className="flex items-center gap-2">✓ Kiểm duyệt bài học và lộ trình trước khi công khai</li>
                  <li className="flex items-center gap-2">✓ Tải source code game (.zip) để kiểm tra an toàn</li>
                  <li className="flex items-center gap-2">✓ Hệ thống Anti-Cheat chống can thiệp điểm số</li>
                </ul>
              </div>

              <Link href="/login" className="w-full">
                <button className="w-full py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold transition-all cursor-pointer">
                  Cổng Quản Trị →
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════════════
            4. CALL TO ACTION
           ══════════════════════════════════════════════════════════════════════════════ */}
        <section className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-blue-950/50 via-cyan-950/40 to-slate-900 border border-cyan-500/30 p-8 md:p-12 text-center space-y-5 shadow-2xl">
            <h2 className="text-2xl md:text-4xl font-extrabold text-white">
              Bắt Đầu Hành Trình Học Lập Trình Ngay Hôm Nay
            </h2>
            <p className="text-sm text-slate-300 max-w-lg mx-auto">
              Trang bị tư duy công nghệ tương lai cho trẻ một cách nhẹ nhàng và hào hứng nhất.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link href="/register" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-mono font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer">
                  Đăng Ký Tài Khoản Miễn Phí
                </button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#141b2d] hover:bg-slate-800 border border-slate-700 text-white font-mono font-bold text-xs transition-all cursor-pointer">
                  Đăng Nhập
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#060810] py-8 px-4 md:px-8 text-center font-mono text-xs text-slate-500 space-y-1">
        <div>© 2026 E-V-E • NỀN TẢNG HỌC LẬP TRÌNH & CÔNG NGHỆ QUA TRÒ CHƠI CHO TRẺ EM</div>
        <div className="text-[11px] text-slate-600">Được xây dựng với Next.js App Router, Tailwind CSS, TypeScript & Firebase</div>
      </footer>
    </div>
  );
}
