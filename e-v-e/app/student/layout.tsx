"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Rocket,
  LayoutDashboard,
  BookOpen,
  Gamepad2,
  Trophy,
  ShoppingBag,
  UserCheck,
  Coins,
  LogOut,
  Sparkles,
  Bot,
  ArrowLeft,
  GraduationCap,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { getAuthCookie } from "@/lib/cookies";

const STUDENT_NAV = [
  { id: "dashboard",      label: "Góc Học Tập",        icon: LayoutDashboard, href: "/student/dashboard" },
  { id: "learning-paths", label: "Lộ Trình Học Tập",   icon: BookOpen,        href: "/student/learning-paths" },
  { id: "games",          label: "Kho Trò Chơi (Arcade)", icon: Gamepad2,     href: "/student/games" },
  { id: "ai-tutor",       label: "Trợ Lý AI Tutor",    icon: Bot,             href: "/student/ai-tutor" },
  { id: "leaderboard",    label: "Bảng Xếp Hạng",      icon: Trophy,          href: "/student/leaderboard" },
  { id: "shop",           label: "Cửa Hàng Đổi Thưởng", icon: ShoppingBag,     href: "/student/shop" },
  { id: "profile",        label: "Hồ Sơ Cá Nhân",      icon: UserCheck,       href: "/student/profile" },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();
  const { currentUser, profile } = useAuthAdapter();

  const cookieUser = typeof window !== "undefined" ? getAuthCookie() : null;
  const userRole =
    currentUser?.role ||
    profile?.role ||
    cookieUser?.role ||
    "student";

  const isTeacher = userRole === "teacher";
  const isAdmin = userRole === "admin" || userRole === "school";

  useEffect(() => {
    const cached = getAuthCookie();
    if (!cached && !currentUser && !profile) {
      router.replace("/login");
    }
  }, [currentUser, profile, router]);

  const displayName =
    currentUser?.name ||
    (currentUser as any)?.fullName ||
    profile?.fullName ||
    "Học Sinh";
  const displayCoins = currentUser?.coins ?? profile?.coins ?? 250;

  return (
    <div className="flex min-h-screen bg-[#0a0e1a] text-[#e1e2ec] font-sans flex-col md:flex-row">
      {/* ── Student Sidebar ── */}
      <aside className="w-full md:w-64 md:h-screen bg-[#0d1220] border-r border-[#7bd1fa]/15 p-5 flex flex-col justify-between z-40 md:sticky top-0 shrink-0 overflow-y-auto">
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 p-[1px] shadow-[0_0_20px_rgba(6,182,212,0.35)]">
              <div className="w-full h-full bg-[#0a0e1a] rounded-[11px] flex items-center justify-center">
                <Rocket className="w-5 h-5 text-cyan-300" />
              </div>
            </div>
            <div>
              <h2 className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                E-V-E{" "}
                <span className="text-[10px] px-1.5 py-0.5 rounded-full border border-cyan-500/30 bg-cyan-500/20 text-cyan-300 font-mono">
                  HỌC SINH
                </span>
              </h2>
              <p className="text-[11px] text-[#8e9bb4]">Không gian trải nghiệm</p>
            </div>
          </div>

          {/* Quick Return Portal for Teacher or Admin */}
          {isTeacher && (
            <Link href="/teacher/dashboard">
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 transition-all flex items-center justify-between gap-2 cursor-pointer shadow-lg group">
                <div className="flex items-center gap-2 text-xs font-mono font-bold">
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                  <span>Về Bàn Làm Việc GV</span>
                </div>
                <ArrowLeft className="w-3.5 h-3.5 rotate-180 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          )}

          {isAdmin && (
            <Link href="/admin/dashboard">
              <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 transition-all flex items-center justify-between gap-2 cursor-pointer shadow-lg group">
                <div className="flex items-center gap-2 text-xs font-mono font-bold">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Về Trang Quản Trị Admin</span>
                </div>
                <ArrowLeft className="w-3.5 h-3.5 rotate-180 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          )}

          {/* Student Profile & Coins Info */}
          <div className="px-3 py-3 rounded-xl bg-[#151b2c] border border-cyan-500/20 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate" suppressHydrationWarning>
                {displayName}
              </div>
              <div className="text-[10px] font-mono text-cyan-400 uppercase">
                {isTeacher ? "Giáo Viên (Xem thử)" : isAdmin ? "Admin (Xem thử)" : "Học Viên"}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0 px-2 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-mono font-bold text-amber-300" suppressHydrationWarning>
                {displayCoins}
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1 text-sm font-medium">
            {STUDENT_NAV.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/student/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                    active
                      ? "bg-gradient-to-r from-cyan-500/25 to-blue-600/20 text-white border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)] font-semibold"
                      : "text-[#8e9bb4] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-cyan-400" : "text-slate-400"}`} />
                  <span className="text-xs tracking-wide">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          {isTeacher && (
            <Link href="/teacher/dashboard">
              <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-mono text-xs font-bold transition-all border border-emerald-500/30 cursor-pointer">
                <ArrowLeft className="w-3.5 h-3.5" /> Thoát Xem Thử Học Sinh
              </button>
            </Link>
          )}

          {isAdmin && (
            <Link href="/admin/dashboard">
              <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 font-mono text-xs font-bold transition-all border border-amber-500/30 cursor-pointer">
                <ArrowLeft className="w-3.5 h-3.5" /> Thoát Về Admin
              </button>
            </Link>
          )}

          <button
            onClick={() => signOut()}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-mono text-xs font-bold transition-all cursor-pointer border border-rose-500/20"
          >
            <LogOut className="w-4 h-4" /> Đăng Xuất
          </button>
        </div>
      </aside>

      {/* ── Main Content Container ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Sticky Experience Banner for Teacher / Admin */}
        {(isTeacher || isAdmin) && (
          <div className="bg-gradient-to-r from-[#0f1d24] via-[#102435] to-[#0f1d24] border-b border-cyan-500/30 px-4 py-2.5 flex items-center justify-between gap-3 text-xs font-mono sticky top-0 z-30 shadow-md">
            <div className="flex items-center gap-2 text-cyan-300 truncate">
              {isTeacher ? (
                <GraduationCap className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <span className="truncate">
                Đang ở chế độ <strong>Trải nghiệm Học sinh</strong> ({isTeacher ? "Tài khoản Giáo viên" : "Tài khoản Admin"})
              </span>
            </div>

            <Link href={isTeacher ? "/teacher/dashboard" : "/admin/dashboard"}>
              <button className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.35)] transition-all shrink-0 cursor-pointer">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isTeacher ? "Quay Về Trang Giáo Viên" : "Quay Về Trang Admin"}</span>
              </button>
            </Link>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
