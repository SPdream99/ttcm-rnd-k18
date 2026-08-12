import {
  TeacherMetric,
  TeacherClassItem,
  TeacherAssignmentItem,
  TeacherLectureItem,
  TeacherClassStudentItem,
} from "../entities/Teacher";

export interface TeacherPort {
  getStats(): Promise<TeacherMetric[]>;
  getClasses(): Promise<TeacherClassItem[]>;
  getAssignments(classId?: string): Promise<TeacherAssignmentItem[]>;
  getLectures(classId?: string): Promise<TeacherLectureItem[]>;
  getClassStudents(classId?: string): Promise<TeacherClassStudentItem[]>;
}
