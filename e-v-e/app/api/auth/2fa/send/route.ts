import { NextRequest, NextResponse } from "next/server";
import { createAndStoreOTP } from "@/lib/twoFactorService";
import { send2FAEmail } from "@/lib/emailService";
import { adminAuth, adminDb } from "@/infrastructure/firebase/firebaseAdmin";

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

    // If purpose is registration: verify if user already exists in Firebase Auth
    // and cleanup any orphan/duplicate documents in Firestore 'users' collection
    if (purpose === "register") {
      try {
        let authUser = null;
        try {
          authUser = await adminAuth.getUserByEmail(normalizedEmail);
        } catch (authErr: any) {
          // auth/user-not-found means the user does not exist in Firebase Auth yet (which is good for register)
          if (authErr.code !== "auth/user-not-found") {
            console.warn("[2FA Send] Check Auth user error:", authErr.message);
          }
        }

        if (authUser) {
          return NextResponse.json(
            {
              success: false,
              error: "Email này đã được sử dụng bởi một tài khoản khác. Vui lòng đăng nhập.",
            },
            { status: 400 }
          );
        }

        // If user does not exist in Auth, check if any orphan docs exist in Firestore 'users' collection with this email
        // and delete them all so that no duplicate or orphan documents remain
        try {
          const snapshot = await adminDb
            .collection("users")
            .where("email", "==", normalizedEmail)
            .get();

          if (!snapshot.empty) {
            console.log(
              `[2FA Send Register] Found ${snapshot.size} orphan user doc(s) in Firestore for ${normalizedEmail}. Cleaning up...`
            );
            const deletePromises = snapshot.docs.map((doc) => doc.ref.delete());
            await Promise.all(deletePromises);
            console.log(`[2FA Send Register] Orphan user doc(s) deleted successfully.`);
          }
        } catch (dbErr: any) {
          console.warn("[2FA Send] Orphan cleanup query error:", dbErr.message);
        }
      } catch (checkErr: any) {
        console.warn("[2FA Send] Pre-register check warning:", checkErr.message);
      }
    }

    // Generate and store OTP (5 min validity)
    const { code, expiresIn } = createAndStoreOTP(
      normalizedEmail,
      purpose as "login" | "enable_2fa" | "disable_2fa" | "register",
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
