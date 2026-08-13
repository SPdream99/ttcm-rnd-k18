/**
 * ENTITY: Announcement
 *
 * Thông báo trong lớp học từ giảng viên
 */

export interface Announcement {
  id: string;
  courseId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  title: string;
  content: string;
  isImportant: boolean;
  createdAt: Date;
}
