"use client";

interface GameHeaderProps {
  level?: number;
  lives?: number;
}

export default function GameHeader({
  level = 1,
  lives = 5,
}: GameHeaderProps) {
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
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <span
              key={index}
              className={`text-xl ${
                index < lives
                  ? "text-red-500"
                  : "text-slate-300"
              }`}
            >
              ♥
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}