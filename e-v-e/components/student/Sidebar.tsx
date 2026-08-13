"use client"

import { useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  Compass,
  GraduationCap,
  Bot,
  Settings,
  HelpCircle,
  Sparkles,
} from "lucide-react";

export default function Sidebar() {
  return (
          <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-[#0f1524]/80 backdrop-blur-xl border-r border-[#7bd1fa]/15 z-40 p-5 justify-between">
        <div className="space-y-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-teal-400 p-[1px] shadow-[0_0_20px_rgba(59,130,246,0.5)]">
              <div className="w-full h-full bg-[#0a0e1a] rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
                E-V-E <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">STUDENT</span>
              </h1>
              <p className="text-xs text-[#8e9bb4]">Cosmic Knowledge Ecosystem</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {[
              { label: "Dashboard", icon: LayoutDashboard, href: "/dashbroad/student", active: true },
              { label: "Ai Tutor", icon: Calendar, href: "/dashbroad/student/AITutor", active: false },
              { label: "Learning Path", icon: Compass, href: "/dashbroad/student/LearningPath", active: false },
              { label: "Class", icon: GraduationCap, href: "/dashbroad/student/Class", active: false },
            ].map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${item.active
                    ? "bg-gradient-to-r from-blue-600/25 to-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(59,130,246,0.25)]"
                    : "text-[#8e9bb4] hover:text-white hover:bg-white/5"
                  }`}
              >
                <item.icon className={`w-5 h-5 ${item.active ? "text-cyan-400" : "text-[#8e9bb4]"}`} />
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* AI Assistant Callout & Footer Settings */}
        <div className="space-y-4 pt-6 border-t border-[#7bd1fa]/10">
          <div className="relative group overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-blue-900/40 via-[#151b2c] to-purple-900/30 border border-cyan-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
                <Bot className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm text-white">E-V-E Assistant</span>
            </div>
            <p className="text-xs text-[#8e9bb4] mb-3">Sẵn sàng giải đáp & trợ giúp bài tập 24/7</p>
            <button className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-medium text-xs shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Trò Chuyện Ngay
            </button>
          </div>

          <div className="flex items-center justify-between px-2 text-[#8e9bb4]">
            <a href="#" className="hover:text-white transition-colors flex items-center gap-2 text-xs">
              <Settings className="w-4 h-4" /> Cài đặt
            </a>
            <a href="#" className="hover:text-white transition-colors flex items-center gap-2 text-xs">
              <HelpCircle className="w-4 h-4" /> Trợ giúp
            </a>
          </div>
        </div>
      </aside>

  );
}