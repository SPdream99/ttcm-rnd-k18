import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6 md:p-12 font-sans selection:bg-sky-500 selection:text-black">
      {/* Header */}
      <header className="max-w-6xl mx-auto flex justify-between items-center pb-8 border-b border-sky-500/20 mb-12">
        <div className="flex items-center gap-3">
          <Link href="/public/demo" className="flex items-center gap-2 group">
            <span className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 font-bold group-hover:scale-105 transition-transform">
              ⚡
            </span>
            <span className="font-mono text-2xl font-bold tracking-widest text-sky-400">E-V-E</span>
          </Link>
          <span className="text-slate-600 font-mono">/</span>
          <span className="font-mono text-sm text-sky-300 tracking-wider">GIỚI THIỆU HỆ THỐNG</span>
        </div>

        <Link
          href="/public/demo"
          className="px-5 py-2 rounded-full border border-slate-700 hover:border-sky-400 bg-slate-900/80 text-slate-300 hover:text-white font-mono text-xs transition-all"
        >
          ← Trang Chủ Demo
        </Link>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 font-mono text-xs">
            GLACIER GLASSMORPHISM • FROZEN LIGHT
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Nền Tảng Giáo Dục Số Thế Hệ Mới E-V-E
          </h1>
          <p className="text-slate-400 max-w-3xl mx-auto text-base md:text-lg leading-relaxed font-light">
            E-V-E kết nối chặt chẽ giữa 3 phân hệ chính: <strong className="text-purple-400">Nhà Trường (School Admin)</strong>, <strong className="text-emerald-400">Giảng Viên (Teacher)</strong>, và <strong className="text-sky-400">Học Sinh / Phụ Huynh (Student & Parents)</strong>.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-[#0f1524]/60 border border-purple-500/30 backdrop-blur-xl space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-400 flex items-center justify-center text-purple-300 text-2xl font-bold">
              🏫
            </div>
            <h3 className="text-xl font-bold text-white">Phân Hệ Nhà Trường</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Nhà trường trực tiếp quản lý và cấp tài khoản riêng cho tất cả giáo viên và học sinh, giám sát toàn bộ hoạt động giảng dạy.
            </p>
            <Link
              href="/public/dashboard/school"
              className="inline-block pt-2 text-xs font-mono text-purple-400 hover:underline"
            >
              Xem Dashboard Nhà Trường →
            </Link>
          </div>

          <div className="p-8 rounded-3xl bg-[#0f1524]/60 border border-emerald-500/30 backdrop-blur-xl space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 text-2xl font-bold">
              👨‍🏫
            </div>
            <h3 className="text-xl font-bold text-white">Phân Hệ Giảng Viên</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Soạn giáo án 4K, giao bài tập tự luận/trắc nghiệm, đăng thông báo lớp học và quản lý danh sách học sinh theo từng lớp.
            </p>
            <Link
              href="/public/dashboard/teacher"
              className="inline-block pt-2 text-xs font-mono text-emerald-400 hover:underline"
            >
              Xem Dashboard Giảng Viên →
            </Link>
          </div>

          <div className="p-8 rounded-3xl bg-[#0f1524]/60 border border-sky-500/30 backdrop-blur-xl space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-400 flex items-center justify-center text-sky-300 text-2xl font-bold">
              🎓
            </div>
            <h3 className="text-xl font-bold text-white">Học Sinh & Phụ Huynh</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Theo dõi lộ trình học cá nhân hóa (Learning Path), làm bài tập, chat tương tác với Trợ lý AI Tutor 24/7.
            </p>
            <Link
              href="/public/dashboard/student"
              className="inline-block pt-2 text-xs font-mono text-sky-400 hover:underline"
            >
              Xem Dashboard Học Sinh →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
