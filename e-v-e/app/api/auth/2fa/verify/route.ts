import { NextRequest, NextResponse } from "next/server";
import { verifyOTP } from "@/lib/twoFactorService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp, purpose } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: "Vui lòng cung cấp đầy đủ email và mã OTP." },
        { status: 400 }
      );
    }

    const verification = verifyOTP(email, otp, purpose);

    if (!verification.valid) {
      return NextResponse.json(
        { success: false, error: verification.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      verified: true,
      message: "Xác thực 2FA thành công!",
    });
  } catch (error: any) {
    console.error("[2FA Verify API Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi máy chủ khi xác thực mã 2FA." },
      { status: 500 }
    );
  }
}
