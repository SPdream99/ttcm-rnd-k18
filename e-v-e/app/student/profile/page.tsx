"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";

export default function StudentProfilePage() {
  const { currentUser, profile } = useAuthAdapter();
  const displayName = currentUser?.name || profile?.fullName || "Học Sinh Explorer";
  const displayEmail = currentUser?.email || "student@eve.edu.vn";
  const displayCoins = currentUser?.coins ?? profile?.coins ?? 250;

  const [activeFrame, setActiveFrame] = useState("frame_supernova_gold");
  const [activeBadge, setActiveBadge] = useState("badge_cosmic_legend");
  const [savedMsg, setSavedMsg] = useState(false);

  const ownedFrames = [
    { id: "frame_supernova_gold", name: "Khung Siêu Tân Tinh (Gold)", ringClass: "ring-4 ring-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)]" },
    { id: "frame_quantum_neon", name: "Khung Lượng Tử Neon", ringClass: "ring-4 ring-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)]" },
    { id: "frame_default", name: "Mặc Định", ringClass: "ring-2 ring-slate-700" },
  ];

  const ownedBadges = [
    { id: "badge_cosmic_legend", name: "Huyền Thoại Không Gian 🌟" },
    { id: "badge_quantum_explorer", name: "Nhà Thám Hiểm Lượng Tử ⚛️" },
    { id: "badge_flame_streak", name: "Ngọn Lửa Bất Diệt 🔥" },
  ];

  const handleSave = () => {
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const selectedFrame = ownedFrames.find((f) => f.id === activeFrame) || ownedFrames[0];

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/15">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <UserCheck className="w-7 h-7 text-cyan-400" /> Hồ Sơ & Trang Bị Học Sinh
          </h1>
          <p className="text-sm text-[#8e9bb4] mt-1">
            Quản lý thông tin tài khoản, danh hiệu và tùy biến khung avatar từ Cửa hàng Vũ Trụ.
          </p>
        </div>

        <div className="px-5 py-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center gap-2">
          <Coins className="w-4 h-4 text-amber-400" />
          <span className="font-mono font-bold text-sm text-amber-300">{displayCoins} Coins</span>
        </div>
      </div>

      {savedMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs flex items-center justify-between animate-fade-in">
          <span>✅ Đã lưu cấu hình trang phục và huy hiệu thành công!</span>
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
        onClick={handleSave}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-cyan-300 text-white font-bold font-mono text-sm shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        <CheckCircle2 className="w-4 h-4" /> Lưu Thiết Lập Trang Bị
      </button>
    </div>
  );
}
