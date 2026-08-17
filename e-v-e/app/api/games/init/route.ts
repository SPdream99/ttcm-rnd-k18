import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/infrastructure/firebase/firebaseAdmin";
import { generateGameSessionToken } from "@/lib/antiCheat";

const FALLBACK_PAIRS: Record<string, any> = {
  // ── Standard course IDs (fill_data.mjs) ──────────────────────────────────
  crs_coding_basics: {
    title: "Bài 1: Nhập Môn Tư Duy Lập Trình & Thuật Toán",
    pairs: [
      {
        id: "cb1",
        title: "Biến số (Variable) trong lập trình dùng để làm gì?",
        description: "Dùng để lưu trữ giá trị dữ liệu và có thể thay đổi trong quá trình chạy chương trình.",
        explanation: "Biến số là ô nhớ trong bộ nhớ RAM được đặt tên để lưu trữ các giá trị (số, chuỗi, boolean) và có thể tái sử dụng hoặc cập nhật giá trị trong suốt quá trình thực thi.",
        distractions: ["Dùng để tắt máy tính", "Dùng để in ra giấy", "Dùng để xóa mã nguồn"],
      },
      {
        id: "cb2",
        title: "Cấu trúc điều kiện IF - ELSE có chức năng gì?",
        description: "Kiểm tra điều kiện đúng/sai để quyết định luồng rẽ nhánh thực thi của thuật toán.",
        explanation: "Cấu trúc rẽ nhánh IF - ELSE cho phép chương trình đưa ra quyết định thực thi khối lệnh A nếu điều kiện thỏa mãn (True), ngược lại thực thi khối lệnh B (False).",
        distractions: ["Lặp lại vô tận câu lệnh", "Khai báo hàm mới", "Lưu trữ dữ liệu vào ổ cứng"],
      },
      {
        id: "cb3",
        title: "Vòng lặp (Loop) sinh ra để giải quyết bài toán nào?",
        description: "Tự động hóa việc lặp đi lặp lại một khối lệnh nhiều lần mà không cần viết lại mã.",
        explanation: "Vòng lặp (For, While) giúp tối ưu mã nguồn, giảm trùng lặp bằng cách tự động thực hiện lại một nhóm lệnh cho đến khi thỏa mãn điều kiện dừng.",
        distractions: ["Thay đổi độ phân giải màn hình", "Nâng cấp phần cứng", "Tăng tốc độ mạng"],
      },
      {
        id: "cb4",
        title: "Thuật toán (Algorithm) là gì?",
        description: "Tập hợp các bước chỉ dẫn tuần tự, rõ ràng nhằm giải quyết một vấn đề cụ thể.",
        explanation: "Thuật toán là quy trình hữu hạn các bước logic, có đầu vào (Input) và đầu ra (Output) xác định nhằm giải quyết một bài toán cụ thể.",
        distractions: ["Tên của một loại máy tính", "Bộ nhớ tạm thời RAM", "Trình duyệt web"],
      },
    ],
  },
  crs_computer_hardware: {
    title: "Bài 2: Khám Phá Phần Cứng & Kiến Trúc Máy Tính 3D",
    pairs: [
      {
        id: "hw1",
        title: "CPU (Central Processing Unit)",
        description: "Bộ vi xử lý trung tâm, đóng vai trò bộ não thực thi các lệnh và tính toán số học/logic của hệ thống.",
        explanation: "CPU là linh kiện quan trọng nhất của máy tính, điều khiển mọi hoạt động, giải mã lệnh và thực hiện các phép toán số học ALU.",
        distractions: ["Bộ nhớ tạm thời RAM", "Card hiển thị đồ họa GPU", "Khối nguồn PSU"],
      },
      {
        id: "hw2",
        title: "GPU (Graphics Processing Unit)",
        description: "Bộ xử lý đồ họa chuyên dụng với hàng ngàn lõi song song để kết xuất hình ảnh 3D và tính toán AI.",
        explanation: "GPU được thiết kế kiến trúc song song khổng lồ, chuyên dụng cho việc xử lý ma trận điểm ảnh 3D, dựng hình đồ họa và huấn luyện mô hình AI.",
        distractions: ["Ổ cứng thể rắn SSD", "Bo mạch chủ Motherboard", "Quạt tản nhiệt"],
      },
      {
        id: "hw3",
        title: "RAM (Random Access Memory)",
        description: "Bộ nhớ truy xuất ngẫu nhiên tốc độ cao, lưu trữ dữ liệu tạm thời khi các ứng dụng đang chạy.",
        explanation: "RAM là bộ nhớ bay hơi (volatile memory) có tốc độ truy xuất cực nhanh, chứa dữ liệu làm việc của hệ điều hành và phần mềm đang mở.",
        distractions: ["Lưu trữ vĩnh viễn ROM", "Cổng kết nối USB", "Chipset bán cầu nam"],
      },
      {
        id: "hw4",
        title: "SSD M.2 NVMe",
        description: "Ổ lưu trữ thể rắn chuẩn giao tiếp PCIe siêu tốc, lưu trữ hệ điều hành và file dữ liệu không bị mất khi tắt nguồn.",
        explanation: "SSD sử dụng chip nhớ flash NAND non-volatile với giao thức NVMe qua làn PCIe, cho tốc độ đọc ghi lên tới hàng nghìn MB/s.",
        distractions: ["Bộ nhớ đệm L3 Cache", "Thanh RAM DDR5", "Khối nguồn PSU"],
      },
    ],
  },
  crs_python_foundation: {
    title: "Bài 3: Lập Trình Python Căn Bản & Cấu Trúc Dữ Liệu",
    pairs: [
      {
        id: "py1",
        title: "Hàm print() trong Python có tác dụng gì?",
        description: "Xuất dữ liệu hoặc chuỗi thông báo ra màn hình console.",
        explanation: "Hàm print() là hàm tích hợp sẵn trong Python dùng để in các đối tượng, chuỗi văn bản ra luồng xuất chuẩn stdout.",
        distractions: ["Nhập dữ liệu từ bàn phím", "Xóa biến số", "Đóng chương trình"],
      },
      {
        id: "py2",
        title: "Kiểu dữ liệu Boolean trong Python nhận những giá trị nào?",
        description: "True hoặc False",
        explanation: "Kiểu Boolean (bool) trong Python là kiểu logic chỉ có 2 giá trị phân biệt được viết hoa chữ cái đầu là True và False.",
        distractions: ["1 hoặc 0", "Yes hoặc No", "Chuỗi văn bản"],
      },
      {
        id: "py3",
        title: "Danh sách (List) trong Python là gì?",
        description: "Cấu trúc dữ liệu có thứ tự, có thể thay đổi và chứa nhiều kiểu phần tử.",
        explanation: "List trong Python được định nghĩa bằng cặp ngoặc vuông [] và cho phép lập chỉ mục từ 0.",
        distractions: ["Hằng số bất biến", "Hàm gọi đệ quy", "File lưu trữ ổ cứng"],
      },
    ],
  },
  crs_data_structure_algorithms: {
    title: "Bài 4: Cấu Trúc Dữ Liệu & Giải Thuật Thực Chiến",
    pairs: [
      {
        id: "dsa1",
        title: "Độ phức tạp O(1) nghĩa là gì?",
        description: "Thời gian thực thi không phụ thuộc vào kích thước dữ liệu đầu vào.",
        explanation: "Thuật toán có độ phức tạp thời gian O(1) thực hiện số phép toán không đổi bất kể kích thước mảng là 1 hay 1 triệu phần tử.",
        distractions: ["Chạy chậm nhất khi dữ liệu lớn", "Luôn tốn 1 byte bộ nhớ", "Phải lặp qua toàn bộ mảng"],
      },
      {
        id: "dsa2",
        title: "Cấu trúc ngăn xếp Stack hoạt động theo nguyên lý nào?",
        description: "LIFO (Last In, First Out) - Vào sau ra trước.",
        explanation: "Phần tử được thêm vào cuối cùng trong Stack sẽ là phần tử đầu tiên được lấy ra khi gọi thao tác Pop.",
        distractions: ["FIFO (Vào trước ra trước)", "Ngẫu nhiên", "Sắp xếp theo thứ tự số"],
      },
    ],
  },
  crs_generative_ai_projects: {
    title: "Bài 5: Thiết Kế Ứng Dụng Trí Tuệ Nhân Tạo Với LLMs",
    pairs: [
      {
        id: "ai1",
        title: "Prompt Engineering trong Generative AI đóng vai trò gì?",
        description: "Tối ưu hóa câu lệnh đầu vào để hướng dẫn mô hình AI sinh ra kết quả chính xác nhất.",
        explanation: "Prompt Engineering là kỹ thuật thiết kế, tinh chỉnh chỉ thị đầu vào giúp mô hình ngôn ngữ lớn hiểu rõ bối cảnh và trả về kết quả mong muốn.",
        distractions: ["Cài đặt phần cứng GPU", "Giải mã mạng LAN", "Sửa lỗi syntax code"],
      },
      {
        id: "ai2",
        title: "AI Agent khác gì so với mô hình Chatbot truyền thống?",
        description: "Có khả năng tự lên kế hoạch, sử dụng Tools và thực thi hành động tự chủ để đạt mục tiêu.",
        explanation: "AI Agents vượt trội hơn chatbot nhờ khả năng suy luận nhiều bước, gọi API / Tools bên ngoài và tự kiểm tra kết quả thực thi.",
        distractions: ["Chỉ trả lời theo kịch bản sẵn", "Không thể kết nối Internet", "Chỉ chạy trên điện thoại"],
      },
    ],
  },

  // ── Legacy / Demo course IDs ──────────────────────────────────────────────
  crs_quantum_101: {
    title: "Vật Lý Lượng Tử Cơ Bản (Quantum 101)",
    pairs: [
      {
        id: "p1",
        title: "Hiện tượng quang điện chứng minh tính chất gì của ánh sáng?",
        description: "Tính chất hạt (Photon)",
        distractions: ["Tính chất sóng", "Tính chất phản xạ", "Tính chất tán sắc"],
        explanation: "Hiện tượng quang điện (Einstein giải thích năm 1905) chứng minh ánh sáng truyền đi dưới dạng các gói năng lượng rời rạc gọi là photon.",
      },
      {
        id: "p2",
        title: "Ai là người đề xuất phương trình hàm sóng mô tả trạng thái lượng tử?",
        description: "Erwin Schrödinger",
        explanation: "Nhà vật lý học người Áo Erwin Schrödinger đã đề xuất phương trình vi phân hàm sóng Psi mô tả xác suất tìm thấy hạt lượng tử.",
        distractions: ["Albert Einstein", "Niels Bohr", "Isaac Newton"],
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
};


async function handleInitGame(gameId?: string, courseId?: string, userId?: string) {
  if (!courseId) {
    return NextResponse.json(
      { success: false, error: "Missing courseId parameter" },
      { status: 400 }
    );
  }

  let title = "Khóa Học E-V-E";
  let pairs = [];

  let userRole = "student";
  try {
    const cDoc = await adminDb.collection("courses").doc(courseId).get();
    if (cDoc.exists) {
      const cData = cDoc.data()!;
      const isCourseAccepted = Boolean(cData.isAccepted ?? cData.is_accepted ?? false);

      // Xác định role của người dùng
      if (userId && userId !== "anonymous") {
        try {
          const uDoc = await adminDb.collection("users").doc(userId).get();
          userRole = uDoc.exists ? uDoc.data()?.role || "student" : "student";
        } catch {}
      }

      // Chỉ Admin mới có quyền xem trước khóa học chưa duyệt
      if (!isCourseAccepted && userRole !== "admin") {
        return NextResponse.json(
          {
            success: false,
            error: "not_approved",
            message: "Khóa học này chưa được Admin duyệt hoặc đã bị hủy duyệt. Bạn không thể sử dụng khóa học này trong trò chơi.",
          },
          { status: 403 }
        );
      }

      title = cData.title || title;
      if (Array.isArray(cData.pairs) && cData.pairs.length > 0) {
        pairs = cData.pairs;
      } else if (Array.isArray(cData.contentData) && cData.contentData.length > 0) {
        pairs = cData.contentData;
      } else {
        pairs =
          cData.contentData?.pairs ||
          cData.content_data?.pairs ||
          [];
      }
    } else {
      // Course không tồn tại trong DB
      if (userRole !== "admin") {
        return NextResponse.json(
          {
            success: false,
            error: "not_approved",
            message: "Khóa học không tồn tại hoặc chưa được duyệt.",
          },
          { status: 404 }
        );
      }
    }
  } catch {
    // Fallback
  }

  // Kiểm tra học sinh có đang học hoặc đã tham gia lộ trình CHỨA courseId này và lộ trình đó PHẢI ĐƯỢC DUYỆT (Admin & Giáo viên được miễn)
  if (userId && userId !== "anonymous" && userRole !== "admin" && userRole !== "teacher" && userRole !== "instructor") {
    try {
      const enrollmentsSnap = await adminDb
        .collection("student_learning_path")
        .where("student_id", "==", userId)
        .get();

      // Lấy danh sách tất cả các courses đã được duyệt để kiểm tra ràng buộc 1 chiều của Learning Path
      const allCoursesSnap = await adminDb.collection("courses").get();
      const approvedCourseSet = new Set<string>();
      allCoursesSnap.docs.forEach((docSnap) => {
        const cd = docSnap.data();
        if (cd.isAccepted ?? cd.is_accepted) {
          approvedCourseSet.add(docSnap.id);
        }
      });

      let hasEnrolledAndApprovedPath = false;
      let isPaused = false;

      for (const enDoc of enrollmentsSnap.docs) {
        const enData = enDoc.data();
        const lpDoc = await adminDb.collection("learning_path").doc(enData.learning_path_id).get();
        if (lpDoc.exists) {
          const lpData = lpDoc.data()!;
          const isPathApproved = Boolean(lpData.isAccepted ?? lpData.is_accepted ?? false);
          const lpCourses: string[] = Array.isArray(lpData.courses) ? lpData.courses : [];
          const allSubCoursesApproved = lpCourses.length > 0 && lpCourses.every((cId) => approvedCourseSet.has(cId));

          // Lộ trình phải được duyệt VÀ toàn bộ khóa học con phải được duyệt
          if (isPathApproved && allSubCoursesApproved && lpCourses.includes(courseId)) {
            if (enData.status === "paused") {
              isPaused = true;
            } else {
              hasEnrolledAndApprovedPath = true;
              break;
            }
          }
        }
      }

      if (isPaused && !hasEnrolledAndApprovedPath) {
        return NextResponse.json(
          {
            success: false,
            error: "paused",
            message: "Lớp học chứa bài học này đang ở trạng thái TẠM DỪNG (BẢO LƯU). Bạn cần kích hoạt lại lớp học để tiếp tục chơi.",
          },
          { status: 403 }
        );
      }

      if (!hasEnrolledAndApprovedPath) {
        return NextResponse.json(
          {
            success: false,
            error: "not_enrolled_or_unapproved",
            message: "Lộ trình hoặc bài học này chưa được phê duyệt (hoặc đã bị hủy duyệt). Bạn không thể sử dụng trong trò chơi.",
          },
          { status: 403 }
        );
      }
    } catch (authCheckErr) {
      console.warn("Authorization check warning in init route:", authCheckErr);
    }
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
  const memoryMatchMax = pairs.length * 35 + 5 * 15 + 100;
  const quizMax = pairs.length * 50;
  const maxScore = Math.ceil(Math.max(memoryMatchMax, quizMax) * 1.2);
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
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { gameId, courseId, userId } = body;
    return await handleInitGame(gameId, courseId, userId);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const gameId = searchParams.get("gameId") || undefined;
    const courseId = searchParams.get("courseId") || undefined;
    const userId = searchParams.get("userId") || undefined;
    return await handleInitGame(gameId, courseId, userId);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
