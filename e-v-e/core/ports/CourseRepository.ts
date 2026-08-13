/**
 * PORT: CourseRepository
 *
 * Dùng instructorId + isPublished theo schema Firestore thực tế.
 */

import { Course } from '../entities/Course';

export interface CourseRepository {
  getCourseById(id: string): Promise<Course | null>;
  getCoursesByInstructor(instructorId: string): Promise<Course[]>;
  getAllPublished(): Promise<Course[]>;
  saveCourse(course: Course): Promise<void>;
  deleteCourse(id: string): Promise<void>;
}
