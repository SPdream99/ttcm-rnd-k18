"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAITutorAdapter } from "@/hooks/useAITutorAdapter";
import {
  Bot,
  Send,
  User,
  Paperclip,
  Mic,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export default function StudentAITutorPage() {
  const { messages, loading, isSending, sendMessage } = useAITutorAdapter();
  const [inputMessage, setInputMessage] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isSending) return;
    const currentMsg = inputMessage.trim();
    setInputMessage("");
    await sendMessage(currentMsg);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Markdown & Code block renderer
  const renderMessageContent = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const lines = part.slice(3, -3).trim().split("\n");
        const lang = lines[0].trim();
        const codeContent = lang ? lines.slice(1).join("\n") : lines.join("\n");

        return (
          <div key={index} className="my-2.5 rounded-xl bg-[#090d18] border border-cyan-500/20 overflow-hidden font-mono text-xs">
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

      const renderedLines = part.split("\n").map((line, lIdx) => {
        const boldParts = line.split(/(\*\*.*?\*\*)/g).map((bChunk, bIdx) => {
          if (bChunk.startsWith("**") && bChunk.endsWith("**")) {
            return <strong key={bIdx} className="text-white font-bold">{bChunk.slice(2, -2)}</strong>;
          }
          return bChunk;
        });

        return (
          <p key={lIdx} className="min-h-[1.2rem]">
            {line.trim() ? boldParts : <br />}
          </p>
        );
      });

      return <div key={index} className="space-y-1">{renderedLines}</div>;
    });
  };

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col font-sans bg-[#0a0e1a] rounded-2xl border border-[#7bd1fa]/15 overflow-hidden">
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
            <p className="text-xs text-[#8e9bb4]">Đồng hành 24/7 cùng lộ trình học tập của bạn</p>
          </div>
        </div>
      </header>

      {/* Message Stream */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-cyan-300" />
            </div>
            <h2 className="text-xl font-semibold text-white">Xin chào 👋</h2>
            <p className="text-gray-400 mt-2 text-sm">Tôi là AI Tutor của E-V-E.</p>
            <p className="text-gray-500 text-xs mt-1">Bạn có thể hỏi tôi bất kỳ câu hỏi học tập nào.</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${
              msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center border ${
                msg.sender === "ai"
                  ? "bg-cyan-500/20 border-cyan-400/40 text-cyan-300"
                  : "bg-blue-600/30 border-blue-400/40 text-white"
              }`}
            >
              {msg.sender === "ai" ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </div>

            {/* Message Bubble */}
            <div>
              <div
                className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.sender === "ai"
                    ? "bg-[#0f1524] border border-cyan-400/15 text-slate-200"
                    : "bg-blue-600 text-white"
                }`}
              >
                {renderMessageContent(msg.text)}
              </div>

              <div
                className={`flex items-center gap-2 text-xs text-gray-500 mt-1 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <span>{msg.timestamp}</span>
                {msg.sender === "ai" && (
                  <button
                    type="button"
                    onClick={() => handleCopy(msg.text, msg.id)}
                    className="hover:text-cyan-400 flex items-center gap-0.5 cursor-pointer ml-1 text-[11px]"
                  >
                    {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === msg.id ? "Đã chép" : "Chép"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* AI Loading Indicator */}
        {isSending && (
          <div className="flex gap-3 mr-auto animate-pulse">
            <div className="w-9 h-9 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-300" />
            </div>
            <div className="rounded-2xl bg-[#0f1524] border border-cyan-400/15 px-4 py-3">
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" /> AI Tutor đang suy nghĩ...
              </p>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-[#0f1524]/90 border-t border-[#7bd1fa]/15 shrink-0">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          {/* Attachment */}
          <button
            type="button"
            className="p-2.5 rounded-xl bg-[#151b2c] border border-[#7bd1fa]/20 text-[#8e9bb4] hover:text-white transition-all cursor-pointer"
            title="Đính kèm tệp"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Input */}
          <input
            type="text"
            placeholder="Đặt câu hỏi cho AI E-V-E (toán học, lập trình Python, bài tập...)"
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
            onClick={handleSendMessage}
            disabled={isSending || !inputMessage.trim()}
            className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-medium shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
