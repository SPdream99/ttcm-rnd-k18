/**
 * E-V-E AI Tutor Shared Chat & Memory Storage Service
 * Quản lý lưu trữ cuộc trò chuyện xuyên suốt (Persistent Chat History) & Cài đặt Trí nhớ AI (Memory).
 * Đồng bộ hai chiều giữa trang Gia Sư Toàn Màn Hình và Widget Popup Thu Nhỏ.
 */

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

const STORAGE_KEY_HISTORY = "eve_tutor_chat_history";
const STORAGE_KEY_MEMORY = "eve_tutor_memory_enabled";
export const CHAT_UPDATED_EVENT = "eve_chat_updated";

export function getDefaultWelcomeMessage(studentName: string = "bạn", hasKey: boolean = true): ChatMessage {
  const keyNote = !hasKey
    ? `\n\n⚠️ *Lưu ý: Bạn chưa cài đặt API Key. Hãy cài đặt key để AI phản hồi chính xác và thông minh nhất nhé!*`
    : "";

  return {
    id: "msg-welcome-default",
    sender: "ai",
    text: `Chào ${studentName}! Mình là **Gia Sư Trực Tuyến E-V-E**, đồng hành học tập cùng bạn hôm nay.\n\nBạn có thể hỏi mình mọi thứ về:\n- **Lập trình Python, Scratch & Cấu trúc thuật toán**\n- **Tra cứu bài học, kho minigame & bản đồ lộ trình**\n- **Kiến thức phần cứng & máy tính**\n- **Giải bài tập và tư duy logic**\n\nBạn muốn khám phá chủ đề nào trước?${keyNote}`,
    timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
  };
}

/**
 * 1. Lấy toàn bộ lịch sử trò chuyện từ Local Storage
 */
export function getChatHistory(studentName: string = "bạn", hasKey: boolean = true): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (!raw) {
      const welcome = [getDefaultWelcomeMessage(studentName, hasKey)];
      return welcome;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return [getDefaultWelcomeMessage(studentName, hasKey)];
  } catch (err) {
    console.warn("Lỗi đọc lịch sử chat tutor:", err);
    return [getDefaultWelcomeMessage(studentName, hasKey)];
  }
}

/**
 * 2. Lưu lịch sử trò chuyện và thông báo các component khác cùng cập nhật
 */
export function saveChatHistory(messages: ChatMessage[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(messages));
    window.dispatchEvent(new CustomEvent(CHAT_UPDATED_EVENT, { detail: { messages } }));
  } catch (err) {
    console.warn("Lỗi lưu lịch sử chat tutor:", err);
  }
}

/**
 * 3. Xóa toàn bộ trí nhớ / lịch sử cuộc trò chuyện
 */
export function clearChatHistory(studentName: string = "bạn", hasKey: boolean = true): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const initial = [getDefaultWelcomeMessage(studentName, hasKey)];
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(initial));
    window.dispatchEvent(new CustomEvent(CHAT_UPDATED_EVENT, { detail: { messages: initial, cleared: true } }));
    return initial;
  } catch (err) {
    console.warn("Lỗi xóa trí nhớ chat tutor:", err);
    return [];
  }
}

/**
 * 4. Kiểm tra tính năng 'Ghi nhớ xuyên suốt' có đang BẬT hay TẮT
 */
export function isMemoryEnabled(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const val = localStorage.getItem(STORAGE_KEY_MEMORY);
    if (val === null) return true; // Mặc định bật
    return val === "true";
  } catch {
    return true;
  }
}

/**
 * 5. Bật / Tắt tính năng 'Ghi nhớ xuyên suốt'
 */
export function setMemoryEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_MEMORY, enabled ? "true" : "false");
    window.dispatchEvent(new CustomEvent(CHAT_UPDATED_EVENT, { detail: { memoryEnabled: enabled } }));
  } catch (err) {
    console.warn("Lỗi cập nhật thiết lập trí nhớ chat:", err);
  }
}
