/**
 * ENTITY: Enrollment
 *
 * Khớp với schema Firestore collection "enrollments"
 * - id format: "{userId}_{courseId}" (theo security rules)
 * - userId (không phải studentId)
 * - completedLessonIds: mảng ID các bài học đã hoàn thành
 * - lastAccessedAt: lần cuối truy cập
 * - progress: 0-100 (phần trăm hoàn thành)
 */

export interface Enrollment {
  id: string;               // format: "{userId}_{courseId}"
  userId: string;           // uid của học viên
  courseId: string;
  progress: number;         // 0 → 100
  completedLessonIds: string[];
  enrolledAt: Date;
  lastAccessedAt?: Date;
  completedAt?: Date;
}
