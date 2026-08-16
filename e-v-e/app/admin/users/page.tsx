"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Search,
  Filter,
  CheckCircle,
  Clock,
  ShieldAlert,
  GraduationCap,
  HelpCircle,
  CheckCircle2,
  X,
} from "lucide-react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/components/Toast";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { formatDisplayDate } from "@/lib/dateUtils";

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
  const { toast } = useToast();
  const { currentUser, profile } = useAuthAdapter();
  const currentAdminUid = currentUser?.uid || currentUser?.id || profile?.uid || profile?.id || "";
  const currentAdminEmail = currentUser?.email || profile?.email || "";

  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | "pending" | "teacher" | "student">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [confirmPrompt, setConfirmPrompt] = useState<ConfirmModalData | null>(null);

  /** Kiểm tra user có phải admin không */
  const isAdminUser = (user: AdminUserItem) =>
    user.role === "admin" || user.role === "school";

  /** Kiểm tra user có phải chính admin đang đăng nhập không */
  const isSelf = (user: AdminUserItem) =>
    (currentAdminUid && (user.id === currentAdminUid || user.uid === currentAdminUid)) ||
    (currentAdminEmail && user.email.toLowerCase() === currentAdminEmail.toLowerCase());

  useEffect(() => {
    async function fetchUsers() {
      let list: AdminUserItem[] = [];
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        if (data.success && Array.isArray(data.users)) {
          list = data.users;
          if (data.deletedOrphanCount > 0) {
            console.log(`[Auto-Sync] Đã tự động dọn dẹp ${data.deletedOrphanCount} tài khoản mồ côi không tồn tại trong Authentication.`);
          }
        }
      } catch (err) {
        console.warn("API /api/admin/users fetch warning, falling back to Firestore client:", err);
      }

      if (list.length === 0) {
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
                createdAt: formatDisplayDate(data.createdAt || data.created_at, "2026"),
              };
            });
          }
        } catch (err) {
          console.warn("Error fetching real users:", err);
        }
      }

      setUsers(list);
      setLoading(false);
    }
    fetchUsers();
  }, []);

  const handlePromptUpdateStatus = (user: AdminUserItem, newStatus: "active" | "banned") => {
    // Bảo vệ: Admin không được khóa chính mình
    if (newStatus === "banned" && isSelf(user)) {
      toast("Không thể khóa tài khoản của chính bạn.", "error");
      return;
    }
    // Bảo vệ: Admin không được khóa admin khác
    if (newStatus === "banned" && isAdminUser(user)) {
      toast("Không thể khóa tài khoản quản trị viên khác.", "error");
      return;
    }

    const actionText = newStatus === "active" ? "phê duyệt / mở khóa" : "từ chối / khóa";
    setConfirmPrompt({
      title: `Xác Nhận ${newStatus === "active" ? "Duyệt" : "Khóa"} Tài Khoản`,
      description: `Bạn có chắc chắn muốn ${actionText} tài khoản "${user.name}" (${user.email}) không?`,
      confirmText: newStatus === "active" ? "Xác Nhận Duyệt" : "Xác Nhận Khóa",
      variant: newStatus === "active" ? "emerald" : "rose",
      onConfirm: () => {
        setConfirmPrompt(null);
        executeUpdateStatus(user, newStatus);
      },
    });
  };

  const executeUpdateStatus = async (user: AdminUserItem, newStatus: "active" | "banned") => {
    try {
      if (user.id) {
        try {
          await updateDoc(doc(db, "users", user.id), {
            status: newStatus,
            isAccepted: newStatus === "active",
            is_accepted: newStatus === "active",
          });
        } catch {}
      }

      if (typeof window !== "undefined") {
        const localList = JSON.parse(localStorage.getItem("eve_registered_users") || "[]");
        const updated = localList.map((lu: any) => {
          if (lu.email === user.email || (user.uid && lu.uid === user.uid)) {
            return {
              ...lu,
              status: newStatus,
              isAccepted: newStatus === "active",
              is_accepted: newStatus === "active",
            };
          }
          return lu;
        });
        localStorage.setItem("eve_registered_users", JSON.stringify(updated));

        const sessionUser = JSON.parse(localStorage.getItem("eve_user") || "null");
        if (sessionUser && (sessionUser.email === user.email || sessionUser.uid === user.uid)) {
          sessionUser.status = newStatus;
          sessionUser.isAccepted = newStatus === "active";
          sessionUser.is_accepted = newStatus === "active";
          localStorage.setItem("eve_user", JSON.stringify(sessionUser));
        }
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
      );

      toast.success(`Đã cập nhật trạng thái của [${user.name}] thành ${newStatus.toUpperCase()}`, "Quản Lý Người Dùng");
    } catch {
      toast.error("Lỗi khi cập nhật trạng thái người dùng.", "Quản Lý Người Dùng");
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesFilter =
      activeFilter === "all"
        ? true
        : activeFilter === "pending"
        ? u.status === "pending"
        : activeFilter === "teacher"
        ? u.role === "teacher"
        : u.role === "student";

    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const pendingCount = users.filter((u) => u.status === "pending").length;

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-zinc-200">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-red-600" /> Quản Lý Người Dùng & Phê Duyệt Giáo Viên
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Kiểm duyệt hồ sơ đăng ký giảng viên và điều hành tài khoản học sinh.
          </p>
        </div>

        {pendingCount > 0 && (
          <div className="px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
            <Clock className="w-4 h-4 text-red-600" /> Có {pendingCount} giáo viên đang chờ duyệt
          </div>
        )}
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
              activeFilter === "all"
                ? "bg-red-600 text-white border-red-600 shadow-sm"
                : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
            }`}
          >
            Tất cả ({users.length})
          </button>
          <button
            onClick={() => setActiveFilter("pending")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 border ${
              activeFilter === "pending"
                ? "bg-red-600 text-white border-red-600 shadow-sm"
                : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> Chờ Phê Duyệt ({pendingCount})
          </button>
          <button
            onClick={() => setActiveFilter("teacher")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 border ${
              activeFilter === "teacher"
                ? "bg-red-600 text-white border-red-600 shadow-sm"
                : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" /> Giáo Viên
          </button>
          <button
            onClick={() => setActiveFilter("student")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
              activeFilter === "student"
                ? "bg-red-600 text-white border-red-600 shadow-sm"
                : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
            }`}
          >
            Học Sinh
          </button>
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên hoặc email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-zinc-300 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-red-600 transition-colors shadow-sm"
          />
        </div>
      </div>

      {/* Users Table Card */}
      <div className="rounded-2xl bg-white border border-zinc-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 uppercase text-[11px] font-bold">
              <tr>
                <th className="px-6 py-4">Thành Viên</th>
                <th className="px-6 py-4">Vai Trò</th>
                <th className="px-6 py-4">Trạng Thái</th>
                <th className="px-6 py-4">Bộ Môn / Coins</th>
                <th className="px-6 py-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-zinc-500 font-medium">
                    Không tìm thấy thành viên nào khớp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-50 transition-colors">
                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-zinc-900 text-sm">{user.name}</div>
                      <div className="text-[11px] text-zinc-500">{user.email}</div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                          user.role === "teacher"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : user.role === "admin"
                            ? "bg-zinc-900 text-white border-zinc-900"
                            : "bg-zinc-100 text-zinc-700 border-zinc-200"
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
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : user.status === "active"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-zinc-100 text-zinc-600 border-zinc-200"
                        }`}
                      >
                        {user.status === "pending" && <Clock className="w-3 h-3 text-amber-600" />}
                        {user.status === "active" && <CheckCircle className="w-3 h-3 text-red-600" />}
                        {user.status === "banned" && <ShieldAlert className="w-3 h-3 text-zinc-500" />}
                        {user.status === "pending"
                          ? "Chờ phê duyệt"
                          : user.status === "active"
                          ? "Đang hoạt động"
                          : "Đã bị khóa"}
                      </span>
                    </td>

                    {/* Extra details */}
                    <td className="px-6 py-4 text-zinc-600 font-medium">
                      {user.role === "teacher"
                        ? user.departmentOrClass || "Chưa cập nhật"
                        : `${user.coins ?? 0} Coins`}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Admin / chính mình: không hiển thị nút khóa */}
                        {(isAdminUser(user) || isSelf(user)) ? (
                          <span className="text-[11px] text-zinc-400 italic">
                            {isSelf(user) ? "Tài khoản của bạn" : "Quản trị viên"}
                          </span>
                        ) : user.status === "pending" ? (
                          <>
                            <button
                              onClick={() => handlePromptUpdateStatus(user, "active")}
                              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
                            >
                              <UserCheck className="w-3.5 h-3.5" /> Duyệt Ngay
                            </button>
                            <button
                              onClick={() => handlePromptUpdateStatus(user, "banned")}
                              className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <UserX className="w-3.5 h-3.5" /> Từ Chối
                            </button>
                          </>
                        ) : user.status === "active" ? (
                          <button
                            onClick={() => handlePromptUpdateStatus(user, "banned")}
                            className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-red-50 text-zinc-700 hover:text-red-700 border border-zinc-200 text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            Khóa tài khoản
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePromptUpdateStatus(user, "active")}
                            className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold transition-colors cursor-pointer shadow-sm"
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

      {/* CONFIRMATION PROMPT MODAL */}
      {confirmPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 font-sans">
          <div className="bg-white border-2 border-red-600 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-4 text-center relative">
            <button
              type="button"
              onClick={() => setConfirmPrompt(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto text-xl font-bold">
              <HelpCircle className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-zinc-900">
                {confirmPrompt.title}
              </h3>
              <p className="text-xs text-zinc-500">
                {confirmPrompt.description}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmPrompt(null)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={confirmPrompt.onConfirm}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white shadow-sm"
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
