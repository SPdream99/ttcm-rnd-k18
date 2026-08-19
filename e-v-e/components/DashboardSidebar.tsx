"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  GraduationCap,
  Bot,
  Settings,
  HelpCircle,
  BookOpen,
  Gamepad2,
  UserCheck,
  LogOut,
  Coins,
  ChevronRight,
  Layers,
  Code,
  Rocket,
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { useStudentTab, useTeacherTab } from "@/context/DashboardTabContext";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  role: "student" | "teacher";
}

const STUDENT_NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/student/dashboard" },
  { id: "ai_tutor", label: "Gia Sư Học Tập", icon: Bot, href: "/student/ai-tutor" },
  { id: "paths", label: "Lộ Trình Học", icon: Compass, href: "/student/learning-paths" },
  { id: "classes", label: "Lớp Học Của Tôi", icon: GraduationCap, href: "/student/classes" },
  { id: "profile", label: "Trang Cá Nhân", icon: UserCheck, href: "/student/profile" },
];

const TEACHER_NAV = [
  { id: "overview", label: "Bảng Điều Khiển", icon: GraduationCap, href: "/teacher/dashboard" },
  { id: "classes", label: "Quản Lý Lớp Học", icon: Layers, href: "/teacher/classes" },
  { id: "create_path", label: "Soạn Bài & Lộ Trình", icon: BookOpen, href: "/teacher/upload-center" },
  { id: "upload_game", label: "Kho & Nộp Game Engine", icon: Gamepad2, href: "/teacher/upload-center" },
  { id: "game_guide", label: "Hướng Dẫn Game SDK", icon: Code, href: "/teacher/game-sdk-guide" },
  { id: "ai_tutor", label: "Trợ Lý Giảng Dạy", icon: Bot, href: "/teacher/ai-tutor" },
  { id: "profile", label: "Trang Cá Nhân", icon: UserCheck, href: "/teacher/profile" },
];

export default function DashboardSidebar({ role }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, profile } = useAuthAdapter();
  const { signOut } = useAuth();

  const isStudent = role === "student";
  const navItems = isStudent ? STUDENT_NAV : TEACHER_NAV;
  const baseDashboardUrl = isStudent ? "/student/dashboard" : "/teacher/dashboard";
  const isAtBaseDashboard = pathname === baseDashboardUrl;

  const studentCtx = useStudentTab();
  const teacherCtx = useTeacherTab();
  const activeTab = isStudent ? studentCtx.activeTab : teacherCtx.activeTab;
  const setTabInContext = (tab: string) => {
    if (isStudent) studentCtx.setActiveTab(tab as import("@/context/DashboardTabContext").StudentTab);
    else teacherCtx.setActiveTab(tab as import("@/context/DashboardTabContext").TeacherTab);
  };

  const displayName =
    (currentUser as any)?.name ||
    (currentUser as any)?.fullName ||
    (profile as any)?.fullName ||
    "Người dùng";
  const displayCoins = currentUser?.coins ?? profile?.coins ?? 0;

  // Active nav: red text + animated underline (no filled background)
  const activeClass = "nav-link-active";
  const iconColour = "text-zinc-500";

  const isActiveItem = (item: (typeof STUDENT_NAV)[0]): boolean => {
    if (item.href) return pathname.startsWith(item.href);
    return isAtBaseDashboard && activeTab === item.id;
  };

  const handleItemClick = (item: (typeof STUDENT_NAV)[0]) => {
    if (item.href) {
      router.push(item.href);
    } else {
      setTabInContext(item.id as any);
      if (!isAtBaseDashboard) {
        router.push(baseDashboardUrl);
      }
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const brandLabel = isStudent ? "Học Viên" : "Giảng Viên";
  const brandBadge = isStudent ? "STUDENT" : "TEACHER";
  const BrandIcon = isStudent ? Rocket : GraduationCap;

  return (
    <aside className="w-full md:w-64 min-h-screen bg-white border-r-2 border-zinc-200 p-5 flex flex-col justify-between z-40 sticky top-0 font-sans shadow-sm">
      {/* ── Top section ── */}
      <div className="space-y-6">
        {/* Brand */}
        <div className="flex items-center gap-2 px-1">
          <img
            src="/logo.png"
            alt="E-V-E"
            className="h-8.5 w-auto object-contain block"
            style={{ height: "34px", width: "auto" }}
          />
          <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-red-100 text-red-700 uppercase">
            {brandBadge}
          </span>
        </div>

        {/* User Quick Info */}
        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-xs font-bold text-zinc-900 truncate" suppressHydrationWarning>{displayName}</div>
            <div className="text-[10px] text-zinc-500 uppercase">{role}</div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Coins className="w-3.5 h-3.5 text-red-600" />
            <span className="text-xs font-bold text-red-600 font-mono" suppressHydrationWarning>{displayCoins}</span>
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
                className={`nav-link w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer text-left ${
                  active ? activeClass : ""
                }`}
              >
                <Icon className={`nav-link-icon w-4 h-4 shrink-0 ${active ? "text-red-600" : iconColour}`} />
                <span className="flex-1 truncate">{item.label}</span>
                {item.href && !active && (
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Bottom Section ── */}
      <div className="space-y-3 pt-4 border-t border-zinc-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Đăng Xuất
        </button>
      </div>
    </aside>
  );
}
