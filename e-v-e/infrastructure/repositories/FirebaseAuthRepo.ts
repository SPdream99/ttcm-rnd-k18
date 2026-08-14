import { AuthPort } from "@/core/ports/AuthPort";
import { User, UserProfile, LoginCredentials, RegisterCredentials } from "@/core/entities/User";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { setAuthCookie } from "@/lib/cookies";

export class FirebaseAuthRepo implements AuthPort {
  async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      if (typeof window !== "undefined") {
        const persistence = credentials.rememberMe ? browserLocalPersistence : browserSessionPersistence;
        await setPersistence(auth, persistence).catch(() => {});
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.pass
      );

      const user = userCredential.user;
      let userDoc = await getDoc(doc(db, "users", user.uid));

      let role = "student";
      let status: "pending" | "active" | "banned" = "active";
      let coins = 0;
      let profileDecorations: string[] = [];
      let activeDecorations = { avatarFrame: "", badge: "" };
      let twoFactorEnabled = false;

      if (!userDoc.exists()) {
        const fallbackDoc: any = {
          id: user.uid,
          uid: user.uid,
          email: user.email || credentials.email,
          fullName: user.displayName || "User",
          name: user.displayName || "User",
          role: "student",
          status: "active",
          coins: 0,
          profile_decorations: [],
          twoFactorEnabled: false,
          createdAt: new Date().toISOString(),
        };
        await setDoc(doc(db, "users", user.uid), fallbackDoc);
      } else {
        const data = userDoc.data();
        role = data.role || "student";
        status = (data.status as "pending" | "active" | "banned") || "active";
        coins = data.coins || 0;
        profileDecorations = data.profile_decorations || [];
        activeDecorations = data.active_decorations || { avatarFrame: "", badge: "" };
        twoFactorEnabled = data.twoFactorEnabled ?? data.two_factor_enabled ?? false;
      }

      const returnUser: User = {
        id: user.uid,
        uid: user.uid,
        email: user.email || credentials.email,
        name: user.displayName || "User",
        displayName: user.displayName || "User",
        role,
        status,
        coins,
        profileDecorations,
        activeDecorations,
        twoFactorEnabled,
      };

      setAuthCookie(returnUser, credentials.rememberMe ?? true);

