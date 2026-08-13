"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { setAuthCookie } from "@/lib/cookies";
import { BookOpen, GraduationCap, UserCheck, CheckCircle2, ShieldAlert, Sparkles, UserPlus, Mail, Lock, User, School } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [schoolCode, setSchoolCode] = useState("");
  const [message, setMessage] = useState("");

  const { register, loading } = useAuthAdapter();

  const handleRegisterSubmit = async (e: React.FormEvent) => {
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

    const res = await register({
      fullName,
      email,
      pass: password,
      confirmPass: confirmPassword,
      role,
      schoolCode: role === "teacher" ? schoolCode : undefined,
    });

    if (!res.success || !res.user) {
      setMessage(res.error || "Đăng ký không thành công. Vui lòng thử lại.");
      return;
    }

    // Save auth cookie
    setAuthCookie(res.user, true);

    if (role === "teacher") {
      setMessage("Đăng ký tài khoản Giáo viên thành công! Đang chuyển hướng sang trang chờ Ban Quản trị phê duyệt...");
      setTimeout(() => {
        window.location.href = "/pending";
      }, 1200);
    } else {
      setMessage("Đăng ký thành công! Đang chuyển hướng vào Bảng điều khiển Học viên...");
      setTimeout(() => {
        window.location.href = "/student/dashboard";
      }, 1200);
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
            Đăng Ký Tài Khoản
          </h2>
          <p className="text-xs md:text-sm text-[#8e9bb4]">
            Chọn vai trò và tham gia nền tảng học tập & lập trình tương tác E-V-E.
          </p>
        </div>

        {/* Card Form */}
        <div className="rounded-2xl bg-[#0f1524]/85 backdrop-blur-xl border border-[#7bd1fa]/20 p-6 md:p-8 shadow-2xl">
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
                  <div className="text-[10px] text-cyan-300/80">Tham gia học & luyện tập</div>
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
                  <div className="text-[10px] text-emerald-300/80">Soạn bài & quản lý lớp</div>
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

          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" /> Họ và Tên
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full bg-[#151b2c] border border-cyan-500/20 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all placeholder-slate-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" /> Email Đăng Ký
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@school.edu.vn"
                className="w-full bg-[#151b2c] border border-cyan-500/20 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all placeholder-slate-500"
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
                  className="w-full bg-[#151b2c] border border-cyan-500/20 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all placeholder-slate-500"
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
                  className="w-full bg-[#151b2c] border border-cyan-500/20 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all placeholder-slate-500"
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
                  className="w-full bg-[#151b2c] border border-cyan-500/20 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all placeholder-slate-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-cyan-300 text-white font-bold font-mono text-sm shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              {loading ? "Đang tạo tài khoản..." : "Tạo Tài Khoản Ngay"}
            </button>
          </form>

          {message && (
            <div className="mt-4 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-center text-xs font-mono text-cyan-300">
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
      </main>

      {/* Footer */}
      <footer className="text-center font-mono text-[11px] text-slate-500 z-10 py-4">
        © 2026 E-V-E • NỀN TẢNG HỌC TẬP & CÔNG NGHỆ TƯƠNG TÁC
      </footer>
    </div>
  );
}
