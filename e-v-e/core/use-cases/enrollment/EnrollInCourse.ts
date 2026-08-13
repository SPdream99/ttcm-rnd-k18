/**
 * USE-CASE: EnrollInCourse
 *
 * Business rules (theo security rules thực tế):
 * - Enrollment ID = "{userId}_{courseId}"
 * - Khóa học phải isPublished = true
 * - Không đăng ký trùng
 * - QUAN TRỌNG: Theo security rules, việc TẠO enrollment phải qua Admin SDK
 *   (Cloud Functions / Webhook thanh toán). Use-case này chỉ dùng phía server.
 */

import { Enrollment } from '../../entities/Enrollment';
import { EnrollmentRepository } from '../../ports/EnrollmentRepository';
import { CourseRepository } from '../../ports/CourseRepository';

export interface EnrollInCourseInput {
  userId: string;
  courseId: string;
}

export class EnrollInCourseUseCase {
  constructor(
    private readonly enrollmentRepo: EnrollmentRepository,
    private readonly courseRepo: CourseRepository,
  ) {}

  async execute(input: EnrollInCourseInput): Promise<Enrollment> {
    // Rule 1: Khóa học phải tồn tại và đã publish
    const course = await this.courseRepo.getCourseById(input.courseId);
    if (!course) {
      throw new Error('Không tìm thấy khóa học.');
    }
    if (!course.isPublished) {
      throw new Error('Khóa học này chưa được mở đăng ký.');
    }

    // Rule 2: Không đăng ký trùng
    const existing = await this.enrollmentRepo.findEnrollment(input.userId, input.courseId);
    if (existing) {
      throw new Error('Bạn đã đăng ký khóa học này rồi.');
    }

    // ID format: "{userId}_{courseId}" (theo security rules)
    const newEnrollment: Enrollment = {
      id: `${input.userId}_${input.courseId}`,
      userId: input.userId,
      courseId: input.courseId,
      progress: 0,
      completedLessonIds: [],
      enrolledAt: new Date(),
    };

    await this.enrollmentRepo.enrollUser(newEnrollment);
    return newEnrollment;
  }
}
