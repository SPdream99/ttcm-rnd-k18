import Link from 'next/link';

export default function DemoHomePage() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6 md:p-12 font-sans selection:bg-sky-500 selection:text-black">
      {/* Ambient background glow */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Header Banner */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center pb-8 border-b border-sky-500/20 mb-10 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400 flex items-center justify-center text-sky-400 font-bold">⚡</span>
            <span className="font-mono text-2xl font-bold tracking-widest text-sky-400">E-V-E DEMO HUB</span>
          </div>
          <p className="text-xs text-sky-300/80 font-mono mt-1">
            💡 <strong className="text-sky-300">Nhà Trường sẽ cung cấp tài khoản riêng</strong> • Sơ Đồ Cây Điều Hướng Toàn Bộ Trang Web
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <Link
            href="/public/login"
            className="px-4 py-2 rounded-full bg-sky-500/20 hover:bg-sky-500/40 border border-sky-400 text-sky-300 transition-all"
          >
            🔒 Đăng Nhập (Login)
          </Link>
          <Link
            href="/public/about"
            className="px-4 py-2 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-all"
          >
            ℹ️ About E-V-E
          </Link>
        </div>
      </header>

      {/* Main Grid: Structured Panels by Role & Site Tree */}
      <main className="max-w-7xl mx-auto space-y-10">
        
        {/* SECTION 1: TRANG CHUNG (General Pages) */}
        <section className="p-8 rounded-3xl bg-[#0f1524]/80 border border-sky-500/30 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-sky-500/20">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400 flex items-center justify-center text-sky-300 text-sm">
                🌐
              </span>
              <h2 className="font-mono text-lg font-bold text-sky-300 uppercase tracking-widest">
                01 // TRANG CHUNG (GENERAL PAGES)
              </h2>
            </div>
            <span className="font-mono text-xs text-slate-400">3 ROUTE CHÍNH</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <Link
              href="/public/courses/course-001"
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-sky-400 transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-sky-400 font-bold block mb-1">🏠 Main Page (Course Classroom)</span>
                <p className="text-slate-400 text-[11px]">Trang Lớp Học Daginatsuko với 6 Panel full-screen.</p>
              </div>
              <span className="text-sky-400 font-bold pt-3 group-hover:translate-x-1 transition-transform">Vào Trang Main →</span>
            </Link>

            <Link
              href="/public/login"
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-sky-400 transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-sky-400 font-bold block mb-1">🔒 Login Page</span>
                <p className="text-slate-400 text-[11px]">Cổng đăng nhập hệ thống với lưu ý tài khoản riêng.</p>
              </div>
              <span className="text-sky-400 font-bold pt-3 group-hover:translate-x-1 transition-transform">Vào Trang Login →</span>
            </Link>

            <Link
              href="/public/about"
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-sky-400 transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-sky-400 font-bold block mb-1">ℹ️ About Page</span>
                <p className="text-slate-400 text-[11px]">Trang giới thiệu kiến trúc & tính năng E-V-E.</p>
              </div>
              <span className="text-sky-400 font-bold pt-3 group-hover:translate-x-1 transition-transform">Vào Trang About →</span>
            </Link>
          </div>
        </section>

        {/* SECTION 2: PHÂN HỆ NHÀ TRƯỜNG (School Admin) */}
        <section className="p-8 rounded-3xl bg-[#0f1524]/80 border border-purple-500/30 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-purple-500/20">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-400 flex items-center justify-center text-purple-300 text-sm">
                🏫
              </span>
              <h2 className="font-mono text-lg font-bold text-purple-300 uppercase tracking-widest">
                02 // DASHBOARD - SCHOOL (NHÀ TRƯỜNG)
              </h2>
            </div>
            <span className="font-mono text-xs text-slate-400">4 CHI NHÁNH ROUTE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <Link
              href="/public/dashboard/school"
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-400 transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-purple-300 font-bold block mb-1">🖥️ Dashboard (main page)</span>
                <p className="text-slate-400 text-[11px]">Bàn điều hành hệ thống nhà trường.</p>
              </div>
              <span className="text-purple-400 font-bold pt-3 group-hover:translate-x-1 transition-transform">Mở Dashboard →</span>
            </Link>

            <Link
              href="/public/dashboard/school/profile"
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-400 transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-purple-300 font-bold block mb-1">👤 Profile</span>
                <p className="text-slate-400 text-[11px]">Thông tin hồ sơ và cơ sở trường học.</p>
              </div>
              <span className="text-purple-400 font-bold pt-3 group-hover:translate-x-1 transition-transform">Mở Profile →</span>
            </Link>

            <Link
              href="/public/dashboard/school/students"
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-400 transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-purple-300 font-bold block mb-1">🎓 Student Management</span>
                <p className="text-slate-400 text-[11px]">Quản lý danh sách học sinh toàn trường.</p>
              </div>
              <span className="text-purple-400 font-bold pt-3 group-hover:translate-x-1 transition-transform">Mở Student Mgmt →</span>
            </Link>

            <Link
              href="/public/dashboard/school/teachers"
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-400 transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-purple-300 font-bold block mb-1">👨‍🏫 Teacher Management</span>
                <p className="text-slate-400 text-[11px]">Quản lý danh sách giảng viên toàn trường.</p>
              </div>
              <span className="text-purple-400 font-bold pt-3 group-hover:translate-x-1 transition-transform">Mở Teacher Mgmt →</span>
            </Link>
          </div>
        </section>

        {/* SECTION 3: PHÂN HỆ GIẢNG VIÊN (Teacher) */}
        <section className="p-8 rounded-3xl bg-[#0f1524]/80 border border-emerald-500/30 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-emerald-500/20">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 text-sm">
                👨‍🏫
              </span>
              <h2 className="font-mono text-lg font-bold text-emerald-300 uppercase tracking-widest">
                03 // DASHBOARD - TEACHER (GIẢNG VIÊN)
              </h2>
            </div>
            <span className="font-mono text-xs text-slate-400">4 CHI NHÁNH ROUTE & SUB-ITEMS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <Link
              href="/public/dashboard/teacher"
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-400 transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-emerald-300 font-bold block mb-1">🖥️ Dashboard (main page)</span>
                <p className="text-slate-400 text-[11px]">Bàn làm việc giảng viên tổng quan.</p>
              </div>
              <span className="text-emerald-400 font-bold pt-3 group-hover:translate-x-1 transition-transform">Mở Dashboard →</span>
            </Link>

            <Link
              href="/public/dashboard/teacher/profile"
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-400 transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-emerald-300 font-bold block mb-1">👤 Profile</span>
                <ul className="text-slate-400 text-[11px] space-y-0.5 mt-1">
                  <li>• Reset password</li>
                  <li>• Rechange Info</li>
                </ul>
              </div>
              <span className="text-emerald-400 font-bold pt-3 group-hover:translate-x-1 transition-transform">Mở Profile →</span>
            </Link>

            <Link
              href="/public/dashboard/teacher/announcements"
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-400 transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-emerald-300 font-bold block mb-1">📢 Announcement or conversation</span>
                <p className="text-slate-400 text-[11px]">Đăng thông báo & trò chuyện với lớp.</p>
              </div>
              <span className="text-emerald-400 font-bold pt-3 group-hover:translate-x-1 transition-transform">Mở Announcement →</span>
            </Link>

            <Link
              href="/public/dashboard/teacher/classes"
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-400 transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-emerald-300 font-bold block mb-1">📚 Class Management</span>
                <ul className="text-slate-400 text-[11px] space-y-0.5 mt-1">
                  <li>• Student Management</li>
                  <li>• Lecture Management</li>
                  <li>• Assignment Management</li>
                </ul>
              </div>
              <span className="text-emerald-400 font-bold pt-3 group-hover:translate-x-1 transition-transform">Mở Class Mgmt →</span>
            </Link>
          </div>
        </section>

        {/* SECTION 4: PHÂN HỆ HỌC SINH & PHỤ HUYNH (Student / Parents) */}
        <section className="p-8 rounded-3xl bg-[#0f1524]/80 border border-sky-500/30 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-sky-500/20">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400 flex items-center justify-center text-sky-300 text-sm">
                🎓
              </span>
              <h2 className="font-mono text-lg font-bold text-sky-300 uppercase tracking-widest">
                04 // DASHBOARD - STUDENT/PARENTS (HỌC SINH & PHỤ HUYNH)
              </h2>
            </div>
            <span className="font-mono text-xs text-slate-400">6 CHI NHÁNH ROUTE & SUB-ITEMS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
            <Link
              href="/public/dashboard/student"
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-sky-400 transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-sky-300 font-bold block mb-1">🖥️ Dashboard (main page)</span>
                <p className="text-slate-400 text-[11px]">Góc học tập Học sinh & Phụ huynh.</p>
              </div>
              <span className="text-sky-400 font-bold pt-3 group-hover:translate-x-1 transition-transform">Mở Dashboard →</span>
            </Link>

            <Link
              href="/public/dashboard/student/profile"
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-sky-400 transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-sky-300 font-bold block mb-1">👤 Profile</span>
                <ul className="text-slate-400 text-[11px] space-y-0.5 mt-1">
                  <li>• Reset password</li>
                  <li>• Rechange Info</li>
                </ul>
              </div>
              <span className="text-sky-400 font-bold pt-3 group-hover:translate-x-1 transition-transform">Mở Profile →</span>
            </Link>

            <Link
              href="/public/dashboard/student/learning-path"
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-sky-400 transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-sky-300 font-bold block mb-1">🗺️ Learning Path</span>
                <p className="text-slate-400 text-[11px]">Lộ trình học tập cá nhân hóa.</p>
              </div>
              <span className="text-sky-400 font-bold pt-3 group-hover:translate-x-1 transition-transform">Mở Learning Path →</span>
            </Link>

            <Link
              href="/public/dashboard/student/ai-tutor"
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-sky-400 transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-sky-300 font-bold block mb-1">🤖 AI Tutor (student)</span>
                <p className="text-slate-400 text-[11px]">Trợ lý AI giải đáp thắc mắc 24/7.</p>
              </div>
              <span className="text-sky-400 font-bold pt-3 group-hover:translate-x-1 transition-transform">Mở AI Tutor →</span>
            </Link>

            <Link
              href="/public/dashboard/student/conversation"
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-sky-400 transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-sky-300 font-bold block mb-1">💬 Conversation</span>
                <p className="text-slate-400 text-[11px]">Hộp thư trò chuyện & thảo luận.</p>
              </div>
              <span className="text-sky-400 font-bold pt-3 group-hover:translate-x-1 transition-transform">Mở Conversation →</span>
            </Link>

            <Link
              href="/public/dashboard/student/class"
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-sky-400 transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-sky-300 font-bold block mb-1">🏫 Class (student)</span>
                <ul className="text-slate-400 text-[11px] space-y-0.5 mt-1">
                  <li>• Member</li>
                  <li>• Assignment</li>
                </ul>
              </div>
              <span className="text-sky-400 font-bold pt-3 group-hover:translate-x-1 transition-transform">Mở Class (Student) →</span>
            </Link>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-12 pt-6 border-t border-slate-800 text-center font-mono text-xs text-slate-500">
        © 2026 E-V-E EDUCATION PLATFORM • GLACIER GLASSMORPHISM SITE TREE HUB
      </footer>
    </div>
  );
}
