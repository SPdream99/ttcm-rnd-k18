import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/infrastructure/firebase/firebaseAdmin";
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
        explanation: "Hiện tượng quang điện (Einstein giải thích năm 1905) chứng minh ánh sáng truyền đi dưới dạng các gói năng lượng rời rạc gọi là photon.",
        image_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600",
      },
      {
        id: "p2",
        title: "Ai là người đề xuất phương trình hàm sóng mô tả trạng thái lượng tử?",
        description: "Erwin Schrödinger",
        explanation: "Nhà vật lý học người Áo Erwin Schrödinger đã đề xuất phương trình vi phân hàm sóng Psi mô tả xác suất tìm thấy hạt lượng tử.",
        distractions: ["Albert Einstein", "Niels Bohr", "Isaac Newton"],
      },
      {
        id: "p3",
        title: "Hằng số Planck có ký hiệu là gì?",
        description: "h",
        explanation: "Hằng số Planck (h = 6.626 x 10^-34 J.s) do Max Planck khám phá, là hằng số nền tảng của vật lý lượng tử.",
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
        explanation: "Chân trời sự kiện là biên giới không thời gian xung quanh hố đen mà tại đó vận tốc vũ trụ cấp 2 vượt quá vận tốc ánh sáng.",
        distractions: ["Điểm kỳ dị", "Vùng bồi tụ", "Vành đai Kuiper"],
      },
    ],
  },
  crs_coding_basics: {
    title: "Nhập Môn Tư Duy Lập Trình & Thuật Toán",
    pairs: [
      {
        id: "p1",
        title: "Trong lập trình, cấu trúc điều kiện nào dùng để rẽ nhánh khi đúng hoặc sai?",
        description: "Cấu trúc IF - ELSE",
        explanation: "Cấu trúc IF - ELSE cho phép chương trình kiểm tra biểu thức điều kiện Logic (Boolean). Nếu biểu thức trả về True thì thực thi khối lệnh IF, ngược lại thực thi khối lệnh ELSE.",
        distractions: ["Vòng lặp For", "Vòng lặp While", "Hàm Function"],
      },
      {
        id: "p2",
        title: "Linh kiện nào được coi là 'Bộ Não' xử lý trung tâm của máy tính?",
        description: "CPU (Central Processing Unit)",
        explanation: "CPU là bộ vi xử lý trung tâm, chịu trách nhiệm nhận, giải mã và thực thi các chỉ lệnh của chương trình máy tính bằng các khối ALU và Control Unit.",
        distractions: ["RAM", "Ổ cứng SSD", "Bộ nguồn PSU"],
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

    // Kiểm tra học sinh có đang học hoặc đã tham gia lộ trình chứa courseId này hay không
    if (userId && userId !== "anonymous") {
      try {
        const uDoc = await adminDb.collection("users").doc(userId).get();
        const userRole = uDoc.exists ? uDoc.data()?.role : "student";

        // Admin & Teacher có quyền xem trước (god-mode)
        if (userRole !== "admin" && userRole !== "teacher") {
          const enrollmentsSnap = await adminDb
            .collection("student_learning_path")
            .where("student_id", "==", userId)
            .get();

          let hasEnrolledCourse = false;
          let isPaused = false;

          for (const enDoc of enrollmentsSnap.docs) {
            const enData = enDoc.data();
            const lpDoc = await adminDb.collection("learning_path").doc(enData.learning_path_id).get();
            if (lpDoc.exists) {
              const lpCourses = lpDoc.data()?.courses || [];
              if (lpCourses.includes(courseId)) {
                hasEnrolledCourse = true;
                if (enData.status === "paused") {
                  isPaused = true;
                }
                break;
              }
            }
          }

          if (isPaused) {
            return NextResponse.json(
              {
                success: false,
                error: "paused",
                message: "Lớp học chứa bài học này đang ở trạng thái TẠM DỪNG (BẢO LƯU). Bạn cần kích hoạt lại lớp học để tiếp tục chơi.",
              },
              { status: 403 }
            );
          }

          if (!hasEnrolledCourse) {
            return NextResponse.json(
              {
                success: false,
                error: "not_enrolled",
                message: "Bạn chưa đăng ký hoặc chưa từng học lộ trình chứa bài học này. Vui lòng tham gia lớp học để mở khóa!",
              },
              { status: 403 }
            );
          }
        }
      } catch (authCheckErr) {
        console.warn("Authorization check warning in init route:", authCheckErr);
      }
    }

    try {
      const cDoc = await adminDb.collection("courses").doc(courseId).get();
      if (cDoc.exists) {
        const cData = cDoc.data()!;
        title = cData.title || title;
        pairs = Array.isArray(cData.contentData)
          ? cData.contentData
          : cData.contentData?.pairs || cData.content_data?.pairs || [];
      }
    } catch {
      // Fallback
    }

    if (!pairs || pairs.length === 0) {
      if (FALLBACK_PAIRS[courseId]) {
        const fb = FALLBACK_PAIRS[courseId];
        title = fb.title;
        pairs = fb.pairs;
      }
    }

    // Nếu trò chơi cần extra data mà dữ liệu pairs hoàn toàn rỗng -> Báo lỗi không load được game
    if (!pairs || pairs.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "empty_extra_data",
          message: "Khóa học này chưa có dữ liệu câu hỏi / học liệu (Extra Data trống). Không thể khởi chạy trò chơi!",
        },
        { status: 400 }
      );
    }

    // Generate Anti-Cheat signed session token
    const maxScore = Math.max(100, pairs.length * 25);
    const { sessionToken, sessionId } = generateGameSessionToken({
      gameId: gameId || "eve_game_engine",
      courseId,
      userId: userId || "anonymous",
      maxScore,
      minPlayTimeSeconds: 5,
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
