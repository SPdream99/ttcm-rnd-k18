"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bot,
  User,
  Send,
  Sparkles,
  Key,
  RotateCcw,
  BookOpen,
  Gamepad2,
  Trophy,
  Copy,
  Check,
  Flame,
  Lightbulb,
  Cpu,
  Mic,
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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Gemini API Key modal & state
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [hasApiKeyActive, setHasApiKeyActive] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load API Key & Initial greeting
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedKey = localStorage.getItem("eve_gemini_api_key") || "";
      if (storedKey) {
        setApiKeyInput(storedKey);
        setHasApiKeyActive(true);
      }
    }

    const studentName = currentUser?.name || profile?.fullName || "bạn";
    setMessages([
      {
        id: "msg-welcome",
        sender: "ai",
        text: `Chào ${studentName}! 👋 Mình là **Trợ Lý AI E-V-E**, đồng hành học tập cùng bạn hôm nay.\n\nBạn có thể hỏi mình mọi thứ về:\n- 🐍 **Lập trình Python, Scratch & Thuật toán**\n- 🎮 **Tra cứu trò chơi, lộ trình học & bảng xếp hạng**\n- 🖥️ **Linh kiện & mô phỏng phần cứng máy tính 3D**\n- 🧮 **Giải toán và tư duy logic**\n\nBạn muốn khám phá chủ đề nào trước?`,
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, [currentUser, profile]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("eve_gemini_api_key", apiKeyInput.trim());
      setHasApiKeyActive(Boolean(apiKeyInput.trim()));
      setShowKeyModal(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || inputMessage).trim();
    if (!prompt || isSending) return;

    const userMsgId = `usr-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: "user",
      text: prompt,
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");
    setIsSending(true);

    try {
      const storedKey =
        typeof window !== "undefined"
          ? localStorage.getItem("eve_gemini_api_key") || ""
          : "";

      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: prompt,
          role: "student",
          geminiApiKey: storedKey,
        }),
      });

      const data = await res.json();
      const aiReply =
        data.reply ||
        "Rất tiếc, AI tạm thời chưa thể phản hồi. Bạn hãy thử lại sau ít giây nhé!";

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: aiReply,
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("AI send error:", err);
      const errMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: "ai",
        text: "⚠️ Có lỗi khi kết nối tới máy chủ AI. Vui lòng kiểm tra lại kết nối mạng hoặc thử lại sau!",
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ── Markdown Inline Formatter ──
  const renderInlineText = (str: string): React.ReactNode => {
    const regex = /(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g;
    const chunks = str.split(regex);

    return chunks.map((chunk, idx) => {
      if (chunk.startsWith("**") && chunk.endsWith("**") && chunk.length >= 4) {
        return (
          <strong key={idx} className="text-white font-bold font-sans">
            {chunk.slice(2, -2)}
          </strong>
        );
      }
      if (chunk.startsWith("`") && chunk.endsWith("`") && chunk.length >= 2) {
        return (
          <code
            key={idx}
            className="px-1.5 py-0.5 rounded bg-[#162035] text-cyan-300 font-mono text-[11px] border border-cyan-500/30"
          >
            {chunk.slice(1, -1)}
          </code>
        );
      }
      const linkMatch = chunk.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        return (
          <Link
            key={idx}
            href={linkMatch[2]}
            className="text-cyan-400 font-bold hover:underline inline-flex items-center gap-0.5"
          >
            {linkMatch[1]}
          </Link>
        );
      }
      return chunk;
    });
  };

  // ── Rich Markdown, Tables & Code block visual renderer ──
  const renderMessageContent = (text: string) => {
    // 1. Split code blocks
    const codeParts = text.split(/(```[\s\S]*?```)/g);

    return codeParts.map((block, bIdx) => {
      if (block.startsWith("```") && block.endsWith("```")) {
        const lines = block.slice(3, -3).trim().split("\n");
        const lang = lines[0].trim();
        const codeContent = lang ? lines.slice(1).join("\n") : lines.join("\n");

        return (
          <div
            key={bIdx}
            className="my-3 rounded-xl bg-[#090d18] border border-cyan-500/25 overflow-hidden font-mono text-xs shadow-lg"
          >
            <div className="px-3.5 py-1.5 bg-[#141b2c] border-b border-slate-800 text-slate-400 flex items-center justify-between text-[11px]">
              <span className="text-cyan-400 font-bold">{lang || "code"}</span>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(codeContent)}
                className="hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" /> Sao chép
              </button>
            </div>
            <pre className="p-3.5 overflow-x-auto text-cyan-200 leading-relaxed">
              <code>{codeContent}</code>
            </pre>
          </div>
        );
      }

      // 2. Parse lines and detect Table chunks
      const lines = block.split("\n");
      const elements: React.ReactNode[] = [];
      let tableBuffer: string[] = [];

      const flushTable = (keyIndex: number) => {
        if (tableBuffer.length >= 2) {
          const headerCells = tableBuffer[0]
            .split("|")
            .map((c) => c.trim())
            .filter((c) => c.length > 0);

          const bodyLines = tableBuffer
            .slice(1)
            .filter((l) => !/^[\s|:-]+$/.test(l.trim()));

          elements.push(
            <div
              key={`table-${keyIndex}`}
              className="my-3.5 overflow-x-auto rounded-xl border border-cyan-500/30 bg-[#0d1322] shadow-xl"
            >
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#141d32] border-b border-cyan-500/20 text-cyan-300">
                  <tr>
                    {headerCells.map((h, hIdx) => (
                      <th
                        key={hIdx}
                        className="px-4 py-2.5 font-bold uppercase tracking-wider text-[11px]"
                      >
                        {renderInlineText(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {bodyLines.map((bLine, rIdx) => {
                    const cells = bLine
                      .split("|")
                      .map((c) => c.trim())
                      .filter((c) => c.length > 0);
                    return (
                      <tr key={rIdx} className="hover:bg-cyan-500/5 transition-colors">
                        {cells.map((cell, cIdx) => (
                          <td key={cIdx} className="px-4 py-2.5 text-slate-200">
                            {renderInlineText(cell)}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
          tableBuffer = [];
        } else if (tableBuffer.length > 0) {
          tableBuffer.forEach((tblLine, idx) => {
            elements.push(
              <p key={`tbl-fallback-${keyIndex}-${idx}`} className="my-1 text-slate-200">
                {renderInlineText(tblLine)}
              </p>
            );
          });
          tableBuffer = [];
        }
      };

      lines.forEach((line, lIdx) => {
        const trimmed = line.trim();

        // Table line detection
        if (trimmed.startsWith("|") && trimmed.endsWith("|") && trimmed.length > 2) {
          tableBuffer.push(trimmed);
          return;
        }

        if (tableBuffer.length > 0) {
          flushTable(lIdx);
        }

        if (!trimmed) {
          elements.push(<div key={`br-${lIdx}`} className="h-1.5" />);
          return;
        }

        // Heading 3
        if (trimmed.startsWith("### ")) {
          elements.push(
            <h3
              key={`h3-${lIdx}`}
              className="text-base font-bold text-white mt-3 mb-1.5 flex items-center gap-1.5"
            >
              {renderInlineText(trimmed.replace(/^###\s+/, ""))}
            </h3>
          );
          return;
        }

        // Heading 2
        if (trimmed.startsWith("## ")) {
          elements.push(
            <h2
              key={`h2-${lIdx}`}
              className="text-lg font-bold text-cyan-300 mt-4 mb-2 pb-1 border-b border-cyan-500/20"
            >
              {renderInlineText(trimmed.replace(/^##\s+/, ""))}
            </h2>
          );
          return;
        }

        // Heading 1
        if (trimmed.startsWith("# ")) {
          elements.push(
            <h1 key={`h1-${lIdx}`} className="text-xl font-extrabold text-white mt-4 mb-2">
              {renderInlineText(trimmed.replace(/^#\s+/, ""))}
            </h1>
          );
          return;
        }

        // Bullet items (- or *)
        if (/^[-*]\s+/.test(trimmed)) {
          elements.push(
            <div key={`li-${lIdx}`} className="flex items-start gap-2 text-slate-200 my-1 ml-1">
              <span className="text-cyan-400 mt-1 shrink-0">•</span>
              <div className="flex-1">{renderInlineText(trimmed.replace(/^[-*]\s+/, ""))}</div>
            </div>
          );
          return;
        }

        // Numbered items (1. 2.)
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          elements.push(
            <div key={`num-${lIdx}`} className="flex items-start gap-2 text-slate-200 my-1 ml-1">
              <span className="font-mono text-cyan-400 font-bold shrink-0">{numMatch[1]}.</span>
              <div className="flex-1">{renderInlineText(numMatch[2])}</div>
            </div>
          );
          return;
        }

        // Normal paragraph
        elements.push(
          <p key={`p-${lIdx}`} className="my-1 text-slate-200 leading-relaxed">
            {renderInlineText(line)}
          </p>
        );
      });

      if (tableBuffer.length > 0) {
        flushTable(lines.length);
      }

      return <div key={`block-${bIdx}`} className="space-y-0.5">{elements}</div>;
    });
  };

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col font-sans bg-[#0a0e1a] rounded-2xl border border-[#7bd1fa]/15 overflow-hidden relative">
      {/* Header */}
      <header className="p-4 bg-[#0f1524]/80 border-b border-[#7bd1fa]/15 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 p-[1px] shadow-[0_0_15px_rgba(6,182,212,0.35)]">
            <div className="w-full h-full bg-[#0a0e1a] rounded-[11px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-300" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-base text-white flex items-center gap-2">
              Trợ Lý Học Tập AI E-V-E <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </h1>
            <p className="text-xs text-[#8e9bb4]">
              {hasApiKeyActive
                ? "⚡ Đang kết nối mô hình Google Gemini AI trực tiếp"
                : "Đồng hành 24/7 cùng lộ trình học tập của bạn"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowKeyModal(true)}
          className={`px-3 py-1.5 rounded-xl border font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
            hasApiKeyActive
              ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
              : "bg-[#151b2c] text-slate-400 border-slate-700 hover:text-white"
          }`}
          title="Cài đặt Google Gemini API Key"
        >
          <Key className="w-3.5 h-3.5" />
          <span>{hasApiKeyActive ? "Gemini Key ✓" : "Cài đặt API Key"}</span>
        </button>
      </header>

      {/* Message Stream */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
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
                  ? "bg-cyan-500 text-black border-cyan-400 font-bold"
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
                    ? "bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 text-white rounded-tr-none shadow-md"
                    : "bg-[#0f1524]/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-lg"
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
        {isSending && (
          <div className="flex gap-3 max-w-xl mr-auto animate-pulse">
            <div className="w-8 h-8 rounded-xl shrink-0 bg-[#151b2c] text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-[#0f1524] border border-slate-800 text-xs text-cyan-300 rounded-tl-none flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
              <span>AI E-V-E đang suy nghĩ và tổng hợp câu trả lời...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Questions */}
      <div className="px-4 py-2 bg-[#0b0f1a] border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto shrink-0">
        <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1 shrink-0">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Gợi ý:
        </span>
        {[
          "Có những game nào trên web?",
          "Bảng xếp hạng học sinh hiện tại?",
          "Giải thích biến số và vòng lặp trong Python",
          "CPU và RAM khác nhau thế nào?",
        ].map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(prompt)}
            className="px-3 py-1 rounded-full bg-[#151b2c] hover:bg-[#1f2840] border border-slate-800 hover:border-cyan-500/30 text-xs text-slate-300 hover:text-cyan-300 transition-all shrink-0 cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* ── Chat Input Area (No Attachment) ── */}
      <div className="p-4 bg-[#0f1524]/90 border-t border-[#7bd1fa]/15 shrink-0">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          {/* Input */}
          <input
            type="text"
            placeholder="Đặt câu hỏi cho AI E-V-E (toán học, lập trình Python, bài tập, game, lộ trình...)"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isSending}
            className="flex-1 bg-[#151b2c] border border-[#7bd1fa]/20 rounded-xl px-4 py-3 text-sm text-white placeholder-[#8e9bb4] focus:outline-none focus:border-cyan-400 transition-all disabled:opacity-50"
          />

          {/* Microphone */}
          <button
            type="button"
            className="p-2.5 rounded-xl bg-[#151b2c] border border-[#7bd1fa]/20 text-[#8e9bb4] hover:text-white transition-all cursor-pointer"
            title="Nhập bằng giọng nói"
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Send */}
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={isSending || !inputMessage.trim()}
            className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-medium shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── MODAL CÀI ĐẶT API KEY ── */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0f1524] border border-cyan-500/40 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-cyan-400" /> Cài Đặt Google Gemini API Key
              </h3>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#8e9bb4] leading-relaxed">
              Để AI Tutor suy nghĩ và trả lời linh hoạt 100% mọi câu hỏi thực tế (như ChatGPT / Gemini Live), bạn hãy nhập Google Gemini API Key bên dưới:
            </p>

            <form onSubmit={handleSaveApiKey} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Gemini API Key (AIzaSy...):
                </label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Dán mã API Key của bạn vào đây"
                  className="w-full bg-[#151b2c] border border-cyan-500/30 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none"
                />
                <span className="text-[11px] text-slate-500 block mt-1">
                  Lấy miễn phí tại: <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">aistudio.google.com</a>
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono hover:bg-slate-700 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold transition-all cursor-pointer"
                >
                  Lưu & Kích Hoạt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
