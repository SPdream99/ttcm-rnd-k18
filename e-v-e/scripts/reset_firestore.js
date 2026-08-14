import fs from "fs";
import path from "path";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

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
  console.error("❌ Không tìm thấy FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY trong .env.local");
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(serviceAccountRaw);
} catch (err) {
  console.error("❌ Lỗi parse FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY:", err.message);
  process.exit(1);
}

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}

const db = getFirestore("default");

const COLLECTIONS = [
  "users",
  "teachers",
  "shop_items",
  "courses",
  "learning_path",
  "resources",
  "game_info",
  "game_results",
  "enrollments",
  "announcements",
];

// ─── Seed Data ────────────────────────────────────────────────────────────────

const SEED_DATA = {
  users: [
    {
      id: "f89rGIGZVlQoA5J82jqavzWEvIs2",
      name: "Đạt Student",
      email: "dat@gmail.com",
      role: "student",
      status: "active",
      coins: 250,
      profile_decorations: ["item_frame_cosmic_01", "item_title_explorer"],
    },
    {
      id: "YMdybMQPIYWQVlUmb346L92P3z53",
      name: "Đạt Teacher",
      email: "dat1@gmail.com",
      role: "teacher",
      status: "active",
      coins: 1500,
      profile_decorations: ["item_title_master"],
    },
    {
      id: "4iFol5R21cTdeB5UmKxKal2n4tl2",
      name: "Đạt Admin",
      email: "dat2@gmail.com",
      role: "admin",
      status: "active",
      coins: 9999,
      profile_decorations: ["item_frame_gold", "item_title_admin"],
    },
    {
      id: "usr_admin_001",
      name: "Admin E-V-E",
      email: "admin@eve.edu.vn",
      role: "admin",
      status: "active",
      coins: 9999,
      profile_decorations: ["item_frame_gold", "item_title_admin"],
    },
    {
      id: "usr_student_001",
      name: "Học Viên Vũ Trụ",
      email: "student@eve.edu.vn",
      role: "student",
      status: "active",
      coins: 500,
      profile_decorations: ["item_frame_cosmic_01"],
    },
  ],

  teachers: [
    {
      id: "teacher_nhatanh_01",
      name: "GS. Nguyễn Nhật Anh",
      fullName: "GS. Nguyễn Nhật Anh",
      email: "nhatanh@eve.edu.vn",
      specialty: "Trí Tuệ Nhân Tạo & Kiến Trúc Hệ Thống",
      bio: "Trưởng ban học thuật E-V-E, chuyên gia về AI Agents và Machine Learning.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    },
    {
      id: "teacher_dat_01",
      name: "ThS. Nguyễn Thành Đạt",
      fullName: "ThS. Nguyễn Thành Đạt",
      email: "dat1@gmail.com",
      specialty: "Phát Triển Web & Gamification",
      bio: "Chuyên gia thiết kế trò chơi học tập và giao diện người dùng E-V-E.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    },
    {
      id: "YMdybMQPIYWQVlUmb346L92P3z53",
      name: "ThS. Nguyễn Thành Đạt",
      fullName: "ThS. Nguyễn Thành Đạt",
      email: "dat1@gmail.com",
      specialty: "Phát Triển Web & Gamification",
      bio: "Chuyên gia thiết kế trò chơi học tập và giao diện người dùng E-V-E.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
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
      name: "Danh hiệu: Admin",
      price: 0,
      type: "title_tag",
      image_url: "/assets/shop/titles/admin.png",
    },
    {
      id: "item_title_master",
      name: "Danh hiệu: Bậc Thầy Lượng Tử",
      price: 200,
      type: "title_tag",
      image_url: "/assets/shop/titles/master.png",
    },
  ],

  courses: [
    {
      id: "crs_python_foundation",
      title: "Chặng 1: Nền Tảng Lập Trình Python & Tư Duy Thuật Toán",
      subtitle: "Làm chủ cú pháp, kiểu dữ liệu, hàm và lập trình hướng đối tượng (OOP)",
      description: "Khóa học cung cấp nền móng vững chắc về ngôn ngữ Python, rèn luyện tư duy giải quyết vấn đề bằng code và chuẩn bị sẵn sàng cho các bài toán xử lý dữ liệu phức tạp.",
      category: "Lập Trình Cơ Bản",
      difficulty: "Beginner",
      estimated_hours: 8,
      authorName: "GS. Nguyễn Nhật Anh",
      author_id: "teacher_nhatanh_01",
      totalLessons: 12,
      rewardCoins: 80,
      isPublished: true,
      thumbnailUrl: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=80",
      tags: ["python", "programming", "basics", "algorithms"],
    },
    {
      id: "crs_data_structure_algorithms",
      title: "Chặng 2: Cấu Trúc Dữ Liệu & Giải Thuật Thực Chiến",
      subtitle: "Tối ưu độ phức tạp không gian và thời gian O(N) trong xử lý dữ liệu lớn",
      description: "Tìm hiểu sâu về Array, Linked List, Stack, Queue, Tree, Graph và các thuật toán tìm kiếm/sắp xếp cốt lõi, áp dụng trực tiếp qua các minigame đối kháng kiến thức.",
      category: "Cấu Trúc Dữ Liệu",
      difficulty: "Intermediate",
      estimated_hours: 10,
      authorName: "GS. Nguyễn Nhật Anh",
      author_id: "teacher_nhatanh_01",
      totalLessons: 14,
      rewardCoins: 120,
      isPublished: true,
      thumbnailUrl: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format&fit=crop&q=80",
      tags: ["dsa", "algorithms", "data-structures", "optimization"],
    },
    {
      id: "crs_machine_learning_core",
      title: "Chặng 3: Học Máy Thực Chiến & Phân Tích Dữ Liệu Lớn",
      subtitle: "Xây dựng mô hình dự đoán với hồi quy, phân loại và học không giám sát",
      description: "Thực hành huấn luyện mô hình Machine Learning với Scikit-Learn, tiền xử lý dữ liệu với Pandas/NumPy và trực quan hóa các chỉ số đánh giá độ chính xác (Precision, Recall, F1-Score).",
      category: "Machine Learning",
      difficulty: "Intermediate",
      estimated_hours: 10,
      authorName: "GS. Nguyễn Nhật Anh",
      author_id: "teacher_nhatanh_01",
      totalLessons: 15,
      rewardCoins: 150,
      isPublished: true,
      thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
      tags: ["machine-learning", "numpy", "pandas", "scikit-learn"],
    },
    {
      id: "crs_generative_ai_projects",
      title: "Chặng 4: Phát Triển Ứng Dụng Generative AI & AI Agent",
      subtitle: "Tích hợp LLM APIs, Prompt Engineering, RAG và xây dựng AI Assistant",
      description: "Chặng đồ án thực tế: Tự tay phát triển các AI Agent thông minh có khả năng truy xuất cơ sở dữ liệu (RAG), sinh mã nguồn tự động và giải quyết các bài toán thực tiễn.",
      category: "Generative AI",
      difficulty: "Advanced",
      estimated_hours: 12,
      authorName: "GS. Nguyễn Nhật Anh",
      author_id: "teacher_nhatanh_01",
      totalLessons: 16,
      rewardCoins: 200,
      isPublished: true,
      thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
      tags: ["generative-ai", "llm", "rag", "ai-agent", "gemini"],
    },
    {
      id: "crs_quantum_101",
      title: "Vật Lý Lượng Tử Cơ Bản",
      author_id: "YMdybMQPIYWQVlUmb346L92P3z53",
      is_accepted: true,
      description: "Khám phá nguyên lý cơ bản của vật lý lượng tử, phương trình Schrödinger và hiện tượng chồng chập trạng thái.",
      difficulty: "Beginner",
      estimated_hours: 6,
      authorName: "ThS. Nguyễn Thành Đạt",
      thumbnailUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80",
    },
  ],

  learning_path: [
    {
      id: "lp_ai_mastery_2026",
      title: "Chuyên Gia Trí Tuệ Nhân Tạo & Generative AI 2026 🌌",
      subtitle: "Lộ trình 4 chặng toàn diện từ Python đến xây dựng AI Agent thực tế",
      description: "Chương trình đào tạo chuyên sâu được thiết kế bài bản qua 4 chặng học tập: Khởi đầu từ nền tảng Python vững chắc, làm chủ Cấu trúc Dữ liệu & Thuật toán, huấn luyện mô hình Machine Learning thực tế, và chinh phục Generative AI với công nghệ RAG & AI Agent đa tác vụ.",
      author_id: "teacher_nhatanh_01",
      authorName: "GS. Nguyễn Nhật Anh",
      teacherName: "GS. Nguyễn Nhật Anh (Ban Học Thuật E-V-E)",
      courses: [
        "crs_python_foundation",
        "crs_data_structure_algorithms",
        "crs_machine_learning_core",
        "crs_generative_ai_projects",
      ],
      difficulty: "Intermediate",
      category: "Trí Tuệ Nhân Tạo",
      estimated_hours: 40,
      is_accepted: true,
      isPublished: true,
      rewardCoins: 550,
      thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80",
      bannerGradient: "from-blue-600 via-indigo-600 to-cyan-500",
      learning_objectives: [
        "Làm chủ cú pháp và tư duy lập trình Python hiện đại (OOP, Function, Memory)",
        "Tối ưu hóa hiệu năng chương trình với Cấu trúc Dữ liệu & Giải thuật nâng cao",
        "Huấn luyện, tinh chỉnh và đánh giá mô hình Học máy (Machine Learning Pipeline)",
        "Tích hợp Google Gemini LLM API, triển khai RAG và phát triển hệ thống AI Agent",
      ],
    },
    {
      id: "lpath_quantum_physics",
      title: "Chinh Phục Vật Lý Lượng Tử & Vũ Trụ",
      subtitle: "Từ cơ học sóng Schrödinger đến hố đen và vũ trụ học",
      description: "Lộ trình khám phá thế giới vi mô và vũ trụ bao la dành cho sinh viên và những người đam mê khoa học tự nhiên.",
      author_id: "YMdybMQPIYWQVlUmb346L92P3z53",
      authorName: "ThS. Nguyễn Thành Đạt",
      teacherName: "ThS. Nguyễn Thành Đạt",
      courses: ["crs_quantum_101"],
      difficulty: "Intermediate",
      category: "Vật Lý",
      estimated_hours: 12,
      is_accepted: true,
      isPublished: true,
      rewardCoins: 300,
      thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
      bannerGradient: "from-purple-600 via-pink-600 to-blue-500",
      learning_objectives: [
        "Hiểu rõ bản chất hàm sóng và nguyên lý bất định Heisenberg",
        "Giải thích các hiện tượng thiên văn kỳ thú và sự hình thành hố đen",
      ],
    },
  ],

  resources: [
    {
      id: "res_ai_full_guide",
      course_id: "crs_python_foundation",
      title: "Giáo Trình Python & AI Toàn Diện (Full PDF)",
      description: "Tài liệu chuẩn mực do Ban Học Thuật E-V-E biên soạn.",
      file_url: "https://storage.eve.edu.vn/resources/ai_python_guide.pdf",
      file_type: "pdf",
      file_size: 15400000,
      download_count: 512,
      uploaded_at: new Date().toISOString(),
    },
  ],

  game_info: [
    {
      id: "game_card_match_vr",
      authors: ["ThS. Nguyễn Thành Đạt", "Ban Học Thuật E-V-E"],
      title: "Memory Matching Game (Lật Thẻ Trí Nhớ)",
      subtitle: "Ghép Đôi Khái Niệm & Rèn Luyện Trí Nhớ 3D",
      genre: "Memory Card Matrix",
      category: "memory",
      description: "Minigame lật thẻ bài giáo dục tương tác: Tìm các cặp thẻ tương ứng để ghi điểm combo và nhận Coins thưởng.",
      is_accepted: true,
      is_approved: true,
      need_extra_data: false,
      courses_allowed: "all",
      source_url: "/memory_matching_game/index.html",
      thumbnail_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
      uploader_id: "YMdybMQPIYWQVlUmb346L92P3z53",
      plays_count: 86,
    },
  ],

  game_results: [
    {
      id: "result_dat_memory_01",
      user_id: "f89rGIGZVlQoA5J82jqavzWEvIs2",
      course_id: "crs_python_foundation",
      game_id: "game_card_match_vr",
      score: 100,
      coins_earned: 60,
      played_at: new Date().toISOString(),
    },
  ],

  enrollments: [
    {
      id: "enr_dat_ai_mastery",
      user_id: "f89rGIGZVlQoA5J82jqavzWEvIs2",
      lpath_id: "lp_ai_mastery_2026",
      enrolled_at: new Date().toISOString(),
      is_finished: false,
    },
  ],

  announcements: [
    {
      id: "ann_welcome_2026",
      title: "🚀 Khởi Động Học Kỳ E-V-E Cosmic 2026!",
      content: "Chào mừng các bạn học viên đến với hệ thống E-V-E. Hãy khám phá Lộ Trình Học Tập AI Mastery 2026 và tham gia minigame để nhận thưởng Coins nhé!",
      authorName: "Ban Học Thuật E-V-E",
      isImportant: true,
      createdAt: new Date().toISOString(),
    },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function deleteCollection(collectionName) {
  const colRef = db.collection(collectionName);
  const snapshot = await colRef.get();
  if (snapshot.empty) return;
  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
  console.log(`  🧹 Đã xóa ${snapshot.size} document cũ trong '${collectionName}'`);
}

async function resetAndSeedFirestore() {
  console.log("🚀 Khởi động Reset & Seed Firestore...\n");

  for (const col of COLLECTIONS) {
    await deleteCollection(col);
  }

  console.log("\n🌱 Nạp dữ liệu mới đầy đủ chuẩn E-V-E Schema...\n");

  for (const [colName, docs] of Object.entries(SEED_DATA)) {
    for (const data of docs) {
      await db.collection(colName).doc(data.id).set(data);
    }
    console.log(`  ✅ '${colName}': ${docs.length} document`);
  }

  console.log("\n==================================================");
  console.log("🎉 RESET & SEED FIRESTORE HOÀN TẤT THÀNH CÔNG!");
  console.log("==================================================\n");
}

resetAndSeedFirestore().catch((err) => {
  console.error("❌ Lỗi:", err);
  process.exit(1);
});
