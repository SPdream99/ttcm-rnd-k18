/**
 * PORT: LessonRepository
 *
 * Lessons là subcollection: /courses/{courseId}/lessons/{lessonId}
 */

import { Lesson } from '../entities/Lesson';

export interface LessonRepository {
  getLessonsByCourse(courseId: string): Promise<Lesson[]>;
  getLessonById(courseId: string, lessonId: string): Promise<Lesson | null>;
  saveLesson(lesson: Lesson): Promise<void>;
  deleteLesson(courseId: string, lessonId: string): Promise<void>;
}
