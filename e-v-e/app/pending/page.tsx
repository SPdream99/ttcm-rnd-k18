"use client";

import React, { useState } from "react";
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
    <main className="bg-zinc-50 text-zinc-900 min-h-screen flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="max-w-md w-full rounded-2xl p-8 bg-white border-2 border-red-600 shadow-sm text-center space-y-6">
        <div className="mx-auto flex items-center justify-center">
          <img
            src="/logo.png"
            alt="E-V-E"
            className="h-12 w-auto object-contain block"
            style={{ height: "48px", width: "auto" }}
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight">
            Hồ Sơ Chờ Phê Duyệt 
          </h1>
          <p className="text-sm text-zinc-600">
            Hồ sơ Giáo viên của bạn đã được gửi đến Ban Quản trị và đang trong danh sách chờ duyệt.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-left text-red-700 flex gap-2.5">
          <ShieldAlert className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
          <span>
            Admin sẽ kiểm duyệt thông tin và cấp quyền truy cập Giảng viên cho bạn sớm nhất có thể.
          </span>
        </div>

        <div className="pt-4 border-t border-zinc-200 flex items-center justify-between">
          <button
            type="button"
            disabled={isLoggingOut}
            onClick={handleSignOutAndRedirect}
            className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:underline cursor-pointer disabled:opacity-50 font-bold"
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
            className="inline-flex items-center gap-1.5 text-xs text-zinc-700 hover:underline cursor-pointer disabled:opacity-50 font-bold"
          >
            <span>Đăng nhập tài khoản khác</span>
            <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
          </button>
        </div>
      </div>
    </main>
  );
}
