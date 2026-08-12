/**
 * ENTITY: Discussion
 *
 * Diễn đàn Thảo luận / Hỏi đáp Lớp học
 */

export interface Discussion {
  id: string;
  courseId: string;
  lessonId?: string;
  authorId: string;
  authorName: string;
  authorRole: 'student' | 'instructor' | 'admin';
  authorAvatar?: string;
  title: string;
  content: string;
  replyCount: number;
  isResolved: boolean;
  createdAt: Date;
  updatedAt: Date;
}
