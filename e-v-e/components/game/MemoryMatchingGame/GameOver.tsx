"use client";

type GameOverProps = {
  open: boolean;

  level: number;

  score: number;

  reward: number;

  totalMatches: number;

  rewardClaimed: boolean;

  onClaimReward: () => void;

  onPlayAgain: () => void;
};

export default function GameOver({
  open,
  level,
  score,
  reward,
  totalMatches,
  rewardClaimed,
  onClaimReward,
  onPlayAgain,
}: GameOverProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

      <div className="w-full max-w-md rounded-[32px] bg-white p-8 text-center shadow-2xl">

        {/* Game Over */}

        <div className="text-7xl">
          💔
        </div>

        <h2 className="mt-4 text-4xl font-black text-slate-900">
          Game Over
        </h2>

        <p className="mt-2 text-slate-500">
          You reached
        </p>

        <p className="text-4xl font-black text-indigo-600">
          Level {level}
        </p>

        {/* Stats */}

        <div className="mt-6 grid grid-cols-3 gap-3">

          <div className="rounded-2xl bg-slate-100 p-4">

            <p className="text-xs text-slate-500">
              Level
            </p>

            <p className="mt-1 text-xl font-black">
              {level}
            </p>

          </div>

          <div className="rounded-2xl bg-slate-100 p-4">

            <p className="text-xs text-slate-500">
              Score
            </p>

            <p className="mt-1 text-xl font-black">
              {score}
            </p>

          </div>

          <div className="rounded-2xl bg-slate-100 p-4">

            <p className="text-xs text-slate-500">
              Matches
            </p>

            <p className="mt-1 text-xl font-black">
              {totalMatches}
            </p>

          </div>

        </div>

        {/* Reward */}

        {!rewardClaimed ? (
          <>
            <div className="mt-6 rounded-3xl bg-amber-50 p-6">

              <p className="text-sm font-semibold text-amber-700">
                🎁 Your Reward
              </p>

              <p className="mt-2 text-4xl font-black text-amber-600">
                +{reward} 🪙
              </p>

              <p className="mt-2 text-sm text-amber-700">
                Reward based on your highest level
                in this game.
              </p>

            </div>

            <button
              onClick={onClaimReward}
              className="mt-5 w-full rounded-2xl bg-amber-500 px-6 py-4 font-bold text-white shadow-lg transition hover:bg-amber-600"
            >
              🎁 Claim {reward} Coins
            </button>
          </>
        ) : (
          <div className="mt-6 rounded-3xl bg-emerald-50 p-6">

            <div className="text-4xl">
              🎉
            </div>

            <p className="mt-2 font-bold text-emerald-700">
              Reward Claimed!
            </p>

            <p className="mt-1 text-2xl font-black text-emerald-600">
              +{reward} 🪙
            </p>

          </div>
        )}

        {/* Play Again */}

        <button
          onClick={onPlayAgain}
          className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 font-bold text-slate-700 transition hover:bg-slate-50"
        >
          🔄 Play Again
        </button>

      </div>

    </div>
  );
}