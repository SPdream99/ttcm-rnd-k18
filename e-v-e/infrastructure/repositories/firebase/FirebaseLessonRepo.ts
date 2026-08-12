/**
 * FIREBASE: FirebaseLessonRepo
 *
 * Lessons là SUBCOLLECTION: /courses/{courseId}/lessons/{lessonId}
 */

import { adminDb } from '@/infrastructure/firebase/firebaseAdmin';
import { Lesson, LessonType } from '@/core/entities/Lesson';
import { LessonRepository } from '@/core/ports/LessonRepository';

function toLesson(courseId: string, id: string, data: FirebaseFirestore.DocumentData): Lesson {
  return {
    id,
    courseId,
    title: data.title ?? '',
    description: data.description ?? undefined,
    type: (data.type ?? 'video') as LessonType,
    videoUrl: data.videoUrl ?? undefined,
    content: data.content ?? undefined,
    duration: data.duration ?? undefined,
    order: data.order ?? 0,
    createdAt: data.createdAt?.toDate() ?? new Date(),
    updatedAt: data.updatedAt?.toDate() ?? new Date(),
  };
}

export class FirebaseLessonRepo implements LessonRepository {
  private lessonsRef(courseId: string) {
    return adminDb.collection('courses').doc(courseId).collection('lessons');
  }

  async getLessonsByCourse(courseId: string): Promise<Lesson[]> {
    const snapshot = await this.lessonsRef(courseId)
      .orderBy('order', 'asc')
      .get();
    return snapshot.docs.map((doc) => toLesson(courseId, doc.id, doc.data()));
  }

  async getLessonById(courseId: string, lessonId: string): Promise<Lesson | null> {
    const doc = await this.lessonsRef(courseId).doc(lessonId).get();
    if (!doc.exists) return null;
    return toLesson(courseId, doc.id, doc.data()!);
  }

  async saveLesson(lesson: Lesson): Promise<void> {
    await this.lessonsRef(lesson.courseId).doc(lesson.id).set({
      title: lesson.title,
      description: lesson.description ?? null,
      type: lesson.type,
      videoUrl: lesson.videoUrl ?? null,
      content: lesson.content ?? null,
      duration: lesson.duration ?? null,
      order: lesson.order,
      createdAt: lesson.createdAt,
      updatedAt: new Date(),
    });
  }

  async deleteLesson(courseId: string, lessonId: string): Promise<void> {
    await this.lessonsRef(courseId).doc(lessonId).delete();
  }
}
