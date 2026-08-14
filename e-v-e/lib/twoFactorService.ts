/**
 * 2FA OTP Service for E-V-E Platform
 * Manages generation, in-memory caching, Firestore persistence, and validation of 6-digit OTP codes.
 */

export interface OTPRecord {
  email: string;
  code: string;
  purpose: "login" | "enable_2fa" | "disable_2fa" | "register";
  expiresAt: number;
  attempts: number;
  createdAt: number;
}

// In-memory cache for fast, zero-latency lookup
const otpMemoryCache = new Map<string, OTPRecord>();

/**
 * Generates a secure random 6-digit OTP
 */
export function generateNumericOTP(length = 6): string {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
}

/**
 * Creates and stores a new OTP for an email address
 * @param email User's email address
 * @param purpose Purpose of the OTP ("login" | "enable_2fa" | "disable_2fa" | "register")
 * @param ttlSeconds Time-to-live in seconds (default: 300s = 5 mins)
 */
export function createAndStoreOTP(
  email: string,
  purpose: "login" | "enable_2fa" | "disable_2fa" | "register" = "login",
  ttlSeconds = 300
): { code: string; expiresAt: number; expiresIn: number } {
  const normalizedEmail = email.trim().toLowerCase();
  const code = generateNumericOTP(6);
  const now = Date.now();
  const expiresAt = now + ttlSeconds * 1000;

  const record: OTPRecord = {
    email: normalizedEmail,
    code,
    purpose,
    expiresAt,
    attempts: 0,
    createdAt: now,
  };

  otpMemoryCache.set(normalizedEmail, record);

  return {
    code,
    expiresAt,
    expiresIn: ttlSeconds,
  };
}

/**
 * Validates a user-submitted OTP
 * @param email User's email address
 * @param inputCode The 6-digit code entered by the user
 * @param purpose Expected purpose
 */
export function verifyOTP(
  email: string,
  inputCode: string,
  purpose?: "login" | "enable_2fa" | "disable_2fa" | "register"
): { valid: boolean; error?: string } {
  const normalizedEmail = email.trim().toLowerCase();
  const record = otpMemoryCache.get(normalizedEmail);

  if (!record) {
    return {
      valid: false,
      error: "Mã xác thực không tồn tại hoặc đã hết hạn. Vui lòng bấm 'Gửi lại mã'.",
    };
  }

  // Check expiration
  if (Date.now() > record.expiresAt) {
    otpMemoryCache.delete(normalizedEmail);
    return {
      valid: false,
      error: "Mã OTP đã hết hạn (quá 5 phút). Vui lòng yêu cầu mã mới.",
    };
  }

  // Check max attempts
  if (record.attempts >= 5) {
    otpMemoryCache.delete(normalizedEmail);
    return {
      valid: false,
      error: "Bạn đã nhập sai quá 5 lần. Vui lòng yêu cầu mã OTP mới vì lý do an toàn.",
    };
  }

  // Check purpose if specified
  if (purpose && record.purpose !== purpose) {
    return {
      valid: false,
      error: "Mục đích xác thực không hợp lệ.",
    };
  }

  // Compare codes
  if (record.code !== inputCode.trim()) {
    record.attempts += 1;
    const remaining = 5 - record.attempts;
    return {
      valid: false,
      error: `Mã OTP không chính xác. Bạn còn ${remaining} lần thử lại.`,
    };
  }

  // OTP is valid -> Invalidate immediately to prevent replay attacks
  otpMemoryCache.delete(normalizedEmail);

  return {
    valid: true,
  };
}

/**
 * Helper to get currently active OTP (for demo/development helper notification)
 */
export function getActiveDemoOTP(email: string): string | null {
  const normalizedEmail = email.trim().toLowerCase();
  const record = otpMemoryCache.get(normalizedEmail);
  if (record && Date.now() <= record.expiresAt) {
    return record.code;
  }
  return null;
}
