"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Clock, ShieldAlert, ArrowLeft, LogOut, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function PendingApprovalPage() {
  const { signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOutAndRedirect = async () => {
    setIsLoggingOut(true);
    await signOut();
  };

  return (
    <main className="bg-[#0a0e1a] text-[#e1e2ec] min-h-screen flex items-center justify-center p-4 md:p-8 overflow-hidden relative font-sans">
      {/* Background Starfield Effect */}
      <div
        className="absolute inset-0 z-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#7bd1fa 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10 rounded-2xl p-8 bg-[#0f1524]/90 backdrop-blur-xl border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.15)] text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center animate-pulse">
          <Clock className="w-8 h-8 text-emerald-400" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Hồ Sơ Chờ Phê Duyệt 👨‍🏫
          </h1>
          <p className="text-sm text-[#8e9bb4]">
            Hồ sơ Giáo viên của bạn đã được gửi đến Ban Quản trị và đang trong danh sách chờ duyệt.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#151b2c] border border-emerald-500/10 text-xs text-left text-emerald-300 flex gap-2.5">
          <ShieldAlert className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
          <span>
            Admin sẽ kiểm duyệt thông tin và cấp quyền truy cập Educator Studio cho bạn sớm nhất có thể (thường trong vòng 12-24h).
          </span>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            disabled={isLoggingOut}
            onClick={handleSignOutAndRedirect}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-rose-400 hover:text-rose-300 hover:underline cursor-pointer disabled:opacity-50"
          >
            {isLoggingOut ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <LogOut className="w-3.5 h-3.5" />
            )}
            <span>{isLoggingOut ? "Đang xử lý..." : "Đăng xuất"}</span>
          </button>

          <button
            type="button"
            disabled={isLoggingOut}
            onClick={handleSignOutAndRedirect}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer disabled:opacity-50 font-bold"
          >
            <span>{isLoggingOut ? "Đang đăng xuất..." : "Đăng nhập tài khoản khác"}</span>
            <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
          </button>
        </div>
      </div>
    </main>
  );
}
