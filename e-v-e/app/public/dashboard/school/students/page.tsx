import Link from 'next/link';

export default function SchoolStudentsPage() {
  const students = [
    { id: 'hs-01', name: 'Nguyễn Văn An', email: 'an.nguyen@student.edu.vn', class: 'Chuyên Tin 12A1', status: 'Đang Học' },
    { id: 'hs-02', name: 'Trần Thị Minh', email: 'minh.tran@student.edu.vn', class: 'Chuyên Toán 11B2', status: 'Đang Học' },
    { id: 'hs-03', name: 'Lê Hoàng Nam', email: 'nam.le@student.edu.vn', class: 'Chuyên Lý 10C3', status: 'Tạm Mở' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6 md:p-10 font-sans">
      <header className="max-w-6xl mx-auto flex justify-between items-center pb-6 border-b border-sky-500/20 mb-8">
        <div className="flex items-center gap-3">
          <Link href="/public/dashboard/school" className="font-mono text-xs text-sky-400 hover:underline">
            ← Dashboard Nhà Trường
          </Link>
          <span className="text-slate-600 font-mono">/</span>
          <span className="font-mono text-sm text-white font-bold">STUDENT MANAGEMENT</span>
        </div>

        <Link
          href="/public/school/users"
          className="px-4 py-1.5 rounded-full bg-sky-500 hover:bg-sky-400 text-black font-mono font-bold text-xs transition-all"
        >
          + Cấp Tài Khoản Học Sinh Mới
        </Link>
      </header>

      <main className="max-w-6xl mx-auto space-y-6">
        <div className="p-8 rounded-3xl bg-[#0f1524]/80 border border-sky-500/30 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Danh Sách Quản Lý Học Sinh Toàn Trường</h1>
            <span className="font-mono text-xs text-sky-400">Tổng số: {students.length} học sinh</span>
          </div>

          <div className="space-y-3">
            {students.map((st) => (
              <div key={st.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400 flex items-center justify-center text-sky-300 font-bold">
                    🎓
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{st.name}</h4>
                    <p className="font-mono text-xs text-slate-400">{st.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 font-mono text-xs">
                  <span className="px-3 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">{st.class}</span>
                  <span className="px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">{st.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
