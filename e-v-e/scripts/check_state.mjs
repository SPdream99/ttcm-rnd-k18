import fs from "fs";
import path from "path";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const envPath = path.resolve(process.cwd(), ".env.local");
const content = fs.readFileSync(envPath, "utf-8");
const line = content.split("\n").find((l) => l.trim().startsWith("FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY"));
let val = line.slice(line.indexOf("=") + 1).trim();
if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
  val = val.slice(1, -1);
}
const serviceAccount = JSON.parse(val);
if (!getApps().length) initializeApp({ credential: cert(serviceAccount), projectId: serviceAccount.project_id });
const db = getFirestore(getApps()[0], "default");

const studentId = "f89rGIGZVlQoA5J82jqavzWEvIs2";

async function main() {
  try {
    const lp = await db.collection("learning_path").doc("lp_python_co_ban").get();
    console.log("LP lp_python_co_ban exists:", lp.exists);
    if (lp.exists) {
      const d = lp.data();
      console.log("  isAccepted:", d.isAccepted ?? d.is_accepted, "| title:", d.title);
      console.log("  courses:", JSON.stringify(d.courses));
      for (const cid of d.courses) {
        try {
          const c = await db.collection("courses").doc(cid).get();
          if (c.exists) {
            const cd = c.data();
            const nPairs = Array.isArray(cd.pairs) ? cd.pairs.length : Array.isArray(cd.contentData) ? cd.contentData.length : (cd.contentData?.pairs || cd.content_data?.pairs || cd.pairs || []).length;
            console.log(`    course ${cid}: accepted=${cd.isAccepted ?? cd.is_accepted} title=${cd.title} pairs=${nPairs}`);
          } else {
            console.log(`    course ${cid}: NOT EXISTS`);
          }
        } catch (e) { console.log(`    course ${cid} ERR:`, e.message); }
      }
    }
  } catch (e) { console.log("LP query ERR:", e.message); }

  try {
    const u = await db.collection("users").doc(studentId).get();
    console.log("User exists:", u.exists, u.exists ? `role=${u.data().role}` : "");
  } catch (e) { console.log("User query ERR:", e.message); }

  try {
    const en = await db.collection("student_learning_path").where("student_id", "==", studentId).get();
    console.log("Enrollments:", en.size);
    en.docs.forEach((doc) => {
      const d = doc.data();
      console.log("  ", doc.id, "learning_path_id:", d.learning_path_id, "status:", d.status, "approved_courses:", JSON.stringify(d.approved_courses ?? d.approvedCourses ?? []));
    });
  } catch (e) { console.log("Enrollment query ERR:", e.message); }

  try {
    const gi = await db.collection("game_info").get();
    console.log("game_info docs:", gi.size);
    gi.docs.forEach((doc) => {
      const d = doc.data();
      console.log("  ", doc.id, "| accepted:", d.isAccepted ?? d.is_accepted, "| url:", d.gameUrl);
    });
  } catch (e) { console.log("game_info query ERR:", e.message); }
}

main().catch((e) => { console.error("ERR", e); process.exit(1); });