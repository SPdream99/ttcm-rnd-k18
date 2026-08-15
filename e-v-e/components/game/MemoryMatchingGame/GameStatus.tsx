interface GameStatusProps {
  matchedPairs?: number;
  totalPairs?: number;
}

export default function GameStatus({
  matchedPairs = 0,
  totalPairs = 4,
}: GameStatusProps) {
  const progress =
    totalPairs > 0
      ? (matchedPairs / totalPairs) * 100
      : 0;

  return (
    <div className="mt-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-sm font-sans">

      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-bold tracking-wide text-slate-700">
          MATCHED PAIRS
        </span>

        <span className="text-sm font-extrabold text-indigo-600">
          {matchedPairs} / {totalPairs}
        </span>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-indigo-600 transition-all duration-500"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}