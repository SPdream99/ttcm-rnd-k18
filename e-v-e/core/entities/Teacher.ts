export interface TeacherMetric {
  title: string;
  value: string;
  change: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export interface TeacherClassItem {
  id: string;
  name: string;
  grade: string;
  studentsCount: number;
  subject: string;
  avgGpa: string;
}

export interface TeacherAssignmentItem {
  id: string;
  title: string;
  className: string;
  dueDate: string;
  submittedCount: number;
  totalCount: number;
  status: string;
}

export interface TeacherLectureItem {
  id: string;
  title: string;
  className: string;
  date: string;
  duration: string;
  slidesCount: number;
}

export interface TeacherClassStudentItem {
  id: string;
  name: string;
  code: string;
  className: string;
  gpa: string;
  attendance: string;
  status: string;
}
