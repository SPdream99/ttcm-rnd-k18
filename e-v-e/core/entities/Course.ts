/**
 * ENTITY: Course
 *
 * Mô tả một Khóa Học trong hệ thống E-V-E.
 * Đã bổ sung metadata phong cách Daginatsuko (bannerUrl, japaneseTitle, subtitle...)
 */

export interface CourseQuestionPair {
  id?: string;
  title: string;            // Câu hỏi / Thuật ngữ / Từ khóa
  rightAnswer: string;      // Đáp án đúng / Định nghĩa đúng
  wrongAnswers: string[];   // Các phương án gây nhiễu / Đáp án sai
  image?: string;           // URL ảnh minh họa (nếu có)
}

export interface Course {
  id: string;
  courseId: string;        // ID tùy biến hoặc code của khóa học (course_id)
  title: string;
  japaneseTitle?: string;  // Ví dụ: "コース概要" hoặc "プログラミング入門"
  subtitle?: string;       // Tiêu đề phụ mô tả ngắn
  description: string;
  instructorId: string;    // uid của instructor
  authorId: string;        // ID giáo viên tạo (author_id)
  isPublished: boolean;    // true = published, false = draft
  isAccepted: boolean;     // Admin đã duyệt hay chưa (is_accepted)
  thumbnailUrl?: string;
  bannerUrl?: string;      // Cover image lớn cho Hero Banner
  tags: string[];
  categoryId?: string;
  price?: number;
  totalDuration?: string;  // Ví dụ: "18 Giờ 45 Phút"
  studentsCount?: number;  // Sĩ số học viên
  contentData?: CourseQuestionPair[]; // Dữ liệu câu hỏi cho game (content_data)
  createdAt: Date;
  updatedAt: Date;
}
