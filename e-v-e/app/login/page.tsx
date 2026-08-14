"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { setAuthCookie } from "@/lib/cookies";
import {
  Rocket,
  Sparkles,
  LogIn,
  Mail,
  Lock,
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  RefreshCw,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [message, setMessage] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // ── 2FA Challenge States ──
  const [is2FAChallenge, setIs2FAChallenge] = useState(false);
  const [pendingUser, setPendingUser] = useState<any | null>(null);
  const [otpInputs, setOtpInputs] = useState(["", "", "", "", "", ""]);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [isResendingOTP, setIsResendingOTP] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [maskedEmail, setMaskedEmail] = useState("");
  const [demoOtpHint, setDemoOtpHint] = useState<string | null>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { login, loading } = useAuthAdapter();

  useEffect(() => {
    const savedEmail = localStorage.getItem("eve_remembered_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Cooldown countdown timer for Resend OTP
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

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

    const { role, status, twoFactorEnabled } = res.user;

    if (status === "banned") {
      setMessage("Tài khoản của bạn đã bị khóa bởi Quản trị viên.");
      return;
    }

    // ── Check if 2FA is required for this account ──
    if (twoFactorEnabled) {
      setPendingUser(res.user);
      setIs2FAChallenge(true);
      setMessage("Tài khoản đã kích hoạt 2FA. Đang gửi mã xác thực tới email của bạn...");

      // Send 2FA OTP Code to email
      try {
        const sendRes = await fetch("/api/auth/2fa/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: res.user.email || email,
            recipientName: res.user.name,
            purpose: "login",
          }),
        });
        const data = await sendRes.json();
        if (data.success) {
          setMaskedEmail(data.maskedEmail || email);
          setResendCooldown(60);
          setMessage(`Mã OTP 6 số đã được gửi tới hộp thư ${data.maskedEmail || email}.`);
          if (data.isDemo && data.demoOtp) {
            setDemoOtpHint(data.demoOtp);
          }
        }
      } catch (err) {
        console.warn("2FA Send OTP error:", err);
      }
      return;
    }

    // Normal direct login without 2FA
    completeLogin(res.user);
  };

  const completeLogin = (userObj: any) => {
    setAuthCookie(userObj, rememberMe);
    const { role, status } = userObj;

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
    }, 800);
  };

  // ── 2FA OTP Input Handlers ──
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newInputs = [...otpInputs];
    newInputs[index] = value.slice(-1); // Only take last char
    setOtpInputs(newInputs);

    // Auto-advance to next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // If all 6 digits entered, auto-verify
    const fullOtp = newInputs.join("");
    if (fullOtp.length === 6 && !newInputs.includes("")) {
      verifyOTPChallenge(fullOtp);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpInputs[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newInputs = [...otpInputs];
    for (let i = 0; i < 6; i++) {
      newInputs[i] = pasted[i] || "";
    }
    setOtpInputs(newInputs);

    if (pasted.length === 6) {
      otpRefs.current[5]?.focus();
      verifyOTPChallenge(pasted);
    } else {
      otpRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  const verifyOTPChallenge = async (customOtp?: string) => {
    const fullOtp = customOtp || otpInputs.join("");
    if (fullOtp.length !== 6) {
      setMessage("Vui lòng nhập đầy đủ 6 chữ số mã OTP.");
      return;
    }

    setIsVerifyingOTP(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: pendingUser?.email || email,
          otp: fullOtp,
          purpose: "login",
        }),
      });

      const data = await res.json();
      if (data.success && data.verified) {
        setMessage("✅ Xác thực 2FA thành công! Đang vào trung tâm điều hành...");
        setTimeout(() => {
          completeLogin(pendingUser);
        }, 600);
      } else {
        setMessage(data.error || "Mã OTP không chính xác hoặc đã hết hạn.");
      }
    } catch (err: any) {
      setMessage("Lỗi kết nối máy chủ khi xác thực OTP. Vui lòng thử lại.");
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0 || isResendingOTP) return;

    setIsResendingOTP(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/2fa/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: pendingUser?.email || email,
          recipientName: pendingUser?.name,
          purpose: "login",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResendCooldown(60);
        setOtpInputs(["", "", "", "", "", ""]);
        setMessage("✅ Đã gửi lại mã OTP mới vào hộp thư email của bạn!");
        if (data.isDemo && data.demoOtp) {
          setDemoOtpHint(data.demoOtp);
        }
        otpRefs.current[0]?.focus();
      } else {
        setMessage(data.error || "Không thể gửi lại mã. Vui lòng thử lại sau.");
      }
    } catch (err) {
      setMessage("Lỗi kết nối máy chủ khi gửi lại mã OTP.");
    } finally {
      setIsResendingOTP(false);
    }
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
            {is2FAChallenge
              ? "Xác Thực 2 Bước (2FA)"
              : isForgotPassword
              ? "Khôi Phục Mật Khẩu"
              : "Chào mừng trở lại"}
          </h2>
          <p className="text-xs md:text-sm text-[#8e9bb4]">
            {is2FAChallenge
              ? `Nhập mã OTP 6 số được gửi tới email ${maskedEmail || email}`
              : isForgotPassword
              ? "Nhập email của bạn để nhận liên kết đặt lại mật khẩu."
              : "Đăng nhập để vào không gian học tập & giảng dạy."}
          </p>
        </div>

        {/* Card Form */}
        <div className="rounded-2xl bg-[#0f1524]/80 backdrop-blur-xl border border-[#7bd1fa]/20 p-6 md:p-8 shadow-2xl shadow-cyan-950/30">
          {/* ══════════════════════════════════════════════════════════════════════
              CASE 1: 2FA OTP CHALLENGE FORM
             ══════════════════════════════════════════════════════════════════════ */}
          {is2FAChallenge ? (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-center space-y-2">
                <ShieldCheck className="w-8 h-8 text-cyan-400 mx-auto" />
                <div className="text-xs font-mono text-cyan-300 font-bold">
                  BẢO VỆ TÀI KHOẢN 2 LỚP
                </div>
                <p className="text-[11px] text-slate-300">
                  Mã xác thực gồm 6 chữ số đã được gửi qua email. Vui lòng kiểm tra hộp thư (kể cả thư mục Spam/Rác).
                </p>

                {demoOtpHint && (
                  <div className="mt-2 p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-[11px] text-amber-300 font-mono flex items-center justify-between">
                    <span>Mã OTP: <strong className="text-amber-200">{demoOtpHint}</strong></span>
                    <button
                      type="button"
                      onClick={() => {
                        const digits = demoOtpHint.split("");
                        setOtpInputs(digits);
                        verifyOTPChallenge(demoOtpHint);
                      }}
                      className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-[10px] cursor-pointer"
                    >
                      Điền nhanh ⚡
                    </button>
                  </div>
                )}
              </div>

              {/* 6 Digit Input Boxes */}
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                {otpInputs.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    onPaste={idx === 0 ? handleOtpPaste : undefined}
                    className="w-11 h-13 sm:w-12 sm:h-14 text-center font-mono text-xl font-extrabold bg-[#151b2c] border-2 border-cyan-500/30 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.4)] rounded-xl text-white focus:outline-none transition-all"
                  />
                ))}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  disabled={isVerifyingOTP || otpInputs.join("").length !== 6}
                  onClick={() => verifyOTPChallenge()}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-cyan-300 text-white font-bold font-mono text-sm shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isVerifyingOTP ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Đang xác thực OTP...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Xác Nhận Đăng Nhập</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-xs font-mono pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIs2FAChallenge(false);
                      setPendingUser(null);
                      setMessage("");
                    }}
                    className="text-slate-400 hover:text-white hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Quay lại
                  </button>

                  <button
                    type="button"
                    disabled={resendCooldown > 0 || isResendingOTP}
                    onClick={handleResendOTP}
                    className={`flex items-center gap-1 ${
                      resendCooldown > 0
                        ? "text-slate-500 cursor-not-allowed"
                        : "text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer font-bold"
                    }`}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isResendingOTP ? "animate-spin" : ""}`} />
                    {resendCooldown > 0 ? `Gửi lại sau (${resendCooldown}s)` : "Gửi lại mã OTP"}
                  </button>
                </div>
              </div>
            </div>
          ) : !isForgotPassword ? (
            /* ══════════════════════════════════════════════════════════════════════
                CASE 2: STANDARD LOGIN FORM
               ══════════════════════════════════════════════════════════════════════ */
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" /> Email Đăng Nhập
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
            /* ══════════════════════════════════════════════════════════════════════
                CASE 3: FORGOT PASSWORD FORM
               ══════════════════════════════════════════════════════════════════════ */
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

          {!is2FAChallenge && (
            <div className="pt-5 mt-5 border-t border-slate-800 text-center">
              <Link
                href="/register"
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline inline-flex items-center gap-1"
              >
                Chưa có tài khoản? Đăng ký ngay →
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center font-mono text-[11px] text-slate-500 z-10 py-4">
        © 2026 E-V-E • NỀN TẢNG HỌC TẬP & CÔNG NGHỆ TƯƠNG TÁC
      </footer>
    </div>
  );
}
