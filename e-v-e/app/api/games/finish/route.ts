import { NextRequest, NextResponse } from "next/server";
import { doc, updateDoc, increment, addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      gameId,
      courseId,
      pathId,
      userId,
      score = 100,
      isWin = true,
      accuracyPercent = 100,
      playTimeSeconds = 60,
    } = body;

    if (!gameId || !courseId) {
      return NextResponse.json(
        { success: false, error: "Missing gameId or courseId" },
        { status: 400 }
      );
    }

    // 1. Calculate coins reward
    let earnedCoins = 0;
    if (isWin) {
      earnedCoins = Math.max(30, Math.floor(score * 0.5));
    } else {
      earnedCoins = 10; // Consolation coins
    }

    // 2. Update user coins if userId provided
    if (userId && userId !== "anonymous") {
      try {
        await updateDoc(doc(db, "users", userId), {
          coins: increment(earnedCoins),
        });
      } catch (err) {
        console.warn("Could not update user coins in Firestore:", err);
      }
    }

    // 3. Save game result history record
    try {
      await addDoc(collection(db, "game_results"), {
        gameId,
        courseId,
        pathId: pathId || "default_path",
        userId: userId || "anonymous",
        score,
        isWin,
        accuracyPercent,
        playTimeSeconds,
        earnedCoins,
        finishedAt: new Date().toISOString(),
      });
    } catch {}

    // 4. Return success response with next course unlock indication
    return NextResponse.json({
      success: true,
      message: "Kết quả trò chơi đã được ghi nhận và cập nhật điểm lên hệ sinh thái E-V-E!",
      data: {
        gameId,
        courseId,
        pathId,
        finalScore: score,
        isWin,
        earnedCoins,
        courseCompleted: isWin,
        unlockedNextCourse: isWin,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to finalize game session" },
      { status: 500 }
    );
  }
}
