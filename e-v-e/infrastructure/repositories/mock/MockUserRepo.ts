/**
 * MOCK: MockUserRepo — cập nhật role instructor
 */

import { User } from '@/core/entities/User';
import { UserRepository } from '@/core/ports/UserRepository';

const MOCK_USERS: User[] = [
  {
    id: 'user-001',
    email: 'student@eve.edu',
    displayName: 'Nguyễn Văn An',
    role: 'student',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'user-002',
    email: 'instructor@eve.edu',
    displayName: 'Trần Thị Bình',
    role: 'instructor',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'user-003',
    email: 'admin@eve.edu',
    displayName: 'Admin E-V-E',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
  },
];

export class MockUserRepo implements UserRepository {
  private users: User[] = [...MOCK_USERS];

  async getUserById(id: string): Promise<User | null> {
    return this.users.find((u) => u.id === id) ?? null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find((u) => u.email === email) ?? null;
  }

  async saveUser(user: User): Promise<void> {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index >= 0) this.users[index] = user;
    else this.users.push(user);
  }

  async listUsers(): Promise<User[]> {
    return [...this.users];
  }
}
