import fs from "fs";
import path from "path";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const equalsIdx = trimmed.indexOf("=");
      if (equalsIdx !== -1) {
        const key = trimmed.slice(0, equalsIdx).trim();
        let val = trimmed.slice(equalsIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[key] = val;
      }
    }
  }
}

loadEnvLocal();

const serviceAccountRaw = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY;
if (!serviceAccountRaw) {
  console.error("Không tìm thấy FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY trong .env.local");
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(serviceAccountRaw);
} catch (err) {
  console.error("Lỗi parse FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY:", err.message);
  process.exit(1);
}

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}

const db = getFirestore("default");

const COLLECTIONS = [
  "users",
  "teachers",
  "classes",
  "class_members",
  "assignments",
  "submissions",
  "lectures",
  "courses",
  "learning_path",
  "student_learning_path",
  "game_info",
  "game_results",
  "shop_items",
  "announcements",
];

// ─── Dữ Liệu Khởi Tạo Chuẩn Tiếng Việt Có Dấu 100% ──────────────────────────

const SEED_DATA = {
  users: [
    {
      id: "f89rGIGZVlQoA5J82jqavzWEvIs2",
      name: "Nguyễn Thành Đạt",
      displayName: "Nguyễn Thành Đạt",
      email: "dat@gmail.com",
      role: "student",
      status: "active",
      coins: 450,
      profile_decorations: ["item_frame_cosmic_01", "item_title_explorer"],
      bio: "Học viên chuyên ngành Công Nghệ Phần Mềm & Lập Trình Game tại E-V-E.",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
      twoFactorEnabled: true,
    },
    {
      id: "YMdybMQPIYWQVlUmb346L92P3z53",
      name: "ThS. Nguyễn Thành Đạt",
      displayName: "ThS. Nguyễn Thành Đạt",
      email: "dat1@gmail.com",
      role: "teacher",
      status: "active",
      coins: 1500,
      profile_decorations: ["item_title_master"],
      bio: "Giảng viên chuyên ngành Khoa Học Máy Tính & Trò Chơi Giáo Dục tại E-V-E.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      twoFactorEnabled: true,
    },
    {
      id: "4iFol5R21cTdeB5UmKxKal2n4tl2",
      name: "Quản Trị Viên Đạt",
      displayName: "Quản Trị Viên Đạt",
      email: "dat2@gmail.com",
      role: "admin",
      status: "active",
      coins: 9999,
      profile_decorations: ["item_frame_gold", "item_title_admin"],
      bio: "Quản trị viên toàn hệ thống nền tảng học tập E-V-E Learning Hub.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80",
      twoFactorEnabled: true,
    },
    {
      id: "student_minh_anh_01",
      name: "Trần Minh Anh",
      displayName: "Trần Minh Anh",
      email: "minhanh@gmail.com",
      role: "student",
      status: "active",
      coins: 780,
      profile_decorations: ["item_frame_cosmic_01"],
      bio: "Học sinh đam mê thuật toán Python và thiết kế Web.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
      twoFactorEnabled: true,
    },
    {
      id: "student_bao_ngoc_02",
      name: "Lê Bảo Ngọc",
      displayName: "Lê Bảo Ngọc",
      email: "baongoc@gmail.com",
      role: "student",
      status: "active",
      coins: 620,
      profile_decorations: [],
      bio: "Học viên xuất sắc chặng 2 môn Lập trình Python.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80",
      twoFactorEnabled: true,
    },
  ],

  teachers: [
    {
      id: "YMdybMQPIYWQVlUmb346L92P3z53",
      name: "ThS. Nguyễn Thành Đạt",
      fullName: "ThS. Nguyễn Thành Đạt",
      email: "dat1@gmail.com",
      specialty: "Lập Trình Web, AI & Game Giáo Dục",
      bio: "Chuyên gia thiết kế trò chơi học tập và giao diện người dùng E-V-E.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      rating: 4.9,
      totalStudents: 128,
    },
    {
      id: "teacher_nhatanh_01",
      name: "GS. Nguyễn Nhật Ánh",
      fullName: "GS. Nguyễn Nhật Ánh",
      email: "nhatanh@eve.edu.vn",
      specialty: "Trí Tuệ Nhân Tạo & Kiến Trúc Hệ Thống",
      bio: "Trưởng ban học thuật E-V-E, chuyên gia về AI Agents và Machine Learning.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      rating: 5.0,
      totalStudents: 240,
    },
  ],

  classes: [
    {
      id: "cls_web_dev_k18",
      name: "Lập Trình Web Chuyên Nghiệp K18",
      code: "WD-K18-01",
      teacher_id: "YMdybMQPIYWQVlUmb346L92P3z53",
      teacher_name: "ThS. Nguyễn Thành Đạt",
      subject: "Phát Triển Web Fullstack",
      room: "Phòng Lab 402 / Trực Tuyến Google Meet",
      schedule: "Thứ 2 - Thứ 4: 19h30 - 21h30",
      total_students: 24,
      status: "active",
      description: "Đào tạo chuyên sâu Next.js, React, Node.js, Firebase và Kiến trúc phần mềm hiện đại.",
    },
    {
      id: "cls_ai_ml_2026",
      name: "Nền Tảng Trí Tuệ Nhân Tạo & Machine Learning",
      code: "AI-2026-02",
      teacher_id: "YMdybMQPIYWQVlUmb346L92P3z53",
      teacher_name: "ThS. Nguyễn Thành Đạt",
      subject: "Trí Tuệ Nhân Tạo",
      room: "Phòng Lab 501 / Trực Tuyến",
      schedule: "Thứ 3 - Thứ 6: 18h00 - 20h00",
      total_students: 30,
      status: "active",
      description: "Khám phá mô hình ngôn ngữ lớn LLM, Computer Vision và Xây dựng Ứng dụng AI thực tế.",
    },
  ],

  class_members: [
    {
      id: "cls_web_dev_k18_f89rGIGZVlQoA5J82jqavzWEvIs2",
      class_id: "cls_web_dev_k18",
      student_id: "f89rGIGZVlQoA5J82jqavzWEvIs2",
      student_name: "Nguyễn Thành Đạt",
      student_email: "dat@gmail.com",
      role: "Student",
      attendance_rate: 96,
    },
    {
      id: "cls_web_dev_k18_student_minh_anh_01",
      class_id: "cls_web_dev_k18",
      student_id: "student_minh_anh_01",
      student_name: "Trần Minh Anh",
      student_email: "minhanh@gmail.com",
      role: "Student",
      attendance_rate: 100,
    },
    {
      id: "cls_ai_ml_2026_f89rGIGZVlQoA5J82jqavzWEvIs2",
      class_id: "cls_ai_ml_2026",
      student_id: "f89rGIGZVlQoA5J82jqavzWEvIs2",
      student_name: "Nguyễn Thành Đạt",
      student_email: "dat@gmail.com",
      role: "Student",
      attendance_rate: 100,
    },
  ],

  assignments: [
    {
      id: "asm_react_components_01",
      class_id: "cls_web_dev_k18",
      teacher_id: "YMdybMQPIYWQVlUmb346L92P3z53",
      title: "Xây Dựng Giao Diện Dashboard React Cơ Bản",
      description: "Thiết kế component Dashboard với Tailwind CSS và quản lý state với React Hook.",
      subject: "Phát Triển Web Fullstack",
      dueDate: "2026-08-25",
      max_score: 100,
      score: "100 Điểm",
      status: "pending",
    },
    {
      id: "asm_nextjs_api_02",
      class_id: "cls_web_dev_k18",
      teacher_id: "YMdybMQPIYWQVlUmb346L92P3z53",
      title: "Tích Hợp REST API & Xác Thực Firebase Auth",
      description: "Xây dựng Router Handler Next.js kết nối Firestore và kiểm tra token xác thực.",
      subject: "Phát Triển Web Fullstack",
      dueDate: "2026-08-30",
      max_score: 100,
      score: "100 Điểm",
      status: "submitted",
    },
    {
      id: "asm_python_matrix_01",
      class_id: "cls_ai_ml_2026",
      teacher_id: "YMdybMQPIYWQVlUmb346L92P3z53",
      title: "Xử Lý Ma Trận Dữ Liệu Với NumPy & Pandas",
      description: "Đọc tập dữ liệu CSV, chuẩn hóa dữ liệu và tính toán ma trận tương quan.",
      subject: "Trí Tuệ Nhân Tạo",
      dueDate: "2026-09-05",
      max_score: 100,
      score: "100 Điểm",
      status: "pending",
    },
  ],

  submissions: [
    {
      id: "asm_nextjs_api_02_f89rGIGZVlQoA5J82jqavzWEvIs2",
      assignment_id: "asm_nextjs_api_02",
      class_id: "cls_web_dev_k18",
      student_id: "f89rGIGZVlQoA5J82jqavzWEvIs2",
      student_name: "Nguyễn Thành Đạt",
      file_url: "https://github.com/SPdream99/ttcm-rnd-k18",
      status: "submitted",
      score: 95,
      feedback: "Mã nguồn sạch sẽ, cấu trúc component và API chuẩn Clean Architecture.",
    },
  ],

  lectures: [
    {
      id: "lec_web_arch_01",
      class_id: "cls_web_dev_k18",
      title: "Bài 1: Tổng Quan Kiến Trúc Fullstack Next.js & Firebase",
      description: "Tìm hiểu Server Components, Client Components và cơ chế Hydration.",
      document_url: "https://nextjs.org/docs",
      order: 1,
      date: "2026-08-10",
    },
    {
      id: "lec_web_state_02",
      class_id: "cls_web_dev_k18",
      title: "Bài 2: Quản Lý State Nâng Cao & Tích Hợp Clean Architecture",
      description: "Ứng dụng Ports & Adapters trong hệ thống React TypeScript.",
      document_url: "https://react.dev",
      order: 2,
      date: "2026-08-14",
    },
  ],

  courses: [
    {
      id: "crs_coding_basics",
      title: "Bài 1: Nhập Môn Tư Duy Lập Trình & Thuật Toán",
      description: "Nắm vững các khái niệm nền tảng: Biến số, Kiểu dữ liệu, Cấu trúc rẽ nhánh IF-ELSE, Vòng lặp và Tư duy giải thuật.",
      category: "Khóa Học Lập Trình",
      difficulty: "Cơ Bản",
      author_id: "YMdybMQPIYWQVlUmb346L92P3z53",
      author_name: "ThS. Nguyễn Thành Đạt",
      visibility: "public",
      is_accepted: true,
      estimated_hours: 12,
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
    {
      id: "crs_computer_hardware",
      title: "Bài 2: Khám Phá Phần Cứng & Kiến Trúc Máy Tính 3D",
      description: "Tìm hiểu chức năng và nguyên lý hoạt động của CPU, RAM, GPU, Bo mạch chủ và Ổ cứng SSD.",
      category: "Kiến Trúc Máy Tính",
      difficulty: "Thực Hành",
      author_id: "YMdybMQPIYWQVlUmb346L92P3z53",
      author_name: "ThS. Nguyễn Thành Đạt",
      visibility: "public",
      is_accepted: true,
      estimated_hours: 15,
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
    {
      id: "crs_python_foundation",
      title: "Bài 3: Lập Trình Python Căn Bản & Cấu Trúc Dữ Liệu",
      description: "Làm quen với ngôn ngữ lập trình Python, cú pháp hiện đại, kiểu dữ liệu và hàm xử lý chuỗi / mảng.",
      category: "Khóa Học Lập Trình",
      difficulty: "Cơ Bản",
      author_id: "YMdybMQPIYWQVlUmb346L92P3z53",
      author_name: "ThS. Nguyễn Thành Đạt",
      visibility: "free_to_share",
      is_accepted: true,
      estimated_hours: 18,
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
    {
      id: "crs_generative_ai_projects",
      title: "Bài 4: Thiết Kế Ứng Dụng Trí Tuệ Nhân Tạo Với LLMs",
      description: "Ứng dụng các mô hình trí tuệ nhân tạo sinh (Generative AI), Prompt Engineering và xây dựng AI Agents.",
      category: "Trí Tuệ Nhân Tạo",
      difficulty: "Nâng Cao",
      author_id: "teacher_nhatanh_01",
      author_name: "GS. Nguyễn Nhật Ánh",
      visibility: "public",
      is_accepted: true,
      estimated_hours: 24,
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
  ],

  learning_path: [
    {
      id: "lp_fullstack_2026",
      title: "Lộ Trình Toàn Diện: Từ Con Số 0 Đến Lập Trình Viên Chuyên Nghiệp 2026",
      description: "Lộ trình đào tạo toàn diện từ tư duy giải thuật, phần cứng máy tính đến lập trình ứng dụng và tích hợp game giáo dục tương tác.",
      category: "Lập Trình Web & Game",
      difficulty: "Cơ Bản",
      author_id: "YMdybMQPIYWQVlUmb346L92P3z53",
      visibility: "public",
      is_accepted: true,
      courses: ["crs_coding_basics", "crs_computer_hardware", "crs_python_foundation"],
      learning_objectives: [
        "Thành thạo tư duy lập trình và thuật toán giải quyết vấn đề",
        "Hiểu rõ kiến trúc phần cứng và luồng dữ liệu trong máy tính",
        "Xây dựng thành thạo ứng dụng Python và tích hợp Game SDK",
      ],
      estimated_hours: 45,
      thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "lp_ai_mastery_2026",
      title: "Lộ Trình Chuyên Sâu: Trí Tuệ Nhân Tạo & Ứng Dụng Generative AI 2026",
      description: "Chinh phục tư duy lập trình Python nâng cao, hiểu rõ nguyên lý mô hình ngôn ngữ lớn và xây dựng AI Agents thông minh.",
      category: "Trí Tuệ Nhân Tạo",
      difficulty: "Trung Cấp",
      author_id: "teacher_nhatanh_01",
      visibility: "public",
      is_accepted: true,
      courses: ["crs_python_foundation", "crs_generative_ai_projects"],
      learning_objectives: [
        "Nắm vững lập trình Python và xử lý dữ liệu nâng cao",
        "Xây dựng ứng dụng tích hợp LLM API và Prompt Engineering",
        "Thiết kế hệ thống AI Agents tự động hóa tác vụ phức tạp",
      ],
      estimated_hours: 42,
      thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&auto=format&fit=crop&q=80",
    },
  ],

  student_learning_path: [
    {
      id: "f89rGIGZVlQoA5J82jqavzWEvIs2_lp_fullstack_2026",
      student_id: "f89rGIGZVlQoA5J82jqavzWEvIs2",
      student_name: "Nguyễn Thành Đạt",
      learning_path_id: "lp_fullstack_2026",
      progress: 66,
      status: "active",
      current_course_index: 1,
      completedCourses: ["crs_coding_basics", "crs_computer_hardware"],
    },
    {
      id: "f89rGIGZVlQoA5J82jqavzWEvIs2_lp_ai_mastery_2026",
      student_id: "f89rGIGZVlQoA5J82jqavzWEvIs2",
      student_name: "Nguyễn Thành Đạt",
      learning_path_id: "lp_ai_mastery_2026",
      progress: 50,
      status: "active",
      current_course_index: 0,
      completedCourses: ["crs_python_foundation"],
    },
  ],

  game_info: [
    {
      id: "game_card_match_vr",
      title: "Lật Thẻ Bài Thuật Toán VR (Memory Card Match)",
      subtitle: "Rèn luyện trí nhớ và khắc sâu định nghĩa thuật ngữ lập trình",
      genre: "Trò Chơi Trí Nhớ 3D",
      category: "memory",
      description: "Lật và ghép đúng các cặp thuật ngữ lập trình và giải thích trích xuất trực tiếp từ khóa học.",
      author: "E-V-E Studio",
      difficulty: "Trung Bình",
      rewardCoins: 50,
      visibility: "public",
      needExtraData: true,
      coursesAllowed: "all",
      thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
      badge: "NỔI BẬT",
      rating: 4.9,
      playsCount: 1420,
      isAccepted: true,
    },
    {
      id: "boss_battle_quiz",
      title: "Đấu Trí Boss Trắc Nghiệm (Boss Slayer Quiz)",
      subtitle: "Đấu trùm trắc nghiệm phản xạ kiến thức lập trình",
      genre: "Trắc Nghiệm Phản Xạ",
      category: "boss",
      description: "Mỗi câu trả lời đúng sẽ giáng một đòn chí mạng vào Boss quái vật. Hỗ trợ mọi khóa học!",
      author: "E-V-E Dev Team",
      difficulty: "Thử Thách",
      rewardCoins: 60,
      visibility: "public",
      needExtraData: true,
      coursesAllowed: "all",
      thumbnailUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80",
      badge: "HOT",
      rating: 4.8,
      playsCount: 2350,
      isAccepted: true,
    },
    {
      id: "game_space_quiz_3d",
      title: "Đường Đua Tri Thức 3D (Quiz Runner 3D)",
      subtitle: "Thử Thách Phản Xạ & Kiểm Tra Kiến Thức",
      genre: "Hành Động Trắc Nghiệm 3D",
      category: "quiz",
      description: "Trò chơi trắc nghiệm tốc độ: Đọc kỹ câu hỏi trích xuất từ bài học và chọn đáp án chính xác nhất.",
      author: "Ban Học Thuật E-V-E",
      difficulty: "Cơ Bản",
      rewardCoins: 50,
      visibility: "public",
      needExtraData: true,
      coursesAllowed: "all",
      thumbnailUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80",
      badge: "MỚI",
      rating: 4.7,
      playsCount: 980,
      isAccepted: true,
    },
  ],

  game_results: [
    {
      id: "res_001",
      game_id: "game_card_match_vr",
      course_id: "crs_coding_basics",
      user_id: "f89rGIGZVlQoA5J82jqavzWEvIs2",
      user_name: "Nguyễn Thành Đạt",
      score: 180,
      accuracy_percent: 100,
      play_time_seconds: 38,
      coins_earned: 90,
      date: "2026-08-15",
    },
    {
      id: "res_002",
      game_id: "boss_battle_quiz",
      course_id: "crs_coding_basics",
      user_id: "f89rGIGZVlQoA5J82jqavzWEvIs2",
      user_name: "Nguyễn Thành Đạt",
      score: 220,
      accuracy_percent: 95,
      play_time_seconds: 45,
      coins_earned: 110,
      date: "2026-08-15",
    },
  ],

  shop_items: [
    {
      id: "item_frame_cosmic_01",
      name: "Khung Vũ Trụ Lấp Lánh",
      price: 100,
      type: "avatar_frame",
      image_url: "/assets/shop/frames/cosmic_glow.png",
    },
    {
      id: "item_frame_gold",
      name: "Khung Hoàng Gia Vàng",
      price: 300,
      type: "avatar_frame",
      image_url: "/assets/shop/frames/royal_gold.png",
    },
    {
      id: "item_title_explorer",
      name: "Danh hiệu: Nhà Khám Phá Vũ Trụ",
      price: 50,
      type: "title_tag",
      image_url: "/assets/shop/titles/explorer.png",
    },
    {
      id: "item_title_admin",
      name: "Danh hiệu: Quản Trị Viên",
      price: 0,
      type: "title_tag",
      image_url: "/assets/shop/titles/admin.png",
    },
    {
      id: "item_title_master",
      name: "Danh hiệu: Bậc Thầy Thuật Toán",
      price: 200,
      type: "title_tag",
      image_url: "/assets/shop/titles/master.png",
    },
  ],

  announcements: [
    {
      id: "ann_001",
      title: "Chào Đón Học Kỳ E-V-E 2026",
      content: "Chào mừng toàn thể Học viên và Giảng viên tham gia hệ thống E-V-E Learning Hub.",
      category: "system",
      date: "2026-08-01",
    },
  ],
};

// ─── Execution Routine ────────────────────────────────────────────────────────

async function clearCollection(collectionName) {
  const colRef = db.collection(collectionName);
  const snapshot = await colRef.get();
  if (snapshot.empty) return;
  const batch = db.batch();
  snapshot.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
  console.log(`  Đã xóa ${snapshot.size} document cũ trong '${collectionName}'`);
}

async function run() {
  console.log("Khởi động Reset & Seed Toàn Diện Firestore Database Schema Chuẩn Tiếng Việt...\n");

  for (const col of COLLECTIONS) {
    await clearCollection(col);
  }

  console.log("\nNạp dữ liệu mới đầy đủ chuẩn E-V-E Schema (100% Tiếng Việt có dấu)...\n");

  for (const [colName, docs] of Object.entries(SEED_DATA)) {
    for (const item of docs) {
      const { id, ...data } = item;
      const docRef = db.collection(colName).doc(id);
      await docRef.set({
        ...data,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
    console.log(`  '${colName}': ${docs.length} document được tạo thành công`);
  }

  console.log("\nRESET & SEED FIRESTORE HOÀN TẤT XUẤT SẮC!");
}

run().catch((err) => {
  console.error("Lỗi:", err);
  process.exit(1);
});
