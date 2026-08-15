"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  User,
  RotateCcw,
  Lightbulb,
  GraduationCap,
  Copy,
  Check,
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { getDecryptedAIKey } from "@/lib/secureKeyStorage";

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
      text: `Kính chào **${displayName}**! \n\nTôi là **Trợ Giảng Sư Phạm E-V-E**. Tôi có thể hỗ trợ Thầy/Cô:\n1. **Tự động sinh các cặp câu hỏi trắc nghiệm** theo chủ đề bài học.\n2. **Gợi ý thiết kế lộ trình học tập** từng bước cho học sinh.\n3. **Tạo đề bài lập trình / mini-game** và hướng dẫn tích hợp Game SDK.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (customPrompt?: string) => {
    const promptText = customPrompt || input.trim();
    if (!promptText || isTyping) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput("");
    setIsTyping(true);

    try {
      const savedKey = getDecryptedAIKey();
      if (!savedKey) {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai_nokey_${Date.now()}`,
            sender: "ai",
            text: " Thầy/Cô chưa cài đặt Google Gemini API Key. Xin vui lòng **mở cài đặt key ở góc phải lên** hoặc **cài đặt key trong profile** để tiếp tục sử dụng Trợ Lý Sư Phạm AI nhé!",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        setIsTyping(false);
        return;
      }

      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: promptText,
          role: "teacher",
          geminiApiKey: savedKey,
        }),
      });

      const data = await res.json();
      const aiReply = data.reply || "Đã xử lý yêu cầu, Thầy/Cô có cần tinh chỉnh thêm phần nào không?";

      setMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          sender: "ai",
          text: aiReply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_err_${Date.now()}`,
          sender: "ai",
          text: "Xin lỗi Thầy/Cô, kết nối tới máy chủ đang gặp gián đoạn. Xin vui lòng thử lại sau ít giây.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const samplePrompts = [
    "Soạn 5 câu trắc nghiệm về Vòng lặp For trong Python",
    "Gợi ý cấu trúc lộ trình Lập trình Game cơ bản",
    "Tạo ngân hàng câu hỏi linh kiện phần cứng máy tính",
  ];

  const renderFormattedText = (rawText: string) => {
    const parts = rawText.split(/(\*\*.*?\*\*|`.*?`)/g);

    return parts.map((part, pIdx) => {
      if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
        return (
          <strong key={pIdx} className="font-extrabold text-inherit">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
        return (
          <code key={pIdx} className="px-1.5 py-0.5 rounded bg-zinc-100 text-red-600 font-mono text-[11px] border border-zinc-200">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  const renderMessageContent = (text: string) => {
    const blocks = text.split(/(```[\s\S]*?```)/g);

    return blocks.map((block, index) => {
      if (block.startsWith("```") && block.endsWith("```")) {
        const codeLines = block.slice(3, -3).trim().split("\n");
        const lang = codeLines[0].trim();
        const code = (lang ? codeLines.slice(1) : codeLines).join("\n");

        return (
          <div key={`code-${index}`} className="my-2 rounded-xl bg-zinc-900 text-zinc-100 p-3 text-xs font-mono overflow-x-auto">
            <div className="flex justify-between items-center pb-1 mb-2 border-b border-zinc-700 text-zinc-400">
              <span>{lang || "code"}</span>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(code)}
                className="hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" /> Sao chép
              </button>
            </div>
            <code>{code}</code>
          </div>
        );
      }

      return (
        <div key={`p-${index}`} className="whitespace-pre-wrap leading-relaxed">
          {renderFormattedText(block)}
        </div>
      );
    });
  };

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col space-y-4 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-zinc-200 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shadow-sm">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-zinc-900 flex items-center gap-2">
              Trợ Giảng Sư Phạm E-V-E <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-700 font-bold border border-red-200">Dành Cho Giáo Viên</span>
            </h1>
            <p className="text-xs text-zinc-500">Tự động sinh câu hỏi trắc nghiệm, thiết kế cấu trúc lộ trình & gợi ý bài giảng</p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: "m_init",
                sender: "ai",
                text: `Cuộc hội thoại đã được làm mới. Thầy/Cô cần hỗ trợ soạn nội dung gì hôm nay? `,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              },
            ]);
          }}
          className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900 border border-zinc-200 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Làm mới
        </button>
      </div>

      {/* Main Chat Stream Viewport */}
      <div className="flex-1 bg-zinc-50 rounded-2xl border border-zinc-200 p-4 md:p-6 overflow-y-auto space-y-4 shadow-inner">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${
              msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs ${
                msg.sender === "user"
                  ? "bg-zinc-800 text-white"
                  : "bg-red-600 text-white"
              }`}
            >
              {msg.sender === "user" ? <User className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
            </div>

            <div className="space-y-1 max-w-[85%]">
              <div
                className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-red-600 text-white rounded-tr-none shadow-sm font-medium"
                    : "bg-white border border-zinc-200 text-zinc-800 rounded-tl-none shadow-sm"
                }`}
              >
                {renderMessageContent(msg.text)}
              </div>

              <div
                className={`flex items-center gap-2 text-[10px] text-zinc-400 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <span>{msg.timestamp}</span>
                {msg.sender === "ai" && (
                  <button
                    onClick={() => handleCopy(msg.text, msg.id)}
                    className="hover:text-red-600 flex items-center gap-0.5 cursor-pointer ml-1"
                  >
                    {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === msg.id ? "Đã chép" : "Chép"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 max-w-xl mr-auto">
            <div className="w-8 h-8 rounded-full shrink-0 bg-red-600 text-white flex items-center justify-center font-bold">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-white border border-zinc-200 text-xs text-zinc-600 rounded-tl-none flex items-center gap-2 shadow-sm">
              <Sparkles className="w-4 h-4 text-red-600 animate-spin" />
              <span>Trợ giảng đang soạn dữ liệu bài học...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 shrink-0">
        <span className="text-[11px] font-bold text-zinc-500 flex items-center gap-1 whitespace-nowrap">
          <Lightbulb className="w-3.5 h-3.5 text-red-600" /> Gợi ý:
        </span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(p)}
            className="px-3 py-1 rounded-full bg-zinc-100 hover:bg-red-50 border border-zinc-200 hover:border-red-200 text-zinc-700 hover:text-red-700 text-xs whitespace-nowrap transition-colors cursor-pointer font-medium"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Yêu cầu soạn câu hỏi trắc nghiệm, cấu trúc bài giảng hoặc hướng dẫn tích hợp game..."
          className="flex-1 bg-white border-2 border-zinc-200 focus:border-red-600 rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:outline-none placeholder-zinc-400 transition-colors shadow-sm"
        />

        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="p-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
