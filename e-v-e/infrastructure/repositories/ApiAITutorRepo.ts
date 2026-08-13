import { AITutorPort } from "@/core/ports/AITutorPort";
import { ChatMessage, AITutorSubject } from "@/core/entities/AITutor";

export class ApiAITutorRepo implements AITutorPort {
  async getMessages(): Promise<ChatMessage[]> {
    return [
      {
        id: "msg_1",
        sender: "ai",
        text: "Xin chào! Mình là Trợ lý AI E-V-E. Hôm nay bạn muốn tìm hiểu hay giải đáp thắc mắc về chủ đề nào?",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ];
  }

  async sendMessage(
    userMessage: string,
    subjectId?: string
  ): Promise<ChatMessage> {
    const response = await fetch("/api/tutor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
        subjectId,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "AI Tutor error");
    }

    return {
      id: "msg_" + Date.now(),
      sender: "ai",
      text: data.reply,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  }

  async getSubjects(): Promise<AITutorSubject[]> {
    return [
      { id: "phys", name: "Vật Lý Lượng Tử", iconName: "Atom" },
      { id: "ai", name: "Trí Tuệ Nhân Tạo", iconName: "Bot" },
      { id: "math", name: "Toán Học Cao Cấp", iconName: "Calculator" },
      { id: "ux", name: "Thiết Kế UI/UX", iconName: "Palette" },
    ];
  }
}
