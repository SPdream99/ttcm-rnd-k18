"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut, LayoutDashboard, UserCheck, ChevronDown } from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const { currentUser, profile, loading } = useAuthAdapter();
  const { signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const user = currentUser || profile;
  const isLoggedIn = Boolean(user && user.email);

  const displayName = (user as any)?.name || (user as any)?.fullName || "Người dùng";
  const displayRole = (user?.role || "student").toUpperCase();
  const displayEmail = user?.email || "";

  const handleLogout = async () => {
    setDropdownOpen(false);
    await signOut();
  };

  const getDashboardUrl = () => {
    if (user?.role === "teacher") {
      return (user as any)?.status === "pending" ? "/public/pending" : "/dashbroad/teacher";
    }
    return "/dashbroad/student";
  };

  return (
    <header
      className="fixed top-0 w-full z-50 bg-[#0a0e1a]/80 backdrop-blur-md border-b border-[#7bd1fa]/15 shadow-lg transition-all duration-300"
      id="main-header"
    >
      <div className="flex justify-between items-center px-4 md:px-8 py-3.5 max-w-7xl mx-auto">
        {/* Brand Logo */}
        <Link href="/" className="font-extrabold text-xl text-white tracking-widest flex items-center gap-2">
          <span
            className="material-symbols-outlined text-cyan-400 text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            public
          </span>
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">E-V-E</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 font-mono text-sm">
          <Link href="/">
            <span className="text-cyan-400 border-b-2 border-cyan-400 pb-0.5 hover:text-white transition-colors cursor-pointer">
              Home
            </span>
          </Link>
        </nav>

        {/* Actions / User Profile Section */}
        <div className="flex items-center gap-4">
          {loading ? (
            <div className="text-xs font-mono text-cyan-400 animate-pulse">Đang tải...</div>
          ) : isLoggedIn ? (
            /* User Profile Pill & Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#151b2c] border border-cyan-500/30 hover:border-cyan-400/60 transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.15)]"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 p-[1.5px]">
                  <div className="w-full h-full rounded-full bg-[#0a0e1a] flex items-center justify-center">
                    <User className="w-4 h-4 text-cyan-300" />
                  </div>
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-white leading-tight" suppressHydrationWarning>{displayName}</div>
                  <div className="text-[10px] font-mono text-cyan-400" suppressHydrationWarning>{displayRole}</div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0f1524] border border-cyan-500/30 shadow-2xl p-3 space-y-2 z-50 animate-fade-in backdrop-blur-xl">
                  <div className="p-3 rounded-xl bg-[#151b2c] border border-slate-800 space-y-1">
                    <div className="font-bold text-sm text-white truncate" suppressHydrationWarning>{displayName}</div>
                    <div className="text-xs text-slate-400 truncate" suppressHydrationWarning>{displayEmail}</div>
                    <span className="inline-block px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/30 mt-1" suppressHydrationWarning>
                      {displayRole}
                    </span>
                  </div>

                  <div className="space-y-1 font-mono text-xs">
                    <Link
                      href={getDashboardUrl()}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <LayoutDashboard className="w-4 h-4 text-cyan-400" /> Bàn Làm Việc Dashboard
                    </Link>

                    <Link
                      href="/dashbroad/student/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <UserCheck className="w-4 h-4 text-emerald-400" /> Trang Cá Nhân
                    </Link>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-mono text-xs font-bold transition-all cursor-pointer border border-red-500/20"
                    >
                      <LogOut className="w-4 h-4 text-red-400" /> Đăng Xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged Out Actions */
            <div className="flex items-center gap-3">
              <Link href="/public/login">
                <button className="text-slate-300 hover:text-white font-mono text-xs px-4 py-2 rounded-xl transition-all cursor-pointer">
                  Đăng Nhập
                </button>
              </Link>
              <Link href="/public/register">
                <button className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold font-mono text-xs shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all cursor-pointer">
                  Đăng Ký
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
