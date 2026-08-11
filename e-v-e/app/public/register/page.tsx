"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="bg-background text-on-background min-h-screen relative overflow-hidden font-body-md flex items-center justify-center p-4">

      {/* Background */}
      <div className="fixed inset-0 -z-20">
        <img
          className="w-full h-full object-cover opacity-40 mix-blend-screen"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUboRFM8RkTqkV69A13hGvMHBudWMCvLzjfhs8XhepyMHGn5hogLe4HLwHb0Q1bLe9Wrm9I3CD6zFWS5Ri1OkZbZkmjCKOLcs08dfh8XF8uRN-KoRahPvgP2Ai1_r7LYJDzF5mZWZaJXxKbm7K1HiMKa7chNwHvaDQo1FJ9RLZZ2f89w2IFIdJ0FDJ_-ItyVnHiibp1z10_FykDDrbyMXaEr9tBgdJDDyMWk0hhwzU02fFqakN9T4N"
          alt="Deep space nebula"
        />
      </div>

      {/* Ambient Orbs */}
      <div
        className="orb bg-secondary w-96 h-96 top-[-10%] left-[-10%]"
        style={{ animationDelay: "0s" }}
      />

      <div
        className="orb bg-primary-container w-125 h-125 bottom-[-20%] right-[-10%]"
        style={{ animationDelay: "-5s" }}
      />

      {/* Main */}
      <main className="w-full max-w-6xl relative z-10 flex flex-col md:flex-row glass-panel rounded-2xl overflow-hidden shadow-2xl border border-border-ice">

        {/* Left Side */}
        <section className="w-full md:w-5/12 p-8 md:p-12 border-b md:border-b-0 md:border-r border-border-ice flex flex-col justify-between relative overflow-hidden bg-linear-to-b from-surface-glass to-transparent">

          {/* Decorative overlay */}
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
              <span className="text-secondary">
                Vũ Trụ Tri Thức
              </span>
            </h2>

            <p className="font-body-md text-body-md text-on-surface-variant mb-8">
              Tham gia học viện không gian E-V-E. Nơi tri thức vượt qua mọi
              giới hạn và sự tò mò định hình tương lai.
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
                  Đã có hơn 2M+ nhà thám hiểm
                </div>

                <div className="font-label-sm text-label-sm text-secondary">
                  Đang kết nối toàn cầu
                </div>
              </div>

            </div>
          </div>

        </section>

        {/* Right Side */}
        <section className="w-full md:w-7/12 p-8 md:p-12 bg-surface-container-lowest/80 backdrop-blur-xl">

          <div className="max-w-md mx-auto">

            {/* Header */}
            <div className="mb-8">
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
                Tạo Hồ Sơ Mới
              </h3>

              <p className="font-body-md text-body-md text-on-surface-variant">
                Vui lòng cung cấp thông tin để thiết lập danh tính không gian
                của bạn.
              </p>
            </div>

            <form className="space-y-6">

              {/* Role */}
              <div className="space-y-3">

                <label className="block font-label-md text-label-md text-on-surface">
                  Bạn là ai?
                </label>

                <div className="grid grid-cols-3 gap-3">

                  {/* Student */}
                  <label
                    className={`role-card glass-panel rounded-xl p-4 text-center border border-border-ice flex flex-col items-center gap-2 group cursor-pointer ${
                      role === "student" ? "selected" : ""
                    }`}
                  >
                    <input
                      className="hidden"
                      name="role"
                      type="radio"
                      value="student"
                      checked={role === "student"}
                      onChange={() => setRole("student")}
                    />

                    <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">
                      school
                    </span>

                    <span className="font-label-sm text-label-sm text-on-surface block mt-1">
                      Học sinh
                    </span>
                  </label>

                  {/* Teacher */}
                  <label
                    className={`role-card glass-panel rounded-xl p-4 text-center border border-border-ice flex flex-col items-center gap-2 group cursor-pointer ${
                      role === "teacher" ? "selected" : ""
                    }`}
                  >
                    <input
                      className="hidden"
                      name="role"
                      type="radio"
                      value="teacher"
                      checked={role === "teacher"}
                      onChange={() => setRole("teacher")}
                    />

                    <span className="material-symbols-outlined text-tertiary group-hover:scale-110 transition-transform group-hover:text-primary">
                      menu_book
                    </span>

                    <span className="font-label-sm text-label-sm text-on-surface-variant block mt-1 group-hover:text-on-surface">
                      Giáo viên
                    </span>
                  </label>

                  {/* Parent */}
                  <label
                    className={`role-card glass-panel rounded-xl p-4 text-center border border-border-ice flex flex-col items-center gap-2 group cursor-pointer ${
                      role === "parent" ? "selected" : ""
                    }`}
                  >
                    <input
                      className="hidden"
                      name="role"
                      type="radio"
                      value="parent"
                      checked={role === "parent"}
                      onChange={() => setRole("parent")}
                    />

                    <span className="material-symbols-outlined text-tertiary group-hover:scale-110 transition-transform group-hover:text-primary">
                      family_restroom
                    </span>

                    <span className="font-label-sm text-label-sm text-on-surface-variant block mt-1 group-hover:text-on-surface">
                      Phụ huynh
                    </span>
                  </label>

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

              </div>

              {/* Terms */}
              <div className="flex items-start gap-2 pt-2">

                <div className="flex items-center h-5">
                  <input
                    className="w-4 h-4 rounded border-border-ice bg-surface-glass text-primary focus:ring-primary focus:ring-offset-background"
                    id="terms"
                    type="checkbox"
                  />
                </div>

                <label
                  className="font-label-sm text-label-sm text-on-surface-variant leading-tight"
                  htmlFor="terms"
                >
                  Tôi đồng ý với{" "}
                  <a
                    className="text-secondary hover:underline"
                    href="#"
                  >
                    Điều khoản Dịch vụ
                  </a>{" "}
                  và{" "}
                  <a
                    className="text-secondary hover:underline"
                    href="#"
                  >
                    Quy tắc Thiên hà
                  </a>{" "}
                  của E-V-E.
                </label>

              </div>

              {/* Submit */}
              <button
                className="w-full btn-primary-glow bg-primary-container text-on-primary-container font-label-md text-label-md py-3 rounded-lg flex items-center justify-center gap-2 mt-4 hover:bg-primary-fixed"
                type="submit"
              >
                <span>Khởi Tạo Hồ Sơ</span>

                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'wght' 600" }}
                >
                  arrow_forward
                </span>
              </button>

            </form>

            {/* Login */}
            <div className="mt-8 text-center font-label-sm text-label-sm text-on-surface-variant">
              Đã có quyền truy cập?{" "}
              <a
                className="text-secondary font-semibold hover:underline"
                href="/login"
              >
                Đăng nhập tại đây
              </a>
            </div>

          </div>

        </section>

      </main>

    </main>
  );
}