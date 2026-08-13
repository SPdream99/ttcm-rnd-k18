"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { setAuthCookie } from "@/lib/cookies";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const { login, loading } = useAuthAdapter();

  const handleLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setMessage("");

    const res = await login({ email, pass: password });

    if (!res.success || !res.user) {
      setMessage(res.error || "Email hoặc mật khẩu không đúng.");
      return;
    }

    setAuthCookie(res.user, true);

    setMessage("Đăng nhập thành công!");
    const role = res.user.role;

    setTimeout(() => {
      if (role === "student") {
        window.location.href = "/dashbroad/student";
      } else if (role === "teacher") {
        window.location.href = "/dashbroad/teacher";
      } else if (role === "school" || role === "admin") {
        window.location.href = "/dashbroad/school";
      } else {
        window.location.href = "/dashbroad/student";
      }
    }, 1000);
  };

  return (
    <div className="glass-card rounded-xl p-gutter lg:p-margin-desktop">
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
    </div>
  );
}