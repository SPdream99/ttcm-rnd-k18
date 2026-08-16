/**
 * E-V-E Live Page Context Service
 * Tự động phân tích và trích xuất ngữ cảnh hoạt động của người dùng (Học sinh / Giáo viên) trên trang hiện tại.
 * Giúp Gia sư AI nắm bắt chính xác người dùng đang học bài nào, chơi game gì, hay đang soạn nội dung nào để hỗ trợ sát sườn.
 */

export interface LivePageContext {
  pathname: string;
  role: "student" | "teacher" | "admin";
  pageName: string;
  activityDescription: string;
  pageSnippet?: string;
}

const ROUTE_DESCRIPTIONS: Record<string, { name: string; activity: string }> = {
  // ── Student Routes ──
  "/student/dashboard": {
    name: "Bảng Điều Khiển Học Sinh (Dashboard)",
    activity: "Đang xem tổng quan tiến độ học tập, số dư Coins, chuỗi ngày học và các lớp học đã đăng ký.",
  },
  "/student/learning-paths": {
    name: "Bản Đồ Lộ Trình Học Tập (Learning Paths)",
    activity: "Đang xem và lựa chọn lộ trình học phân chặng (ví dụ: Fullstack Developer, Lập trình AI, Tư duy Thuật toán).",
  },
  "/student/classes": {
    name: "Lớp Học Của Tôi",
    activity: "Đang xem danh sách các khóa học đã tham gia và tiến độ bài học.",
  },
  "/student/games": {
    name: "Kho Minigame Giáo Dục (Game Center)",
    activity: "Đang duyệt qua danh sách các trò chơi học tập tương tác (Ghép thẻ bài Memory Match, Đấu Boss trắc nghiệm Quiz...).",
  },
  "/student/ai-tutor": {
    name: "Gia Sư Học Tập E-V-E (AI Tutor Toàn Màn Hình)",
    activity: "Đang trực tiếp trò chuyện và học tập cùng Gia sư AI.",
  },
  "/student/leaderboard": {
    name: "Bảng Xếp Hạng Học Sinh (Leaderboard)",
    activity: "Đang xem bảng xếp hạng thành tích, điểm số và số lượng game đã hoàn thành của toàn hệ thống.",
  },
  "/student/shop": {
    name: "Cửa Hàng Đổi Thưởng & Trang Bị (Shop)",
    activity: "Đang dùng Coins để đổi khung Avatar, huy hiệu danh giá và trang bị profile.",
  },
  "/student/profile": {
    name: "Hồ Sơ Cá Nhân & Cài Đặt AI Key",
    activity: "Đang tùy chỉnh hồ sơ học sinh, quản lý mã hóa khóa Gemini API Key và thiết lập xác thực 2FA.",
  },

  // ── Teacher Routes ──
  "/teacher/dashboard": {
    name: "Bảng Điều Khiển Giảng Viên (Teacher Dashboard)",
    activity: "Đang theo dõi thống kê bài giảng, tổng số học sinh và báo cáo đào tạo.",
  },
  "/teacher/upload-center": {
    name: "Trung Tâm Soạn Bài & Tạo Học Liệu (Upload Center)",
    activity: "Đang soạn thảo bài học mới, nhập các cặp câu hỏi JSON Pairs và cấu hình tính tương tác bài giảng.",
  },
  "/teacher/my-contents": {
    name: "Quản Lý Bài Giảng & Nội Dung Đã Tạo",
    activity: "Đang quản lý danh sách các khóa học, quyền riêng tư (Visibility) và chỉnh sửa học liệu đã xuất bản.",
  },
  "/teacher/game-sdk-guide": {
    name: "Tài Liệu & Hướng Dẫn Tích Hợp Game SDK",
    activity: "Đang tra cứu tài liệu kỹ thuật về cách tích hợp chuẩn Game SDK và cơ chế nạp Extra Data.",
  },
  "/teacher/ai-tutor": {
    name: "Trợ Lý Giảng Dạy Sư Phạm (AI Teacher Assistant)",
    activity: "Đang nhận tư vấn sư phạm, sinh đề thi trắc nghiệm và gợi ý thiết kế giáo án từ Trợ giảng AI.",
  },
  "/teacher/profile": {
    name: "Hồ Sơ Giáo Viên",
    activity: "Đang cập nhật thông tin chuyên môn giảng viên và quản lý cấu hình bảo mật tài khoản.",
  },
};

