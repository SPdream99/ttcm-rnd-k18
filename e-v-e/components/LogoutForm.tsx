"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function Logout() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut(auth);

            console.log("Đăng xuất thành công!");

            router.push("/public/login");
        } catch (error) {
            console.error("Đăng xuất thất bại:", error);
        }
    };

    return (
        <button
            type="button"
            onClick={handleLogout}
            className="
        flex items-center gap-3
        rounded-lg
        px-4 py-3
        text-left
        text-gray-400
        hover:bg-cyan-500/10
        hover:text-cyan-300
        transition-all duration-200
      "
        >
            <span className="material-symbols-outlined">
                logout
            </span>

            <span>Đăng xuất</span>
        </button>
    );
}