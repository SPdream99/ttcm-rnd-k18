"use client";

import CardGame, {
  type MemoryCardData,
} from "./CardGame";

type GameBoardProps = {
  cards: MemoryCardData[];
  matchedCards: number[];
  flippedCards: number[];
  previewing: boolean;
  onCardClick: (id: number) => void;
};

export default function GameBoard({
  cards,
  matchedCards,
  flippedCards,
  previewing,
  onCardClick,
}: GameBoardProps) {
  /*
   * Xác định số cột dựa vào số lượng card.
   */
  const gridColumns =
    cards.length <= 8
      ? "grid-cols-4"
      : cards.length <= 12
        ? "grid-cols-4 sm:grid-cols-6"
        : "grid-cols-4 sm:grid-cols-8";

  return (
    <div
      className={`
        mx-auto
        grid
        w-full
        max-w-4xl
        ${gridColumns}
        gap-4
      `}
    >
      {cards.map((card) => {
        /*
         * Card đang match?
         */
        const matched = matchedCards.includes(
          card.id,
        );

        /*
         * Card đang được player lật?
         */
        const flipped = flippedCards.includes(
          card.id,
        );

        return (
          <CardGame
            key={card.id}
            card={card}
            flipped={flipped}
            matched={matched}
            previewing={previewing}
            disabled={previewing}
            onClick={() => {
              onCardClick(card.id);
            }}
          />
        );
      })}
    </div>
  );
}