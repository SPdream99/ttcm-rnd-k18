"use client";

import React, { useState, useEffect } from "react";
import { useSchoolAdapter } from "@/hooks/useSchoolAdapter";
import { GraduationCap, Search, Plus, Download } from "lucide-react";

export default function SchoolTeacherManagementPage() {
  const [selectedDept, setSelectedDept] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { teachers, loadTeachers } = useSchoolAdapter();

  useEffect(() => {
    loadTeachers(selectedDept, searchQuery);
  }, [loadTeachers, selectedDept, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-[#e1e2ec] p-4 md:p-8 font-sans space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/10">
        <div>
          <div className="flex items-center gap-2 text-sm text-purple-400 font-medium mb-1">
            <GraduationCap className="w-4 h-4" /> Đội ngũ giảng dạy
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Quản Lý Giáo Viên & Cán Bộ 👩‍🏫
          </h1>
          <p className="text-sm text-[#8e9bb4] mt-1">Danh sách 120 giáo viên thuộc các tổ bộ môn.</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 rounded-xl bg-[#151b2c] border border-purple-500/30 text-white text-sm font-medium hover:bg-purple-600/20 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" /> Xuất File CSV
          </button>
          <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium text-sm shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> Thêm Giáo Viên
          </button>
        </div>
      </header>

      {/* Directory Table */}
      <div className="p-6 rounded-2xl bg-[#0f1524]/60 backdrop-blur-md border border-[#7bd1fa]/15 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e9bb4]" />
            <input
              type="text"
              placeholder="Tìm tên, mã GV..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#151b2c] border border-purple-500/30 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
            />
          </div>

          <div className="flex items-center gap-2">
            {["all", "Vật Lý", "AI", "Toán Học", "UI/UX"].map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedDept === dept
                    ? "bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]"
                    : "text-[#8e9bb4] hover:text-white"
                }`}
              >
                {dept === "all" ? "Tất cả tổ" : dept}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#e1e2ec]">
            <thead className="bg-[#151b2c] text-xs font-semibold text-[#8e9bb4] uppercase tracking-wider">
              <tr>
                <th className="p-3.5 rounded-l-xl">Họ và Tên</th>
                <th className="p-3.5">Mã GV</th>
                <th className="p-3.5">Tổ Bộ Môn</th>
                <th className="p-3.5">Số Lớp Phụ Trách</th>
                <th className="p-3.5">Đánh Giá</th>
                <th className="p-3.5 rounded-r-xl">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#7bd1fa]/10">
              {teachers.map((tc) => (
                <tr key={tc.id} className="hover:bg-[#151b2c]/40 transition-colors">
                  <td className="p-3.5 font-semibold text-white">{tc.name}</td>
                  <td className="p-3.5 text-xs text-[#8e9bb4]">{tc.code}</td>
                  <td className="p-3.5 text-xs text-purple-300 font-medium">{tc.department}</td>
                  <td className="p-3.5 font-bold text-cyan-400">{tc.classesCount} Lớp</td>
                  <td className="p-3.5 text-xs font-bold text-emerald-400">{tc.rating}</td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                      {tc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
