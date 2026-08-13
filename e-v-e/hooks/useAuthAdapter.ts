import { useState, useEffect, useMemo } from "react";
import { AuthPort } from "@/core/ports/AuthPort";
import { FirebaseAuthRepo } from "@/infrastructure/repositories/FirebaseAuthRepo";
import {
  LoginUserUseCase,
  RegisterUserUseCase,
  GetUserProfileUseCase,
  UpdateUserProfileUseCase,
} from "@/core/use-cases/AuthUseCases";
import { User, UserProfile, LoginCredentials, RegisterCredentials } from "@/core/entities/User";
import { getAuthCookie, setAuthCookie } from "@/lib/cookies";

export function useAuthAdapter(userId?: string, customRepo?: AuthPort) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authRepo = useMemo(() => customRepo || new FirebaseAuthRepo(), [customRepo]);
  const loginUseCase = useMemo(() => new LoginUserUseCase(authRepo), [authRepo]);
  const registerUseCase = useMemo(() => new RegisterUserUseCase(authRepo), [authRepo]);
  const getProfileUseCase = useMemo(() => new GetUserProfileUseCase(authRepo), [authRepo]);
  const updateProfileUseCase = useMemo(() => new UpdateUserProfileUseCase(authRepo), [authRepo]);

  useEffect(() => {
    // 1. First populate immediately from cookie on client mount
    const cached = getAuthCookie();
    if (cached) {
      setCurrentUser({
        id: cached.uid || cached.id || "",
        uid: cached.uid || cached.id || "",
        email: cached.email,
        name: cached.name || cached.fullName || "User",
        displayName: cached.name || cached.fullName || "User",
        role: cached.role,
        status: (cached.status as "pending" | "active" | "banned") || "active",
        coins: cached.coins || 0,
        profileDecorations: cached.profileDecorations || [],
        activeDecorations: cached.activeDecorations || {},
      });
    }

    // 2. Fetch fresh user data from Firebase / repository
    authRepo
      .getCurrentUser()
      .then((user) => {
        if (user) {
          setCurrentUser(user);
          setAuthCookie(user);
        }
      })
      .catch(() => {});

    if (userId) {
      getProfileUseCase.execute(userId).then(setProfile).catch(() => {});
    }
  }, [authRepo, getProfileUseCase, userId]);

  const handleLogin = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginUseCase.execute(credentials);
      if (res.success && res.user) {
        setCurrentUser(res.user);
      } else if (res.error) {
        setError(res.error);
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (credentials: RegisterCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const res = await registerUseCase.execute(credentials);
      if (res.success && res.user) {
        setCurrentUser(res.user);
      } else if (res.error) {
        setError(res.error);
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (updated: UserProfile) => {
    setLoading(true);
    try {
      const res = await updateProfileUseCase.execute(updated);
      if (res.success) {
        setProfile(res.profile);
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  return {
    currentUser,
    profile,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    updateProfile: handleUpdateProfile,
  };
}
