"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { login, loading } = useAuthAdapter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const res = await login({ email, pass: password });

    if (!res.success || !res.user) {
      setMessage(res.error || "Email hoặc mật khẩu không đúng.");
      return;
    }

    const { role, status } = res.user;

    if (status === "banned") {
      setMessage("Tài khoản của bạn đã bị ban hoặc khóa bởi Admin.");
      return;
    }

    if (role === "teacher" && status === "pending") {
      setMessage("Tài khoản đang chờ phê duyệt. Đang chuyển hướng...");
      setTimeout(() => {
        window.location.href = "/public/pending";
      }, 1000);
      return;
    }

    setMessage("Đăng nhập thành công! Đang vào trung tâm điều hành...");
    setTimeout(() => {
      if (role === "student") {
        window.location.href = "/dashbroad/student";
      } else if (role === "teacher") {
        window.location.href = "/dashbroad/teacher";
      } else if (role === "school" || role === "admin") {
        // Redirect to school (Admin dashboard route)
        window.location.href = "/dashbroad/school";
      } else {
        window.location.href = "/dashbroad/student";
      }
    }, 1000);
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col items-center justify-center bg-nebula p-margin-mobile md:p-margin-desktop overflow-hidden relative">
      {/* Background Stars Effect */}
      <div
        className="absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage: "radial-gradient(white 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Login Container */}
      <main className="w-full max-w-md relative z-10 my-auto">
        {/* Brand Header */}
        <div className="text-center mb-stack-lg">
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-widest uppercase mb-stack-sm drop-shadow-[0_0_15px_rgba(173,198,255,0.3)]">
            E-V-E
          </h1>

          <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-sm">
            Chào mừng trở lại
          </h2>

          <p className="font-body-md text-body-md text-on-surface-variant">
            Tiếp tục hành trình khám phá tri thức của bạn.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Email Chỉ Huy
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@truong.edu.vn"
              className="w-full bg-slate-950/80 border border-sky-500/20 focus:border-sky-400 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Mật Khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-950/80 border border-sky-500/20 focus:border-sky-400 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold font-mono text-sm shadow-[0_0_25px_rgba(125,211,252,0.4)] transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "🚀 Đăng Nhập"}
          </button>
        </form>

        {message && (
          <p className="text-center text-sm font-medium text-cyan-300 mt-4">
            {message}
          </p>
        )}

        <div className="pt-6 mt-6 border-t border-slate-800/80 text-center">
          <Link
            href="/public/register"
            className="text-xs font-mono text-sky-400 hover:underline"
          >
            Chưa có tài khoản? Khởi tạo hồ sơ mới →
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center font-mono text-xs text-slate-500 z-10 py-4">
        © 2026 E-V-E EDUCATION PLATFORM • GLACIER GLASSMORPHISM
      </footer>
    </div>
  );
}