      return {
        success: true,
        user: returnUser,
      };
    } catch (error: any) {
      console.error("Firebase Login Error:", error);

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        return {
          success: false,
          error: "Email hoặc mật khẩu không chính xác.",
        };
      }

      if (error.code === "auth/too-many-requests") {
        return {
          success: false,
          error: "Tài khoản bị tạm khóa do nhập sai nhiều lần. Vui lòng thử lại sau.",
        };
      }

      return {
        success: false,
        error: "Email hoặc mật khẩu không đúng.",
      };
    }
  }

  async register(credentials: RegisterCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const normalizedEmail = credentials.email.trim().toLowerCase();

      // Check if any documents exist in Firestore 'users' with this email (orphan/duplicate check)
      let orphanDocIds: string[] = [];
      try {
        const qLower = query(collection(db, "users"), where("email", "==", normalizedEmail));
        const snapLower = await getDocs(qLower);
        snapLower.forEach((d) => orphanDocIds.push(d.id));

        if (credentials.email.trim() !== normalizedEmail) {
          const qExact = query(collection(db, "users"), where("email", "==", credentials.email.trim()));
          const snapExact = await getDocs(qExact);
          snapExact.forEach((d) => {
            if (!orphanDocIds.includes(d.id)) orphanDocIds.push(d.id);
          });
        }
      } catch (err) {
        console.warn("[FirebaseAuthRepo] Pre-check email query error:", err);
      }

      // Try creating user in Firebase Authentication
      let userCredential;
      try {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          normalizedEmail,
          credentials.pass
        );
      } catch (authErr: any) {
        if (authErr.code === "auth/email-already-in-use") {
          return {
            success: false,
            error: "Email này đã được sử dụng bởi một tài khoản khác. Vui lòng đăng nhập.",
          };
        }
        throw authErr;
      }

      const user = userCredential.user;

      // If user did not exist in Auth (createUser succeeded) but had existing Firestore docs, delete all orphan docs
      for (const orphanId of orphanDocIds) {
        try {
          if (orphanId !== user.uid) {
            await deleteDoc(doc(db, "users", orphanId));
            console.log(`[FirebaseAuthRepo] Deleted orphan user document: ${orphanId}`);
          }
        } catch (delErr) {
          console.warn("[FirebaseAuthRepo] Could not delete orphan user doc:", delErr);
        }
      }

      // Also clean up local storage registered users matching this email
      if (typeof window !== "undefined") {
        try {
          const registeredUsers = JSON.parse(localStorage.getItem("eve_registered_users") || "[]");
          const cleaned = registeredUsers.filter((u: any) => u.email?.toLowerCase() !== normalizedEmail && u.uid !== user.uid && u.id !== user.uid);
          localStorage.setItem("eve_registered_users", JSON.stringify(cleaned));
        } catch {}
      }

      const initialStatus = credentials.role === "teacher" ? "pending" : "active";

      const payload: Record<string, any> = {
        id: user.uid,
        _id: user.uid,
        uid: user.uid,
        name: credentials.fullName.trim(),
        fullName: credentials.fullName.trim(),
        email: normalizedEmail,
        role: credentials.role,
        status: initialStatus,
        coins: 0,
        twoFactorEnabled: true,
        profile_decorations: [],
        active_decorations: { avatarFrame: "", badge: "" },
        createdAt: new Date().toISOString(),
      };

      if (credentials.schoolCode) {
        payload.schoolCode = credentials.schoolCode.trim();
      }

      if (credentials.role === "teacher") {
        payload.departmentOrClass = credentials.schoolCode
          ? `Mã trường: ${credentials.schoolCode.trim()}`
          : "Giáo viên mới";
      }

      await setDoc(doc(db, "users", user.uid), payload);

      if (typeof window !== "undefined") {
        try {
          const registeredUsers = JSON.parse(localStorage.getItem("eve_registered_users") || "[]");
          const existingIdx = registeredUsers.findIndex((u: any) => u.email?.toLowerCase() === normalizedEmail || u.uid === user.uid || u.id === user.uid);
          if (existingIdx >= 0) {
            registeredUsers[existingIdx] = payload;
          } else {
            registeredUsers.unshift(payload);
          }
          localStorage.setItem("eve_registered_users", JSON.stringify(registeredUsers));
        } catch {}
      }

      const returnUser: User = {
        id: user.uid,
        uid: user.uid,
        email: normalizedEmail,
        name: credentials.fullName.trim(),
        displayName: credentials.fullName.trim(),
        role: credentials.role,
        status: initialStatus,
        coins: 0,
        profileDecorations: [],
        activeDecorations: { avatarFrame: "", badge: "" },
        twoFactorEnabled: true,
      };

      setAuthCookie(returnUser, true);

      return {
        success: true,
        user: returnUser,
      };
    } catch (error: any) {
      console.error("Firebase Register Error:", error);
      return {
        success: false,
        error: error.message || "Đăng ký thất bại.",
      };
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;
    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
    if (!userDoc.exists()) return null;
    const userData = userDoc.data();
    return {
      id: currentUser.uid,
      uid: currentUser.uid,
      email: currentUser.email || "",
      name: userData?.name || userData?.fullName || "User",
      role: userData?.role || "student",
      status: userData?.status || "active",
      coins: Number(userData?.coins) || 0,
      profileDecorations: userData?.profile_decorations || [],
      activeDecorations: userData?.active_decorations || {},
    };
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    const userDoc = await getDoc(doc(db, "users", userId));
    const data = userDoc.data() || {};
    return {
      id: userId,
      uid: data.uid || data._id || data.id || userId,
      fullName: data.name || data.fullName || "User",
      email: data.email || "",
      phone: data.phone || "",
      role: data.role || "student",
      avatar: data.avatar || "",
      bio: data.bio || "",
      departmentOrClass: data.departmentOrClass || "",
      joinDate: data.createdAt || "2026",
      status: data.status || "active",
      coins: Number(data.coins) || 0,
      profileDecorations: data.profile_decorations || [],
      activeDecorations: data.active_decorations || {},
    };
  }

  async updateUserProfile(profile: UserProfile): Promise<{ success: boolean; profile: UserProfile }> {
    const dbProfile = {
      ...profile,
      id: profile.id,
      _id: profile.id,
      uid: profile.uid || profile.id,
      profile_decorations: profile.profileDecorations || [],
      active_decorations: profile.activeDecorations || {},
    };
    delete (dbProfile as any).profileDecorations;
    delete (dbProfile as any).activeDecorations;

    // Sanitize any undefined properties before writing to Firestore
    Object.keys(dbProfile).forEach((key) => {
      if ((dbProfile as any)[key] === undefined) {
        delete (dbProfile as any)[key];
      }
    });

    await setDoc(doc(db, "users", profile.id), dbProfile, { merge: true });
    return { success: true, profile };
  }
}
