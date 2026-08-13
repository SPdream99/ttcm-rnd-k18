"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Rocket,
  GraduationCap,
  BookOpen,
  Gamepad2,
  Trophy,
  ShoppingBag,
  UserCheck,
  Bot,
  LogOut,
  Coins,
  ChevronRight,
  PlusCircle,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SidebarProps {
  /** Role xác định màu chủ đạo & menu items */
  role: "student" | "teacher";
  /** Tab hiện tại (cho các trang dùng internal tab state) */
  activeTab?: string;
  /** Callback khi chuyển tab nội bộ */
  onTabChange?: (tab: string) => void;
}

// ─── Nav Configs ──────────────────────────────────────────────────────────────

const STUDENT_NAV = [
  { id: "paths",       label: "Lộ Trình Học Tập",    icon: BookOpen,     href: null },
  { id: "games",       label: "Game Engine Quiz",      icon: Gamepad2,     href: null },
  { id: "leaderboard", label: "Bảng Xếp Hạng",        icon: Trophy,       href: null },
  { id: "shop",        label: "Cửa Hàng Đổi Coin",    icon: ShoppingBag,  href: null },
  { id: "ai_tutor",    label: "Trợ Lý AI Tutor",      icon: Bot,          href: "/dashbroad/student/AITutor" },
  { id: "profile",     label: "Trang Cá Nhân",         icon: UserCheck,    href: "/dashbroad/student/profile" },
];

const TEACHER_NAV = [
  { id: "overview",     label: "Bàn Làm Việc",         icon: GraduationCap, href: null },
  { id: "create_path",  label: "Tạo Lộ Trình Mới",     icon: BookOpen,      href: null },
  { id: "upload_game",  label: "Nộp Game Engine",       icon: Gamepad2,      href: null },
  { id: "ai_tutor",     label: "Trợ Lý AI Tutor",       icon: Bot,           href: "/dashbroad/student/AITutor" },
  { id: "profile",      label: "Trang Cá Nhân",          icon: UserCheck,     href: "/dashbroad/student/profile" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function DashboardSidebar({ role, activeTab, onTabChange }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, profile } = useAuthAdapter();

  const isStudent = role === "student";
  const navItems = isStudent ? STUDENT_NAV : TEACHER_NAV;

  const displayName =
    (currentUser as any)?.name ||
    (currentUser as any)?.fullName ||
    (profile as any)?.fullName ||
    "Người dùng";
  const displayCoins = currentUser?.coins ?? profile?.coins ?? 0;

  // Active highlight colours
  const activeClass = isStudent
    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
    : "bg-gradient-to-r from-emerald-600/25 to-teal-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.25)]";

  const iconColour = isStudent ? "text-cyan-400" : "text-emerald-400";

  const isActiveItem = (item: (typeof STUDENT_NAV)[0]): boolean => {
    if (item.href) return pathname.startsWith(item.href);
    return activeTab === item.id;
  };

  const handleItemClick = (item: (typeof STUDENT_NAV)[0]) => {
    if (item.href) {
      router.push(item.href);
    } else if (onTabChange) {
      onTabChange(item.id);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("eve_user");
      localStorage.removeItem("remember_me");
      localStorage.removeItem("user_email");
    }
    router.push("/public/login");
  };

  // ─── Brand accent ────────────────────────────────────────────────────────────
  const brandGradient = isStudent
    ? "from-cyan-500 to-blue-600"
    : "from-emerald-500 via-teal-400 to-cyan-500";
  const brandGlow = isStudent
    ? "shadow-[0_0_20px_rgba(59,130,246,0.4)]"
    : "shadow-[0_0_20px_rgba(16,185,129,0.4)]";
  const brandBadgeClass = isStudent
    ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
  const brandLabel = isStudent ? "Student Hub" : "Educator Studio";
  const brandBadge = isStudent ? "STUDENT" : "TEACHER";
  const BrandIcon = isStudent ? Rocket : GraduationCap;

  return (
    <aside className="w-full md:w-64 min-h-screen bg-[#0f1524]/90 backdrop-blur-xl border-r border-[#7bd1fa]/15 p-5 flex flex-col justify-between z-40 sticky top-0">
      {/* ── Top section ── */}
      <div className="space-y-8">
        {/* Brand */}
        <div className="flex items-center gap-3 px-1">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${brandGradient} p-[1px] ${brandGlow}`}>
            <div className="w-full h-full bg-[#0a0e1a] rounded-[11px] flex items-center justify-center">
              <BrandIcon className={`w-5 h-5 ${iconColour} animate-pulse`} />
            </div>
          </div>
          <div>
            <h2 className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
              E-V-E{" "}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${brandBadgeClass}`}>
                {brandBadge}
              </span>
            </h2>
            <p className="text-[11px] text-[#8e9bb4]">{brandLabel}</p>
          </div>
        </div>

        {/* User Quick Info */}
        <div className="px-1 py-3 rounded-xl bg-[#151b2c] border border-[#7bd1fa]/10 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">{displayName}</div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">{role}</div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-mono font-bold text-amber-300">{displayCoins}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5 text-sm font-medium">
          {navItems.map((item) => {
            const active = isActiveItem(item);
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer text-left ${
                  active ? activeClass : "text-[#8e9bb4] hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? iconColour : ""}`} />
                <span className="flex-1 truncate">{item.label}</span>
                {item.href && !active && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Bottom section ── */}
      <div className="pt-6 border-t border-[#7bd1fa]/10 space-y-3">
        {/* AI Tutor shortcut banner */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-900/40 via-[#151b2c] to-purple-900/30 border border-cyan-500/25">
          <div className="flex items-center gap-2 mb-1">
            <Bot className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-white">E-V-E AI Tutor</span>
          </div>
          <p className="text-[10px] text-[#8e9bb4] mb-2">Sẵn sàng giải đáp 24/7</p>
          <Link href="/dashbroad/student/AITutor">
            <button className="w-full py-1.5 px-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-medium text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer">
              <Bot className="w-3 h-3" /> Trò Chuyện Ngay
            </button>
          </Link>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-mono font-bold transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" /> Đăng Xuất
        </button>
      </div>
    </aside>
  );
}
