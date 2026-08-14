"use client"

import { useState } from "react";
import Link from "next/link";
import {
  Store,
  User,
  Bitcoin,
} from "lucide-react";
import GetUserData from "@/components/GetUserData";


export default function Header() { 
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
              Chào mừng trở lại, <span className="gradient-text-cyan">Captain {userData?.name}!</span> 🚀
            </h1>
            <p className="text-sm text-[#8e9bb4] mt-1">I can do this all day</p>
          </div>

          {/* Header Action Tools */}
          <div className="flex items-center gap-3">
            {/* Shop */}
            <Link href="/dashbroad/student/shop" className="flex items-center gap-2 bg-[#151b2c]/80 border border-[#7bd1fa]/20 rounded-xl px-3 py-2 hover:bg-[#151b2c]/90 transition-all">
              <Store className="w-5 h-5 text-cyan-400" />
            </Link>

            {/* Coin Balance */}
            <div className="flex items-center gap-2 bg-[#151b2c]/80 border border-[#7bd1fa]/20 rounded-xl px-3 py-2">
              <Bitcoin className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-bold">{userData?.coins}</span>
            </div>

            {/* User Profile Avatar */}
            <div className="flex items-center gap-3 pl-2 border-l border-[#7bd1fa]/15">
              <Link href="/dashbroad/student/profile" className="flex items-center gap-2">
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