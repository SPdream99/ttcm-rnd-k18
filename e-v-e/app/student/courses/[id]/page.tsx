"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Gamepad2,
  Play,
  Layers,
  Sparkles,
} from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CourseContentPair } from "@/core/entities/Course";

const DEFAULT_COURSES: Record<string, { title: string; description: string; pairs: CourseContentPair[] }> = {
  crs_coding_basics: {
    title: "Bài 1: Nhập Môn Tư Duy Lập Trình & Thuật Toán",
    description: "Nắm vững các khái niệm nền tảng: Biến số, Kiểu dữ liệu, Cấu trúc rẽ nhánh IF-ELSE, Vòng lặp và Tư duy giải thuật.",
    pairs: [
      {
        id: "cb1",
        title: "Biến số (Variable)",
        description: "Dùng để lưu trữ giá trị dữ liệu và có thể thay đổi trong quá trình chạy chương trình.",
        explanation: "Biến số là ô nhớ trong bộ nhớ RAM được đặt tên để lưu trữ các giá trị (số, chuỗi, boolean) và có thể tái sử dụng hoặc cập nhật giá trị trong suốt quá trình thực thi.",
      },
      {
        id: "cb2",
        title: "Cấu trúc điều kiện (IF - ELSE)",
        description: "Kiểm tra điều kiện đúng/sai để quyết định luồng rẽ nhánh thực thi của thuật toán.",
        explanation: "Cấu trúc rẽ nhánh IF - ELSE cho phép chương trình đưa ra quyết định thực thi khối lệnh A nếu điều kiện thỏa mãn (True), ngược lại thực thi khối lệnh B (False).",
      },
      {
        id: "cb3",
        title: "Vòng lặp (Loop)",
        description: "Tự động hóa việc lặp đi lặp lại một khối lệnh nhiều lần mà không cần viết lại mã.",
        explanation: "Vòng lặp (For, While) giúp tối ưu mã nguồn, giảm trùng lặp bằng cách tự động thực hiện lại một nhóm lệnh cho đến khi thỏa mãn điều kiện dừng.",
      },
      {
        id: "cb4",
        title: "Thuật toán (Algorithm)",
        description: "Tập hợp các bước chỉ dẫn tuần tự, rõ ràng nhằm giải quyết một vấn đề cụ thể.",
        explanation: "Thuật toán là quy trình hữu hạn các bước logic, có đầu vào (Input) và đầu ra (Output) xác định nhằm giải quyết một bài toán cụ thể.",
      },
    ],
  },
  crs_computer_hardware: {
    title: "Bài 2: Khám Phá Phần Cứng & Kiến Trúc Máy Tính 3D",
    description: "Tìm hiểu chức năng và nguyên lý hoạt động của CPU, RAM, GPU, Bo mạch chủ và Ổ cứng SSD.",
    pairs: [
      {
        id: "hw1",
        title: "CPU (Central Processing Unit)",
        description: "Bộ vi xử lý trung tâm, đóng vai trò bộ não thực thi các lệnh và tính toán số học/logic của hệ thống.",
        explanation: "CPU là linh kiện quan trọng nhất của máy tính, điều khiển mọi hoạt động, giải mã lệnh và thực hiện các phép toán số học ALU.",
      },
      {
        id: "hw2",
        title: "GPU (Graphics Processing Unit)",
        description: "Bộ xử lý đồ họa chuyên dụng với hàng ngàn lõi song song để kết xuất hình ảnh 3D và tính toán AI.",
        explanation: "GPU được thiết kế kiến trúc song song khổng lồ, chuyên dụng cho việc xử lý ma trận điểm ảnh 3D, dựng hình đồ họa và huấn luyện mô hình AI.",
      },
      {
        id: "hw3",
        title: "RAM (Random Access Memory)",
        description: "Bộ nhớ truy xuất ngẫu nhiên tốc độ cao, lưu trữ dữ liệu tạm thời khi các ứng dụng đang chạy.",
        explanation: "RAM là bộ nhớ bay hơi (volatile memory) có tốc độ truy xuất cực nhanh, chứa dữ liệu làm việc của hệ điều hành và phần mềm đang mở.",
      },
      {
        id: "hw4",
        title: "SSD M.2 NVMe",
        description: "Ổ lưu trữ thể rắn chuẩn giao tiếp PCIe siêu tốc, lưu trữ hệ điều hành và file dữ liệu không bị mất khi tắt nguồn.",
        explanation: "SSD sử dụng chip nhớ flash NAND non-volatile với giao thức NVMe qua làn PCIe, cho tốc độ đọc ghi lên tới hàng nghìn MB/s.",
      },
    ],
  },
  crs_python_foundation: {
    title: "Lập Trình Python Cơ Bản & Ứng Dụng",
    description: "Nền tảng cú pháp Python, các cấu trúc dữ liệu căn bản và thực hành mini game tương tác.",
    pairs: [
      {
        id: "py1",
        title: "Hàm print() trong Python",
        description: "Xuất dữ liệu hoặc chuỗi thông báo ra màn hình console.",
        explanation: "Hàm print() là hàm tích hợp sẵn trong Python dùng để in các đối tượng, chuỗi văn bản ra luồng xuất chuẩn stdout.",
      },
      {
        id: "py2",
        title: "Kiểu dữ liệu Boolean",
        description: "Kiểu dữ liệu logic nhận 1 trong 2 giá trị: True hoặc False.",
        explanation: "Kiểu Boolean (bool) trong Python là kiểu logic chỉ có 2 giá trị phân biệt được viết hoa chữ cái đầu là True và False.",
      },
      {
        id: "py3",
        title: "Danh sách (List) trong Python",
        description: "Cấu trúc dữ liệu có thứ tự, có thể thay đổi và chứa nhiều kiểu phần tử khác nhau.",
        explanation: "List trong Python được định nghĩa bằng cặp ngoặc vuông [] và cho phép lập chỉ mục bắt đầu từ 0.",
      },
    ],
  },
  crs_python_mini_games: {
    title: "Bài 3: Lập Trình Trò Chơi Mini Với Python",
    description: "Ứng dụng thư viện Pygame để thiết kế đồ họa 2D, xử lý va chạm và vòng lặp trò chơi hoàn chỉnh.",
    pairs: [
      {
        id: "py1",
        title: "Hàm print() trong Python",
        description: "Xuất dữ liệu hoặc chuỗi thông báo ra màn hình console.",
        explanation: "Hàm print() là hàm tích hợp sẵn trong Python dùng để in các đối tượng, chuỗi văn bản ra luồng xuất chuẩn stdout.",
      },
      {
        id: "py2",
        title: "Kiểu dữ liệu Boolean",
        description: "Kiểu dữ liệu logic nhận 1 trong 2 giá trị: True hoặc False.",
        explanation: "Kiểu Boolean (bool) trong Python là kiểu logic chỉ có 2 giá trị phân biệt được viết hoa chữ cái đầu là True và False.",
      },
    ],
  },
};

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = (params?.id as string) || "crs_coding_basics";

  const [course, setCourse] = useState<{ title: string; description: string; pairs: CourseContentPair[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourse() {
      // 1. Try fetching via init API (has server-side admin access)
      try {
        const res = await fetch("/api/games/init", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gameId: "game_card_match_vr", courseId }),
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.pairs) && data.pairs.length > 0) {
          setCourse({
            title: data.courseTitle || courseId,
            description: "Nội dung học phần và học liệu tương tác giáo dục.",
            pairs: data.pairs,
          });
          setLoading(false);
          return;
        }
      } catch {
        // ignore and fallback
      }

      // 2. Try fetching from Firestore collection 'courses'
      try {
        const docRef = doc(db, "courses", courseId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setCourse({
            title: data.title || courseId,
            description: data.description || "",
            pairs: Array.isArray(data.pairs)
              ? data.pairs
              : Array.isArray(data.contentData)
              ? data.contentData
              : data.contentData?.pairs || DEFAULT_COURSES[courseId]?.pairs || [],
          });
          setLoading(false);
          return;
        }
      } catch {
        // ignore permission error and fallback smoothly
      }

      // 3. Fallback to predefined catalogue
      const fallback = DEFAULT_COURSES[courseId] || DEFAULT_COURSES.crs_coding_basics;
      setCourse(fallback);
      setLoading(false);
    }

    loadCourse();
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 font-sans">
        <div className="w-10 h-10 rounded-full border-4 border-zinc-200 border-t-red-600 animate-spin" />
        <p className="text-red-600 font-medium text-sm">Đang tải dữ liệu bài học...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center font-sans">
        <BookOpen className="w-12 h-12 text-zinc-400 mb-4" />
        <h1 className="text-xl font-bold text-zinc-900 mb-2">Không tìm thấy bài học</h1>
        <button
          onClick={() => router.back()}
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* ── HEADER BANNER ── */}
      <header className="bg-white rounded-2xl border border-zinc-200 p-6 md:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-100 border border-zinc-200 text-xs font-bold text-zinc-700 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Quay Lại
          </button>
          <span className="px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-red-600" /> Chi Tiết Bài Giảng
          </span>
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">
            {course.title}
          </h1>
          <p className="text-xs md:text-sm text-zinc-600 mt-2 max-w-3xl leading-relaxed">
            {course.description}
          </p>
        </div>
      </header>

      {/* ── LEARNING CONTENT PAIRS ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-zinc-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-red-600" /> Cặp Khái Niệm & Định Nghĩa ({course.pairs.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {course.pairs.map((pair, idx) => (
            <div
              key={pair.id || idx}
              className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm hover:border-red-600 transition space-y-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 text-red-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  #{idx + 1}
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-extrabold text-zinc-900">{pair.title}</h3>
                  <p className="text-xs text-red-600 font-semibold mt-1">{pair.description}</p>
                </div>
              </div>

              {pair.explanation && (
                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 leading-relaxed">
                   <span className="font-bold text-zinc-800">Giải thích:</span> {pair.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── AVAILABLE GAMES FOR THIS COURSE ── */}
      <section className="space-y-4 pt-4 border-t border-zinc-200">
        <h2 className="text-base font-extrabold text-zinc-900 flex items-center gap-2">
          <Gamepad2 className="w-4 h-4 text-red-600" /> Minigame Tương Tác Của Khóa Học
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Game 1: Memory Match */}
          <Link
            href={`/student/play/game_card_match_vr/${courseId}`}
            className="p-6 rounded-2xl bg-white border border-zinc-200 hover:border-red-600 hover:shadow-md transition group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-md bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                  Memory Match
                </span>
                <span className="text-xs text-amber-600 font-extrabold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> +100 Coins
                </span>
              </div>
              <h3 className="font-extrabold text-base text-zinc-900 group-hover:text-red-600 transition">
                Ghép Cặp Thẻ Bài Thuật Toán
              </h3>
              <p className="text-xs text-zinc-500 mt-1.5 line-clamp-2 leading-relaxed">
                Tìm và ghép đôi thẻ chứa Khái niệm với thẻ chứa Định nghĩa tương ứng của bài học.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-red-600">
              <span>Bắt đầu chơi</span>
              <Play className="w-3.5 h-3.5 fill-red-600" />
            </div>
          </Link>

          {/* Game 2: Quiz Runner 3D */}
          <Link
            href={`/student/play/game_space_quiz_3d/${courseId}`}
            className="p-6 rounded-2xl bg-white border border-zinc-200 hover:border-red-600 hover:shadow-md transition group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-md bg-zinc-100 text-zinc-700 text-xs font-bold border border-zinc-200">
                  Action Quiz 3D
                </span>
                <span className="text-xs text-amber-600 font-extrabold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> +120 Coins
                </span>
              </div>
              <h3 className="font-extrabold text-base text-zinc-900 group-hover:text-red-600 transition">
                Quiz Runner 3D - Trắc Nghiệm Tốc Độ
              </h3>
              <p className="text-xs text-zinc-500 mt-1.5 line-clamp-2 leading-relaxed">
                Thử thách phản xạ, đọc câu hỏi từ bài học và chọn đáp án chính xác nhất.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-red-600">
              <span>Bắt đầu chơi</span>
              <Play className="w-3.5 h-3.5 fill-red-600" />
            </div>
          </Link>
        </div>
      </section>

      {/* ── BOTTOM NAVIGATION ── */}
      <div className="pt-4 flex items-center justify-between border-t border-zinc-200">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-100 border border-zinc-200 text-xs font-bold text-zinc-700 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Quay Lại
        </button>
        <Link
          href="/student/classes"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-sm"
        >
          Về Danh Sách Lớp Học
        </Link>
      </div>
    </div>
  );
}
