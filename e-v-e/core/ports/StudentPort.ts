import {
  StudentProgressStat,
  StudentCourse,
  UpcomingClass,
  ClassAssignment,
  ClassMember,
} from "../entities/Student";

export interface StudentPort {
  getStats(): Promise<StudentProgressStat[]>;
  getCourses(statusFilter?: string, query?: string): Promise<StudentCourse[]>;
  getUpcomingClasses(): Promise<UpcomingClass[]>;
  getClassAssignments(classId?: string): Promise<ClassAssignment[]>;
  getClassMembers(classId?: string): Promise<ClassMember[]>;
}
