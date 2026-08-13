"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Rocket,
  Compass,
  Gamepad2,
  Bot,
  Trophy,
  Coins,
  Shield,
  GraduationCap,
  Users,
  Layers,
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle2,
  Lock,
  Cpu,
  Star,
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
    <div className="min-h-screen bg-[#070a14] text-[#e1e2ec] font-sans overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      <HeaderEffect />
      <Navbar />

      {/* Background Starfield & Glowing Nebula Orbs */}
      <div
        className="fixed inset-0 z-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#7bd1fa 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
      <div className="fixed top-20 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed top-1/3 right-1/4 w-[450px] h-[450px] rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/3 w-[550px] h-[550px] rounded-full bg-purple-600/10 blur-[140px] pointer-events-none" />

      <main className="relative z-10 pt-24 md:pt-32 pb-20 space-y-24 md:space-y-32">
        {/* ══════════════════════════════════════════════════════════════════════════════
            1. HERO SECTION (Khởi Nguyên Vũ Trụ Tri Thức)
           ══════════════════════════════════════════════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 text-center flex flex-col items-center">
          {/* Top Cosmic Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-950/40 backdrop-blur-md text-cyan-300 text-xs font-mono mb-6 shadow-[0_0_20px_rgba(6,182,212,0.25)] animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin-slow" />
            <span>E-V-E • HỆ SINH THÁI HỌC TẬP GAMIFICATION & AI THẾ HỆ MỚI</span>
          </div>

          {/* Main Stellar Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl leading-[1.15] mb-6">
            Chinh Phục Tri Thức Qua{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-300">
              Bản Đồ Kho Báu
            </span>{" "}
            & Gaming Engine 🌌
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-[#94a3b8] max-w-3xl mb-10 leading-relaxed">
            Học tập không còn nhàm chán! Vượt qua các trạm kiến thức bằng <strong className="text-cyan-300 font-semibold">Minigame tương tác đa dạng</strong>, mở khóa lộ trình từng bước, tích lũy Coins đổi thưởng và có <strong className="text-cyan-300 font-semibold">Trợ lý AI đồng hành 24/7</strong>.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16">
            <Link href="/register" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-cyan-300 text-white font-mono font-bold text-sm shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2.5">
                <Rocket className="w-4 h-4" /> Bắt Đầu Chinh Phục Ngay
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>

            <Link href="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#0f1524]/90 hover:bg-[#151b2c] border border-slate-700 hover:border-cyan-500/50 text-slate-200 hover:text-white font-mono font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2">
                <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" /> Đăng Nhập Chỉ Huy
              </button>
            </Link>
          </div>

          {/* Hero Bento Visual Teaser */}
          <div className="w-full max-w-6xl rounded-3xl bg-[#0f1524]/80 backdrop-blur-xl border border-cyan-500/25 p-6 md:p-8 shadow-2xl shadow-cyan-950/40 grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            {/* Teaser 1: Treasure Map Preview */}
            <div className="p-5 rounded-2xl bg-[#090d18] border border-cyan-500/20 space-y-3 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                  🗺️ Map Engine
                </span>
                <span className="text-[11px] font-mono text-emerald-300 font-bold">2/3 Trạm Xong</span>
              </div>
              <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors">
                Bản Đồ Kho Báu Tuần Tự
              </h3>
              <p className="text-xs text-[#8e9bb4]">
                Mỗi trạm yêu cầu hoàn thành đủ <code className="text-cyan-300">x/y trò chơi</code> thì mới mở khóa trạm tiếp theo.
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 pt-1">
                <span>Trạm 01 ✓</span> → <span>Trạm 02 ⚡</span> → <span>Trạm 03 🔒</span>
              </div>
            </div>

            {/* Teaser 2: 3D Hardware & Multi-Game Engine */}
            <div className="p-5 rounded-2xl bg-[#090d18] border border-purple-500/20 space-y-3 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-purple-400 font-bold px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                  🎮 Diverse Games
                </span>
                <span className="text-[11px] font-mono text-amber-300 font-bold">+50 Coins</span>
              </div>
              <h3 className="font-bold text-base text-white group-hover:text-purple-300 transition-colors">
                Lật Thẻ Bài & Mô Hình 3D
              </h3>
              <p className="text-xs text-[#8e9bb4]">
                Không chỉ là quiz! Bốc random card matching, lắp ráp linh kiện máy tính 3D, vượt chướng ngại vật.
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-purple-300 pt-1">
                <span>Memory Matrix</span> • <span>3D Assembly</span> • <span>Runner</span>
              </div>
            </div>

            {/* Teaser 3: AI Tutor 24/7 */}
            <div className="p-5 rounded-2xl bg-[#090d18] border border-emerald-500/20 space-y-3 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  🤖 Smart AI
                </span>
                <span className="text-[11px] font-mono text-cyan-300 font-bold">Online 24/7</span>
              </div>
              <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors">
                Trợ Lý AI Đồng Hành
              </h3>
              <p className="text-xs text-[#8e9bb4]">
                Giải thích sâu sắc mọi thắc mắc học sinh và hỗ trợ giáo viên tự động sinh cặp câu hỏi JSON pairs.
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-300 pt-1">
                <span>Giải bài tập</span> • <span>Tạo đề thi</span> • <span>Hướng dẫn API</span>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════════════
            2. 4 TRỤ CỘT ĐỘT PHÁ (Core Pillars Bento Grid)
           ══════════════════════════════════════════════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              TÍNH NĂNG ĐỘT PHÁ
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-3">
              Trải Nghiệm Học Tập Tương Lai
            </h2>
            <p className="text-sm md:text-base text-[#8e9bb4] max-w-2xl mx-auto mt-2">
              Kết hợp hoàn hảo giữa phương pháp sư phạm hiện đại, cơ chế Gamification cuốn hút và công nghệ điện toán AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 rounded-3xl bg-[#0f1524]/85 border border-cyan-500/20 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white mb-1.5">Bản Đồ Kho Báu Tri Thức</h3>
                <p className="text-xs text-[#8e9bb4] leading-relaxed">
                  Lộ trình học tập được thiết kế như một chuyến hải trình khám phá. Khóa học được liên kết bằng mũi tên đứt đoạn và mở khóa tuần tự.
                </p>
              </div>
              <div className="text-[11px] font-mono text-cyan-400 flex items-center gap-1 font-bold">
                Tự do đăng ký mọi lộ trình →
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-3xl bg-[#0f1524]/85 border border-purple-500/20 hover:border-purple-500/50 transition-all flex flex-col justify-between space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)] group-hover:scale-110 transition-transform">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white mb-1.5">Đa Dạng Gaming Engine</h3>
                <p className="text-xs text-[#8e9bb4] leading-relaxed">
                  Tự động bốc ngẫu nhiên câu hỏi thành Card Matching, Mô hình 3D linh kiện máy tính hoặc game WebGL custom của giáo viên.
                </p>
              </div>
              <div className="text-[11px] font-mono text-purple-300 flex items-center gap-1 font-bold">
                Hỗ trợ Next.js & WebGL API →
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-3xl bg-[#0f1524]/85 border border-emerald-500/20 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white mb-1.5">Trợ Lý Sư Phạm & AI Tutor</h3>
                <p className="text-xs text-[#8e9bb4] leading-relaxed">
                  Học sinh được AI giải đáp bài tập theo ngữ cảnh. Giáo viên được AI gợi ý soạn câu hỏi JSON Pairs và cấu hình lộ trình siêu tốc.
                </p>
              </div>
              <div className="text-[11px] font-mono text-emerald-300 flex items-center gap-1 font-bold">
                Trợ lý thông minh 24/7 →
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-3xl bg-[#0f1524]/85 border border-amber-500/20 hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white mb-1.5">Vinh Danh & Cửa Hàng Coins</h3>
                <p className="text-xs text-[#8e9bb4] leading-relaxed">
                  Thi đua trên Bảng vàng tháng, tích lũy Coins qua từng chiến thắng để mở khóa Khung Avatar siêu tân tinh và Huy hiệu danh giá.
                </p>
              </div>
              <div className="text-[11px] font-mono text-amber-300 flex items-center gap-1 font-bold">
                Tích coin & cá nhân hóa →
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════════════
            3. PHÂN QUYỀN 3 ROLE CHUYÊN BIỆT (Tailored Experiences)
           ══════════════════════════════════════════════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Không Gian Riêng Biệt Cho Từng Vai Trò
            </h2>
            <p className="text-sm text-[#8e9bb4] max-w-xl mx-auto mt-2">
              Hệ thống kiểm soát quyền truy cập chặt chẽ qua Next.js Middleware đảm bảo trải nghiệm tối ưu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Role 1: Student */}
            <div className="p-7 rounded-3xl bg-gradient-to-b from-[#0f1929] to-[#0a101d] border border-cyan-500/30 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold font-mono">
                  👨‍🎓
                </div>
                <h3 className="text-xl font-bold text-white">Học Sinh (Student)</h3>
                <ul className="space-y-2 text-xs text-[#8e9bb4]">
                  <li className="flex items-center gap-2">✓ Đăng ký số lượng lộ trình tri thức tùy ý</li>
                  <li className="flex items-center gap-2">✓ Vượt chướng ngại vật x/y trò chơi để mở khóa trạm</li>
                  <li className="flex items-center gap-2">✓ Tích lũy Coins và trang bị Khung Avatar độc quyền</li>
                  <li className="flex items-center gap-2">✓ Hỏi đáp bài học trực tiếp với AI Tutor 24/7</li>
                </ul>
              </div>

              <Link href="/register" className="w-full">
                <button className="w-full py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold transition-all cursor-pointer">
                  Tham Gia Học Sinh →
                </button>
              </Link>
            </div>

            {/* Role 2: Teacher */}
            <div className="p-7 rounded-3xl bg-gradient-to-b from-[#0f241a] to-[#0a1712] border border-emerald-500/30 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold font-mono">
                  👨‍🏫
                </div>
                <h3 className="text-xl font-bold text-white">Giáo Viên (Educator)</h3>
                <ul className="space-y-2 text-xs text-[#8e9bb4]">
                  <li className="flex items-center gap-2">✓ Soạn đề bài và đáp án đúng/sai dạng JSON Pairs</li>
                  <li className="flex items-center gap-2">✓ Ghép các khóa học thành Lộ Trình Bản Đồ Kho Báu</li>
                  <li className="flex items-center gap-2">✓ Nộp Game Engine tự viết (WebGL/Next.js .zip) qua REST API</li>
                  <li className="flex items-center gap-2">✓ Trợ lý sư phạm AI hỗ trợ sinh câu hỏi tự động</li>
                </ul>
              </div>

              <Link href="/register" className="w-full">
                <button className="w-full py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold transition-all cursor-pointer">
                  Đăng Ký Giáo Viên →
                </button>
              </Link>
            </div>

            {/* Role 3: Admin */}
            <div className="p-7 rounded-3xl bg-gradient-to-b from-[#240f1a] to-[#170a12] border border-rose-500/30 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center font-bold font-mono">
                  🏛️
                </div>
                <h3 className="text-xl font-bold text-white">Quản Trị (Admin)</h3>
                <ul className="space-y-2 text-xs text-[#8e9bb4]">
                  <li className="flex items-center gap-2">✓ Thống kê tổng quan người dùng và chỉ số hệ thống</li>
                  <li className="flex items-center gap-2">✓ Xét duyệt hồ sơ giáo viên mới đăng ký</li>
                  <li className="flex items-center gap-2">✓ Xem trước cấu trúc JSON Pairs trước khi duyệt</li>
                  <li className="flex items-center gap-2">✓ Tải Source Code Game (.zip) để audit an toàn</li>
                </ul>
              </div>

              <Link href="/login" className="w-full">
                <button className="w-full py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold transition-all cursor-pointer">
                  Cổng Quản Trị Viên →
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════════════
            4. FINAL CALL TO ACTION
           ══════════════════════════════════════════════════════════════════════════════ */}
        <section className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-blue-900/40 via-cyan-900/30 to-purple-900/40 border-2 border-cyan-500/40 p-8 md:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400/40 mx-auto flex items-center justify-center text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.4)] animate-bounce">
              <Rocket className="w-8 h-8" />
            </div>

            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              Sẵn Sàng Khởi Hành Cùng E-V-E?
            </h2>
            <p className="text-sm md:text-base text-slate-300 max-w-xl mx-auto">
              Gia nhập cùng hàng ngàn học sinh và giảng viên đang tiên phong trong kỷ nguyên học tập thông minh.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link href="/register" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-mono font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer">
                  Đăng Ký Miễn Phí Ngay
                </button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#151b2c] hover:bg-slate-800 border border-slate-700 text-white font-mono font-bold text-xs transition-all cursor-pointer">
                  Đăng Nhập Tài Khoản
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#060810] py-10 px-4 md:px-8 text-center font-mono text-xs text-slate-500 space-y-2 relative z-10">
        <div>© 2026 E-V-E COSMIC PLATFORM • CLEAN ARCHITECTURE & ROLE-BASED ACCESS</div>
        <div className="text-[11px] text-slate-600">Được phát triển với Next.js App Router, Tailwind CSS, TypeScript & Firebase</div>
      </footer>
    </div>
  );
}
