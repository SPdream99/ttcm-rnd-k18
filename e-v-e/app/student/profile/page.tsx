"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  UserCheck,
  Coins,
  ShieldCheck,
  Award,
  Palette,
  CheckCircle2,
  BookOpen,
  Trophy,
  Key,
  Eye,
  EyeOff,
  Trash2,
  ExternalLink,
  RefreshCw,
  X,
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import {
  saveEncryptedAIKey,
  getDecryptedAIKey,
  removeAIKey,
  hasAIKey,
  getMaskedAIKey,
} from "@/lib/secureKeyStorage";

import { collection, getDocs, query, where, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useToast } from "@/components/Toast";
import { cacheService } from "@/lib/cacheService";

export default function StudentProfilePage() {
  const { toast } = useToast();
  const { currentUser, profile } = useAuthAdapter();
  const displayName = currentUser?.name || profile?.fullName || "Học Viên";
  const displayEmail = currentUser?.email || "student@eve.edu.vn";
  const displayCoins = currentUser?.coins ?? profile?.coins ?? 250;
  const userUid = currentUser?.uid || profile?.uid || "usr_student";

  const [activeFrame, setActiveFrame] = useState("frame_default");
  const [activeBadge, setActiveBadge] = useState("badge_default");
  const [userDecorations, setUserDecorations] = useState<string[]>([]);

  // Courses Progress State
  const [activeCoursesList, setActiveCoursesList] = useState<any[]>([]);
  const [completedCoursesList, setCompletedCoursesList] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  // AI Key state
  const [keyInput, setKeyInput] = useState("");
  const [showRawKey, setShowRawKey] = useState(false);
  const [isKeyConfigured, setIsKeyConfigured] = useState(false);
  const [maskedKeyDisplay, setMaskedKeyDisplay] = useState("");

  // ── 2FA Security State ──
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [isSending2FA, setIsSending2FA] = useState(false);
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [demoOtpHint, setDemoOtpHint] = useState<string | null>(null);

  useEffect(() => {
    const configured = hasAIKey();
    setIsKeyConfigured(configured);
    if (configured) {
      setMaskedKeyDisplay(getMaskedAIKey());
    }

    if (currentUser?.twoFactorEnabled !== undefined) {
      setIs2FAEnabled(currentUser.twoFactorEnabled !== false);
    }

    // Fetch user decorations & courses progress from database
    async function loadUserData() {
      try {
        setLoadingCourses(true);
        const user = auth.currentUser;
        if (user) {
          // 1. Fetch user profile data from Firestore
          const uSnap = await getDoc(doc(db, "users", user.uid));
          if (uSnap.exists()) {
            const uData = uSnap.data();
            const decs: string[] =
              uData.profile_decorations ||
              uData.profileDecorations ||
              uData.inventory ||
              [];
            setUserDecorations(decs);
            if (uData.equippedFrame) {
              setActiveFrame(uData.equippedFrame);
            }
            if (uData.equippedBadge) {
              setActiveBadge(uData.equippedBadge);
            }
          }

          // 2. Fetch enrollments
          const enrollSnap = await getDocs(
            query(collection(db, "student_learning_path"), where("student_id", "==", user.uid))
          );

          const inProg: any[] = [];
          const done: any[] = [];

          for (const d of enrollSnap.docs) {
            const eData = d.data();
            if (eData.status === "paused") {
              continue;
            }
            const pDoc = await getDoc(doc(db, "learning_path", eData.learning_path_id));
            if (pDoc.exists()) {
              const pData = pDoc.data();
              const item = {
                id: pDoc.id,
                title: pData.title || "Khóa học",
                progress: Number(eData.progress) || 0,
                category: pData.category || "General",
                teacherName: pData.authorName || pData.teacherName || "Giáo viên",
              };
              if (item.progress >= 100) {
                done.push(item);
              } else {
                inProg.push(item);
              }
            }
          }
          setActiveCoursesList(inProg);
          setCompletedCoursesList(done);
        }
      } catch (err) {
        console.error("Error loading profile data:", err);
      } finally {
        setLoadingCourses(false);
      }
    }

    loadUserData();
  }, [currentUser]);

  // Toàn bộ danh mục Khung Avatar & Huy hiệu trong hệ thống
  const ALL_AVATAR_FRAMES = [
    { id: "frame_default", name: "Khung Mặc Định", ringClass: "ring-2 ring-zinc-300 shadow-xs", isDefault: true },
    { id: "frame_supernova_gold", name: "Khung Avatar Đỏ Danh Dự", ringClass: "ring-4 ring-red-600 shadow-sm" },
    { id: "frame_quantum_neon", name: "Khung Avatar Đen Sang Trọng", ringClass: "ring-4 ring-zinc-900 shadow-sm" },
  ];

  const ALL_BADGES = [
    { id: "badge_default", name: "Học Viên E-V-E", isDefault: true },
    { id: "badge_cosmic_legend", name: "Huy Hiệu Thủ Khoa Xuất Sắc" },
    { id: "badge_flame_streak", name: "Huy Hiệu Chuyên Cần & Bứt Phá" },
  ];

  // Chỉ hiển thị các khung và huy hiệu mà người dùng ĐÃ SỞ HỮU (hoặc mặc định)
  const ownedFrames = ALL_AVATAR_FRAMES.filter(
    (f) => f.isDefault || userDecorations.includes(f.id)
  );

  const ownedBadges = ALL_BADGES.filter(
    (b) => b.isDefault || userDecorations.includes(b.id)
  );

  const handleSaveAIKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim()) return;

    saveEncryptedAIKey(keyInput.trim());
    setIsKeyConfigured(true);
    setMaskedKeyDisplay(getMaskedAIKey());
    setKeyInput("");
    toast.success("Khóa API đã được mã hóa an toàn và lưu vào bộ nhớ trình duyệt.", "API Key");
  };

  const handleRemoveAIKey = () => {
    removeAIKey();
    setIsKeyConfigured(false);
    setMaskedKeyDisplay("");
    toast.info("Đã xóa khóa API.", "API Key");
  };

  const handleSaveEquipment = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, "users", user.uid), {
          equippedFrame: activeFrame,
          equippedBadge: activeBadge,
        });
      }
      toast.success("Đã lưu thiết lập danh hiệu & khung trang trí thành công!", "Trang Bị");
    } catch (err) {
      console.error("Lỗi khi lưu trang bị:", err);
      toast.error("Không thể lưu thiết lập. Vui lòng thử lại!", "Trang Bị");
    }
  };

  // 2FA Handlers
  const handleInitiate2FAToggle = async () => {
    if (is2FAEnabled) {
      setIsSending2FA(true);
      try {
        const res = await fetch("/api/auth/2fa/toggle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userUid,
            email: displayEmail,
            enabled: false,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setIs2FAEnabled(false);
          toast.info("Đã tắt Xác Thực 2 Bước (2FA).", "Bảo Mật");
        }
      } catch {
        toast.error("Lỗi khi tắt 2FA.", "Bảo Mật");
      } finally {
        setIsSending2FA(false);
      }
    } else {
      setIsSending2FA(true);
      setShow2FAModal(true);
      setModalMsg("Đang gửi mã xác thực tới email của bạn...");
      setOtpInput("");
      setDemoOtpHint(null);

      try {
        const res = await fetch("/api/auth/2fa/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: displayEmail,
            recipientName: displayName,
            purpose: "enable_2fa",
          }),
        });
        const data = await res.json();
        if (data.success) {
          setModalMsg(`Mã OTP 6 số đã được gửi tới email ${data.maskedEmail || displayEmail}.`);
          if (data.isDemo && data.demoOtp) {
            setDemoOtpHint(data.demoOtp);
          }
        } else {
          setModalMsg(data.error || "Không thể gửi mã OTP.");
        }
      } catch {
        setModalMsg("Lỗi kết nối máy chủ.");
      } finally {
        setIsSending2FA(false);
      }
    }
  };

  const handleConfirmEnable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.trim().length !== 6) {
      setModalMsg("Vui lòng nhập đầy đủ 6 chữ số mã OTP.");
      return;
    }

    setIsVerifying2FA(true);
    setModalMsg("");

    try {
      const res = await fetch("/api/auth/2fa/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userUid,
          email: displayEmail,
          enabled: true,
          otp: otpInput.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIs2FAEnabled(true);
        setShow2FAModal(false);
        toast.success("Đã kích hoạt Bảo Mật 2 Lớp (2FA qua Email) thành công!", "Bảo Mật");
      } else {
        setModalMsg(data.error || "Mã OTP không chính xác.");
      }
    } catch {
      setModalMsg("Lỗi kết nối máy chủ.");
    } finally {
      setIsVerifying2FA(false);
    }
  };

  const selectedFrame = ownedFrames.find((f) => f.id === activeFrame) || ownedFrames[0];

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
            <UserCheck className="w-7 h-7 text-red-600" /> Hồ Sơ & Bảo Mật Cá Nhân
          </h1>
          <p className="text-sm text-zinc-600 mt-1">
            Quản lý tài khoản, danh hiệu, bảo mật 2 lớp 2FA và mã hóa API Key.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center gap-2">
          <Coins className="w-4 h-4 text-red-600" />
          <span className="font-mono font-bold text-sm text-red-600">{displayCoins} Coins</span>
        </div>
      </div>

      {/* Profile Overview Card (Solid Red & White) */}
      <div className="p-6 md:p-8 rounded-2xl bg-white border-2 border-red-600 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className={`w-24 h-24 rounded-full bg-red-50 p-1 flex items-center justify-center ${selectedFrame.ringClass}`}>
          <div className="w-full h-full rounded-full bg-red-600 flex items-center justify-center text-3xl font-black text-white font-mono">
            {displayName.charAt(0)}
          </div>
        </div>

        <div className="text-center md:text-left space-y-2 flex-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h2 className="text-xl md:text-2xl font-black text-zinc-900">{displayName}</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold">
              {ownedBadges.find((b) => b.id === activeBadge)?.name}
            </span>
          </div>

          <p className="text-xs text-zinc-500">{displayEmail} • Học viên chính thức</p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs font-bold text-zinc-700">
            <span><BookOpen className="w-3.5 h-3.5 inline mr-1 text-red-600" /> {activeCoursesList.length + completedCoursesList.length} Khóa Học</span>
            <span><Trophy className="w-3.5 h-3.5 inline mr-1 text-red-600" /> 1,280 Điểm</span>
            <span><Coins className="w-3.5 h-3.5 inline mr-1 text-red-600" /> {displayCoins} Coins</span>
          </div>
        </div>
      </div>

      {/* ── TIẾN ĐỘ KHÓA HỌC: ĐANG HỌC & ĐÃ HOÀN THÀNH ── */}
      <div className="p-6 md:p-8 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-red-600" /> Tiến Độ Các Khóa Học Của Tôi
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Danh sách chi tiết các môn học đang theo dõi và đã hoàn thành chứng chỉ.
            </p>
          </div>
        </div>

        {/* 1. Môn Đang Học (In-Progress) */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600" /> Đang Học ({activeCoursesList.length})
          </h4>

          {activeCoursesList.length === 0 ? (
            <p className="text-xs text-zinc-500 italic p-4 rounded-xl bg-zinc-50 border border-zinc-200">Không có khóa học nào đang diễn ra.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeCoursesList.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-red-600 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                        {c.category}
                      </span>
                      <span className="text-xs font-mono font-bold text-red-600">{c.progress}%</span>
                    </div>
                    <h5 className="font-bold text-zinc-900 text-xs md:text-sm">{c.title}</h5>
                    <p className="text-[11px] text-zinc-500">Giảng viên: {c.teacherName}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                      <div className="h-full bg-red-600 rounded-full" style={{ width: `${c.progress}%` }} />
                    </div>
                    <Link
                      href={`/student/classes/${c.id}`}
                      className="w-full py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold text-center block transition-colors"
                    >
                      Tiếp Tục Học
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. Môn Đã Hoàn Thành (Completed) */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Đã Hoàn Thành ({completedCoursesList.length})
          </h4>

          {completedCoursesList.length === 0 ? (
            <p className="text-xs text-zinc-500 italic p-4 rounded-xl bg-zinc-50 border border-zinc-200">Chưa có khóa học nào đạt 100% hoàn thành.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedCoursesList.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl bg-zinc-50 border border-emerald-200 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {c.category}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-600">100% </span>
                    </div>
                    <h5 className="font-bold text-zinc-900 text-xs md:text-sm">{c.title}</h5>
                    <p className="text-[11px] text-zinc-500">Giảng viên: {c.teacherName}</p>
                  </div>

                  <Link
                    href={`/student/classes/${c.id}`}
                    className="w-full py-1.5 rounded-lg bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-xs font-bold text-center block transition-colors"
                  >
                    Xem Lại Lộ Trình
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── CARD BẢO MẬT 2 LỚP (2FA QUA EMAIL) ── */}
      <div className="p-6 md:p-8 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-red-600" /> Xác Thực 2 Bước (2FA Qua Email)
            </h3>
            <p className="text-xs text-zinc-600">
              Bảo vệ tài khoản: Mỗi khi đăng nhập từ thiết bị mới, hệ thống sẽ gửi mã OTP 6 số vào email <strong className="text-zinc-900">{displayEmail}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                is2FAEnabled
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-zinc-100 text-zinc-600 border border-zinc-200"
              }`}
            >
              {is2FAEnabled ? "2FA ĐANG BẬT" : "2FA ĐANG TẮT"}
            </span>

            <button
              type="button"
              disabled={isSending2FA || isVerifying2FA}
              onClick={handleInitiate2FAToggle}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
                is2FAEnabled
                  ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              {isSending2FA || isVerifying2FA ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : is2FAEnabled ? (
                "Tắt 2FA"
              ) : (
                "Bật 2FA Ngay"
              )}
            </button>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-zinc-700">
          <div>
            <span className="text-zinc-500 block mb-1">Phương thức:</span>
            <strong className="text-zinc-900">Email OTP (6 Chữ Số)</strong>
          </div>
          <div>
            <span className="text-zinc-500 block mb-1">Hộp thư nhận OTP:</span>
            <strong className="text-red-600">{displayEmail}</strong>
          </div>
          <div>
            <span className="text-zinc-500 block mb-1">Thời hạn mã:</span>
            <strong className="text-zinc-900">5 Phút / Lần gửi</strong>
          </div>
        </div>
      </div>

      {/* ── 2FA ACTIVATION MODAL ── */}
      {show2FAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white border-2 border-red-600 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-5 text-center relative">
            <button
              onClick={() => setShow2FAModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-xl font-bold">
              
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-zinc-900">Xác Nhận Bật 2FA Email</h3>
              <p className="text-xs text-zinc-600">
                Nhập mã OTP 6 số được gửi tới <strong className="text-zinc-900">{displayEmail}</strong> để xác nhận.
              </p>
            </div>

            {demoOtpHint && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center justify-between">
                <span>Mã OTP: <strong>{demoOtpHint}</strong></span>
                <button
                  type="button"
                  onClick={() => setOtpInput(demoOtpHint)}
                  className="px-2 py-0.5 rounded bg-red-200 text-[10px] font-bold"
                >
                  Điền nhanh 
                </button>
              </div>
            )}

            <form onSubmit={handleConfirmEnable2FA} className="space-y-4">
              <input
                type="text"
                maxLength={6}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                placeholder="••••••"
                className="w-full text-center font-mono text-2xl tracking-[8px] bg-zinc-50 border-2 border-zinc-300 focus:border-red-600 rounded-xl py-3 text-zinc-900 focus:outline-none"
                required
                autoFocus
              />

              {modalMsg && (
                <div className="text-xs font-bold text-red-600">{modalMsg}</div>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShow2FAModal(false)}
                  className="flex-1 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isVerifying2FA || otpInput.length !== 6}
                  className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isVerifying2FA ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Xác Nhận Kích Hoạt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CARD QUẢN LÝ MÃ HÓA AI KEY ── */}
      <div className="p-6 md:p-8 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-200">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <Key className="w-5 h-5 text-red-600" /> Khóa Trí Tuệ Nhân Tạo (Gemini API Key)
            </h3>
            <p className="text-xs text-zinc-600 mt-1">
              Khóa API của bạn được <strong className="text-zinc-900">mã hóa an toàn trên trình duyệt</strong>.
            </p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
              isKeyConfigured
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-zinc-100 text-zinc-600 border border-zinc-200"
            }`}
          >
            {isKeyConfigured ? "Đã Kích Hoạt Key" : "Chưa Cấu Hình Key"}
          </span>
        </div>

        {/* Device-only Storage Notice */}
        <div className="p-3.5 rounded-xl bg-red-50/70 border border-red-200 text-xs text-zinc-700 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-red-700">Lưu ý bảo mật thiết bị:</strong> Khóa API Key của bạn được <strong>mã hóa an toàn và chỉ lưu trữ cục bộ trên thiết bị/trình duyệt này</strong> (Local Storage). Hệ thống <strong>hoàn toàn không lưu trữ hay truyền tải API Key</strong> lên bất kỳ máy chủ nào. Bạn có toàn quyền xóa khóa bất kỳ lúc nào.
          </div>
        </div>

        {isKeyConfigured ? (
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] text-zinc-500 block">Khóa API hiện tại:</span>
              <span className="font-mono text-sm text-zinc-900 tracking-wider font-bold">{maskedKeyDisplay}</span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/student/ai-tutor"
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <span>Dùng Thử AI Tutor</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={handleRemoveAIKey}
                className="px-3.5 py-2 rounded-xl bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                title="Xóa khóa API khỏi máy"
              >
                <Trash2 className="w-3.5 h-3.5" /> Xóa
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveAIKey} className="space-y-4">
            <div className="relative">
              <label className="block text-xs text-zinc-700 font-bold mb-1.5">
                Nhập Google Gemini API Key:
              </label>
              <div className="relative flex items-center">
                <input
                  type={showRawKey ? "text" : "password"}
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="Dán mã API Key của bạn (VD: AIzaSy...)"
                  className="w-full bg-zinc-50 border border-zinc-300 focus:border-red-600 rounded-xl px-4 py-3 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowRawKey(!showRawKey)}
                  className="absolute right-3 text-zinc-400 hover:text-zinc-800"
                >
                  {showRawKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-center justify-between mt-1.5 text-[11px] text-zinc-500">
                <span>Khóa được mã hóa an toàn trước khi lưu.</span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-red-600 hover:underline flex items-center gap-1 font-bold"
                >
                  Lấy Key tại Google AI Studio <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={!keyInput.trim()}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              <Key className="w-3.5 h-3.5" /> Mã Hóa & Lưu Khóa API
            </button>
          </form>
        )}
      </div>

      {/* Customization Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Frame Selection */}
        <div className="p-6 rounded-2xl bg-white border border-zinc-200 space-y-4 shadow-sm">
          <h3 className="font-bold text-base text-zinc-900 flex items-center gap-2">
            <Palette className="w-5 h-5 text-red-600" /> Chọn Khung Avatar Đã Sở Hữu
          </h3>

          <div className="space-y-2.5">
            {ownedFrames.map((frame) => (
              <label
                key={frame.id}
                onClick={() => setActiveFrame(frame.id)}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  activeFrame === frame.id
                    ? "bg-red-50 border-red-600 text-zinc-900 font-bold"
                    : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-xs ${frame.ringClass}`}>
                    
                  </div>
                  <span className="text-xs font-bold text-zinc-900">{frame.name}</span>
                </div>
                {activeFrame === frame.id && <CheckCircle2 className="w-4 h-4 text-red-600" />}
              </label>
            ))}

            {ownedFrames.length <= 1 && (
              <div className="p-3 rounded-xl bg-zinc-50 border border-dashed border-zinc-300 text-center space-y-1.5 mt-2">
                <p className="text-[11px] text-zinc-500">Chưa mua khung avatar nào từ Cửa Hàng.</p>
                <Link href="/student/shop" className="text-xs text-red-600 font-bold hover:underline block">
                  Đổi Khung Avatar Mới Tại Shop →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Badge Selection */}
        <div className="p-6 rounded-2xl bg-white border border-zinc-200 space-y-4 shadow-sm">
          <h3 className="font-bold text-base text-zinc-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-red-600" /> Chọn Huy Hiệu Hiển Thị
          </h3>

          <div className="space-y-2.5">
            {ownedBadges.map((b) => (
              <label
                key={b.id}
                onClick={() => setActiveBadge(b.id)}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  activeBadge === b.id
                    ? "bg-red-50 border-red-600 text-zinc-900 font-bold"
                    : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-300"
                }`}
              >
                <span className="text-xs font-bold text-zinc-900">{b.name}</span>
                {activeBadge === b.id && <CheckCircle2 className="w-4 h-4 text-red-600" />}
              </label>
            ))}

            {ownedBadges.length <= 1 && (
              <div className="p-3 rounded-xl bg-zinc-50 border border-dashed border-zinc-300 text-center space-y-1.5 mt-2">
                <p className="text-[11px] text-zinc-500">Chưa mua huy hiệu nào từ Cửa Hàng.</p>
                <Link href="/student/shop" className="text-xs text-red-600 font-bold hover:underline block">
                  Đổi Huy Hiệu Danh Giá Tại Shop →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cache & System Storage Section */}
      <div className="p-6 rounded-2xl bg-white border border-zinc-200 space-y-3 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-zinc-900 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-red-600" /> Quản Lý Bộ Nhớ Đệm (Cache)
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              Xóa sạch dữ liệu cache lưu tạm trong trình duyệt để tải mới toàn bộ nội dung từ máy chủ khi gặp lỗi hiển thị.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              cacheService.clearFullAppCache(true);
              toast.success("Đã dọn dẹp bộ nhớ đệm cache và làm mới dữ liệu thành công!", "Xóa Cache");
            }}
            className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-red-50 text-zinc-700 hover:text-red-700 border border-zinc-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4 text-red-600" /> Xóa Cache Ngay
          </button>
        </div>
      </div>

      <button
        onClick={handleSaveEquipment}
        className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
      >
        <CheckCircle2 className="w-4 h-4" /> Lưu Thiết Lập Trang Bị
      </button>
    </div>
  );
}
