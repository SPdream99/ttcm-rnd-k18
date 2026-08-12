/**
 * FIREBASE: FirebaseUserRepo
 *
 * Implements UserRepository bằng Firestore (server-side).
 * Dùng Admin SDK — chỉ chạy ở server (API routes).
 *
 * Collection Firestore: "users"
 */

import { adminDb } from '@/infrastructure/firebase/firebaseAdmin';
import { User, UserRole } from '@/core/entities/User';
import { UserRepository } from '@/core/ports/UserRepository';

const COLLECTION = 'users';

// Helper: chuyển Firestore document → User entity
function toUser(id: string, data: FirebaseFirestore.DocumentData): User {
  return {
    id,
    email: data.email,
    displayName: data.displayName,
    role: data.role as UserRole,
    avatarUrl: data.avatarUrl ?? undefined,
    createdAt: data.createdAt?.toDate() ?? new Date(),
  };
}

export class FirebaseUserRepo implements UserRepository {
  async getUserById(id: string): Promise<User | null> {
    const doc = await adminDb.collection(COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    return toUser(doc.id, doc.data()!);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const snapshot = await adminDb
      .collection(COLLECTION)
      .where('email', '==', email)
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return toUser(doc.id, doc.data());
  }

  async saveUser(user: User): Promise<void> {
    await adminDb.collection(COLLECTION).doc(user.id).set({
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      avatarUrl: user.avatarUrl ?? null,
      createdAt: user.createdAt,
    });
  }

  async listUsers(): Promise<User[]> {
    const snapshot = await adminDb.collection(COLLECTION).get();
    return snapshot.docs.map((doc) => toUser(doc.id, doc.data()));
  }
}
