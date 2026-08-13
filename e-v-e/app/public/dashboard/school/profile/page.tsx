import Link from 'next/link';

export default function SchoolProfilePage() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6 md:p-10 font-sans">
      <header className="max-w-4xl mx-auto flex justify-between items-center pb-6 border-b border-purple-500/20 mb-8">
        <div className="flex items-center gap-3">
          <Link href="/public/dashboard/school" className="font-mono text-xs text-purple-400 hover:underline">
            ← Dashboard Nhà Trường
          </Link>
          <span className="text-slate-600 font-mono">/</span>
          <span className="font-mono text-sm text-white font-bold">HỒ SƠ NHÀ TRƯỜNG</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto space-y-6">
        <div className="p-8 rounded-3xl bg-[#0f1524]/80 border border-purple-500/30 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-400 flex items-center justify-center text-purple-300 text-3xl">
              🏫
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Trường THPT Chuyên Quốc Gia E-V-E</h1>
              <p className="font-mono text-xs text-purple-300">School Admin ID: SCH-2026-88</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs pt-4 border-t border-slate-800">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400 block mb-1">Email Đại Diện:</span>
              <span className="text-white font-bold">admin@truongchuyen.edu.vn</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400 block mb-1">Cơ Sở Đào Tạo:</span>
              <span className="text-white font-bold">Cơ sở 1 - Hà Nội</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
