/**
 * ENTITY: Course
 *
 * Mô tả một Khóa Học trong hệ thống E-V-E.
 * Đã bổ sung metadata phong cách Daginatsuko (bannerUrl, japaneseTitle, subtitle...)
 */

export interface CourseContentPair {
  id?: string;
  title: string;               // Tiêu đề câu hỏi / Khái niệm
  description?: string;        // Đáp án đúng (Right Answer)
  distractions?: string[];     // Danh sách các đáp án sai (Wrong Answers / Distractions)
  explanation?: string;        // Giải thích chi tiết đáp án / kiến thức (Explanation)
  imageUrl?: string;           // Ảnh minh họa (nếu có)
  image_url?: string;
  rightAnswer?: string;        // Alias tương thích
  right_answer?: string;       // Alias tương thích
  wrongAnswers?: string[];     // Alias tương thích
  wrong_answers?: string[];    // Alias tương thích
}

export interface CourseResource {
  id?: string;
  title: string;
  url: string;
  type: "pdf" | "video" | "code" | "slide" | "link";
  description?: string;
}

export interface Course {
  id: string;
  courseId?: string;          // ID tùy biến hoặc code của khóa học (course_id)
  title: string;
  japaneseTitle?: string;
  subtitle?: string;
  description: string;
  authorId?: string;          // ID của Giáo viên tạo ra course
  authorName?: string;
  instructorId?: string;
  resources?: CourseResource[]; // Tài liệu & học liệu đính kèm do giáo viên cung cấp
  isPublished?: boolean;
  isAccepted?: boolean;       // Admin đã duyệt hay chưa (is_accepted)
  is_accepted?: boolean;
  thumbnailUrl?: string;
  bannerUrl?: string;
  tags?: string[];
  categoryId?: string;
  price?: number;
  totalDuration?: string;
  studentsCount?: number;
  contentData?: {
    pairs: CourseContentPair[];
  } | CourseContentPair[];    // Dữ liệu cặp câu hỏi/đáp án cho game
  createdAt: Date | string;
  updatedAt?: Date | string;
}
