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
const serviceAccount = JSON.parse(serviceAccountRaw);

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}

// In Firestore on this project, the databaseId is "default"
const db = getFirestore("default");

async function clearEnrollments() {
  console.log(" Đang kiểm tra collections trong Firestore database 'default'...");

  // 1. student_learning_path
  const slpSnapshot = await db.collection("student_learning_path").get();
  console.log(` 'student_learning_path' có ${slpSnapshot.size} bản ghi:`);
  
  for (const doc of slpSnapshot.docs) {
    console.log(`   - Xóa doc: ${doc.id} (student_id: ${doc.data().student_id}, path: ${doc.data().learning_path_id})`);
    await doc.ref.delete();
  }

  // 2. class_members
  const cmSnapshot = await db.collection("class_members").get();
  console.log(` 'class_members' có ${cmSnapshot.size} bản ghi:`);
  for (const doc of cmSnapshot.docs) {
    console.log(`   - Xóa doc: ${doc.id}`);
    await doc.ref.delete();
  }

  console.log("\n HOÀN TẤT: Đã hủy tham gia toàn bộ lớp học trong Firestore database 'default' thành công!");
}

clearEnrollments().catch(console.error);