/**
 * Lấy ngữ cảnh chi tiết của trang hiện tại phía Client
 */
export function getCurrentLivePageContext(role: "student" | "teacher" | "admin" = "student"): LivePageContext {
  if (typeof window === "undefined") {
    return {
      pathname: "/",
      role,
      pageName: "Trang Chủ E-V-E",
      activityDescription: "Đang ở hệ sinh thái giáo dục trực tuyến E-V-E.",
    };
  }

  const pathname = window.location.pathname;

  // 1. Kiểm tra nếu khớp với route cố định
  if (ROUTE_DESCRIPTIONS[pathname]) {
    const info = ROUTE_DESCRIPTIONS[pathname];
    return {
      pathname,
      role,
      pageName: info.name,
      activityDescription: info.activity,
      pageSnippet: extractPageTextSnippet(),
    };
  }

  // 2. Kiểm tra màn chơi game chi tiết: /student/play/[game_id]/[course_id]
  if (pathname.startsWith("/student/play/")) {
    const parts = pathname.split("/").filter(Boolean);
    const gameId = parts[2] || "game";
    const courseId = parts[3] || "";

    const h1Text = document.querySelector("h1, h2, h3")?.textContent?.trim() || "";
    const pageName = `Màn Chơi Game Học Tập: ${gameId}`;
    const activityDescription = courseId
      ? `Đang trực tiếp tham gia thử thách trò chơi [${gameId}] kết hợp bài học [${courseId}]. Điểm số sẽ được cập nhật lên Bảng xếp hạng.`
      : `Đang ở sảnh chờ chọn khóa học cho trò chơi [${gameId}].`;

    return {
      pathname,
      role,
      pageName: h1Text ? `${pageName} — ${h1Text}` : pageName,
      activityDescription,
      pageSnippet: extractPageTextSnippet(),
    };
  }

  // 3. Kiểm tra xem chi tiết khóa học / lớp học: /student/classes/[id] hoặc /student/courses/[id]
  if (pathname.startsWith("/student/classes/") || pathname.startsWith("/student/courses/")) {
    const courseTitle = document.querySelector("h1, h2")?.textContent?.trim() || "";
    return {
      pathname,
      role,
      pageName: courseTitle ? `Lớp Học: ${courseTitle}` : "Chi Tiết Lớp Học & Bài Giảng",
      activityDescription: `Đang xem nội dung bài giảng, danh sách chặng bài và làm bài tập của môn học: ${courseTitle || "này"}.`,
      pageSnippet: extractPageTextSnippet(),
    };
  }

  // 4. Default Fallback
  const docTitle = document.title || "E-V-E Platform";
  const mainHeading = document.querySelector("h1, h2")?.textContent?.trim() || "";

  return {
    pathname,
    role,
    pageName: mainHeading || docTitle,
    activityDescription: `Đang hoạt động tại khu vực: ${mainHeading || docTitle}.`,
    pageSnippet: extractPageTextSnippet(),
  };
}

/**
 * Trích xuất một đoạn nội dung nổi bật hiển thị trên màn hình hiện tại (tối đa 400 ký tự)
 */
function extractPageTextSnippet(): string {
  try {
    const mainEl = document.querySelector("main") || document.body;
    if (!mainEl) return "";

    // Lấy các thẻ tiêu đề và đoạn văn nổi bật
    const keyElements = Array.from(mainEl.querySelectorAll("h1, h2, h3, h4, p, [role='heading']"))
      .map((el) => el.textContent?.trim() || "")
      .filter((text) => text.length > 5 && !text.includes("Menu") && !text.includes("Đăng xuất"));

    const combined = keyElements.slice(0, 5).join(" | ");
    return combined.length > 400 ? combined.substring(0, 400) + "..." : combined;
  } catch {
    return "";
  }
}
