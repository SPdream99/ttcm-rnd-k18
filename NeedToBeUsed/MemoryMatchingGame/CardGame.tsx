"use client";

export type MemoryCardData = {
  id: number;
  type: string;
  emoji: string;
  name: string;
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
      className="aspect-square w-full"
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
            bg-indigo-600
            shadow-lg
            transition-all
            duration-300

            ${
              showFront
                ? "pointer-events-none scale-95 opacity-0"
                : "scale-100 opacity-100"
            }
          `}
        >
          <span className="text-5xl font-black text-white">
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
            shadow-lg
            transition-all
            duration-300

            ${
              showFront
                ? "scale-100 opacity-100"
                : "pointer-events-none scale-95 opacity-0"
            }

            ${
              matched
                ? "ring-4 ring-emerald-400"
                : ""
            }
          `}
        >
          <span className="text-5xl">
            {card.emoji}
          </span>

          <span className="mt-2 text-xs font-bold text-slate-500">
            {card.name}
          </span>
        </div>

      </div>
    </button>
  );
}