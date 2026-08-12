"use client";

import React, { useState } from "react";
import { Users, Search, Plus, Filter, Download, GraduationCap, Award } from "lucide-react";

export default function SchoolStudentManagementPage() {
  const [selectedGrade, setSelectedGrade] = useState("all");

  const students = [
    { name: "Nguyễn Trần Hải Đăng", code: "HS1201", grade: "Khối 12", class: "12A1", gpa: "9.5", rank: "Hạng 1 Khối", status: "Đang Học" },
    { name: "Lê Bảo Ngọc", code: "HS1105", grade: "Khối 11", class: "11B2", gpa: "8.8", rank: "Hạng 5 Khối", status: "Đang Học" },
    { name: "Phạm Quốc Thái", code: "HS1002", grade: "Khối 10", class: "10A5", gpa: "8.2", rank: "Hạng 12 Khối", status: "Đang Học" },
    { name: "Trần Minh Khoa", code: "HS1209", grade: "Khối 12", class: "12A1", gpa: "7.2", rank: "Hạng 25 Khối", status: "Cần Cố Gắng" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-[#e1e2ec] p-4 md:p-8 font-sans space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#7bd1fa]/10">
        <div>
          <div className="flex items-center gap-2 text-sm text-purple-400 font-medium mb-1">
            <Users className="w-4 h-4" /> Danh mục học sinh
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Quản Lý Học Sinh Toàn Trường 🏢
          </h1>
          <p className="text-sm text-[#8e9bb4] mt-1">Danh sách 1,450 học sinh thuộc các khối 10, 11 và 12.</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 rounded-xl bg-[#151b2c] border border-purple-500/30 text-white text-sm font-medium hover:bg-purple-600/20 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" /> Xuất File CSV
          </button>
          <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium text-sm shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> Thêm Học Sinh
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
              placeholder="Tìm theo tên, mã HS..."
              className="w-full bg-[#151b2c] border border-purple-500/30 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
            />
          </div>

          <div className="flex items-center gap-2">
            {["all", "10", "11", "12"].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedGrade === g
                    ? "bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]"
                    : "text-[#8e9bb4] hover:text-white"
                }`}
              >
                {g === "all" ? "Tất cả khối" : `Khối ${g}`}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#e1e2ec]">
            <thead className="bg-[#151b2c] text-xs font-semibold text-[#8e9bb4] uppercase tracking-wider">
              <tr>
                <th className="p-3.5 rounded-l-xl">Họ và Tên</th>
                <th className="p-3.5">Mã HS</th>
                <th className="p-3.5">Khối / Lớp</th>
                <th className="p-3.5">Điểm GPA</th>
                <th className="p-3.5">Xếp Hạng</th>
                <th className="p-3.5 rounded-r-xl">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#7bd1fa]/10">
              {students.map((st, idx) => (
                <tr key={idx} className="hover:bg-[#151b2c]/40 transition-colors">
                  <td className="p-3.5 font-semibold text-white">{st.name}</td>
                  <td className="p-3.5 text-xs text-[#8e9bb4]">{st.code}</td>
                  <td className="p-3.5 text-xs text-cyan-300 font-medium">{st.grade} • {st.class}</td>
                  <td className="p-3.5 font-bold text-emerald-400">{st.gpa}</td>
                  <td className="p-3.5 text-xs text-[#8e9bb4]">{st.rank}</td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                      {st.status}
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
