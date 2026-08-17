"use client";

import React, { useEffect, useState } from "react";
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
  Bot,
  ArrowLeft,
  GraduationCap,
  ShieldAlert,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { getAuthCookie } from "@/lib/cookies";
import AITutorFloatingWidget from "@/components/AITutorFloatingWidget";

const STUDENT_NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/student/dashboard" },
  { id: "learning-paths", label: "Lộ Trình Học Tập", icon: BookOpen, href: "/student/learning-paths" },
  { id: "classes", label: "Lớp Học Của Tôi", icon: GraduationCap, href: "/student/classes" },
  { id: "games", label: "Kho Minigame", icon: Gamepad2, href: "/student/games" },
  { id: "ai-tutor", label: "Gia Sư Học Tập", icon: Bot, href: "/student/ai-tutor" },
  { id: "leaderboard", label: "Bảng Xếp Hạng", icon: Trophy, href: "/student/leaderboard" },
  { id: "shop", label: "Đổi Thưởng", icon: ShoppingBag, href: "/student/shop" },
  { id: "profile", label: "Hồ Sơ Cá Nhân", icon: UserCheck, href: "/student/profile" },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();
  const { currentUser, profile } = useAuthAdapter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const displayName =
    currentUser?.name ||
    (currentUser as any)?.fullName ||
    profile?.fullName ||
    "Học Viên";
  const displayCoins = currentUser?.coins ?? profile?.coins ?? 250;

  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-900 font-sans flex-col md:flex-row">
      {/* ── Mobile Top Header (Visible only on mobile screens < md) ── */}
      <header className="md:hidden bg-white border-b-2 border-zinc-200 px-4 py-3 sticky top-0 z-50 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-zinc-100 text-zinc-700 hover:bg-zinc-200 active:scale-95 transition cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link href="/student/dashboard" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="E-V-E"
              className="h-7 w-auto object-contain block"
              style={{ height: "28px", width: "auto" }}
            />
            <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-red-100 text-red-700">HỌC VIÊN</span>
          </Link>
        </div>

        {/* Coins indicator in Mobile Header */}
        <Link href="/student/shop" className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 border border-red-200 text-red-700 font-bold text-xs font-mono">
          <Coins className="w-3.5 h-3.5 text-red-600" />
          <span suppressHydrationWarning>{displayCoins}</span>
        </Link>
      </header>

      {/* ── Mobile Drawer Backdrop & Menu ── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-zinc-950/50 backdrop-blur-xs z-50 md:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-72 max-w-[85vw] h-full bg-white border-r-2 border-zinc-200 p-5 flex flex-col justify-between overflow-y-auto shadow-2xl animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-5">
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/logo.png"
                    alt="E-V-E"
                    className="h-7.5 w-auto object-contain block"
                    style={{ height: "30px", width: "auto" }}
                  />
                  <div>
                    <h3 className="font-bold text-xs text-red-600 uppercase tracking-wider">Học Viên</h3>
                    <p className="text-[11px] text-zinc-500 truncate max-w-[140px]" suppressHydrationWarning>{displayName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items in Drawer */}
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
                      onClick={() => setMobileMenuOpen(false)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors ${
                        active
                          ? "bg-red-600 text-white font-bold shadow-sm"
                          : "text-zinc-600 hover:text-red-600 hover:bg-red-50"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? "text-white" : "text-zinc-500"}`} />
                      <span className="text-xs tracking-wide">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Actions in Drawer */}
            <div className="pt-4 border-t border-zinc-200 space-y-2">
              {isTeacher && (
                <Link href="/teacher/dashboard">
                  <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold transition-colors border border-zinc-200 cursor-pointer">
                    <ArrowLeft className="w-3.5 h-3.5" /> Về Giáo Viên
                  </button>
                </Link>
              )}
              {isAdmin && (
                <Link href="/admin/dashboard">
                  <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold transition-colors border border-zinc-200 cursor-pointer">
                    <ArrowLeft className="w-3.5 h-3.5" /> Về Admin
                  </button>
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors cursor-pointer border border-red-200"
              >
                <LogOut className="w-4 h-4" /> Đăng Xuất
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Desktop Student Sidebar (Visible on screens >= md) ── */}
      <aside className="hidden md:flex w-64 h-screen bg-white border-r-2 border-zinc-200 p-5 flex-col justify-between z-40 sticky top-0 shrink-0 overflow-y-auto shadow-sm">
        <div className="space-y-6">
          {/* Brand Header */}
          <Link href="/student/dashboard" className="flex items-center gap-2 px-1">
            <img
              src="/logo.png"
              alt="E-V-E"
              className="h-8.5 w-auto object-contain block"
              style={{ height: "34px", width: "auto" }}
            />
            <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-red-100 text-red-700 uppercase">
              HỌC VIÊN
            </span>
          </Link>

          {/* Quick Return Portal for Teacher or Admin */}
          {isTeacher && (
            <Link href="/teacher/dashboard">
              <div className="p-3 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-800 hover:bg-zinc-200 transition-colors flex items-center justify-between gap-2 cursor-pointer">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <GraduationCap className="w-4 h-4 text-red-600" />
                  <span>Về Trang Giáo Viên</span>
                </div>
                <ArrowLeft className="w-3.5 h-3.5 rotate-180 text-zinc-600" />
              </div>
            </Link>
          )}

          {isAdmin && (
            <Link href="/admin/dashboard">
              <div className="p-3 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-800 hover:bg-zinc-200 transition-colors flex items-center justify-between gap-2 cursor-pointer">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  <span>Về Trang Quản Trị</span>
                </div>
                <ArrowLeft className="w-3.5 h-3.5 rotate-180 text-zinc-600" />
              </div>
            </Link>
          )}

          {/* Student Profile & Coins Info */}
          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-xs font-bold text-zinc-900 truncate" suppressHydrationWarning>
                {displayName}
              </div>
              <div className="text-[10px] text-zinc-500 uppercase font-medium">
                {isTeacher ? "Giáo Viên (Xem thử)" : isAdmin ? "Admin (Xem thử)" : "Học Viên"}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0 px-2 py-1 rounded-lg bg-red-50 border border-red-200">
              <Coins className="w-3.5 h-3.5 text-red-600" />
              <span className="text-xs font-mono font-bold text-red-700" suppressHydrationWarning>
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
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors ${
                    active
                      ? "bg-red-600 text-white font-bold shadow-sm"
                      : "text-zinc-600 hover:text-red-600 hover:bg-red-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-white" : "text-zinc-500"}`} />
                  <span className="text-xs tracking-wide">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-zinc-200 space-y-2">
          {isTeacher && (
            <Link href="/teacher/dashboard">
              <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold transition-colors border border-zinc-200 cursor-pointer">
                <ArrowLeft className="w-3.5 h-3.5" /> Thoát Xem Thử Học Sinh
              </button>
            </Link>
          )}

          {isAdmin && (
            <Link href="/admin/dashboard">
              <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold transition-colors border border-zinc-200 cursor-pointer">
                <ArrowLeft className="w-3.5 h-3.5" /> Thoát Về Admin
              </button>
            </Link>
          )}

          <button
            onClick={() => signOut()}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors cursor-pointer border border-red-200"
          >
            <LogOut className="w-4 h-4" /> Đăng Xuất
          </button>
        </div>
      </aside>

      {/* ── Main Content Container ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Sticky Experience Banner for Teacher / Admin */}
        {(isTeacher || isAdmin) && (
          <div className="bg-white border-b-2 border-red-600 px-4 py-2.5 flex items-center justify-between gap-3 text-xs sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-2 text-zinc-800 truncate">
              {isTeacher ? (
                <GraduationCap className="w-4 h-4 text-red-600 shrink-0" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span className="truncate">
                Đang ở chế độ <strong>Trải nghiệm Học sinh</strong> ({isTeacher ? "Tài khoản Giáo viên" : "Tài khoản Admin"})
              </span>
            </div>

            <Link href={isTeacher ? "/teacher/dashboard" : "/admin/dashboard"}>
              <button className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isTeacher ? "Quay Về Trang Giáo Viên" : "Quay Về Trang Admin"}</span>
              </button>
            </Link>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-3.5 sm:p-5 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* ── Floating AI Tutor Mini Widget ── */}
      <AITutorFloatingWidget />
    </div>
  );
}
