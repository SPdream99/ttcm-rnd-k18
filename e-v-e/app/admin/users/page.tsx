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
  HelpCircle,
  CheckCircle2,
  X,
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

interface ConfirmModalData {
  title: string;
  description: string;
  confirmText?: string;
  variant?: "emerald" | "rose" | "cyan";
  onConfirm: () => void;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | "pending" | "teacher" | "student">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Confirmation Modal State ──
  const [confirmPrompt, setConfirmPrompt] = useState<ConfirmModalData | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      let list: AdminUserItem[] = [];
      try {
        const snap = await getDocs(collection(db, "users"));
        if (!snap.empty) {
          list = snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              uid: data.uid || d.id,
              name: data.name || data.fullName || "User",
              fullName: data.fullName || data.name || "User",
              email: data.email || "",
              role: data.role || "student",
              status: data.status || "active",
              departmentOrClass: data.departmentOrClass || (data.schoolCode ? `Mã trường: ${data.schoolCode}` : ""),
              coins: Number(data.coins) || 0,
              createdAt: data.createdAt || "2026",
            };
          });
        }
      } catch (err) {
        console.warn("Error fetching real users:", err);
      }

      // Merge with localStorage registered users
      try {
        if (typeof window !== "undefined") {
          const localList = JSON.parse(localStorage.getItem("eve_registered_users") || "[]");
          localList.forEach((lu: any) => {
            const idx = list.findIndex((u) => u.email === lu.email || (lu.uid && u.uid === lu.uid));
            if (idx === -1) {
              list.push({
                id: lu.id || lu.uid || `usr_${Date.now()}`,
                uid: lu.uid || lu.id,
                name: lu.name || lu.fullName || "Giáo viên mới",
                fullName: lu.fullName || lu.name || "Giáo viên mới",
                email: lu.email,
                role: lu.role || "teacher",
                status: lu.status || "pending",
                departmentOrClass: lu.departmentOrClass || (lu.schoolCode ? `Mã trường: ${lu.schoolCode}` : ""),
                coins: Number(lu.coins) || 0,
                createdAt: lu.createdAt || "Hôm nay",
              });
            } else {
              list[idx] = { ...list[idx], ...lu };
            }
          });
        }
      } catch {}

      setUsers(list);
      setLoading(false);
    }
    fetchUsers();
  }, []);

  const handlePromptUpdateStatus = (user: AdminUserItem, newStatus: "active" | "banned") => {
    const isApprove = newStatus === "active";
    const userName = user.name || user.fullName || user.email;

    setConfirmPrompt({
      title: isApprove
        ? (user.status === "banned" ? "Xác Nhận Mở Khóa Tài Khoản" : "Xác Nhận Phê Duyệt Giáo Viên")
        : (user.status === "pending" ? "Xác Nhận Từ Chối Phê Duyệt" : "Xác Nhận Khóa Tài Khoản"),
      description: isApprove
        ? `Bạn có chắc chắn muốn ${user.status === "banned" ? "MỞ KHÓA" : "PHÊ DUYỆT"} tài khoản "${userName}" (${user.email}) không?`
        : `Bạn có chắc chắn muốn ${user.status === "pending" ? "TỪ CHỐI DUYỆT" : "KHÓA QUYỀN TRUY CẬP"} của tài khoản "${userName}" (${user.email}) không?`,
      confirmText: isApprove ? "Xác Nhận Duyệt / Mở Khóa" : "Xác Nhận Khóa / Từ Chối",
      variant: isApprove ? "emerald" : "rose",
      onConfirm: () => executeUpdateStatus(user.id, newStatus),
    });
  };

  const executeUpdateStatus = async (userId: string, newStatus: "active" | "banned") => {
    setConfirmPrompt(null);
    try {
      await updateDoc(doc(db, "users", userId), { status: newStatus });
    } catch {
      // Local state fallback update
    }

    if (typeof window !== "undefined") {
      try {
        const localList = JSON.parse(localStorage.getItem("eve_registered_users") || "[]");
        const idx = localList.findIndex((u: any) => u.id === userId || u.uid === userId);
        if (idx >= 0) {
          localList[idx].status = newStatus;
          localStorage.setItem("eve_registered_users", JSON.stringify(localList));
        }

        const sessionUser = JSON.parse(localStorage.getItem("eve_user") || "null");
        if (sessionUser && (sessionUser.id === userId || sessionUser.uid === userId)) {
          sessionUser.status = newStatus;
          localStorage.setItem("eve_user", JSON.stringify(sessionUser));
        }
      } catch {}
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === userId || u.uid === userId ? { ...u, status: newStatus } : u))
    );

    setActionMsg(
      newStatus === "active"
        ? `✅ Đã phê duyệt / mở khóa tài khoản thành công!`
        : `⚠️ Đã chuyển tài khoản sang trạng thái Bị khóa / Từ chối.`
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
    <div className="space-y-6 animate-fade-in font-sans pb-12">
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
          <button onClick={() => setActionMsg(null)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Role Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0f1524] border border-[#7bd1fa]/15 self-stretch sm:self-auto overflow-x-auto">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeFilter === "all"
                ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Tất Cả ({users.length})
          </button>

          <button
            onClick={() => setActiveFilter("pending")}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeFilter === "pending"
                ? "bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" /> Giáo Viên Chờ Duyệt ({pendingCount})
          </button>

          <button
            onClick={() => setActiveFilter("teacher")}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeFilter === "teacher"
                ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Giáo Viên
          </button>

          <button
            onClick={() => setActiveFilter("student")}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeFilter === "student"
                ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Học Sinh
          </button>
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
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
                              onClick={() => handlePromptUpdateStatus(user, "active")}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                            >
                              <UserCheck className="w-3.5 h-3.5" /> Duyệt Ngay
                            </button>
                            <button
                              onClick={() => handlePromptUpdateStatus(user, "banned")}
                              className="px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                            >
                              <UserX className="w-3.5 h-3.5" /> Từ Chối
                            </button>
                          </>
                        ) : user.status === "active" ? (
                          <button
                            onClick={() => handlePromptUpdateStatus(user, "banned")}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-[11px] transition-all cursor-pointer"
                          >
                            Khóa tài khoản
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePromptUpdateStatus(user, "active")}
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

      {/* ── CONFIRMATION PROMPT MODAL ── */}
      {confirmPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in font-sans">
          <div className="bg-[#0f1524] border border-[#7bd1fa]/30 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-5 text-center relative">
            <button
              type="button"
              onClick={() => setConfirmPrompt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto text-xl ${
              confirmPrompt.variant === "emerald"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
            }`}>
              <HelpCircle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white tracking-tight">
                {confirmPrompt.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {confirmPrompt.description}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmPrompt(null)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold transition-all cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={confirmPrompt.onConfirm}
                className={`flex-1 py-3 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  confirmPrompt.variant === "emerald"
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    : "bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {confirmPrompt.confirmText || "Xác Nhận"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
