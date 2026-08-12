/**
 * ENTITY: Course
 *
 * Khớp với schema Firestore collection "courses"
 * - instructorId (không phải teacherId)
 * - isPublished: boolean (không phải status: string)
 */

export interface Course {
  id: string;
  title: string;
  description: string;
  instructorId: string;   // uid của instructor
  isPublished: boolean;   // true = published, false = draft
  thumbnailUrl?: string;
  tags: string[];
  categoryId?: string;    // liên kết với collection categories
  price?: number;         // 0 = miễn phí
  createdAt: Date;
  updatedAt: Date;
}
