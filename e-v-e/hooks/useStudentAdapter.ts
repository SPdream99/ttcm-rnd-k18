import { useState, useEffect, useMemo } from "react";
import { MockStudentRepo } from "@/infrastructure/repositories/MockStudentRepo";
import {
  GetStudentDashboardUseCase,
  GetStudentClassDetailsUseCase,
} from "@/core/use-cases/StudentUseCases";
import {
  StudentProgressStat,
  StudentCourse,
  UpcomingClass,
  ClassAssignment,
  ClassMember,
} from "@/core/entities/Student";

export function useStudentAdapter(statusFilter?: string, query?: string, classId?: string) {
  const [stats, setStats] = useState<StudentProgressStat[]>([]);
  const [courses, setCourses] = useState<StudentCourse[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingClass[]>([]);
  const [assignments, setAssignments] = useState<ClassAssignment[]>([]);
  const [members, setMembers] = useState<ClassMember[]>([]);
  const [loading, setLoading] = useState(true);

  const studentRepo = useMemo(() => new MockStudentRepo(), []);
  const getDashboardUseCase = useMemo(() => new GetStudentDashboardUseCase(studentRepo), [studentRepo]);
  const getClassDetailsUseCase = useMemo(() => new GetStudentClassDetailsUseCase(studentRepo), [studentRepo]);

  useEffect(() => {
    getDashboardUseCase.execute(statusFilter, query).then((data) => {
      setStats(data.stats);
      setCourses(data.courses);
      setUpcomingClasses(data.upcomingClasses);
      setLoading(false);
    });
  }, [getDashboardUseCase, statusFilter, query]);

  useEffect(() => {
    getClassDetailsUseCase.execute(classId).then((data) => {
      setAssignments(data.assignments);
      setMembers(data.members);
    });
  }, [getClassDetailsUseCase, classId]);

  return {
    stats,
    courses,
    upcomingClasses,
    assignments,
    members,
    loading,
  };
}
