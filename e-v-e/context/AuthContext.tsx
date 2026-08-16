"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  signOut as firebaseSignOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { setAuthCookie, removeAuthCookie } from "@/lib/cookies";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  uid: string;
  email: string;
  name: string;
  role: "student" | "teacher" | "admin" | "school";
  status: "pending" | "active" | "banned" | string;
  coins: number;
  twoFactorEnabled?: boolean;
  profileDecorations: string[];
}

interface AuthContextValue {
  /** null = chưa xác định, undefined = chưa load xong */
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signOut: async () => {},
});

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set persistence dựa vào remember_me đã lưu khi login
    const rememberMe = typeof window !== "undefined" && localStorage.getItem("eve_remember_me") === "true";
    setPersistence(
      auth,
      rememberMe ? browserLocalPersistence : browserSessionPersistence
    ).catch(() => {}); // ignore nếu đã có session

    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (!fbUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", fbUser.uid));
        let currentUserData: AuthUser;
        if (snap.exists()) {
          const data = snap.data();
          currentUserData = {
            uid: fbUser.uid,
            email: fbUser.email || "",
            name: data.name || data.fullName || "User",
            role: data.role || "student",
            status: data.status || "active",
            coins: Number(data.coins) || 0,
            twoFactorEnabled: data.two_factor_enabled !== false && data.twoFactorEnabled !== false,
            profileDecorations: data.profile_decorations || [],
          };
        } else {
          // User tồn tại trong Auth nhưng chưa có Firestore document
          currentUserData = {
            uid: fbUser.uid,
            email: fbUser.email || "",
            name: fbUser.displayName || "User",
            role: "student",
            status: "active",
            coins: 0,
            twoFactorEnabled: true,
            profileDecorations: [],
          };
        }
        setUser(currentUserData);
        // Synchronize to cookie
        setAuthCookie(currentUserData, rememberMe);
      } catch (err) {
        // Firestore error (thường do sign-out race condition) → treat as signed out
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    // 1. Xóa auth cookie và toàn bộ dữ liệu người dùng tại localStorage & sessionStorage
    removeAuthCookie();
    if (typeof window !== "undefined") {
      try {
        // Danh sách các khóa lưu trữ thông tin người dùng, khóa API, lịch sử chat và cache
        const userKeys = [
          "eve_user",
          "eve_auth_user",
          "eve_remember_me",
          "eve_remembered_email",
          "eve_user_encrypted_ai_key",
          "eve_gemini_api_key",
          "eve_tutor_chat_history",
          "eve_tutor_memory_enabled",
          "eve_2fa_pending_secret",
          "eve_2fa_verified",
          "eve_uploaded_courses",
          "eve_uploaded_games",
        ];

        userKeys.forEach((k) => localStorage.removeItem(k));

        // Quét sạch toàn bộ các key bắt đầu bằng tiền tố eve_ hoặc cache_
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key && (key.startsWith("eve_") || key.startsWith("cache_"))) {
            localStorage.removeItem(key);
          }
        }

        sessionStorage.clear();
      } catch (err) {
        console.warn("Lỗi khi xóa dữ liệu local storage lúc đăng xuất:", err);
      }
    }

    // 2. Clear state trước để các listener ngừng đọc Firestore
    setUser(null);

    // 3. Sign out khỏi Firebase (không còn listener nào active nên không lỗi permission)
    try {
      await firebaseSignOut(auth);
    } catch (_) {}

    // 4. Hard redirect để xóa toàn bộ state React
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAuth() {
  return useContext(AuthContext);
}

/** Helper: redirect về dashboard theo role */
export function getDashboardPath(role: string, status?: string): string {
  if (role === "teacher") {
    if (status === "pending") return "/pending";
    return "/teacher/dashboard";
  }
  if (role === "admin" || role === "school") return "/admin/dashboard";
  return "/student/dashboard";
}
