/**
 * USE CASE: CreateUserAccount
 *
 * Cho phép Nhà Trường (School Admin) khởi tạo tài khoản cho Giảng Viên hoặc Học Sinh.
 */

import { User, UserRole } from '../entities/User';
import { UserRepository } from '../ports/UserRepository';

export interface CreateUserAccountDTO {
  displayName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export class CreateUserAccount {
  constructor(private userRepo: UserRepository) {}

  async execute(dto: CreateUserAccountDTO): Promise<User> {
    if (!dto.email || !dto.displayName) {
      throw new Error('Email và Họ tên không được để trống.');
    }

    // Kiểm tra xem email đã tồn tại hay chưa
    const existing = await this.userRepo.getUserByEmail(dto.email);
    if (existing) {
      throw new Error(`Email ${dto.email} đã được sử dụng bởi tài khoản khác.`);
    }

    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      displayName: dto.displayName.trim(),
      email: dto.email.trim().toLowerCase(),
      role: dto.role || 'student',
      avatarUrl: dto.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + encodeURIComponent(dto.displayName),
      createdAt: new Date(),
    };

    await this.userRepo.saveUser(newUser);
    return newUser;
  }
}
