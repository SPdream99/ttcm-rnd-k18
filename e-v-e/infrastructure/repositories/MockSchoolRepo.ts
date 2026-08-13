import { SchoolPort } from "@/core/ports/SchoolPort";
import {
  SchoolMetric,
  GradeBreakdown,
  DepartmentRanking,
  SchoolEvent,
  SchoolTeacherItem,
  SchoolStudentItem,
} from "@/core/entities/School";
import { Users, GraduationCap, Award, ShieldCheck } from "lucide-react";

export class MockSchoolRepo implements SchoolPort {
  async getSchoolMetrics(): Promise<SchoolMetric[]> {
    return [
      {
        title: "Tổng Quy Mô Học Sinh",
        value: "1,450 HS",
        change: "+85 học sinh năm mới",
        icon: Users,
        color: "text-cyan-400",
        bgColor: "bg-cyan-500/10",
        borderColor: "border-cyan-500/20",
      },
      {
        title: "Đội Ngũ Giáo Viên & Cán Bộ",
        value: "120 Giáo Viên",
        change: "100% Đạt chuẩn & Trên chuẩn",
        icon: GraduationCap,
        color: "text-purple-400",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/20",
      },
      {
        title: "Tỷ Lệ Học Sinh Khá / Giỏi",
        value: "88.5%",
        change: "+3.2% so với cùng kỳ",
        icon: Award,
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/20",
      },
      {
        title: "Hạ Tầng AI & Máy Chủ School",
        value: "99.9% Uptime",
        change: "Hoạt động hoàn hảo",
        icon: ShieldCheck,
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20",
      },
    ];
  }

  async getGradeBreakdown(): Promise<GradeBreakdown[]> {
    return [
      { grade: "Khối 10", classes: 12, students: 480, avgGpa: "8.2 / 10", progress: 82, color: "from-blue-500 to-cyan-400" },
      { grade: "Khối 11", classes: 12, students: 470, avgGpa: "8.4 / 10", progress: 84, color: "from-purple-500 to-indigo-500" },
      { grade: "Khối 12", classes: 13, students: 500, avgGpa: "8.7 / 10", progress: 87, color: "from-emerald-400 to-teal-500" },
    ];
  }

  async getDepartmentRankings(): Promise<DepartmentRanking[]> {
    return [
      { name: "Tổ Tự Nhiên - Vật Lý", head: "GS. Nguyễn Văn An", classes: 15, rating: "9.8/10", status: "Xuất Sắc" },
      { name: "Tổ Công Nghệ & AI", head: "TS. Lê Thị Mai", classes: 18, rating: "9.7/10", status: "Xuất Sắc" },
      { name: "Tổ Toán Học", head: "GS. Alan Turing", classes: 20, rating: "9.5/10", status: "Tiên Tiến" },
      { name: "Tổ UI/UX & Thiết Kế", head: "ThS. Trần Hoàng Nam", classes: 10, rating: "9.4/10", status: "Tiên Tiến" },
    ];
  }

  async getSchoolEvents(): Promise<SchoolEvent[]> {
    return [
      { id: 1, title: "Kỳ Thi Chọn Học Sinh Giỏi Quốc Gia 2026", date: "15 Tháng 9, 2026", category: "Kỳ Thi", important: true },
      { id: 2, title: "Hội Thảo Ứng Dụng AI Trong Đổi Mới Giáo Dục THPT", date: "28 Tháng 9, 2026", category: "Hội Thảo", important: false },
      { id: 3, title: "Họp Phụ Huynh Toàn Trường Đầu Năm Học", date: "05 Tháng 10, 2026", category: "Sự Kiện", important: false },
    ];
  }

  async getSchoolStudents(gradeFilter?: string, searchQuery?: string): Promise<SchoolStudentItem[]> {
    const list: SchoolStudentItem[] = [
      { id: "st_1", name: "Nguyễn Trần Hải Đăng", code: "HS1201", grade: "Khối 12", class: "12A1", gpa: "9.5", rank: "Hạng 1 Khối", status: "Đang Học" },
      { id: "st_2", name: "Lê Bảo Ngọc", code: "HS1105", grade: "Khối 11", class: "11B2", gpa: "8.8", rank: "Hạng 5 Khối", status: "Đang Học" },
      { id: "st_3", name: "Phạm Quốc Thái", code: "HS1002", grade: "Khối 10", class: "10A5", gpa: "8.2", rank: "Hạng 12 Khối", status: "Đang Học" },
      { id: "st_4", name: "Trần Minh Khoa", code: "HS1209", grade: "Khối 12", class: "12A1", gpa: "7.2", rank: "Hạng 25 Khối", status: "Cần Cố Gắng" },
    ];

    return list.filter((item) => {
      const matchGrade = !gradeFilter || gradeFilter === "all" || item.grade.includes(gradeFilter);
      const matchQuery =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase());
      return matchGrade && matchQuery;
    });
  }

  async getSchoolTeachers(deptFilter?: string, searchQuery?: string): Promise<SchoolTeacherItem[]> {
    const list: SchoolTeacherItem[] = [
      { id: "tc_1", name: "GS. Nguyễn Văn An", code: "GV001", department: "Vật Lý Lượng Tử", classesCount: 5, rating: "9.9/10", status: "Hoạt Động" },
      { id: "tc_2", name: "TS. Lê Thị Mai", code: "GV002", department: "Công Nghệ AI", classesCount: 4, rating: "9.8/10", status: "Hoạt Động" },
      { id: "tc_3", name: "GS. Alan Turing", code: "GV003", department: "Toán Học", classesCount: 6, rating: "9.7/10", status: "Hoạt Động" },
      { id: "tc_4", name: "ThS. Trần Hoàng Nam", code: "GV004", department: "Thiết Kế UI/UX", classesCount: 3, rating: "9.6/10", status: "Nghỉ Phép" },
    ];

    return list.filter((item) => {
      const matchDept = !deptFilter || deptFilter === "all" || item.department.toLowerCase().includes(deptFilter.toLowerCase());
      const matchQuery =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDept && matchQuery;
    });
  }
}
