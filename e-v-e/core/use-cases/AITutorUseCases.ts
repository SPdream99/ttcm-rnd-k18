import { AITutorPort } from "../ports/AITutorPort";

export class InteractWithAITutorUseCase {
  constructor(private aiTutorPort: AITutorPort) {}

  async getInitialState() {
    const [messages, subjects] = await Promise.all([
      this.aiTutorPort.getMessages(),
      this.aiTutorPort.getSubjects(),
    ]);

    return {
      messages,
      subjects,
    };
  }

  async sendMessage(userMessage: string, subjectId?: string) {
    if (!userMessage.trim()) {
      throw new Error("Tin nhắn không được để trống.");
    }
    return this.aiTutorPort.sendMessage(userMessage, subjectId);
  }
}
