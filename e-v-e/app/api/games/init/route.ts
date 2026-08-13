import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { generateGameSessionToken } from "@/lib/antiCheat";

const FALLBACK_PAIRS: Record<string, any> = {
  crs_quantum_101: {
    title: "Vật Lý Lượng Tử Cơ Bản (Quantum 101)",
    pairs: [
      {
        id: "p1",
        title: "Hiện tượng quang điện chứng minh tính chất gì của ánh sáng?",
        description: "Tính chất hạt (Photon)",
        distractions: ["Tính chất sóng", "Tính chất phản xạ", "Tính chất tán sắc"],
        image_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600",
      },
      {
        id: "p2",
        title: "Ai là người đề xuất phương trình hàm sóng mô tả trạng thái lượng tử?",
        description: "Erwin Schrödinger",
        distractions: ["Albert Einstein", "Niels Bohr", "Isaac Newton"],
      },
      {
        id: "p3",
        title: "Hằng số Planck có ký hiệu là gì?",
        description: "h",
        distractions: ["c", "e", "k"],
      },
    ],
  },
  crs_astrophysics: {
    title: "Thiên Văn Học & Hố Đen Vũ Trụ",
    pairs: [
      {
        id: "p4",
        title: "Ranh giới mà không vật chất nào có thể thoát khỏi hố đen gọi là gì?",
        description: "Chân trời sự kiện (Event Horizon)",
        distractions: ["Điểm kỳ dị", "Vùng bồi tụ", "Vành đai Kuiper"],
      },
    ],
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { gameId, courseId, userId } = body;

    if (!courseId) {
      return NextResponse.json(
        { success: false, error: "Missing courseId parameter" },
        { status: 400 }
      );
    }

    let title = "Khóa Học E-V-E";
    let pairs = [];

    try {
      const cSnap = await getDoc(doc(db, "courses", courseId));
      if (cSnap.exists()) {
        const cData = cSnap.data();
        title = cData.title || title;
        pairs = Array.isArray(cData.contentData)
          ? cData.contentData
          : cData.contentData?.pairs || [];
      }
    } catch {
      // Fallback
    }

    if (!pairs || pairs.length === 0) {
      const fb = FALLBACK_PAIRS[courseId] || FALLBACK_PAIRS["crs_quantum_101"];
      title = fb.title;
      pairs = fb.pairs;
    }

    // Generate Anti-Cheat signed session token
    const maxScore = Math.max(100, pairs.length * 25);
    const { sessionToken, sessionId } = generateGameSessionToken({
      gameId: gameId || "eve_game_engine",
      courseId,
      userId: userId || "anonymous",
      maxScore,
      minPlayTimeSeconds: 5, // Requires at least 5 seconds of gameplay
    });

    return NextResponse.json({
      success: true,
      gameId: gameId || "eve_game_engine",
      courseId,
      courseTitle: title,
      totalPairs: pairs.length,
      pairs,
      targetScore: 100,
      maxScore,
      sessionToken,
      sessionId,
      protocol: "EVE_GAME_V2_SECURE",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
