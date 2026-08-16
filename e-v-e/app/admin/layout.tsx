"use client";

import React, { useEffect, useState } from "react";
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
  Menu,
  X,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const cookieUser = getAuthCookie();
    if (!cookieUser && !currentUser && !profile) {
      router.replace("/login");
    }
  }, [currentUser, profile, router]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const displayName = currentUser?.name || (currentUser as any)?.fullName || profile?.fullName || "Quản Trị Viên";
  const displayEmail = currentUser?.email || "admin@eve.edu.vn";

  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-900 font-sans flex-col md:flex-row">
      {/* ── Mobile Top Header (Visible only on screens < md) ── */}
      <header className="md:hidden bg-white border-b-2 border-zinc-200 px-4 py-3 sticky top-0 z-50 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-zinc-100 text-zinc-700 hover:bg-zinc-200 active:scale-95 transition cursor-pointer"
            aria-label="Toggle Admin Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold shadow-xs">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-black text-base tracking-tight text-zinc-950">E-V-E</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-red-100 text-red-700">QUẢN TRỊ</span>
          </Link>
        </div>

        <div className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs font-mono">
          {displayName.charAt(0)}
        </div>
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
                  <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-xs">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-zinc-900 leading-tight">E-V-E Quản Trị</h3>
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
                {ADMIN_NAV.map((item) => {
                  const active = pathname.startsWith(item.href);
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
              <Link
                href="/student/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-zinc-600 hover:text-red-600 hover:bg-red-50 text-xs font-bold transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-red-600" /> Xem Student View
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => signOut()}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors cursor-pointer border border-red-200"
              >
                <LogOut className="w-4 h-4" /> Đăng Xuất Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Desktop Admin Sidebar (Visible on screens >= md) ── */}
      <aside className="hidden md:flex w-64 h-screen bg-white border-r-2 border-zinc-200 p-5 flex-col justify-between z-40 sticky top-0 shrink-0 overflow-y-auto shadow-sm">
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-1">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shadow-sm">
              <Shield className="w-5 h-5" />
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
      <main className="flex-1 overflow-y-auto p-3.5 sm:p-5 md:p-10 max-w-7xl mx-auto w-full min-w-0">
        {children}
      </main>
    </div>
  );
}
