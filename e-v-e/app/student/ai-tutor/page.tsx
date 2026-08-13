"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  User,
  RotateCcw,
  Lightbulb,
  Code,
  Cpu,
  Layers,
  HelpCircle,
  Copy,
  Check,
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

const TOPICS = [
  { id: "all", name: "Toàn Bộ", icon: Sparkles },
  { id: "python", name: "Python Căn Bản", icon: Code },
  { id: "logic", name: "Tư Duy & Thuật Toán", icon: Layers },
  { id: "hardware", name: "Phần Cứng Máy Tính 3D", icon: Cpu },
];

export default function StudentAITutorPage() {
  const { currentUser, profile } = useAuthAdapter();
  const displayName = currentUser?.name || profile?.fullName || "Học Sinh";

  const [activeTopic, setActiveTopic] = useState("all");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m_init",
      sender: "ai",
      text: `Xin chào **${displayName}**! 👋\n\nTôi là **Trợ Lý AI E-V-E** đồng hành cùng bạn trong hành trình học lập trình & khoa học máy tính.\n\nBạn có thể hỏi tôi bất kỳ thắc mắc nào: từ **cách viết code Python**, **giải thích lỗi SyntaxError**, **cách hoạt động của vòng lặp/hàm** đến **cấu tạo phần cứng máy tính** nhé!`,
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
    const questionText = customPrompt || input.trim();
    if (!questionText || isTyping) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text: questionText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: questionText,
          role: "student",
          subjectId: activeTopic,
        }),
      });

      const data = await res.json();
      const aiReply = data.reply || "Tôi đã nhận được câu hỏi, bạn có thể hỏi chi tiết hơn được không?";

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
          text: "Xin lỗi bạn, kết nối tới máy chủ AI đang gặp gián đoạn. Bạn thử đặt lại câu hỏi sau ít giây nhé!",
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
    "Biến số (Variable) trong Python là gì và cách dùng?",
    "Vòng lặp for và while khác nhau như thế nào?",
    "CPU, RAM và ổ cứng SSD trong máy tính có nhiệm vụ gì?",
    "Làm thế nào để viết câu lệnh điều kiện if-else?",
  ];

  // Simple Markdown text renderer with Code Block support
  const renderMessageContent = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const lines = part.slice(3, -3).trim().split("\n");
        const lang = lines[0].trim();
        const codeContent = lang ? lines.slice(1).join("\n") : lines.join("\n");

        return (
          <div key={index} className="my-3 rounded-xl bg-[#090d18] border border-cyan-500/20 overflow-hidden font-mono text-xs">
            <div className="px-3.5 py-1.5 bg-[#141b2c] border-b border-slate-800 text-slate-400 flex items-center justify-between text-[11px]">
              <span>{lang || "code"}</span>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(codeContent)}
                className="hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" /> Sao chép
              </button>
            </div>
            <pre className="p-3.5 overflow-x-auto text-cyan-200">
              <code>{codeContent}</code>
            </pre>
          </div>
        );
      }

      // Regular text with bold & line breaks
      const formattedLines = part.split("\n").map((line, lIdx) => {
        // Simple bold parser
        const boldParts = line.split(/(\*\*.*?\*\*)/g).map((bChunk, bIdx) => {
          if (bChunk.startsWith("**") && bChunk.endsWith("**")) {
            return <strong key={bIdx} className="text-white font-bold">{bChunk.slice(2, -2)}</strong>;
          }
          return bChunk;
        });

        return (
          <p key={lIdx} className="min-h-[1rem]">
            {formattedLines ? boldParts : <br />}
          </p>
        );
      });

      return <div key={index} className="space-y-1">{formattedLines}</div>;
    });
  };

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col space-y-4 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#7bd1fa]/15 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 p-[2px] shadow-[0_0_15px_rgba(6,182,212,0.35)]">
            <div className="w-full h-full bg-[#0a0e1a] rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-300" />
            </div>
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
              Trợ Lý Học Tập AI E-V-E <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </h1>
            <p className="text-xs text-[#8e9bb4]">Giải đáp thắc mắc lập trình, hướng dẫn thuật toán & hỗ trợ bài học 24/7</p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: "m_init",
                sender: "ai",
                text: `Cuộc trò chuyện đã được làm mới. Hãy đặt câu hỏi bất kỳ nhé ${displayName}! 👋`,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              },
            ]);
          }}
          className="p-2 rounded-xl bg-[#151b2c] hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono"
          title="Bắt đầu hội thoại mới"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Làm mới
        </button>
      </div>

      {/* Topics Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
        {TOPICS.map((topic) => {
          const Icon = topic.icon;
          return (
            <button
              key={topic.id}
              onClick={() => setActiveTopic(topic.id)}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap border ${
                activeTopic === topic.id
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                  : "bg-[#0f1524] text-slate-400 border-slate-800 hover:border-slate-700"
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {topic.name}
            </button>
          );
        })}
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
                  ? "bg-cyan-500 text-black border-cyan-400"
                  : "bg-[#151b2c] text-cyan-400 border-cyan-500/30"
              }`}
            >
              {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Message Bubble */}
            <div className="space-y-1 max-w-[85%]">
              <div
                className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-tr-none shadow-md"
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
                    className="hover:text-cyan-400 flex items-center gap-0.5 cursor-pointer ml-1"
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
            <div className="w-8 h-8 rounded-xl shrink-0 bg-[#151b2c] text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-[#13192a] border border-slate-800 text-xs text-cyan-300 rounded-tl-none flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
              <span>AI Tutor đang suy nghĩ và chuẩn bị câu trả lời...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Prompts Pill Container */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 shrink-0">
        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 whitespace-nowrap">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Gợi ý câu hỏi:
        </span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(p)}
            className="px-3 py-1 rounded-full bg-[#13192a] hover:bg-[#1c243c] border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 text-xs font-sans whitespace-nowrap transition-all cursor-pointer"
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
          placeholder="Hỏi AI về Python, giải thích thuật toán, sửa lỗi code hoặc hỏi về bài học..."
          className="flex-1 bg-[#0e1422] border border-cyan-500/30 focus:border-cyan-400 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 placeholder-slate-500 transition-all shadow-inner"
        />

        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(6,182,212,0.35)] cursor-pointer shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
