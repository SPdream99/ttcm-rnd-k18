import { AuthPort } from "@/core/ports/AuthPort";
import { User, UserProfile, LoginCredentials, RegisterCredentials } from "@/core/entities/User";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

export class FirebaseAuthRepo implements AuthPort {
  async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.pass
      );

      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        return {
          success: false,
          error: "Tài khoản đăng nhập được nhưng chưa có thông tin người dùng.",
        };
      }

      const userData = userDoc.data();
      const role = userData.role;

      if (!role) {
        return {
          success: false,
          error: "Tài khoản chưa được cấu hình role.",
        };
      }

      return {
        success: true,
        user: {
          id: user.uid,
          email: user.email || credentials.email,
          name: userData.fullName || userData.name || "User",
          role: role,
          status: userData.status || "active",
          coins: userData.coins || 0,
          profileDecorations: userData.profile_decorations || [],
          activeDecorations: userData.active_decorations || {},
        },
      };
    } catch (error: any) {
      console.error("Firebase Login Error:", error);
      return {
        success: false,
        error: "Email hoặc mật khẩu không đúng.",
      };
    }
  }

  async register(credentials: RegisterCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.pass
      );
      const user = userCredential.user;

      const initialStatus = credentials.role === "teacher" ? "pending" : "active";

      await setDoc(doc(db, "users", user.uid), {
        fullName: credentials.fullName,
        email: credentials.email,
        role: credentials.role,
        createdAt: new Date().toISOString(),
        status: initialStatus,
        coins: 0,
        profile_decorations: [],
        active_decorations: { avatarFrame: "", badge: "" }
      });

      return {
        success: true,
        user: {
          id: user.uid,
          email: credentials.email,
          name: credentials.fullName,
          role: credentials.role,
          status: initialStatus,
          coins: 0,
          profileDecorations: [],
          activeDecorations: { avatarFrame: "", badge: "" }
        },
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
      email: currentUser.email || "",
      name: userData?.fullName || "User",
      role: userData?.role || "student",
      status: userData?.status || "active",
      coins: userData?.coins || 0,
      profileDecorations: userData?.profile_decorations || [],
      activeDecorations: userData?.active_decorations || {},
    };
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    const userDoc = await getDoc(doc(db, "users", userId));
    const data = userDoc.data();
    return {
      id: userId,
      fullName: data?.fullName || "User",
      email: data?.email || "",
      phone: data?.phone || "",
      role: data?.role || "student",
      avatar: data?.avatar || "",
      bio: data?.bio || "",
      departmentOrClass: data?.departmentOrClass || "",
      joinDate: data?.createdAt || "2026",
      status: data?.status || "active",
      coins: data?.coins || 0,
      profileDecorations: data?.profile_decorations || [],
      activeDecorations: data?.active_decorations || {},
    };
  }

  async updateUserProfile(profile: UserProfile): Promise<{ success: boolean; profile: UserProfile }> {
    // Map profile properties back to database format
    const dbProfile = {
      ...profile,
      profile_decorations: profile.profileDecorations || [],
      active_decorations: profile.activeDecorations || {},
    };
    // Delete duplicate mapped keys to keep DB clean
    delete (dbProfile as any).profileDecorations;
    delete (dbProfile as any).activeDecorations;

    await setDoc(doc(db, "users", profile.id), dbProfile, { merge: true });
    return { success: true, profile };
  }
}
