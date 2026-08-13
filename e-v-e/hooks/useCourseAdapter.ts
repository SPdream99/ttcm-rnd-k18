import { useState, useMemo, useCallback } from "react";
import { Course } from "@/core/entities/Course";
import { CoursePort } from "@/core/ports/CoursePort";
import { FirestoreCourseRepo } from "@/infrastructure/repositories/FirestoreCourseRepo";
import {
  GetCourseUseCase,
  CreateCourseUseCase,
  UpdateCourseUseCase,
  DeleteCourseUseCase,
  GetTeacherCoursesUseCase,
  GetAllCoursesUseCase,
  ApproveCourseUseCase,
} from "@/core/use-cases/CourseUseCases";

export function useCourseAdapter(customRepo?: CoursePort) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const courseRepo = useMemo(
    () => customRepo || new FirestoreCourseRepo(),
    [customRepo]
  );

  const getCourseUseCase = useMemo(
    () => new GetCourseUseCase(courseRepo),
    [courseRepo]
  );
  const createCourseUseCase = useMemo(
    () => new CreateCourseUseCase(courseRepo),
    [courseRepo]
  );
  const updateCourseUseCase = useMemo(
    () => new UpdateCourseUseCase(courseRepo),
    [courseRepo]
  );
  const deleteCourseUseCase = useMemo(
    () => new DeleteCourseUseCase(courseRepo),
    [courseRepo]
  );
  const getTeacherCoursesUseCase = useMemo(
    () => new GetTeacherCoursesUseCase(courseRepo),
    [courseRepo]
  );
  const getAllCoursesUseCase = useMemo(
    () => new GetAllCoursesUseCase(courseRepo),
    [courseRepo]
  );
  const approveCourseUseCase = useMemo(
    () => new ApproveCourseUseCase(courseRepo),
    [courseRepo]
  );

  const loadCourse = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const course = await getCourseUseCase.execute(id);
        setCurrentCourse(course);
        return course;
      } catch (err: any) {
        setError(err.message || "Không thể tải khóa học");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [getCourseUseCase]
  );

  const loadCourseByCustomId = useCallback(
    async (courseId: string) => {
      setLoading(true);
      setError(null);
      try {
        const course = await getCourseUseCase.executeByCustomId(courseId);
        setCurrentCourse(course);
        return course;
      } catch (err: any) {
        setError(err.message || "Không thể tải khóa học");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [getCourseUseCase]
  );

  const loadTeacherCourses = useCallback(
    async (teacherId: string) => {
      setLoading(true);
      setError(null);
      try {
        const list = await getTeacherCoursesUseCase.execute(teacherId);
        setCourses(list);
        return list;
      } catch (err: any) {
        setError(
          err.message || "Không thể tải danh sách khóa học của giáo viên"
        );
        return [];
      } finally {
        setLoading(false);
      }
    },
    [getTeacherCoursesUseCase]
  );

  const loadAllCourses = useCallback(
    async (onlyAccepted?: boolean) => {
      setLoading(true);
      setError(null);
      try {
        const list = await getAllCoursesUseCase.execute(onlyAccepted);
        setCourses(list);
        return list;
      } catch (err: any) {
        setError(err.message || "Không thể tải danh sách khóa học");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [getAllCoursesUseCase]
  );

  const createCourse = useCallback(
    async (
      courseData: Omit<Course, "id" | "createdAt" | "updatedAt">
    ) => {
      setLoading(true);
      setError(null);
      try {
        const newCourse = await createCourseUseCase.execute(courseData);
        setCourses((prev) => [...prev, newCourse]);
        return newCourse;
      } catch (err: any) {
        setError(err.message || "Không thể tạo khóa học mới");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [createCourseUseCase]
  );

  const updateCourse = useCallback(
    async (id: string, courseData: Partial<Course>) => {
      setLoading(true);
      setError(null);
      try {
        const updated = await updateCourseUseCase.execute(id, courseData);
        setCourses((prev) => prev.map((c) => (c.id === id ? updated : c)));
        if (currentCourse?.id === id) {
          setCurrentCourse(updated);
        }
        return updated;
      } catch (err: any) {
        setError(err.message || "Không thể cập nhật khóa học");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [updateCourseUseCase, currentCourse]
  );

  const deleteCourse = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const success = await deleteCourseUseCase.execute(id);
        if (success) {
          setCourses((prev) => prev.filter((c) => c.id !== id));
          if (currentCourse?.id === id) {
            setCurrentCourse(null);
          }
        }
        return success;
      } catch (err: any) {
        setError(err.message || "Không thể xóa khóa học");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [deleteCourseUseCase, currentCourse]
  );

  const approveCourse = useCallback(
    async (id: string, approve: boolean) => {
      setLoading(true);
      setError(null);
      try {
        const success = await approveCourseUseCase.execute(id, approve);
        if (success) {
          setCourses((prev) =>
            prev.map((c) =>
              c.id === id ? { ...c, isAccepted: approve } : c
            )
          );
          if (currentCourse?.id === id) {
            setCurrentCourse((prev) =>
              prev ? { ...prev, isAccepted: approve } : null
            );
          }
        }
        return success;
      } catch (err: any) {
        setError(err.message || "Không thể duyệt khóa học");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [approveCourseUseCase, currentCourse]
  );

  return {
    courses,
    currentCourse,
    loading,
    error,
    loadCourse,
    loadCourseByCustomId,
    loadTeacherCourses,
    loadAllCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    approveCourse,
  };
}
