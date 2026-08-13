/**
 * E-V-E Secure Client-Side AI Key Storage
 * Mã hóa và lưu trữ API Key (Google Gemini / OpenAI) an toàn trong Local Storage của người dùng.
 * Key được mã hóa trước khi lưu để bảo vệ khỏi các tập lệnh truy cập trực tiếp text thô.
 */

const STORAGE_KEY = "eve_user_encrypted_ai_key";
const CLIENT_SALT = "eve_secure_client_cipher_key_2026";

/**
 * Mã hóa chuỗi thô thành chuỗi mã hóa an toàn (Base64 XOR Cipher)
 */
function encryptKey(rawText: string): string {
  if (!rawText) return "";
  let result = "";
  for (let i = 0; i < rawText.length; i++) {
    const charCode = rawText.charCodeAt(i) ^ CLIENT_SALT.charCodeAt(i % CLIENT_SALT.length);
    result += String.fromCharCode(charCode);
  }
  return Buffer.from(result, "binary").toString("base64");
}

/**
 * Giải mã chuỗi đã mã hóa về lại API Key ban đầu
 */
function decryptKey(cipherBase64: string): string {
  if (!cipherBase64) return "";
  try {
    const rawBinary = Buffer.from(cipherBase64, "base64").toString("binary");
    let result = "";
    for (let i = 0; i < rawBinary.length; i++) {
      const charCode = rawBinary.charCodeAt(i) ^ CLIENT_SALT.charCodeAt(i % CLIENT_SALT.length);
      result += String.fromCharCode(charCode);
    }
    return result;
  } catch (err) {
    console.error("Lỗi giải mã API key:", err);
    return "";
  }
}

/**
 * 1. Lưu API Key của người dùng vào Local Storage dưới dạng đã mã hóa
 */
export function saveEncryptedAIKey(rawKey: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const cleanKey = rawKey.trim();
    if (!cleanKey) {
      removeAIKey();
      return true;
    }
    const encrypted = encryptKey(cleanKey);
    localStorage.setItem(STORAGE_KEY, encrypted);
    return true;
  } catch (e) {
    console.error("Không thể lưu API Key vào Local Storage:", e);
    return false;
  }
}

/**
 * 2. Lấy API Key đã giải mã để gửi lên API AI
 */
export function getDecryptedAIKey(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const encrypted = localStorage.getItem(STORAGE_KEY);
    if (!encrypted) {
      // Fallback backwards compatibility if user previously saved as raw
      const legacyRaw = localStorage.getItem("eve_gemini_api_key");
      if (legacyRaw) {
        saveEncryptedAIKey(legacyRaw);
        localStorage.removeItem("eve_gemini_api_key");
        return legacyRaw;
      }
      return null;
    }
    return decryptKey(encrypted);
  } catch (e) {
    return null;
  }
}

/**
 * 3. Xóa API Key khỏi Local Storage
 */
export function removeAIKey(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem("eve_gemini_api_key");
}

/**
 * 4. Kiểm tra người dùng đã cấu hình API Key chưa
 */
export function hasAIKey(): boolean {
  return Boolean(getDecryptedAIKey());
}

/**
 * 5. Lấy dạng chuỗi che giấu (Masked) để hiển thị an toàn trên giao diện Profile (VD: AIzaSy***...***89)
 */
export function getMaskedAIKey(): string {
  const key = getDecryptedAIKey();
  if (!key) return "";
  if (key.length <= 10) return "••••••••••••";
  const start = key.substring(0, 6);
  const end = key.substring(key.length - 4);
  return `${start}••••••••••••${end}`;
}
