/**
 * MOCK: MockEnrollmentRepo — cập nhật theo schema thực tế
 */

import { Enrollment } from '@/core/entities/Enrollment';
import { EnrollmentRepository } from '@/core/ports/EnrollmentRepository';

const MOCK_ENROLLMENTS: Enrollment[] = [
  {
    id: 'user-001_course-001',   // format: userId_courseId
    userId: 'user-001',
    courseId: 'course-001',
    progress: 45,
    completedLessonIds: ['lesson-1', 'lesson-2'],
    enrolledAt: new Date('2024-02-05'),
    lastAccessedAt: new Date('2024-03-01'),
  },
];

export class MockEnrollmentRepo implements EnrollmentRepository {
  private enrollments: Enrollment[] = [...MOCK_ENROLLMENTS];

  async getEnrollmentsByUser(userId: string): Promise<Enrollment[]> {
    return this.enrollments.filter((e) => e.userId === userId);
  }

  async getEnrollmentsByCourse(courseId: string): Promise<Enrollment[]> {
    return this.enrollments.filter((e) => e.courseId === courseId);
  }

  async findEnrollment(userId: string, courseId: string): Promise<Enrollment | null> {
    return this.enrollments.find(
      (e) => e.userId === userId && e.courseId === courseId,
    ) ?? null;
  }

  async enrollUser(enrollment: Enrollment): Promise<void> {
    this.enrollments.push(enrollment);
  }

  async updateProgress(
    enrollmentId: string,
    progress: number,
    completedLessonIds: string[],
  ): Promise<void> {
    const e = this.enrollments.find((e) => e.id === enrollmentId);
    if (e) {
      e.progress = Math.min(100, Math.max(0, progress));
      e.completedLessonIds = completedLessonIds;
      e.lastAccessedAt = new Date();
      if (e.progress === 100) e.completedAt = new Date();
    }
  }
}
