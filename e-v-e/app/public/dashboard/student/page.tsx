import Link from 'next/link';

export default function StudentDashboardPage() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6 md:p-10 font-sans">
      
      {/* Header */}
      <header className="max-w-7xl mx-auto flex justify-between items-center pb-6 border-b border-sky-500/20 mb-8">
        <div className="flex items-center gap-3">
          <Link href="/public/demo" className="flex items-center gap-2 group">
            <span className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400 flex items-center justify-center text-sky-300 font-bold group-hover:scale-105 transition-transform">
              🎓
            </span>
            <span className="font-mono text-2xl font-bold tracking-widest text-sky-400">STUDENT DASHBOARD</span>
          </Link>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <Link
            href="/public/dashboard/student/profile"
            className="px-4 py-2 rounded-full border border-sky-500/30 bg-slate-900/80 hover:bg-slate-800 text-sky-300 transition-all"
          >
            👤 Hồ Sơ Học Sinh
          </Link>
          <Link
            href="/public/demo"
            className="px-4 py-2 rounded-full border border-slate-700 hover:border-sky-400 bg-slate-900/80 text-slate-300 transition-all"
          >
            ← Trang Chủ Demo
          </Link>
        </div>
      </header>

      {/* Main Grid Navigation */}
      <main className="max-w-7xl mx-auto space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 font-mono text-xs mb-3">
            STUDENT & PARENTS PORTAL
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white">Góc Học Tập & Theo Dõi Phụ Huynh</h1>
          <p className="text-slate-400 text-sm font-mono mt-1">Truy cập lớp học, tương tác Trợ lý AI Tutor 24/7 và xem Lộ trình học cá nhân</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/public/dashboard/student/learning-path"
            className="group p-8 rounded-3xl bg-[#0f1524]/70 border border-cyan-500/30 hover:border-cyan-400 backdrop-blur-xl transition-all hover:-translate-y-1 shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 text-2xl mb-4 group-hover:scale-110 transition-transform">
                🗺️
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                Learning Path
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Lộ trình học tập cá nhân hóa được đo lường chính xác tiến độ và mục tiêu bài học.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-slate-800 text-xs font-mono text-cyan-400 font-bold group-hover:translate-x-1 transition-transform">
              Xem Lộ Trình Học →
            </div>
          </Link>

          <Link
            href="/public/dashboard/student/ai-tutor"
            className="group p-8 rounded-3xl bg-[#0f1524]/70 border border-purple-500/30 hover:border-purple-400 backdrop-blur-xl transition-all hover:-translate-y-1 shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-400 flex items-center justify-center text-purple-300 text-2xl mb-4 group-hover:scale-110 transition-transform">
                🤖
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                AI Tutor (Student)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Trợ lý trí tuệ nhân tạo giải đáp thắc mắc bài tập và gợi ý phương pháp học 24/7.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-slate-800 text-xs font-mono text-purple-400 font-bold group-hover:translate-x-1 transition-transform">
              Hỏi Đáp Với AI Tutor →
            </div>
          </Link>

          <Link
            href="/public/dashboard/student/class"
            className="group p-8 rounded-3xl bg-[#0f1524]/70 border border-emerald-500/30 hover:border-emerald-400 backdrop-blur-xl transition-all hover:-translate-y-1 shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 text-2xl mb-4 group-hover:scale-110 transition-transform">
                🏫
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                Class & Member & Assignment
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Xem danh sách thành viên trong lớp, làm bài tập tự luận và gửi bài giải trực tiếp.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-slate-800 text-xs font-mono text-emerald-400 font-bold group-hover:translate-x-1 transition-transform">
              Vào Lớp Học Của Tôi →
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
