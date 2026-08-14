"use client"

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Search,
  User,
} from "lucide-react";
import GetUserData from "@/components/GetUserData";


export default function Header() { 
const [showNotificationModal, setShowNotificationModal] = useState(false);
const [searchQuery, setSearchQuery] = useState("");
const { userData } = GetUserData();

// UI
    return (
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/10">
          <div>
            <div className="flex items-center gap-2 text-sm text-cyan-400 font-medium mb-1">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Năm học 2025 - 2026
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Chào mừng trở lại, <span className="gradient-text-cyan">Captain {userData?.full_name}!</span> 🚀
            </h1>
            <p className="text-sm text-[#8e9bb4] mt-1">I can do this all day</p>
          </div>

          {/* Header Action Tools */}
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e9bb4]" />
              <input
                type="text"
                placeholder="Tìm khóa học, bài giảng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#151b2c]/80 border border-[#7bd1fa]/20 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-[#8e9bb4] focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>

            {/* Notification Button */}
            <button
              onClick={() => setShowNotificationModal(!showNotificationModal)}
              className="relative p-2.5 rounded-xl bg-[#151b2c]/80 border border-[#7bd1fa]/20 text-[#8e9bb4] hover:text-white hover:border-cyan-400/50 transition-all"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </button>

            {/* User Profile Avatar */}
            <div className="flex items-center gap-3 pl-2 border-l border-[#7bd1fa]/15">
              <Link href="/dashboard/student/profile" className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-linear-to-tr from-cyan-400 to-blue-600 p-[2px]">
                    <div className="w-full h-full rounded-full bg-[#0a0e1a] flex items-center justify-center overflow-hidden">
                      <User className="w-5 h-5 text-cyan-300" />
                    </div>
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0a0e1a]" />
                </div>
              </Link>
            </div>
          </div>
        </header>

    );
}
