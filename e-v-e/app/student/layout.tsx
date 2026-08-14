"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";

const STUDENT_NAV = [
  { id: "dashboard",      label: "Góc Học Tập",        icon: LayoutDashboard, href: "/student/dashboard" },
  { id: "learning-paths", label: "Lộ Trình Học Tập",   icon: BookOpen,        href: "/student/learning-paths" },
  { id: "games",          label: "Kho Trò Chơi (Arcade)", icon: Gamepad2,     href: "/student/games" },
  { id: "ai-tutor",       label: "Trợ Lý AI Tutor",    icon: Bot,             href: "/student/ai-tutor" },
  { id: "leaderboard",    label: "Bảng Xếp Hạng",      icon: Trophy,          href: "/student/leaderboard" },
  { id: "shop",           label: "Cửa Hàng Đổi Thưởng", icon: ShoppingBag,     href: "/student/shop" },
  { id: "profile",        label: "Hồ Sơ Cá Nhân",      icon: UserCheck,       href: "/student/profile" },
];

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthCookie } from "@/lib/cookies";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();
  const { currentUser, profile } = useAuthAdapter();

  useEffect(() => {
    const cookieUser = getAuthCookie();
    if (!cookieUser && !currentUser && !profile) {
      router.replace("/login");
    }
  }, [currentUser, profile, router]);

  const displayName = currentUser?.name || (currentUser as any)?.fullName || profile?.fullName || "Học Sinh";
  const displayEmail = currentUser?.email || "student@eve.edu.vn";
  const displayCoins = currentUser?.coins ?? profile?.coins ?? 250;

  return (
    <div className="flex min-h-screen bg-[#0a0e1a] text-[#e1e2ec] font-sans">
      {/* ── Student Sidebar ── */}
      <aside className="w-64 h-screen bg-[#0d1220] border-r border-[#7bd1fa]/15 p-5 flex flex-col justify-between z-40 sticky top-0 shrink-0 overflow-y-auto">
        <div className="space-y-8">
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
              <p className="text-[11px] text-[#8e9bb4]">Không gian học tập</p>
            </div>
          </div>

          {/* Student Profile & Coins Info */}
          <div className="px-3 py-3 rounded-xl bg-[#151b2c] border border-cyan-500/20 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate" suppressHydrationWarning>{displayName}</div>
              <div className="text-[10px] font-mono text-cyan-400 uppercase">Học Viên</div>
            </div>
            <div className="flex items-center gap-1 shrink-0 px-2 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-mono font-bold text-amber-300" suppressHydrationWarning>{displayCoins}</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5 text-sm font-medium">
            {STUDENT_NAV.map((item) => {
              const active = pathname === item.href || (item.href !== "/student/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all ${
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
        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-mono text-xs font-bold transition-all cursor-pointer border border-rose-500/20"
          >
            <LogOut className="w-4 h-4" /> Đăng Xuất
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
