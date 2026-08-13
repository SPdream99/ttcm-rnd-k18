import { useState, useEffect, useMemo } from "react";
import { MockAITutorRepo } from "@/infrastructure/repositories/MockAITutorRepo";
import { InteractWithAITutorUseCase } from "@/core/use-cases/AITutorUseCases";
import { ChatMessage, AITutorSubject } from "@/core/entities/AITutor";

export function useAITutorAdapter() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [subjects, setSubjects] = useState<AITutorSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const aiTutorRepo = useMemo(() => new MockAITutorRepo(), []);
  const tutorUseCase = useMemo(() => new InteractWithAITutorUseCase(aiTutorRepo), [aiTutorRepo]);

  useEffect(() => {
    tutorUseCase.getInitialState().then((res) => {
      setMessages(res.messages);
      setSubjects(res.subjects);
      setLoading(false);
    });
  }, [tutorUseCase]);

  const sendMessage = async (text: string, subjectId?: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: "usr_" + Date.now(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsSending(true);

    try {
      const aiReply = await tutorUseCase.sendMessage(text, subjectId);
      setMessages((prev) => [...prev, aiReply]);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return {
    messages,
    subjects,
    loading,
    isSending,
    sendMessage,
  };
}
