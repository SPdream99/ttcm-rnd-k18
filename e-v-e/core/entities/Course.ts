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
  imageUrl?: string;           // Ảnh minh họa câu hỏi (nếu có)
  image_url?: string;
  questionImageUrl?: string;   // Alias ảnh minh họa câu hỏi
  question_image_url?: string;
  rightAnswer?: string;        // Alias tương thích
  right_answer?: string;       // Alias tương thích
  rightAnswerImageUrl?: string; // Ảnh minh họa đáp án đúng
  right_answer_image_url?: string;
  wrongAnswers?: string[];     // Alias tương thích
  wrong_answers?: string[];    // Alias tương thích
  wrongAnswersImageUrls?: string[]; // Danh sách ảnh minh họa các đáp án sai
  wrong_answers_image_urls?: string[];
  distractionImageUrls?: string[];
  distraction_image_urls?: string[];
}

export interface CourseResource {
  id?: string;
  title: string;
  url: string;
  type: 'pdf' | 'doc' | 'zip' | 'video' | 'other';
}

export interface Course {
  id: string;                  // ID định danh duy nhất (VD: crs_nextjs_basics)
  courseId?: string;           // Alias cho id
  title: string;               // Tên khóa học
  subtitle?: string;           // Tiêu đề phụ (Phù hợp phong cách Daginatsuko)
  japaneseTitle?: string;      // Tiêu đề tiếng Nhật / Ký tự điểm nhấn
  description: string;         // Mô tả khóa học
  bannerUrl?: string;          // Ảnh bìa khóa học / Game Card Cover
  thumbnailUrl?: string;       // Alias ảnh bìa
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  authorId: string;            // ID Giảng viên sở hữu (Teacher UID)
  authorName?: string;         // Tên Giảng viên
  instructorId?: string;       // Alias ID giảng viên
  isAccepted: boolean;         // Trạng thái kiểm duyệt bởi Admin
  isPublished?: boolean;       // Trạng thái công khai
  pairsCount?: number;         // Số lượng câu hỏi / thẻ bài
  tags?: string[];
  categoryId?: string;
  price?: number;
  totalDuration?: number;
  studentsCount?: number;
  contentData?: {
    pairs?: CourseContentPair[];
    resources?: CourseResource[];
  } | any;
  createdAt?: Date | string | number;
  updatedAt?: Date | string | number;
}
