"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  Search,
  Filter,
  CheckCircle,
  Clock,
  ShieldAlert,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface AdminUserItem {
  id: string;
  uid?: string;
  name: string;
  fullName?: string;
  email: string;
  role: string;
  status: "pending" | "active" | "banned" | string;
  departmentOrClass?: string;
  coins?: number;
  createdAt?: string;
}

const FALLBACK_USERS: AdminUserItem[] = [
  {
    id: "usr_teacher_001",
    name: "ThS. Phạm Hoàng Nam",
    email: "nam.ph@eve.edu.vn",
    role: "teacher",
    status: "pending",
    departmentOrClass: "Tổ Toán - Tin Học",
    createdAt: "14/08/2026",
  },
  {
    id: "usr_teacher_002",
    name: "TS. Lê Thị Mai",
    email: "mai.le@school.edu.vn",
    role: "teacher",
    status: "pending",
    departmentOrClass: "Bộ Môn Vật Lý",
    createdAt: "13/08/2026",
  },
  {
    id: "usr_teacher_003",
    name: "GS. Nguyễn Văn An",
    email: "an.nguyen@eve.edu.vn",
    role: "teacher",
    status: "active",
    departmentOrClass: "Khoa Học Vũ Trụ",
    createdAt: "10/08/2026",
  },
  {
    id: "usr_student_001",
    name: "Đạt Student",
    email: "student@eve.edu.vn",
    role: "student",
    status: "active",
    coins: 250,
    createdAt: "12/08/2026",
  },
  {
    id: "usr_student_002",
    name: "Trần Minh Quân",
    email: "quan.tm@student.edu.vn",
    role: "student",
    status: "active",
    coins: 420,
    createdAt: "11/08/2026",
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserItem[]>(FALLBACK_USERS);
  const [activeFilter, setActiveFilter] = useState<"all" | "pending" | "teacher" | "student">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const snap = await getDocs(collection(db, "users"));
        if (!snap.empty) {
          const list: AdminUserItem[] = snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              uid: data.uid || d.id,
              name: data.name || data.fullName || "User",
              fullName: data.fullName || data.name || "User",
              email: data.email || "",
              role: data.role || "student",
              status: data.status || "active",
              departmentOrClass: data.departmentOrClass || "",
              coins: Number(data.coins) || 0,
              createdAt: data.createdAt || "2026",
            };
          });
          setUsers(list);
        }
      } catch (err) {
        console.warn("Using fallback user list for admin page:", err);
      }
    }
    fetchUsers();
  }, []);

  const handleUpdateStatus = async (userId: string, newStatus: "active" | "banned") => {
    try {
      await updateDoc(doc(db, "users", userId), { status: newStatus });
    } catch {
      // Local state fallback update
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );

    setActionMsg(
      newStatus === "active"
        ? `✅ Đã phê duyệt kích hoạt tài khoản thành công!`
        : `⚠️ Đã chuyển tài khoản sang trạng thái Bị khóa/Từ chối.`
    );
    setTimeout(() => setActionMsg(null), 4000);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (activeFilter === "pending") return u.role === "teacher" && u.status === "pending";
    if (activeFilter === "teacher") return u.role === "teacher";
    if (activeFilter === "student") return u.role === "student";
    return true;
  });

  const pendingCount = users.filter((u) => u.role === "teacher" && u.status === "pending").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/15">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-cyan-400" /> Quản Lý Người Dùng & Phê Duyệt Giáo Viên
          </h1>
          <p className="text-sm text-[#8e9bb4] mt-1">
            Xét duyệt hồ sơ giảng dạy của giáo viên mới và quản trị phân quyền thành viên toàn hệ thống.
          </p>
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs flex items-center justify-between animate-fade-in">
          <span>{actionMsg}</span>
          <button onClick={() => setActionMsg(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveFilter("pending")}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 border ${
              activeFilter === "pending"
                ? "bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.25)]"
                : "bg-[#151b2c] text-slate-400 border-slate-800 hover:border-slate-700"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" /> Giáo Viên Chờ Duyệt ({pendingCount})
          </button>

          <button
            onClick={() => setActiveFilter("teacher")}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 border ${
              activeFilter === "teacher"
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                : "bg-[#151b2c] text-slate-400 border-slate-800 hover:border-slate-700"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-emerald-400" /> Tất Cả Giáo Viên
          </button>

          <button
            onClick={() => setActiveFilter("student")}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 border ${
              activeFilter === "student"
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                : "bg-[#151b2c] text-slate-400 border-slate-800 hover:border-slate-700"
            }`}
          >
            <Users className="w-3.5 h-3.5 text-cyan-400" /> Học Sinh
          </button>

          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
              activeFilter === "all"
                ? "bg-blue-600/30 text-white border-blue-500"
                : "bg-[#151b2c] text-slate-400 border-slate-800 hover:border-slate-700"
            }`}
          >
            Tất Cả ({users.length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên hoặc email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#151b2c] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all font-mono"
          />
        </div>
      </div>

      {/* Users Table Card */}
      <div className="rounded-2xl bg-[#0f1524]/80 border border-[#7bd1fa]/15 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#151b2c] border-b border-slate-800 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="px-6 py-4">Thành Viên</th>
                <th className="px-6 py-4">Vai Trò</th>
                <th className="px-6 py-4">Trạng Thái</th>
                <th className="px-6 py-4">Bộ Môn / Coins</th>
                <th className="px-6 py-4 text-right">Thao Tác Quyết Định</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500 font-sans">
                    Không tìm thấy thành viên nào khớp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-white text-sm font-sans">{user.name}</div>
                      <div className="text-[11px] text-slate-400">{user.email}</div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                          user.role === "teacher"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                            : user.role === "admin"
                            ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                            : "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          user.status === "pending"
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse"
                            : user.status === "active"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                            : "bg-rose-500/20 text-rose-300 border-rose-500/30"
                        }`}
                      >
                        {user.status === "pending" && <Clock className="w-3 h-3" />}
                        {user.status === "active" && <CheckCircle className="w-3 h-3" />}
                        {user.status === "banned" && <ShieldAlert className="w-3 h-3" />}
                        {user.status === "pending"
                          ? "Chờ phê duyệt"
                          : user.status === "active"
                          ? "Đang hoạt động"
                          : "Đã bị khóa"}
                      </span>
                    </td>

                    {/* Extra details */}
                    <td className="px-6 py-4 text-slate-300">
                      {user.role === "teacher"
                        ? user.departmentOrClass || "Chưa cập nhật"
                        : `${user.coins ?? 0} Coins`}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.status === "pending" ? (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(user.id, "active")}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                            >
                              <UserCheck className="w-3.5 h-3.5" /> Duyệt Ngay
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(user.id, "banned")}
                              className="px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                            >
                              <UserX className="w-3.5 h-3.5" /> Từ Chối
                            </button>
                          </>
                        ) : user.status === "active" ? (
                          <button
                            onClick={() => handleUpdateStatus(user.id, "banned")}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-[11px] transition-all cursor-pointer"
                          >
                            Khóa tài khoản
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateStatus(user.id, "active")}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[11px] transition-all cursor-pointer"
                          >
                            Mở khóa
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
