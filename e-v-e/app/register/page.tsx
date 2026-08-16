"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { setAuthCookie } from "@/lib/cookies";
import {
  BookOpen,
  GraduationCap,
  CheckCircle2,
  ShieldAlert,
  Mail,
  Lock,
  User,
  School,
  KeyRound,
  RefreshCw,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState<"form" | "otp">("form");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [schoolCode, setSchoolCode] = useState("");
  const [message, setMessage] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);

  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [resendCountdown, setResendCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState("");
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { register, loading } = useAuthAdapter();

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

      if (data.success) {
        setMaskedEmail(data.maskedEmail || email);
        if (data.isDemo && data.demoOtp) {
          setDemoOtp(data.demoOtp);
        }
        setStep("otp");
        setResendCountdown(60);
        setCanResend(false);
      } else {
        setMessage(data.error || "Không thể gửi mã xác thực. Vui lòng thử lại.");
      }
    } catch {
      setMessage("Lỗi kết nối khi gửi mã OTP.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleDigitChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, "").slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = clean;
    setOtpDigits(newDigits);

    if (clean && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newDigits = pasted.split("").concat(Array(6 - pasted.length).fill("")).slice(0, 6);
    setOtpDigits(newDigits);
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
        setOtpDigits(["", "", "", "", "", ""]);
        setMessage("Đã gửi lại mã OTP mới vào hòm thư!");
        if (data.isDemo && data.demoOtp) {
          setDemoOtp(data.demoOtp);
        }
      } else {
        setMessage(data.error || "Không thể gửi lại mã.");
      }
    } catch {
      setMessage("Lỗi kết nối khi gửi lại mã OTP.");
    } finally {
      setSendingOtp(false);
    }
  };

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

      setAuthCookie(res.user, true);

      if (role === "teacher") {
        setMessage("Đăng ký tài khoản Giáo viên thành công! Đang chuyển hướng sang trang chờ phê duyệt...");
        setTimeout(() => {
          window.location.href = "/pending";
        }, 1200);
      } else {
        setMessage("Xác thực email thành công! Đang chuyển hướng vào Bảng điều khiển Học viên...");
        setTimeout(() => {
          window.location.href = "/student/dashboard";
        }, 1200);
      }
    } catch {
      setMessage("Đã xảy ra lỗi khi hoàn tất đăng ký. Vui lòng thử lại.");
    } finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <div className="bg-zinc-50 text-zinc-900 min-h-screen flex flex-col items-center justify-center p-4 md:p-8 font-sans relative">
      {/* Back to Home floating action */}
      <div className="w-full max-w-lg mb-2 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-zinc-200 text-xs font-bold text-zinc-600 hover:text-red-600 hover:border-red-300 transition-all shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại trang chủ</span>
        </Link>
      </div>

      <main className="w-full max-w-lg my-auto">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-sm">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-2xl tracking-tight text-red-600">
              E-V-E
            </span>
          </Link>

          <h2 className="text-2xl font-black text-zinc-900 mb-1">
            {step === "form" ? "Đăng Ký Tài Khoản" : "Xác Thực Email (2FA OTP)"}
          </h2>
          <p className="text-xs text-zinc-500">
            {step === "form"
              ? "Chọn vai trò và tham gia nền tảng học tập trực tuyến E-V-E."
              : "Nhập mã OTP 6 số để xác thực tài khoản email của bạn."}
          </p>
        </div>

        {/* STEP 1: REGISTRATION FORM */}
        {step === "form" ? (
          <div className="rounded-2xl bg-white border-2 border-zinc-200 p-6 md:p-8 shadow-sm space-y-5">
            {/* Role Selection Toggle */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-2">
                Vai Trò Tham Gia:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`p-3.5 rounded-xl border flex items-center gap-3 transition-colors cursor-pointer text-left ${
                    role === "student"
                      ? "bg-red-50 border-red-600 text-zinc-900 font-bold"
                      : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-300"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${role === "student" ? "bg-red-600 text-white" : "bg-zinc-200 text-zinc-600"}`}>
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-900">Tôi là Học viên</div>
                    <div className="text-[10px] text-zinc-500">Tham gia học & làm bài</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("teacher")}
                  className={`p-3.5 rounded-xl border flex items-center gap-3 transition-colors cursor-pointer text-left ${
                    role === "teacher"
                      ? "bg-red-50 border-red-600 text-zinc-900 font-bold"
                      : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-300"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${role === "teacher" ? "bg-red-600 text-white" : "bg-zinc-200 text-zinc-600"}`}>
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-900">Tôi là Giáo viên</div>
                    <div className="text-[10px] text-zinc-500">Soạn bài & quản lý lớp</div>
                  </div>
                </button>
              </div>

              {role === "teacher" && (
                <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-red-700">
                    <span className="font-bold">Lưu ý:</span> Tài khoản Giáo viên sẽ được kích hoạt sau khi <span className="underline">Ban Quản trị phê duyệt</span>.
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleProceedToOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-red-600" /> Họ và Tên
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full bg-zinc-50 border border-zinc-300 focus:border-red-600 rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-red-600" /> Email Đăng Ký (Nhận mã OTP)
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

              {role === "teacher" && (
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1.5">
                    <School className="w-3.5 h-3.5 text-red-600" /> Trường Học / Bộ Môn (Không bắt buộc)
                  </label>
                  <input
                    type="text"
                    value={schoolCode}
                    onChange={(e) => setSchoolCode(e.target.value)}
                    placeholder="VD: THPT Chuyên / Tổ Tin Học"
                    className="w-full bg-zinc-50 border border-zinc-300 focus:border-red-600 rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-red-600" /> Mật Khẩu
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ít nhất 8 ký tự"
                    className="w-full bg-zinc-50 border border-zinc-300 focus:border-red-600 rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-red-600" /> Xác Nhận Mật Khẩu
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu"
                    className="w-full bg-zinc-50 border border-zinc-300 focus:border-red-600 rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={sendingOtp}
                className="w-full mt-2 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                {sendingOtp ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Đang gửi mã xác thực 2FA...
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    Tiếp Tục & Nhận Mã OTP Email (2FA)
                  </>
                )}
              </button>
            </form>

            {message && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-center text-xs text-red-700 font-bold">
                {message}
              </div>
            )}

            <div className="pt-4 border-t border-zinc-200 text-center">
              <Link
                href="/login"
                className="text-xs text-red-600 hover:underline font-bold"
              >
                Đã có tài khoản? Đăng nhập ngay →
              </Link>
            </div>
          </div>
        ) : (
          /* STEP 2: OTP VERIFICATION */
          <div className="rounded-2xl bg-white border-2 border-red-600 p-6 md:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <button
                type="button"
                onClick={() => {
                  setStep("form");
                  setMessage("");
                }}
                className="text-xs text-zinc-500 hover:text-zinc-900 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Quay lại
              </button>
              <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                Bước 2 / 2
              </span>
            </div>

            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-2 font-bold">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-zinc-900">Nhập Mã OTP 6 Số</h3>
              <p className="text-xs text-zinc-500">
                Mã xác thực đã gửi đến hòm thư:
              </p>
              <div className="text-xs font-bold text-red-600 bg-red-50 py-1 px-3 rounded-lg inline-block">
                {maskedEmail || email}
              </div>
            </div>

            <form onSubmit={handleVerifyOtpAndRegister} className="space-y-4">
              <div className="flex justify-center items-center gap-2" onPaste={handlePaste}>
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
                    className="w-11 h-13 text-center text-xl font-bold rounded-xl bg-zinc-50 border-2 border-zinc-300 focus:border-red-600 text-zinc-900 focus:outline-none"
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              {demoOtp && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-center space-y-1">
                  <span className="text-[11px] text-red-700 block">Mã OTP tự động:</span>
                  <button
                    type="button"
                    onClick={() => {
                      const digits = demoOtp.split("").slice(0, 6);
                      setOtpDigits(digits);
                    }}
                    className="px-3 py-1 rounded bg-red-600 text-white text-xs font-bold cursor-pointer"
                  >
                    Điền nhanh mã [{demoOtp}]
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
                <span>Hết hạn sau 5 phút</span>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={sendingOtp}
                    className="text-red-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Gửi lại mã
                  </button>
                ) : (
                  <span>Gửi lại sau ({resendCountdown}s)</span>
                )}
              </div>

              <button
                type="submit"
                disabled={verifyingOtp || loading || otpDigits.join("").length !== 6}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
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
              <div className="p-3 rounded-xl border text-center text-xs font-bold bg-red-50 border-red-200 text-red-700">
                {message}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="text-center text-xs text-zinc-400 py-4">
        © 2026 E-V-E • HỆ SINH THÁI GIÁO DỤC TƯƠNG TÁC
      </footer>
    </div>
  );
}
