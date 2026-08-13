import { TeacherPort } from "../ports/TeacherPort";

export class GetTeacherDashboardUseCase {
  constructor(private teacherPort: TeacherPort) {}

  async execute() {
    const [stats, classes] = await Promise.all([
      this.teacherPort.getStats(),
      this.teacherPort.getClasses(),
    ]);

    return {
      stats,
      classes,
    };
  }
}

export class ManageTeacherClassDetailsUseCase {
  constructor(private teacherPort: TeacherPort) {}

  async execute(classId?: string) {
    const [assignments, lectures, students] = await Promise.all([
      this.teacherPort.getAssignments(classId),
      this.teacherPort.getLectures(classId),
      this.teacherPort.getClassStudents(classId),
    ]);

    return {
      assignments,
      lectures,
      students,
    };
  }
}
