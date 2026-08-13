import Link from 'next/link';

export default function StudentConversationPage() {
  const conversations = [
    { sender: 'Giảng viên Trần Thị Bình', msg: 'Em An nhớ xem lại bài tập đếm nguyên âm nhé!', time: '10:30 AM' },
    { sender: 'Trợ lý Lớp Học E-V-E', msg: 'Buổi học online Google Meet đã bắt đầu.', time: '09:00 AM' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6 md:p-10 font-sans">
      <header className="max-w-4xl mx-auto flex justify-between items-center pb-6 border-b border-sky-500/20 mb-8">
        <div className="flex items-center gap-3">
          <Link href="/public/dashboard/student" className="font-mono text-xs text-sky-400 hover:underline">
            ← Dashboard Học Sinh
          </Link>
          <span className="text-slate-600 font-mono">/</span>
          <span className="font-mono text-sm text-white font-bold">CONVERSATION</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto space-y-6">
        <div className="p-8 rounded-3xl bg-[#0f1524]/80 border border-sky-500/30 backdrop-blur-xl shadow-2xl space-y-6">
          <h1 className="text-2xl font-bold text-white">Hộp Thư Trò Chuyện & Thảo Luận</h1>

          <div className="space-y-3 font-mono text-xs">
            {conversations.map((c, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-sky-300 font-bold">
                  <span>💬 {c.sender}</span>
                  <span className="text-slate-500 font-normal">{c.time}</span>
                </div>
                <p className="text-slate-300 text-sm">{c.msg}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
