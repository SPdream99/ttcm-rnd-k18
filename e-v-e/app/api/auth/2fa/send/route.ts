import { NextRequest, NextResponse } from "next/server";
import { createAndStoreOTP } from "@/lib/twoFactorService";
import { send2FAEmail } from "@/lib/emailService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, recipientName, purpose = "login" } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Địa chỉ email không hợp lệ." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Generate and store OTP (5 min validity)
    const { code, expiresIn } = createAndStoreOTP(
      normalizedEmail,
      purpose as "login" | "enable_2fa" | "disable_2fa",
      300
    );

    // Send email
    const emailResult = await send2FAEmail({
      toEmail: normalizedEmail,
      recipientName: recipientName || "Thành viên E-V-E",
      otpCode: code,
      purpose: purpose as any,
    });

    const maskedEmail = normalizedEmail.replace(
      /^(.)(.*)(@.*)$/,
      (_, a, b, c) => `${a}${"*".repeat(Math.min(b.length, 5))}${c}`
    );

    return NextResponse.json({
      success: true,
      message: `Mã xác thực OTP đã được gửi đến email ${maskedEmail}.`,
      expiresIn,
      maskedEmail,
      isDemo: emailResult.isDemoFallback,
      demoOtp: emailResult.isDemoFallback ? code : undefined,
    });
  } catch (error: any) {
    console.error("[2FA Send API Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi máy chủ khi gửi mã 2FA." },
      { status: 500 }
    );
  }
}
