import GameGrid from "@/components/GameCenterList/GameGrid";

export default function GamesPage() {
  return (
    <main className="min-h-screen bg-[#0a0e1a] text-[#e1e2ec]">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10">
          <p className="mb-2 text-sm font-bold uppercase tracking-wider text-cyan-400">
            E-V-E GAME CENTER
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight text-white-400 sm:text-4xl">
            Choose a Game
          </h1>

          <p className="mt-2 text-slate-500">
            Choose a game and start playing.
          </p>
        </div>

        {/* Games */}
        <GameGrid />

      </section>
    </main>
  );
}