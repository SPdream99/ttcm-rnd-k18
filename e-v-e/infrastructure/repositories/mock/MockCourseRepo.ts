/**
 * MOCK: MockCourseRepo — cập nhật theo schema thực tế
 */

import { Course } from '@/core/entities/Course';
import { CourseRepository } from '@/core/ports/CourseRepository';

const MOCK_COURSES: Course[] = [
  {
    id: 'course-001',
    title: 'Nhập Môn Lập Trình Python',
    description: 'Học Python từ con số 0 với E-V-E AI Mentor đồng hành.',
    instructorId: 'user-002',
    isPublished: true,
    tags: ['python', 'lập trình', 'cơ bản'],
    price: 0,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: 'course-002',
    title: 'Toán Cao Cấp — Giải Tích',
    description: 'Nắm vững Giải Tích từ A-Z với lộ trình AI cá nhân hóa.',
    instructorId: 'user-002',
    isPublished: true,
    tags: ['toán', 'giải tích', 'đại học'],
    price: 299000,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-03-01'),
  },
  {
    id: 'course-003',
    title: 'Vật Lý Lượng Tử (Draft)',
    description: 'Khóa học đang được xây dựng.',
    instructorId: 'user-002',
    isPublished: false,
    tags: ['vật lý', 'nâng cao'],
    price: 0,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
  },
];

export class MockCourseRepo implements CourseRepository {
  private courses: Course[] = [...MOCK_COURSES];

  async getCourseById(id: string): Promise<Course | null> {
    return this.courses.find((c) => c.id === id) ?? null;
  }

  async getCoursesByInstructor(instructorId: string): Promise<Course[]> {
    return this.courses.filter((c) => c.instructorId === instructorId);
  }

  async getAllPublished(): Promise<Course[]> {
    return this.courses.filter((c) => c.isPublished === true);
  }

  async saveCourse(course: Course): Promise<void> {
    const index = this.courses.findIndex((c) => c.id === course.id);
    if (index >= 0) this.courses[index] = course;
    else this.courses.push(course);
  }

  async deleteCourse(id: string): Promise<void> {
    this.courses = this.courses.filter((c) => c.id !== id);
  }
}
