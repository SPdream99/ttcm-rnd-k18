"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";

export default function RegisterPage() {
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState<1 | 2>(1); // Step 1: Info, Step 2: 2FA Verification
  const [message, setMessage] = useState("");
  const [mockSentCode] = useState("123456"); // Mock 2FA code

  const { register, loading } = useAuthAdapter();

  const handleNextStep = (e: React.FormEvent) => {
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

    // Move to 2FA step
    setStep(2);
    setMessage(`Mã xác thực 2 bước đã được gửi đến ${email} (Mã mô phỏng: ${mockSentCode})`);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (verificationCode !== mockSentCode) {
      setMessage("Mã xác thực không đúng. Vui lòng thử lại.");
      return;
    }

    const res = await register({
      fullName,
      email,
      pass: password,
      confirmPass: confirmPassword,
      role,
    });

    if (!res.success || !res.user) {
      setMessage(res.error || "Đăng ký thất bại.");
      return;
    }

    if (role === "teacher") {
      setMessage("Đăng ký thành công! Đang chuyển hướng sang trang chờ duyệt...");
      setTimeout(() => {
        window.location.href = "/public/pending";
      }, 1500);
    } else {
      setMessage("Đăng ký thành công! Đang vào lớp học...");
      setTimeout(() => {
        window.location.href = "/dashbroad/student";
      }, 1500);
    }
  };

  return (
    <main className="bg-background text-on-background min-h-screen relative overflow-hidden font-body-md flex items-center justify-center p-4">
      {/* Background */}
      <div className="fixed inset-0 -z-20">
        <div
          className="absolute inset-0 z-0 opacity-30"
          style={{
            backgroundImage: "radial-gradient(white 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Main Container */}
      <main className="w-full max-w-6xl relative z-10 flex flex-col md:flex-row glass-panel rounded-2xl overflow-hidden shadow-2xl border border-border-ice">
        {/* Left Side */}
        <section className="w-full md:w-5/12 p-8 md:p-12 border-b md:border-b-0 md:border-r border-border-ice flex flex-col justify-between relative overflow-hidden bg-linear-to-b from-surface-glass to-transparent">
          <div
            className="absolute inset-0 z-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 50%, rgba(125, 211, 252, 0.4) 0%, transparent 60%)",
            }}
          />

          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-12">
              <span
                className="material-symbols-outlined text-primary text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                language
              </span>
              <h1 className="font-headline-md text-headline-md text-primary tracking-widest uppercase">
                E-V-E
              </h1>
            </div>

            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">
              Khởi Hành Vào
              <br />
              <span className="text-secondary">Vũ Trụ Tri Thức</span>
            </h2>

            <p className="font-body-md text-body-md text-on-surface-variant mb-8">
              Tham gia học viện không gian E-V-E. Nơi tri thức vượt qua mọi giới hạn và sự tò mò định hình tương lai.
            </p>
          </div>

          {/* Statistics */}
          <div className="relative z-10">
            <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center border border-border-ice">
                <span className="material-symbols-outlined text-primary">
                  rocket_launch
                </span>
              </div>
              <div>
                <div className="font-label-md text-label-md text-on-surface">
                  Hệ thống bảo mật 2FA
                </div>
                <div className="font-label-sm text-label-sm text-secondary">
                  Bảo vệ tài khoản an toàn
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side */}
        <section className="w-full md:w-7/12 p-8 md:p-12 bg-surface-container-lowest/80 backdrop-blur-xl">
          <div className="max-w-md mx-auto">
            {step === 1 ? (
              <>
                {/* Header */}
                <div className="mb-8">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
                    Tạo Hồ Sơ Mới
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Vui lòng cung cấp thông tin để thiết lập danh tính không gian của bạn.
                  </p>
                </div>

                <form onSubmit={handleNextStep} className="space-y-6">
                  {/* Role */}
                  <div className="space-y-3">
                    <label className="block font-label-md text-label-md text-on-surface">
                      Bạn đăng ký vai trò gì?
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Student */}
                      <button
                        type="button"
                        onClick={() => setRole("student")}
                        className={`role-card glass-panel rounded-xl p-4 text-center border border-border-ice flex flex-col items-center gap-2 group cursor-pointer transition-all ${
                          role === "student" ? "bg-sky-500/25 border-sky-400" : ""
                        }`}
                      >
                        <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">
                          school
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface block mt-1">
                          Học sinh
                        </span>
                      </button>

                      {/* Teacher */}
                      <button
                        type="button"
                        onClick={() => setRole("teacher")}
                        className={`role-card glass-panel rounded-xl p-4 text-center border border-border-ice flex flex-col items-center gap-2 group cursor-pointer transition-all ${
                          role === "teacher" ? "bg-emerald-500/25 border-emerald-400" : ""
                        }`}
                      >
                        <span className="material-symbols-outlined text-tertiary group-hover:scale-110 transition-transform">
                          menu_book
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface block mt-1">
                          Giáo viên
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Inputs */}
                  <div className="space-y-4">
                    {/* Full name */}
                    <div>
                      <label
                        className="block font-label-md text-label-md text-on-surface-variant mb-1"
                        htmlFor="fullname"
                      >
                        Họ và Tên
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                          person
                        </span>
                        <input
                          className="w-full glass-input rounded-lg py-3 pl-10 pr-4 text-on-surface font-body-md placeholder-outline-variant focus:ring-0"
                          id="fullname"
                          placeholder="Nhập tên đầy đủ của bạn"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        className="block font-label-md text-label-md text-on-surface-variant mb-1"
                        htmlFor="email"
                      >
                        Email Chỉ Huy
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                          mail
                        </span>
                        <input
                          className="w-full glass-input rounded-lg py-3 pl-10 pr-4 text-on-surface font-body-md placeholder-outline-variant focus:ring-0"
                          id="email"
                          placeholder="commander@eve.academy"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label
                        className="block font-label-md text-label-md text-on-surface-variant mb-1"
                        htmlFor="password"
                      >
                        Mã Khoá An Ninh
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                          lock
                        </span>
                        <input
                          className="w-full glass-input rounded-lg py-3 pl-10 pr-12 text-on-surface font-body-md placeholder-outline-variant focus:ring-0"
                          id="password"
                          placeholder="Ít nhất 8 ký tự"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-secondary"
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <span className="material-symbols-outlined text-sm">
                            {showPassword ? "visibility" : "visibility_off"}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label
                        className="block font-label-md text-label-md text-on-surface-variant mb-1"
                        htmlFor="confirmPassword"
                      >
                        Xác nhận Mã Khoá An Ninh
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                          lock_reset
                        </span>
                        <input
                          className="w-full glass-input rounded-lg py-3 pl-10 pr-4 text-on-surface font-body-md placeholder-outline-variant focus:ring-0"
                          id="confirmPassword"
                          placeholder="Nhập lại mật khẩu phía trên"
                          type={showPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {message && (
                    <p className="text-sm font-medium text-cyan-300">
                      {message}
                    </p>
                  )}

                  {/* Submit to Step 2 */}
                  <button
                    className="w-full btn-primary-glow bg-primary-container text-on-primary-container font-label-md text-label-md py-3 rounded-lg flex items-center justify-center gap-2 mt-4 hover:bg-primary-fixed"
                    type="submit"
                  >
                    <span>Tiếp Tục Đăng Ký (2FA)</span>
                    <span className="material-symbols-outlined">
                      arrow_forward
                    </span>
                  </button>
                </form>
              </>
            ) : (
              <>
                {/* Step 2 Header */}
                <div className="mb-8">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
                    Xác Thực Hai Bước (2FA)
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Vui lòng nhập mã xác thực đã được gửi đến email chỉ huy của bạn để hoàn tất hồ sơ.
                  </p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-6">
                  <div>
                    <label
                      className="block font-label-md text-label-md text-on-surface-variant mb-2"
                      htmlFor="2facode"
                    >
                      Mã Xác Thực 6 Số
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                        security
                      </span>
                      <input
                        className="w-full glass-input rounded-lg py-3 pl-10 pr-4 text-on-surface font-body-md placeholder-outline-variant focus:ring-0 text-center tracking-widest text-lg font-bold"
                        id="2facode"
                        placeholder="••••••"
                        maxLength={6}
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {message && (
                    <p className="text-sm font-medium text-cyan-300">
                      {message}
                    </p>
                  )}

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setMessage("");
                      }}
                      className="w-1/3 py-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800"
                    >
                      Quay lại
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-2/3 btn-primary-glow bg-primary-container text-on-primary-container font-label-md text-label-md py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-primary-fixed disabled:opacity-50"
                    >
                      {loading ? "Đang tạo tài khoản..." : "Xác Thực & Hoàn Tất"}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Login Link */}
            <div className="mt-8 text-center font-label-sm text-label-sm text-on-surface-variant">
              Đã có quyền truy cập?{" "}
              <Link
                className="text-secondary font-semibold hover:underline"
                href="/public/login"
              >
                Đăng nhập tại đây
              </Link>
            </div>
          </div>
        </section>
      </main>
    </main>
  );
}