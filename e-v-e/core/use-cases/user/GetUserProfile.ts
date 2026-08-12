/**
 * USE-CASE: GetUserProfile
 *
 * Lấy thông tin hồ sơ của một người dùng theo ID.
 * Nếu không tìm thấy, ném lỗi rõ ràng.
 */

import { User } from '../../entities/User';
import { UserRepository } from '../../ports/UserRepository';

export class GetUserProfileUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(userId: string): Promise<User> {
    const user = await this.userRepo.getUserById(userId);

    if (!user) {
      throw new Error(`Không tìm thấy người dùng với ID: ${userId}`);
    }

    return user;
  }
}
