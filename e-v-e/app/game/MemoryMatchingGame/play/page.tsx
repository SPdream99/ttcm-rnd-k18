"use client";

import { useEffect, useState } from "react";

import GameHeader from "@/components/game/MemoryMatchingGame/GameHeader";
import GameInfo from "@/components/game/MemoryMatchingGame/GameInfo";
import GameStatus from "@/components/game/MemoryMatchingGame/GameStatus";
import GameBoard from "@/components/game/MemoryMatchingGame/BoardGame";
import LevelComplete from "@/components/game/MemoryMatchingGame/LevelCompleted";
import GameOver from "@/components/game/MemoryMatchingGame/GameOver";

import type { MemoryCardData } from "@/components/game/MemoryMatchingGame/CardGame";

const baseCards: MemoryCardData[] = [
  {
    id: 1,
    type: "cat",
    emoji: "🐱",
    name: "CAT",
  },
  {
    id: 2,
    type: "dog",
    emoji: "🐶",
    name: "DOG",
  },
  {
    id: 3,
    type: "apple",
    emoji: "🍎",
    name: "APPLE",
  },
  {
    id: 4,
    type: "book",
    emoji: "📚",
    name: "BOOK",
  },
];

const MAX_LIVES = 5;

function getCardCount(level: number) {
  if (level < 10) return 8;
  if (level < 20) return 10;
  if (level < 30) return 12;
  if (level < 40) return 14;

  return 16;
}

function getPreviewTime(level: number) {
  if (level < 10) return 5;
  if (level < 20) return 8;
  if (level < 30) return 9;

  return 10;
}

function getReward(level: number) {
  return 50 + level * 15;
}

function shuffle<T>(array: T[]): T[] {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function createCards(level: number): MemoryCardData[] {
  const cardCount = getCardCount(level);

  const result: MemoryCardData[] = [];

  for (let i = 0; i < cardCount / 2; i++) {
    const base = baseCards[i % baseCards.length];

    result.push({
      ...base,
      id: i * 2 + 1,
    });

    result.push({
      ...base,
      id: i * 2 + 2,
    });
  }

  return shuffle(result);
}

export default function GamePage() {
  const [level, setLevel] = useState(1);

  const [lives, setLives] = useState(MAX_LIVES);

  const [score, setScore] = useState(0);

  const [totalMatches, setTotalMatches] = useState(0);

  const [matchedCards, setMatchedCards] = useState<number[]>([]);

  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  const [cards, setCards] = useState<MemoryCardData[]>([]);

  const [previewing, setPreviewing] = useState(true);

  const [previewTime, setPreviewTime] = useState(5);

  const [levelComplete, setLevelComplete] = useState(false);

  const [gameOver, setGameOver] = useState(false);

  const [rewardClaimed, setRewardClaimed] = useState(false);

  /*
   * Start / reset level
   */
  const startLevel = (newLevel: number) => {
    const newCards = createCards(newLevel);

    setLevel(newLevel);

    setCards(newCards);

    setMatchedCards([]);

    setFlippedCards([]);

    setLevelComplete(false);

    setPreviewing(true);

    setPreviewTime(getPreviewTime(newLevel));
  };

  /*
   * Start game
   */
  const startGame = () => {
    setLives(MAX_LIVES);

    setScore(0);

    setTotalMatches(0);

    setGameOver(false);

    setRewardClaimed(false);

    startLevel(1);
  };

  /*
   * Initial game
   */
  useEffect(() => {
    startGame();
  }, []);

  /*
   * Preview timer
   */
  useEffect(() => {
    if (!previewing) {
      return;
    }

    if (previewTime <= 0) {
      setPreviewing(false);
      setFlippedCards([]);

      return;
    }

    const timer = setTimeout(() => {
      setPreviewTime((prev) => prev - 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [previewing, previewTime]);

  /*
   * Check matching
   */
  useEffect(() => {
    if (flippedCards.length !== 2) return;

    const first = cards.find((card) => card.id === flippedCards[0]);

    const second = cards.find((card) => card.id === flippedCards[1]);

    if (!first || !second) return;

    const timer = setTimeout(() => {
      /*
       * MATCH
       */
      if (first.type === second.type) {
        setMatchedCards((prev) => [...prev, first.id, second.id]);

        setScore((prev) => prev + 100);

        setTotalMatches((prev) => prev + 1);

        setFlippedCards([]);

        return;
      }

      /*
       * WRONG
       */
      const newLives = lives - 1;

      setLives(newLives);

      setFlippedCards([]);

      /*
       * Game Over
       */
      if (newLives <= 0) {
        setGameOver(true);
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [flippedCards]);

  /*
   * Check level completed
   */
  useEffect(() => {
    const totalPairs = cards.length / 2;

    if (totalPairs === 0 || gameOver || matchedCards.length !== cards.length) {
      return;
    }

    const timer = setTimeout(() => {
      setLevelComplete(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [matchedCards, cards, gameOver]);

  /*
   * Click card
   */
  const handleCardClick = (id: number) => {
    if (previewing) return;

    if (gameOver) return;

    if (levelComplete) return;

    if (flippedCards.length >= 2) return;

    if (matchedCards.includes(id)) return;

    if (flippedCards.includes(id)) return;

    setFlippedCards((prev) => [...prev, id]);
  };

  /*
   * Continue next level
   */
  const handleNextLevel = () => {
    startLevel(level + 1);
  };

  /*
   * Calculate reward
   */
  const reward = getReward(level);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <GameHeader level={level} lives={lives} />

      <section className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <GameInfo level={level} />

        {previewing && (
          <div className="mb-6 rounded-2xl bg-indigo-600 px-8 py-4 text-center text-white shadow-lg">
            <p className="text-sm font-medium">Memorize the cards</p>

            <p className="text-4xl font-black">{previewTime}</p>
          </div>
        )}

        <GameBoard
          cards={cards}
          matchedCards={matchedCards}
          flippedCards={flippedCards}
          previewing={previewing}
          onCardClick={handleCardClick}
        />

        <GameStatus
          matchedPairs={matchedCards.length / 2}
          totalPairs={cards.length / 2}
        />
      </section>

      {/* LEVEL COMPLETE */}

      <LevelComplete
        open={levelComplete}
        matchedPairs={cards.length / 2}
        livesRemaining={lives}
        onContinue={handleNextLevel}
      />

      {/* GAME OVER */}

      <GameOver
        open={gameOver}
        level={level}
        score={score}
        reward={reward}
        totalMatches={totalMatches}
        rewardClaimed={rewardClaimed}
        onClaimReward={() => {
          setRewardClaimed(true);
        }}
        onPlayAgain={startGame}
      />
    </main>
  );
}
