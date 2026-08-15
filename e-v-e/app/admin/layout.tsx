"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Shield,
  LayoutDashboard,
  Users,
  CheckSquare,
  LogOut,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { getAuthCookie } from "@/lib/cookies";

const ADMIN_NAV = [
  { id: "dashboard", label: "Tổng Quan Hệ Thống", icon: LayoutDashboard, href: "/admin/dashboard" },
  { id: "users", label: "Quản Lý Người Dùng & Duyệt GV", icon: Users, href: "/admin/users" },
  { id: "approvals", label: "Duyệt Bài Học & Game", icon: CheckSquare, href: "/admin/approvals" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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

  const displayName = currentUser?.name || (currentUser as any)?.fullName || profile?.fullName || "Quản Trị Viên";
  const displayEmail = currentUser?.email || "admin@eve.edu.vn";

  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-900 font-sans">
      {/* ── Admin Sidebar (Solid Red & White) ── */}
      <aside className="w-64 h-screen bg-white border-r-2 border-zinc-200 p-5 flex flex-col justify-between z-40 sticky top-0 shrink-0 overflow-y-auto shadow-sm">
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-1">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shadow-sm">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-black text-lg tracking-tight text-zinc-900 flex items-center gap-1.5">
                E-V-E{" "}
                <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-red-100 text-red-700">
                  QUẢN TRỊ
                </span>
              </h2>
              <p className="text-[11px] text-zinc-500">Hệ thống quản trị</p>
            </div>
          </div>

          {/* Admin Profile Info */}
          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold shrink-0 text-xs font-mono">
              {displayName.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-zinc-900 truncate" suppressHydrationWarning>{displayName}</div>
              <div className="text-[10px] text-zinc-500 truncate" suppressHydrationWarning>{displayEmail}</div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1 text-sm font-medium">
            {ADMIN_NAV.map((item) => {
              const active = pathname.startsWith(item.href);
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
          <Link
            href="/student/dashboard"
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-zinc-600 hover:text-red-600 hover:bg-red-50 text-xs font-bold transition-colors"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-red-600" /> Xem Student View
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors cursor-pointer border border-red-200"
          >
            <LogOut className="w-4 h-4" /> Đăng Xuất Admin
          </button>
        </div>
      </aside>

      {/* ── Main Admin Content ── */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
