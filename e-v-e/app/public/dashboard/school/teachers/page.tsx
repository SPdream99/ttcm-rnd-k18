import Link from 'next/link';

export default function SchoolTeachersPage() {
  const teachers = [
    { id: 'gv-01', name: 'ThS. Trần Thị Bình', email: 'binh.tran@teacher.edu.vn', subject: 'Lập Trình Python AI', status: 'Đang Giảng Dạy' },
    { id: 'gv-02', name: 'TS. Nguyễn Văn Cường', email: 'cuong.nguyen@teacher.edu.vn', subject: 'Thuật Toán & Cấu Trúc Dữ Liệu', status: 'Đang Giảng Dạy' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6 md:p-10 font-sans">
      <header className="max-w-6xl mx-auto flex justify-between items-center pb-6 border-b border-emerald-500/20 mb-8">
        <div className="flex items-center gap-3">
          <Link href="/public/dashboard/school" className="font-mono text-xs text-emerald-400 hover:underline">
            ← Dashboard Nhà Trường
          </Link>
          <span className="text-slate-600 font-mono">/</span>
          <span className="font-mono text-sm text-white font-bold">TEACHER MANAGEMENT</span>
        </div>

        <Link
          href="/public/school/users"
          className="px-4 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs transition-all"
        >
          + Cấp Tài Khoản Giảng Viên Mới
        </Link>
      </header>

      <main className="max-w-6xl mx-auto space-y-6">
        <div className="p-8 rounded-3xl bg-[#0f1524]/80 border border-emerald-500/30 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Danh Sách Quản Lý Giảng Viên Toàn Trường</h1>
            <span className="font-mono text-xs text-emerald-400">Tổng số: {teachers.length} giảng viên</span>
          </div>

          <div className="space-y-3">
            {teachers.map((tc) => (
              <div key={tc.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 font-bold">
                    👨‍🏫
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{tc.name}</h4>
                    <p className="font-mono text-xs text-slate-400">{tc.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 font-mono text-xs">
                  <span className="px-3 py-1 rounded bg-slate-900 border border-slate-700 text-emerald-300">{tc.subject}</span>
                  <span className="px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">{tc.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
