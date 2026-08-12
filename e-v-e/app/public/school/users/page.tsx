import { getContainer } from '@/infrastructure/di/container';
import SchoolUsersClient from './SchoolUsersClient';

export default async function SchoolUsersPage() {
  const c = await getContainer();
  const rawUsers = await c.userRepo.listUsers();

  const initialUsers = rawUsers.map((u) => ({
    id: u.id,
    displayName: u.displayName,
    email: u.email,
    role: u.role,
    avatarUrl: u.avatarUrl,
    createdAt: u.createdAt.toISOString(),
  }));

  return <SchoolUsersClient initialUsers={initialUsers} />;
}
