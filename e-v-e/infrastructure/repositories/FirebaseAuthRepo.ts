import { AuthPort } from "@/core/ports/AuthPort";
import { User, UserProfile, LoginCredentials, RegisterCredentials } from "@/core/entities/User";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
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

      let userData: any;

      if (!userDoc.exists()) {
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const qSnap = await getDocs(q);
        if (!qSnap.empty) {
          userData = qSnap.docs[0].data();
        } else {
          userData = {
            id: user.uid,
            _id: user.uid,
            uid: user.uid,
            name: user.displayName || "User",
            fullName: user.displayName || "User",
            email: user.email,
            role: credentials.role || "student",
            status: "active",
            coins: 0,
            profile_decorations: [],
          };
          await setDoc(doc(db, "users", user.uid), userData);
        }
      } else {
        userData = userDoc.data();
      }

      const returnUser: User = {
        id: user.uid,
        uid: user.uid,
        email: user.email || credentials.email,
        name: userData.name || userData.fullName || "User",
        displayName: userData.name || userData.fullName || "User",
        role: userData.role || "student",
        status: userData.status || "active",
        coins: Number(userData.coins) || 0,
        profileDecorations: userData.profile_decorations || [],
        activeDecorations: userData.active_decorations || {},
      };

      setAuthCookie(returnUser, credentials.rememberMe);

      return {
        success: true,
        user: returnUser,
      };
    } catch (error: any) {
      console.warn("Firebase Auth Login Error, attempting Firestore email lookup fallback...", error.message);
      
      try {
        const q = query(collection(db, "users"), where("email", "==", credentials.email));
        const qSnap = await getDocs(q);
        if (!qSnap.empty) {
          const d = qSnap.docs[0];
          const userData = d.data();
          const returnUser: User = {
            id: d.id,
            uid: userData.uid || userData._id || userData.id || d.id,
            email: userData.email,
            name: userData.name || userData.fullName || "User",
            displayName: userData.name || userData.fullName || "User",
            role: userData.role || "student",
            status: userData.status || "active",
            coins: Number(userData.coins) || 0,
            profileDecorations: userData.profile_decorations || [],
            activeDecorations: userData.active_decorations || {},
          };

          setAuthCookie(returnUser, credentials.rememberMe);

          return {
            success: true,
            user: returnUser,
          };
        }
      } catch (fallbackErr) {
        console.error("Firestore email lookup failed:", fallbackErr);
      }

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

      const payload = {
        id: user.uid,
        _id: user.uid,
        uid: user.uid,
        name: credentials.fullName,
        fullName: credentials.fullName,
        email: credentials.email,
        role: credentials.role,
        status: initialStatus,
        coins: 0,
        profile_decorations: [],
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", user.uid), payload);

      const returnUser: User = {
        id: user.uid,
        uid: user.uid,
        email: credentials.email,
        name: credentials.fullName,
        displayName: credentials.fullName,
        role: credentials.role,
        status: initialStatus,
        coins: 0,
        profileDecorations: [],
        activeDecorations: { avatarFrame: "", badge: "" },
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

    await setDoc(doc(db, "users", profile.id), dbProfile, { merge: true });
    return { success: true, profile };
  }
}
