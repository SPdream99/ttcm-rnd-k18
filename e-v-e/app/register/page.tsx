"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  Mail,
  Lock,
  User,
  School,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { setAuthCookie } from "@/lib/cookies";

export default function RegisterPage() {
  const { register } = useAuthAdapter();

  const [role, setRole] = useState<"student" | "teacher">("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [schoolCode, setSchoolCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
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

    setLoading(true);

    try {
      const res = await register({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        pass: password,
        confirmPass: confirmPassword,
        role,
        schoolCode: role === "teacher" ? schoolCode.trim() : undefined,
      });

      if (!res.success || !res.user) {
        setMessage(res.error || "Đăng ký không thành công. Vui lòng thử lại.");
        setLoading(false);
        return;
      }

      setAuthCookie(res.user, true);

      if (role === "teacher") {
        setMessage("Đăng ký tài khoản Giáo viên thành công! Đang chuyển hướng sang trang chờ phê duyệt...");
        setTimeout(() => {
          window.location.href = "/pending";
        }, 1200);
      } else {
        setMessage("Đăng ký thành công! Đang chuyển hướng vào Bảng điều khiển Học viên...");
        setTimeout(() => {
          window.location.href = "/student/dashboard";
        }, 1200);
      }
    } catch {
      setMessage("Đã xảy ra lỗi khi hoàn tất đăng ký. Vui lòng thử lại.");
      setLoading(false);
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
        <span className="text-[11px] text-zinc-400 font-mono">E-V-E Platform</span>
      </div>

      <div className="w-full max-w-lg space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-red-600 text-white font-black text-xl shadow-md mx-auto">
            E
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">
            Tạo Tài Khoản E-V-E Mới
          </h1>
          <p className="text-xs md:text-sm text-zinc-500 max-w-sm mx-auto">
            Nền tảng học tập & giảng dạy 3D Gamification tương tác cao.
          </p>
        </div>

        {/* REGISTRATION FORM */}
        <div className="rounded-2xl bg-white border border-zinc-200 p-6 md:p-8 shadow-sm space-y-5">
          {/* Role selector */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-2">
              Bạn tham gia với vai trò:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  role === "student"
                    ? "bg-red-50 border-red-600 text-red-700 shadow-2xs"
                    : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Học Sinh / Học Viên</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("teacher")}
                className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  role === "teacher"
                    ? "bg-red-50 border-red-600 text-red-700 shadow-2xs"
                    : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Giáo Viên / Giảng Viên</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-red-600" /> Họ và Tên
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="VD: Nguyễn Văn A"
                className="w-full bg-zinc-50 border border-zinc-300 focus:border-red-600 rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-red-600" /> Địa Chỉ Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-zinc-50 border border-zinc-300 focus:border-red-600 rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none"
                required
              />
            </div>

            {role === "teacher" && (
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-red-600" /> Mã Trường / Đơn Vị Công Tác
                </label>
                <input
                  type="text"
                  value={schoolCode}
                  onChange={(e) => setSchoolCode(e.target.value)}
                  placeholder="VD: MIN躓_K18_EDU"
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
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Đang khởi tạo tài khoản...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Hoàn Tất Đăng Ký Tài Khoản
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
      </div>
    </div>
  );
}
