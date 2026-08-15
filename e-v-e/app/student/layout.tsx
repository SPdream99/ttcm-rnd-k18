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
  Bot,
  ArrowLeft,
  GraduationCap,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { getAuthCookie } from "@/lib/cookies";

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
    "Học Viên";
  const displayCoins = currentUser?.coins ?? profile?.coins ?? 250;

  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-900 font-sans flex-col md:flex-row">
      {/* ── Student Sidebar (Solid Red & White, No Gradients) ── */}
      <aside className="w-full md:w-64 md:h-screen bg-white border-r-2 border-zinc-200 p-5 flex flex-col justify-between z-40 md:sticky top-0 shrink-0 overflow-y-auto shadow-sm">
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-1">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-sm">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-black text-lg tracking-tight text-zinc-900 flex items-center gap-1.5">
                E-V-E{" "}
                <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-red-100 text-red-700">
                  HỌC VIÊN
                </span>
              </h2>
              <p className="text-[11px] text-zinc-500">Hệ Sinh Thái Giáo Dục</p>
            </div>
          </div>

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

        <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
