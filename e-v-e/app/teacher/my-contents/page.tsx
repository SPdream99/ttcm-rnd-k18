"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderKanban,
  BookOpen,
  Layers,
  Gamepad2,
  Clock,
  CheckCircle,
  PlusCircle,
  Trash2,
  Play,
  Inbox,
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { useToast } from "@/components/Toast";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function TeacherMyContentsPage() {
  const { toast } = useToast();
  const { currentUser, profile } = useAuthAdapter();
  const teacherUid = currentUser?.uid || currentUser?.id || profile?.uid || profile?.id || "";
  const teacherEmail = currentUser?.email || profile?.email || "";

  const [activeTab, setActiveTab] = useState<"courses" | "paths" | "games">("courses");
  const [loading, setLoading] = useState(true);

  const [courses, setCourses] = useState<any[]>([]);
  const [paths, setPaths] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);

  const loadOwnContent = async () => {
    if (!teacherUid && !teacherEmail) {
      setCourses([]);
      setPaths([]);
      setGames([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // 1. Courses
      let myCourses: any[] = [];
      try {
        const cSnap = await getDocs(collection(db, "courses"));
        if (!cSnap.empty) {
          cSnap.docs.forEach((d) => {
            const data = d.data();
            const docAuthor =
              data.authorId ||
              data.author_id ||
              data.instructorId ||
              data.instructor_id;
            const docEmail = data.authorEmail || data.email;

            if (
              (teacherUid && docAuthor === teacherUid) ||
              (teacherEmail && docEmail === teacherEmail)
            ) {
              const pairs = Array.isArray(data.contentData)
                ? data.contentData
                : data.contentData?.pairs || data.content_data?.pairs || [];

              myCourses.push({
                id: d.id,
                title: data.title || "Khóa học",
                description: data.description || "",
                pairsCount: pairs.length,
                resourcesCount: data.resources?.length || 0,
                authorId: docAuthor,
                isAccepted: Boolean(data.isAccepted ?? data.is_accepted),
                createdAt: data.createdAt
                  ? new Date(data.createdAt).toLocaleDateString("vi-VN")
                  : "Hôm nay",
              });
            }
          });
        }
      } catch (err) {
        console.warn("Lỗi tải courses:", err);
      }

      // Merge local courses
      try {
        if (typeof window !== "undefined") {
          const localCourses = JSON.parse(
            localStorage.getItem("eve_uploaded_courses") || "[]"
          );
          localCourses.forEach((lc: any) => {
            const lcAuthor =
              lc.authorId || lc.author_id || lc.instructorId || lc.instructor_id;
            if (!lcAuthor || lcAuthor === teacherUid) {
              const pairs = Array.isArray(lc.contentData)
                ? lc.contentData
                : lc.contentData?.pairs || lc.pairs || [];
              const existingIdx = myCourses.findIndex((c) => c.id === lc.id);
              const formatted = {
                id: lc.id,
                title: lc.title || "Khóa học mới",
                description: lc.description || "",
                pairsCount: pairs.length,
                resourcesCount: lc.resources?.length || 0,
                authorId: lcAuthor || teacherUid,
                isAccepted: Boolean(lc.isAccepted ?? lc.is_accepted),
                createdAt: lc.createdAt
                  ? new Date(lc.createdAt).toLocaleDateString("vi-VN")
                  : "Vừa tạo",
              };
              if (existingIdx === -1) {
                myCourses.unshift(formatted);
              } else {
                myCourses[existingIdx] = { ...myCourses[existingIdx], ...formatted };
              }
            }
          });
        }
      } catch {}

      setCourses(myCourses);

      // 2. Paths
      let myPaths: any[] = [];
      try {
        const pSnap = await getDocs(collection(db, "learning_path"));
        if (!pSnap.empty) {
          pSnap.docs.forEach((d) => {
            const data = d.data();
            const docAuthor =
              data.authorId ||
              data.author_id ||
              data.creatorId ||
              data.creator_id;
            const docEmail = data.authorEmail || data.email;

            if (
              (teacherUid && docAuthor === teacherUid) ||
              (teacherEmail && docEmail === teacherEmail)
            ) {
              const courseIds =
                data.courseIds ||
                data.course_ids ||
                data.courses ||
                [];

              myPaths.push({
                id: d.id,
                title: data.title || "Lộ trình học tập",
                description: data.description || "",
                coursesCount: courseIds.length,
                authorId: docAuthor,
                isAccepted: Boolean(data.isAccepted ?? data.is_accepted),
                createdAt: data.createdAt
                  ? new Date(data.createdAt).toLocaleDateString("vi-VN")
                  : "Hôm nay",
              });
            }
          });
        }
      } catch (err) {
        console.warn("Lỗi tải learning paths:", err);
      }

      setPaths(myPaths);

      // 3. Games
      let myGames: any[] = [];
      try {
        const gSnap = await getDocs(collection(db, "game_info"));
        if (!gSnap.empty) {
          gSnap.docs.forEach((d) => {
            const data = d.data();
            const docAuthor =
              data.authorId ||
              data.author_id ||
              data.uploaderId ||
              data.uploader_id;
            const docEmail = data.authorEmail || data.uploaderEmail;

            if (
              (teacherUid && docAuthor === teacherUid) ||
              (teacherEmail && docEmail === teacherEmail)
            ) {
              myGames.push({
                id: d.id,
                gameId: data.gameId || data.id || d.id,
                title: data.title || "Game Mới",
                description: data.description || "Mô tả game",
                needExtraData: Boolean(data.needExtraData ?? data.need_extra_data),
                playsCount: Number(data.playsCount ?? data.plays_count ?? data.playCount ?? data.plays ?? 0),
                authorId: docAuthor,
                authorName:
                  data.authorName ||
                  (Array.isArray(data.authors) ? data.authors.join(", ") : "Tôi"),
                isAccepted: Boolean(data.isAccepted ?? data.is_accepted),
                createdAt: data.createdAt
                  ? new Date(data.createdAt).toLocaleDateString("vi-VN")
                  : "Hôm nay",
              });
            }
          });
        }
      } catch (err) {
        console.warn("Lỗi tải games của giáo viên:", err);
      }

      // Merge local games
      try {
        if (typeof window !== "undefined") {
          const localGames = JSON.parse(
            localStorage.getItem("eve_uploaded_games") || "[]"
          );
          localGames.forEach((lg: any) => {
            const lgAuthor =
              lg.authorId || lg.author_id || lg.uploaderId || lg.uploader_id;
            if (!lgAuthor || lgAuthor === teacherUid) {
              const existingIdx = myGames.findIndex(
                (g) => g.id === lg.id || g.title === lg.title
              );
              const formatted = {
                id: lg.id || lg.gameId,
                gameId: lg.gameId || lg.id,
                title: lg.title || "Game Mới Tải Lên",
                description:
                  lg.description ||
                  "Trò chơi tương tác học tập tích hợp E-V-E Game SDK.",
                needExtraData: Boolean(lg.needExtraData ?? lg.need_extra_data),
                playsCount: Number(lg.playsCount ?? lg.plays_count ?? 0),
                authorId: lgAuthor || teacherUid,
                authorName: lg.authorName || "Tôi",
                isAccepted: Boolean(lg.isAccepted ?? lg.is_accepted),
                createdAt: lg.createdAt
                  ? new Date(lg.createdAt).toLocaleDateString("vi-VN")
                  : "Vừa tải lên",
              };

              if (existingIdx === -1) {
                myGames.unshift(formatted);
              } else {
                myGames[existingIdx] = { ...myGames[existingIdx], ...formatted };
              }
            }
          });
        }
      } catch {}

      setGames(myGames);
    } catch (e) {
      console.warn("loadOwnContent warning:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOwnContent();

    if (typeof window !== "undefined") {
      window.addEventListener("eve_games_updated", loadOwnContent);
      window.addEventListener("storage", loadOwnContent);
      return () => {
        window.removeEventListener("eve_games_updated", loadOwnContent);
        window.removeEventListener("storage", loadOwnContent);
      };
    }
  }, [teacherUid, teacherEmail]);

  const handleDeleteItem = async (
    type: "course" | "path" | "game",
    id: string,
    authorId: string
  ) => {
    if (!confirm("Bạn có chắc chắn muốn xóa nội dung này của mình không?"))
      return;

    try {
      const collectionName =
        type === "course"
          ? "courses"
          : type === "path"
          ? "learning_path"
          : "game_info";
      await deleteDoc(doc(db, collectionName, id));
    } catch {}

    try {
      if (typeof window !== "undefined") {
        if (type === "game") {
          const local = JSON.parse(
            localStorage.getItem("eve_uploaded_games") || "[]"
          );
          const filtered = local.filter(
            (g: any) => g.id !== id && g.gameId !== id
          );
          localStorage.setItem("eve_uploaded_games", JSON.stringify(filtered));
          window.dispatchEvent(new Event("eve_games_updated"));
        } else if (type === "course") {
          const local = JSON.parse(
            localStorage.getItem("eve_uploaded_courses") || "[]"
          );
          const filtered = local.filter((c: any) => c.id !== id);
          localStorage.setItem(
            "eve_uploaded_courses",
            JSON.stringify(filtered)
          );
        }
      }
    } catch {}

    if (type === "course")
      setCourses((prev) => prev.filter((c) => c.id !== id));
    if (type === "path") setPaths((prev) => prev.filter((p) => p.id !== id));
    if (type === "game") setGames((prev) => prev.filter((g) => g.id !== id));

    toast.success("Đã xóa nội dung thành công!", "Quản Lý Học Liệu");
  };

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-zinc-200">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
            <FolderKanban className="w-7 h-7 text-red-600" /> Quản Lý Nội Dung Đã Tạo
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Chỉ hiển thị các Bài học, Lộ trình và Game do chính Thầy/Cô tạo ra và quản lý.
          </p>
        </div>

        <Link href="/teacher/upload-center">
          <button className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 shadow-sm">
            <PlusCircle className="w-4 h-4" /> Tải Lên Thêm Mới
          </button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab("courses")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 border whitespace-nowrap ${
            activeTab === "courses"
              ? "bg-red-600 text-white border-red-600 shadow-sm"
              : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
          }`}
        >
          <BookOpen className="w-4 h-4" /> Bài Học Của Tôi ({courses.length})
        </button>

        <button
          onClick={() => setActiveTab("paths")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 border whitespace-nowrap ${
            activeTab === "paths"
              ? "bg-red-600 text-white border-red-600 shadow-sm"
              : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
          }`}
        >
          <Layers className="w-4 h-4" /> Lộ Trình Của Tôi ({paths.length})
        </button>

        <button
          onClick={() => setActiveTab("games")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 border whitespace-nowrap ${
            activeTab === "games"
              ? "bg-red-600 text-white border-red-600 shadow-sm"
              : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
          }`}
        >
          <Gamepad2 className="w-4 h-4" /> Game Engine Của Tôi ({games.length})
        </button>
      </div>

      {/* TAB 1: COURSES */}
      {activeTab === "courses" && (
        <>
          {courses.length === 0 && !loading ? (
            <div className="p-12 rounded-2xl bg-white border-2 border-dashed border-zinc-200 text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                <Inbox className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-zinc-900">Thầy/Cô chưa có Bài Học nào</h3>
                <p className="text-xs text-zinc-500 max-w-md mx-auto">
                  Hãy soạn bài học đầu tiên với các câu hỏi trắc nghiệm để học sinh thực hành qua trò chơi.
                </p>
              </div>
              <Link href="/teacher/upload-center">
                <button className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-2 cursor-pointer shadow-sm">
                  <PlusCircle className="w-4 h-4" /> Soạn Bài Học Mới
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="p-6 rounded-2xl bg-white border border-zinc-200 hover:border-red-600 transition-colors flex flex-col justify-between space-y-4 shadow-sm"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          course.isAccepted
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                        }`}
                      >
                        {course.isAccepted ? (
                          <CheckCircle className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        {course.isAccepted ? "Đã Phê Duyệt" : "Chờ Admin Duyệt"}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {course.createdAt}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-zinc-900">{course.title}</h3>
                    <p className="text-xs text-zinc-500 line-clamp-2">
                      {course.description || "Không có mô tả chi tiết."}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-600 font-medium">
                    <span className="text-red-600 font-bold">
                      {course.pairsCount} Cặp Câu Hỏi
                    </span>

                    <button
                      onClick={() =>
                        handleDeleteItem("course", course.id, course.authorId)
                      }
                      className="text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer p-1 rounded hover:bg-red-50 font-bold"
                    >
                      <Trash2 className="w-4 h-4" /> Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* TAB 2: PATHS */}
      {activeTab === "paths" && (
        <>
          {paths.length === 0 && !loading ? (
            <div className="p-12 rounded-2xl bg-white border-2 border-dashed border-zinc-200 text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                <Layers className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-zinc-900">Thầy/Cô chưa tạo Lộ Trình nào</h3>
                <p className="text-xs text-zinc-500 max-w-md mx-auto">
                  Hãy kết hợp các bài học đã tạo thành một lộ trình học tập toàn diện cho học sinh.
                </p>
              </div>
              <Link href="/teacher/upload-center">
                <button className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-2 cursor-pointer shadow-sm">
                  <PlusCircle className="w-4 h-4" /> Tạo Lộ Trình Mới
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paths.map((path) => (
                <div
                  key={path.id}
                  className="p-6 rounded-2xl bg-white border border-zinc-200 hover:border-red-600 transition-colors flex flex-col justify-between space-y-4 shadow-sm"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          path.isAccepted
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                        }`}
                      >
                        {path.isAccepted ? (
                          <CheckCircle className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        {path.isAccepted ? "Đã Phê Duyệt" : "Chờ Admin Duyệt"}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {path.createdAt}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-zinc-900">{path.title}</h3>
                    <p className="text-xs text-zinc-500 line-clamp-2">
                      {path.description || "Không có mô tả chi tiết."}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-600 font-medium">
                    <span className="text-red-600 font-bold">
                      {path.coursesCount} Khóa Học Trong Lộ Trình
                    </span>

                    <button
                      onClick={() =>
                        handleDeleteItem("path", path.id, path.authorId)
                      }
                      className="text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer p-1 rounded hover:bg-red-50 font-bold"
                    >
                      <Trash2 className="w-4 h-4" /> Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* TAB 3: GAMES */}
      {activeTab === "games" && (
        <>
          {games.length === 0 && !loading ? (
            <div className="p-12 rounded-2xl bg-white border-2 border-dashed border-zinc-200 text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                <Gamepad2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-zinc-900">Thầy/Cô chưa tải lên Game nào</h3>
                <p className="text-xs text-zinc-500 max-w-md mx-auto">
                  Tải lên gói game nén (.zip) theo chuẩn E-V-E SDK để tích hợp đề bài và bảng xếp hạng.
                </p>
              </div>
              <Link href="/teacher/upload-center">
                <button className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-2 cursor-pointer shadow-sm">
                  <PlusCircle className="w-4 h-4" /> Tải Lên Game (.zip)
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {games.map((game, idx) => (
                <div
                  key={`${game.id || game.gameId || idx}_${idx}`}
                  className="p-6 rounded-2xl bg-white border border-zinc-200 hover:border-red-600 transition-colors flex flex-col justify-between space-y-4 shadow-sm"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          game.isAccepted
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                        }`}
                      >
                        {game.isAccepted ? (
                          <CheckCircle className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        {game.isAccepted ? "ĐÃ PHÊ DUYỆT " : "CHỜ ADMIN DUYỆT "}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {game.createdAt}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-zinc-900">{game.title}</h3>
                    <p className="text-xs text-zinc-500 line-clamp-2">
                      {game.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-600">
                    <span className="text-red-600 font-bold">
                      {game.playsCount} Lượt Học Sinh Chơi
                    </span>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/student/play/${game.id}/${courses[0]?.id || "crs_coding_basics"}`}
                      >
                        <span className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-red-50 text-zinc-800 hover:text-red-700 text-xs font-bold border border-zinc-200 cursor-pointer transition-colors flex items-center gap-1">
                          <Play className="w-3 h-3" /> Chơi thử
                        </span>
                      </Link>

                      <button
                        onClick={() =>
                          handleDeleteItem("game", game.id, game.authorId)
                        }
                        className="text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer p-1 rounded hover:bg-red-50 font-bold"
                      >
                        <Trash2 className="w-4 h-4" /> Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
