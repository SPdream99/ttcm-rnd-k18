import { useState, useEffect, useMemo } from "react";
import { MockSchoolRepo } from "@/infrastructure/repositories/MockSchoolRepo";
import {
  GetSchoolDashboardUseCase,
  ManageSchoolStudentsUseCase,
  ManageSchoolTeachersUseCase,
} from "@/core/use-cases/SchoolUseCases";
import {
  SchoolMetric,
  GradeBreakdown,
  DepartmentRanking,
  SchoolEvent,
  SchoolStudentItem,
  SchoolTeacherItem,
} from "@/core/entities/School";

export function useSchoolAdapter() {
  const [metrics, setMetrics] = useState<SchoolMetric[]>([]);
  const [gradeBreakdown, setGradeBreakdown] = useState<GradeBreakdown[]>([]);
  const [departmentRankings, setDepartmentRankings] = useState<DepartmentRanking[]>([]);
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [students, setStudents] = useState<SchoolStudentItem[]>([]);
  const [teachers, setTeachers] = useState<SchoolTeacherItem[]>([]);
  const [loading, setLoading] = useState(true);

  const schoolRepo = useMemo(() => new MockSchoolRepo(), []);
  const getDashboardUseCase = useMemo(() => new GetSchoolDashboardUseCase(schoolRepo), [schoolRepo]);
  const manageStudentsUseCase = useMemo(() => new ManageSchoolStudentsUseCase(schoolRepo), [schoolRepo]);
  const manageTeachersUseCase = useMemo(() => new ManageSchoolTeachersUseCase(schoolRepo), [schoolRepo]);

  useEffect(() => {
    getDashboardUseCase.execute().then((data) => {
      setMetrics(data.metrics);
      setGradeBreakdown(data.gradeBreakdown);
      setDepartmentRankings(data.departmentRanking);
      setEvents(data.events);
      setLoading(false);
    });
  }, [getDashboardUseCase]);

  const loadStudents = async (gradeFilter?: string, searchQuery?: string) => {
    const list = await manageStudentsUseCase.execute(gradeFilter, searchQuery);
    setStudents(list);
  };

  const loadTeachers = async (deptFilter?: string, searchQuery?: string) => {
    const list = await manageTeachersUseCase.execute(deptFilter, searchQuery);
    setTeachers(list);
  };

  return {
    metrics,
    gradeBreakdown,
    departmentRankings,
    events,
    students,
    teachers,
    loading,
    loadStudents,
    loadTeachers,
  };
}
