"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Code,
  Compass,
  Gamepad2,
  Trophy,
  BookOpen,
  GraduationCap,
  ArrowRight,
  Play,
  Rocket,
} from "lucide-react";
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
    <div className="min-h-screen bg-white text-zinc-900 font-sans overflow-x-hidden">
      <Navbar />

      <main className="pt-24 md:pt-32 pb-20 space-y-20 md:space-y-28">
        {/* ══════════════════════════════════════════════════════════════════════════════
            1. HERO SECTION
           ══════════════════════════════════════════════════════════════════════════════ */}
        <section className="max-w-5xl mx-auto px-4 md:px-8 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-red-200 bg-red-50 text-red-700 text-xs font-bold mb-6">
            <Rocket className="w-3.5 h-3.5 text-red-600" />
            <span>HỆ SINH THÁI GIÁO DỤC & TRÒ CHƠI TƯƠNG TÁC E-V-E</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-900 max-w-3xl leading-[1.15] mb-6">
            Học Lập Trình & Công Nghệ Qua{" "}
            <span className="text-red-600">Lộ Trình Tương Tác</span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 max-w-2xl mb-10 leading-relaxed">
            Tiếp cận tư duy máy tính tự nhiên: Vượt qua các chặng bài học với minigame thực hành, tích lũy Coins đổi thưởng và có trợ lý hỗ trợ trực tuyến.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16">
            <Link href="/register" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm">
                <Code className="w-4 h-4" /> Bắt Đầu Học Miễn Phí
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>

            <Link href="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 border border-zinc-200">
                <Play className="w-4 h-4 text-red-600 fill-red-600" /> Đăng Nhập
              </button>
            </Link>
          </div>

          {/* Teaser Cards */}
          <div className="w-full rounded-2xl bg-white border-2 border-red-600 p-6 md:p-8 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase text-red-700 font-bold px-2 py-0.5 rounded bg-red-100">
                  Lộ Trình Trực Quan
                </span>
                <span className="text-xs text-zinc-600 font-bold">Chặng 1 → Chặng 4</span>
              </div>
              <h3 className="font-bold text-base text-zinc-900">Mở Khóa Từng Bước</h3>
              <p className="text-xs text-zinc-500">
                Mỗi bài học yêu cầu hoàn thành đủ số trò chơi thực hành để mở khóa chặng tiếp theo.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase text-red-700 font-bold px-2 py-0.5 rounded bg-red-100">
                  Thực Hành Minigame
                </span>
                <span className="text-xs text-red-600 font-bold">+Coins Thưởng</span>
              </div>
              <h3 className="font-bold text-base text-zinc-900">Trò Chơi Giáo Dục</h3>
              <p className="text-xs text-zinc-500">
                Ghép thẻ bài thuật toán, phản xạ trắc nghiệm và các minigame thú vị.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase text-red-700 font-bold px-2 py-0.5 rounded bg-red-100">
                  Gia Sư Trực Tuyến
                </span>
                <span className="text-xs text-zinc-600 font-bold">Hỗ Trợ 24/7</span>
              </div>
              <h3 className="font-bold text-base text-zinc-900">Giải Đáp Bài Học</h3>
              <p className="text-xs text-zinc-500">
                Trợ lý hướng dẫn học sinh sửa lỗi code và giải thích chi tiết từng khái niệm.
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════════════
            2. TÍNH NĂNG CHÍNH
           ══════════════════════════════════════════════════════════════════════════════ */}
        <section className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider px-3 py-1 rounded-full bg-red-50 border border-red-200">
              PHƯƠNG PHÁP HIỆN ĐẠI
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-zinc-900 mt-3">
              Môi Trường Học Tập Trực Quan
            </h2>
            <p className="text-sm text-zinc-600 max-w-xl mx-auto mt-1">
              Kết hợp giữa lý thuyết sinh động và các minigame kích thích tư duy logic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-white border border-zinc-200 hover:border-red-600 transition-all space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-zinc-900">Lộ Trình Tự Do</h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Học sinh có thể tham gia nhiều lộ trình cùng lúc, theo dõi tiến độ rõ ràng.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-zinc-200 hover:border-red-600 transition-all space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-zinc-900">Minigame Giáo Dục</h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Trò chơi tự động lấy dữ liệu từ khóa học giúp rèn luyện phản xạ và ghi nhớ.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-zinc-200 hover:border-red-600 transition-all space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-zinc-900">Tài Liệu & Code Mẫu</h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Giáo viên cung cấp link slide, file PDF bài giảng và kho mã nguồn thực hành.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-zinc-200 hover:border-red-600 transition-all space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-zinc-900">Tích Điểm & Đổi Quà</h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Nhận Coins sau mỗi bài học hoàn thành để mở khóa Khung Avatar và Huy hiệu.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════════════
            3. DÀNH CHO CẢ HỌC SINH VÀ GIÁO VIÊN
           ══════════════════════════════════════════════════════════════════════════════ */}
        <section className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-zinc-900">
              Phân Quyền Rõ Ràng & Bảo Mật Dữ Liệu
            </h2>
            <p className="text-sm text-zinc-600 max-w-xl mx-auto mt-1">
              Đảm bảo nội dung của mỗi giáo viên luôn được bảo mật và phân quyền chặt chẽ.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Student */}
            <div className="p-6 rounded-2xl bg-white border border-zinc-200 hover:border-red-600 transition-all flex flex-col justify-between space-y-5 shadow-sm">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-lg">
                  
                </div>
                <h3 className="text-lg font-bold text-zinc-900">Học Sinh (Student)</h3>
                <ul className="space-y-2 text-xs text-zinc-600">
                  <li> Đăng ký lộ trình học tập miễn phí</li>
                  <li> Chơi game thực hành để mở khóa bài tiếp theo</li>
                  <li> Nhận tài liệu và bài tập từ giáo viên</li>
                  <li> Hỏi đáp bài học cùng gia sư trực tuyến</li>
                </ul>
              </div>

              <Link href="/register" className="w-full">
                <button className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer">
                  Tham Gia Học Sinh →
                </button>
              </Link>
            </div>

            {/* Teacher */}
            <div className="p-6 rounded-2xl bg-white border border-zinc-200 hover:border-red-600 transition-all flex flex-col justify-between space-y-5 shadow-sm">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center font-bold text-lg">
                  
                </div>
                <h3 className="text-lg font-bold text-zinc-900">Giáo Viên (Teacher)</h3>
                <ul className="space-y-2 text-xs text-zinc-600">
                  <li> Soạn bài học & đính kèm tài liệu, slide, code mẫu</li>
                  <li> Tạo lộ trình học tập gồm nhiều bài liên kết</li>
                  <li> Nộp trò chơi riêng qua Game SDK v2.0</li>
                  <li> Toàn quyền quản lý bài viết của mình</li>
                </ul>
              </div>

              <Link href="/register" className="w-full">
                <button className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-900 text-white text-xs font-bold transition-colors cursor-pointer">
                  Đăng Ký Giáo Viên →
                </button>
              </Link>
            </div>

            {/* Admin */}
            <div className="p-6 rounded-2xl bg-white border border-zinc-200 hover:border-red-600 transition-all flex flex-col justify-between space-y-5 shadow-sm">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center font-bold text-lg">
                  
                </div>
                <h3 className="text-lg font-bold text-zinc-900">Quản Trị Viên (Admin)</h3>
                <ul className="space-y-2 text-xs text-zinc-600">
                  <li> Phê duyệt tài khoản giáo viên đăng ký mới</li>
                  <li> Kiểm duyệt bài học và lộ trình</li>
                  <li> Tải source code game (.zip) để kiểm tra an toàn</li>
                  <li> Quản trị tài khoản và hệ sinh thái</li>
                </ul>
              </div>

              <Link href="/login" className="w-full">
                <button className="w-full py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold transition-colors cursor-pointer border border-zinc-200">
                  Cổng Quản Trị →
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-zinc-50 py-8 px-4 md:px-8 text-center text-xs text-zinc-500 space-y-1">
        <div>© 2026 E-V-E • HỆ SINH THÁI GIÁO DỤC TƯƠNG TÁC</div>
      </footer>
    </div>
  );
}
