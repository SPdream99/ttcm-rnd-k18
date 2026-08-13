import { useState, useEffect, useMemo } from "react";
import { MockTeacherRepo } from "@/infrastructure/repositories/MockTeacherRepo";
import {
  GetTeacherDashboardUseCase,
  ManageTeacherClassDetailsUseCase,
} from "@/core/use-cases/TeacherUseCases";
import {
  TeacherMetric,
  TeacherClassItem,
  TeacherAssignmentItem,
  TeacherLectureItem,
  TeacherClassStudentItem,
} from "@/core/entities/Teacher";

export function useTeacherAdapter(classId?: string) {
  const [stats, setStats] = useState<TeacherMetric[]>([]);
  const [classes, setClasses] = useState<TeacherClassItem[]>([]);
  const [assignments, setAssignments] = useState<TeacherAssignmentItem[]>([]);
  const [lectures, setLectures] = useState<TeacherLectureItem[]>([]);
  const [students, setStudents] = useState<TeacherClassStudentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const teacherRepo = useMemo(() => new MockTeacherRepo(), []);
  const getDashboardUseCase = useMemo(() => new GetTeacherDashboardUseCase(teacherRepo), [teacherRepo]);
  const getClassDetailsUseCase = useMemo(() => new ManageTeacherClassDetailsUseCase(teacherRepo), [teacherRepo]);

  useEffect(() => {
    getDashboardUseCase.execute().then((data) => {
      setStats(data.stats);
      setClasses(data.classes);
      setLoading(false);
    });
  }, [getDashboardUseCase]);

  useEffect(() => {
    getClassDetailsUseCase.execute(classId).then((data) => {
      setAssignments(data.assignments);
      setLectures(data.lectures);
      setStudents(data.students);
    });
  }, [getClassDetailsUseCase, classId]);

  return {
    stats,
    classes,
    assignments,
    lectures,
    students,
    loading,
  };
}
