"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  LayoutDashboard,
  UploadCloud,
  FolderKanban,
  Bot,
  LogOut,
  Sparkles,
  Code2,
  UserCheck,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";

const TEACHER_NAV = [
  { id: "dashboard",      label: "Bảng Điều Khiển",      icon: LayoutDashboard, href: "/teacher/dashboard" },
  { id: "upload-center",  label: "Soạn Bài & Học Liệu",  icon: UploadCloud,     href: "/teacher/upload-center" },
  { id: "my-contents",    label: "Quản Lý Bài Đã Tạo",   icon: FolderKanban,    href: "/teacher/my-contents" },
  { id: "game-sdk-guide", label: "Tài Liệu Game SDK",    icon: Code2,           href: "/teacher/game-sdk-guide" },
  { id: "ai-tutor",        label: "Trợ Lý Giảng Dạy AI",  icon: Bot,             href: "/teacher/ai-tutor" },
  { id: "profile",         label: "Hồ Sơ Giáo Viên",      icon: UserCheck,       href: "/teacher/profile" },
];

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthCookie } from "@/lib/cookies";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
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

  const displayName = currentUser?.name || (currentUser as any)?.fullName || profile?.fullName || "Giáo Viên";
  const displayEmail = currentUser?.email || "teacher@eve.edu.vn";

  return (
    <div className="flex min-h-screen bg-[#0a0e1a] text-[#e1e2ec] font-sans">
      {/* ── Teacher Sidebar ── */}
      <aside className="w-64 h-screen bg-[#0d1220] border-r border-[#7bd1fa]/15 p-5 flex flex-col justify-between z-40 sticky top-0 shrink-0 overflow-y-auto">
        <div className="space-y-8">
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 p-[1px] shadow-[0_0_20px_rgba(16,185,129,0.35)]">
              <div className="w-full h-full bg-[#0a0e1a] rounded-[11px] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <h2 className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                E-V-E{" "}
                <span className="text-[10px] px-1.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/20 text-emerald-300 font-mono">
                  GIÁO VIÊN
                </span>
              </h2>
              <p className="text-[11px] text-[#8e9bb4]">Không gian giảng dạy</p>
            </div>
          </div>

          {/* Teacher Profile Info */}
          <div className="px-3 py-3 rounded-xl bg-[#151b2c] border border-emerald-500/20 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate" suppressHydrationWarning>{displayName}</div>
              <div className="text-[10px] font-mono text-emerald-300 truncate" suppressHydrationWarning>{displayEmail}</div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5 text-sm font-medium">
            {TEACHER_NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all ${
                    active
                      ? "bg-gradient-to-r from-emerald-600/25 to-teal-500/15 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.25)] font-semibold"
                      : "text-[#8e9bb4] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-emerald-400" : "text-slate-400"}`} />
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
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Trải Nghiệm Học Sinh
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>

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
