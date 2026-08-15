"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GamePlayRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/student/play/game_card_match_vr/crs_coding_basics");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 font-sans">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-4 border-zinc-200 border-t-red-600 rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-zinc-600">Đang khởi tạo container Game Memory Matching E-V-E...</p>
      </div>
    </div>
  );
}
