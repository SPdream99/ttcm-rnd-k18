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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 font-sans">
      <div className="w-full max-w-md rounded-[32px] bg-white p-8 text-center shadow-2xl">
        {/* Game Over */}
        <div className="text-7xl">
          
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
          <div className="mt-6 rounded-2xl bg-amber-50 border border-amber-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
              <span> Phần thưởng:</span>
              <span className="text-base font-extrabold text-amber-600">+{reward} Coins</span>
            </div>
            <button
              onClick={onClaimReward}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              Nhận Thưởng
            </button>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-emerald-700 font-bold text-xs">
             Đã nhận {reward} Coins thành công!
          </div>
        )}

        {/* Play Again */}
        <button
          onClick={onPlayAgain}
          className="mt-6 w-full rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white py-4 font-bold text-base shadow-lg transition cursor-pointer"
        >
          Chơi lại (Play Again) 
        </button>
      </div>
    </div>
  );
}