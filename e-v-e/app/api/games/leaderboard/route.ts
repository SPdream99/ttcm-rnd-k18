import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/infrastructure/firebase/firebaseAdmin";

const userNamesCache = new Map<string, { name: string; timestamp: number }>();

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
      // Query game results for this specific game + course.
      // Ưu tiên truy vấn composite index đã tối ưu; nếu index chưa tồn tại (query lỗi)
      // thì fallback về truy vấn đơn giản hơn và lọc/sắp xếp tại code để BXH luôn chính xác.
      let snapshot: any = null;
      try {
        snapshot = await adminDb
          .collection("game_results")
          .where("gameId", "==", gameId)
          .where("courseId", "==", courseId)
          .where("isWin", "==", true)
          .orderBy("score", "desc")
          .limit(200)
          .get();
      } catch (compositeErr) {
        console.warn("Composite leaderboard query failed, falling back to simple query:", compositeErr);
        try {
          snapshot = await adminDb
            .collection("game_results")
            .where("gameId", "==", gameId)
            .where("courseId", "==", courseId)
            .limit(500)
            .get();
        } catch (simpleErr) {
          console.warn("Simple leaderboard query failed, falling back to gameId-only query:", simpleErr);
          snapshot = await adminDb
            .collection("game_results")
            .where("gameId", "==", gameId)
            .limit(1000)
            .get();
        }
      }

      if (snapshot && !snapshot.empty) {
        // Collect all unique userIds to fetch real names from users collection
        const userIds = new Set<string>();
        snapshot.docs.forEach((docSnap: any) => {
          const d = docSnap.data();
          const uId = d.userId || d.user_id || "";
          if (uId && uId !== "anonymous") {
            userIds.add(uId);
          }
        });

        // Fetch real names from in-memory cache or Firestore
        const userNamesMap = new Map<string, string>();
        const testerUserIds = new Set<string>();
        const now = Date.now();
        const missingUserIds: string[] = [];

        for (const uId of Array.from(userIds)) {
          const cached = userNamesCache.get(uId);
          if (cached && now - cached.timestamp < 300000) {
            userNamesMap.set(uId, cached.name);
          } else {
            missingUserIds.push(uId);
          }
        }

        if (missingUserIds.length > 0) {
          await Promise.all(
            missingUserIds.map(async (uId) => {
              try {
                const uDoc = await adminDb.collection("users").doc(uId).get();
                if (uDoc.exists) {
                  const uData = uDoc.data();
                  // Loại trừ tài khoản Tester khỏi Bảng Xếp Hạng
                  const isTester = Boolean(
                    uData?.isTester === true ||
                      uData?.is_tester === true ||
                      uData?.role === "tester" ||
                      uData?.role === "Tester"
                  );
                  if (isTester) {
                    testerUserIds.add(uId);
                  }
                  const realName =
                    uData?.name ||
                    uData?.displayName ||
                    uData?.fullName ||
                    (uData?.email ? uData.email.split("@")[0] : "");
                  if (realName) {
                    userNamesMap.set(uId, realName);
                    userNamesCache.set(uId, { name: realName, timestamp: now });
                  }
                }
              } catch (err) {
                console.warn("Could not fetch user name for ID:", uId, err);
              }
            })
          );
        }

        // Deduplicate: strictly keep ONLY the SINGLE BEST score per user
        const bestByUser = new Map<
          string,
          {
            id: string;
            userId: string;
            userName: string;
            name: string;
            score: number;
            accuracy: number;
            playTimeRaw: number;
            playTime: string;
            date: string;
            timestamp: number;
          }
        >();

        snapshot.docs.forEach((docSnap: any) => {
          const d = docSnap.data();

          // Chỉ tính kết quả đạt chỉ tiêu (isWin == passed theo luật qua chặng của game)
          // và đúng khóa học này (cần thiết khi fallback truy vấn theo gameId-only).
          if (d.isWin !== true) return;
          if ((d.courseId || d.course_id) !== courseId) return;

          const uId = d.userId || d.user_id || "";

          // Chỉ xếp hạng người chơi thật (có tài khoản). Bỏ qua khách ẩn danh & Tester.
          if (!uId || uId === "anonymous") return;
          if (testerUserIds.has(uId)) return;

          const dScore = Number(d.score) || 0;
          const dAccuracy = Number(d.accuracyPercent) ?? 100;
          const dPlayTime = Number(d.playTimeSeconds) || 9999;
          const dTimestamp = d.finishedAt ? new Date(d.finishedAt).getTime() : 0;

          const existing = bestByUser.get(uId);

          let isBetter = false;
          if (!existing) {
            isBetter = true;
          } else if (dScore > existing.score) {
            isBetter = true;
          } else if (dScore === existing.score) {
            if (dAccuracy > existing.accuracy) {
              isBetter = true;
            } else if (dAccuracy === existing.accuracy && dPlayTime < existing.playTimeRaw) {
              isBetter = true;
            }
          }

          if (isBetter) {
            const realName =
              userNamesMap.get(uId) ||
              d.userName ||
              (uId ? `Học viên #${uId.slice(-4)}` : "Học viên");

            bestByUser.set(uId, {
              id: docSnap.id,
              userId: uId,
              userName: realName,
              name: realName,
              score: dScore,
              accuracy: dAccuracy,
              playTimeRaw: dPlayTime,
              playTime: d.playTimeSeconds ? `${d.playTimeSeconds}s` : "--",
              date: d.finishedAt ? new Date(d.finishedAt).toLocaleDateString("vi-VN") : "Hôm nay",
              timestamp: dTimestamp,
            });
          }
        });

        // Sort by score DESC -> accuracy DESC -> playTime ASC -> timestamp DESC
        const sorted = Array.from(bestByUser.values()).sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
          return a.playTimeRaw - b.playTimeRaw;
        });

        sorted.forEach((entry, idx) => {
          rankings.push({
            ...entry,
            rank: idx + 1,
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
