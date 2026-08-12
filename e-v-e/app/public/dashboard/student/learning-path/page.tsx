import Link from 'next/link';

export default function StudentLearningPathPage() {
  const steps = [
    { title: 'Chặng 1: Nền tảng Cú pháp Python cơ bản', status: '✓ Hoàn thành', percentage: 100 },
    { title: 'Chặng 2: Thuật toán & Cấu trúc Dữ liệu List/Dict', status: '⚡ Đang học', percentage: 80 },
    { title: 'Chặng 3: Lập trình Hướng đối tượng OOP', status: '○ Chưa mở', percentage: 0 },
    { title: 'Chặng 4: Nhập môn AI & Thuật toán Machine Learning', status: '○ Chưa mở', percentage: 0 },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6 md:p-10 font-sans">
      <header className="max-w-4xl mx-auto flex justify-between items-center pb-6 border-b border-cyan-500/20 mb-8">
        <div className="flex items-center gap-3">
          <Link href="/public/dashboard/student" className="font-mono text-xs text-cyan-400 hover:underline">
            ← Dashboard Học Sinh
          </Link>
          <span className="text-slate-600 font-mono">/</span>
          <span className="font-mono text-sm text-white font-bold">LEARNING PATH</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto space-y-6">
        <div className="p-8 rounded-3xl bg-[#0f1524]/80 border border-cyan-500/30 backdrop-blur-xl shadow-2xl space-y-6">
          <div>
            <span className="px-3.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 font-mono text-xs mb-2 inline-block">
              PERSONALIZED ROADMAP
            </span>
            <h1 className="text-3xl font-extrabold text-white">Lộ Trình Học Cá Nhân Hóa</h1>
            <p className="text-xs text-slate-400 font-mono mt-1">Lập Trình Python AI & Machine Learning</p>
          </div>

          <div className="space-y-4">
            {steps.map((st, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center font-mono text-xs">
                  <h4 className="font-bold text-white text-sm">{st.title}</h4>
                  <span className={st.percentage === 100 ? 'text-emerald-400' : st.percentage > 0 ? 'text-cyan-400' : 'text-slate-500'}>
                    {st.status} ({st.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-500"
                    style={{ width: `${st.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
