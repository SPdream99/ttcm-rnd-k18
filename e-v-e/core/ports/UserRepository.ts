/**
 * PORT: UserRepository
 *
 * Đây là "ổ cắm điện" cho domain User.
 * Core định nghĩa hình dạng — Infrastructure sẽ "cắm" vào implement.
 * Core KHÔNG biết Firebase, Database hay bất kỳ thứ gì ở bên ngoài.
 */

import { User } from '../entities/User';

export interface UserRepository {
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  saveUser(user: User): Promise<void>;
  listUsers(): Promise<User[]>;
}
