import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/infrastructure/firebase/firebaseAdmin";
import { validateGameScore, decodeGameSessionToken } from "@/lib/antiCheat";

interface PassRule {
  type?: string;
  value?: number;
}

/**
 * Luật qua chặng mặc định cho các game chưa cấu hình passRule trong game_info.
 * Mỗi game CẦN khai báo passRule để xác định kết quả đủ đạt (hoàn thành chặng + vào BXH).
 */
const DEFAULT_PASS_RULES: Record<string, PassRule> = {
  game_card_match_vr: { type: "minLevel", value: 2 },
};

function evaluatePassRule(
  rule: PassRule | null | undefined,
  result: { score: number; isWin: boolean; accuracyPercent: number; highestLevelReached?: number }
): boolean {
  const r = rule && typeof rule === "object" ? rule : {};
  const type = r.type || "win";
  switch (type) {
    case "minLevel":
      return Number(result.highestLevelReached || 0) >= Number(r.value || 0);
    case "minScore":
      return Number(result.score || 0) >= Number(r.value || 0);
    case "minAccuracy":
      return Number(result.accuracyPercent || 0) >= Number(r.value || 0);
    case "win":
    default:
      return Boolean(result.isWin);
  }
}

async function isTesterUser(userId: string): Promise<boolean> {
  if (!userId || userId === "anonymous") return false;
  try {
    const uSnap = await adminDb.collection("users").doc(userId).get();
    if (!uSnap.exists) return false;
    const u = uSnap.data()!;
    return Boolean(
      u.isTester === true ||
        u.is_tester === true ||
        u.role === "tester" ||
        u.role === "Tester"
    );
  } catch {
    return false;
  }
}

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
      playTimeSeconds = 30,
      highestLevelReached,
      levelReached,
    } = body;

    if (!gameId || !courseId) {
      return NextResponse.json(
        { success: false, error: "Missing gameId or courseId" },
        { status: 400 }
      );
    }

    const safePlayTime = Math.max(1, Number(playTimeSeconds) || 1);
    const safeAccuracy = Math.min(100, Math.max(0, Math.round(Number(accuracyPercent) || 100)));
    const safeHighestLevel = Math.max(1, Number(highestLevelReached ?? levelReached ?? 0) || 1);

    // 1. Anti-Cheat & Secure Score Validation
    const validation = validateGameScore(sessionToken, Number(score), safePlayTime);
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

    // 1b. Loại trừ Tester: không nhận coins, không lưu kết quả, không lên BXH
    const tester = await isTesterUser(userId || "");
    if (tester) {
      return NextResponse.json({
        success: true,
        tester: true,
        message: "Tài khoản tester: kết quả không được ghi nhận.",
        data: {
          gameId,
          courseId,
          finalScore,
          userName: userName || "Tester",
          isWin,
          accuracyPercent: safeAccuracy,
          playTimeSeconds: safePlayTime,
          earnedCoins: 0,
          courseCompleted: false,
          unlockedNextCourse: false,
          verified: true,
          timestamp: new Date().toISOString(),
        },
      });
    }

    // 2. Update user coins + lấy tên thật (chỉ khi là học viên thật)
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
      } catch (err) {
        console.warn("Could not fetch user name in Admin Firestore:", err);
      }
    }

    if (!realUserName) {
      realUserName = userId && userId !== "anonymous" ? `Học viên #${userId.slice(-4)}` : "Học viên";
    }

    // 3. Lấy luật qua chặng của game (passRule) từ game_info
    let passRule: PassRule | null = null;
    try {
      const gRef = adminDb.collection("game_info").doc(gameId);
      const gSnap = await gRef.get();
      if (gSnap.exists) {
        const gData = gSnap.data();
        if (gData?.passRule && typeof gData.passRule === "object") {
          passRule = gData.passRule;
        }
      }
      if (!passRule && DEFAULT_PASS_RULES[gameId]) {
        passRule = DEFAULT_PASS_RULES[gameId];
      }
    } catch (err) {
      console.warn("Could not load passRule:", err);
    }

    // Đánh giá kết quả đủ đạt (passed = qualified) theo luật qua chặng của game
    const passed = evaluatePassRule(passRule, {
      score: finalScore,
      isWin: Boolean(isWin),
      accuracyPercent: safeAccuracy,
      highestLevelReached: safeHighestLevel,
    });

    // 4. Lưu kết quả: MỖI LẦN CHƠI = 1 DOC MỚI (không upsert/xóa kết quả cũ).
    // Chống trùng lặp khi SDK + Host cùng POST cho 1 phiên chơi (dùng sessionId).
    const sessionId = sessionToken ? decodeGameSessionToken(sessionToken)?.sessionId : null;
    const effectiveUserId = userId || "anonymous";

    try {
      let duplicateOf;
      if (sessionId) {
        const dupSnap = await adminDb
          .collection("game_results")
          .where("sessionId", "==", sessionId)
          .limit(1)
          .get();
        if (!dupSnap.empty) {
          duplicateOf = dupSnap.docs[0];
        }
      }

      if (duplicateOf) {
        // Cập nhật bản ghi của cùng phiên chơi (giữ điểm cao nhất) — KHÔNG tạo doc mới
        const prevScore = Number(duplicateOf.data().score) || 0;
        if (finalScore >= prevScore) {
          await duplicateOf.ref.update({
            score: Math.max(finalScore, prevScore),
            rawReportedScore: score,
            userName: realUserName,
            // isWin = passed để BXH lọc bằng index isWin==true theo đúng luật qua chặng
            isWin: passed,
            passed,
            accuracyPercent: safeAccuracy,
            playTimeSeconds: safePlayTime,
            highestLevelReached: safeHighestLevel,
            verifiedByAntiCheat: true,
            finishedAt: new Date().toISOString(),
          });
        }
      } else {
        // Lần chơi mới → thêm doc mới
        await adminDb.collection("game_results").add({
          gameId,
          courseId,
          pathId: pathId || "default_path",
          userId: effectiveUserId,
          userName: realUserName,
          score: finalScore,
          rawReportedScore: score,
          // isWin = passed để BXH lọc bằng index isWin==true theo đúng luật qua chặng
          isWin: passed,
          passed,
          accuracyPercent: safeAccuracy,
          playTimeSeconds: safePlayTime,
          highestLevelReached: safeHighestLevel,
          earnedCoins,
          verifiedByAntiCheat: true,
          finishedAt: new Date().toISOString(),
          sessionId: sessionId || "",
        });

        // Cộng coins chỉ khi tạo bản ghi mới (1 lần / phiên chơi)
        if (userId && userId !== "anonymous") {
          try {
            await adminDb.collection("users").doc(userId).update({
              coins: FieldValue.increment(earnedCoins),
            });
          } catch (err) {
            console.warn("Could not update user coins:", err);
          }
        }
      }
    } catch (saveErr) {
      console.warn("Could not save game_results record:", saveErr);
    }

    // 5. Return success response
    return NextResponse.json({
      success: true,
      message: "Kết quả trò chơi đã được kiểm định an toàn và ghi nhận thành công!",
      data: {
        gameId,
        courseId,
        pathId,
        finalScore,
        userName: realUserName,
        isWin: Boolean(isWin),
        passed,
        accuracyPercent: safeAccuracy,
        playTimeSeconds: safePlayTime,
        highestLevelReached: safeHighestLevel,
        earnedCoins,
        courseCompleted: passed,
        unlockedNextCourse: passed,
        verified: true,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : error ? String(error) : "Failed to finalize game session";
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}