export interface Game {
  id: string;
  gameId?: string;
  title: string;
  description: string;
  authors?: string[];
  uploaderId?: string;
  authorId?: string;
  authorName?: string;
  gameUrl?: string;            // Đường dẫn URL chạy game (iframe / uploads / static game)
  sourceUrl?: string;
  downloadSourceUrl?: string;  // Link tải file source zip cho Admin audit code
  download_source_url?: string;
  needExtraData: boolean;      // Game có nhận extra data từ course không
  need_extra_data?: boolean;
  coursesAllowed: string[] | "all";  // Whitelist khóa học hỗ trợ
  courses_allowed?: string[] | "all";
  coursesBlocked: string[];          // Blacklist khóa học loại trừ
  courses_blocked?: string[];
  isAccepted: boolean;         // Trạng thái phê duyệt của Admin
  is_accepted?: boolean;
  thumbnailUrl?: string;
  playsCount?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
