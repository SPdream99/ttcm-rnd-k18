"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  UserCheck,
  GraduationCap,
  Key,
  Eye,
  EyeOff,
  Trash2,
  ExternalLink,
  BookOpen,
  Gamepad2,
  Users,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  X,
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { useToast } from "@/components/Toast";
import {
  saveEncryptedAIKey,
  removeAIKey,
  hasAIKey,
  getMaskedAIKey,
} from "@/lib/secureKeyStorage";
import { cacheService } from "@/lib/cacheService";

export default function TeacherProfilePage() {
  const { toast } = useToast();
  const { currentUser, profile } = useAuthAdapter();
  const displayName = currentUser?.name || profile?.fullName || "Thầy/Cô Giáo Viên";
  const displayEmail = currentUser?.email || "teacher@eve.edu.vn";
  const userUid = currentUser?.uid || profile?.uid || "usr_teacher";

  const [keyInput, setKeyInput] = useState("");
  const [showRawKey, setShowRawKey] = useState(false);
  const [isKeyConfigured, setIsKeyConfigured] = useState(false);
  const [maskedKeyDisplay, setMaskedKeyDisplay] = useState("");

  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [isSending2FA, setIsSending2FA] = useState(false);
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [demoOtpHint, setDemoOtpHint] = useState<string | null>(null);

  const [stats, setStats] = useState({ courses: 0, games: 0, plays: 0 });
  const [confirmModal, setConfirmModal] = useState<{
    title: string;
    desc: string;
    confirmText?: string;
    onConfirm: () => void;
  } | null>(null);

  useEffect(() => {
    const configured = hasAIKey();
    setIsKeyConfigured(configured);
    if (configured) {
      setMaskedKeyDisplay(getMaskedAIKey());
    }

    if (currentUser?.twoFactorEnabled) {
      setIs2FAEnabled(true);
    }

    async function loadStats() {
      if (!userUid) return;
      try {
        const { getDocs, collection } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");
        
        let cCount = 0;
        const cSnap = await getDocs(collection(db, "courses"));
        cSnap.forEach((d) => {
          const data = d.data();
          const docAuthor = data.authorId || data.author_id || data.instructorId || data.instructor_id;
          if (docAuthor === userUid) cCount++;
        });

        let gCount = 0;
        let pCount = 0;
        const gSnap = await getDocs(collection(db, "game_info"));
        gSnap.forEach((d) => {
          const data = d.data();
          const docAuthor = data.authorId || data.author_id || data.uploaderId || data.uploader_id;
          if (docAuthor === userUid) {
            gCount++;
            pCount += Number(data.playsCount || data.plays_count || 0);
          }
        });

        setStats({ courses: cCount, games: gCount, plays: pCount });
      } catch {}
    }
    loadStats();
  }, [currentUser, userUid]);

  const handleSaveAIKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim()) return;
    saveEncryptedAIKey(keyInput.trim());
    setIsKeyConfigured(true);
    setMaskedKeyDisplay(getMaskedAIKey());
    setKeyInput("");
    toast.success("Đã lưu và kích hoạt Google Gemini API Key an toàn trên thiết bị của Thầy/Cô!", "API Key");
  };

  const handleRemoveAIKey = () => {
    setConfirmModal({
      title: "Xóa Khóa API Key",
      desc: "Thầy/Cô có chắc chắn muốn xóa khóa Google Gemini API khỏi trình duyệt này không? Tính năng Trợ Lý AI sẽ tạm ngưng cho đến khi nhập lại khóa mới.",
      confirmText: "Xác Nhận Xóa",
      onConfirm: () => {
        removeAIKey();
        setIsKeyConfigured(false);
        setMaskedKeyDisplay("");
        toast.info("Đã xóa khóa API.", "API Key");
        setConfirmModal(null);
      },
    });
  };

  const handleInitiate2FAToggle = async () => {
    if (is2FAEnabled) {
      setConfirmModal({
        title: "Tắt Xác Thực 2 Lớp (2FA)",
        desc: "Thầy/Cô có chắc chắn muốn tắt tính năng Bảo Mật 2 Lớp (2FA qua Email) không? Tài khoản sẽ giảm mức độ bảo vệ khi đăng nhập.",
        confirmText: "Tắt 2FA",
        onConfirm: async () => {
          setConfirmModal(null);
          setIsVerifying2FA(true);
          try {
            const res = await fetch("/api/auth/2fa/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: displayEmail,
                otp: "DISABLE_2FA",
                purpose: "disable",
              }),
            });
            const data = await res.json();
            if (data.success) {
              setIs2FAEnabled(false);
              toast.info("Đã tắt tính năng 2FA thành công.", "Bảo Mật");
            }
          } catch {
            toast.error("Lỗi khi tắt 2FA.", "Bảo Mật");
          } finally {
            setIsVerifying2FA(false);
          }
        },
      });
      return;
    }

    setIsSending2FA(true);
    setModalMsg("");
    try {
      const res = await fetch("/api/auth/2fa/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: displayEmail,
          recipientName: displayName,
          purpose: "enable",
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.isDemo && data.demoOtp) {
          setDemoOtpHint(data.demoOtp);
        }
        setShow2FAModal(true);
      } else {
        toast.error("Không thể gửi mã xác thực. Vui lòng thử lại sau.", "Bảo Mật");
      }
    } catch {
      toast.error("Lỗi kết nối khi gửi mã OTP.", "Bảo Mật");
    } finally {
      setIsSending2FA(false);
    }
  };

  const handleConfirmEnable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.length !== 6) {
      setModalMsg("Vui lòng nhập đủ 6 chữ số OTP.");
      return;
    }

    setIsVerifying2FA(true);
    setModalMsg("");
    try {
      const res = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: displayEmail,
          otp: otpInput,
          purpose: "enable",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIs2FAEnabled(true);
        setShow2FAModal(false);
        toast.success("Đã kích hoạt Bảo Mật 2 Lớp (2FA qua Email) thành công!", "Bảo Mật");
      } else {
        setModalMsg(data.error || "Mã OTP không chính xác.");
      }
    } catch {
      setModalMsg("Lỗi kết nối máy chủ.");
    } finally {
      setIsVerifying2FA(false);
    }
  };

  return (
    <div className="space-y-8 font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-zinc-200">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
            <UserCheck className="w-7 h-7 text-red-600" /> Hồ Sơ & Thiết Lập Giảng Dạy
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Quản lý tài khoản giáo viên, bảo mật 2FA và cài đặt khóa API.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-red-600" /> Giáo Viên Chính Thức
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-white border border-zinc-200 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-red-600 text-white flex items-center justify-center text-3xl font-bold font-mono shadow-sm">
          {displayName.charAt(0)}
        </div>

        <div className="text-center md:text-left space-y-2 flex-1">
          <h2 className="text-xl md:text-2xl font-bold text-zinc-900 flex items-center justify-center md:justify-start gap-2">
            {displayName} <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 font-bold">Đã Xác Minh</span>
          </h2>
          <p className="text-xs text-zinc-500">{displayEmail} • Giảng viên bộ môn Công Nghệ</p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs text-zinc-600 font-medium">
            <span><BookOpen className="w-3.5 h-3.5 inline mr-1 text-red-600" /> {stats.courses} Khóa Học Đã Tạo</span>
            <span><Gamepad2 className="w-3.5 h-3.5 inline mr-1 text-red-600" /> {stats.games} Minigames</span>
            <span><Users className="w-3.5 h-3.5 inline mr-1 text-red-600" /> {stats.plays} Lượt Học Sinh Chơi</span>
          </div>
        </div>
      </div>

      {/* CARD BẢO MẬT 2 LỚP */}
      <div className="p-6 md:p-8 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-red-600" /> Xác Thực 2 Bước (2FA Qua Email)
            </h3>
            <p className="text-xs text-zinc-500">
              Bảo vệ an toàn tài khoản: Mỗi khi đăng nhập, hệ thống sẽ gửi mã OTP 6 số vào email <strong>{displayEmail}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                is2FAEnabled
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-zinc-100 text-zinc-600 border border-zinc-200"
              }`}
            >
              {is2FAEnabled ? "2FA ĐANG BẬT" : "2FA ĐANG TẮT"}
            </span>

            <button
              type="button"
              disabled={isSending2FA || isVerifying2FA}
              onClick={handleInitiate2FAToggle}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
                is2FAEnabled
                  ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200"
                  : "bg-red-600 hover:bg-red-700 text-white shadow-sm"
              }`}
            >
              {isSending2FA || isVerifying2FA ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : is2FAEnabled ? (
                "Tắt 2FA"
              ) : (
                "Bật 2FA Ngay"
              )}
            </button>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-zinc-600 font-medium">
          <div>
            <span className="text-zinc-400 block mb-1">Phương thức:</span>
            <strong className="text-zinc-900">Email OTP (6 Chữ Số)</strong>
          </div>
          <div>
            <span className="text-zinc-400 block mb-1">Hộp thư nhận OTP:</span>
            <strong className="text-red-600">{displayEmail}</strong>
          </div>
          <div>
            <span className="text-zinc-400 block mb-1">Thời hạn mã:</span>
            <strong className="text-zinc-900">5 Phút / Lần gửi</strong>
          </div>
        </div>
      </div>

      {/* 2FA MODAL */}
      {show2FAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white border-2 border-red-600 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-4 text-center relative">
            <button
              onClick={() => setShow2FAModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-xl font-bold">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-zinc-900">Xác Nhận Bật 2FA Email</h3>
              <p className="text-xs text-zinc-500">
                Nhập mã OTP 6 số được gửi tới <strong>{displayEmail}</strong>.
              </p>
            </div>

            {demoOtpHint && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center justify-between">
                <span>Mã OTP: <strong>{demoOtpHint}</strong></span>
                <button
                  type="button"
                  onClick={() => setOtpInput(demoOtpHint)}
                  className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-bold"
                >
                  Điền nhanh 
                </button>
              </div>
            )}

            <form onSubmit={handleConfirmEnable2FA} className="space-y-4">
              <input
                type="text"
                maxLength={6}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                placeholder="••••••"
                className="w-full text-center font-mono text-2xl tracking-[8px] bg-zinc-50 border-2 border-zinc-300 focus:border-red-600 rounded-xl py-2.5 text-zinc-900 focus:outline-none font-bold"
                required
                autoFocus
              />

              {modalMsg && (
                <div className="text-xs font-bold text-red-600">{modalMsg}</div>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShow2FAModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isVerifying2FA || otpInput.length !== 6}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  {isVerifying2FA ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Xác Nhận Kích Hoạt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CARD QUẢN LÝ AI KEY */}
      <div className="p-6 md:p-8 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-100">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <Key className="w-5 h-5 text-red-600" /> Khóa Google Gemini API Key
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              Khóa API được lưu cục bộ trên trình duyệt để sử dụng trong Trợ Giảng Soạn Bài.
            </p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
              isKeyConfigured
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-zinc-100 text-zinc-600 border border-zinc-200"
            }`}
          >
            {isKeyConfigured ? "Đã Kích Hoạt Key" : "Chưa Cấu Hình Key"}
          </span>
        </div>

        {/* Device-only Storage Notice */}
        <div className="p-3.5 rounded-xl bg-red-50/70 border border-red-200 text-xs text-zinc-700 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-red-700">Lưu ý bảo mật thiết bị:</strong> Khóa Google Gemini API Key của Thầy/Cô được <strong>mã hóa an toàn và chỉ lưu cục bộ trên trình duyệt thiết bị này</strong> (Local Storage). Hệ thống <strong>hoàn toàn không lưu trữ hay gửi API Key</strong> lên máy chủ backend.
          </div>
        </div>

        {isKeyConfigured ? (
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs text-zinc-500 block">Khóa API hiện tại:</span>
              <span className="font-mono text-sm text-zinc-900 font-bold">{maskedKeyDisplay}</span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/teacher/ai-tutor"
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <span>Mở Trợ Giảng</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={handleRemoveAIKey}
                className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 border border-zinc-200"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-600" /> Xóa
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveAIKey} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Nhập Google Gemini API Key:
              </label>
              <div className="relative flex items-center">
                <input
                  type={showRawKey ? "text" : "password"}
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="Dán mã API Key của Thầy/Cô (VD: AIzaSy...)"
                  className="w-full bg-zinc-50 border border-zinc-300 focus:border-red-600 rounded-xl px-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowRawKey(!showRawKey)}
                  className="absolute right-3 text-zinc-400 hover:text-zinc-900"
                >
                  {showRawKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!keyInput.trim()}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <Key className="w-3.5 h-3.5" /> Lưu Khóa API
            </button>
          </form>
        )}
      </div>

      {/* Cache & Local Storage Management */}
      <div className="p-6 rounded-2xl bg-white border border-zinc-200 space-y-3 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-zinc-900 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-red-600" /> Quản Lý Bộ Nhớ Đệm (Cache)
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              Xóa sạch các bản lưu cache học liệu và danh sách game để tải lại dữ liệu mới nhất từ máy chủ.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              cacheService.clearFullAppCache(true);
              toast.success("Đã dọn dẹp bộ nhớ đệm cache và làm mới dữ liệu thành công!", "Xóa Cache");
            }}
            className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-red-50 text-zinc-700 hover:text-red-700 border border-zinc-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4 text-red-600" /> Xóa Cache Ngay
          </button>
        </div>
      </div>

      {/* MODAL XÁC NHẬN HÀNH ĐỘNG */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-md rounded-2xl bg-white border-2 border-red-600 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <h3 className="text-base font-bold text-zinc-900">{confirmModal.title}</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">{confirmModal.desc}</p>
            <div className="flex justify-end gap-2.5 pt-3 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold transition cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition cursor-pointer shadow-sm"
              >
                {confirmModal.confirmText || "Xác Nhận"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
