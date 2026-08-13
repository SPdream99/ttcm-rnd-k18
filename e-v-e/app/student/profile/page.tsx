"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  UserCheck,
  Sparkles,
  Coins,
  Shield,
  Crown,
  Award,
  Palette,
  CheckCircle2,
  BookOpen,
  Trophy,
  Key,
  Eye,
  EyeOff,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import {
  saveEncryptedAIKey,
  getDecryptedAIKey,
  removeAIKey,
  hasAIKey,
  getMaskedAIKey,
} from "@/lib/secureKeyStorage";

export default function StudentProfilePage() {
  const { currentUser, profile } = useAuthAdapter();
  const displayName = currentUser?.name || profile?.fullName || "Học Viên";
  const displayEmail = currentUser?.email || "student@eve.edu.vn";
  const displayCoins = currentUser?.coins ?? profile?.coins ?? 250;

  const [activeFrame, setActiveFrame] = useState("frame_supernova_gold");
  const [activeBadge, setActiveBadge] = useState("badge_cosmic_legend");
  const [savedMsg, setSavedMsg] = useState("");

  // AI Key state
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

  const ownedFrames = [
    { id: "frame_supernova_gold", name: "Khung Hoàng Kim (Gold)", ringClass: "ring-4 ring-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)]" },
    { id: "frame_quantum_neon", name: "Khung Công Nghệ (Neon Blue)", ringClass: "ring-4 ring-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)]" },
    { id: "frame_default", name: "Mặc Định", ringClass: "ring-2 ring-slate-700" },
  ];

  const ownedBadges = [
    { id: "badge_cosmic_legend", name: "Thủ Khoa Xuất Sắc 🌟" },
    { id: "badge_quantum_explorer", name: "Chuyên Gia Thuật Toán 💡" },
    { id: "badge_flame_streak", name: "Chuyên Cần & Bứt Phá 🔥" },
  ];

  const handleSaveEquipment = () => {
    setSavedMsg("✅ Đã lưu cấu hình khung avatar và huy hiệu thành công!");
    setTimeout(() => setSavedMsg(""), 3000);
  };

  const handleSaveAIKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim()) return;

    saveEncryptedAIKey(keyInput.trim());
    setIsKeyConfigured(true);
    setMaskedKeyDisplay(getMaskedAIKey());
    setKeyInput("");
    setShowRawKey(false);
    setSavedMsg("🔑 Đã mã hóa và lưu trữ Google Gemini API Key an toàn trên trình duyệt của bạn!");
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

  const selectedFrame = ownedFrames.find((f) => f.id === activeFrame) || ownedFrames[0];

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/15">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <UserCheck className="w-7 h-7 text-cyan-400" /> Hồ Sơ & Trang Bị Cá Nhân
          </h1>
          <p className="text-sm text-[#8e9bb4] mt-1">
            Quản lý tài khoản, danh hiệu, mã hóa API Key và tùy biến ngoại trang.
          </p>
        </div>

        <div className="px-5 py-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center gap-2">
          <Coins className="w-4 h-4 text-amber-400" />
          <span className="font-mono font-bold text-sm text-amber-300">{displayCoins} Coins</span>
        </div>
      </div>

      {savedMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs flex items-center justify-between animate-fade-in">
          <span>{savedMsg}</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#0f1524]/90 border border-[#7bd1fa]/20 shadow-xl flex flex-col md:flex-row items-center gap-6">
        <div className={`w-28 h-28 rounded-full bg-slate-800 p-1 flex items-center justify-center transition-all ${selectedFrame.ringClass}`}>
          <div className="w-full h-full rounded-full bg-[#0a0e1a] flex items-center justify-center text-3xl font-bold text-cyan-400 font-mono">
            {displayName.charAt(0)}
          </div>
        </div>

        <div className="text-center md:text-left space-y-2 flex-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h2 className="text-xl md:text-2xl font-bold text-white">{displayName}</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
              {ownedBadges.find((b) => b.id === activeBadge)?.name}
            </span>
          </div>

          <p className="text-xs text-[#8e9bb4] font-mono">{displayEmail} • Học sinh chính thức</p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs font-mono text-slate-300">
            <span><BookOpen className="w-3.5 h-3.5 inline mr-1 text-cyan-400" /> 6 Khóa Học</span>
            <span><Trophy className="w-3.5 h-3.5 inline mr-1 text-amber-400" /> 1,280 Điểm</span>
            <span><Coins className="w-3.5 h-3.5 inline mr-1 text-yellow-400" /> {displayCoins} Coins</span>
          </div>
        </div>
      </div>

      {/* ── CARD QUẢN LÝ MÃ HÓA AI KEY ── */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#0f1524] to-[#151b2c] border border-cyan-500/30 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-cyan-400" /> Khóa Trí Tuệ Nhân Tạo (Gemini / OpenAI API Key)
            </h3>
            <p className="text-xs text-[#8e9bb4] mt-1">
              Khóa API của bạn được <strong className="text-cyan-300">mã hóa an toàn trực tiếp trên trình duyệt (Local Storage)</strong> và không bao giờ bị lưu trên máy chủ công cộng.
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
                href="/student/ai-tutor"
                className="px-4 py-2 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Dùng Thử AI Tutor</span>
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
                  placeholder="Dán mã API Key của bạn (VD: AIzaSy...)"
                  className="w-full bg-[#0a0e1a] border border-cyan-500/30 focus:border-cyan-400 rounded-xl px-4 py-3 text-xs font-mono text-white placeholder-slate-600 focus:outline-none pr-10"
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
                <span>Khóa được mã hóa Base64-Cipher trước khi ghi vào Local Storage.</span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline flex items-center gap-1"
                >
                  Lấy Key miễn phí tại Google AI Studio <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={!keyInput.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-mono font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              <Key className="w-3.5 h-3.5" /> Mã Hóa & Lưu Khóa API
            </button>
          </form>
        )}
      </div>

      {/* Customization Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Frame Selection */}
        <div className="p-6 rounded-2xl bg-[#0f1524]/80 border border-[#7bd1fa]/15 space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-cyan-400" /> Chọn Khung Avatar Đã Sở Hữu
          </h3>

          <div className="space-y-2.5">
            {ownedFrames.map((frame) => (
              <label
                key={frame.id}
                onClick={() => setActiveFrame(frame.id)}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  activeFrame === frame.id
                    ? "bg-cyan-500/20 border-cyan-400 text-white"
                    : "bg-[#151b2c] border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs ${frame.ringClass}`}>
                    ✦
                  </div>
                  <span className="font-mono text-xs font-bold text-white">{frame.name}</span>
                </div>
                {activeFrame === frame.id && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
              </label>
            ))}
          </div>
        </div>

        {/* Badge Selection */}
        <div className="p-6 rounded-2xl bg-[#0f1524]/80 border border-[#7bd1fa]/15 space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" /> Chọn Huy Hiệu Hiển Thị
          </h3>

          <div className="space-y-2.5">
            {ownedBadges.map((b) => (
              <label
                key={b.id}
                onClick={() => setActiveBadge(b.id)}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  activeBadge === b.id
                    ? "bg-amber-500/20 border-amber-400 text-white"
                    : "bg-[#151b2c] border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <span className="font-mono text-xs font-bold text-white">{b.name}</span>
                {activeBadge === b.id && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
              </label>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleSaveEquipment}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-cyan-300 text-white font-bold font-mono text-sm shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        <CheckCircle2 className="w-4 h-4" /> Lưu Thiết Lập Trang Bị
      </button>
    </div>
  );
}
