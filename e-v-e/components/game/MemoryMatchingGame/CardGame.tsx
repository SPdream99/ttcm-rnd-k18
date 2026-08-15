"use client";

import React from "react";

export type MemoryCardData = {
  id: number;
  type: string;
  emoji?: string;
  icon?: string;
  name: string;
  text?: string;
  definition?: string;
};

type CardGameProps = {
  card: MemoryCardData;
  flipped: boolean;
  matched: boolean;
  previewing: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export default function CardGame({
  card,
  flipped,
  matched,
  previewing,
  disabled = false,
  onClick,
}: CardGameProps) {
  /*
   * Preview:
   * luôn hiện FRONT.
   *
   * Sau preview:
   * flipped = true  -> FRONT
   * flipped = false -> BACK
   */
  const showFront = previewing || flipped;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="aspect-square w-full cursor-pointer focus:outline-none select-none transition-transform active:scale-95"
    >
      <div className="relative h-full w-full">
        {/* =========================================
            CARD BACK
        ========================================= */}
        <div
          className={`
            absolute
            inset-0
            flex
            items-center
            justify-center
            rounded-3xl
            bg-gradient-to-br from-red-500 to-red-700
            shadow-lg
            transition-all
            duration-300
            border border-red-400/30
            ${
              showFront
                ? "pointer-events-none scale-95 opacity-0"
                : "scale-100 opacity-100 hover:shadow-red-500/20"
            }
          `}
        >
          <span className="text-4xl sm:text-5xl font-black text-white drop-shadow">
            ?
          </span>
        </div>

        {/* =========================================
            CARD FRONT
        ========================================= */}
        <div
          className={`
            absolute
            inset-0
            flex
            flex-col
            items-center
            justify-center
            rounded-3xl
            bg-white
            p-3
            shadow-lg
            border-2
            transition-all
            duration-300
            ${
              showFront
                ? "scale-100 opacity-100"
                : "pointer-events-none scale-95 opacity-0"
            }
            ${
              matched
                ? "border-emerald-500 ring-4 ring-emerald-200 bg-emerald-50"
                : "border-zinc-200"
            }
          `}
        >
          <span className="text-3xl sm:text-4xl select-none">
            {card.emoji || card.icon || ""}
          </span>

          <span className="mt-2 text-center text-xs sm:text-sm font-bold text-zinc-800 line-clamp-2 leading-tight">
            {card.name || card.text || ""}
          </span>
        </div>
      </div>
    </button>
  );
}