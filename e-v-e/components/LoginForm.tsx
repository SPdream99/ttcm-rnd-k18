"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { setAuthCookie } from "@/lib/cookies";
import { ShieldCheck, CheckCircle2, ArrowLeft, RefreshCw } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  // ── 2FA States ──
  const [is2FAChallenge, setIs2FAChallenge] = useState(false);
  const [pendingUser, setPendingUser] = useState<any | null>(null);
  const [otpInputs, setOtpInputs] = useState(["", "", "", "", "", ""]);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [demoOtpHint, setDemoOtpHint] = useState<string | null>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { login, loading } = useAuthAdapter();

  const handleLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setMessage("");

    const res = await login({ email, pass: password, rememberMe: true });

    if (!res.success || !res.user) {
      setMessage(res.error || "Email hoặc mật khẩu không đúng.");
      return;
    }

    // 2FA temporarily disabled globally
    finishLogin(res.user);
  };

  const finishLogin = (userObj: any) => {
    setAuthCookie(userObj, true);
    setMessage("Đăng nhập thành công!");
    const role = userObj.role;

    setTimeout(() => {
      if (role === "student") {
        window.location.href = "/student/dashboard";
      } else if (role === "teacher") {
        window.location.href = userObj?.status === "pending" ? "/pending" : "/teacher/dashboard";
      } else if (role === "school" || role === "admin") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/student/dashboard";
      }
    }, 800);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newInputs = [...otpInputs];
    newInputs[index] = value.slice(-1);
    setOtpInputs(newInputs);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    const full = newInputs.join("");
    if (full.length === 6 && !newInputs.includes("")) {
      verifyOTP(full);
    }
  };

  const verifyOTP = async (customOtp?: string) => {
    const code = customOtp || otpInputs.join("");
    if (code.length !== 6) return;

    setIsVerifyingOTP(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: pendingUser?.email || email,
          otp: code,
          purpose: "login",
        }),
      });

      const data = await res.json();
      if (data.success && data.verified) {
        setMessage(" Xác thực 2FA thành công!");
        setTimeout(() => finishLogin(pendingUser), 600);
      } else {
        setMessage(data.error || "Mã OTP không chính xác hoặc đã hết hạn.");
      }
    } catch {
      setMessage("Lỗi kết nối máy chủ.");
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  return (
    <div className="glass-card rounded-xl p-gutter lg:p-margin-desktop">
      {is2FAChallenge ? (
        <div className="flex flex-col gap-4 text-center">
          <ShieldCheck className="w-10 h-10 text-cyan-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Xác Thực 2 Bước (2FA)</h3>
          <p className="text-xs text-slate-300">
            Nhập mã OTP 6 số đã gửi tới email <strong>{pendingUser?.email || email}</strong>
          </p>

          {demoOtpHint && (
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-300 font-mono flex items-center justify-between">
              <span>Mã OTP: <strong>{demoOtpHint}</strong></span>
              <button
                type="button"
                onClick={() => {
                  setOtpInputs(demoOtpHint.split(""));
                  verifyOTP(demoOtpHint);
                }}
                className="px-2 py-0.5 rounded bg-amber-500/20 text-[10px]"
              >
                Điền nhanh 
              </button>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 my-2">
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
                className="w-10 h-12 text-center font-mono text-lg font-bold bg-[#151b2c] border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-400"
              />
            ))}
          </div>

          <button
            type="button"
            disabled={isVerifyingOTP || otpInputs.join("").length !== 6}
            onClick={() => verifyOTP()}
            className="w-full bg-[#005ac2] hover:bg-[#4d8eff] text-white font-label-md py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isVerifyingOTP ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Xác Nhận OTP
          </button>

          <button
            type="button"
            onClick={() => {
              setIs2FAChallenge(false);
              setPendingUser(null);
              setMessage("");
            }}
            className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
          >
            ← Quay lại đăng nhập
          </button>

          {message && (
            <p className="text-center text-xs font-medium text-cyan-300 mt-1">
              {message}
            </p>
          )}
        </div>
      ) : (
        <form className="flex flex-col gap-stack-md" onSubmit={handleLogin}>
          {/* Email */}
          <div>
            <label
              className="block font-label-md text-label-md text-on-surface-variant mb-stack-sm"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </span>
              <input
                className="glass-input w-full rounded-lg py-3 pl-10 pr-4 font-body-md text-body-md text-on-surface placeholder:text-outline-variant focus:ring-0"
                id="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="navigator@eve.edu"
                required
                type="email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-stack-sm">
              <label
                className="block font-label-md text-label-md text-on-surface-variant"
                htmlFor="password"
              >
                Mật khẩu
              </label>
              <Link
                href="/forgot-password"
                className="font-label-sm text-label-sm text-primary hover:text-secondary transition-colors duration-200"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </span>

              <input
                className="glass-input w-full rounded-lg py-3 pl-10 pr-10 font-body-md text-body-md text-on-surface placeholder:text-outline-variant focus:ring-0"
                id="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                type={showPassword ? "text" : "password"}
              />

              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                <span className="material-symbols-outlined">
                  {showPassword ? "visibility" : "visibility_off"}
                </span>
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            className="w-full bg-[#005ac2] hover:bg-[#4d8eff] text-white font-label-md text-label-md py-3 rounded-lg mt-stack-sm transition-all duration-300 btn-glow border border-transparent hover:border-[#7dd3fc]"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {message && (
            <p className="text-center text-sm font-medium text-cyan-300 mt-2">
              {message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}