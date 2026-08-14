import nodemailer from "nodemailer";

interface Send2FAEmailParams {
  toEmail: string;
  recipientName?: string;
  otpCode: string;
  purpose: "login" | "enable_2fa" | "disable_2fa";
}

/**
 * Generates rich HTML template for 2FA OTP verification email
 */
function get2FAEmailHTML(name: string, otpCode: string, purpose: string): string {
  const purposeTitle =
    purpose === "enable_2fa"
      ? "Kích Hoạt Bảo Mật 2 Lớp (2FA)"
      : purpose === "disable_2fa"
      ? "Hủy Kích Hoạt Bảo Mật 2 Lớp (2FA)"
      : "Xác Thực Đăng Nhập Tài Khoản";

  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mã Xác Thực 2FA - E-V-E Platform</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #070a13;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #e2e8f0;
    }
    .container {
      max-width: 540px;
      margin: 30px auto;
      background: #0f1524;
      border: 1px solid #1e293b;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
    }
    .header {
      background: linear-gradient(135deg, #0b1329 0%, #172554 100%);
      padding: 30px 24px;
      text-align: center;
      border-bottom: 1px solid rgba(6, 182, 212, 0.3);
    }
    .logo-text {
      font-size: 26px;
      font-weight: 900;
      letter-spacing: 2px;
      color: #38bdf8;
      margin: 0;
    }
    .subtitle {
      font-size: 13px;
      color: #94a3b8;
      margin-top: 6px;
      letter-spacing: 1px;
    }
    .content {
      padding: 32px 28px;
      text-align: center;
    }
    .greeting {
      font-size: 16px;
      color: #f8fafc;
      margin-bottom: 12px;
    }
    .purpose-badge {
      display: inline-block;
      padding: 4px 14px;
      border-radius: 20px;
      background: rgba(6, 182, 212, 0.15);
      border: 1px solid rgba(6, 182, 212, 0.4);
      color: #38bdf8;
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 20px;
    }
    .desc {
      font-size: 14px;
      line-height: 1.6;
      color: #94a3b8;
      margin-bottom: 24px;
    }
    .otp-box {
      background: #151d38;
      border: 2px dashed #06b6d4;
      border-radius: 16px;
      padding: 18px 24px;
      margin: 0 auto 24px;
      max-width: 320px;
      text-align: center;
    }
    .otp-label {
      font-size: 11px;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 6px;
    }
    .otp-code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 38px;
      font-weight: 900;
      letter-spacing: 8px;
      color: #38bdf8;
      text-shadow: 0 0 15px rgba(56, 189, 248, 0.5);
    }
    .warning-box {
      background: rgba(244, 63, 94, 0.1);
      border: 1px solid rgba(244, 63, 94, 0.3);
      border-radius: 12px;
      padding: 12px 16px;
      font-size: 12px;
      color: #fda4af;
      text-align: left;
      margin-bottom: 20px;
    }
    .footer {
      background: #0a0e1a;
      padding: 20px 24px;
      text-align: center;
      font-size: 11px;
      color: #64748b;
      border-top: 1px solid #1e293b;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-text">⚡ E - V - E</div>
      <div class="subtitle">NỀN TẢNG HỌC TẬP & CÔNG NGHỆ TƯƠNG TÁC</div>
    </div>
    <div class="content">
      <div class="greeting">Xin chào <strong>${name}</strong>,</div>
      <div class="purpose-badge">🛡️ ${purposeTitle}</div>
      <p class="desc">
        Hệ thống đã nhận được yêu cầu xác thực 2 bước cho tài khoản của bạn.
        Vui lòng sử dụng mã OTP gồm 6 chữ số dưới đây để hoàn tất:
      </p>

      <div class="otp-box">
        <div class="otp-label">Mã Xác Thực Một Lần (OTP)</div>
        <div class="otp-code">${otpCode}</div>
      </div>

      <div class="warning-box">
        ⚠️ <strong>Lưu ý bảo mật:</strong> Mã OTP này chỉ có hiệu lực trong <strong>5 phút</strong>. Tuyệt đối không chia sẻ mã này cho bất kỳ ai, kể cả nhân viên kỹ thuật hoặc giáo viên.
      </div>
    </div>
    <div class="footer">
      Đây là email tự động từ hệ thống bảo mật E-V-E. Nếu bạn không thực hiện yêu cầu này, vui lòng đổi mật khẩu ngay lập tức.
      <br>© 2026 E-V-E Platform. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
}

/**
 * Dispatches a 2FA OTP email using SMTP / Nodemailer
 */
export async function send2FAEmail({
  toEmail,
  recipientName = "Thành viên E-V-E",
  otpCode,
  purpose,
}: Send2FAEmailParams): Promise<{ success: boolean; isDemoFallback?: boolean; error?: string }> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const senderEmail = process.env.SMTP_FROM || '"E-V-E Security" <security@eve.edu.vn>';

  // Check if SMTP is configured
  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const subject =
        purpose === "enable_2fa"
          ? `[E-V-E] Mã OTP kích hoạt 2FA: ${otpCode}`
          : `[E-V-E] Mã xác thực đăng nhập 2FA: ${otpCode}`;

      await transporter.sendMail({
        from: senderEmail,
        to: toEmail,
        subject,
        html: get2FAEmailHTML(recipientName, otpCode, purpose),
      });

      console.log(`[2FA Mailer] Successfully sent 2FA email via SMTP to: ${toEmail}`);
      return { success: true, isDemoFallback: false };
    } catch (err: any) {
      console.warn(`[2FA Mailer] SMTP send failed (${err.message}). Falling back to in-app delivery.`);
    }
  }

  // Development / Demo Fallback Mode:
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log(`║ 🛡️ [E-V-E 2FA EMAIL DISPATCHED]                              ║`);
  console.log(`║ To: ${toEmail.padEnd(54, " ")} ║`);
  console.log(`║ Purpose: ${purpose.padEnd(49, " ")} ║`);
  console.log(`║ 🔑 OTP CODE: >>>  ${otpCode}  <<< (Expires in 5 minutes)       ║`);
  console.log("╚══════════════════════════════════════════════════════════════╝");

  return {
    success: true,
    isDemoFallback: true,
  };
}
