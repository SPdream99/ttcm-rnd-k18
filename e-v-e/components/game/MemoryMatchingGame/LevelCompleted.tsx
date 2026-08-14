"use client";

type LevelCompleteProps = {
  open: boolean;
  matchedPairs: number;
  livesRemaining: number;
  onContinue: () => void;
};

export default function LevelComplete({
  open,
  matchedPairs,
  livesRemaining,
  onContinue,
}: LevelCompleteProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">

        {/* Icon */}

        <div className="text-6xl">
          🎉
        </div>

        <h2 className="mt-4 text-3xl font-black text-slate-900">
          Level Complete!
        </h2>

        <p className="mt-2 text-slate-500">
          Great job! You matched all the cards.
        </p>

        {/* Stats */}

        <div className="mt-6 grid grid-cols-2 gap-4">

          <div className="rounded-2xl bg-indigo-50 p-4">
            <p className="text-sm text-slate-500">
              Matched Pairs
            </p>

            <p className="mt-1 text-2xl font-black text-indigo-600">
              {matchedPairs}
            </p>
          </div>

          <div className="rounded-2xl bg-red-50 p-4">
            <p className="text-sm text-slate-500">
              Hearts
            </p>

            <p className="mt-1 text-2xl font-black">
              {"❤️".repeat(livesRemaining)}
            </p>
          </div>

        </div>

        {/* Continue */}

        <button
          onClick={onContinue}
          className="mt-6 w-full rounded-2xl bg-indigo-600 px-6 py-4 font-bold text-white transition hover:bg-indigo-700"
        >
          Continue →
        </button>

      </div>
    </div>
  );
}