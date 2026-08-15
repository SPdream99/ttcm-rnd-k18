import GameTile from "./GameTile";

const games = [
  {
    title: "Memory Matching Game",
    description: "Find all matching pairs",
    icon: "/game_content/Logo_MemoryMatchingGame.png",
    href: "/game/MemoryMatchingGame",
  },
  {
    title: "Puzzle",
    description: "Solve the puzzle",
    icon: "",
    href: "/game/puzzle",
  },
  {
    title: "Math Challenge",
    description: "Test your math skills",
    icon: "",
    href: "/game/math",
  },
  {
    title: "Card Match",
    description: "Match the cards",
    icon: "🃏",
    href: "/game/card-match",
  },
];

export default function GameGrid() {
  return (
    <div className="grid w-full grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {games.map((game) => (
        <GameTile
          key={game.title}
          title={game.title}
          description={game.description}
          icon={game.icon}
          href={game.href}
        />
      ))}
    </div>
  );
}