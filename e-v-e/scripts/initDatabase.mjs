/**
 * SCRIPT KHỞI TẠO CƠ BẢN AN TOÀN (SAFE DATABASE INITIALIZATION)
 *
 * Nguyên tắc:
 * 1. GIỮ NGUYÊN HOÀN TOÀN tất cả các Document và Collection đã có sẵn.
 * 2. Chỉ tạo thêm các Document cốt lõi nếu chưa tồn tại.
 * 3. Chạy an toàn trên Firestore Database ID: 'default'.
 *
 * Cách chạy:
 *   node scripts/initDatabase.mjs
 *   hoặc: npm run db:init
 */

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

async function initDatabaseSafely() {
  console.log("=================================================================");
  console.log("🛡️  KHỞI TẠO HỆ THỐNG AN TOÀN FIRESTORE (Database: 'default')");
  console.log("=================================================================\n");

  let addedCount = 0;

  // 1. TEACHERS
  const teachersRef = db.collection("teachers");
  const defaultTeachers = [
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
  ];

  for (const t of defaultTeachers) {
    const doc = await teachersRef.doc(t.id).get();
    if (!doc.exists) {
      await teachersRef.doc(t.id).set({
        ...t,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      addedCount++;
      console.log(`  + Đã tạo Giảng viên: "${t.name}" (ID: ${t.id})`);
    }
  }

  // 2. SHOP ITEMS (Default Decorations)
  const shopRef = db.collection("shop_items");
  const defaultShopItems = [
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
  ];

  for (const item of defaultShopItems) {
    const doc = await shopRef.doc(item.id).get();
    if (!doc.exists) {
      await shopRef.doc(item.id).set({
        ...item,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      addedCount++;
      console.log(`  + Đã tạo Vật phẩm Shop: "${item.name}" (ID: ${item.id})`);
    }
  }

  // 3. ANNOUNCEMENTS
  const annRef = db.collection("announcements");
  const defaultAnn = {
    id: "ann_welcome_default",
    title: "Chào Đón Học Kỳ E-V-E 2026",
    content: "Chào mừng toàn thể Học viên và Giảng viên tham gia hệ thống E-V-E Learning Hub.",
    category: "system",
    date: "2026-08-01",
  };
  const annDoc = await annRef.doc(defaultAnn.id).get();
  if (!annDoc.exists) {
    await annRef.doc(defaultAnn.id).set({
      ...defaultAnn,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    addedCount++;
    console.log(`  + Đã tạo Thông báo hệ thống: "${defaultAnn.title}"`);
  }

  console.log("\n=================================================================");
  console.log(`✅ KHỞI TẠO AN TOÀN HOÀN TẤT! Đã bổ sung ${addedCount} bản ghi mới.`);
  console.log("=================================================================");
}

initDatabaseSafely().catch((err) => {
  console.error("❌ Lỗi khi khởi tạo database:", err);
  process.exit(1);
});
