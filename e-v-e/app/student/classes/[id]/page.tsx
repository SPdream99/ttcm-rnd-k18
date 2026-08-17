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
  Lock,
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
  const [coursePlayCounts, setCoursePlayCounts] = useState<Record<string, number>>({});
  const [approvedCourses, setApprovedCourses] = useState<string[]>([]);
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockReason, setLockReason] = useState("");

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

        let studentApprovedCourses: string[] = [];
        if (!enrollmentSnapshot.empty) {
          const docData = enrollmentSnapshot.docs[0].data();
          studentApprovedCourses = Array.isArray(docData.approved_courses)
            ? docData.approved_courses
            : Array.isArray(docData.approvedCourses)
            ? docData.approvedCourses
            : [];
          setEnrollment({
            docId: enrollmentSnapshot.docs[0].id,
            progress: Number(docData.progress) || 0,
            status: (docData.status === "paused" ? "paused" : "active") as "active" | "paused",
          });
        }
        setApprovedCourses(studentApprovedCourses);

        // 2. Learning Path & Course Approval Checking
        const [pathSnapshot, coursesSnapshot] = await Promise.all([
          getDocs(query(collection(db, "learning_path"), where("__name__", "==", pathId))),
          getDocs(collection(db, "courses")),
        ]);

        const acceptedCourseIds = new Set<string>();
        coursesSnapshot.docs.forEach((d) => {
          const cd = d.data();
          if (cd.isAccepted ?? cd.is_accepted) {
            acceptedCourseIds.add(d.id);
          }
        });

        let pDocData: any = null;
        let pDocId = "";

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
          pDocData = fallbackSnap.docs[0].data();
          pDocId = fallbackSnap.docs[0].id;
        } else {
          pDocData = pathSnapshot.docs[0].data();
          pDocId = pathSnapshot.docs[0].id;
        }

        const isPathAccepted = Boolean(pDocData.is_accepted ?? pDocData.isAccepted);
        const pathCourses: string[] = Array.isArray(pDocData.courses) ? pDocData.courses : [];
        const allCoursesApproved = pathCourses.length > 0 && pathCourses.every((cId: any) => acceptedCourseIds.has(typeof cId === "string" ? cId : cId.id));

        if (!isPathAccepted || !allCoursesApproved) {
          setIsLocked(true);
          setLockReason("Lớp học này hiện đang bị tạm khóa do có 1 hoặc nhiều bài học trong lộ trình chưa được Quản trị viên phê duyệt.");
          setLoading(false);
          return;
        }

        await setPathState(pDocId, pDocData);

        // 3. Class Members
        try {
          const membersSnap = await getDocs(collection(db, "class_members"));
          const memberList: MemberItem[] = [];
          const seenKeys = new Set<string>();

          membersSnap.docs.forEach((d) => {
            const m = d.data();
            const memberId = m.student_id || d.id;
            const uniqueKey = `${m.class_id || ""}_${memberId}`;
            if (!seenKeys.has(memberId)) {
              seenKeys.add(memberId);
              memberList.push({
                id: memberId,
                name: m.student_name || "Thành viên lớp",
                role: m.role || "Student",
                email: m.student_email || "member@eve.edu.vn",
              });
            }
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

        // 4. Lấy dữ liệu lượt chơi (game_results) để mở khóa tuần tự từng chặng
        try {
          const resultsSnap = await getDocs(
            query(collection(db, "game_results"), where("user_id", "==", user.uid))
          );
          const counts: Record<string, number> = {};
          resultsSnap.docs.forEach((d) => {
            const resData = d.data();
            const crs = resData.course_id || resData.courseId;
            if (crs) {
              counts[crs] = (counts[crs] || 0) + 1;
            }
          });
          setCoursePlayCounts(counts);
        } catch (resErr) {
          console.warn("Could not load game_results:", resErr);
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

  if (isLocked) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center p-6 text-center font-sans max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-zinc-100 border-2 border-zinc-300 text-zinc-600 flex items-center justify-center mb-4 shadow-sm">
          <Lock className="w-8 h-8 text-zinc-600" />
        </div>
        <span className="px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-wider mb-2">
          Lộ Trình Tạm Khóa
        </span>
        <h1 className="text-xl font-black text-zinc-900 mb-2">Lớp Học Chưa Được Phê Duyệt Hoàn Tất</h1>
        <p className="text-xs text-zinc-600 leading-relaxed mb-6">
          {lockReason || "Lớp học này hiện đang bị tạm khóa do có 1 hoặc nhiều bài học trong lộ trình chưa được Quản trị viên phê duyệt. Bạn không thể truy cập nội dung bài học lúc này."}
        </p>
        <Link
          href="/student/classes"
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách lớp học
        </Link>
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

  const isPaused = enrollment?.status === "paused";

  const safePathCourses = Array.isArray(path?.courses) && path.courses.length > 0
    ? path.courses
    : ["crs_coding_basics", "crs_python_foundation", "crs_data_structures"];

  const completedCoursesList = safePathCourses.filter(
    (cId) => (coursePlayCounts[cId] || 0) >= 1
  );

  const dynamicProgress = safePathCourses.length > 0
    ? Math.round((completedCoursesList.length / safePathCourses.length) * 100)
    : (enrollment?.progress || 0);

  const displayProgress = enrollment?.progress ? Math.max(enrollment.progress, dynamicProgress) : dynamicProgress;

  return (
    <div className="space-y-8 font-sans pb-12">
      {/* ── TOP BREADCRUMB & ACTIONS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/student/classes"
            className="p-2.5 rounded-xl bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300 shadow-xs transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="text-xs text-zinc-500 font-medium">Lớp Học Trực Tuyến</div>
            <h2 className="text-lg font-bold text-zinc-900 line-clamp-1">{path.title}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {isPaused ? (
              <>
                <PlayCircle className="w-4 h-4 text-emerald-600" /> Kích Hoạt Lại Lớp
              </>
            ) : (
              <>
                <PauseCircle className="w-4 h-4 text-amber-600" /> Tạm Dừng / Bảo Lưu
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── BANNER HERO ── */}
      <section className="rounded-3xl border-2 border-zinc-200 bg-white p-6 md:p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" /> {path.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-bold">
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
                {safePathCourses.length} Khóa học (Courses)
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
                  {displayProgress}%
                </span>
              </div>

              <div className="h-3 w-full bg-zinc-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isPaused ? "bg-amber-500" : "bg-red-600"
                  }`}
                  style={{ width: `${displayProgress}%` }}
                />
              </div>

              <p className="mt-3 text-xs text-zinc-600">
                {isPaused
                  ? "Lớp học đang ở trạng thái bảo lưu. Bạn có thể kích hoạt lại bất kỳ lúc nào."
                  : displayProgress >= 100
                  ? "Bạn đã hoàn thành toàn bộ lộ trình!"
                  : `Đã hoàn thành ${completedCoursesList.length}/${safePathCourses.length} chặng bài học.`}
              </p>
            </div>

            {isPaused ? (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold text-white shadow-sm transition-all bg-amber-600 hover:bg-amber-700 cursor-pointer"
              >
                <span>Kích Hoạt Lại Lớp Để Tiếp Tục Học</span>
                <PlayCircle className="w-4 h-4" />
              </button>
            ) : (
              <Link
                href={
                  safePathCourses.length > 0
                    ? `/student/play/game_card_match_vr/${safePathCourses[Math.min(completedCoursesList.length, safePathCourses.length - 1)]}`
                    : `/student/play/game_card_match_vr/crs_coding_basics`
                }
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold text-white shadow-sm transition-all bg-red-600 hover:bg-red-700"
              >
                <span>Tiếp Tục Chặng Hiện Tại</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
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
            courses={safePathCourses}
            completedCourses={completedCoursesList}
            approvedCourses={approvedCourses}
            coursePlayCounts={coursePlayCounts}
            requiredPlaysPerStage={1}
            isPaused={isPaused}
            isEnrolled={enrollment !== null}
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
          {members.map((m, idx) => {
            const isTeacher = m.role === "Teacher";
            return (
              <div
                key={`${m.id}_${idx}`}
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
                  ? `Bạn muốn tiếp tục theo học lớp "${path.title}" với tiến độ (${enrollment?.progress || 0}%) đã bảo lưu trước đó?`
                  : `Bạn có chắc chắn muốn tạm dừng theo học lớp "${path.title}"? Toàn bộ tiến độ hoàn thành (${enrollment?.progress || 0}%) và bài học đã qua của bạn sẽ được bảo lưu an toàn.`}
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
