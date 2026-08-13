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
  createdAt: Date;
}
