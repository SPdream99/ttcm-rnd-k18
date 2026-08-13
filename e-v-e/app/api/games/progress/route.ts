import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { gameId, courseId, userId, score, currentStreak, progressPercent } = body;

    if (!gameId || !courseId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (gameId, courseId)" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      gameId,
      courseId,
      userId: userId || "anonymous",
      reportedScore: score ?? 0,
      reportedProgress: progressPercent ?? 0,
      currentStreak: currentStreak ?? 0,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update game progress" },
      { status: 500 }
    );
  }
}
