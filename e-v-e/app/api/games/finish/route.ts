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
      userName,
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
    let realUserName = userName || "";
    if (userId && userId !== "anonymous") {
      try {
        const uRef = adminDb.collection("users").doc(userId);
        const uSnap = await uRef.get();
        if (uSnap.exists) {
          const uData = uSnap.data();
          if (!realUserName) {
            realUserName =
              uData?.name ||
              uData?.displayName ||
              uData?.fullName ||
              (uData?.email ? uData.email.split("@")[0] : "");
          }
        }
        await uRef.update({
          coins: FieldValue.increment(earnedCoins),
        });
      } catch (err) {
        console.warn("Could not update user coins or fetch name in Admin Firestore:", err);
      }
    }

    if (!realUserName) {
      realUserName = userId && userId !== "anonymous" ? `Học viên #${userId.slice(-4)}` : "Học viên";
    }

    // 3. Upsert game result: keep only best score per user per game+course
    // This prevents duplicate leaderboard entries
    try {
      const effectiveUserId = userId || "anonymous";

      // Check if user already has a result for this game+course
      const existingSnap = await adminDb
        .collection("game_results")
        .where("gameId", "==", gameId)
        .where("courseId", "==", courseId)
        .where("userId", "==", effectiveUserId)
        .limit(5)
        .get();

      if (!existingSnap.empty) {
        // Find the doc with the highest score
        let bestDoc = existingSnap.docs[0];
        let bestScore = bestDoc.data().score || 0;

        // Clean up any extra duplicates - keep only the best one
        for (let i = 1; i < existingSnap.docs.length; i++) {
          const docData = existingSnap.docs[i].data();
          if ((docData.score || 0) > bestScore) {
            // Delete the old best, this one is better
            await bestDoc.ref.delete();
            bestDoc = existingSnap.docs[i];
            bestScore = docData.score || 0;
          } else {
            // Delete this duplicate
            await existingSnap.docs[i].ref.delete();
          }
        }

        // Update if new score is better or if name was updated
        if (finalScore > bestScore || !bestDoc.data().userName) {
          await bestDoc.ref.update({
            score: Math.max(finalScore, bestScore),
            rawReportedScore: score,
            userName: realUserName,
            isWin,
            accuracyPercent,
            playTimeSeconds,
            earnedCoins,
            verifiedByAntiCheat: true,
            finishedAt: new Date().toISOString(),
          });
        }
      } else {
        // No existing record, create new one
        await adminDb.collection("game_results").add({
          gameId,
          courseId,
          pathId: pathId || "default_path",
          userId: effectiveUserId,
          userName: realUserName,
          score: finalScore,
          rawReportedScore: score,
          isWin,
          accuracyPercent,
          playTimeSeconds,
          earnedCoins,
          verifiedByAntiCheat: true,
          finishedAt: new Date().toISOString(),
        });
      }
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
        userName: realUserName,
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
