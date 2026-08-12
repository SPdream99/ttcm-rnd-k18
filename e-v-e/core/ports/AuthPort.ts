import { User, UserProfile, LoginCredentials, RegisterCredentials } from "../entities/User";

export interface AuthPort {
  login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }>;
  register(credentials: RegisterCredentials): Promise<{ success: boolean; user?: User; error?: string }>;
  getCurrentUser(): Promise<User | null>;
  getUserProfile(userId: string): Promise<UserProfile>;
  updateUserProfile(profile: UserProfile): Promise<{ success: boolean; profile: UserProfile }>;
}
