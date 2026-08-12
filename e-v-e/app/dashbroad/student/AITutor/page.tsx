"use client";

import React, { useState } from "react";
import {
  Bot,
  Send,
  Sparkles,
  Paperclip,
  Mic,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Clock,
  Plus,
  MessageSquare,
  ChevronRight,
  BookOpen,
  Zap,
  User,
} from "lucide-react";

export default function StudentAITutorPage() {
  const [inputMessage, setInputMessage] = useState("");
  const [activeSession, setActiveSession] = useState(1);

  const historySessions = [
    { id: 1, title: "Vướng víu Lượng tử & Thí nghiệm Bell", time: "10 phút trước", active: true },
    { id: 2, title: "Giải thích Transformer Architecture", time: "Hôm qua", active: false },
    { id: 3, title: "Ôn tập Động lực học chất điểm", time: "3 ngày trước", active: false },
    { id: 4, title: "Giải bài tập Tích phân kép", time: "1 tuần trước", active: false },
  ];

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Xin chào Alex! Tôi là Trợ Lý Học Tập E-V-E AI. Hôm nay tôi có thể giúp bạn giải đáp khái niệm, sửa bài tập hay chuẩn bị kiến thức cho môn học nào?",
      time: "10:30 AM",
    },
    {
      id: 2,
      sender: "user",
      text: "Hãy giải thích hiện tượng vướng víu lượng tử (Quantum Entanglement) một cách trực quan và dễ hiểu nhất!",
      time: "10:31 AM",
    },
    {
      id: 3,
      sender: "ai",
      text: "Hãy tưởng tượng bạn có một đôi găng tay: 1 chiếc tay trái và 1 chiếc tay phải. Bạn bỏ mỗi chiếc găng tay vào một hộp kín hoàn toàn giống nhau mà không nhìn trước.\n\nBây giờ, bạn mang một hộp lên Trạm Vũ Trụ ISS, và để hộp còn lại ở Trái Đất. Ngay khoảnh khắc bạn mở hộp trên ISS và thấy chiếc găng tay TAY TRÁI, bạn LẬP TỨC biết chiếc găng ở Trái Đất là TAY PHẢI - mà không cần nhìn vào chiếc hộp ở Trái Đất!\n\nTrong cơ học lượng tử, hai hạt vướng víu liên kết với nhau chặt chẽ đến mức trạng thái của hạt này quyết định ngay lập tức trạng thái của hạt kia, dù chúng cách xa nhau hàng triệu năm ánh sáng!",
      time: "10:31 AM",
    },
  ]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    const newMsg = {
      id: messages.length + 1,
      sender: "user",
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputMessage("");

    // Simulate AI Response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 2,
          sender: "ai",
          text: `E-V-E AI đã ghi nhận thắc mắc: "${inputMessage}". Đây là phân tích chi tiết dựa trên giáo trình lớp Vật Lý Lượng Tử...`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1000);
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

          {/* History Items */}
          <div className="space-y-1.5 pt-2">
            <div className="text-xs font-semibold text-[#8e9bb4] uppercase tracking-wider px-2 mb-2">Lịch sử hỏi đáp</div>
            {historySessions.map((session) => (
              <div
                key={session.id}
                onClick={() => setActiveSession(session.id)}
                className={`p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-2 border ${activeSession === session.id
                    ? "bg-blue-600/20 border-cyan-400/40 text-white shadow-[0_0_15px_rgba(125,211,252,0.1)]"
                    : "border-transparent text-[#8e9bb4] hover:bg-white/5 hover:text-white"
                  }`}
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

        {/* AI Quick Prompts */}
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
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
                }`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center border ${msg.sender === "ai"
                    ? "bg-cyan-500/20 border-cyan-400/40 text-cyan-300"
                    : "bg-blue-600/30 border-blue-400/40 text-white"
                  }`}
              >
                {msg.sender === "ai" ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`p-4 rounded-2xl space-y-2 border text-sm leading-relaxed ${msg.sender === "user"
                    ? "bg-blue-600/20 border-blue-500/40 text-white rounded-tr-none"
                    : "bg-[#151b2c]/80 border-[#7bd1fa]/15 text-[#e1e2ec] rounded-tl-none shadow-lg"
                  }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div className="flex items-center justify-between text-[11px] text-[#8e9bb4] pt-1">
                  <span>{msg.time}</span>
                  {msg.sender === "ai" && (
                    <div className="flex items-center gap-2">
                      <button className="hover:text-cyan-400 transition-colors"><Copy className="w-3.5 h-3.5" /></button>
                      <button className="hover:text-emerald-400 transition-colors"><ThumbsUp className="w-3.5 h-3.5" /></button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#0f1524]/90 border-t border-[#7bd1fa]/15">
          <div className="max-w-4xl mx-auto relative flex items-center gap-2">
            <button className="p-2.5 rounded-xl bg-[#151b2c] border border-[#7bd1fa]/20 text-[#8e9bb4] hover:text-white transition-all">
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder="Đặt câu hỏi cho AI E-V-E (ví dụ: 'Hãy giải thích công thức Euler')..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 bg-[#151b2c] border border-[#7bd1fa]/20 rounded-xl px-4 py-3 text-sm text-white placeholder-[#8e9bb4] focus:outline-none focus:border-cyan-400 transition-all"
            />

            <button className="p-2.5 rounded-xl bg-[#151b2c] border border-[#7bd1fa]/20 text-[#8e9bb4] hover:text-white transition-all">
              <Mic className="w-4 h-4" />
            </button>

            <button
              onClick={handleSendMessage}
              className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-medium shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
