'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface User {
  id: string;
  displayName: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  avatarUrl?: string;
  createdAt: string;
}

interface SchoolUsersClientProps {
  initialUsers: User[];
}

export default function SchoolUsersClient({ initialUsers }: SchoolUsersClientProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'student' | 'instructor' | 'admin'>('instructor');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!displayName.trim() || !email.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ Họ tên và Email.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName, email, role }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Tạo tài khoản thất bại.');
      }

      setUsers([data, ...users]);
      setSuccessMsg(`✅ Đã khởi tạo thành công tài khoản [${data.displayName}] (${data.role === 'instructor' ? 'Giảng Viên' : 'Học Sinh'}).`);
      setDisplayName('');
      setEmail('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060a12] text-white p-6 md:p-12 font-sans selection:bg-purple-500 selection:text-white">
      
      {/* Header */}
      <header className="max-w-7xl mx-auto flex justify-between items-center pb-8 border-b border-purple-500/20 mb-10">
        <div className="flex items-center gap-3">
          <Link href="/public/demo" className="flex items-center gap-2 group">
            <span className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-purple-300 text-xl font-bold group-hover:scale-105 transition-transform">
              🏫
            </span>
            <span className="font-mono text-2xl font-bold tracking-widest text-purple-400">NHÀ TRƯỜNG</span>
          </Link>
          <span className="text-slate-600 font-mono">/</span>
          <span className="font-mono text-sm text-purple-300 tracking-wider">CỔNG KHỞI TẠO & QUẢN LÝ TÀI KHOẢN</span>
        </div>

        <Link
          href="/public/demo"
          className="px-5 py-2 rounded-full border border-slate-700 hover:border-purple-400 bg-slate-900/80 text-slate-300 hover:text-white font-mono text-xs transition-all"
        >
          ← Trang Chủ Demo
        </Link>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Account Creation Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-purple-500/30 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-purple-500/20 border border-purple-400/40 text-purple-300 font-mono text-xs">
              <span>SCHOOL ADMIN</span>
              <span>•</span>
              <span>TẠO TÀI KHOẢN MỚI</span>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Tạo Tài Khoản Cho Giáo Viên / Học Sinh</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Nhà trường có quyền chủ động khởi tạo tài khoản cho Giảng Viên hoặc Học Sinh trong hệ thống.
              </p>
            </div>

            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-mono">
                ⚠️ {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Họ Và Tên Tài Khoản</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ví dụ: ThS. Nguyễn Văn Bình"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-400 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Địa Chỉ Email Đăng Nhập</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="gv.nguyenvanbinh@truong.edu.vn"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-400 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Vai Trò Tài Khoản</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-400 rounded-xl px-4 py-3 text-sm text-white focus:outline-none font-mono"
                >
                  <option value="instructor">👨‍🏫 Giảng Viên / Giáo Viên (Instructor)</option>
                  <option value="student">🎓 Học Sinh / Sinh Viên (Student)</option>
                  <option value="admin">🏫 Quản Trị Nhà Trường (School Admin)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-sm font-bold shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all hover:scale-[1.02]"
              >
                {loading ? 'Đang tạo...' : '🚀 Khởi Tạo Tài Khoản Ngay'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: List of Accounts */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Danh Sách Tài Khoản Đã Khởi Tạo</h3>
                <p className="font-mono text-xs text-slate-400">Tổng cộng: {users.length} tài khoản trong hệ thống</p>
              </div>
              <span className="px-3 py-1 rounded bg-purple-500/20 text-purple-300 font-mono text-xs border border-purple-500/30">
                FIRESTORE LIVE
              </span>
            </div>

            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-2">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + encodeURIComponent(u.displayName)}
                      alt={u.displayName}
                      className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-700 object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-white text-sm mb-0.5">{u.displayName}</h4>
                      <p className="font-mono text-xs text-slate-400">{u.email}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 font-mono text-xs">
                    {u.role === 'instructor' && (
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        👨‍🏫 GIẢNG VIÊN
                      </span>
                    )}
                    {u.role === 'student' && (
                      <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        🎓 HỌC SINH
                      </span>
                    )}
                    {u.role === 'admin' && (
                      <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                        🏫 NHÀ TRƯỜNG
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500">ID: {u.id}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>

    </div>
  );
}
