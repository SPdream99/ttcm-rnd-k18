/**
 * USE-CASE: GetMyEnrollments
 *
 * Lấy danh sách tất cả khóa học đã đăng ký của một người dùng.
 */

import { Enrollment } from '../../entities/Enrollment';
import { EnrollmentRepository } from '../../ports/EnrollmentRepository';

export class GetMyEnrollmentsUseCase {
  constructor(private readonly enrollmentRepo: EnrollmentRepository) {}

  async execute(userId: string): Promise<Enrollment[]> {
    return this.enrollmentRepo.getEnrollmentsByUser(userId);
  }
}
