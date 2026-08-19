/**
 * SCRIPT NẠP DỮ LIỆU MẪU (SEED / FILL DATA) - BẢN TỐI GIẢN
 *
 * Chức năng:
 * - Chỉ giữ 3 tài khoản demo: dat@gmail.com (student), dat1@gmail.com (teacher đã duyệt), dat2@gmail.com (admin).
 * - Hai game mặc định được chuyển vào public/uploads/games và khai báo gameUrl tương ứng.
 * - Một lộ trình "Học Python căn bản" với 7 chặng bài học, mỗi chặng ~50 cặp câu hỏi.
 * - KHÔNG tạo classes, assignments, submissions, lectures, game_results, shop_items, announcements.
 *
 * Cách chạy:
 *   node scripts/fill_data.mjs
 *   hoặc: npm run db:fill
 */

import fs from "fs";
import path from "path";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { PY_CH1 } from "./data/py_ch1.mjs";
import { PY_CH2 } from "./data/py_ch2.mjs";
import { PY_CH3 } from "./data/py_ch3.mjs";
import { PY_CH4 } from "./data/py_ch4.mjs";
import { PY_CH5 } from "./data/py_ch5.mjs";
import { PY_CH6 } from "./data/py_ch6.mjs";
import { PY_CH7 } from "./data/py_ch7.mjs";

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
  initializeApp({ credential: cert(serviceAccount) });
}

const db = getFirestore("default");
db.settings({ ignoreUndefinedProperties: true });

function buildPairs(prefix, items) {
  return items.map(([title, description, explanation, distractions], idx) => ({
    id: `${prefix}_q${String(idx + 1).padStart(3, "0")}`,
    title,
    description,
    explanation,
    distractions,
  }));
}

const TEACHER_ID = "YMdybMQPIYWQVlUmb346L92P3z53";
const STUDENT_ID = "f89rGIGZVlQoA5J82jqavzWEvIs2";
const ADMIN_ID = "4iFol5R21cTdeB5UmKxKal2n4tl2";

