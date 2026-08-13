import fs from "fs";
import path from "path";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    const lines = content.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const equalsIdx = trimmed.indexOf("=");
      if (equalsIdx !== -1) {
        const key = trimmed.slice(0, equalsIdx).trim();
        let val = trimmed.slice(equalsIdx + 1).trim();
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
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
  initializeApp({
    credential: cert(serviceAccount),
  });
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

// Seed Data with document key matching internal id, _id & uid fields
const SEED_DATA = {
  users: [
    {
      id: "f89rGIGZVlQoA5J82jqavzWEvIs2",
      _id: "f89rGIGZVlQoA5J82jqavzWEvIs2",
      uid: "f89rGIGZVlQoA5J82jqavzWEvIs2",
      name: "Đạt Student",
      fullName: "Đạt Student",
      email: "dat@gmail.com",
      role: "student",
      status: "active",
      coins: 250,
      profile_decorations: ["item_frame_cosmic_01", "item_title_explorer"],
    },
    {
      id: "YMdybMQPIYWQVlUmb346L92P3z53",
      _id: "YMdybMQPIYWQVlUmb346L92P3z53",
      uid: "YMdybMQPIYWQVlUmb346L92P3z53",
      name: "Đạt Teacher",
      fullName: "Đạt Teacher",
      email: "dat1@gmail.com",
      role: "teacher",
      status: "active",
      coins: 1500,
      profile_decorations: ["item_title_master"],
    },
    {
      id: "4iFol5R21cTdeB5UmKxKal2n4tl2",
      _id: "4iFol5R21cTdeB5UmKxKal2n4tl2",
      uid: "4iFol5R21cTdeB5UmKxKal2n4tl2",
      name: "Đạt Admin",
      fullName: "Đạt Admin",
      email: "dat2@gmail.com",
      role: "admin",
      status: "active",
      coins: 9999,
      profile_decorations: ["item_frame_gold", "item_title_admin"],
    },
    {
      id: "usr_admin_001",
      _id: "usr_admin_001",
      uid: "usr_admin_001",
      name: "Admin E-V-E",
      fullName: "Admin E-V-E",
      email: "admin@eve.edu.vn",
      role: "admin",
      status: "active",
      coins: 9999,
      profile_decorations: ["item_frame_gold", "item_title_admin"],
    },
    {
      id: "usr_teacher_001",
      _id: "usr_teacher_001",
      uid: "usr_teacher_001",
      name: "GS. Nguyễn Văn An",
      fullName: "GS. Nguyễn Văn An",
      email: "teacher@eve.edu.vn",
      role: "teacher",
      status: "active",
      coins: 1500,
      profile_decorations: ["item_title_master"],
    },
    {
      id: "usr_teacher_pending",
      _id: "usr_teacher_pending",
      uid: "usr_teacher_pending",
      name: "Thầy Trần Văn Bình",
      fullName: "Thầy Trần Văn Bình",
      email: "teacher_pending@eve.edu.vn",
      role: "teacher",
      status: "pending",
      coins: 0,
      profile_decorations: [],
    },
    {
      id: "usr_student_001",
      _id: "usr_student_001",
      uid: "usr_student_001",
      name: "Học Sinh Explorer",
      fullName: "Học Sinh Explorer",
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
      _id: "item_frame_cosmic_01",
      item_id: "item_frame_cosmic_01",
      name: "Khung Vũ Trụ Lấp Lánh",
      price: 100,
      type: "avatar_frame",
      image_url: "/assets/shop/frames/cosmic_glow.png",
    },
    {
      id: "item_frame_gold",
      _id: "item_frame_gold",
      item_id: "item_frame_gold",
      name: "Khung Hoàng Gia Vàng",
      price: 300,
      type: "avatar_frame",
      image_url: "/assets/shop/frames/royal_gold.png",
    },
    {
      id: "item_title_explorer",
      _id: "item_title_explorer",
      item_id: "item_title_explorer",
      name: "Danh hiệu: Nhà Khám Phá Vũ Trụ",
      price: 50,
      type: "title_tag",
      image_url: "/assets/shop/titles/explorer.png",
    },
    {
      id: "item_title_master",
      _id: "item_title_master",
      item_id: "item_title_master",
      name: "Danh hiệu: Bậc Thầy Lượng Tử",
      price: 200,
      type: "title_tag",
      image_url: "/assets/shop/titles/master.png",
    },
  ],
  courses: [
    {
      id: "crs_quantum_101",
      _id: "crs_quantum_101",
      course_id: "crs_quantum_101",
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
      _id: "crs_astrophysics",
      course_id: "crs_astrophysics",
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
      _id: "lpath_quantum_physics",
      lpath_id: "lpath_quantum_physics",
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
      _id: "res_quantum_pdf_01",
      courseId: "crs_quantum_101",
      title: "Slide Bài Giảng Vật Lý Lượng Tử Chapter 1",
      description: "Tài liệu tổng hợp công thức và bài tập mẫu.",
      fileUrl: "https://storage.eve.edu.vn/resources/quantum_ch1.pdf",
      fileType: "pdf",
      fileSize: 2457600,
      downloadCount: 42,
      uploadedAt: new Date().toISOString(),
    },
  ],
  game_info: [
    {
      id: "game_space_quiz_3d",
      _id: "game_space_quiz_3d",
      game_id: "game_space_quiz_3d",
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
      id: "res_student_001",
      _id: "res_student_001",
      uid: "f89rGIGZVlQoA5J82jqavzWEvIs2",
      cid: "crs_quantum_101",
      gid: "game_space_quiz_3d",
      result: 95,
      reward: 50,
      played_at: new Date().toISOString(),
    },
  ],
  enrollments: [
    {
      id: "enr_student_001",
      _id: "enr_student_001",
      uid: "f89rGIGZVlQoA5J82jqavzWEvIs2",
      lpath_id: "lpath_quantum_physics",
      enrollment_date: new Date().toISOString(),
      is_finished: false,
    },
  ],
};

async function deleteCollection(collectionName) {
  const colRef = db.collection(collectionName);
  const snapshot = await colRef.get();
  if (snapshot.empty) return;

  const batch = db.batch();
  snapshot.docs.forEach((docSnap) => {
    batch.delete(docSnap.ref);
  });
  await batch.commit();
  console.log(`🧹 Đã xóa ${snapshot.size} tài liệu cũ trong collection '${collectionName}'`);
}

async function resetAndSeedFirestore() {
  console.log("🚀 Đang khởi động quá trình Reset & Seed Firestore Database...");

  for (const col of COLLECTIONS) {
    await deleteCollection(col);
  }

  console.log("\n🌱 Đang nạp dữ liệu mẫu cấu hình mới vào Firestore...");

  for (const [colName, docs] of Object.entries(SEED_DATA)) {
    for (const data of docs) {
      let docId = data.id || data._id || data.uid || data.course_id || data.lpath_id || data.game_id || data.item_id;

      await db.collection(colName).doc(docId).set(data);
    }
    console.log(`✅ Collection '${colName}': Nạp thành công ${docs.length} tài liệu mới với Document Key = ID.`);
  }

  console.log("\n🎉 HOÀN TẤT! Firestore Database đã được Reset & Cấu hình theo đúng schema mới.");
}

resetAndSeedFirestore().catch((err) => {
  console.error("❌ Lỗi trong quá trình Reset/Seed Firestore:", err);
  process.exit(1);
});
