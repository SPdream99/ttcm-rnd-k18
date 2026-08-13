/**
 * USE-CASE: GetPublishedCourses
 *
 * Lấy tất cả các khóa học có trạng thái 'published'.
 * Đây là danh sách công khai cho học sinh xem.
 */

import { Course } from '../../entities/Course';
import { CourseRepository } from '../../ports/CourseRepository';

export class GetPublishedCoursesUseCase {
  constructor(private readonly courseRepo: CourseRepository) {}

  async execute(): Promise<Course[]> {
    return this.courseRepo.getAllPublished();
  }
}