const SEED_DATA = {
  // 1. USERS - CHỈ 3 TÀI KHOẢN DEMO
  users: [
    {
      id: STUDENT_ID,
      name: "Nguyễn Thành Đạt",
      displayName: "Nguyễn Thành Đạt",
      fullName: "Nguyễn Thành Đạt",
      email: "dat@gmail.com",
      role: "student",
      status: "active",
      isAccepted: true,
      is_accepted: true,
      coins: 450,
      bio: "Học viên chuyên ngành Công Nghệ Phần Mềm & Lập Trình Game tại E-V-E.",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
    },
    {
      id: TEACHER_ID,
      name: "ThS. Nguyễn Thành Đạt",
      displayName: "ThS. Nguyễn Thành Đạt",
      fullName: "ThS. Nguyễn Thành Đạt",
      email: "dat1@gmail.com",
      role: "teacher",
      status: "active",
      isAccepted: true,
      is_accepted: true,
      coins: 1500,
      bio: "Giảng viên chuyên ngành Khoa Học Máy Tính & Trò Chơi Giáo Dục tại E-V-E.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    },
    {
      id: ADMIN_ID,
      name: "Quản Trị Viên Đạt",
      displayName: "Quản Trị Viên Đạt",
      fullName: "Quản Trị Viên Đạt",
      email: "dat2@gmail.com",
      role: "admin",
      status: "active",
      isAccepted: true,
      is_accepted: true,
      coins: 9999,
      bio: "Quản trị viên toàn hệ thống nền tảng học tập E-V-E Learning Hub.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80",
    },
  ],

  // 2. TEACHERS - CHỈ GIÁO VIÊN DAT1 (ĐÃ DUYỆT)
  teachers: [
    {
      id: TEACHER_ID,
      name: "ThS. Nguyễn Thành Đạt",
      fullName: "ThS. Nguyễn Thành Đạt",
      email: "dat1@gmail.com",
      specialty: "Lập Trình Web, AI & Game Giáo Dục",
      bio: "Chuyên gia thiết kế trò chơi học tập và giao diện người dùng E-V-E.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      rating: 4.9,
      totalStudents: 128,
      isAccepted: true,
      is_accepted: true,
    },
  ],

  // 3. GAME INFO - 2 GAME MẶC ĐỊNH (ĐÃ CHUYỂN VÀO public/uploads/games)
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
      is_accepted: true,
      gameUrl: "/uploads/games/game-z/index.html",
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
      is_accepted: true,
      gameUrl: "/uploads/games/boss_battle_quiz/index.html",
    },
  ],

  // 4. COURSES - LỘ TRÌNH HỌC PYTHON CĂN BẢN (7 CHẶNG)
  courses: [
    {
      id: "crs_py_01",
      title: "Chặng 1: Nhập Môn Python & Môi Trường Lập Trình",
      subtitle: "Làm quen với Python, cài đặt môi trường và công cụ lập trình",
      description: "Khám phá nguồn gốc, triết lý thiết kế Python cùng cách cài đặt và sử dụng các công cụ lập trình như IDE, REPL, Jupyter Notebook.",
      category: "Lập Trình Python",
      difficulty: "Cơ Bản",
      author_id: TEACHER_ID,
      authorId: TEACHER_ID,
      author_name: "ThS. Nguyễn Thành Đạt",
      authorName: "ThS. Nguyễn Thành Đạt",
      author_email: "dat1@gmail.com",
      visibility: "public",
      is_accepted: true,
      isAccepted: true,
      isPublished: true,
      rewardCoins: 50,
      estimated_hours: 8,
      thumbnailUrl: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=80",
      pairs: buildPairs("py01", PY_CH1),
    },
    {
      id: "crs_py_02",
      title: "Chặng 2: Biến, Kiểu Dữ Liệu & Ép Kiểu",
      subtitle: "Nắm vững biến số và các kiểu dữ liệu cơ bản trong Python",
      description: "Tìm hiểu cách khai báo biến, các kiểu dữ liệu int, float, str, bool, None và kỹ thuật ép kiểu an toàn khi xử lý dữ liệu.",
      category: "Lập Trình Python",
      difficulty: "Cơ Bản",
      author_id: TEACHER_ID,
      authorId: TEACHER_ID,
      author_name: "ThS. Nguyễn Thành Đạt",
      authorName: "ThS. Nguyễn Thành Đạt",
      author_email: "dat1@gmail.com",
      visibility: "public",
      is_accepted: true,
      isAccepted: true,
      isPublished: true,
      rewardCoins: 55,
      estimated_hours: 9,
      thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
      pairs: buildPairs("py02", PY_CH2),
    },
    {
      id: "crs_py_03",
      title: "Chặng 3: Toán Tử & Biểu Thức",
      subtitle: "Làm chủ toán tử số học, so sánh, logic và bitwise",
      description: "Hiểu rõ các toán tử trong Python, thứ tự ưu tiên và cách xây dựng biểu thức tính toán chính xác cho chương trình thực tế.",
      category: "Lập Trình Python",
      difficulty: "Cơ Bản",
      author_id: TEACHER_ID,
      authorId: TEACHER_ID,
      author_name: "ThS. Nguyễn Thành Đạt",
      authorName: "ThS. Nguyễn Thành Đạt",
      author_email: "dat1@gmail.com",
      visibility: "public",
      is_accepted: true,
      isAccepted: true,
      isPublished: true,
      rewardCoins: 55,
      estimated_hours: 9,
      thumbnailUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop&q=80",
      pairs: buildPairs("py03", PY_CH3),
    },
    {
      id: "crs_py_04",
      title: "Chặng 4: Chuỗi & Xử Lý Văn Bản",
      subtitle: "Thành thạo các thao tác xử lý chuỗi ký tự trong Python",
      description: "Học cách tạo, cắt, nối và xử lý chuỗi với các phương thức mạnh mẽ như split, join, replace, format và f-string.",
      category: "Lập Trình Python",
      difficulty: "Trung Cấp",
      author_id: TEACHER_ID,
      authorId: TEACHER_ID,
      author_name: "ThS. Nguyễn Thành Đạt",
      authorName: "ThS. Nguyễn Thành Đạt",
      author_email: "dat1@gmail.com",
      visibility: "public",
      is_accepted: true,
      isAccepted: true,
      isPublished: true,
      rewardCoins: 60,
      estimated_hours: 10,
      thumbnailUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&auto=format&fit=crop&q=80",
      pairs: buildPairs("py04", PY_CH4),
    },
    {
      id: "crs_py_05",
      title: "Chặng 5: Cấu Trúc Điều Kiện",
      subtitle: "Điều khiển luồng chương trình với if, elif, else và match-case",
      description: "Xây dựng tư duy rẽ nhánh với if/elif/else, biểu thức điều kiện và match-case để chương trình đưa ra quyết định thông minh.",
      category: "Lập Trình Python",
      difficulty: "Trung Cấp",
      author_id: TEACHER_ID,
      authorId: TEACHER_ID,
      author_name: "ThS. Nguyễn Thành Đạt",
      authorName: "ThS. Nguyễn Thành Đạt",
      author_email: "dat1@gmail.com",
      visibility: "public",
      is_accepted: true,
      isAccepted: true,
      isPublished: true,
      rewardCoins: 60,
      estimated_hours: 10,
      thumbnailUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80",
      pairs: buildPairs("py05", PY_CH5),
    },
    {
      id: "crs_py_06",
      title: "Chặng 6: Vòng Lặp",
      subtitle: "Tự động hóa công việc lặp lại với for, while và list comprehension",
      description: "Làm chủ vòng lặp for, while, break, continue cùng list comprehension để xử lý dữ liệu hàng loạt một cách hiệu quả.",
      category: "Lập Trình Python",
      difficulty: "Trung Cấp",
      author_id: TEACHER_ID,
      authorId: TEACHER_ID,
      author_name: "ThS. Nguyễn Thành Đạt",
      authorName: "ThS. Nguyễn Thành Đạt",
      author_email: "dat1@gmail.com",
      visibility: "public",
      is_accepted: true,
      isAccepted: true,
      isPublished: true,
      rewardCoins: 65,
      estimated_hours: 11,
      thumbnailUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
      pairs: buildPairs("py06", PY_CH6),
    },
    {
      id: "crs_py_07",
      title: "Chặng 7: Hàm & Lập Trình Hướng Đối Tượng",
      subtitle: "Tổ chức mã nguồn với hàm, lớp, đối tượng và các nguyên lý OOP",
      description: "Viết hàm tái sử dụng, dùng lambda, decorator và xây dựng class với tính kế thừa, đóng gói và đa hình theo phong cách Python.",
      category: "Lập Trình Python",
      difficulty: "Nâng Cao",
      author_id: TEACHER_ID,
      authorId: TEACHER_ID,
      author_name: "ThS. Nguyễn Thành Đạt",
      authorName: "ThS. Nguyễn Thành Đạt",
      author_email: "dat1@gmail.com",
      visibility: "public",
      is_accepted: true,
      isAccepted: true,
      isPublished: true,
      rewardCoins: 75,
      estimated_hours: 14,
      thumbnailUrl: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800&auto=format&fit=crop&q=80",
      pairs: buildPairs("py07", PY_CH7),
    },
  ],

  // 5. LEARNING PATH - 1 LỘ TRÌNH DUY NHẤT
  learning_path: [
    {
      id: "lp_python_co_ban",
      title: "Học Python Căn Bản",
      description: "Lộ trình 7 chặng học lập trình Python từ con số 0: cài đặt môi trường, kiểu dữ liệu, toán tử, chuỗi, điều kiện, vòng lặp và lập trình hướng đối tượng.",
      category: "Lập Trình Python",
      difficulty: "Cơ Bản",
      author_id: TEACHER_ID,
      authorId: TEACHER_ID,
      author_name: "ThS. Nguyễn Thành Đạt",
      authorName: "ThS. Nguyễn Thành Đạt",
      author_email: "dat1@gmail.com",
      visibility: "public",
      is_accepted: true,
      isAccepted: true,
      courses: ["crs_py_01", "crs_py_02", "crs_py_03", "crs_py_04", "crs_py_05", "crs_py_06", "crs_py_07"],
      learning_objectives: [
        "Cài đặt và làm quen môi trường lập trình Python",
        "Nắm vững biến, kiểu dữ liệu và ép kiểu",
        "Thành thạo toán tử, biểu thức và xử lý chuỗi",
        "Điều khiển luồng chương trình với điều kiện và vòng lặp",
        "Viết hàm và xây dựng chương trình hướng đối tượng",
      ],
      estimated_hours: 70,
      thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
    },
  ],
};

