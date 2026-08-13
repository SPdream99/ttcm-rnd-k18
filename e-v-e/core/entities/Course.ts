/**
 * ENTITY: Course
 *
 * Mô tả một Khóa Học trong hệ thống E-V-E.
 * Đã bổ sung metadata phong cách Daginatsuko (bannerUrl, japaneseTitle, subtitle...)
 */

export interface Course {
  id: string;
  title: string;
  japaneseTitle?: string;  // Ví dụ: "コース概要" hoặc "プログラミング入門"
  subtitle?: string;       // Tiêu đề phụ mô tả ngắn
  description: string;
  instructorId: string;    // uid của instructor
  isPublished: boolean;    // true = published, false = draft
  thumbnailUrl?: string;
  bannerUrl?: string;      // Cover image lớn cho Daginatsuko Hero Banner
  tags: string[];
  categoryId?: string;
  price?: number;
  totalDuration?: string;  // Ví dụ: "18 Giờ 45 Phút"
  studentsCount?: number;  // Sĩ số học viên
  createdAt: Date;
  updatedAt: Date;
}
