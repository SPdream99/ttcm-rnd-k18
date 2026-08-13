export interface User {
  id: string;
  email: string;
  name: string;
  role: "school" | "teacher" | "student" | string;
  avatarUrl?: string;
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
}
