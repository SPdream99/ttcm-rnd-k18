/**
 * E-V-E COMPREHENSIVE FIRESTORE DATABASE SCHEMA & ENTITY DEFINITIONS
 * Hệ thống CSDL NoSQL Firestore Chuẩn Hóa Cho Nền Tảng Học Tập & Game Hóa E-V-E
 *
 * Phiên bản: 2.0 (Cập nhật Kiến trúc RBAC, Phân quyền Sở hữu 4 cấp độ, Minigame SDK & Lớp học)
 */

export type UserRole = "student" | "teacher" | "admin" | "school";
export type UserStatus = "active" | "pending" | "banned";
export type ContentVisibility = "private" | "public" | "free_to_share" | "free_to_use";
export type EnrollmentStatus = "active" | "completed" | "withdrawn" | "in_progress";

/**
 * 1. USERS COLLECTION (`users`)
 * Lưu trữ hồ sơ, quyền hạn (RBAC), điểm thưởng Coins, huy hiệu và tùy biến cá nhân.
 */
export interface FirestoreUserDoc {
  uid: string; // Firebase Auth UID
  _id?: string;
  id?: string;
  name: string;
  fullName?: string;
  displayName?: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  avatar_url?: string;
  coins: number;
  xp?: number;
  level?: number;
  streakDays?: number;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  twoFactorRecoveryCodes?: string[];
  inventory?: string[]; // Danh sách ID vật phẩm đã mua
  profile_decorations?: string[];
  bio?: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Cấu trúc Cặp Câu Hỏi / Dữ Liệu Tương Tác cho Bài Học & Minigame
 */
export interface CourseContentPair {
  id: string;
  title: string; // Câu hỏi / Khái niệm
  description: string; // Đáp án đúng / Định nghĩa
  right_answer?: string;
  explanation?: string; // Lời giải chi tiết
  distractions: string[]; // Các phương án sai
  wrong_answers?: string[];
  image_url?: string;
  image?: string;
}

export interface CourseResourceItem {
  id?: string;
  title: string;
  url: string;
  type: "document" | "video" | "slide" | "code" | "link";
  size?: string;
}

/**
 * 2. COURSES COLLECTION (`courses`)
 * Khóa học / Bài học đơn lẻ chứa bộ câu hỏi tương tác (pairs) và học liệu đính kèm.
 */
export interface FirestoreCourseDoc {
  id: string;
  courseId?: string;
  course_id?: string;
  title: string;
  description: string;
  authorId: string;
  author_id?: string;
  authorName?: string;
  instructorId?: string;
  visibility: ContentVisibility; // private | public | free_to_share | free_to_use
  isAccepted: boolean;
  is_accepted?: boolean;
  contentData: {
    pairs: CourseContentPair[];
  };
  resources?: CourseResourceItem[];
  category?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  estimatedMinutes?: number;
  createdAt: string;
  created_at?: string;
  updatedAt?: string;
}

/**
 * 3. LEARNING PATHS COLLECTION (`learning_path` / `learning_paths`)
 * Lộ trình học tập tổng thể, xâu chuỗi nhiều bài học theo chặng bản đồ.
 */
export interface FirestoreLearningPathDoc {
  id: string;
  lpathId?: string;
  lpath_id?: string;
  title: string;
  description: string;
  authorId: string;
  author_id?: string;
  authorName?: string;
  creatorId?: string;
  courses: string[]; // Mảng ID các khóa học thuộc lộ trình: ["crs_1", "crs_2", ...]
  courseIds?: string[];
  visibility: ContentVisibility;
  isAccepted: boolean;
  is_accepted?: boolean;
  bannerUrl?: string;
  totalXP?: number;
  createdAt: string;
  updatedAt?: string;
}

/**
 * 4. STUDENT LEARNING PATH PROGRESS (`student_learning_path`)
 * Lưu vết tiến độ học tập của từng học sinh đối với từng lộ trình/lớp học.
 */
export interface FirestoreStudentLearningPathDoc {
  id: string;
  studentId: string;
  student_id?: string;
  studentName?: string;
  studentEmail?: string;
  lpathId: string;
  lpath_id?: string;
  classId?: string;
  status: EnrollmentStatus; // active | completed | withdrawn
  currentCourseId?: string;
  completedCourses: string[]; // Danh sách ID các bài học đã hoàn thành
  totalScore?: number;
  totalCoinsEarned?: number;
  enrolledAt: string;
  updatedAt?: string;
  completedAt?: string;
}

/**
 * 5. GAME INFO COLLECTION (`game_info`)
 * Metadata của các Minigame giáo dục HTML5/JS chuẩn E-V-E SDK.
 */
export interface FirestoreGameInfoDoc {
  id: string;
  gameId: string;
  title: string;
  description: string;
  genre?: string;
  authorId: string;
  author_id?: string;
  uploaderId?: string;
  authorName?: string;
  authors: string[];
  visibility: ContentVisibility;
  needExtraData: boolean; // True nếu game cần nạp pairs từ bài học
  need_extra_data?: boolean;
  coursesAllowed: string[] | "all"; // Danh sách khóa học được phép nạp vào game
  courses_allowed?: string[] | "all";
  coursesBlocked: string[];
  courses_blocked?: string[];
  gameUrl: string; // URL chạy game (index.html hoặc storage URL)
  sourceUrl?: string;
  source_url?: string;
  downloadUrl?: string; // URL tải file nén .zip
  download_url?: string;
  fileName?: string;
  fileSize?: string;
  thumbnailUrl?: string;
  playsCount: number;
  plays_count?: number;
  isAccepted: boolean;
  is_accepted?: boolean;
  createdAt: string;
  updatedAt?: string;
}

/**
 * 6. GAME RESULTS COLLECTION (`game_results`)
 * Kết quả màn chơi và lịch sử điểm thưởng, xếp hạng leaderboard.
 */
export interface FirestoreGameResultDoc {
  id: string;
  uid: string; // Student ID
  studentId?: string;
  studentName?: string;
  studentAvatar?: string;
  gid: string; // Game ID
  gameId?: string;
  gameTitle?: string;
  cid?: string; // Course ID (nếu chơi có nạp extra data)
  courseId?: string;
  score: number;
  rewardCoins: number;
  coinsEarned?: number;
  accuracy?: number; // Tỉ lệ trả lời đúng (0-100%)
  timeSpentSeconds?: number;
  playedAt: string;
  played_at?: string;
}

/**
 * 7. CLASSES & CLASS MEMBERS (`classes` & `class_members`)
 * Quản lý không gian lớp học của giáo viên và học sinh tham gia bằng mã Code.
 */
export interface FirestoreClassDoc {
  id: string;
  classCode: string; // Mã tham gia 6 ký tự
  name: string;
  description?: string;
  teacherId: string;
  teacherName: string;
  teacherEmail?: string;
  pathId?: string; // Lộ trình gán cho lớp
  learningPathTitle?: string;
  membersCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface FirestoreClassMemberDoc {
  id: string;
  classId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar?: string;
  status: "active" | "blocked" | "withdrawn";
  joinedAt: string;
}

/**
 * 8. ASSIGNMENTS & SUBMISSIONS (`assignments` & `submissions`)
 * Giao bài tập về nhà và nộp bài chấm điểm.
 */
export interface FirestoreAssignmentDoc {
  id: string;
  classId: string;
  teacherId: string;
  title: string;
  description: string;
  courseId?: string;
  dueDate: string;
  maxScore: number;
  rewardCoins?: number;
  createdAt: string;
}

export interface FirestoreSubmissionDoc {
  id: string;
  assignmentId: string;
  classId: string;
  studentId: string;
  studentName: string;
  submissionContent?: string;
  attachmentUrl?: string;
  score?: number;
  feedback?: string;
  gradedBy?: string;
  status: "submitted" | "graded" | "late";
  submittedAt: string;
  gradedAt?: string;
}

/**
 * 9. SHOP ITEMS COLLECTION (`shop_items`)
 * Cửa hàng đổi thưởng bằng E-V-E Coins.
 */
export interface FirestoreShopItemDoc {
  id: string;
  itemId?: string;
  name: string;
  description: string;
  price: number;
  priceCoins?: number;
  category: "avatar_frame" | "title_tag" | "profile_theme" | "badge";
  imageUrl: string;
  stock?: number;
  isAvailable: boolean;
}

/**
 * TÊN CÁC COLLECTION CHÍNH TRONG HỆ THỐNG
 */
export const FIRESTORE_COLLECTIONS = {
  USERS: "users",
  COURSES: "courses",
  LEARNING_PATHS: "learning_path",
  STUDENT_LEARNING_PATHS: "student_learning_path",
  GAME_INFO: "game_info",
  GAME_RESULTS: "game_results",
  CLASSES: "classes",
  CLASS_MEMBERS: "class_members",
  ASSIGNMENTS: "assignments",
  SUBMISSIONS: "submissions",
  LECTURES: "lectures",
  SHOP_ITEMS: "shop_items",
  ANNOUNCEMENTS: "announcements",
  RESOURCES: "resources",
} as const;
