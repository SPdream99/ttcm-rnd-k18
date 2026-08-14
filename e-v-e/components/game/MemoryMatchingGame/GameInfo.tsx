interface GameInfoProps {
  level?: number;
}

export default function GameInfo({
  level = 1,
}: GameInfoProps) {
  return (
    <div className="mb-8 text-center">
      <div className="mb-4 inline-flex rounded-full bg-indigo-100 px-4 py-1.5">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
          Level {String(level).padStart(2, "0")}
        </span>
      </div>

      <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        FIND THE PAIRS
      </h1>

      <p className="text-sm text-slate-500 sm:text-base">
        Flip two cards and find all the matching pairs!
      </p>
    </div>
  );
}