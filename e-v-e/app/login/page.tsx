"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { setAuthCookie } from "@/lib/cookies";
import { Rocket, Sparkles, LogIn, Mail, Lock, ShieldAlert } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [message, setMessage] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const { login, loading } = useAuthAdapter();

  useEffect(() => {
    const savedEmail = localStorage.getItem("eve_remembered_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (rememberMe) {
      localStorage.setItem("eve_remember_me", "true");
      localStorage.setItem("eve_remembered_email", email);
    } else {
      localStorage.setItem("eve_remember_me", "false");
      localStorage.removeItem("eve_remembered_email");
    }

    const res = await login({ email, pass: password, rememberMe });

    if (!res.success || !res.user) {
      setMessage(res.error || "Email hoặc mật khẩu không đúng.");
      return;
    }

    // Save auth cookie immediately
    setAuthCookie(res.user, rememberMe);

    const { role, status } = res.user;

    if (status === "banned") {
      setMessage("Tài khoản của bạn đã bị khóa bởi Quản trị viên.");
      return;
    }

    if (role === "teacher" && status === "pending") {
      setMessage("Tài khoản đang chờ Admin phê duyệt. Đang chuyển hướng...");
      setTimeout(() => {
        window.location.href = "/pending";
      }, 1000);
      return;
    }

    setMessage("Đăng nhập thành công! Đang vào trung tâm điều hành...");
    setTimeout(() => {
      if (role === "admin" || role === "school") {
        window.location.href = "/admin/dashboard";
      } else if (role === "teacher") {
        window.location.href = "/teacher/dashboard";
      } else {
        window.location.href = "/student/dashboard";
      }
    }, 1000);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage("Vui lòng nhập email của bạn trước khi khôi phục.");
      return;
    }
    setResetSent(true);
    setMessage(`Liên kết đặt lại mật khẩu đã được gửi đến email ${email}. Vui lòng kiểm tra hộp thư!`);
  };

  return (
    <div className="bg-[#0a0e1a] text-[#e1e2ec] min-h-screen flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden relative font-sans">
      {/* Background Starfield Effect */}
      <div
        className="absolute inset-0 z-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#7bd1fa 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      {/* Main Login Container */}
      <main className="w-full max-w-md relative z-10 my-auto">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 p-[1px] shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0a0e1a] rounded-[11px] flex items-center justify-center">
                <Rocket className="w-5 h-5 text-cyan-300" />
              </div>
            </div>
            <span className="font-extrabold text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              E-V-E
            </span>
          </Link>

          <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
            {isForgotPassword ? "Khôi Phục Mật Khẩu" : "Chào mừng trở lại"}
          </h2>
          <p className="text-xs md:text-sm text-[#8e9bb4]">
            {isForgotPassword
              ? "Nhập email của bạn để nhận liên kết đặt lại mật khẩu."
              : "Đăng nhập để vào không gian học tập & giảng dạy."}
          </p>
        </div>

        {/* Card Form */}
        <div className="rounded-2xl bg-[#0f1524]/80 backdrop-blur-xl border border-[#7bd1fa]/20 p-6 md:p-8 shadow-2xl shadow-cyan-950/30">
          {!isForgotPassword ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" /> Email Chỉ Huy
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@school.edu.vn"
                  className="w-full bg-[#151b2c] border border-cyan-500/20 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all placeholder-slate-500"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" /> Mật Khẩu
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true);
                      setMessage("");
                      setResetSent(false);
                    }}
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#151b2c] border border-cyan-500/20 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all placeholder-slate-500"
                  required
                />
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-400 accent-cyan-500 cursor-pointer"
                  />
                  <span className="text-xs font-mono text-slate-300">Ghi nhớ đăng nhập</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-cyan-300 text-white font-bold font-mono text-sm shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                {loading ? "Đang xác thực..." : "Đăng Nhập"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" /> Email Cần Khôi Phục
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@school.edu.vn"
                  className="w-full bg-[#151b2c] border border-cyan-500/20 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all placeholder-slate-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={resetSent}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold font-mono text-sm shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all disabled:opacity-50 cursor-pointer"
              >
                {resetSent ? "Đã Gửi Liên Kết" : "Gửi Yêu Cầu Đặt Lại"}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setMessage("");
                    setResetSent(false);
                  }}
                  className="text-xs font-mono text-slate-400 hover:text-white hover:underline cursor-pointer"
                >
                  ← Quay lại Đăng nhập
                </button>
              </div>
            </form>
          )}

          {message && (
            <div className="mt-4 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-center text-xs font-mono text-cyan-300">
              {message}
            </div>
          )}

          <div className="pt-5 mt-5 border-t border-slate-800 text-center">
            <Link
              href="/register"
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline inline-flex items-center gap-1"
            >
              Chưa có tài khoản? Khởi tạo hồ sơ mới →
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center font-mono text-[11px] text-slate-500 z-10 py-4">
        © 2026 E-V-E COSMIC PLATFORM • CLEAN ARCHITECTURE & ROLE-BASED ACCESS
      </footer>
    </div>
  );
}
