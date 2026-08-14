import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/infrastructure/firebase/firebaseAdmin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const gameId = searchParams.get("gameId");
    const courseId = searchParams.get("courseId");

    if (!gameId || !courseId) {
      return NextResponse.json(
        { success: false, error: "Missing gameId or courseId query params" },
        { status: 400 }
      );
    }

    let rankings: any[] = [];

    try {
      const snapshot = await adminDb
        .collection("game_results")
        .where("gameId", "==", gameId)
        .where("courseId", "==", courseId)
        .where("isWin", "==", true)
        .orderBy("score", "desc")
        .limit(20)
        .get();

      if (!snapshot.empty) {
        let currentRank = 1;
        snapshot.docs.forEach((docSnap) => {
          const d = docSnap.data();
          rankings.push({
            id: docSnap.id,
            rank: currentRank++,
            userId: d.userId || "anonymous",
            name: d.userName || `Học viên #${d.userId?.slice(-4) || currentRank}`,
            score: d.score || 0,
            playTime: d.playTimeSeconds ? `${d.playTimeSeconds}s` : "--",
            accuracy: d.accuracyPercent ?? 100,
            date: d.finishedAt ? new Date(d.finishedAt).toLocaleDateString("vi-VN") : "Hôm nay",
          });
        });
      }
    } catch (e) {
      console.warn("Firestore query warning for game leaderboard:", e);
    }

    return NextResponse.json({
      success: true,
      gameId,
      courseId,
      totalPlayers: rankings.length,
      rankings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
