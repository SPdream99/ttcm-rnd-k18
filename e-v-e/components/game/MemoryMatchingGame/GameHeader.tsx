"use client";

import { useRef, useEffect, useState } from "react";
interface GameHeaderProps {
  level?: number;
  lives?: number;
}

export default function GameHeader({ level = 1, lives = 5 }: GameHeaderProps) {
  const [music, setMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/sounds/BGM_MemoryMatchingGame.mp3");

    audio.loop = true;
    audio.volume = 0.3;

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xl shadow-sm">
            🧠
          </div>

          <div className="hidden sm:block">
            <p className="text-lg font-extrabold leading-none tracking-tight text-indigo-700">
              E-V-E
            </p>

            <p className="mt-1 text-xs font-medium text-slate-500">
              Memory Match
            </p>
          </div>
        </div>

        {/* Level */}
        <div className="rounded-full bg-slate-100 px-5 py-2">
          <span className="text-sm font-bold text-slate-700">
            Level {String(level).padStart(2, "0")}
          </span>
        </div>

        {/* Lives */}
        <div className="flex items-center gap-4">
          {/* Music */}
          <button
            aria-label="Toggle Music"
            onClick={async () => {
              const nextMusic = !music;
              setMusic(nextMusic);

              if (!audioRef.current) return;

              try {
                if (nextMusic) {
                  await audioRef.current.play();
                } else {
                  audioRef.current.pause();
                }
              } catch (error) {
                console.error("Không thể phát nhạc:", error);
                setMusic(false);
              }
            }}
            className="
      flex h-11 w-11 items-center justify-center
      rounded-full
      border border-slate-200
      bg-white
      text-slate-500
      shadow-sm
      transition-all duration-200
      hover:scale-105
      hover:border-cyan-200
      hover:bg-cyan-50
      hover:text-cyan-600
      active:scale-95
    "
          >
            <span
              className="material-symbols-outlined text-[21px]"
              style={{
                fontVariationSettings: "'FILL' 1",
              }}
            >
              {music ? "music_note" : "music_off"}
            </span>
          </button>

          {/* Lives */}
          <div className="flex items-center gap-1.5 rounded-full border border-red-100 bg-white px-3 py-2 shadow-sm">
            {Array.from({ length: 5 }).map((_, index) => (
              <span
                key={index}
                className={`
          text-[17px]
          leading-none
          transition-all duration-200
          ${index < lives
                    ? "text-red-400 drop-shadow-[0_1px_2px_rgba(248,113,113,0.25)]"
                    : "text-slate-200"
                  }
        `}
              >
                ♥
              </span>
            ))}

            {/* Số mạng */}
            <span className="ml-1 text-xs font-bold text-slate-500">
              {lives}/5
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
