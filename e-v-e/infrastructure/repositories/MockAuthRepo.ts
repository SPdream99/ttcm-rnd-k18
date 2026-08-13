import { AuthPort } from "@/core/ports/AuthPort";
import { User, UserProfile, LoginCredentials, RegisterCredentials } from "@/core/entities/User";

export class MockAuthRepo implements AuthPort {
  async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    return {
      success: true,
      user: {
        id: "usr_101",
        email: credentials.email,
        name: "Người Dùng E-V-E",
        role: credentials.role || "student",
      },
    };
  }

  async register(credentials: RegisterCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    return {
      success: true,
      user: {
        id: "usr_" + Date.now(),
        email: credentials.email,
        name: credentials.fullName,
        role: credentials.role,
      },
    };
  }

  async getCurrentUser(): Promise<User | null> {
    return {
      id: "usr_101",
      email: "user@eve-cosmic.edu.vn",
      name: "Trần Minh Đức",
      role: "student",
    };
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    return {
      id: userId,
      fullName: "Trần Minh Đức",
      email: "duc.tm@eve-cosmic.edu.vn",
      phone: "0987 654 321",
      role: "Học sinh Khối 12",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDX3K7vGdyDUJvI340aetIU0MVajGsT-e6ecJWTX_bifO55kIvgYhItv47FSH5gOlBt4WXUH320SbsaApEiFfNdG66AoUaUjk7G5Nq2aNt68S2ryprglwBXkwjP-dZTcTo4W9-bhhwQxUNBz7Ab_4QpfnZ2OdXoMk-oGfmsIb2lzhbUotG-TIe2LGsotqgod8fmizYQiYz2IWyCnHT5k1cs7W0nk68sUTOd6qV65B-dNJH1vAu6ysgZ",
      bio: "Đam mê nghiên cứu Trí Tuệ Nhân Tạo & Vật Lý Lượng Tử.",
      departmentOrClass: "Lớp 12A1 - Chuyên Khoa Học Tự Nhiên",
      joinDate: "Tháng 9, 2024",
    };
  }

  async updateUserProfile(profile: UserProfile): Promise<{ success: boolean; profile: UserProfile }> {
    return {
      success: true,
      profile,
    };
  }
}
