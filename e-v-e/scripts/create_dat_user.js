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
  console.error(" Không tìm thấy FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY trong .env.local");
  process.exit(1);
}

const serviceAccount = JSON.parse(serviceAccountRaw);

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const db = getFirestore("default");

async function createDatUser() {
  const userId = "f89rGIGZVlQoA5J82jqavzWEvIs2";
  const userPayload = {
    id: userId,
    _id: userId,
    uid: userId,
    name: "Đạt Student",
    fullName: "Đạt Student",
    email: "dat@gmail.com",
    role: "student",
    status: "active",
    coins: 250,
    profile_decorations: ["item_frame_cosmic_01", "item_title_explorer"],
    createdAt: new Date().toISOString(),
  };

  await db.collection("users").doc(userId).set(userPayload, { merge: true });
  console.log(` Đã tạo/cập nhật thành công Student 'dat@gmail.com' với ID '${userId}' trong collection 'users'!`);
}

createDatUser().catch((err) => {
  console.error(" Lỗi tạo user Đạt:", err);
  process.exit(1);
});
