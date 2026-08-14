/**
 * Firebase ADMIN SDK — dùng ở phía server (server-side ONLY)
 */

import { getFirestore as getAdminFirestore, Firestore } from 'firebase-admin/firestore';
import { App, getApps, initializeApp, cert } from 'firebase-admin/app';

function createAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const serviceAccountKey = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountKey) {
    throw new Error('FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY chưa được cấu hình trong .env.local');
  }

  const serviceAccount = JSON.parse(serviceAccountKey);

  return initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id as string,
  });
}

const adminApp: App = createAdminApp();

// QUAN TRỌNG: Database ID của project này là 'default' (không có ngoặc đơn)
const db: Firestore = getAdminFirestore(adminApp, 'default');

try {
  db.settings({ ignoreUndefinedProperties: true });
} catch {
  // Ignore error if settings were already applied
}

import { getAuth as getAdminAuth, Auth as AdminAuth } from 'firebase-admin/auth';

export const adminAuth: AdminAuth = getAdminAuth(adminApp);
export const adminDb: Firestore = db;
export default adminApp;
