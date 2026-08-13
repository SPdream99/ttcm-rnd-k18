import { AITutorPort } from "@/core/ports/AITutorPort";
import { ChatMessage, AITutorSubject } from "@/core/entities/AITutor";
import { getDecryptedAIKey } from "@/lib/secureKeyStorage";

export class ApiAITutorRepo implements AITutorPort {
  async getMessages(): Promise<ChatMessage[]> {
    return [];
  }

  async getSubjects(): Promise<AITutorSubject[]> {
    return [
      {
        id: "python",
        name: "Lập trình Python",
        iconName: "Code",
      },
      {
        id: "logic",
        name: "Tư duy Thuật toán",
        iconName: "BrainCircuit",
      },
      {
        id: "hardware",
        name: "Phần cứng Máy tính 3D",
        iconName: "Cpu",
      },
    ];
  }

  async sendMessage(
    userMessage: string,
    subjectId?: string
  ): Promise<ChatMessage> {
    const savedKey = getDecryptedAIKey();

    const response = await fetch("/api/tutor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
        subjectId,
        geminiApiKey: savedKey,
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
}
