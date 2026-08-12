import { StudentPort } from "@/core/ports/StudentPort";
import {
  StudentProgressStat,
  StudentCourse,
  UpcomingClass,
  ClassAssignment,
  ClassMember,
} from "@/core/entities/Student";
import { Flame, Award, Clock, CheckCircle2 } from "lucide-react";

export class MockStudentRepo implements StudentPort {
  async getStats(): Promise<StudentProgressStat[]> {
    return [
      {
        label: "Chuỗi học tập",
        value: "7 Ngày",
        change: "+2 so với tuần trước",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/20",
      },
      {
        label: "Điểm trung bình",
        value: "3.85 / 4.0",
        change: "Top 5% lớp học",
        color: "text-cyan-400",
        bgColor: "bg-cyan-500/10",
        borderColor: "border-cyan-500/20",
      },
      {
        label: "Giờ học tích lũy",
        value: "48.5 Giờ",
        change: "+12.4h tháng này",
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/20",
      },
      {
        label: "Bài tập hoàn thành",
        value: "18 / 20",
        change: "90% Tiến độ",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/20",
      },
    ];
  }

  async getCourses(statusFilter?: string, query?: string): Promise<StudentCourse[]> {
    const courses: StudentCourse[] = [
      {
        id: "phys",
        title: "Vật Lý Lượng Tử Advanced",
        instructor: "GS. Nguyễn Văn An",
        progress: 75,
        currentChapter: "Chương 4: Vướng víu lượng tử & Ứng dụng",
        nextLesson: "Bài 4.2: Thí nghiệm EPR & Chuông Bell",
        status: "inProgress",
        tag: "Vật lý",
        color: "from-blue-500 to-cyan-400",
      },
      {
        id: "ai",
        title: "Kiến Trúc Mạng Thần Kinh (Neural Networks)",
        instructor: "TS. Lê Thị Mai",
        progress: 40,
        currentChapter: "Chương 2: Deep Learning Foundation",
        nextLesson: "Bài 2.3: Backpropagation trong Transformer",
        status: "inProgress",
        tag: "Công nghệ AI",
        color: "from-purple-500 to-indigo-500",
      },
      {
        id: "ux",
        title: "Thiết Kế UI/UX & Dynamic System",
        instructor: "ThS. Trần Hoàng Nam",
        progress: 92,
        currentChapter: "Dự án cuối khóa: Design System E-V-E",
        nextLesson: "Bài 6.1: Tối ưu hóa Micro-interactions",
        status: "inProgress",
        tag: "Design",
        color: "from-emerald-400 to-teal-500",
      },
      {
        id: "math",
        title: "Toán Cao Cấp cho AI & Data Science",
        instructor: "GS. Alan Turing",
        progress: 100,
        currentChapter: "Hoàn thành toàn bộ khóa học",
        nextLesson: "Cấp chứng chỉ xuất sắc",
        status: "completed",
        tag: "Toán học",
        color: "from-amber-400 to-orange-500",
      },
    ];

    return courses.filter((c) => {
      const matchStatus = !statusFilter || statusFilter === "all" || c.status === statusFilter;
      const matchQuery =
        !query ||
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.instructor.toLowerCase().includes(query.toLowerCase());
      return matchStatus && matchQuery;
    });
  }

  async getUpcomingClasses(): Promise<UpcomingClass[]> {
    return [
      {
        id: 1,
        title: "Thảo luận: Vật Lý Lượng Tử & Vũ Trụ Học",
        time: "10:00 AM - Hôm nay",
        instructor: "GS. Nguyễn Văn An",
        room: "Phòng ảo E-V-E #01",
        urgent: true,
      },
      {
        id: 2,
        title: "Seminar: Trợ lý AI trong Đổi mới Giáo dục",
        time: "02:30 PM - Chiều nay",
        instructor: "Dr. Carl Sagan",
        room: "Hội trường Virtual A2",
        urgent: false,
      },
      {
        id: 3,
        title: "Thực hành: Train mô hình Deep Learning",
        time: "08:00 AM - Sáng mai",
        instructor: "TS. Lê Thị Mai",
        room: "Lab AI #04",
        urgent: false,
      },
    ];
  }

  async getClassAssignments(classId?: string): Promise<ClassAssignment[]> {
    return [
      { id: "as_1", title: "Bài tập 1: Giải phương trình Schrodinger", subject: "Vật Lý Lượng Tử", dueDate: "20/09/2026", status: "graded", score: "9.5/10" },
      { id: "as_2", title: "Bài tập 2: Phân tích thí nghiệm Khe Young", subject: "Vật Lý Lượng Tử", dueDate: "25/09/2026", status: "submitted" },
      { id: "as_3", title: "Bài tập 3: Mô phỏng Cổng Lượng Tử Qubit", subject: "Vật Lý Lượng Tử", dueDate: "30/09/2026", status: "pending" },
    ];
  }

  async getClassMembers(classId?: string): Promise<ClassMember[]> {
    return [
      { id: "m_1", name: "GS. Nguyễn Văn An", role: "Teacher", email: "an.nv@eve.edu.vn" },
      { id: "m_2", name: "Trần Minh Đức", role: "Monitor", email: "duc.tm@eve.edu.vn" },
      { id: "m_3", name: "Nguyễn Trần Hải Đăng", role: "Student", email: "dang.nth@eve.edu.vn" },
      { id: "m_4", name: "Lê Bảo Ngọc", role: "Student", email: "ngoc.lb@eve.edu.vn" },
    ];
  }
}
