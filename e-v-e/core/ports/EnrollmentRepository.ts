/**
 * PORT: EnrollmentRepository
 *
 * Dùng userId + completedLessonIds theo schema Firestore thực tế.
 * id format: "{userId}_{courseId}"
 */

import { Enrollment } from '../entities/Enrollment';

export interface EnrollmentRepository {
  getEnrollmentsByUser(userId: string): Promise<Enrollment[]>;
  getEnrollmentsByCourse(courseId: string): Promise<Enrollment[]>;
  findEnrollment(userId: string, courseId: string): Promise<Enrollment | null>;
  enrollUser(enrollment: Enrollment): Promise<void>;
  updateProgress(enrollmentId: string, progress: number, completedLessonIds: string[]): Promise<void>;
}
