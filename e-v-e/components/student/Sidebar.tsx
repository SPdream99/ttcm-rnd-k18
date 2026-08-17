"use client";

import {
  LayoutDashboard,
  Compass,
  Settings,
  HelpCircle,
  Sparkles,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-white border-r border-zinc-200 z-40 p-5 justify-between font-sans">
      <div className="space-y-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 px-2">
          <img
            src="/logo.png"
            alt="E-V-E"
            className="h-8.5 w-auto object-contain block"
            style={{ height: "34px", width: "auto" }}
          />
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200 font-bold uppercase">
            STUDENT
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {[
            { label: "Bảng Điều Khiển", icon: LayoutDashboard, href: "/student/dashboard", active: true },
            { label: "Lộ Trình Học", icon: Compass, href: "/student/learning-paths", active: false },
          ].map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                item.active
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
              }`}
            >
              <item.icon className={`w-5 h-5 ${item.active ? "text-red-600" : "text-zinc-400"}`} />
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      {/* Footer Settings */}
      <div className="space-y-4 pt-6 border-t border-zinc-200">
        <div className="flex items-center justify-between px-2 text-zinc-500 font-bold">
          <a href="#" className="hover:text-red-600 transition-colors flex items-center gap-2 text-xs">
            <Settings className="w-4 h-4" /> Cài đặt
          </a>
          <a href="#" className="hover:text-red-600 transition-colors flex items-center gap-2 text-xs">
            <HelpCircle className="w-4 h-4" /> Trợ giúp
          </a>
        </div>
      </div>
    </aside>
  );
}
