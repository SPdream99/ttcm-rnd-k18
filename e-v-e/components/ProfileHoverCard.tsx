"use client";

import React, { useState, useRef, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";
import { User, Trophy, Coins, Flame, Award, Sparkles, CheckCircle2, ShieldCheck, Gamepad2, GraduationCap } from "lucide-react";

export interface ProfileCardData {
  id?: string;
  name: string;
  role?: string;
  rank?: number;
  score?: number | string;
  coins?: number | string;
  accuracy?: number | string;
  level?: string;
  title?: string;
  gamesWon?: number;
  streakDays?: number;
  isMe?: boolean;
  avatarUrl?: string;
}

interface ProfileHoverCardProps {
  user: ProfileCardData;
  children: ReactNode;
  align?: "top" | "bottom" | "auto";
  className?: string;
}

export function ProfileHoverCard({
  user,
  children,
  align = "auto",
  className = "",
}: ProfileHoverCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; position: "top" | "bottom" }>({
    top: 0,
    left: 0,
    position: "top",
  });
  const [mounted, setMounted] = useState(false);

  const triggerRef = useRef<HTMLDivElement | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const cardWidth = 260;
    const cardHeight = 180;
    const padding = 12;

    // Calculate horizontal position (center aligned, constrained to viewport)
    let left = rect.left + rect.width / 2 - cardWidth / 2;
    if (left < padding) left = padding;
    if (left + cardWidth > window.innerWidth - padding) {
      left = window.innerWidth - padding - cardWidth;
    }

    // Calculate vertical position
    let position: "top" | "bottom" = "top";
    let top = rect.top - cardHeight - 8;

    if (align === "bottom" || (align === "auto" && rect.top < cardHeight + padding)) {
      position = "bottom";
      top = rect.bottom + 8;
    }

    setCoords({ top, left, position });
  };

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    updatePosition();
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 180);
  };

  const initial = (user.name || "U").charAt(0).toUpperCase();
  const isTeacher = user.role === "teacher" || user.role === "instructor";

  return (
    <div
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`inline-block relative cursor-pointer ${className}`}
    >
      {children}

      {mounted &&
        isOpen &&
        createPortal(
          <div
            ref={cardRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              position: "fixed",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              zIndex: 99999,
            }}
            className="w-64 p-3.5 rounded-2xl bg-white text-zinc-900 border-2 border-red-500 shadow-2xl shadow-red-950/20 animate-in fade-in zoom-in-95 duration-150 select-none font-sans"
          >
            {/* Header with Avatar & Details */}
            <div className="flex items-start gap-2.5 pb-2.5 border-b border-zinc-100">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-sm shrink-0 ${
                  user.rank === 1
                    ? "bg-gradient-to-tr from-amber-500 to-yellow-400 ring-2 ring-amber-200"
                    : user.rank === 2
                    ? "bg-gradient-to-tr from-zinc-500 to-zinc-400 ring-2 ring-zinc-200"
                    : user.rank === 3
                    ? "bg-gradient-to-tr from-amber-700 to-amber-600 ring-2 ring-amber-100"
                    : isTeacher
                    ? "bg-gradient-to-tr from-blue-600 to-indigo-500"
                    : "bg-gradient-to-tr from-red-600 to-red-500"
                }`}
              >
                {initial}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 justify-between">
                  <h4 className="text-xs font-bold text-zinc-900 truncate leading-tight">
                    {user.name}
                  </h4>
                  {user.rank && (
                    <span
                      className={`text-[10px] font-black px-1.5 py-0.5 rounded-md shrink-0 ${
                        user.rank === 1
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : user.rank === 2
                          ? "bg-zinc-100 text-zinc-800 border border-zinc-300"
                          : user.rank === 3
                          ? "bg-red-100 text-red-800 border border-red-200"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      #{user.rank}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-zinc-500 font-mono">
                    ID: {user.id ? user.id.slice(-6).toUpperCase() : "STUDENT"}
                  </span>
                  {user.isMe && (
                    <span className="px-1 py-0.2 rounded bg-red-100 text-red-700 font-black text-[9px]">
                      BẠN
                    </span>
                  )}
                </div>

                <div className="text-[10px] font-semibold text-red-600 mt-0.5 truncate">
                  {user.title || user.level || (isTeacher ? "Giảng Viên E-V-E" : "Học Viên Tích Cực")}
                </div>
              </div>
            </div>

            {/* Stat Badges Grid */}
            <div className="grid grid-cols-2 gap-1.5 pt-2.5 text-xs">
              <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200">
                <span className="text-[9px] text-zinc-500 font-bold block uppercase">Điểm Số</span>
                <span className="font-mono font-black text-red-600 text-xs">
                  {typeof user.score === "number" ? user.score.toLocaleString() : user.score || "0"} pts
                </span>
              </div>

              <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200">
                <span className="text-[9px] text-zinc-500 font-bold block uppercase">E-V-E Coins</span>
                <span className="font-mono font-black text-amber-600 text-xs flex items-center gap-1">
                  <Coins className="w-3 h-3" /> {user.coins || 0}
                </span>
              </div>

              {user.accuracy !== undefined && (
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-[9px] text-zinc-500 font-bold block uppercase">Chính Xác</span>
                  <span className="font-mono font-black text-emerald-600 text-xs">
                    {user.accuracy}%
                  </span>
                </div>
              )}

              {user.gamesWon !== undefined && (
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-[9px] text-zinc-500 font-bold block uppercase">Thắng Game</span>
                  <span className="font-mono font-black text-blue-600 text-xs flex items-center gap-1">
                    <Gamepad2 className="w-3 h-3" /> {user.gamesWon}
                  </span>
                </div>
              )}
            </div>

            {/* Footer Badge */}
            <div className="mt-2 pt-2 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-500">
              <span className="flex items-center gap-1 font-medium">
                <Sparkles className="w-3 h-3 text-red-500" /> Hệ Sinh Thái E-V-E
              </span>
              <span className="font-bold text-emerald-600 flex items-center gap-0.5">
                <CheckCircle2 className="w-2.5 h-2.5" /> Đã xác thực
              </span>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export default ProfileHoverCard;
