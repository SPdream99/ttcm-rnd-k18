"use client";

import { useState } from "react";
export default function MemoryMatchPage() {
  const [sound, setSound] = useState(true);
  const [music, setMusic] = useState(true);

  const handlePlay = () => {
    console.log("Start game");
    location.href = "/game/MemoryMatchingGame/play";
    // router.push("/memory-match/game");
  };

  const handleLevels = () => {
    console.log("Open levels");
  };

  const handleSettings = () => {
    console.log("Open settings");
  };

  return (
    <main className="bg-background text-on-background min-h-screen flex flex-col font-body-md relative overflow-hidden">
      {/* Soft Ambient Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-fixed opacity-60 rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3 pointer-events-none" />

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary-fixed opacity-40 rounded-full blur-[120px] translate-x-1/4 translate-y-1/4 pointer-events-none" />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-container-padding z-10 w-full max-w-md mx-auto relative">
        
        {/* Logo Area */}
        <div className="flex flex-col items-center mb-16 animate-float">
          
          <div className="w-32 h-32 bg-white rounded-3xl shadow-[0_8px_32px_rgba(107,56,212,0.15)] flex items-center justify-center mb-6 border border-surface-dim transform rotate-3">
            <span
              className="material-symbols-outlined text-[72px] text-primary"
              style={{
                fontVariationSettings: "'FILL' 1",
              }}
            >
              psychology
            </span>
          </div>

          <h1 className="font-display text-display text-on-background text-center drop-shadow-sm">
            MEMORY
            <br />
            <span className="text-primary">MATCH</span>
          </h1>
        </div>

        {/* Navigation Buttons */}
        <div className="w-full flex flex-col gap-5 px-6">
          
          {/* PLAY */}

          <button
            onClick={handlePlay}
            className="w-full group relative overflow-hidden bg-primary text-on-primary py-5 rounded-full font-label-md text-label-md shadow-[0_8px_24px_rgba(107,56,212,0.2)] hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(107,56,212,0.3)] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />

            <span
              className="material-symbols-outlined relative z-10"
              style={{
                fontVariationSettings: "'FILL' 1",
              }}
            >
              play_arrow
            </span>
      
            <span className="text-lg tracking-widest relative z-10">
              PLAY
            </span>
          </button>
        </div>
      </main>

      {/* Footer Audio Controls */}
      <footer className="absolute bottom-8 w-full flex justify-center gap-6 z-10">
        
        {/* Sound */}
        <button
          aria-label="Toggle Sound"
          onClick={() => setSound(!sound)}
          className="w-14 h-14 bg-surface rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-surface-dim flex items-center justify-center text-primary hover:bg-primary-fixed hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontVariationSettings: "'FILL' 1",
            }}
          >
            {sound ? "volume_up" : "volume_off"}
          </span>
        </button>

        {/* Music */}
        <button
          aria-label="Toggle Music"
          onClick={() => setMusic(!music)}
          className="w-14 h-14 bg-surface rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-surface-dim flex items-center justify-center text-primary hover:bg-primary-fixed hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontVariationSettings: "'FILL' 1",
            }}
          >
            {music ? "music_note" : "music_off"}
          </span>
        </button>

      </footer>
    </main>
  );
}