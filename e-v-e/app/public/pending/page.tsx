"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Clock, ShieldAlert, ArrowLeft, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function PendingApprovalPage() {
  const { signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOutAndRedirect = async () => {
    setIsLoggingOut(true);
    await signOut();
  };

  return (
    <main className="bg-background text-on-surface min-h-screen flex items-center justify-center bg-nebula p-margin-mobile md:p-margin-desktop overflow-hidden relative">
      {/* Background Stars Effect */}
      <div
        className="absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage: "radial-gradient(white 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="max-w-md w-full relative z-10 glass-card rounded-2xl p-8 border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)] text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center animate-pulse">
          <Clock className="w-8 h-8 text-emerald-400" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Tài Khoản Chờ Phê Duyệt 👨‍🏫
          </h1>
          <p className="text-sm text-[#8e9bb4]">
            Hồ sơ giáo viên của bạn đã được khởi tạo thành công và đang chờ Admin phê duyệt trước khi kích hoạt.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#151b2c] border border-emerald-500/10 text-xs text-left text-emerald-300 flex gap-2">
          <ShieldAlert className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>
            Hệ thống sẽ gửi email thông báo cho bạn ngay sau khi tài khoản được duyệt bởi ban quản trị. Thông thường quá trình này mất từ 12-24 giờ.
          </span>
        </div>

        <div className="pt-4 border-t border-slate-800/80">
          <button
            type="button"
            disabled={isLoggingOut}
            onClick={handleSignOutAndRedirect}
            className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:underline cursor-pointer disabled:opacity-50"
          >
            {isLoggingOut ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ArrowLeft className="w-3.5 h-3.5" />}
            {isLoggingOut ? "Đang đăng xuất..." : "Quay lại trang Đăng Nhập"}
          </button>
        </div>
      </div>
    </main>
  );
}
