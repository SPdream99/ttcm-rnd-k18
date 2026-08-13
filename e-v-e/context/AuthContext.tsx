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

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  uid: string;
  email: string;
  name: string;
  role: "student" | "teacher" | "admin" | "school";
  status: string;
  coins: number;
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
    const rememberMe = localStorage.getItem("eve_remember_me") === "true";
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
        if (snap.exists()) {
          const data = snap.data();
          setUser({
            uid: fbUser.uid,
            email: fbUser.email || "",
            name: data.name || data.fullName || "User",
            role: data.role || "student",
            status: data.status || "active",
            coins: Number(data.coins) || 0,
            profileDecorations: data.profile_decorations || [],
          });
        } else {
          // User tồn tại trong Auth nhưng chưa có Firestore document
          setUser({
            uid: fbUser.uid,
            email: fbUser.email || "",
            name: fbUser.displayName || "User",
            role: "student",
            status: "active",
            coins: 0,
            profileDecorations: [],
          });
        }
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
    // 1. Xóa localStorage trước
    localStorage.removeItem("eve_remember_me");
    localStorage.removeItem("eve_remembered_email");
    localStorage.removeItem("eve_user");

    // 2. Clear state trước để các listener ngừng đọc Firestore
    setUser(null);

    // 3. Sign out khỏi Firebase (không còn listener nào active nên không lỗi permission)
    try {
      await firebaseSignOut(auth);
    } catch (_) {}

    // 4. Hard redirect để xóa toàn bộ state React
    window.location.href = "/public/login";
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
    if (status === "pending") return "/public/pending";
    return "/dashbroad/teacher";
  }
  if (role === "admin" || role === "school") return "/dashbroad/school";
  return "/dashbroad/student";
}