async function runFillData() {
  console.log("=================================================================");
  console.log("🌱  BẮT ĐẦU NẠP DỮ LIỆU MẪU TỐI GIẢN (FILL DATA) VÀO FIRESTORE");
  console.log("=================================================================\n");

  let totalInserted = 0;

  for (const [colName, docs] of Object.entries(SEED_DATA)) {
    const colRef = db.collection(colName);
    const batch = db.batch();

    for (const item of docs) {
      const { id, ...data } = item;
      const docRef = colRef.doc(id);
      batch.set(
        docRef,
        {
          id,
          _id: id,
          ...data,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    }

    await batch.commit();
    totalInserted += docs.length;
    const pairCount =
      colName === "courses"
        ? docs.reduce((sum, d) => sum + (Array.isArray(d.pairs) ? d.pairs.length : 0), 0)
        : 0;
    console.log(
      `  📦 Collection '${colName}': ${docs.length} documents.` +
        (pairCount ? ` (Tổng pairs: ${pairCount})` : "")
    );
  }

  console.log("\n=================================================================");
  console.log(`✅ NẠP DỮ LIỆU MẪU THÀNH CÔNG! Tổng số document: ${totalInserted}`);
  console.log("=================================================================");
}

runFillData().catch((err) => {
  console.error("❌ Lỗi khi nạp dữ liệu:", err);
  process.exit(1);
});