/**
 * ENTITY: Lesson
 *
 * Subcollection: /courses/{courseId}/lessons/{lessonId}
 * (Bài học nằm bên trong khóa học)
 */

export type LessonType = 'video' | 'text' | 'quiz';

export interface Lesson {
  id: string;
  courseId: string;       // ID của khóa học cha
  title: string;
  description?: string;
  type: LessonType;
  videoUrl?: string;      // nếu type = 'video'
  content?: string;       // nếu type = 'text'
  duration?: number;      // giây
  order: number;          // thứ tự trong khóa học
  createdAt: Date;
  updatedAt: Date;
}
