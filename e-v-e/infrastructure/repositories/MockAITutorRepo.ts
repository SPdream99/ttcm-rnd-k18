import { AITutorPort } from "@/core/ports/AITutorPort";
import { ChatMessage, AITutorSubject } from "@/core/entities/AITutor";

export class MockAITutorRepo implements AITutorPort {
  private initialMessages: ChatMessage[] = [
    {
      id: "msg_1",
      sender: "ai",
      text: "Xin chào Đức! Mình là Trợ lý AI E-V-E. Hôm nay bạn muốn tìm hiểu hay giải đáp thắc mắc về chủ đề nào?",
      timestamp: "10:00 AM",
      suggestedFollowups: [
        "Giải thích lại Thí nghiệm EPR & Chuông Bell",
        "Cách viết thuật toán Backpropagation bằng Python",
        "Hướng dẫn thiết kế Glassmorphism CSS",
      ],
    },
  ];

  async getMessages(): Promise<ChatMessage[]> {
    return [...this.initialMessages];
  }

  async sendMessage(userMessage: string, subjectId?: string): Promise<ChatMessage> {
    const aiResponseText = `Cảm ơn bạn đã hỏi: "${userMessage}". Trong hệ sinh thái E-V-E, khái niệm này liên quan trực tiếp đến việc ứng dụng mô hình trí tuệ nhân tạo để tối ưu hóa lộ trình học tập cá nhân!`;

    const aiMsg: ChatMessage = {
      id: "msg_" + Date.now(),
      sender: "ai",
      text: aiResponseText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      suggestedFollowups: [
        "Cho mình xem ví dụ thực tế",
        "Làm sao để ứng dụng vào bài tập?",
      ],
    };

    return aiMsg;
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
