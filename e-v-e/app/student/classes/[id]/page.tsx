"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Gamepad2,
  LogOut,
  Trophy,
  Play,
  X,
  AlertTriangle,
} from "lucide-react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useToast } from "@/components/student/Toast";
import LearningPathMap from "@/components/LearningPathMap";

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
  status: string;
}

interface CourseItem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  rewardCoins: number;
  totalLessons: number;
  requiredGames: number;
  completedGames: number;
  games: Array<{
    id: string;
    title: string;
    type: string;
    href: string;
    reward: number;
  }>;
}

export default function StudentClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { toast } = useToast();

  const [path, setPath] = useState<LearningPath | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  // Selected Course Modal
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);
  const [completedCourseIds, setCompletedCourseIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const user = auth.currentUser;
        const pathId = resolvedParams.id;

        // 1. Fetch enrollment
        if (user) {
          try {
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
                status: enrollmentData.status || "active",
              });
            }
          } catch {}
        }

        // 2. Fetch learning path
        const docRef = doc(db, "learning_path", pathId);
        const snapshot = await getDoc(docRef);

        let data: any = null;
        let documentId = pathId;

        if (snapshot.exists()) {
          data = snapshot.data();
        } else {
          const q = query(collection(db, "learning_path"), where("id", "==", pathId));
          const qs = await getDocs(q);
          if (!qs.empty) {
            data = qs.docs[0].data();
            documentId = qs.docs[0].id;
          }
        }

        if (data) {
          let teacherName = data.authorName || data.teacherName || "Giáo Viên E-V-E";
          if (data.author_id) {
            try {
              const teacherDoc = await getDoc(doc(db, "teachers", data.author_id));
              if (teacherDoc.exists()) {
                teacherName = teacherDoc.data()?.name || teacherDoc.data()?.fullName || teacherName;
              }
            } catch {}
          }

          const rawCourses = Array.isArray(data.courses) ? data.courses : ["crs_python_foundation"];

          setPath({
            id: documentId,
            title: data.title || "Lớp Học",
            description: data.description || "",
            author_id: data.author_id || "",
            courses: rawCourses,
            difficulty: data.difficulty || "Intermediate",
            category: data.category || "General",
            teacherName,
            estimated_hours: Number(data.estimated_hours) || 6,
          });

          // Mark first course as completed if progress > 25%
          if (enrollment?.progress && enrollment.progress >= 25 && rawCourses.length > 0) {
            setCompletedCourseIds([rawCourses[0]]);
          }
        }
      } catch (err) {
        console.error("Error fetching class detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClass();
  }, [resolvedParams.id]);

  // Handle Quit / Leave Class
  const handleLeaveClass = async () => {
    if (!enrollment?.docId) {
      toast.error("Không tìm thấy thông tin ghi danh để rời lớp.");
      return;
    }

    setLeaving(true);
    try {
      await deleteDoc(doc(db, "student_learning_path", enrollment.docId));
      toast.success("Bạn đã rời khỏi lớp học thành công.");
      setShowLeaveConfirm(false);
      router.push("/student/classes");
    } catch (err) {
      console.error("Error leaving class:", err);
      toast.error("Lỗi khi rời lớp. Vui lòng thử lại!");
    } finally {
      setLeaving(false);
    }
  };

  // Open Course Modal
  const handleSelectCourse = async (courseId: string) => {
    const cleanTitle = courseId.replace(/^crs_/, "").replace(/_/g, " ").toUpperCase();
    
    // Build rich course data
    const courseData: CourseItem = {
      id: courseId,
      title: cleanTitle,
      description: `Khóa học thuộc lộ trình ${path?.title || "E-V-E"}. Tích hợp bài học và minigame tương tác rèn luyện tư duy.`,
      difficulty: path?.difficulty || "Intermediate",
      rewardCoins: 100,
      totalLessons: 12,
      requiredGames: 2,
      completedGames: completedCourseIds.includes(courseId) ? 2 : 1,
      games: [
        {
          id: "game_card_match_vr",
          title: "Memory Matching Game (Lật Thẻ Trí Nhớ)",
          type: "Memory Match 3D",
          href: `/game/MemoryMatchingGame/play`,
          reward: 50,
        },
        {
          id: "boss_battle_quiz",
          title: "Boss Slayer Marathon Quiz (Đấu Trùm)",
          type: "Action Quiz Marathon",
          href: `/student/play/boss_battle_quiz/${courseId}`,
          reward: 60,
        },
      ],
    };

    // Try fetch course info from Firestore if exists
    try {
      const cDoc = await getDoc(doc(db, "courses", courseId));
      if (cDoc.exists()) {
        const cd = cDoc.data();
        courseData.title = cd.title || courseData.title;
        courseData.description = cd.description || courseData.description;
        courseData.rewardCoins = Number(cd.rewardCoins) || courseData.rewardCoins;
      }
    } catch {}

    setSelectedCourse(courseData);
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-3 text-cyan-400">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="font-medium text-sm">Đang tải thông tin lớp học...</span>
        </div>
      </div>
    );
  }

  if (!path) {
    return (
      <div className="p-12 text-center rounded-2xl bg-[#0f1524]/60 border border-[#7bd1fa]/10 space-y-4">
        <BookOpen className="w-12 h-12 text-slate-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Không tìm thấy thông tin lớp học</h2>
        <Link
          href="/student/classes"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Quay Lại Danh Sách Lớp
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#7bd1fa]/10">
        <div className="flex items-center gap-3">
          <Link
            href="/student/classes"
            className="p-2 rounded-xl bg-[#151b2c] hover:bg-slate-800 text-slate-300 hover:text-white transition-all border border-slate-700 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
              <GraduationCap className="h-4 w-4" /> Không Gian Lớp Học (My Class)
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1">
              {path.title}
            </h1>
          </div>
        </div>

        {/* Leave Class Action Button */}
        <button
          onClick={() => setShowLeaveConfirm(true)}
          className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/25 font-bold text-xs transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" /> Rời Khỏi Lớp Học
        </button>
      </div>

      {/* Hero Overview Card */}
      <div className="rounded-3xl border border-[#7bd1fa]/20 bg-[#0f1524]/80 p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded-md border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
              {path.category}
            </span>
            <span className="text-xs text-[#8e9bb4]">
              Giảng viên: <strong className="text-slate-200">{path.teacherName}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#8e9bb4]">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> {path.courses.length} Khóa học
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> ~{path.estimated_hours} Giờ
            </span>
          </div>
        </div>

        <p className="text-xs md:text-sm text-[#8e9bb4] leading-relaxed">
          {path.description}
        </p>

        {/* Progress bar */}
        <div className="space-y-2 p-4 rounded-2xl bg-[#151b2c] border border-[#7bd1fa]/10">
          <div className="flex justify-between text-xs">
            <span className="text-[#8e9bb4] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Tiến độ hoàn thành lớp học
            </span>
            <span className="font-bold text-cyan-400 font-mono">{enrollment?.progress ?? 0}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#0a0e1a]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 transition-all duration-500"
              style={{ width: `${enrollment?.progress ?? 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Visual Roadmap Map */}
      <div className="rounded-3xl border border-[#7bd1fa]/15 bg-[#0f1524]/60 p-6 backdrop-blur-md">
        <LearningPathMap
          courses={path.courses}
          completedCourses={completedCourseIds}
          onSelectCourse={handleSelectCourse}
        />
      </div>

      {/* =========================================================
          COURSE & MINIGAMES MODAL (Khi bấm vào course đã mở khóa)
      ========================================================= */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="max-w-xl w-full p-6 md:p-8 rounded-3xl bg-[#0f1524] border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.2)] space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#7bd1fa]/10 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">Khóa Học Mở Khóa</span>
                  <h3 className="text-lg font-bold text-white">{selectedCourse.title}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#8e9bb4] leading-relaxed">
              {selectedCourse.description}
            </p>

            {/* Requirement Stats Banner */}
            <div className="p-4 rounded-2xl bg-[#151b2c] border border-[#7bd1fa]/15 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#8e9bb4] block">Yêu Cầu Hoàn Thành Course</span>
                <span className="text-sm font-bold text-amber-300 flex items-center gap-1.5 mt-0.5">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  Đã xong {selectedCourse.completedGames} / {selectedCourse.requiredGames} Trò chơi
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 text-xs font-mono font-bold">
                +{selectedCourse.rewardCoins} Coins
              </span>
            </div>

            {/* Playable Games List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Gamepad2 className="w-4 h-4 text-cyan-400" /> Danh Sách Minigame Chơi Được Với Course Này:
              </h4>

              <div className="space-y-2.5">
                {selectedCourse.games.map((g) => (
                  <div
                    key={g.id}
                    className="p-4 rounded-2xl bg-[#151b2c] border border-[#7bd1fa]/15 hover:border-cyan-500/40 transition-all flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-white text-xs md:text-sm">{g.title}</div>
                      <div className="text-[11px] text-cyan-400 font-mono mt-0.5">{g.type} • +{g.reward} Coins</div>
                    </div>

                    <Link
                      href={g.href}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all flex items-center gap-1.5 shrink-0"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" /> Chơi Ngay
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          LEAVE CLASS CONFIRMATION MODAL
      ========================================================= */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-3xl bg-[#0f1524] border border-red-500/40 text-center space-y-5 animate-in zoom-in-95">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 text-red-400 border border-red-500/25 flex items-center justify-center text-2xl">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white">Xác Nhận Rời Khỏi Lớp Học?</h3>
              <p className="text-xs text-[#8e9bb4] leading-relaxed">
                Bạn có chắc chắn muốn rời lớp <strong className="text-slate-200">{path.title}</strong>? Bạn có thể đăng ký lại bất cứ lúc nào từ trang Learning Paths.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowLeaveConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#151b2c] hover:bg-slate-800 text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={handleLeaveClass}
                disabled={leaving}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(239,68,68,0.4)] transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {leaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
                Xác Nhận Rời Lớp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
