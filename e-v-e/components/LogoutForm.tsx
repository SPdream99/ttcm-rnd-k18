"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function Logout() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Đăng xuất thất bại:", error);
    }

    if (typeof window !== "undefined") {
      localStorage.removeItem("eve_user");
      localStorage.removeItem("remember_me");
      localStorage.removeItem("user_email");
    }

    router.push("/public/login");
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.15)]"
    >
      <LogOut className="w-4 h-4 text-red-400" />
      <span>Đăng xuất</span>
    </button>
  );
}