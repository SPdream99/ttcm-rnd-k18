import { ChatMessage, AITutorSubject } from "../entities/AITutor";

export interface AITutorPort {
  getMessages(): Promise<ChatMessage[]>;
  sendMessage(userMessage: string, subjectId?: string): Promise<ChatMessage>;
  getSubjects(): Promise<AITutorSubject[]>;
}
