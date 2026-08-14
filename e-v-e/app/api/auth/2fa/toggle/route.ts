import { NextRequest, NextResponse } from "next/server";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { verifyOTP } from "@/lib/twoFactorService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, email, enabled, otp } = body;

    if (!userId || !email || typeof enabled !== "boolean") {
      return NextResponse.json(
        { success: false, error: "Thiếu thông tin người dùng hoặc trạng thái 2FA." },
        { status: 400 }
      );
    }

    // If enabling 2FA, require valid OTP verification
    if (enabled) {
      if (!otp) {
        return NextResponse.json(
          { success: false, error: "Vui lòng nhập mã OTP để xác thực kích hoạt 2FA." },
          { status: 400 }
        );
      }

      const verifyRes = verifyOTP(email, otp, "enable_2fa");
      if (!verifyRes.valid) {
        return NextResponse.json(
          { success: false, error: verifyRes.error || "Mã OTP không chính xác." },
          { status: 400 }
        );
      }
    }

    // Update in Firestore
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        await updateDoc(userRef, {
          two_factor_enabled: enabled,
          twoFactorEnabled: enabled,
          updated_at: new Date().toISOString(),
        });
      }
    } catch (dbErr) {
      console.warn("[2FA Toggle] Firestore update warning:", dbErr);
    }

    return NextResponse.json({
      success: true,
      twoFactorEnabled: enabled,
      message: enabled
        ? "✅ Đã kích hoạt Xác Thực 2 Bước (2FA) thành công!"
        : "⚠️ Đã tắt Xác Thực 2 Bước (2FA).",
    });
  } catch (error: any) {
    console.error("[2FA Toggle API Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi khi cập nhật cấu hình 2FA." },
      { status: 500 }
    );
  }
}
