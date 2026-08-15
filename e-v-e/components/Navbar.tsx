"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut, LayoutDashboard, UserCheck, ChevronDown, Rocket } from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const { currentUser, profile, loading } = useAuthAdapter();
  const { signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      return (user as any)?.status === "pending" ? "/pending" : "/teacher/dashboard";
    }
    if (user?.role === "admin" || user?.role === "school") {
      return "/admin/dashboard";
    }
    return "/student/dashboard";
  };

  const getProfileUrl = () => {
    if (user?.role === "teacher") {
      return "/teacher/profile";
    }
    return "/student/profile";
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b-2 border-zinc-200 shadow-sm transition-all">
      <div className="flex justify-between items-center px-4 md:px-8 py-3.5 max-w-7xl mx-auto">
        {/* Brand Logo */}
        <Link href="/" className="font-black text-xl text-red-600 tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold">
            <Rocket className="w-4 h-4" />
          </div>
          <span>E-V-E</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-bold">
          <Link href="/">
            <span className="text-red-600 border-b-2 border-red-600 pb-0.5 hover:text-red-700 transition-colors cursor-pointer">
              Trang Chủ
            </span>
          </Link>
        </nav>

        {/* Actions / User Profile Section */}
        <div className="flex items-center gap-4">
          {loading ? (
            <div className="text-xs text-red-600 font-bold">Đang tải...</div>
          ) : isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-zinc-50 border border-zinc-200 hover:border-red-600 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs font-mono">
                  {displayName.charAt(0)}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-zinc-900 leading-tight" suppressHydrationWarning>{displayName}</div>
                  <div className="text-[10px] text-zinc-500 uppercase font-medium" suppressHydrationWarning>{displayRole}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-zinc-200 shadow-xl py-2 z-50">
                  <div className="px-4 py-2.5 border-b border-zinc-100">
                    <div className="text-xs font-bold text-zinc-900 truncate">{displayName}</div>
                    <div className="text-[11px] text-zinc-500 truncate">{displayEmail}</div>
                  </div>

                  <div className="py-1">
                    <Link
                      href={getDashboardUrl()}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-zinc-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-red-600" /> Bảng Điều Khiển
                    </Link>

                    <Link
                      href={getProfileUrl()}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-zinc-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <UserCheck className="w-4 h-4 text-red-600" /> Hồ Sơ & Bảo Mật
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-zinc-100">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4" /> Đăng Xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <button className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-700 hover:text-zinc-900 transition cursor-pointer">
                  Đăng Nhập
                </button>
              </Link>
              <Link href="/register">
                <button className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition shadow-sm cursor-pointer">
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
