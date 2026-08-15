"use client";

import React from "react";
import Link from "next/link";
import { useStudentAdapter } from "@/hooks/useStudentAdapter";
import { Users, MessageSquare, Shield, ArrowLeft } from "lucide-react";

export default function StudentClassMemberPage() {
  const { members, loading } = useStudentAdapter();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 font-sans">
        <div className="w-10 h-10 rounded-full border-4 border-zinc-200 border-t-red-600 animate-spin" />
        <p className="text-red-600 font-medium text-sm">Đang tải thành viên lớp...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 font-sans">
      <header className="pb-6 border-b border-zinc-200">
        <Link
          href="/student/classes"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-red-600 mb-2 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Quay lại danh sách lớp
        </Link>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 mb-1">
          <Users className="w-4 h-4" /> Thành Viên & Giảng Viên
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">
          Danh Sách Lớp Học 
        </h1>
        <p className="text-xs md:text-sm text-zinc-600 mt-1">Các học sinh và Giảng viên phụ trách lớp.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((m) => {
          const isTeacher = m.role === "Teacher";
          return (
            <div
              key={m.id}
              className={`p-5 rounded-2xl border flex items-center justify-between gap-3 shadow-sm transition-all ${
                isTeacher
                  ? "bg-red-50/50 border-red-200"
                  : "bg-white border-zinc-200 hover:border-red-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shadow-sm ${
                    isTeacher ? "bg-red-600" : "bg-zinc-800"
                  }`}>
                    {m.name.charAt(0)}
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-zinc-900 flex items-center gap-1.5">
                    {m.name} {isTeacher && <Shield className="w-3.5 h-3.5 text-red-600 fill-red-600" />}
                  </h3>
                  <p className="text-xs text-zinc-500">{m.role} • {m.email}</p>
                </div>
              </div>

              <button className="p-2.5 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-700 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors cursor-pointer">
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
