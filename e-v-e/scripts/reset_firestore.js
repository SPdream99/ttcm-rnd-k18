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
  "shop_items",
  "courses",
  "learning_path",
  "resources",
  "game_info",
  "game_results",
  "enrollments",
];

// ─── Seed Data ────────────────────────────────────────────────────────────────
// Mỗi document chỉ có 1 trường id duy nhất = Document Key
// users collection: dùng "id" (khớp với Firebase Auth UID khi tạo tài khoản)
// Không có _id, uid, lpath_id, course_id, game_id, item_id thừa

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
      id: "usr_teacher_001",
      name: "GS. Nguyễn Văn An",
      email: "teacher@eve.edu.vn",
      role: "teacher",
      status: "active",
      coins: 1500,
      profile_decorations: ["item_title_master"],
    },
    {
      id: "usr_teacher_pending",
      name: "Thầy Trần Văn Bình",
      email: "teacher_pending@eve.edu.vn",
      role: "teacher",
      status: "pending",
      coins: 0,
      profile_decorations: [],
    },
    {
      id: "usr_student_001",
      name: "Học Sinh Explorer",
      email: "student@eve.edu.vn",
      role: "student",
      status: "active",
      coins: 250,
      profile_decorations: ["item_frame_cosmic_01", "item_title_explorer"],
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
      id: "crs_quantum_101",
      title: "Vật Lý Lượng Tử Cơ Bản",
      author_id: "YMdybMQPIYWQVlUmb346L92P3z53",
      is_accepted: true,
      created_at: new Date().toISOString(),
      content_data: {
        pairs: [
          {
            id: "pair_1",
            title: "Phương trình Schrödinger dùng để làm gì?",
            right_answer: "Mô tả trạng thái lượng tử của hệ thống",
            explanation: "Phương trình Schrödinger mô tả sự thay đổi của hàm sóng lượng tử theo thời gian, là nền tảng của cơ học lượng tử phi tương đối tính.",
            image: "https://example.com/schrodinger.png",
            wrong_answers: [
              "Tính vận tốc ánh sáng",
              "Đo điện trở của kim loại",
              "Tính áp suất khí lý tưởng",
            ],
          },
          {
            id: "pair_2",
            title: "Hiện tượng vướng víu lượng tử là gì?",
            right_answer: "Sự liên kết siêu xa giữa các hạt lượng tử",
            explanation: "Vướng víu lượng tử (Quantum Entanglement) là hiện tượng hai hay nhiều hạt liên kết trạng thái với nhau bất kể khoảng cách không gian.",
            image: "",
            wrong_answers: [
              "Hạt nhân tự phân rã",
              "Electron di chuyển vượt tốc độ ánh sáng",
              "Quang phổ liên tục của nguyên tử",
            ],
          },
        ],
      },
    },
    {
      id: "crs_astrophysics",
      title: "Vật Lý Thiên Văn & Hố Đen",
      author_id: "YMdybMQPIYWQVlUmb346L92P3z53",
      is_accepted: true,
      created_at: new Date().toISOString(),
      content_data: {
        pairs: [
          {
            id: "pair_astro_1",
            title: "Ranh giới không thể thoát khỏi hố đen gọi là gì?",
            right_answer: "Chân trời sự kiện (Event Horizon)",
            explanation: "Chân trời sự kiện là biên giới mà tại đó vận tốc vũ trụ cấp 2 vượt quá vận tốc ánh sáng, không vật chất hay bức xạ nào có thể thoát ra.",
            image: "",
            wrong_answers: [
              "Điểm kỳ dị (Singularity)",
              "Vành đai Kuiper",
              "Đĩa bồi tụ",
            ],
          },
        ],
      },
    },
  ],

  learning_path: [
    {
      id: "lpath_quantum_physics",
      title: "Lộ Trình Nhập Môn Vật Lý Lượng Tử",
      description: "Hành trình từ Cơ học cổ điển đến các khái niệm Vướng víu Lượng tử và Máy tính Lượng tử.",
      courses: ["crs_quantum_101", "crs_astrophysics"],
      author_id: "YMdybMQPIYWQVlUmb346L92P3z53",
      is_accepted: true,
    },
  ],

  resources: [
    {
      id: "res_quantum_pdf_01",
      course_id: "crs_quantum_101",
      title: "Slide Bài Giảng Vật Lý Lượng Tử Chapter 1",
      description: "Tài liệu tổng hợp công thức và bài tập mẫu.",
      file_url: "https://storage.eve.edu.vn/resources/quantum_ch1.pdf",
      file_type: "pdf",
      file_size: 2457600,
      download_count: 42,
      uploaded_at: new Date().toISOString(),
    },
  ],

  game_info: [
    {
      id: "game_space_quiz_3d",
      authors: ["Đạt Teacher", "Nhóm Dev EVE"],
      title: "Bắn Tháp Vũ Trụ Quiz 3D",
      description: "Game bắn tháp câu hỏi trắc nghiệm không gian.",
      is_accepted: true,
      courses_allowed: ["crs_quantum_101", "crs_astrophysics"],
      courses_blocked: [],
      need_extra_data: true,
      source_url: "https://storage.eve.edu.vn/games/space_quiz_3d/index.html",
      uploader_id: "YMdybMQPIYWQVlUmb346L92P3z53",
    },
  ],

  game_results: [
    {
      id: "result_dat_quantum_01",
      user_id: "f89rGIGZVlQoA5J82jqavzWEvIs2",
      course_id: "crs_quantum_101",
      game_id: "game_space_quiz_3d",
      score: 95,
      coins_earned: 50,
      played_at: new Date().toISOString(),
    },
  ],

  enrollments: [
    {
      id: "enr_dat_quantum",
      user_id: "f89rGIGZVlQoA5J82jqavzWEvIs2",
      lpath_id: "lpath_quantum_physics",
      enrolled_at: new Date().toISOString(),
      is_finished: false,
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

  console.log("\n🌱 Nạp dữ liệu mới (mỗi document chỉ có 1 trường id)...\n");

  for (const [colName, docs] of Object.entries(SEED_DATA)) {
    for (const data of docs) {
      // Document key = data.id (bắt buộc phải có)
      await db.collection(colName).doc(data.id).set(data);
    }
    console.log(`  ✅ '${colName}': ${docs.length} document — Document Key = id`);
  }

  console.log("\n🎉 HOÀN TẤT! Firestore đã được reset theo schema sạch.");
}

resetAndSeedFirestore().catch((err) => {
  console.error("❌ Lỗi:", err);
  process.exit(1);
});
