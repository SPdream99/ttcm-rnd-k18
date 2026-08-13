/**
 * FIREBASE: FirebaseEnrollmentRepo
 *
 * Field mapping (Firestore → Entity):
 *   userId ✓ (không phải studentId)
 *   completedLessonIds ✓
 *   lastAccessedAt ✓
 *   id format: "{userId}_{courseId}" ✓
 */

import { adminDb } from '@/infrastructure/firebase/firebaseAdmin';
import { Enrollment } from '@/core/entities/Enrollment';
import { EnrollmentRepository } from '@/core/ports/EnrollmentRepository';

const COLLECTION = 'enrollments';

function toEnrollment(id: string, data: FirebaseFirestore.DocumentData): Enrollment {
  return {
    id,
    userId: data.userId ?? '',
    courseId: data.courseId ?? '',
    progress: data.progress ?? 0,
    completedLessonIds: data.completedLessonIds ?? [],
    enrolledAt: data.enrolledAt?.toDate() ?? new Date(),
    lastAccessedAt: data.lastAccessedAt?.toDate() ?? undefined,
    completedAt: data.completedAt?.toDate() ?? undefined,
  };
}

export class FirebaseEnrollmentRepo implements EnrollmentRepository {
  async getEnrollmentsByUser(userId: string): Promise<Enrollment[]> {
    const snapshot = await adminDb
      .collection(COLLECTION)
      .where('userId', '==', userId)
      .get();
    return snapshot.docs.map((doc) => toEnrollment(doc.id, doc.data()));
  }

  async getEnrollmentsByCourse(courseId: string): Promise<Enrollment[]> {
    const snapshot = await adminDb
      .collection(COLLECTION)
      .where('courseId', '==', courseId)
      .get();
    return snapshot.docs.map((doc) => toEnrollment(doc.id, doc.data()));
  }

  async findEnrollment(userId: string, courseId: string): Promise<Enrollment | null> {
    // ID = userId_courseId (theo security rules)
    const enrollmentId = `${userId}_${courseId}`;
    const doc = await adminDb.collection(COLLECTION).doc(enrollmentId).get();
    if (!doc.exists) return null;
    return toEnrollment(doc.id, doc.data()!);
  }

  async enrollUser(enrollment: Enrollment): Promise<void> {
    await adminDb.collection(COLLECTION).doc(enrollment.id).set({
      userId: enrollment.userId,
      courseId: enrollment.courseId,
      progress: enrollment.progress,
      completedLessonIds: enrollment.completedLessonIds,
      enrolledAt: enrollment.enrolledAt,
      lastAccessedAt: enrollment.lastAccessedAt ?? null,
      completedAt: enrollment.completedAt ?? null,
    });
  }

  async updateProgress(
    enrollmentId: string,
    progress: number,
    completedLessonIds: string[],
  ): Promise<void> {
    const clampedProgress = Math.min(100, Math.max(0, progress));
    const updateData: Record<string, unknown> = {
      progress: clampedProgress,
      completedLessonIds,
      lastAccessedAt: new Date(),
    };

    if (clampedProgress === 100) {
      updateData.completedAt = new Date();
    }

    await adminDb.collection(COLLECTION).doc(enrollmentId).update(updateData);
  }
}
