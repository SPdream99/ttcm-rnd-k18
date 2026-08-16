"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  ArrowRight,
  GraduationCap,
  Loader2,
  User,
  CheckCircle2,
  Search,
  Plus,
  PauseCircle,
  PlayCircle,
  AlertCircle,
} from "lucide-react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { cacheService } from "@/lib/cacheService";
import { useToast } from "@/components/Toast";

interface StudentLearningPath {
  id: string;
  learning_path_id: string;
  progress: number;
  status: string;
}

interface ClassItem {
  id: string;
  enrollmentDocId: string;
  title: string;
  description: string;
  instructor: string;
  coursesCount: number;
  progress: number;
  difficulty: string;
  category: string;
  status: "active" | "paused";
}

export default function StudentClassPage() {
  const { toast } = useToast();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "paused">("active");
  const [modalAction, setModalAction] = useState<{ cls: ClassItem; targetStatus: "active" | "paused" } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchClasses = async (userUid: string) => {
    try {
      // Chạy song song toàn bộ dữ liệu cần thiết
      const [enrollmentSnapshot, pathSnapshot, usersSnapshot] = await Promise.all([
        getDocs(query(collection(db, "student_learning_path"), where("student_id", "==", userUid))),
        getDocs(collection(db, "learning_path")),
        getDocs(collection(db, "users")),
      ]);

      const enrollments: StudentLearningPath[] = enrollmentSnapshot.docs
        .map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            learning_path_id: data.learning_path_id || "",
            progress: Number(data.progress) || 0,
            status: data.status || "active",
          };
        })
        .filter((item) => item.learning_path_id);

      // In-memory maps
      const pathMap = new Map<string, any>();
      pathSnapshot.docs.forEach((d) => pathMap.set(d.id, d.data()));

      const userMap = new Map<string, any>();
      usersSnapshot.docs.forEach((d) => userMap.set(d.id, d.data()));

      const classList: ClassItem[] = [];
      const seenPathIds = new Set<string>();

      for (const enrollment of enrollments) {
        if (seenPathIds.has(enrollment.learning_path_id)) {
          continue;
        }
        seenPathIds.add(enrollment.learning_path_id);

        const pathData = pathMap.get(enrollment.learning_path_id);
        if (!pathData) continue;

        let teacherName = pathData.authorName || pathData.teacherName || "ThS. Nguyễn Thành Đạt";
        if (pathData.author_id && userMap.has(pathData.author_id)) {
          const u = userMap.get(pathData.author_id);
          teacherName = u.name || u.displayName || u.fullName || teacherName;
        }

        classList.push({
          id: enrollment.learning_path_id,
          enrollmentDocId: enrollment.id || `${userUid}_${enrollment.learning_path_id}`,
          title: pathData.title || "Lớp Học",
          description: pathData.description || "",
          instructor: teacherName,
          coursesCount: Array.isArray(pathData.courses) ? pathData.courses.length : 0,
          progress: enrollment.progress,
          difficulty: pathData.difficulty || "Trung bình",
          category: pathData.category || "Công nghệ & Lập trình",
          status: enrollment.status === "paused" ? "paused" : "active",
        });
      }

      setClasses(classList);
    } catch (error) {
      console.error("Lỗi khi tải danh sách lớp học:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cached = cacheService.get<ClassItem[]>("student_classes_page");
    if (cached?.data && cached.data.length > 0) {
      setClasses(cached.data);
      setLoading(false);
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setClasses([]);
        setLoading(false);
        return;
      }
      fetchClasses(user.uid);
    });

    return () => unsubscribe();
  }, []);

  const handleToggleStatus = async () => {
    if (!modalAction) return;
    setActionLoading(true);
    try {
      const userUid = auth.currentUser?.uid || "usr_student";
      const targetDocId = `${userUid}_${modalAction.cls.id}`;

      // Xóa các document trùng lặp nếu có
      const checkQ = query(
        collection(db, "student_learning_path"),
        where("student_id", "==", userUid),
        where("learning_path_id", "==", modalAction.cls.id)
      );
      const existingSnap = await getDocs(checkQ);
      for (const d of existingSnap.docs) {
        if (d.id !== targetDocId) {
          await deleteDoc(d.ref).catch(() => {});
        }
      }

      const docRef = doc(db, "student_learning_path", targetDocId);
      await setDoc(
        docRef,
        {
          status: modalAction.targetStatus,
          student_id: userUid,
          learning_path_id: modalAction.cls.id,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      setClasses((prev) =>
        prev.map((c) =>
          c.id === modalAction.cls.id
            ? { ...c, status: modalAction.targetStatus, enrollmentDocId: targetDocId }
            : c
        )
      );
      cacheService.invalidate("student_classes_page");

      toast.success(
        modalAction.targetStatus === "paused"
          ? `Đã tạm dừng lớp "${modalAction.cls.title}". Tiến độ học của bạn đã được bảo lưu an toàn!`
          : `Đã tiếp tục học lớp "${modalAction.cls.title}". Chúc bạn học tốt!`,
        "Quản Lý Lớp Học"
      );

      setModalAction(null);
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái lớp:", err);
      toast.error("Không thể cập nhật trạng thái lớp. Vui lòng thử lại sau!", "Lỗi");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredClasses = classes.filter((cls) => {
    if (activeFilter !== "all" && cls.status !== activeFilter) return false;
    const kw = search.toLowerCase().trim();
    if (!kw) return true;
    return (
      cls.title.toLowerCase().includes(kw) ||
      cls.instructor.toLowerCase().includes(kw) ||
      cls.category.toLowerCase().includes(kw)
    );
  });

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 rounded-full border-4 border-zinc-200 border-t-red-600 animate-spin" />
        <p className="text-red-600 font-medium text-sm">Đang tải danh sách lớp học...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* ── HEADER ── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 mb-1.5">
            <GraduationCap className="w-4 h-4" /> Danh Sách Lớp Học Của Tôi
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
            Quản Lý Lớp Học & Tiến Độ
          </h1>
          <p className="text-xs md:text-sm text-zinc-600 mt-1">
            Theo dõi tiến độ, bảo lưu hoặc tiếp tục các lớp học đã đăng ký.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <Link
            href="/student/learning-paths"
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs md:text-sm shadow-md transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Đăng Ký Thêm Lớp
          </Link>
        </div>
      </header>

      {/* ── FILTER & SEARCH TABS ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-xl border border-zinc-200 self-start md:self-auto">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeFilter === "all"
                ? "bg-white text-zinc-900 shadow-sm border border-zinc-200"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Tất Cả ({classes.length})
          </button>
          <button
            onClick={() => setActiveFilter("active")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeFilter === "active"
                ? "bg-red-600 text-white shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Đang Học ({classes.filter((c) => c.status === "active").length})
          </button>
          <button
            onClick={() => setActiveFilter("paused")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeFilter === "paused"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Đã Tạm Dừng / Bảo Lưu ({classes.filter((c) => c.status === "paused").length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm theo tên lớp, giảng viên..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs md:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition"
          />
        </div>
      </div>

      {/* ── CLASS LIST ── */}
      {filteredClasses.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-zinc-200 bg-white p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-lg font-bold text-zinc-900">
            {search ? "Không tìm thấy lớp học phù hợp" : "Chưa có lớp học nào trong danh mục này"}
          </h2>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Khám phá danh sách các Lộ trình học tập để bắt đầu tham gia các khóa học tương tác.
          </p>
          <Link
            href="/student/learning-paths"
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition"
          >
            Khám Phá Lộ Trình <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((cls, idx) => (
            <div
              key={`${cls.enrollmentDocId || cls.id}_${idx}`}
              className={`group flex flex-col justify-between rounded-2xl bg-white border p-6 shadow-sm transition-all duration-200 ${
                cls.status === "paused"
                  ? "border-amber-300 bg-amber-50/10"
                  : "border-zinc-200 hover:border-red-600 hover:shadow-md"
              }`}
            >
              <div>
                {/* Badges & Status */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                    {cls.category}
                  </span>
                  {cls.status === "paused" ? (
                    <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold flex items-center gap-1">
                      <PauseCircle className="w-3.5 h-3.5" /> Đã Bảo Lưu
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Đang Học
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <h3 className="mt-4 text-lg font-black text-zinc-900 group-hover:text-red-600 transition-colors line-clamp-1">
                  {cls.title}
                </h3>
                <p className="mt-1.5 text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                  {cls.description}
                </p>

                {/* Instructor */}
                <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500 font-medium">
                  <User className="w-4 h-4 text-zinc-400" />
                  <span>GV: <strong className="text-zinc-800">{cls.instructor}</strong></span>
                </div>
              </div>

              {/* Progress & Actions */}
              <div className="mt-6 pt-4 border-t border-zinc-100 space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-zinc-500">Tiến độ hoàn thành:</span>
                    <span className="text-zinc-900 font-mono font-extrabold">{cls.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        cls.status === "paused" ? "bg-amber-500" : "bg-red-600"
                      }`}
                      style={{ width: `${cls.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  {/* Pause / Resume Button */}
                  {cls.status === "active" ? (
                    <button
                      onClick={() => setModalAction({ cls, targetStatus: "paused" })}
                      className="px-3 py-2 rounded-xl bg-zinc-100 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 border border-zinc-200 text-xs font-bold text-zinc-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="Dừng học và bảo lưu tiến độ"
                    >
                      <PauseCircle className="w-3.5 h-3.5" /> Dừng Học
                    </button>
                  ) : (
                    <button
                      onClick={() => setModalAction({ cls, targetStatus: "active" })}
                      className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                      title="Tiếp tục học lớp này"
                    >
                      <PlayCircle className="w-3.5 h-3.5" /> Tiếp Tục Học
                    </button>
                  )}

                  <Link
                    href={`/student/classes/${cls.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
                  >
                    <span>Vào Lớp</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── CONFIRMATION MODAL ── */}
      {modalAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-zinc-200 space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-zinc-900">
                {modalAction.targetStatus === "paused"
                  ? "Bảo Lưu & Tạm Dừng Học"
                  : "Kích Hoạt & Tiếp Tục Lớp Học"}
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {modalAction.targetStatus === "paused"
                  ? `Bạn có chắc chắn muốn tạm dừng tham gia lớp "${modalAction.cls.title}"? Toàn bộ tiến độ (${modalAction.cls.progress}%) và điểm số của bạn sẽ được bảo lưu an toàn. Bạn có thể mở lại bất cứ lúc nào.`
                  : `Bạn muốn tiếp tục theo học lớp "${modalAction.cls.title}" với tiến độ (${modalAction.cls.progress}%) đã bảo lưu trước đó?`}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
              <button
                onClick={() => setModalAction(null)}
                disabled={actionLoading}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={handleToggleStatus}
                disabled={actionLoading}
                className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 shadow-sm ${
                  modalAction.targetStatus === "paused"
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {modalAction.targetStatus === "paused"
                  ? "Xác Nhận Bảo Lưu"
                  : "Tiếp Tục Học Ngay"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
