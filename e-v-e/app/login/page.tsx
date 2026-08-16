"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { setAuthCookie } from "@/lib/cookies";
import {
  Rocket,
  LogIn,
  Mail,
  Lock,
  ShieldCheck,
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

    const { role, status } = res.user;

    if (status === "banned") {
      setMessage("Tài khoản của bạn đã bị khóa bởi Quản trị viên.");
      return;
    }

    // 2FA temporarily disabled globally
    completeLogin(res.user);
  };

  const completeLogin = (user: any) => {
    const { role, status } = user;

    if (status === "pending") {
      setAuthCookie(
        {
          uid: user.uid,
          email: user.email,
          name: user.name,
          role: role || "student",
          status: "pending",
        },
        rememberMe
      );
      router.push("/pending");
      return;
    }

    setAuthCookie(
      {
        uid: user.uid,
        email: user.email,
        name: user.name,
        role: role || "student",
        status: "active",
      },
      rememberMe
    );

    if (role === "admin") {
      router.push("/admin/dashboard");
    } else if (role === "teacher") {
      router.push("/teacher/dashboard");
    } else {
      router.push("/student/dashboard");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const cleanVal = value.replace(/\D/g, "").slice(-1);
    const newInputs = [...otpInputs];
    newInputs[index] = cleanVal;
    setOtpInputs(newInputs);

    if (cleanVal && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    if (newInputs.every((d) => d !== "")) {
      verifyOTPChallenge(newInputs.join(""));
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

    const newInputs = pasted.split("").concat(Array(6 - pasted.length).fill("")).slice(0, 6);
    setOtpInputs(newInputs);

    if (pasted.length === 6) {
      verifyOTPChallenge(pasted);
    }
  };

  const verifyOTPChallenge = async (overrideOtp?: string) => {
    const fullOtp = overrideOtp || otpInputs.join("");
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
        setMessage("Xác thực 2FA thành công! Đang chuyển hướng...");
        setTimeout(() => {
          completeLogin(pendingUser);
        }, 600);
      } else {
        setMessage(data.error || "Mã OTP không chính xác.");
      }
    } catch {
      setMessage("Lỗi kết nối khi xác thực OTP.");
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
        setMessage("Đã gửi lại mã OTP mới vào email của bạn!");
        if (data.isDemo && data.demoOtp) {
          setDemoOtpHint(data.demoOtp);
        }
      }
    } catch {
      setMessage("Lỗi kết nối khi gửi lại mã OTP.");
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
    setMessage(`Liên kết đặt lại mật khẩu đã được gửi đến email ${email}.`);
  };

  return (
    <div className="bg-zinc-50 text-zinc-900 min-h-screen flex flex-col items-center justify-center p-4 md:p-8 font-sans relative">
      {/* Back to Home floating action */}
      <div className="w-full max-w-md mb-2 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-zinc-200 text-xs font-bold text-zinc-600 hover:text-red-600 hover:border-red-300 transition-all shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại trang chủ</span>
        </Link>
      </div>

      <main className="w-full max-w-md my-auto">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-sm">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-2xl tracking-tight text-red-600">
              E-V-E
            </span>
          </Link>

          <h2 className="text-2xl font-black text-zinc-900 mb-1">
            {is2FAChallenge
              ? "Xác Thực 2 Bước (2FA)"
              : isForgotPassword
              ? "Khôi Phục Mật Khẩu"
              : "Đăng Nhập Tài Khoản"}
          </h2>
          <p className="text-xs text-zinc-500">
            {is2FAChallenge
              ? `Nhập mã OTP 6 số gửi tới ${maskedEmail || email}`
              : isForgotPassword
              ? "Nhập email của bạn để nhận liên kết đặt lại mật khẩu."
              : "Hệ sinh thái giáo dục trực tuyến E-V-E"}
          </p>
        </div>

        {/* Card Form */}
        <div className="rounded-2xl bg-white border-2 border-zinc-200 p-6 md:p-8 shadow-sm">
          {is2FAChallenge ? (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-center space-y-1">
                <ShieldCheck className="w-8 h-8 text-red-600 mx-auto" />
                <div className="text-xs font-bold text-red-700">
                  XÁC THỰC BẢO MẬT 2FA
                </div>
                <p className="text-[11px] text-zinc-600">
                  Mã gồm 6 chữ số đã được gửi qua email.
                </p>

                {demoOtpHint && (
                  <div className="mt-2 p-2 bg-white border border-red-200 rounded-lg text-[11px] text-red-700 flex items-center justify-between">
                    <span>Mã OTP: <strong>{demoOtpHint}</strong></span>
                    <button
                      type="button"
                      onClick={() => {
                        const digits = demoOtpHint.split("");
                        setOtpInputs(digits);
                        verifyOTPChallenge(demoOtpHint);
                      }}
                      className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-bold"
                    >
                      Điền nhanh 
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-2">
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
                    className="w-11 h-13 text-center font-mono text-xl font-bold bg-zinc-50 border-2 border-zinc-300 focus:border-red-600 rounded-xl text-zinc-900 focus:outline-none"
                  />
                ))}
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  disabled={isVerifyingOTP || otpInputs.join("").length !== 6}
                  onClick={() => verifyOTPChallenge()}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isVerifyingOTP ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Xác Nhận Đăng Nhập
                </button>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIs2FAChallenge(false);
                      setPendingUser(null);
                      setMessage("");
                    }}
                    className="text-zinc-500 hover:text-zinc-900 flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Quay lại
                  </button>

                  <button
                    type="button"
                    disabled={resendCooldown > 0 || isResendingOTP}
                    onClick={handleResendOTP}
                    className="text-red-600 hover:underline font-bold cursor-pointer"
                  >
                    {resendCooldown > 0 ? `Gửi lại sau (${resendCooldown}s)` : "Gửi lại mã"}
                  </button>
                </div>
              </div>
            </div>
          ) : !isForgotPassword ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-red-600" /> Email Đăng Nhập
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@school.edu.vn"
                  className="w-full bg-zinc-50 border border-zinc-300 focus:border-red-600 rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-zinc-700 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-red-600" /> Mật Khẩu
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true);
                      setMessage("");
                    }}
                    className="text-xs text-red-600 hover:underline font-bold"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-zinc-50 border border-zinc-300 focus:border-red-600 rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-300 text-red-600 focus:ring-red-500 accent-red-600 cursor-pointer"
                  />
                  <span className="text-xs text-zinc-600">Ghi nhớ đăng nhập</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                {loading ? "Đang xác thực..." : "Đăng Nhập"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-red-600" /> Email Cần Khôi Phục
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@school.edu.vn"
                  className="w-full bg-zinc-50 border border-zinc-300 focus:border-red-600 rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={resetSent}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors disabled:opacity-50 cursor-pointer"
              >
                {resetSent ? "Đã Gửi Liên Kết" : "Gửi Yêu Cầu Đặt Lại"}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setMessage("");
                  }}
                  className="text-xs text-zinc-500 hover:text-zinc-900 cursor-pointer"
                >
                  ← Quay lại Đăng nhập
                </button>
              </div>
            </form>
          )}

          {message && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-center text-xs text-red-700 font-bold">
              {message}
            </div>
          )}

          {!is2FAChallenge && (
            <div className="pt-4 mt-4 border-t border-zinc-200 text-center">
              <Link
                href="/register"
                className="text-xs font-bold text-red-600 hover:underline inline-flex items-center gap-1"
              >
                Chưa có tài khoản? Đăng ký ngay →
              </Link>
            </div>
          )}
        </div>
      </main>

      <footer className="text-center text-xs text-zinc-400 py-4">
        © 2026 E-V-E • HỆ SINH THÁI GIÁO DỤC TƯƠNG TÁC
      </footer>
    </div>
  );
}
