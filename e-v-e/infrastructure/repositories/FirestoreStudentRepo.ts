import {
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { StudentPort } from "@/core/ports/StudentPort";
import {
  StudentProgressStat,
  StudentCourse,
  UpcomingClass,
  ClassAssignment,
  ClassMember,
} from "@/core/entities/Student";
import { cacheService } from "@/lib/cacheService";

export class FirestoreStudentRepo implements StudentPort {
  async getStats(): Promise<StudentProgressStat[]> {
    return cacheService.getOrFetch(
      "student_stats",
      async () => {
        try {
          const [pathsSnap, assignmentsSnap, submissionsSnap] = await Promise.all([
            getDocs(collection(db, "student_learning_path")),
            getDocs(collection(db, "assignments")),
            getDocs(collection(db, "submissions")),
          ]);

          const enrolledCount = pathsSnap.size || 2;
          const submittedCount = submissionsSnap.size || 1;
          const totalAsm = assignmentsSnap.size || 3;
          const avgRate = Math.round((submittedCount / (totalAsm || 1)) * 100);

          return [
            {
              label: "Lớp Học Đang Theo",
              value: `${enrolledCount} Lớp`,
              change: "+1 trong tháng",
              color: "text-red-600",
              bgColor: "bg-red-50",
              borderColor: "border-red-200",
            },
            {
              label: "Tiến Độ Trung Bình",
              value: "68%",
              change: "+12% tuần này",
              color: "text-zinc-900",
              bgColor: "bg-zinc-50",
              borderColor: "border-zinc-200",
            },
            {
              label: "Tỉ Lệ Hoàn Thành Bài Tập",
              value: `${avgRate}%`,
              change: `${submittedCount}/${totalAsm} bài đã nộp`,
              color: "text-emerald-700",
              bgColor: "bg-emerald-50",
              borderColor: "border-emerald-200",
            },
          ];
        } catch {
          return [
            {
              label: "Lớp Học Đang Theo",
              value: "2 Lớp",
              change: "+1 trong tháng",
              color: "text-red-600",
              bgColor: "bg-red-50",
              borderColor: "border-red-200",
            },
            {
              label: "Tiến Độ Trung Bình",
              value: "68%",
              change: "+12% tuần này",
              color: "text-zinc-900",
              bgColor: "bg-zinc-50",
              borderColor: "border-zinc-200",
            },
            {
              label: "Tỉ Lệ Hoàn Thành Bài Tập",
              value: "100%",
              change: "3/3 bài đã nộp",
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

  async getCourses(statusFilter?: string, kw?: string): Promise<StudentCourse[]> {
    const list = await cacheService.getOrFetch(
      "student_courses_classes",
      async () => {
        try {
          const snap = await getDocs(collection(db, "classes"));
          const coursesList: StudentCourse[] = [];

          snap.docs.forEach((d) => {
            const data = d.data();
            coursesList.push({
              id: d.id,
              title: data.name || "Lớp Học",
              instructor: data.teacher_name || "ThS. Nguyễn Thành Đạt",
              progress: 65,
              currentChapter: data.subject || "Chương trình đào tạo",
              nextLesson: "Bài Thực Hành Tương Tác Minigame",
              status: "inProgress",
              tag: data.code || "E-V-E",
              color: "border-zinc-200 bg-white",
            });
          });

          return coursesList;
        } catch {
          return [];
        }
      },
      { ttlMs: 60000 }
    );

    return list.filter((c) => {
      if (statusFilter && statusFilter !== "all" && c.status !== statusFilter) return false;
      if (kw && !c.title.toLowerCase().includes(kw.toLowerCase())) return false;
      return true;
    });
  }

  async getUpcomingClasses(): Promise<UpcomingClass[]> {
    return cacheService.getOrFetch(
      "student_upcoming_classes",
      async () => {
        try {
          const snap = await getDocs(collection(db, "classes"));
          const upcoming: UpcomingClass[] = [];

          snap.docs.forEach((d, index) => {
            const data = d.data();
            upcoming.push({
              id: index + 1,
              title: data.name || "Lớp Học",
              time: data.schedule || "19h30 - 21h30",
              instructor: data.teacher_name || "ThS. Nguyễn Thành Đạt",
              room: data.room || "Google Meet Online",
              urgent: index === 0,
            });
          });

          return upcoming;
        } catch {
          return [];
        }
      },
      { ttlMs: 60000 }
    );
  }

  async getClassAssignments(classId?: string): Promise<ClassAssignment[]> {
    const cacheKey = classId ? `student_assignments_${classId}` : "student_assignments_all";

    return cacheService.getOrFetch(
      cacheKey,
      async () => {
        try {
          const snap = await getDocs(collection(db, "assignments"));
          const list: ClassAssignment[] = [];

          snap.docs.forEach((d) => {
            const data = d.data();
            if (classId && data.class_id && data.class_id !== classId) return;

            list.push({
              id: d.id,
              title: data.title || "Bài tập lớp học",
              subject: data.subject || "Lập trình",
              dueDate: data.dueDate || data.due_date || "2026-08-30",
              status: data.status || "pending",
              score: data.score || "100 Điểm",
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

  async getClassMembers(classId?: string): Promise<ClassMember[]> {
    const cacheKey = classId ? `student_members_${classId}` : "student_members_all";

    return cacheService.getOrFetch(
      cacheKey,
      async () => {
        try {
          const snap = await getDocs(collection(db, "class_members"));
          const list: ClassMember[] = [];

          snap.docs.forEach((d) => {
            const data = d.data();
            if (classId && data.class_id && data.class_id !== classId) return;

            list.push({
              id: data.student_id || d.id,
              name: data.student_name || "Thành viên",
              role: data.role || "Student",
              email: data.student_email || "user@eve.edu.vn",
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
