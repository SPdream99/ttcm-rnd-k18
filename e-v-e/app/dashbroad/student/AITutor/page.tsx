"use client";

import React, { useState } from "react";
import { useAITutorAdapter } from "@/hooks/useAITutorAdapter";
import {
  Bot,
  Send,
  Sparkles,
  Paperclip,
  Mic,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Plus,
  MessageSquare,
  ChevronRight,
  Zap,
  User,
} from "lucide-react";

export default function StudentAITutorPage() {
  const [inputMessage, setInputMessage] = useState("");
  const { messages, isSending, sendMessage } = useAITutorAdapter();

  const handleSend = () => {
    if (!inputMessage.trim() || isSending) return;
    sendMessage(inputMessage);
    setInputMessage("");
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-[#e1e2ec] flex flex-col md:flex-row relative font-sans">
      {/* Sidebar - Chat History */}
      <aside className="w-full md:w-80 bg-[#0f1524]/80 backdrop-blur-xl border-r border-[#7bd1fa]/15 p-4 flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-cyan-400 animate-pulse" />
              <h2 className="font-bold text-lg text-white">E-V-E AI Tutor</h2>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
              v2.5 PRO
            </span>
          </div>

          <button className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-medium text-sm shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Cuộc Hội Thoại Mới
          </button>

          <div className="space-y-1.5 pt-2">
            <div className="text-xs font-semibold text-[#8e9bb4] uppercase tracking-wider px-2 mb-2">Lịch sử hỏi đáp</div>
            {[
              { id: 1, title: "Vướng víu Lượng tử & Thí nghiệm Bell" },
              { id: 2, title: "Giải thích Transformer Architecture" },
            ].map((session) => (
              <div
                key={session.id}
                className="p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-2 border border-transparent text-[#8e9bb4] hover:bg-white/5 hover:text-white"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <MessageSquare className="w-4 h-4 shrink-0 text-cyan-400" />
                  <span className="text-xs font-medium truncate">{session.title}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-50" />
              </div>
            ))}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#151b2c] border border-[#7bd1fa]/15 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
            <Zap className="w-3.5 h-3.5" /> Gợi ý câu hỏi nhanh
          </div>
          <div className="space-y-1 text-xs text-[#8e9bb4]">
            <button onClick={() => setInputMessage("Tóm tắt chương 4 Vật lý lượng tử")} className="w-full text-left p-1.5 rounded-lg hover:bg-white/5 hover:text-white transition-colors truncate">
              • Tóm tắt chương 4 Vật lý lượng tử
            </button>
            <button onClick={() => setInputMessage("Tạo 3 câu trắc nghiệm luyện tập")} className="w-full text-left p-1.5 rounded-lg hover:bg-white/5 hover:text-white transition-colors truncate">
              • Tạo 3 câu trắc nghiệm luyện tập
            </button>
          </div>
        </div>
      </aside>

      {/* Main Chat Interface */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0a0e1a]">
        <header className="p-4 bg-[#0f1524]/60 border-b border-[#7bd1fa]/15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 p-[1px]">
              <div className="w-full h-full bg-[#0a0e1a] rounded-[11px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-cyan-300" />
              </div>
            </div>
            <div>
              <h1 className="font-bold text-base text-white flex items-center gap-2">
                Trợ Lý Học Tập AI E-V-E <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </h1>
              <p className="text-xs text-[#8e9bb4]">Đồng hành 24/7 cùng lộ trình tri thức của bạn</p>
            </div>
          </div>
        </header>

        {/* Message Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              {msg.sender === "ai" && (
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 border border-cyan-500/30">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-2xl space-y-2 ${msg.sender === "user" ? "items-end text-right" : "items-start"}`}>
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-tr-none"
                      : "bg-[#151b2c] border border-[#7bd1fa]/15 text-[#e1e2ec] rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>

                <div className="flex items-center gap-2 text-[10px] text-[#8e9bb4] px-1">
                  <span>{msg.timestamp}</span>
                  {msg.sender === "ai" && (
                    <div className="flex items-center gap-1.5 ml-2">
                      <button className="hover:text-white"><Copy className="w-3 h-3" /></button>
                      <button className="hover:text-white"><ThumbsUp className="w-3 h-3" /></button>
                      <button className="hover:text-white"><ThumbsDown className="w-3 h-3" /></button>
                    </div>
                  )}
                </div>
              </div>

              {msg.sender === "user" && (
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 border border-purple-500/30">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
          {isSending && (
            <div className="flex gap-4 items-center text-xs text-cyan-400">
              <Sparkles className="w-4 h-4 animate-spin" /> E-V-E AI đang suy nghĩ...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#0f1524]/80 border-t border-[#7bd1fa]/15">
          <div className="max-w-4xl mx-auto flex items-center gap-2 bg-[#151b2c] border border-[#7bd1fa]/20 rounded-2xl p-2 focus-within:border-cyan-400 transition-all">
            <button className="p-2 text-[#8e9bb4] hover:text-white transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>

            <input
              type="text"
              placeholder="Đặt câu hỏi cho E-V-E AI Tutor..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 bg-transparent border-none text-sm text-white placeholder-[#8e9bb4] focus:outline-none px-2"
            />

            <button className="p-2 text-[#8e9bb4] hover:text-white transition-colors">
              <Mic className="w-5 h-5" />
            </button>

            <button
              onClick={handleSend}
              disabled={isSending}
              className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-medium shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
