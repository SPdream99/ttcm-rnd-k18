"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  UserCheck,
  GraduationCap,
  Award,
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
  ShieldAlert,
  RefreshCw,
  X,
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import {
  saveEncryptedAIKey,
  getDecryptedAIKey,
  removeAIKey,
  hasAIKey,
  getMaskedAIKey,
} from "@/lib/secureKeyStorage";

export default function TeacherProfilePage() {
  const { currentUser, profile } = useAuthAdapter();
  const displayName = currentUser?.name || profile?.fullName || "Thầy/Cô Giáo Viên";
  const displayEmail = currentUser?.email || "teacher@eve.edu.vn";
  const userUid = currentUser?.uid || profile?.uid || "usr_teacher";

  const [savedMsg, setSavedMsg] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [showRawKey, setShowRawKey] = useState(false);
  const [isKeyConfigured, setIsKeyConfigured] = useState(false);
  const [maskedKeyDisplay, setMaskedKeyDisplay] = useState("");

  // ── 2FA Security State ──
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [isSending2FA, setIsSending2FA] = useState(false);
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [demoOtpHint, setDemoOtpHint] = useState<string | null>(null);

  // ── Stats ──
  const [stats, setStats] = useState({ courses: 0, games: 0, plays: 0 });

  useEffect(() => {
    const configured = hasAIKey();
    setIsKeyConfigured(configured);
    if (configured) {
      setMaskedKeyDisplay(getMaskedAIKey());
    }

    if (currentUser?.twoFactorEnabled) {
      setIs2FAEnabled(true);
    }

    // Fetch dynamic stats for current teacher
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
    setShowRawKey(false);
    setSavedMsg("🔑 Đã mã hóa và lưu trữ Google Gemini API Key an toàn trên trình duyệt của Thầy/Cô!");
    setTimeout(() => setSavedMsg(""), 4000);
  };

  const handleRemoveAIKey = () => {
    removeAIKey();
    setIsKeyConfigured(false);
    setMaskedKeyDisplay("");
    setKeyInput("");
    setSavedMsg("🗑️ Đã xóa API Key khỏi bộ nhớ trình duyệt.");
    setTimeout(() => setSavedMsg(""), 3000);
  };

  // ── 2FA Toggle Handlers ──
  const handleInitiate2FAToggle = async () => {
    if (is2FAEnabled) {
      setIsVerifying2FA(true);
      try {
        const res = await fetch("/api/auth/2fa/toggle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userUid,
            email: displayEmail,
            enabled: false,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setIs2FAEnabled(false);
          setSavedMsg("⚠️ Đã tắt Xác Thực 2 Bước (2FA).");
          setTimeout(() => setSavedMsg(""), 4000);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsVerifying2FA(false);
      }
    } else {
      setIsSending2FA(true);
      setShow2FAModal(true);
      setModalMsg("Đang gửi mã xác thực tới email của Thầy/Cô...");
      setOtpInput("");
      setDemoOtpHint(null);

      try {
        const res = await fetch("/api/auth/2fa/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: displayEmail,
            recipientName: displayName,
            purpose: "enable_2fa",
          }),
        });
        const data = await res.json();
        if (data.success) {
          setModalMsg(`Mã OTP 6 số đã được gửi tới email ${data.maskedEmail || displayEmail}.`);
          if (data.isDemo && data.demoOtp) {
            setDemoOtpHint(data.demoOtp);
          }
        } else {
          setModalMsg(data.error || "Không thể gửi mã OTP.");
        }
      } catch {
        setModalMsg("Lỗi kết nối máy chủ.");
      } finally {
        setIsSending2FA(false);
      }
    }
  };

  const handleConfirmEnable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.trim().length !== 6) {
      setModalMsg("Vui lòng nhập đầy đủ 6 chữ số mã OTP.");
      return;
    }

    setIsVerifying2FA(true);
    setModalMsg("");

    try {
      const res = await fetch("/api/auth/2fa/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userUid,
          email: displayEmail,
          enabled: true,
          otp: otpInput.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIs2FAEnabled(true);
        setShow2FAModal(false);
        setSavedMsg("🛡️ Đã kích hoạt Bảo Mật 2 Lớp (2FA qua Email) thành công cho tài khoản Giảng viên!");
        setTimeout(() => setSavedMsg(""), 5000);
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
    <div className="space-y-8 animate-fade-in font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/15">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <UserCheck className="w-7 h-7 text-emerald-400" /> Hồ Sơ & Thiết Lập Giảng Dạy
          </h1>
          <p className="text-sm text-[#8e9bb4] mt-1">
            Quản lý tài khoản giáo viên, bảo mật 2FA, chỉ số đóng góp và mã hóa khóa AI cá nhân.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold flex items-center gap-2">
          <GraduationCap className="w-4 h-4" /> Giáo Viên Chính Thức
        </div>
      </div>

      {savedMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs flex items-center justify-between animate-fade-in">
          <span>{savedMsg}</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#0f1524]/90 border border-emerald-500/20 shadow-xl flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-3xl font-bold text-emerald-400 font-mono">
          {displayName.charAt(0)}
        </div>

        <div className="text-center md:text-left space-y-2 flex-1">
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
            {displayName} <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">Đã Xác Minh</span>
          </h2>
          <p className="text-xs text-[#8e9bb4] font-mono">{displayEmail} • Giảng viên bộ môn Công Nghệ</p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs font-mono text-slate-300">
            <span><BookOpen className="w-3.5 h-3.5 inline mr-1 text-cyan-400" /> {stats.courses} Khóa Học Đã Tạo</span>
            <span><Gamepad2 className="w-3.5 h-3.5 inline mr-1 text-emerald-400" /> {stats.games} Minigames</span>
            <span><Users className="w-3.5 h-3.5 inline mr-1 text-amber-400" /> {stats.plays} Lượt Học Sinh Chơi</span>
          </div>
        </div>
      </div>

      {/* ── CARD BẢO MẬT 2 LỚP (2FA QUA EMAIL) ── */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#0f1524] to-[#151b2c] border border-emerald-500/30 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> Xác Thực 2 Bước (2FA Qua Email)
            </h3>
            <p className="text-xs text-[#8e9bb4]">
              Bảo vệ an toàn tài khoản Giáo viên & ngân hàng đề thi: Mỗi khi đăng nhập, hệ thống sẽ gửi mã OTP 6 số vào email <strong className="text-emerald-300">{displayEmail}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                is2FAEnabled
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}
            >
              {is2FAEnabled ? "🛡️ 2FA ĐANG BẬT" : "⚠️ 2FA ĐANG TẮT"}
            </span>

            <button
              type="button"
              disabled={isSending2FA || isVerifying2FA}
              onClick={handleInitiate2FAToggle}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
                is2FAEnabled
                  ? "bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30"
                  : "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]"
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

        <div className="p-4 rounded-2xl bg-[#0a0e1a]/80 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-slate-300">
          <div>
            <span className="text-slate-500 block mb-1">Phương thức:</span>
            <strong className="text-white">Email OTP (6 Chữ Số)</strong>
          </div>
          <div>
            <span className="text-slate-500 block mb-1">Hộp thư nhận OTP:</span>
            <strong className="text-emerald-300">{displayEmail}</strong>
          </div>
          <div>
            <span className="text-slate-500 block mb-1">Thời hạn mã:</span>
            <strong className="text-amber-300">5 Phút / Lần gửi</strong>
          </div>
        </div>
      </div>

      {/* ── 2FA ACTIVATION MODAL ── */}
      {show2FAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0f1524] border border-emerald-500/40 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-5 text-center relative">
            <button
              onClick={() => setShow2FAModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto text-xl font-bold">
              🛡️
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Xác Nhận Bật 2FA Email</h3>
              <p className="text-xs text-slate-300">
                Nhập mã OTP 6 số được gửi tới <strong className="text-emerald-300">{displayEmail}</strong> để xác nhận.
              </p>
            </div>

            {demoOtpHint && (
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 font-mono flex items-center justify-between">
                <span>Mã OTP: <strong>{demoOtpHint}</strong></span>
                <button
                  type="button"
                  onClick={() => setOtpInput(demoOtpHint)}
                  className="px-2 py-0.5 rounded bg-amber-500/20 text-[10px]"
                >
                  Điền nhanh ⚡
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
                className="w-full text-center font-mono text-2xl tracking-[8px] bg-[#151b2c] border-2 border-emerald-500/40 focus:border-emerald-400 rounded-xl py-3 text-white focus:outline-none"
                required
                autoFocus
              />

              {modalMsg && (
                <div className="text-xs font-mono text-emerald-300">{modalMsg}</div>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShow2FAModal(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold transition-all cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isVerifying2FA || otpInput.length !== 6}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-mono text-xs font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isVerifying2FA ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Xác Nhận Kích Hoạt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CARD QUẢN LÝ MÃ HÓA AI KEY ── */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#0f1524] to-[#151b2c] border border-emerald-500/30 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-emerald-400" /> Khóa Trí Tuệ Nhân Tạo (Gemini / OpenAI API Key)
            </h3>
            <p className="text-xs text-[#8e9bb4] mt-1">
              Khóa API của Thầy/Cô được <strong className="text-emerald-300">mã hóa an toàn trực tiếp trên trình duyệt (Local Storage)</strong> để sử dụng không giới hạn trong Trợ Giảng Soạn Bài AI.
            </p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold self-start sm:self-auto ${
              isKeyConfigured
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
            }`}
          >
            {isKeyConfigured ? "⚡ Đã Kích Hoạt Live AI" : "Chưa Cấu Hình Key"}
          </span>
        </div>

        {isKeyConfigured ? (
          <div className="p-4 rounded-2xl bg-[#0a0e1a]/80 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-slate-400 block">Khóa API hiện tại (Đã mã hóa):</span>
              <span className="font-mono text-sm text-emerald-400 tracking-wider">{maskedKeyDisplay}</span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/teacher/ai-tutor"
                className="px-4 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Mở Trợ Giảng AI</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={handleRemoveAIKey}
                className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-xs font-mono transition-all cursor-pointer flex items-center gap-1"
                title="Xóa khóa API khỏi máy"
              >
                <Trash2 className="w-3.5 h-3.5" /> Xóa
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveAIKey} className="space-y-4">
            <div className="relative">
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Nhập Google Gemini API Key:
              </label>
              <div className="relative flex items-center">
                <input
                  type={showRawKey ? "text" : "password"}
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="Dán mã API Key của Thầy/Cô (VD: AIzaSy...)"
                  className="w-full bg-[#0a0e1a] border border-emerald-500/30 focus:border-emerald-400 rounded-xl px-4 py-3 text-xs font-mono text-white placeholder-slate-600 focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowRawKey(!showRawKey)}
                  className="absolute right-3 text-slate-400 hover:text-white"
                >
                  {showRawKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-center justify-between mt-1.5 text-[11px] text-slate-500">
                <span>Khóa được mã hóa Base64-Cipher an toàn trong Local Storage của thiết bị.</span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:underline flex items-center gap-1"
                >
                  Lấy Key miễn phí tại Google AI Studio <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={!keyInput.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-mono font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              <Key className="w-3.5 h-3.5" /> Mã Hóa & Lưu Khóa API
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
