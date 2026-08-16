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
        .limit(50)
        .get();

      if (!snapshot.empty) {
        // Deduplicate: keep only the best score per userId
        const bestByUser = new Map<string, any>();
        snapshot.docs.forEach((docSnap) => {
          const d = docSnap.data();
          const uId = d.userId || "anonymous";
          const existing = bestByUser.get(uId);
          if (!existing || d.score > existing.score) {
            bestByUser.set(uId, {
              id: docSnap.id,
              userId: uId,
              userName: d.userName || "",
              score: d.score || 0,
              playTime: d.playTimeSeconds ? `${d.playTimeSeconds}s` : "--",
              accuracy: d.accuracyPercent ?? 100,
              date: d.finishedAt ? new Date(d.finishedAt).toLocaleDateString("vi-VN") : "Hom nay",
            });
          }
        });

        // Sort by score desc and assign ranks
        const sorted = Array.from(bestByUser.values()).sort((a, b) => b.score - a.score);
        sorted.forEach((entry, idx) => {
          rankings.push({
            ...entry,
            rank: idx + 1,
            // Display name as "Hoc vien #xxxx" for privacy, keep userId for hover
            name: `Học viên #${entry.userId?.slice(-4) || (idx + 1)}`,
          });
        });

        // Limit to top 20 after dedup
        rankings = rankings.slice(0, 20);
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
