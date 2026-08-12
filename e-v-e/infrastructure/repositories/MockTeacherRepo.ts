import { TeacherPort } from "@/core/ports/TeacherPort";
import {
  TeacherMetric,
  TeacherClassItem,
  TeacherAssignmentItem,
  TeacherLectureItem,
  TeacherClassStudentItem,
} from "@/core/entities/Teacher";

export class MockTeacherRepo implements TeacherPort {
  async getStats(): Promise<TeacherMetric[]> {
    return [
      {
        title: "Lớp Đang Giảng Dạy",
        value: "4 Lớp",
        change: "180 Học Sinh Tổng Cộng",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/20",
      },
      {
        title: "Bài Tập Cần Chấm",
        value: "15 Bài",
        change: " Hạn hoàn thành: 2 ngày",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/20",
      },
      {
        title: "Tỷ Lệ Tham Gia Lớp",
        value: "96.4%",
        change: "+1.2% so với tháng trước",
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/20",
      },
      {
        title: "Điểm Đánh Giá Giảng Dạy",
        value: "4.9 / 5.0",
        change: "Đánh giá từ Học Sinh",
        color: "text-cyan-400",
        bgColor: "bg-cyan-500/10",
        borderColor: "border-cyan-500/20",
      },
    ];
  }

  async getClasses(): Promise<TeacherClassItem[]> {
    return [
      { id: "cls_12a1", name: "12A1 - Chuyên Vật Lý Lượng Tử", grade: "Khối 12", studentsCount: 45, subject: "Vật Lý Lượng Tử", avgGpa: "8.9" },
      { id: "cls_11b2", name: "11B2 - Vật Lý Đại Cương", grade: "Khối 11", studentsCount: 42, subject: "Vật Lý", avgGpa: "8.4" },
      { id: "cls_10a5", name: "10A5 - Cơ Học Cổ Điển", grade: "Khối 10", studentsCount: 48, subject: "Vật Lý Base", avgGpa: "8.1" },
      { id: "cls_12a2", name: "12A2 - Thí Nghiệm Lượng Tử", grade: "Khối 12", studentsCount: 45, subject: "Vật Lý Lab", avgGpa: "8.7" },
    ];
  }

  async getAssignments(classId?: string): Promise<TeacherAssignmentItem[]> {
    return [
      { id: "tas_1", title: "Bài tập 1: Giải phương trình Schrodinger", className: "12A1", dueDate: "20/09/2026", submittedCount: 42, totalCount: 45, status: "Đang Chấm" },
      { id: "tas_2", title: "Bài tập 2: Thí nghiệm Khe Young", className: "12A1", dueDate: "25/09/2026", submittedCount: 30, totalCount: 45, status: "Chưa Đáo Hạn" },
      { id: "tas_3", title: "Kiểm tra giữa kỳ Vật Lý", className: "11B2", dueDate: "18/09/2026", submittedCount: 42, totalCount: 42, status: "Hoàn Thành" },
    ];
  }

  async getLectures(classId?: string): Promise<TeacherLectureItem[]> {
    return [
      { id: "lec_1", title: "Bài 4.1: Giới thiệu Vướng Víu Lượng Tử", className: "12A1", date: "12/09/2026", duration: "90 phút", slidesCount: 24 },
      { id: "lec_2", title: "Bài 4.2: Thí nghiệm EPR & Chuông Bell", className: "12A1", date: "15/09/2026", duration: "90 phút", slidesCount: 30 },
      { id: "lec_3", title: "Bài 5.1: Cổng Logic Lượng Tử", className: "12A1", date: "19/09/2026", duration: "90 phút", slidesCount: 18 },
    ];
  }

  async getClassStudents(classId?: string): Promise<TeacherClassStudentItem[]> {
    return [
      { id: "tst_1", name: "Nguyễn Trần Hải Đăng", code: "HS1201", className: "12A1", gpa: "9.5", attendance: "100%", status: "Giỏi" },
      { id: "tst_2", name: "Trần Minh Khoa", code: "HS1209", className: "12A1", gpa: "7.2", attendance: "88%", status: "Khá" },
      { id: "tst_3", name: "Phạm Thu Trang", code: "HS1215", className: "12A1", gpa: "8.8", attendance: "96%", status: "Giỏi" },
    ];
  }
}
