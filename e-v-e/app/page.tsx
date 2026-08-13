"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
    <>
      <HeaderEffect />
      <Navbar />

      <main className="pt-24 md:pt-32 pb-stack-lg">
        {/* 1. Hero Section */}
        <section className="relative w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop min-h-[80vh] flex flex-col justify-center items-center text-center mb-24">
          <div className="absolute inset-0 z-[-1] opacity-40 rounded-3xl overflow-hidden pointer-events-none">
            <div
              className="w-full h-full bg-cover bg-center mix-blend-screen"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDX3K7vGdyDUJvI340aetIU0MVajGsT-e6ecJWTX_bifO55kIvgYhItv47FSH5gOlBt4WXUH320SbsaApEiFfNdG66AoUaUjk7G5Nq2aNt68S2ryprglwBXkwjP-dZTcTo4W9-bhhwQxUNBz7Ab_4QpfnZ2OdXoMk-oGfmsIb2lzhbUotG-TIe2LGsotqgod8fmizYQiYz2IWyCnHT5k1cs7W0nk68sUTOd6qV65B-dNJH1vAu6ysgZ')",
              }}
            ></div>
          </div>

          <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-primary-container/20 blur-2xl pulse-anim pointer-events-none"></div>
          <div className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-secondary-container/10 blur-3xl pointer-events-none"></div>
          <div className="max-w-4xl z-10 glass-card p-8 md:p-12 rounded-2xl flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-ice bg-surface-glass mb-6">
              <span className="material-symbols-outlined text-secondary text-sm">auto_awesome</span>
              <span className="font-label-sm text-label-sm text-secondary">Hệ Sinh Thái E-V-E Cosmic Knowledge</span>
            </div>
            <h1 className="font-headline-lg text-4xl md:text-6xl lg:text-7xl mb-6 stellar-text tracking-tight">
              Nâng Tầm Giáo Dục<br />Trong Kỷ Nguyên Số
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-10 leading-relaxed">
              Trải nghiệm lộ trình học tập cá nhân hóa được dẫn dắt bởi AI. Khám phá vũ trụ tri thức với giao diện tương lai, nơi sự tập trung và khơi gợi trí tò mò hòa quyện trong một không gian thanh tĩnh.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/register">
                <button className="btn-primary rounded-lg px-8 py-4 font-headline-sm text-headline-sm flex items-center justify-center gap-2 group cursor-pointer">
                  Khám Phá Ngay
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </Link>
              <Link href="/login">
                <button className="glass-card rounded-lg px-8 py-4 font-headline-sm text-headline-sm text-on-surface flex items-center justify-center gap-2 hover:bg-white/5 transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-secondary">play_circle</span>
                  Đăng Nhập Ngay
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* 2. Target Audiences (Bento Grid Style) */}
        <section className="w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop mb-24" id="audiences">
          <div className="text-center mb-12">
            <h2 className="font-headline-lg text-3xl md:text-4xl text-primary mb-4">Vũ Trụ Tri Thức Cho Mọi Đối Tượng</h2>
            <p className="font-body-md text-on-surface-variant max-w-2xl mx-auto">Thiết kế tinh xảo để phục vụ từng mắt xích trong hệ sinh thái giáo dục, mang lại giá trị tối đa qua lăng kính công nghệ.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card rounded-xl p-6 glass-hover group flex flex-col h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
              <div className="w-12 h-12 rounded-lg bg-surface-container-high border border-ice flex items-center justify-center mb-6 shadow-glow-primary">
                <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  public
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-3">Nhà Trường</h3>
              <p className="font-body-md text-on-surface-variant grow">Quản lý toàn diện, tối ưu hóa nguồn lực và nâng cao chất lượng giảng dạy thông qua dữ liệu phân tích sâu sắc từ hệ thống.</p>
            </div>

            <div className="glass-card rounded-xl p-6 glass-hover group flex flex-col h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
              <div className="w-12 h-12 rounded-lg bg-surface-container-high border border-ice flex items-center justify-center mb-6 shadow-glow-primary">
                <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  school
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-3">Giáo Viên</h3>
              <p className="font-body-md text-on-surface-variant grow">Giảm tải công việc hành chính, dễ dàng tạo bài giảng sinh động và theo dõi sát sao tiến độ học tập của từng cá nhân học sinh.</p>
            </div>

            <div className="glass-card rounded-xl p-6 glass-hover group flex flex-col h-full relative overflow-hidden lg:col-span-2 lg:bg-surface-glass/80">
              <div className="w-12 h-12 rounded-lg bg-primary-container border border-ice flex items-center justify-center mb-6 shadow-glow-primary pulse-anim">
                <span className="material-symbols-outlined text-on-primary-container text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  face
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary mb-3">Học Sinh</h3>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mb-4">Trải nghiệm học tập cá nhân hóa 100%. Trợ lý AI E-V-E đồng hành 24/7, biến những khái niệm phức tạp thành hành trình khám phá đầy mê hoặc.</p>
              <div className="mt-auto flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-surface/50 border border-ice font-label-sm text-secondary">Lộ trình riêng biệt</span>
                <span className="px-3 py-1 rounded-full bg-surface/50 border border-ice font-label-sm text-secondary">Học qua Gamification</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Call to Action */}
        <section className="w-full max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="glass-card rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
            <div className="relative z-10">
              <span className="material-symbols-outlined text-5xl text-primary mb-6 block">rocket_launch</span>
              <h2 className="font-headline-lg text-3xl md:text-5xl text-on-surface mb-6">Sẵn Sàng Khởi Hành?</h2>
              <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto mb-10">Tham gia cùng hàng ngàn học sinh và giáo viên đã chuyển đổi số thành công. Trải nghiệm tương lai của giáo dục ngay hôm nay.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/register">
                  <button className="btn-primary rounded-lg px-8 py-4 font-headline-sm text-headline-sm shadow-glow-primary hover:-translate-y-1 transition-transform cursor-pointer">
                    Đăng Ký Tài Khoản Miễn Phí
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full mt-stack-lg bg-surface-container-lowest border-t border-ice py-stack-lg px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center">
        <div className="mb-6 md:mb-0 flex flex-col items-center md:items-start">
          <span className="font-headline-sm text-headline-sm text-on-surface mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              public
            </span>
            E-V-E
          </span>
          <p className="font-label-sm text-label-sm text-secondary">
            © 2026 E-V-E Cosmic Knowledge. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
