import { Course } from "@/core/entities/Course";
import { CoursePort } from "@/core/ports/CoursePort";

export class MockCourseRepo implements CoursePort {
  private mockCourses: Course[] = [
    {
      id: "crs_1",
      courseId: "matching_pairs_space",
      title: "Khám Phá Các Chòm Sao",
      japaneseTitle: "星座の探索",
      subtitle: "Học về các chòm sao trong hệ mặt trời và vũ trụ",
      description:
        "Khóa học trực quan giúp bạn nhận diện các chòm sao lớn, truyền thuyết và vị trí của chúng trên bầu trời đêm.",
      instructorId: "usr_teacher_1",
      authorId: "usr_teacher_1",
      isPublished: true,
      isAccepted: true,
      thumbnailUrl: "",
      bannerUrl: "",
      tags: ["Thiên văn học", "Vũ trụ"],
      createdAt: new Date(),
      updatedAt: new Date(),
      contentData: [
        {
          id: "q1",
          title: "Ursa Major (Đại Hùng)",
          rightAnswer: "Chòm sao Gấu Lớn, chứa nhóm sao Cái Gầu Sòng nổi tiếng.",
          wrongAnswers: [
            "Chòm sao Gấu Nhỏ chứa sao Bắc Cực.",
            "Chòm sao Tráng Sĩ Orion.",
            "Chòm sao Thiên Nga Cygnus.",
          ],
        },
        {
          id: "q2",
          title: "Orion (Thợ Săn)",
          rightAnswer:
            "Chòm sao nổi bật trên đường xích đạo trời với chiếc Thắt Lưng Orion độc đáo.",
          wrongAnswers: [
            "Chòm sao Tiên Nữ Andromeda.",
            "Chòm sao Nhân Mã Sagittarius.",
            "Chòm sao Kim Ngưu Taurus.",
          ],
        },
      ],
    },
  ];

  async getCourseById(id: string): Promise<Course | null> {
    return this.mockCourses.find((c) => c.id === id) || null;
  }

  async getCourseByCustomId(courseId: string): Promise<Course | null> {
    return this.mockCourses.find((c) => c.courseId === courseId) || null;
  }

  async createCourse(
    course: Omit<Course, "id" | "createdAt" | "updatedAt">
  ): Promise<Course> {
    const newCourse: Course = {
      ...course,
      id: "crs_" + Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.mockCourses.push(newCourse);
    return newCourse;
  }

  async updateCourse(id: string, course: Partial<Course>): Promise<Course> {
    const index = this.mockCourses.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Course not found");
    const updated = {
      ...this.mockCourses[index],
      ...course,
      updatedAt: new Date(),
    };
    this.mockCourses[index] = updated;
    return updated;
  }

  async deleteCourse(id: string): Promise<boolean> {
    const initialLength = this.mockCourses.length;
    this.mockCourses = this.mockCourses.filter((c) => c.id !== id);
    return this.mockCourses.length < initialLength;
  }

  async getTeacherCourses(teacherId: string): Promise<Course[]> {
    return this.mockCourses.filter((c) => c.authorId === teacherId);
  }

  async getAllCourses(onlyAccepted?: boolean): Promise<Course[]> {
    if (onlyAccepted) {
      return this.mockCourses.filter((c) => c.isAccepted);
    }
    return this.mockCourses;
  }

  async approveCourse(id: string, approve: boolean): Promise<boolean> {
    const course = this.mockCourses.find((c) => c.id === id);
    if (!course) return false;
    course.isAccepted = approve;
    return true;
  }
}
