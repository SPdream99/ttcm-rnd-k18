"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  User,
  RotateCcw,
  Lightbulb,
  BookOpen,
  HelpCircle,
  Flame,
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export default function StudentAITutorPage() {
  const { currentUser, profile } = useAuthAdapter();
  const displayName = currentUser?.name || profile?.fullName || "Học Sinh";

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m_init",
      sender: "ai",
      text: `Xin chào ${displayName}! Ta là Trợ lý AI E-V-E đồng hành cùng bạn trên bản đồ tri thức. Bạn đang gặp khó khăn ở bài học lượng tử hay câu hỏi nào cần ta giải thích chi tiết không? 🌌`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentQuestion = input.trim();
    setInput("");
    setIsTyping(true);

    // Simulate AI Cosmic Tutor intelligent response
    setTimeout(() => {
      let aiReply = "";
      const lower = currentQuestion.toLowerCase();

      if (lower.includes("quang điện") || lower.includes("photon")) {
        aiReply = "Hiện tượng quang điện xảy ra khi chiếu ánh sáng có bước sóng thích hợp vào bề mặt kim loại, làm bật các electron ra ngoài. Nó chứng minh ánh sáng có tính chất hạt (các gói năng lượng gọi là Photon: E = h.f)!";
      } else if (lower.includes("lộ trình") || lower.includes("bản đồ") || lower.includes("mở khóa")) {
        aiReply = "Trên Bản đồ kho báu (Learning Path), mỗi khóa học yêu cầu bạn hoàn thành số lượng trò chơi quy định (ví dụ 2/2 game). Khi bạn vượt qua các thử thách đó, khóa học tiếp theo sẽ tự động mở khóa và sáng lên!";
      } else if (lower.includes("coin") || lower.includes("thưởng")) {
        aiReply = "Mỗi khi bạn vượt qua một Game Quiz hoặc hoàn thành một chặng trên bản đồ kho báu, bạn sẽ được thưởng từ 40 - 100 Coins. Bạn có thể dùng Coins này trong Cửa Hàng để đổi Khung Avatar và Huy hiệu độc quyền nhé!";
      } else {
        aiReply = `Câu hỏi rất hay về "${currentQuestion}"! Trong vũ trụ tri thức E-V-E, khái niệm này liên quan mật thiết đến các bài học và trò chơi mô phỏng trong lộ trình của bạn. Bạn hãy thử mở bản đồ kho báu và chơi một màn Game Quiz để củng cố thêm nhé! 🚀`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          sender: "ai",
          text: aiReply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const samplePrompts = [
    "Giải thích hiện tượng quang điện lượng tử",
    "Làm sao để mở khóa course tiếp theo trên bản đồ?",
    "Hệ thống thưởng coin và đổi quà hoạt động như thế nào?",
  ];

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col space-y-4 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#7bd1fa]/15 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 p-[2px] shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <div className="w-full h-full bg-[#0a0e1a] rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-300" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              E-V-E AI Tutor <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">Trực Tuyến 24/7</span>
            </h1>
            <p className="text-xs text-[#8e9bb4]">Trợ lý thông minh hướng dẫn lộ trình & giải đáp bài tập tức thì</p>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="p-2 rounded-xl bg-[#151b2c] hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Xóa hội thoại
        </button>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-[#0f1524]/80 border border-[#7bd1fa]/15 space-y-4 shadow-inner">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                m.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
              }`}
            >
              {m.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed ${
                m.sender === "user"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-tr-none"
                  : "bg-[#151b2c] border border-slate-800 text-slate-200 rounded-tl-none"
              }`}
            >
              <p className="whitespace-pre-wrap">{m.text}</p>
              <div
                className={`text-[10px] mt-1.5 font-mono ${
                  m.sender === "user" ? "text-cyan-200 text-right" : "text-slate-400"
                }`}
              >
                {m.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-[#151b2c] border border-slate-800 text-cyan-300 text-xs font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-spin" /> E-V-E AI đang phân tích dữ liệu...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 shrink-0">
          <Lightbulb className="w-3 h-3 text-amber-400" /> Gợi ý:
        </span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              setInput(p);
            }}
            className="px-3 py-1.5 rounded-xl bg-[#151b2c] hover:bg-cyan-950/40 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/30 text-xs font-sans shrink-0 transition-all cursor-pointer"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSend} className="flex items-center gap-3 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Hỏi AI Tutor về bất kỳ bài học hoặc quy tắc mở khóa nào..."
          className="flex-1 bg-[#151b2c] border border-cyan-500/20 focus:border-cyan-400 rounded-2xl px-5 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-all font-sans"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.35)] transition-all disabled:opacity-50 cursor-pointer"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
