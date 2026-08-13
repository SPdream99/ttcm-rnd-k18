import {
  SchoolMetric,
  GradeBreakdown,
  DepartmentRanking,
  SchoolEvent,
  SchoolTeacherItem,
  SchoolStudentItem,
} from "../entities/School";

export interface SchoolPort {
  getSchoolMetrics(): Promise<SchoolMetric[]>;
  getGradeBreakdown(): Promise<GradeBreakdown[]>;
  getDepartmentRankings(): Promise<DepartmentRanking[]>;
  getSchoolEvents(): Promise<SchoolEvent[]>;
  getSchoolStudents(gradeFilter?: string, searchQuery?: string): Promise<SchoolStudentItem[]>;
  getSchoolTeachers(deptFilter?: string, searchQuery?: string): Promise<SchoolTeacherItem[]>;
}
