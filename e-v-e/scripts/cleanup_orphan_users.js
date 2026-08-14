import fs from "fs";
import path from "path";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

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
  initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });
}

const db = getFirestore("default");
const auth = getAuth();

async function cleanupOrphanUsers() {
  console.log("🔍 Đang quét toàn bộ collection 'users' trong Firestore...");
  const snapshot = await db.collection("users").get();
  console.log(`📊 Tìm thấy tổng cộng ${snapshot.size} documents trong collection 'users'.`);

  let deletedCount = 0;
  let keptCount = 0;
  const emailMap = new Map();

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const email = (data.email || "").trim().toLowerCase();
    const docId = docSnap.id;

    if (!email) {
      console.log(`⚠️ Document ${docId} không có email -> Tiến hành xóa.`);
      await docSnap.ref.delete();
      deletedCount++;
      continue;
    }

    // Check if user exists in Firebase Auth
    let authUser = null;
    try {
      authUser = await auth.getUserByEmail(email);
    } catch (authErr) {
      if (authErr.code === "auth/user-not-found") {
        authUser = null;
      } else {
        console.warn(`Lỗi kiểm tra Auth cho email ${email}:`, authErr.message);
      }
    }

    if (!authUser) {
      console.log(`❌ Email '${email}' (Doc ID: ${docId}) tồn tại trong Firestore nhưng KHÔNG tồn tại trong Firebase Auth -> Đang xóa...`);
      await docSnap.ref.delete();
      deletedCount++;
    } else {
      // User exists in Auth. Check if doc ID matches Auth UID or if it is a duplicate document
      if (docId !== authUser.uid) {
        console.log(`⚠️ Document ID '${docId}' không khớp với Auth UID '${authUser.uid}' của email '${email}' -> Đang xóa duplicate/orphan doc...`);
        await docSnap.ref.delete();
        deletedCount++;
      } else {
        if (emailMap.has(email)) {
          console.log(`⚠️ Document trùng lặp cho email '${email}' -> Đang xóa...`);
          await docSnap.ref.delete();
          deletedCount++;
        } else {
          emailMap.set(email, docId);
          keptCount++;
          console.log(`✅ Hợp lệ: '${email}' (UID: ${docId}) khớp chính xác giữa Firestore & Auth.`);
        }
      }
    }
  }

  console.log("\n=======================================================");
  console.log(`🎉 HOÀN TẤT DỌN DẸP USERS:`);
  console.log(`- Đã xóa: ${deletedCount} documents không hợp lệ / mồ côi / trùng lặp`);
  console.log(`- Đã giữ lại: ${keptCount} documents hợp lệ`);
  console.log("=======================================================\n");
}

cleanupOrphanUsers().catch((err) => {
  console.error("❌ Lỗi khi thực hiện dọn dẹp:", err);
  process.exit(1);
});
