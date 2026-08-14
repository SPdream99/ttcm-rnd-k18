"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { setAuthCookie } from "@/lib/cookies";
import {
  BookOpen,
  GraduationCap,
  UserCheck,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  UserPlus,
  Mail,
  Lock,
  User,
  School,
  KeyRound,
  RefreshCw,
  ArrowLeft,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  // Registration Form State
  const [step, setStep] = useState<"form" | "otp">("form");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [schoolCode, setSchoolCode] = useState("");
  const [message, setMessage] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);

  // 2FA OTP State
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [resendCountdown, setResendCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState("");
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { register, loading } = useAuthAdapter();

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "otp" && resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendCountdown]);

  // Step 1: Submit Form & Send Email OTP
  const handleProceedToOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!fullName || !email || !password || !confirmPassword) {
      setMessage("Vui lòng điền đầy đủ các trường thông tin.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Mật khẩu xác nhận không trùng khớp.");
      return;
    }

    if (password.length < 8) {
      setMessage("Mật khẩu phải chứa ít nhất 8 ký tự.");
      return;
    }

    setSendingOtp(true);

    try {
      const res = await fetch("/api/auth/2fa/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          recipientName: fullName,
          purpose: "register",
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setMessage(data.error || "Không thể gửi mã xác nhận qua email. Vui lòng thử lại.");
        setSendingOtp(false);
        return;
      }

      setMaskedEmail(data.maskedEmail || email);
      if (data.demoOtp) {
        setDemoOtp(data.demoOtp);
      }
      setResendCountdown(60);
      setCanResend(false);
      setOtpDigits(["", "", "", "", "", ""]);
      setStep("otp");
    } catch (err: any) {
      setMessage("Lỗi kết nối khi gửi mã xác nhận 2FA. Vui lòng thử lại.");
    } finally {
      setSendingOtp(false);
    }
  };

  // OTP Box handling
  const handleDigitChange = (index: number, value: string) => {
    const cleanVal = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);

    // Auto focus next input
    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || "";
    }
    setOtpDigits(newDigits);

    const nextEmpty = newDigits.findIndex((d) => !d);
    if (nextEmpty !== -1) {
      inputRefs.current[nextEmpty]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const handleResendOTP = async () => {
    if (!canResend || sendingOtp) return;
    setSendingOtp(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/2fa/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          recipientName: fullName,
          purpose: "register",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResendCountdown(60);
        setCanResend(false);
        if (data.demoOtp) {
          setDemoOtp(data.demoOtp);
        }
        setMessage("✅ Đã gửi lại mã xác thực mới vào email của bạn.");
        setTimeout(() => setMessage(""), 4000);
      } else {
        setMessage(data.error || "Gửi lại mã thất bại.");
      }
    } catch {
      setMessage("Không thể kết nối đến máy chủ gửi email.");
    } finally {
      setSendingOtp(false);
    }
  };

  // Step 2: Verify OTP & Create User Account
  const handleVerifyOtpAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpDigits.join("");
    if (fullOtp.length !== 6) {
      setMessage("Vui lòng nhập đủ 6 chữ số mã xác thực.");
      return;
    }

    setVerifyingOtp(true);
    setMessage("");

    try {
      // 1. Verify OTP
      const verifyRes = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: fullOtp,
          code: fullOtp,
          purpose: "register",
        }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyData.success) {
        setMessage(verifyData.error || "Mã xác thực không chính xác hoặc đã hết hạn.");
        setVerifyingOtp(false);
        return;
      }

      // 2. Perform Account Registration
      const res = await register({
        fullName,
        email: email.trim().toLowerCase(),
        pass: password,
        confirmPass: confirmPassword,
        role,
        schoolCode: role === "teacher" ? schoolCode : undefined,
      });

      if (!res.success || !res.user) {
        setMessage(res.error || "Đăng ký không thành công. Vui lòng thử lại.");
        setVerifyingOtp(false);
        return;
      }

      // Save auth cookie
      setAuthCookie(res.user, true);

      if (typeof window !== "undefined") {
        try {
          const userObj = {
            id: res.user.id || res.user.uid,
            uid: res.user.uid || res.user.id,
            name: fullName,
            fullName,
            email: email.trim().toLowerCase(),
            role,
            status: role === "teacher" ? "pending" : "active",
            twoFactorEnabled: true,
            schoolCode: role === "teacher" ? schoolCode : undefined,
            departmentOrClass: role === "teacher" ? (schoolCode ? `Mã trường: ${schoolCode}` : "Giáo viên mới") : undefined,
            createdAt: new Date().toLocaleDateString("vi-VN"),
          };
          const localList = JSON.parse(localStorage.getItem("eve_registered_users") || "[]");
          const exists = localList.findIndex((u: any) => u.email === userObj.email || u.uid === userObj.uid);
          if (exists >= 0) {
            localList[exists] = userObj;
          } else {
            localList.unshift(userObj);
          }
          localStorage.setItem("eve_registered_users", JSON.stringify(localList));
        } catch {}
      }

      if (role === "teacher") {
        setMessage("🎉 Đăng ký tài khoản Giáo viên thành công! Đang chuyển hướng sang trang chờ Ban Quản trị phê duyệt...");
        setTimeout(() => {
          window.location.href = "/pending";
        }, 1200);
      } else {
        setMessage("🎉 Xác thực email thành công! Đang chuyển hướng vào Bảng điều khiển Học viên...");
        setTimeout(() => {
          window.location.href = "/student/dashboard";
        }, 1200);
      }
    } catch (err: any) {
      setMessage("Đã xảy ra lỗi khi hoàn tất đăng ký. Vui lòng thử lại.");
    } finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <div className="bg-[#0a0e1a] text-[#e1e2ec] min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative font-sans">
      {/* Background Starfield Effect */}
      <div
        className="absolute inset-0 z-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#7bd1fa 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* Main Register Container */}
      <main className="w-full max-w-lg relative z-10 my-auto">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 p-[1px] shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0a0e1a] rounded-[11px] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-cyan-300" />
              </div>
            </div>
            <span className="font-extrabold text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              E-V-E
            </span>
          </Link>

          <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
            {step === "form" ? "Đăng Ký Tài Khoản" : "Xác Thực Email (2FA OTP)"}
          </h2>
          <p className="text-xs md:text-sm text-[#8e9bb4]">
            {step === "form"
              ? "Chọn vai trò và tham gia nền tảng học tập & lập trình tương tác E-V-E."
              : "Hệ thống đã gửi mã OTP 6 số để xác thực quyền sở hữu hòm thư email của bạn."}
          </p>
        </div>

        {/* ── STEP 1: REGISTRATION FORM ── */}
        {step === "form" ? (
          <div className="rounded-2xl bg-[#0f1524]/85 backdrop-blur-xl border border-[#7bd1fa]/20 p-6 md:p-8 shadow-2xl animate-fade-in">
            {/* Role Selection Toggle */}
            <div className="mb-6">
              <label className="block text-xs font-mono text-slate-300 mb-2">
                Vai Trò Tham Gia:
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Option Student */}
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer text-left ${
                    role === "student"
                      ? "bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                      : "bg-[#151b2c] border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${role === "student" ? "bg-cyan-500 text-black" : "bg-slate-800 text-slate-400"}`}>
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold font-mono text-white">Tôi là Học viên</div>
                    <div className="text-[10px] text-cyan-300/80">Tham gia học & làm quiz</div>
                  </div>
                </button>

                {/* Option Teacher */}
                <button
                  type="button"
                  onClick={() => setRole("teacher")}
                  className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer text-left ${
                    role === "teacher"
                      ? "bg-emerald-500/20 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                      : "bg-[#151b2c] border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${role === "teacher" ? "bg-emerald-500 text-black" : "bg-slate-800 text-slate-400"}`}>
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold font-mono text-white">Tôi là Giáo viên</div>
                    <div className="text-[10px] text-emerald-300/80">Soạn bài & quản lý game</div>
                  </div>
                </button>
              </div>

              {/* Notice for Teachers */}
              {role === "teacher" && (
                <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 animate-fade-in">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-200">
                    <span className="font-bold">Lưu ý:</span> Tài khoản Giáo viên sẽ được kích hoạt sau khi <span className="underline">Ban Quản trị phê duyệt</span> thông tin.
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleProceedToOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-400" /> Họ và Tên
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full bg-[#151b2c] border border-cyan-500/20 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all placeholder-slate-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" /> Email Đăng Ký (Nhận mã 2FA)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@school.edu.vn"
                  className="w-full bg-[#151b2c] border border-cyan-500/20 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all placeholder-slate-500 font-mono"
                  required
                />
              </div>

              {role === "teacher" && (
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 flex items-center gap-1.5">
                    <School className="w-3.5 h-3.5 text-emerald-400" /> Trường Học / Bộ Môn (Không bắt buộc)
                  </label>
                  <input
                    type="text"
                    value={schoolCode}
                    onChange={(e) => setSchoolCode(e.target.value)}
                    placeholder="VD: THPT Chuyên K18 / Tổ Tin Học"
                    className="w-full bg-[#151b2c] border border-cyan-500/20 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all placeholder-slate-500 font-mono"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" /> Mật Khẩu
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ít nhất 8 ký tự"
                    className="w-full bg-[#151b2c] border border-cyan-500/20 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all placeholder-slate-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" /> Xác Nhận Mật Khẩu
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu"
                    className="w-full bg-[#151b2c] border border-cyan-500/20 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all placeholder-slate-500 font-mono"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={sendingOtp}
                className="w-full mt-3 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-cyan-300 text-white font-bold font-mono text-sm shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {sendingOtp ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Đang gửi mã xác thực 2FA...
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    Tiếp Tục & Nhận Mã Xác Thực Email (2FA)
                  </>
                )}
              </button>
            </form>

            {message && (
              <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-center text-xs font-mono text-rose-300">
                {message}
              </div>
            )}

            <div className="pt-4 mt-4 border-t border-slate-800 text-center">
              <Link
                href="/login"
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline"
              >
                Đã có tài khoản? Đăng nhập ngay →
              </Link>
            </div>
          </div>
        ) : (
          /* ── STEP 2: 2FA OTP INPUT ── */
          <div className="rounded-2xl bg-[#0f1524]/85 backdrop-blur-xl border border-cyan-500/30 p-6 md:p-8 shadow-[0_0_30px_rgba(6,182,212,0.2)] animate-fade-in space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setStep("form");
                  setMessage("");
                }}
                className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Quay lại sửa thông tin
              </button>
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[11px] font-mono font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Bước 2 / 2
              </span>
            </div>

            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 mb-2">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Nhập Mã OTP 6 Số</h3>
              <p className="text-xs text-slate-400">
                Mã xác thực 6 chữ số đã được gửi đến hòm thư:
              </p>
              <div className="font-mono text-xs font-bold text-cyan-300 bg-cyan-500/10 py-1 px-3 rounded-lg inline-block">
                {maskedEmail || email}
              </div>
            </div>

            <form onSubmit={handleVerifyOtpAndRegister} className="space-y-5">
              {/* 6-box OTP Input */}
              <div className="flex justify-center items-center gap-2 sm:gap-3" onPaste={handlePaste}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      inputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold font-mono rounded-xl bg-[#151b2c] border border-cyan-500/30 text-cyan-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 focus:outline-none transition-all"
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              {/* Demo Fast Fill Helper */}
              {demoOtp && (
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-center space-y-1.5 animate-fade-in">
                  <div className="text-[11px] text-purple-300 font-mono flex items-center justify-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Môi trường thử nghiệm E-V-E (Mã OTP tự động):</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const digits = demoOtp.split("").slice(0, 6);
                      setOtpDigits(digits);
                    }}
                    className="px-3 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 font-mono text-xs font-bold cursor-pointer transition-all inline-flex items-center gap-1.5"
                  >
                    <span>⚡ Điền nhanh mã [{demoOtp}]</span>
                  </button>
                </div>
              )}

              {/* Resend & Timer */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
                <span>Hết hạn sau 5 phút</span>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={sendingOtp}
                    className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Gửi lại mã
                  </button>
                ) : (
                  <span className="text-slate-500">
                    Gửi lại mã sau ({resendCountdown}s)
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={verifyingOtp || loading || otpDigits.join("").length !== 6}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 hover:from-emerald-500 hover:to-cyan-400 text-white font-bold font-mono text-sm shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {verifyingOtp || loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Đang kích hoạt tài khoản...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Xác Thực & Hoàn Tất Đăng Ký
                  </>
                )}
              </button>
            </form>

            {message && (
              <div
                className={`p-3 rounded-xl border text-center text-xs font-mono ${
                  message.includes("🎉") || message.includes("✅")
                    ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
                    : "bg-rose-950/40 border-rose-500/30 text-rose-300"
                }`}
              >
                {message}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center font-mono text-[11px] text-slate-500 z-10 py-4">
        © 2026 E-V-E • NỀN TẢNG HỌC TẬP & CÔNG NGHỆ TƯƠNG TÁC
      </footer>
    </div>
  );
}
