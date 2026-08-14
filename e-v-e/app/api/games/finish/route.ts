import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/infrastructure/firebase/firebaseAdmin";
import { validateGameScore } from "@/lib/antiCheat";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      gameId,
      courseId,
      pathId,
      userId,
      sessionToken,
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

    // 1. Anti-Cheat & Secure Score Validation
    const validation = validateGameScore(sessionToken, Number(score), Number(playTimeSeconds));
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: `Gian lận bị phát hiện hoặc phiên chơi không hợp lệ: ${validation.reason}`,
          cheated: true,
        },
        { status: 403 }
      );
    }

    const finalScore = validation.sanitizedScore;
    const earnedCoins = validation.earnedCoins;

    // 2. Update user coins if userId provided using Admin Firestore
    if (userId && userId !== "anonymous") {
      try {
        await adminDb.collection("users").doc(userId).update({
          coins: FieldValue.increment(earnedCoins),
        });
      } catch (err) {
        console.warn("Could not update user coins in Admin Firestore:", err);
      }
    }

    // 3. Save game result history record with anti-cheat verification flag
    try {
      await adminDb.collection("game_results").add({
        gameId,
        courseId,
        pathId: pathId || "default_path",
        userId: userId || "anonymous",
        score: finalScore,
        rawReportedScore: score,
        isWin,
        accuracyPercent,
        playTimeSeconds,
        earnedCoins,
        verifiedByAntiCheat: true,
        finishedAt: new Date().toISOString(),
      });
    } catch (saveErr) {
      console.warn("Could not save game_results record:", saveErr);
    }

    // 4. Return success response
    return NextResponse.json({
      success: true,
      message: "Kết quả trò chơi đã được kiểm định an toàn và cập nhật điểm thành công!",
      data: {
        gameId,
        courseId,
        pathId,
        finalScore,
        isWin,
        earnedCoins,
        courseCompleted: isWin,
        unlockedNextCourse: isWin,
        verified: true,
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
