import Link from 'next/link';

export default function TeacherDashboardPage() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6 md:p-10 font-sans">
      
      {/* Header */}
      <header className="max-w-7xl mx-auto flex justify-between items-center pb-6 border-b border-emerald-500/20 mb-8">
        <div className="flex items-center gap-3">
          <Link href="/public/demo" className="flex items-center gap-2 group">
            <span className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 font-bold group-hover:scale-105 transition-transform">
              👨‍🏫
            </span>
            <span className="font-mono text-2xl font-bold tracking-widest text-emerald-400">TEACHER DASHBOARD</span>
          </Link>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <Link
            href="/public/dashboard/teacher/profile"
            className="px-4 py-2 rounded-full border border-emerald-500/30 bg-slate-900/80 hover:bg-slate-800 text-emerald-300 transition-all"
          >
            👤 Profile Giảng Viên
          </Link>
          <Link
            href="/public/demo"
            className="px-4 py-2 rounded-full border border-slate-700 hover:border-emerald-400 bg-slate-900/80 text-slate-300 transition-all"
          >
            ← Trang Chủ Demo
          </Link>
        </div>
      </header>

      {/* Main Grid Navigation */}
      <main className="max-w-7xl mx-auto space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 font-mono text-xs mb-3">
            INSTRUCTOR WORKSPACE
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white">Bàn Làm Việc Giảng Viên</h1>
          <p className="text-slate-400 text-sm font-mono mt-1">Quản lý lớp học, đăng thông báo và tạo bài tập cho học sinh</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/public/dashboard/teacher/classes"
            className="group p-8 rounded-3xl bg-[#0f1524]/70 border border-emerald-500/30 hover:border-emerald-400 backdrop-blur-xl transition-all hover:-translate-y-1 shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 text-2xl mb-4 group-hover:scale-110 transition-transform">
                📚
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                Class Management
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Quản lý Student Management, Lecture Management và Assignment Management của lớp học.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-slate-800 text-xs font-mono text-emerald-400 font-bold group-hover:translate-x-1 transition-transform">
              Vào Quản Lý Lớp Học →
            </div>
          </Link>

          <Link
            href="/public/dashboard/teacher/announcements"
            className="group p-8 rounded-3xl bg-[#0f1524]/70 border border-amber-500/30 hover:border-amber-400 backdrop-blur-xl transition-all hover:-translate-y-1 shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 text-2xl mb-4 group-hover:scale-110 transition-transform">
                📢
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                Announcement & Conversation
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Đăng thông báo quan trọng đến học sinh và tương tác nhắn tin giải đáp thắc mắc.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-slate-800 text-xs font-mono text-amber-400 font-bold group-hover:translate-x-1 transition-transform">
              Đăng Thông Báo →
            </div>
          </Link>

          <Link
            href="/public/dashboard/teacher/profile"
            className="group p-8 rounded-3xl bg-[#0f1524]/70 border border-cyan-500/30 hover:border-cyan-400 backdrop-blur-xl transition-all hover:-translate-y-1 shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 text-2xl mb-4 group-hover:scale-110 transition-transform">
                ⚙️
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                Profile & Password
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Reset Password và Rechange Info cá nhân của Giảng viên trên hệ thống.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-slate-800 text-xs font-mono text-cyan-400 font-bold group-hover:translate-x-1 transition-transform">
              Cập Nhật Profile →
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
