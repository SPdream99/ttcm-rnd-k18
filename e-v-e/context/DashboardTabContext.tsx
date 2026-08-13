"use client";

import React, { createContext, useContext, useState } from "react";

// ─── Student Tab Types ─────────────────────────────────────────────────────────
export type StudentTab = "paths" | "games" | "leaderboard" | "shop";
export type TeacherTab = "overview" | "create_path" | "upload_game";

// ─── Student Tab Context ───────────────────────────────────────────────────────
interface StudentTabCtx {
  activeTab: StudentTab;
  setActiveTab: (tab: StudentTab) => void;
}

const StudentTabContext = createContext<StudentTabCtx>({
  activeTab: "paths",
  setActiveTab: () => {},
});

export function StudentTabProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<StudentTab>("paths");
  return (
    <StudentTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </StudentTabContext.Provider>
  );
}

export function useStudentTab() {
  return useContext(StudentTabContext);
}

// ─── Teacher Tab Context ───────────────────────────────────────────────────────
interface TeacherTabCtx {
  activeTab: TeacherTab;
  setActiveTab: (tab: TeacherTab) => void;
}

const TeacherTabContext = createContext<TeacherTabCtx>({
  activeTab: "overview",
  setActiveTab: () => {},
});

export function TeacherTabProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<TeacherTab>("overview");
  return (
    <TeacherTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TeacherTabContext.Provider>
  );
}

export function useTeacherTab() {
  return useContext(TeacherTabContext);
}
