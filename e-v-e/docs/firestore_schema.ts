/**
 * E-V-E FIRESTORE DATABASE SCHEMA & CONFIGURATION REFERENCE
 *
 * File cấu hình định nghĩa chuẩn toàn bộ collections, fields và sample fixtures
 * cho dự án E-V-E.
 */

export interface FirestoreUserDoc {
  _id: string;
  uid: string; // Firebase Authentication UID
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  status: "pending" | "active" | "banned";
  coins: number;
  profile_decorations: string[];
}

export interface FirestoreShopItemDoc {
  item_id: string;
  name: string;
  price: number;
  type: "avatar_frame" | "title_tag" | "profile_theme";
  image_url: string;
}

export interface CourseContentPair {
  id: string;
  title: string;
  right_answer: string;
  image?: string;
  wrong_answers: string[];
}

export interface FirestoreCourseDoc {
  id: string;
  course_id: string;
  title: string;
  author_id: string;
  is_accepted: boolean;
  created_at: string | Date;
  content_data: {
    pairs: CourseContentPair[];
    [key: string]: any;
  };
}

export interface FirestoreLearningPathDoc {
  lpath_id: string;
  title: string;
  description: string;
  courses: string[];
  author_id: string;
  is_accepted: boolean;
}

export interface FirestoreResourceDoc {
  id: string;
  courseId: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  downloadCount: number;
  uploadedAt: string | Date;
}

export interface FirestoreGameInfoDoc {
  game_id: string;
  authors: string[];
  title: string;
  description: string;
  is_accepted: boolean;
  courses_allowed: string[];
  courses_blocked: string[];
  need_extra_data: boolean;
  source_url: string;
  uploader_id: string;
}

export interface FirestoreGameResultDoc {
  uid: string;
  cid: string;
  gid: string;
  result: number | Record<string, any>;
  reward: number;
  played_at: string | Date;
}

export interface FirestoreEnrollmentDoc {
  uid: string;
  lpath_id: string;
  enrollment_date: string | Date;
  is_finished: boolean;
}

/**
 * Fixtures & Sample Collection Documents Reference
 */
export const FIRESTORE_COLLECTIONS_SCHEMA = {
  users: "users",
  shop_items: "shop_items",
  courses: "courses",
  learning_path: "learning_path",
  resources: "resources",
  game_info: "game_info",
  game_results: "game_results",
  enrollments: "enrollments",
} as const;
