/**
 * USE-CASE: RegisterUser
 *
 * Business rules:
 * - Email không được trùng
 * - Role mặc định là 'student'
 * - Không tự đặt role 'admin' (theo security rules)
 */

import { User } from '../../entities/User';
import { UserRepository } from '../../ports/UserRepository';

export interface RegisterUserInput {
  email: string;
  displayName: string;
  role?: 'student' | 'instructor';  // không cho tự đặt 'admin'
  avatarUrl?: string;
}

export class RegisterUserUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(input: RegisterUserInput): Promise<User> {
    const existing = await this.userRepo.getUserByEmail(input.email);
    if (existing) {
      throw new Error(`Email "${input.email}" đã được đăng ký.`);
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email: input.email,
      displayName: input.displayName,
      role: input.role ?? 'student',
      avatarUrl: input.avatarUrl,
      createdAt: new Date(),
    };

    await this.userRepo.saveUser(newUser);
    return newUser;
  }
}
