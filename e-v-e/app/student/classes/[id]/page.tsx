"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  Loader2,
  Target,
  User,
  Sparkles,
  PauseCircle,
  PlayCircle,
  AlertCircle,
  Users,
  Shield,
  MessageSquare,
} from "lucide-react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import LearningPathMap from "@/components/LearningPathMap";
import { cacheService } from "@/lib/cacheService";
import { useToast } from "@/components/Toast";

interface LearningPath {
  id: string;
  title: string;
  description: string;
  author_id: string;
  courses: string[];
  difficulty: string;
  category: string;
  teacherName: string;
  estimated_hours: number;
}

interface Enrollment {
  docId: string;
  progress: number;
  status: "active" | "paused";
}

interface MemberItem {
  id: string;
  name: string;
  role: "Teacher" | "Student" | "Monitor";
  email: string;
}

export default function StudentClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const { toast } = useToast();
  const router = useRouter();
  const nextParams = useParams();
  const rawId = (nextParams?.id as string) || "";

  const [path, setPath] = useState<LearningPath | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          router.push("/student/classes");
          return;
        }

        const pathId = rawId;
        if (!pathId) return;

        // 1. Enrollment
        const enrollmentQuery = query(
          collection(db, "student_learning_path"),
          where("student_id", "==", user.uid),
          where("learning_path_id", "==", pathId)
        );

        const enrollmentSnapshot = await getDocs(enrollmentQuery);

        if (!enrollmentSnapshot.empty) {
          const docItem = enrollmentSnapshot.docs[0];
          const enrollmentData = docItem.data();
          setEnrollment({
            docId: docItem.id,
            progress: Number(enrollmentData.progress) || 0,
            status: (enrollmentData.status === "paused" ? "paused" : "active") as "active" | "paused",
          });
        }

        // 2. Learning Path
        const pathQuery = query(
          collection(db, "learning_path"),
          where("__name__", "==", pathId)
        );

        const pathSnapshot = await getDocs(pathQuery);

        if (pathSnapshot.empty) {
          const fallbackQ = query(
            collection(db, "learning_path"),
            where("id", "==", pathId)
          );
          const fallbackSnap = await getDocs(fallbackQ);
          if (fallbackSnap.empty) {
            setPath(null);
            setLoading(false);
            return;
          }
          const pDoc = fallbackSnap.docs[0];
          const data = pDoc.data();
          await setPathState(pDoc.id, data);
        } else {
          const pDoc = pathSnapshot.docs[0];
          const data = pDoc.data();
          await setPathState(pDoc.id, data);
        }

        // 3. Class Members
        try {
          const membersSnap = await getDocs(collection(db, "class_members"));
          const memberList: MemberItem[] = [];
          membersSnap.docs.forEach((d) => {
            const m = d.data();
            memberList.push({
              id: m.student_id || d.id,
              name: m.student_name || "Thành viên lớp",
              role: m.role || "Student",
              email: m.student_email || "member@eve.edu.vn",
            });
          });
          setMembers(memberList);
        } catch {
          setMembers([
            {
              id: "YMdybMQPIYWQVlUmb346L92P3z53",
              name: "ThS. Nguyễn Thành Đạt",
              role: "Teacher",
              email: "dat1@gmail.com",
            },
            {
              id: "f89rGIGZVlQoA5J82jqavzWEvIs2",
              name: "Nguyễn Thành Đạt",
              role: "Student",
              email: "dat@gmail.com",
            },
          ]);
        }
      } catch (err) {
        console.error("Error loading class detail:", err);
      } finally {
        setLoading(false);
      }
    });

    async function setPathState(docId: string, data: any) {
      let teacherName = "ThS. Nguyễn Thành Đạt";
      if (data.author_id) {
        try {
          const teacherQuery = query(
            collection(db, "users"),
            where("id", "==", data.author_id)
          );
          const teacherSnapshot = await getDocs(teacherQuery);
          if (!teacherSnapshot.empty) {
            const tData = teacherSnapshot.docs[0].data();
            teacherName = tData.name || tData.displayName || "ThS. Nguyễn Thành Đạt";
          }
        } catch {}
      }

      setPath({
        id: docId,
        title: data.title || "Lớp Học",
        description: data.description || "",
        author_id: data.author_id || "",
        courses: Array.isArray(data.courses) ? data.courses : [],
        difficulty: data.difficulty || "Beginner",
        category: data.category || "General",
        teacherName,
        estimated_hours: Number(data.estimated_hours) || 20,
      });

      if (!enrollment) {
        setEnrollment({ docId: "", progress: 60, status: "active" });
      }
    }

    return () => unsubscribe();
  }, [rawId, router]);

  const handleToggleStatus = async () => {
    const userUid = auth.currentUser?.uid || "usr_student";
    const nextStatus = enrollment?.status === "active" ? "paused" : "active";
    const targetDocId =
      enrollment?.docId || `${userUid}_${path?.id || rawId}`;

    setActionLoading(true);
    try {
      const docRef = doc(db, "student_learning_path", targetDocId);
      await setDoc(
        docRef,
        {
          status: nextStatus,
          student_id: userUid,
          learning_path_id: path?.id || rawId,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      setEnrollment((prev) =>
        prev
          ? { ...prev, status: nextStatus, docId: targetDocId }
          : { docId: targetDocId, progress: 60, status: nextStatus }
      );
      cacheService.invalidate("student_classes_page");

      toast.success(
        nextStatus === "paused"
          ? `Đã tạm dừng lớp học. Toàn bộ tiến độ của bạn đã được bảo lưu an toàn!`
          : `Đã tiếp tục học lớp này. Chúc bạn hoàn thành xuất sắc các bài học!`,
        "Quản Lý Lớp Học"
      );

      setIsModalOpen(false);
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái học:", err);
      toast.error("Không thể cập nhật trạng thái lớp. Vui lòng thử lại sau!", "Lỗi");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 rounded-full border-4 border-zinc-200 border-t-red-600 animate-spin" />
        <p className="text-red-600 font-medium text-sm">Đang tải thông tin lớp học...</p>
      </div>
    );
  }

  if (!path) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center font-sans">
        <BookOpen className="w-12 h-12 text-zinc-400 mb-4" />
        <h1 className="text-xl font-bold text-zinc-900 mb-2">Không tìm thấy Lớp học</h1>
        <Link
          href="/student/classes"
          className="mt-4 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition"
        >
          Quay lại danh sách lớp
        </Link>
      </div>
    );
  }

  const progress = Math.min(enrollment?.progress || 0, 100);
  const isPaused = enrollment?.status === "paused";

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* ── HEADER BANNER ── */}
      <section className="bg-white rounded-2xl border border-zinc-200 p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            href="/student/classes"
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-red-600 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại Lớp Học Của Tôi
          </Link>

          {/* Dừng Học / Tiếp Tục Học Button */}
          {isPaused ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <PlayCircle className="w-4 h-4" /> Tiếp Tục Học Lớp Này
            </button>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 border border-zinc-200 text-zinc-700 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
            >
              <PauseCircle className="w-4 h-4 text-amber-600" /> Dừng Học & Bảo Lưu
            </button>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                {path.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-zinc-100 text-zinc-600 text-xs font-medium">
                {path.difficulty}
              </span>
              {isPaused && (
                <span className="px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold flex items-center gap-1">
                  <PauseCircle className="w-3.5 h-3.5" /> Đã Bảo Lưu
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">
              {path.title}
            </h1>

            <p className="mt-2.5 max-w-3xl text-xs md:text-sm leading-relaxed text-zinc-600">
              {path.description || "Lộ trình đào tạo toàn diện với hệ thống học liệu và minigame tương tác."}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-5 text-xs text-zinc-600">
              <span className="flex items-center gap-1.5 font-bold text-zinc-800">
                <User className="w-4 h-4 text-red-600" />
                Giảng viên: <span className="text-red-700">{path.teacherName}</span>
              </span>

              <span className="flex items-center gap-1.5 font-medium">
                <BookOpen className="w-4 h-4 text-zinc-400" />
                {path.courses.length} Khóa học (Courses)
              </span>

              {path.estimated_hours > 0 && (
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-4 h-4 text-zinc-400" />
                  Thời lượng: {path.estimated_hours} giờ
                </span>
              )}
            </div>
          </div>

          {/* Progress Card */}
          <div className={`rounded-2xl border p-5 flex flex-col justify-between ${
            isPaused ? "bg-amber-50/50 border-amber-200" : "bg-red-50 border-red-200"
          }`}>
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-bold text-zinc-700 uppercase tracking-wider">Tiến Độ Lớp Học</span>
                <span className={`text-base font-black ${isPaused ? "text-amber-600" : "text-red-600"}`}>
                  {progress}%
                </span>
              </div>

              <div className="h-3 w-full bg-zinc-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isPaused ? "bg-amber-500" : "bg-red-600"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="mt-3 text-xs text-zinc-600">
                {isPaused
                  ? "Lớp học đang ở trạng thái bảo lưu. Bạn có thể kích hoạt lại bất kỳ lúc nào."
                  : progress >= 100
                  ? "Bạn đã hoàn thành toàn bộ lộ trình!"
                  : "Hoàn thành các minigame để nâng cao tiến độ học tập."}
              </p>
            </div>

            <Link
              href={
                path.courses && path.courses.length > 0
                  ? `/student/play/game_card_match_vr/${path.courses[0]}`
                  : `/student/play/game_card_match_vr/crs_coding_basics`
              }
              className={`mt-4 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold text-white shadow-sm transition-all ${
                isPaused
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              <span>{isPaused ? "Chơi Game Thực Hành" : "Tiếp Tục Bài Học"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE LEARNING PATH MAP ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-red-600" /> Bản Đồ Cây Kỹ Năng Lớp Học
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Bấm vào các trạm bài học để bắt đầu thực hành minigame tương tác và mở khóa kiến thức.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <LearningPathMap
            courses={path.courses}
          />
        </div>
      </section>

      {/* ── BẠN CÙNG LỚP & GIẢNG VIÊN ── */}
      <section className="space-y-4 pt-4 border-t border-zinc-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-red-600" /> Bạn Cùng Lớp & Giảng Viên ({members.length})
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Danh sách các học viên và giảng viên phụ trách trong lớp học này.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((m) => {
            const isTeacher = m.role === "Teacher";
            return (
              <div
                key={m.id}
                className={`p-5 rounded-2xl border flex items-center justify-between gap-3 shadow-sm transition-all ${
                  isTeacher
                    ? "bg-red-50/60 border-red-200"
                    : "bg-white border-zinc-200 hover:border-red-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shadow-sm ${
                        isTeacher ? "bg-red-600" : "bg-zinc-800"
                      }`}
                    >
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
      </section>

      {/* ── CONFIRMATION MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-zinc-200 space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-zinc-900">
                {isPaused ? "Tiếp Tục Theo Học Lớp Này" : "Bảo Lưu & Dừng Học Tạm Thời"}
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {isPaused
                  ? `Bạn muốn tiếp tục theo học lớp "${path.title}" với tiến độ (${progress}%) đã bảo lưu trước đó?`
                  : `Bạn có chắc chắn muốn tạm dừng theo học lớp "${path.title}"? Toàn bộ tiến độ hoàn thành (${progress}%) và bài học đã qua của bạn sẽ được bảo lưu an toàn.`}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={actionLoading}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={handleToggleStatus}
                disabled={actionLoading}
                className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 shadow-sm ${
                  isPaused
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-amber-600 hover:bg-amber-700"
                }`}
              >
                {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {isPaused ? "Tiếp Tục Học Ngay" : "Xác Nhận Bảo Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
