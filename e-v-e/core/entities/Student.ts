export interface StudentProgressStat {
  label: string;
  value: string;
  change: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export interface StudentCourse {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  currentChapter: string;
  nextLesson: string;
  status: "inProgress" | "completed";
  tag: string;
  color: string;
}

export interface UpcomingClass {
  id: number;
  title: string;
  time: string;
  instructor: string;
  room: string;
  urgent: boolean;
}

export interface ClassAssignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  score?: string;
}

export interface ClassMember {
  id: string;
  name: string;
  role: "Teacher" | "Student" | "Monitor";
  avatar?: string;
  email: string;
}
