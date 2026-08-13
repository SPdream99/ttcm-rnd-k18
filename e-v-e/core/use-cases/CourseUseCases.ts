import { Course } from "../entities/Course";
import { CoursePort } from "../ports/CoursePort";

export class GetCourseUseCase {
  constructor(private coursePort: CoursePort) {}

  async execute(id: string): Promise<Course | null> {
    return this.coursePort.getCourseById(id);
  }

  async executeByCustomId(courseId: string): Promise<Course | null> {
    return this.coursePort.getCourseByCustomId(courseId);
  }
}

export class CreateCourseUseCase {
  constructor(private coursePort: CoursePort) {}

  async execute(
    course: Omit<Course, "id" | "createdAt" | "updatedAt">
  ): Promise<Course> {
    if (!course.title) {
      throw new Error("Tên khóa học không được để trống.");
    }
    return this.coursePort.createCourse(course);
  }
}

export class UpdateCourseUseCase {
  constructor(private coursePort: CoursePort) {}

  async execute(id: string, course: Partial<Course>): Promise<Course> {
    return this.coursePort.updateCourse(id, course);
  }
}

export class DeleteCourseUseCase {
  constructor(private coursePort: CoursePort) {}

  async execute(id: string): Promise<boolean> {
    return this.coursePort.deleteCourse(id);
  }
}

export class GetTeacherCoursesUseCase {
  constructor(private coursePort: CoursePort) {}

  async execute(teacherId: string): Promise<Course[]> {
    return this.coursePort.getTeacherCourses(teacherId);
  }
}

export class GetAllCoursesUseCase {
  constructor(private coursePort: CoursePort) {}

  async execute(onlyAccepted?: boolean): Promise<Course[]> {
    return this.coursePort.getAllCourses(onlyAccepted);
  }
}

export class ApproveCourseUseCase {
  constructor(private coursePort: CoursePort) {}

  async execute(id: string, approve: boolean): Promise<boolean> {
    return this.coursePort.approveCourse(id, approve);
  }
}
