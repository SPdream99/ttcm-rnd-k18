"use client";

import { useState } from "react";
import {
  Bot,
  Send,
  Paperclip,
  Mic,
  ThumbsUp,
  Copy,
  MessageSquare,
  ChevronRight,
  Zap,
  User,
} from "lucide-react";



export default function StudentAITutorPage() {
  type Message = {
    id: number;
    sender: "user" | "ai";
    text: string;
    time: string;
  };
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSendMessage = async () => {

    // Không cho gửi message rỗng
    if (!inputMessage.trim()) {
      return;
    }

    // Lưu lại câu hỏi trước khi clear input
    const currentMessage = inputMessage;

    // Tạo message của user
    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: currentMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Hiển thị câu hỏi user
    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    // Xóa input
    setInputMessage("");

    // Loading
    setLoading(true);

    try {

      // Gọi API Next.js
      const response = await fetch("/api/tutor", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          message: currentMessage,
        }),
      });

      const data = await response.json();
console.log("API response:", data);
      // Nếu API lỗi
      if (!response.ok) {
        throw new Error(
          data.error || "AI Tutor error"
        );
      }

      // Tạo message AI
      const aiMessage: Message = {
        id: Date.now() + 1,
        sender: "ai",
        text: data.reply,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      // Hiển thị câu trả lời AI
      setMessages((prev) => [
        ...prev,
        aiMessage,
      ]);

    } catch (error) {

      console.error(
        "AI Tutor error:",
        error
      );

      // Hiển thị lỗi
      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: "ai",
        text: "Xin lỗi, AI Tutor đang gặp lỗi. Vui lòng thử lại.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [
        ...prev,
        errorMessage,
      ]);

    } finally {

      setLoading(false);

    }
  };





  return (
    <div className="min-h-screen bg-[#0a0e1a] text-[#e1e2ec] flex flex-col md:flex-row relative font-sans">
      {/* Sidebar - Chat History */}

      {/* Bổ sung sau */}


      {/* Main Chat Interface */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0a0e1a]">
        {/* Header */}
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
              <p className="text-xs text-[#8e9bb4]">Được tối ưu hóa theo chương trình học của bạn</p>
            </div>
          </div>
        </header>

        {/* Message Stream */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">

          {messages.length === 0 && (

            <div className="flex flex-col items-center justify-center h-full text-center">

              <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center mb-4">

                <Bot className="w-8 h-8 text-cyan-300" />

              </div>

              <h2 className="text-xl font-semibold">
                Xin chào 👋
              </h2>

              <p className="text-gray-400 mt-2">
                Tôi là AI Tutor của E-V-E.
              </p>

              <p className="text-gray-500 text-sm mt-1">
                Bạn có thể hỏi tôi bất kỳ câu hỏi học tập nào.
              </p>

            </div>

          )}


          {/* Messages */}

          {messages.map((msg) => (

            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${msg.sender === "user"
                ? "ml-auto flex-row-reverse"
                : ""
                }`}
            >

              {/* Avatar */}

              <div
                className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center border ${msg.sender === "ai"
                  ? "bg-cyan-500/20 border-cyan-400/40 text-cyan-300"
                  : "bg-blue-600/30 border-blue-400/40 text-white"
                  }`}
              >

                {msg.sender === "ai" ? (
                  <Bot className="w-5 h-5" />
                ) : (
                  <User className="w-5 h-5" />
                )}

              </div>


              {/* Message */}

              <div>

                <div
                  className={`rounded-2xl px-4 py-3 ${msg.sender === "ai"
                    ? "bg-[#0f1524] border border-cyan-400/10"
                    : "bg-blue-600"
                    }`}
                >

                  <p className="whitespace-pre-wrap">
                    {msg.text}
                  </p>

                </div>

                <p className="text-xs text-gray-500 mt-1">
                  {msg.time}
                </p>

              </div>

            </div>

          ))}


          {/* AI Loading */}

          {loading && (

            <div className="flex gap-3">

              <div className="w-9 h-9 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">

                <Bot className="w-5 h-5 text-cyan-300" />

              </div>

              <div className="rounded-2xl bg-[#0f1524] border border-cyan-400/10 px-4 py-3">

                <p className="text-gray-400">
                  AI Tutor đang suy nghĩ...
                </p>

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
              placeholder="Đặt câu hỏi cho AI E-V-E..."
              value={inputMessage}
              onChange={(e) =>
                setInputMessage(e.target.value)
              }
              onKeyDown={(e) => {

                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSendMessage();
                }

              }}
              disabled={loading}
              className="flex-1 bg-[#151b2c] border border-[#7bd1fa]/20 rounded-xl px-4 py-3 text-sm text-white placeholder-[#8e9bb4] focus:outline-none focus:border-cyan-400 transition-all disabled:opacity-50"
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
              disabled={
                loading ||
                !inputMessage.trim()
              }
              className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-medium shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >

              <Send className="w-4 h-4" />

            </button>

          </div>

        </div>
      </main>
    </div>
  );
}
