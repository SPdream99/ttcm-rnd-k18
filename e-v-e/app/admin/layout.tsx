"use client";

import React from "react";
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
  UserCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";

const ADMIN_NAV = [
  { id: "dashboard", label: "Tổng Quan Hệ Thống", icon: LayoutDashboard, href: "/admin/dashboard" },
  { id: "users",     label: "Quản Lý Người Dùng & Duyệt GV", icon: Users,           href: "/admin/users" },
  { id: "approvals", label: "Duyệt Bài Học, Lộ Trình & Game", icon: CheckSquare,   href: "/admin/approvals" },
];

import { useEffect } from "react";
import { getAuthCookie } from "@/lib/cookies";

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
    <div className="flex min-h-screen bg-[#0a0e1a] text-[#e1e2ec] font-sans">
      {/* ── Admin Sidebar ── */}
      <aside className="w-64 min-h-screen bg-[#0d1220] border-r border-[#7bd1fa]/15 p-5 flex flex-col justify-between z-40 sticky top-0 shrink-0">
        <div className="space-y-8">
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 p-[1px] shadow-[0_0_20px_rgba(244,63,94,0.35)]">
              <div className="w-full h-full bg-[#0a0e1a] rounded-[11px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-rose-400" />
              </div>
            </div>
            <div>
              <h2 className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                E-V-E{" "}
                <span className="text-[10px] px-1.5 py-0.5 rounded-full border border-rose-500/30 bg-rose-500/20 text-rose-300 font-mono">
                  QUẢN TRỊ
                </span>
              </h2>
              <p className="text-[11px] text-[#8e9bb4]">Hệ thống quản trị</p>
            </div>
          </div>

          {/* Admin Profile Info */}
          <div className="px-3 py-3 rounded-xl bg-[#151b2c] border border-rose-500/20 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-rose-400" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate" suppressHydrationWarning>{displayName}</div>
              <div className="text-[10px] font-mono text-rose-300 truncate" suppressHydrationWarning>{displayEmail}</div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5 text-sm font-medium">
            {ADMIN_NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all ${
                    active
                      ? "bg-gradient-to-r from-rose-600/25 to-indigo-600/20 text-white border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.2)] font-semibold"
                      : "text-[#8e9bb4] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-rose-400" : "text-slate-400"}`} />
                  <span className="text-xs tracking-wide">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <Link
            href="/student/dashboard"
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[#8e9bb4] hover:text-cyan-300 hover:bg-cyan-950/20 border border-transparent hover:border-cyan-500/20 transition-all text-xs font-mono"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Xem Student View
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-mono text-xs font-bold transition-all cursor-pointer border border-rose-500/20"
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
