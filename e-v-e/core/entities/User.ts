/**
 * ENTITY: User
 *
 * Khớp với schema Firestore collection "users"
 * và security rules (role: 'student' | 'instructor' | 'admin')
 */

export type UserRole = 'student' | 'instructor' | 'admin';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatarUrl?: string;
<<<<<<< dev-anh
  createdAt: Date;
=======
  status?: "pending" | "active" | "banned";
  coins?: number;
  profileDecorations?: string[];
  activeDecorations?: {
    avatarFrame?: string;
    badge?: string;
  };
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  avatar: string;
  bio?: string;
  departmentOrClass?: string;
  joinDate: string;
  status?: "pending" | "active" | "banned";
  coins?: number;
  profileDecorations?: string[];
  activeDecorations?: {
    avatarFrame?: string;
    badge?: string;
  };
}

export interface LoginCredentials {
  email: string;
  pass: string;
  role?: "school" | "teacher" | "student" | string;
}

export interface RegisterCredentials {
  fullName: string;
  email: string;
  pass: string;
  confirmPass: string;
  role: "school" | "teacher" | "student";
  schoolCode?: string;
>>>>>>> local
}
