/**
 * USE-CASE: CreateCourse
 *
 * Business rules (theo security rules thực tế):
 * - Chỉ instructor hoặc admin mới được tạo khóa học
 * - instructorId phải trùng với uid người tạo
 * - isPublished ban đầu luôn là false (draft)
 */

import { Course } from '../../entities/Course';
import { CourseRepository } from '../../ports/CourseRepository';
import { UserRepository } from '../../ports/UserRepository';

export interface CreateCourseInput {
  title: string;
  description: string;
  instructorId: string;
  thumbnailUrl?: string;
  tags?: string[];
  categoryId?: string;
  price?: number;
}

export class CreateCourseUseCase {
  constructor(
    private readonly courseRepo: CourseRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async execute(input: CreateCourseInput): Promise<Course> {
    // Rule: Người tạo phải là instructor hoặc admin
    const instructor = await this.userRepo.getUserById(input.instructorId);
    if (!instructor) {
      throw new Error('Không tìm thấy người dùng.');
    }
    if (instructor.role !== 'instructor' && instructor.role !== 'admin') {
      throw new Error('Chỉ giảng viên hoặc admin mới có thể tạo khóa học.');
    }

    if (!input.title.trim()) {
      throw new Error('Tên khóa học không được để trống.');
    }

    const newCourse: Course = {
      id: crypto.randomUUID(),
      title: input.title.trim(),
      description: input.description,
      instructorId: input.instructorId,
      isPublished: false,   // luôn bắt đầu là draft
      thumbnailUrl: input.thumbnailUrl,
      tags: input.tags ?? [],
      categoryId: input.categoryId,
      price: input.price ?? 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.courseRepo.saveCourse(newCourse);
    return newCourse;
  }
}
