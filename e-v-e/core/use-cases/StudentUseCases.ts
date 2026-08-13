import { StudentPort } from "../ports/StudentPort";

export class GetStudentDashboardUseCase {
  constructor(private studentPort: StudentPort) {}

  async execute(statusFilter?: string, query?: string) {
    const [stats, courses, upcomingClasses] = await Promise.all([
      this.studentPort.getStats(),
      this.studentPort.getCourses(statusFilter, query),
      this.studentPort.getUpcomingClasses(),
    ]);

    return {
      stats,
      courses,
      upcomingClasses,
    };
  }
}

export class GetStudentClassDetailsUseCase {
  constructor(private studentPort: StudentPort) {}

  async execute(classId?: string) {
    const [assignments, members] = await Promise.all([
      this.studentPort.getClassAssignments(classId),
      this.studentPort.getClassMembers(classId),
    ]);

    return {
      assignments,
      members,
    };
  }
}
