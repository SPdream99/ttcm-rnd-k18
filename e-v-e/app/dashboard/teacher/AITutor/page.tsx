"use client";

import React, { useState } from "react";
import { useAITutorAdapter } from "@/hooks/useAITutorAdapter";
import {
  Bot,
  Send,
  Paperclip,
  Mic,
  User,
} from "lucide-react";

export default function TeacherAITutorPage() {
  const { messages, isSending, sendMessage } = useAITutorAdapter();
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) {
      return;
    }
    const msg = inputMessage;
    setInputMessage("");
    await sendMessage(msg);
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-[#e1e2ec] flex flex-col md:flex-row relative font-sans">
      {/* Main Chat Interface */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0a0e1a]">
        <header className="p-4 bg-[#0f1524]/60 border-b border-[#7bd1fa]/15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-600 p-[1px]">
              <div className="w-full h-full bg-[#0a0e1a] rounded-[11px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-emerald-300" />
              </div>
            </div>
            <div>
              <h1 className="font-bold text-base text-white flex items-center gap-2">
                Trợ Lý Soạn Bài & Giảng Dạy AI E-V-E <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </h1>
              <p className="text-xs text-[#8e9bb4]">Đồng hành cùng giảng viên tạo giáo án, ngân hàng đề và lộ trình</p>
            </div>
          </div>
        </header>

        {/* Message Stream */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center mb-4">
                <Bot className="w-8 h-8 text-emerald-300" />
              </div>
              <h2 className="text-xl font-semibold">Xin chào Thầy/Cô 👋</h2>
              <p className="text-gray-400 mt-2">
                Tôi là Trợ Lý AI Giáo Dục của E-V-E.
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Thầy/Cô có thể yêu cầu tạo đề thi, gợi ý câu hỏi Quiz, soạn giáo án hoặc phân tích tiến độ học sinh.
              </p>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${
                msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center border ${
                  msg.sender === "ai"
                    ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-300"
                    : "bg-teal-600/30 border-teal-400/40 text-white"
                }`}
              >
                {msg.sender === "ai" ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>

              {/* Message */}
              <div>
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    msg.sender === "ai"
                      ? "bg-[#0f1524] border border-emerald-400/10"
                      : "bg-emerald-600 text-white"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">{msg.timestamp}</p>
              </div>
            </div>
          ))}

          {/* AI Loading */}
          {isSending && (
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
                <Bot className="w-5 h-5 text-emerald-300" />
              </div>
              <div className="rounded-2xl bg-[#0f1524] border border-emerald-400/10 px-4 py-3">
                <p className="text-gray-400">Trợ Lý AI đang suy nghĩ câu trả lời...</p>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#0f1524]/90 border-t border-[#7bd1fa]/15">
          <div className="max-w-4xl mx-auto relative flex items-center gap-2">
            {/* Attachment */}
            <button
              type="button"
              className="p-2.5 rounded-xl bg-[#151b2c] border border-[#7bd1fa]/20 text-[#8e9bb4] hover:text-white transition-all"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Input */}
            <input
              type="text"
              placeholder="Yêu cầu AI soạn câu hỏi, đề cương hoặc phân tích bài học..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isSending}
              className="flex-1 bg-[#151b2c] border border-[#7bd1fa]/20 rounded-xl px-4 py-3 text-sm text-white placeholder-[#8e9bb4] focus:outline-none focus:border-emerald-400 transition-all disabled:opacity-50"
            />

            {/* Microphone */}
            <button
              type="button"
              className="p-2.5 rounded-xl bg-[#151b2c] border border-[#7bd1fa]/20 text-[#8e9bb4] hover:text-white transition-all"
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Send */}
            <button
              type="button"
              onClick={handleSendMessage}
              disabled={isSending || !inputMessage.trim()}
              className="p-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-medium shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
