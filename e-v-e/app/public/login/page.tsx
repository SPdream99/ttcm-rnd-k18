"use client";

import { useState } from "react";
import "./login.css"
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="bg-background text-on-surface min-h-screen flex items-center justify-center bg-nebula p-margin-mobile md:p-margin-desktop overflow-hidden">

      {/* Background Stars Effect */}
      <div
        className="absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(white 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Login Container */}
      <main className="w-full max-w-md relative z-10">

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

        {/* Glass Card */}
        <div className="glass-card rounded-xl p-gutter lg:p-margin-desktop">

          <form className="flex flex-col gap-stack-md">

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
                  mail
                </span>

                <input
                  className="glass-input w-full rounded-lg py-3 pl-10 pr-4 font-body-md text-body-md text-on-surface placeholder:text-outline-variant focus:ring-0"
                  id="email"
                  name="email"
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
                  lock
                </span>

                <input
                  className="glass-input w-full rounded-lg py-3 pl-10 pr-10 font-body-md text-body-md text-on-surface placeholder:text-outline-variant focus:ring-0"
                  id="password"
                  name="password"
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
            >
              Đăng nhập
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-stack-lg">
            <div className="flex-1 h-px bg-border-ice" />

            <span className="font-label-sm text-label-sm text-outline">
              Hoặc đăng nhập với
            </span>

            <div className="flex-1 h-px bg-border-ice" />
          </div>

          {/* Social Login */}
          <div className="flex flex-col gap-stack-sm">

            {/* Google */}
            <button
              type="button"
              className="w-full glass-input hover:bg-surface-variant/50 text-on-surface font-label-md text-label-md py-3 rounded-lg flex items-center justify-center gap-3 transition-colors duration-200 border border-border-ice"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>

              Google
            </button>

            {/* Apple */}
            <button
              type="button"
              className="w-full glass-input hover:bg-surface-variant/50 text-on-surface font-label-md text-label-md py-3 rounded-lg flex items-center justify-center gap-3 transition-colors duration-200 border border-border-ice"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.15 2.95.97 3.83 2.14-3.25 1.83-2.6 5.92.51 7.15-.65 1.44-1.48 2.64-2.99 3.72zm-4.32-15.68c-.14-1.92 1.34-3.64 3.19-3.9 1.12 1.94-.96 4.09-3.19 3.9z" />
              </svg>

              Apple
            </button>

          </div>

        </div>

        {/* Register Link */}
        <p className="text-center font-body-md text-body-md text-on-surface-variant mt-stack-lg">
          Chưa có tài khoản?{" "}

          <Link
            href="/register"
            className="text-primary hover:text-secondary font-label-md text-label-md transition-colors duration-200"
          >
            Đăng ký ngay
          </Link>
        </p>

      </main>

    </main>
  );
}
