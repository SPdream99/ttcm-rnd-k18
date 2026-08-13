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

const serviceAccount = JSON.parse(serviceAccountRaw);

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const db = getFirestore("default");

async function addDatUsers() {
  const adminId = "4iFol5R21cTdeB5UmKxKal2n4tl2";
  const adminPayload = {
    id: adminId,
    _id: adminId,
    uid: adminId,
    name: "Đạt Admin",
    fullName: "Đạt Admin",
    email: "dat2@gmail.com",
    role: "admin",
    status: "active",
    coins: 9999,
    profile_decorations: ["item_frame_gold", "item_title_admin"],
    createdAt: new Date().toISOString(),
  };

  const teacherId = "YMdybMQPIYWQVlUmb346L92P3z53";
  const teacherPayload = {
    id: teacherId,
    _id: teacherId,
    uid: teacherId,
    name: "Đạt Teacher",
    fullName: "Đạt Teacher",
    email: "dat1@gmail.com",
    role: "teacher",
    status: "active",
    coins: 1500,
    profile_decorations: ["item_title_master"],
    createdAt: new Date().toISOString(),
  };

  await db.collection("users").doc(adminId).set(adminPayload, { merge: true });
  console.log(`✅ Đã tạo/cập nhật thành công Admin 'dat2@gmail.com' với ID '${adminId}'`);

  await db.collection("users").doc(teacherId).set(teacherPayload, { merge: true });
  console.log(`✅ Đã tạo/cập nhật thành công Teacher 'dat1@gmail.com' với ID '${teacherId}'`);
}

addDatUsers().catch((err) => {
  console.error("❌ Lỗi nạp tài khoản Đạt Admin & Teacher:", err);
  process.exit(1);
});
