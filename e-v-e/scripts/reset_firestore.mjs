/**
 * SCRIPT RESET TOÀN DIỆN DATABASE FIRESTORE (CLEAN SLATE)
 *
 * Chức năng:
 * - Xóa sạch toàn bộ documents trong tất cả các collections của Firestore (Database ID: 'default')
 * - Đưa database về trạng thái sạch sẽ hoàn toàn trước khi nạp dữ liệu mới.
 *
 * Cách chạy:
 *   node scripts/reset_firestore.mjs
 *   hoặc: npm run db:reset
 */

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
  "notifications",
];

async function clearCollection(collectionName) {
  const colRef = db.collection(collectionName);
  const snapshot = await colRef.get();
  if (snapshot.empty) {
    console.log(`  ⚪ '${collectionName}': Trống (0 document)`);
    return 0;
  }

  const batchSize = 400;
  const docs = snapshot.docs;
  let deletedCount = 0;

  for (let i = 0; i < docs.length; i += batchSize) {
    const batch = db.batch();
    const chunk = docs.slice(i, i + batchSize);
    chunk.forEach((d) => batch.delete(d.ref));
    await batch.commit();
    deletedCount += chunk.length;
  }

  console.log(`  🗑️ Đã xóa ${deletedCount} document trong '${collectionName}'`);
  return deletedCount;
}

async function runReset() {
  console.log("=================================================================");
  console.log("🔥 BẮT ĐẦU RESET TOÀN BỘ CƠ SỞ DỮ LIỆU FIRESTORE ('default') 🔥");
  console.log("=================================================================\n");

  let totalDeleted = 0;
  for (const col of COLLECTIONS) {
    const count = await clearCollection(col);
    totalDeleted += count;
  }

  console.log("\n=================================================================");
  console.log(`✅ RESET FIRESTORE HOÀN TẤT! Tổng số document đã xóa: ${totalDeleted}`);
  console.log("=================================================================");
}

runReset().catch((err) => {
  console.error("❌ Lỗi khi thực hiện reset:", err);
  process.exit(1);
});
