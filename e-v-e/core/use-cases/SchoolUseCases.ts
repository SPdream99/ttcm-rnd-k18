import { SchoolPort } from "../ports/SchoolPort";

export class GetSchoolDashboardUseCase {
  constructor(private schoolPort: SchoolPort) {}

  async execute() {
    const [metrics, gradeBreakdown, departmentRanking, events] = await Promise.all([
      this.schoolPort.getSchoolMetrics(),
      this.schoolPort.getGradeBreakdown(),
      this.schoolPort.getDepartmentRankings(),
      this.schoolPort.getSchoolEvents(),
    ]);

    return {
      metrics,
      gradeBreakdown,
      departmentRanking,
      events,
    };
  }
}

export class ManageSchoolStudentsUseCase {
  constructor(private schoolPort: SchoolPort) {}

  async execute(gradeFilter?: string, searchQuery?: string) {
    return this.schoolPort.getSchoolStudents(gradeFilter, searchQuery);
  }
}

export class ManageSchoolTeachersUseCase {
  constructor(private schoolPort: SchoolPort) {}

  async execute(deptFilter?: string, searchQuery?: string) {
    return this.schoolPort.getSchoolTeachers(deptFilter, searchQuery);
  }
}
