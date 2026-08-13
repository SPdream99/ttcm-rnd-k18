import { Course } from "../entities/Course";

export interface CoursePort {
  getCourseById(id: string): Promise<Course | null>;
  getCourseByCustomId(courseId: string): Promise<Course | null>;
  createCourse(course: Omit<Course, "id" | "createdAt" | "updatedAt">): Promise<Course>;
  updateCourse(id: string, course: Partial<Course>): Promise<Course>;
  deleteCourse(id: string): Promise<boolean>;
  getTeacherCourses(teacherId: string): Promise<Course[]>;
  getAllCourses(onlyAccepted?: boolean): Promise<Course[]>;
  approveCourse(id: string, approve: boolean): Promise<boolean>;
}
