import {
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { TeacherPort } from "@/core/ports/TeacherPort";
import {
  TeacherMetric,
  TeacherClassItem,
  TeacherAssignmentItem,
  TeacherLectureItem,
  TeacherClassStudentItem,
} from "@/core/entities/Teacher";
import { cacheService } from "@/lib/cacheService";

export class FirestoreTeacherRepo implements TeacherPort {
  async getStats(): Promise<TeacherMetric[]> {
    return cacheService.getOrFetch(
      "teacher_stats",
      async () => {
        try {
          const [classesSnap, assignmentsSnap, studentsSnap] = await Promise.all([
            getDocs(collection(db, "classes")),
            getDocs(collection(db, "assignments")),
            getDocs(collection(db, "class_members")),
          ]);

          const totalClasses = classesSnap.size || 2;
          const totalAssignments = assignmentsSnap.size || 3;
          const totalStudents = studentsSnap.size || 24;

          return [
            {
              title: "Tổng Số Lớp Phụ Trách",
              value: `${totalClasses} Lớp`,
              change: "Học kỳ 1 - 2026",
              color: "text-red-600",
              bgColor: "bg-red-50",
              borderColor: "border-red-200",
            },
            {
              title: "Tổng Số Học Viên",
              value: `${totalStudents} Học Viên`,
              change: "Tỉ lệ chuyên cần 98%",
              color: "text-zinc-900",
              bgColor: "bg-zinc-50",
              borderColor: "border-zinc-200",
            },
            {
              title: "Bài Tập Đã Giao",
              value: `${totalAssignments} Bài Tập`,
              change: "Đang mở nhận bài",
              color: "text-emerald-700",
              bgColor: "bg-emerald-50",
              borderColor: "border-emerald-200",
            },
          ];
        } catch {
          return [
            {
              title: "Tổng Số Lớp Phụ Trách",
              value: "2 Lớp",
              change: "Học kỳ 1 - 2026",
              color: "text-red-600",
              bgColor: "bg-red-50",
              borderColor: "border-red-200",
            },
            {
              title: "Tổng Số Học Viên",
              value: "24 Học Viên",
              change: "Tỉ lệ chuyên cần 98%",
              color: "text-zinc-900",
              bgColor: "bg-zinc-50",
              borderColor: "border-zinc-200",
            },
            {
              title: "Bài Tập Đã Giao",
              value: "3 Bài Tập",
              change: "Đang mở nhận bài",
              color: "text-emerald-700",
              bgColor: "bg-emerald-50",
              borderColor: "border-emerald-200",
            },
          ];
        }
      },
      { ttlMs: 60000 }
    );
  }

  async getClasses(): Promise<TeacherClassItem[]> {
    return cacheService.getOrFetch(
      "teacher_classes_list",
      async () => {
        try {
          const snap = await getDocs(collection(db, "classes"));
          const list: TeacherClassItem[] = [];

          snap.docs.forEach((d) => {
            const data = d.data();
            list.push({
              id: d.id,
              name: data.name || "Lớp Học",
              grade: data.code || "K18",
              studentsCount: Number(data.total_students) || 24,
              subject: data.subject || "Lập Trình",
              avgGpa: "8.8",
            });
          });

          return list;
        } catch {
          return [];
        }
      },
      { ttlMs: 60000 }
    );
  }

  async getAssignments(classId?: string): Promise<TeacherAssignmentItem[]> {
    const cacheKey = classId ? `teacher_assignments_${classId}` : "teacher_assignments_all";

    return cacheService.getOrFetch(
      cacheKey,
      async () => {
        try {
          const snap = await getDocs(collection(db, "assignments"));
          const list: TeacherAssignmentItem[] = [];

          snap.docs.forEach((d) => {
            const data = d.data();
            if (classId && data.class_id && data.class_id !== classId) return;

            list.push({
              id: d.id,
              title: data.title || "Bài tập",
              className: data.subject || "Lớp K18",
              dueDate: data.dueDate || data.due_date || "2026-08-30",
              submittedCount: 1,
              totalCount: 24,
              status: data.status === "submitted" ? "Đã Nộp" : "Đang Giao",
            });
          });

          return list;
        } catch {
          return [];
        }
      },
      { ttlMs: 60000 }
    );
  }

  async getLectures(classId?: string): Promise<TeacherLectureItem[]> {
    const cacheKey = classId ? `teacher_lectures_${classId}` : "teacher_lectures_all";

    return cacheService.getOrFetch(
      cacheKey,
      async () => {
        try {
          const snap = await getDocs(collection(db, "lectures"));
          const list: TeacherLectureItem[] = [];

          snap.docs.forEach((d) => {
            const data = d.data();
            if (classId && data.class_id && data.class_id !== classId) return;

            list.push({
              id: d.id,
              title: data.title || "Bài giảng",
              className: "Lập Trình Web K18",
              date: data.date || "2026-08-10",
              duration: "90 phút",
              slidesCount: 32,
            });
          });

          return list;
        } catch {
          return [];
        }
      },
      { ttlMs: 60000 }
    );
  }

  async getClassStudents(classId?: string): Promise<TeacherClassStudentItem[]> {
    const cacheKey = classId ? `teacher_students_${classId}` : "teacher_students_all";

    return cacheService.getOrFetch(
      cacheKey,
      async () => {
        try {
          const snap = await getDocs(collection(db, "class_members"));
          const list: TeacherClassStudentItem[] = [];

          snap.docs.forEach((d) => {
            const data = d.data();
            if (classId && data.class_id && data.class_id !== classId) return;
            if (data.role === "Teacher") return;

            list.push({
              id: data.student_id || d.id,
              name: data.student_name || "Học Viên",
              code: "STD-2026-01",
              className: "Lập Trình Web K18",
              gpa: "9.2",
              attendance: `${data.attendance_rate || 96}%`,
              status: "Đang Học",
            });
          });

          return list;
        } catch {
          return [];
        }
      },
      { ttlMs: 60000 }
    );
  }
}
