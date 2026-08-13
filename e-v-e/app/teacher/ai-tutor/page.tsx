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
  FileCode,
  Layers,
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
      text: `Kính chào **${displayName}**! 👨‍🏫\n\nTôi là **Trợ Giảng AI E-V-E**. Tôi có thể hỗ trợ Thầy/Cô:\n1. **Tự động sinh các cặp câu hỏi & đáp án (JSON Pairs)** theo chủ đề bài học.\n2. **Gợi ý thiết kế lộ trình học tập** từng bước cho học sinh.\n3. **Tạo đề bài lập trình / mini-game** và hướng dẫn tích hợp Game SDK.`,
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
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_err_${Date.now()}`,
          sender: "ai",
          text: "Xin lỗi Thầy/Cô, kết nối tới máy chủ AI đang gặp gián đoạn. Xin vui lòng thử lại sau ít giây.",
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
    "Soạn 3 cặp câu hỏi JSON pairs về vòng lặp for trong Python",
    "Gợi ý thiết kế lộ trình 4 bài học về Khoa học máy tính cho trẻ",
    "Cách gửi điểm từ Game tự viết lên hệ thống bằng EVEGameSDK?",
  ];

  // Markdown & Code block renderer
  const renderMessageContent = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const lines = part.slice(3, -3).trim().split("\n");
        const lang = lines[0].trim();
        const codeContent = lang ? lines.slice(1).join("\n") : lines.join("\n");

        return (
          <div key={index} className="my-3 rounded-xl bg-[#090d18] border border-emerald-500/20 overflow-hidden font-mono text-xs">
            <div className="px-3.5 py-1.5 bg-[#141b2c] border-b border-slate-800 text-slate-400 flex items-center justify-between text-[11px]">
              <span>{lang || "json"}</span>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(codeContent)}
                className="hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" /> Sao chép code
              </button>
            </div>
            <pre className="p-3.5 overflow-x-auto text-emerald-200">
              <code>{codeContent}</code>
            </pre>
          </div>
        );
      }

      const renderedLines = part.split("\n").map((line, lIdx) => {
        const boldParts = line.split(/(\*\*.*?\*\*)/g).map((bChunk, bIdx) => {
          if (bChunk.startsWith("**") && bChunk.endsWith("**")) {
            return <strong key={bIdx} className="text-white font-bold">{bChunk.slice(2, -2)}</strong>;
          }
          return bChunk;
        });

        return (
          <p key={lIdx} className="min-h-[1rem]">
            {line.trim() ? boldParts : <br />}
          </p>
        );
      });

      return <div key={index} className="space-y-1">{renderedLines}</div>;
    });
  };

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col space-y-4 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#7bd1fa]/15 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[2px] shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            <div className="w-full h-full bg-[#0a0e1a] rounded-[10px] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
              Trợ Giảng Sư Phạm AI E-V-E <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">Dành Cho Giáo Viên</span>
            </h1>
            <p className="text-xs text-[#8e9bb4]">Tự động sinh câu hỏi trắc nghiệm, thiết kế cấu trúc lộ trình & gợi ý bài giảng</p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: "m_init",
                sender: "ai",
                text: `Cuộc hội thoại đã được làm mới. Thầy/Cô cần hỗ trợ soạn nội dung gì hôm nay? 👋`,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              },
            ]);
          }}
          className="p-2 rounded-xl bg-[#151b2c] hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Làm mới
        </button>
      </div>

      {/* Main Chat Stream Viewport */}
      <div className="flex-1 bg-[#0b0f1a] rounded-2xl border border-slate-800 p-4 md:p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${
              msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center border ${
                msg.sender === "user"
                  ? "bg-emerald-500 text-black border-emerald-400"
                  : "bg-[#151b2c] text-emerald-400 border-emerald-500/30"
              }`}
            >
              {msg.sender === "user" ? <User className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
            </div>

            {/* Message Bubble */}
            <div className="space-y-1 max-w-[85%]">
              <div
                className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none shadow-md"
                    : "bg-[#13192a] border border-slate-800 text-slate-200 rounded-tl-none shadow-lg"
                }`}
              >
                {renderMessageContent(msg.text)}
              </div>

              <div
                className={`flex items-center gap-2 text-[10px] font-mono text-slate-500 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <span>{msg.timestamp}</span>
                {msg.sender === "ai" && (
                  <button
                    onClick={() => handleCopy(msg.text, msg.id)}
                    className="hover:text-emerald-400 flex items-center gap-0.5 cursor-pointer ml-1"
                  >
                    {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === msg.id ? "Đã chép" : "Chép"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* AI Typing Indicator */}
        {isTyping && (
          <div className="flex gap-3 max-w-xl mr-auto animate-pulse">
            <div className="w-8 h-8 rounded-xl shrink-0 bg-[#151b2c] text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-[#13192a] border border-slate-800 text-xs text-emerald-300 rounded-tl-none flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin text-emerald-400" />
              <span>Trợ giảng AI đang soạn dữ liệu bài học...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Prompts Pill Container */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 shrink-0">
        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 whitespace-nowrap">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Mẫu yêu cầu nhanh:
        </span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(p)}
            className="px-3 py-1 rounded-full bg-[#13192a] hover:bg-[#1c243c] border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 text-xs font-sans whitespace-nowrap transition-all cursor-pointer"
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
          placeholder="Yêu cầu AI soạn câu hỏi JSON pairs, gợi ý cấu trúc bài giảng hoặc hướng dẫn tích hợp game..."
          className="flex-1 bg-[#0e1422] border border-emerald-500/30 focus:border-emerald-400 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-400 placeholder-slate-500 transition-all shadow-inner"
        />

        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(16,185,129,0.35)] cursor-pointer shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
