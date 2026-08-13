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

  const [savedMsg, setSavedMsg] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [showRawKey, setShowRawKey] = useState(false);
  const [isKeyConfigured, setIsKeyConfigured] = useState(false);
  const [maskedKeyDisplay, setMaskedKeyDisplay] = useState("");

  useEffect(() => {
    const configured = hasAIKey();
    setIsKeyConfigured(configured);
    if (configured) {
      setMaskedKeyDisplay(getMaskedAIKey());
    }
  }, []);

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

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/15">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <UserCheck className="w-7 h-7 text-emerald-400" /> Hồ Sơ & Thiết Lập Giảng Dạy
          </h1>
          <p className="text-sm text-[#8e9bb4] mt-1">
            Quản lý tài khoản giáo viên, chỉ số đóng góp và mã hóa khóa AI cá nhân.
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
            <span><BookOpen className="w-3.5 h-3.5 inline mr-1 text-cyan-400" /> 4 Khóa Học Đã Tạo</span>
            <span><Gamepad2 className="w-3.5 h-3.5 inline mr-1 text-emerald-400" /> 3 Minigames</span>
            <span><Users className="w-3.5 h-3.5 inline mr-1 text-amber-400" /> 128 Lượt Học Sinh Chơi</span>
          </div>
        </div>
      </div>

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
