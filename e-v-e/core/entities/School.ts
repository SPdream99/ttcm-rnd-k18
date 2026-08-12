import { LucideIcon } from "lucide-react";

export interface SchoolMetric {
  title: string;
  value: string;
  change: string;
  icon?: any;
  color: string;
  bgColor: string;
  borderColor: string;
}

export interface GradeBreakdown {
  grade: string;
  classes: number;
  students: number;
  avgGpa: string;
  progress: number;
  color: string;
}

export interface DepartmentRanking {
  name: string;
  head: string;
  classes: number;
  rating: string;
  status: string;
}

export interface SchoolEvent {
  id: number;
  title: string;
  date: string;
  category: string;
  important: boolean;
}

export interface SchoolTeacherItem {
  id: string;
  name: string;
  code: string;
  department: string;
  classesCount: number;
  rating: string;
  status: string;
}

export interface SchoolStudentItem {
  id: string;
  name: string;
  code: string;
  grade: string;
  class: string;
  gpa: string;
  rank: string;
  status: string;
}
