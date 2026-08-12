/**
 * FIREBASE: FirebaseCourseRepo
 *
 * Field mapping (Firestore → Entity):
 *   instructorId ✓
 *   isPublished ✓ (boolean)
 *   categoryId, price thêm mới
 */

import { adminDb } from '@/infrastructure/firebase/firebaseAdmin';
import { Course } from '@/core/entities/Course';
import { CourseRepository } from '@/core/ports/CourseRepository';

const COLLECTION = 'courses';

function toCourse(id: string, data: FirebaseFirestore.DocumentData): Course {
  return {
    id,
    title: data.title ?? '',
    description: data.description ?? '',
    instructorId: data.instructorId ?? '',
    isPublished: data.isPublished ?? false,
    thumbnailUrl: data.thumbnailUrl ?? undefined,
    tags: data.tags ?? [],
    categoryId: data.categoryId ?? undefined,
    price: data.price ?? 0,
    createdAt: data.createdAt?.toDate() ?? new Date(),
    updatedAt: data.updatedAt?.toDate() ?? new Date(),
  };
}

export class FirebaseCourseRepo implements CourseRepository {
  async getCourseById(id: string): Promise<Course | null> {
    const doc = await adminDb.collection(COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    return toCourse(doc.id, doc.data()!);
  }

  async getCoursesByInstructor(instructorId: string): Promise<Course[]> {
    const snapshot = await adminDb
      .collection(COLLECTION)
      .where('instructorId', '==', instructorId)
      .get();
    return snapshot.docs.map((doc) => toCourse(doc.id, doc.data()));
  }

  async getAllPublished(): Promise<Course[]> {
    const snapshot = await adminDb
      .collection(COLLECTION)
      .where('isPublished', '==', true)
      .get();
    return snapshot.docs.map((doc) => toCourse(doc.id, doc.data()));
  }

  async saveCourse(course: Course): Promise<void> {
    await adminDb.collection(COLLECTION).doc(course.id).set({
      title: course.title,
      description: course.description,
      instructorId: course.instructorId,
      isPublished: course.isPublished,
      thumbnailUrl: course.thumbnailUrl ?? null,
      tags: course.tags,
      categoryId: course.categoryId ?? null,
      price: course.price ?? 0,
      createdAt: course.createdAt,
      updatedAt: new Date(),
    });
  }

  async deleteCourse(id: string): Promise<void> {
    await adminDb.collection(COLLECTION).doc(id).delete();
  }
}
