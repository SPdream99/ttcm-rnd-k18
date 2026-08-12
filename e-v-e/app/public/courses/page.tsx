import Link from 'next/link';
import { getContainer } from '@/infrastructure/di/container';

export default async function AllCoursesPage() {
  const c = await getContainer();
  const courses = await c.getPublishedCoursesUseCase.execute();

  return (
    <div className="min-h-screen bg-[#060a12] text-white p-6 md:p-12 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Header */}
      <header className="max-w-7xl mx-auto flex justify-between items-center pb-8 border-b border-cyan-500/20 mb-10">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/50 flex items-center justify-center text-cyan-400 text-xl font-bold group-hover:scale-105 transition-transform">
              ⚡
            </span>
            <span className="font-mono text-2xl font-bold tracking-widest text-cyan-400">E-V-E</span>
          </Link>
          <span className="text-slate-600 font-mono">/</span>
          <span className="font-mono text-sm text-cyan-300 tracking-wider">DANH SÁCH TOÀN BỘ LỚP HỌC</span>
        </div>

        <Link
          href="/"
          className="px-5 py-2 rounded-full border border-slate-700 hover:border-cyan-400 bg-slate-900/80 text-slate-300 hover:text-white font-mono text-xs transition-all"
        >
          ← Trang Chủ
        </Link>
      </header>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3">Tất Cả Khóa Học Hệ Sinh Thái E-V-E</h1>
          <p className="text-slate-400 text-sm font-mono">Khám phá các lớp học chất lượng cao tích hợp E-V-E AI Mentor 24/7</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/public/courses/${course.id}`}
              className="group p-5 rounded-3xl bg-slate-900/80 border border-cyan-500/20 hover:border-cyan-400/60 backdrop-blur-xl transition-all hover:-translate-y-1 shadow-[0_0_20px_rgba(6,182,212,0.1)] flex flex-col justify-between"
            >
              <div>
                <div className="aspect-video w-full rounded-2xl overflow-hidden mb-4 relative bg-black">
                  <img
                    src={course.thumbnailUrl || course.bannerUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFzxfRc4zu_S4KnQjuHKNY8ZHA_W1eNLJR2iXGJJg8nGFU3FODX9yH_sOsgXUVrbX4-9Q6s5uHBXbOI7OGXYjw4SKXaGl99gDdDatnZQBRjo51CYqKYFrV-5vD5N6w18NU8WRcjrn1KpkjsZOXDHoDgTSTMTcyHoKJ1TKAY_3dVAbYnujaJFw8TtiwcwHllZybE8ID_yd_e4qrzwMJfil_a6zPQiYZPtMV5sWYokBtB7iy1AVC0S2S'}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                    <span className="font-mono text-[11px] text-cyan-300">
                      THỜI LƯỢNG: {course.totalDuration || '24 Giờ'}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-white text-lg mb-2 group-hover:text-cyan-300 transition-colors">
                  {course.title}
                </h3>
                <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed mb-4">
                  {course.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-center font-mono text-xs">
                <span className="text-slate-400">Sĩ số: {course.studentsCount || 128}</span>
                <span className="text-cyan-400 font-bold group-hover:translate-x-1 transition-transform">
                  Vào Lớp →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
