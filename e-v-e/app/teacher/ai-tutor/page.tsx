"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  User,
  RotateCcw,
  Lightbulb,
  GraduationCap,
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export default function TeacherAITutorPage() {
  const { currentUser, profile } = useAuthAdapter();
  const displayName = currentUser?.name || profile?.fullName || "Thầy/Cô";

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m_init",
      sender: "ai",
      text: `Kính chào ${displayName}! Tôi là Trợ lý Sư Phạm AI E-V-E. Tôi có thể hỗ trợ Thầy/Cô tự động soạn các cặp câu hỏi & đáp án (JSON Pairs), thiết kế bản đồ kho báu lộ trình học hoặc viết gợi ý game.`,
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
    const prompt = input.trim();
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      let aiReply = "";
      const lower = prompt.toLowerCase();

      if (lower.includes("soạn") || lower.includes("json") || lower.includes("câu hỏi")) {
        aiReply = `Dưới đây là mẫu 2 Cặp Dữ Liệu (JSON Pairs) đề xuất cho bài học:\n\n1. Câu hỏi: "Đơn vị đo lường tần số sóng là gì?"\n- Đáp án đúng: Hertz (Hz)\n- Gây nhiễu: Joule (J), Pascal (Pa), Watt (W)\n\n2. Câu hỏi: "Vận tốc ánh sáng trong chân không xấp xỉ bằng bao nhiêu?"\n- Đáp án đúng: 300,000 km/s\n- Gây nhiễu: 150,000 km/s, 30,000 km/s, 3,000 km/s\n\nThầy/Cô có thể sao chép nhanh vào Tab Tạo Khóa Học ở Upload Center! ✍️`;
      } else if (lower.includes("game") || lower.includes("api") || lower.includes("sdk")) {
        aiReply = "Hệ thống E-V-E cung cấp trọn bộ REST API và SDK Javascript (`window.EVEGameSDK`) cho giáo viên. Game của Thầy/Cô chỉ cần gọi `EVEGameSDK.finishGame({ score, isWin })` là hệ thống sẽ tự động cập nhật tiến độ x/y và mở khóa các chặng trên bản đồ kho báu cho học sinh!";
      } else {
        aiReply = `Ý tưởng của Thầy/Cô về "${prompt}" rất tuyệt vời! Để triển khai hiệu quả, Thầy/Cô nên chia lộ trình thành 2-3 course nhỏ trên Bản đồ kho báu, mỗi course gắn 1-2 Game Quiz để học sinh hào hứng chinh phục.`;
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

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col space-y-4 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#7bd1fa]/15 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[2px] shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            <div className="w-full h-full bg-[#0a0e1a] rounded-[10px] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              E-V-E AI Educator Assistant <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">Trợ Giảng AI</span>
            </h1>
            <p className="text-xs text-[#8e9bb4]">Hỗ trợ giáo viên sinh câu hỏi trắc nghiệm, thiết kế lộ trình & tích hợp Game API</p>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="p-2 rounded-xl bg-[#151b2c] hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Xóa hội thoại
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-[#0f1524]/80 border border-[#7bd1fa]/15 space-y-4 shadow-inner">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                m.sender === "user"
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
              }`}
            >
              {m.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed ${
                m.sender === "user"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none"
                  : "bg-[#151b2c] border border-slate-800 text-slate-200 rounded-tl-none"
              }`}
            >
              <p className="whitespace-pre-wrap">{m.text}</p>
              <div
                className={`text-[10px] mt-1.5 font-mono ${
                  m.sender === "user" ? "text-emerald-200 text-right" : "text-slate-400"
                }`}
              >
                {m.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-[#151b2c] border border-slate-800 text-emerald-300 text-xs font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-spin" /> AI đang soạn cấu trúc giáo án...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex items-center gap-3 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Yêu cầu AI soạn 3 cặp câu hỏi Vật lý hoặc hướng dẫn Game API..."
          className="flex-1 bg-[#151b2c] border border-emerald-500/20 focus:border-emerald-400 rounded-2xl px-5 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-all font-sans"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.35)] transition-all disabled:opacity-50 cursor-pointer"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
