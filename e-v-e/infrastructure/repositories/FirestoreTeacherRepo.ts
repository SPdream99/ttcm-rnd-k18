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
import { getAuthCookie } from "@/lib/cookies";
import { formatDisplayDate } from "@/lib/dateUtils";

export class FirestoreTeacherRepo implements TeacherPort {
  private getTeacherCredentials() {
    const cookie = getAuthCookie();
    return {
      teacherUid: cookie?.uid || cookie?.id || "",
      teacherEmail: cookie?.email || "",
      teacherName: cookie?.fullName || cookie?.name || cookie?.displayName || "",
    };
  }

  async getStats(): Promise<TeacherMetric[]> {
    const { teacherUid, teacherEmail, teacherName } = this.getTeacherCredentials();
    const cacheKey = `teacher_exact_stats_${teacherUid || "default"}`;

    return cacheService.getOrFetch(
      cacheKey,
      async () => {
        try {
          const [learningPathsSnap, classesSnap, assignmentsSnap, studentsSnap] = await Promise.all([
            getDocs(collection(db, "learning_path")),
            getDocs(collection(db, "classes")),
            getDocs(collection(db, "assignments")),
            getDocs(collection(db, "class_members")),
          ]);

          // Lọc lộ trình / lớp học của giáo viên hiện tại (Các lớp đang giảng dạy chính là các lộ trình)
          const myClassIds = new Set<string>();
          let myClassCount = 0;

          learningPathsSnap.docs.forEach((d) => {
            const data = d.data();
            const docAuthorId = data.author_id || data.authorId;
            const docTeacherEmail = data.author_email || data.authorEmail;
            const docTeacherName = data.author_name || data.authorName || data.teacher;

            const isMatch =
              !teacherUid ||
              docAuthorId === teacherUid ||
              (teacherEmail && docTeacherEmail && docTeacherEmail.toLowerCase() === teacherEmail.toLowerCase()) ||
              (teacherName && docTeacherName && docTeacherName.toLowerCase() === teacherName.toLowerCase());

            if (isMatch) {
              myClassIds.add(d.id);
              myClassCount += 1;
            }
          });

          // Bổ sung các class doc nếu có
          classesSnap.docs.forEach((d) => {
            const data = d.data();
            const docTeacherId = data.teacher_id || data.teacherId || data.instructorId || data.authorId;
            const isMatch = !teacherUid || docTeacherId === teacherUid;
            if (isMatch) {
              myClassIds.add(d.id);
            }
          });

          // Lọc học sinh trong các lớp của giáo viên
          const uniqueStudentIds = new Set<string>();
          studentsSnap.docs.forEach((d) => {
            const data = d.data();
            const classId = data.class_id || data.classId;
            if (myClassIds.has(classId) && data.role !== "Teacher") {
              const sKey = data.student_id || data.studentId || data.student_email || d.id;
              if (sKey) uniqueStudentIds.add(sKey);
            }
          });

          // Lọc bài tập đã giao của giáo viên
          let myAssignmentsCount = 0;
          assignmentsSnap.docs.forEach((d) => {
            const data = d.data();
            const docTeacherId = data.teacher_id || data.teacherId;
            const classId = data.class_id || data.classId;
            if (
              !teacherUid ||
              docTeacherId === teacherUid ||
              (classId && myClassIds.has(classId))
            ) {
              myAssignmentsCount += 1;
            }
          });

          return [
            {
              title: "Tổng Số Lớp Phụ Trách",
              value: `${myClassCount} Lớp`,
              change: "Học kỳ đang diễn ra",
              color: "text-red-600",
              bgColor: "bg-red-50",
              borderColor: "border-red-200",
            },
            {
              title: "Tổng Số Học Viên",
              value: `${uniqueStudentIds.size} Học Viên`,
              change: "Sĩ số hoạt động",
              color: "text-zinc-900",
              bgColor: "bg-zinc-50",
              borderColor: "border-zinc-200",
            },
            {
              title: "Bài Tập Đã Giao",
              value: `${myAssignmentsCount} Bài Tập`,
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
              value: "0 Lớp",
              change: "Chưa phân công",
              color: "text-red-600",
              bgColor: "bg-red-50",
              borderColor: "border-red-200",
            },
            {
              title: "Tổng Số Học Viên",
              value: "0 Học Viên",
              change: "Chưa có học sinh",
              color: "text-zinc-900",
              bgColor: "bg-zinc-50",
              borderColor: "border-zinc-200",
            },
            {
              title: "Bài Tập Đã Giao",
              value: "0 Bài Tập",
              change: "Chưa giao bài",
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
    const { teacherUid, teacherEmail, teacherName } = this.getTeacherCredentials();
    const cacheKey = `teacher_classes_${teacherUid || "default"}`;

    return cacheService.getOrFetch(
      cacheKey,
      async () => {
        try {
          const [pathsSnap, snap, membersSnap, enrollmentsSnap] = await Promise.all([
            getDocs(collection(db, "learning_path")),
            getDocs(collection(db, "classes")),
            getDocs(collection(db, "class_members")),
            getDocs(collection(db, "student_learning_path")),
          ]);

          const studentCountByClass: Record<string, number> = {};
          membersSnap.docs.forEach((md) => {
            const m = md.data();
            const cId = m.class_id || m.classId;
            if (cId && m.role !== "Teacher") {
              studentCountByClass[cId] = (studentCountByClass[cId] || 0) + 1;
            }
          });

          // Đếm học viên tham gia theo learning_path_id
          enrollmentsSnap.docs.forEach((ed) => {
            const eData = ed.data();
            const lpId = eData.learning_path_id;
            if (lpId) {
              studentCountByClass[lpId] = (studentCountByClass[lpId] || 0) + 1;
            }
          });

          const list: TeacherClassItem[] = [];
          const seenIds = new Set<string>();

          // 1. Map từ Learning Paths (Các lớp đang giảng dạy chính là các lộ trình)
          pathsSnap.docs.forEach((d) => {
            const data = d.data();
            const docAuthorId = data.author_id || data.authorId;
            const docTeacherEmail = data.author_email || data.authorEmail;
            const docTeacherName = data.author_name || data.authorName || data.teacher;

            const isMatch =
              !teacherUid ||
              docAuthorId === teacherUid ||
              (teacherEmail && docTeacherEmail && docTeacherEmail.toLowerCase() === teacherEmail.toLowerCase()) ||
              (teacherName && docTeacherName && docTeacherName.toLowerCase() === teacherName.toLowerCase());

            if (isMatch && !seenIds.has(d.id)) {
              seenIds.add(d.id);
              list.push({
                id: d.id,
                name: data.title || "Lớp Học (Lộ Trình)",
                grade: data.difficulty || "K18",
                studentsCount: studentCountByClass[d.id] || 0,
                subject: data.category || "Lộ Trình Học Tập",
                avgGpa: "8.8",
              });
            }
          });

          // 2. Map từ Classes collection
          snap.docs.forEach((d) => {
            const data = d.data();
            const docTeacherId = data.teacher_id || data.teacherId || data.instructorId || data.authorId;
            const docTeacherEmail = data.teacher_email || data.teacherEmail;
            const docTeacherName = data.teacher_name || data.teacherName || data.instructor;

            const isMatch =
              !teacherUid ||
              docTeacherId === teacherUid ||
              (teacherEmail && docTeacherEmail && docTeacherEmail.toLowerCase() === teacherEmail.toLowerCase()) ||
              (teacherName && docTeacherName && docTeacherName.toLowerCase() === teacherName.toLowerCase());

            if (isMatch && !seenIds.has(d.id)) {
              seenIds.add(d.id);
              list.push({
                id: d.id,
                name: data.name || "Lớp Học",
                grade: data.code || "K18",
                studentsCount: studentCountByClass[d.id] || 0,
                subject: data.subject || "Lập Trình",
                avgGpa: "8.8",
              });
            }
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
    const { teacherUid, teacherEmail, teacherName } = this.getTeacherCredentials();
    const cacheKey = classId
      ? `teacher_assignments_${teacherUid}_${classId}`
      : `teacher_assignments_${teacherUid}_all`;

    return cacheService.getOrFetch(
      cacheKey,
      async () => {
        try {
          const snap = await getDocs(collection(db, "assignments"));
          const list: TeacherAssignmentItem[] = [];

          snap.docs.forEach((d) => {
            const data = d.data();
            if (classId && data.class_id && data.class_id !== classId) return;

            const docTeacherId = data.teacher_id || data.teacherId;
            if (teacherUid && docTeacherId && docTeacherId !== teacherUid) return;

            list.push({
              id: d.id,
              title: data.title || "Bài tập",
              className: data.subject || "Lớp K18",
              dueDate: formatDisplayDate(data.dueDate || data.due_date, "2026-08-30"),
              submittedCount: 1,
              totalCount: Number(data.total_students || 24),
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
    const { teacherUid } = this.getTeacherCredentials();
    const cacheKey = classId
      ? `teacher_lectures_${teacherUid}_${classId}`
      : `teacher_lectures_${teacherUid}_all`;

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
              date: formatDisplayDate(data.date || data.createdAt, "2026-08-10"),
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
    const { teacherUid } = this.getTeacherCredentials();
    const cacheKey = classId
      ? `teacher_students_${teacherUid}_${classId}`
      : `teacher_students_${teacherUid}_all`;

    return cacheService.getOrFetch(
      cacheKey,
      async () => {
        try {
          const [membersSnap, enrollmentsSnap] = await Promise.all([
            getDocs(collection(db, "class_members")),
            getDocs(collection(db, "student_learning_path")),
          ]);

          const list: TeacherClassStudentItem[] = [];
          const seenStudentIds = new Set<string>();

          // 1. Lấy từ class_members
          membersSnap.docs.forEach((d) => {
            const data = d.data();
            if (classId && data.class_id && data.class_id !== classId) return;
            if (data.role === "Teacher") return;

            const memberDocId = d.id;
            const studentId = data.student_id || memberDocId;
            const uniqueKey = `${studentId}_${data.class_id || "general"}`;

            if (!seenStudentIds.has(uniqueKey)) {
              seenStudentIds.add(uniqueKey);
              list.push({
                id: memberDocId,
                name: data.student_name || "Học Viên",
                code: data.code || `STD-${studentId.slice(0, 6).toUpperCase()}`,
                className: data.class_name || "Lớp Học",
                gpa: data.gpa ? String(data.gpa) : "9.0",
                attendance: `${data.attendance_rate || 96}%`,
                status: (data.status === "paused" ? "Bảo Lưu" : "Đang Học") as any,
              });
            }
          });

          // 2. Lấy từ student_learning_path (đăng ký lộ trình)
          enrollmentsSnap.docs.forEach((d) => {
            const data = d.data();
            const lpId = data.learning_path_id;
            if (classId && lpId && lpId !== classId) return;

            const studentId = data.student_id || d.id;
            const uniqueKey = `${studentId}_${lpId || "lp"}`;

            if (!seenStudentIds.has(uniqueKey)) {
              seenStudentIds.add(uniqueKey);
              list.push({
                id: d.id,
                name: data.student_name || "Học Viên",
                code: `STD-${studentId.slice(0, 6).toUpperCase()}`,
                className: data.learning_path_title || "Lộ Trình Học Tập",
                gpa: data.gpa ? String(data.gpa) : "8.8",
                attendance: `${data.attendance_rate || 95}%`,
                status: (data.status === "paused" ? "Bảo Lưu" : "Đang Học") as any,
              });
            }
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
