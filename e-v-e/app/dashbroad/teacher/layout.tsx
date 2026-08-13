"use client";

import React from "react";
import { TeacherTabProvider } from "@/context/DashboardTabContext";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <TeacherTabProvider>
      <div className="flex min-h-screen bg-[#0a0e1a]">
        {/* ASIDE BÊN NGOÀI - Sidebar dùng chung */}
        <DashboardSidebar role="teacher" />

        {/* NỘI DUNG CHÍNH */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </TeacherTabProvider>
  );
}
