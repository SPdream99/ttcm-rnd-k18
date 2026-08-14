"use client";

import React from "react";
import { StudentTabProvider } from "@/context/DashboardTabContext";
import { ToastProvider } from "@/components/student/Toast";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <StudentTabProvider>
      <ToastProvider>
        <div className="flex min-h-screen bg-[#0a0e1a]">
          {/* ASIDE BÊN NGOÀI - Sidebar dùng chung */}
          <DashboardSidebar role="student" />

          {/* NỘI DUNG CHÍNH */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </ToastProvider>
    </StudentTabProvider>
  );
}