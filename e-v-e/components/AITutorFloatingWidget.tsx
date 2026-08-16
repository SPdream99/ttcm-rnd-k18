"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  User,
  Send,
  Sparkles,
  Key,
  Copy,
  Maximize2,
  Trash2,
  X,
  Brain,
  BrainCircuit,
  RotateCcw,
  Check,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { getDecryptedAIKey, hasAIKey } from "@/lib/secureKeyStorage";
import {
  ChatMessage,
  getChatHistory,
  saveChatHistory,
  clearChatHistory,
  isMemoryEnabled,
  setMemoryEnabled,
  CHAT_UPDATED_EVENT,
} from "@/lib/aiChatStorage";
import { getCurrentLivePageContext } from "@/lib/pageContextService";
import { useToast } from "@/components/Toast";

export default function AITutorFloatingWidget() {
  const pathname = usePathname();
  const toast = useToast();
  const { currentUser, profile } = useAuthAdapter();

  const userRole = (currentUser?.role || profile?.role || "student") as "student" | "teacher" | "admin";
  const isTeacher = userRole === "teacher";
  const studentName =
    currentUser?.name ||
    (currentUser as any)?.fullName ||
    profile?.fullName ||
    (isTeacher ? "Thầy/Cô" : "bạn");

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [memoryActive, setMemoryActive] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 1. Tải và đồng bộ lịch sử chat & trạng thái trí nhớ
  useEffect(() => {
    const hasKey = hasAIKey();
    setMessages(getChatHistory(studentName, hasKey));
    setMemoryActive(isMemoryEnabled());

    const handleChatUpdate = () => {
      setMessages(getChatHistory(studentName, hasAIKey()));
      setMemoryActive(isMemoryEnabled());
    };

    window.addEventListener(CHAT_UPDATED_EVENT, handleChatUpdate);
    window.addEventListener("storage", handleChatUpdate);

    return () => {
      window.removeEventListener(CHAT_UPDATED_EVENT, handleChatUpdate);
      window.removeEventListener("storage", handleChatUpdate);
    };
  }, [studentName]);

  // Cuộn xuống tin nhắn mới
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isSending, isOpen]);

  // Focus ô nhập liệu khi mở popup
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Tự động ẩn popup ở trang gia sư toàn màn hình của cả học sinh và giáo viên
  if (pathname === "/student/ai-tutor" || pathname === "/teacher/ai-tutor") {
    return null;
  }

  const handleToggleMemory = () => {
    const nextState = !memoryActive;
    setMemoryActive(nextState);
    setMemoryEnabled(nextState);
    if (nextState) {
      toast.success("Đã BẬT tính năng Trí Nhớ: Gia sư sẽ nhớ ngữ cảnh các câu hỏi trước.", "Trí Nhớ AI");
    } else {
      toast.info("Đã TẮT Trí Nhớ: Gia sư chỉ phản hồi câu hỏi hiện tại độc lập.", "Trí Nhớ AI");
    }
  };

  const handleClearMemory = () => {
    const hasKey = hasAIKey();
    const fresh = clearChatHistory(studentName, hasKey);
    setMessages(fresh);
    setShowClearConfirm(false);
    toast.success("Đã xóa sạch toàn bộ lịch sử trò chuyện & làm mới trí nhớ của Gia sư!", "Xóa Trí Nhớ");
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

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    saveChatHistory(nextMessages);
    if (!textToSend) setInputMessage("");
    setIsSending(true);

    try {
      const storedKey = getDecryptedAIKey();
      const liveContext = getCurrentLivePageContext(userRole);

      // Chuẩn bị lịch sử hội thoại nếu tính năng Trí nhớ đang BẬT
      const conversationHistory = memoryActive
        ? messages
            .filter((m) => m.id !== "msg-welcome-default")
            .slice(-12)
            .map((m) => ({
              role: m.sender === "user" ? "user" : "model",
              text: m.text,
            }))
        : [];

      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          apiKey: storedKey || undefined,
          role: userRole,
          history: conversationHistory,
          pageContext: liveContext,
        }),
      });

      const data = await res.json();
      const reply = data.reply || "Xin lỗi, hiện tại tôi chưa nhận được phản hồi. Bạn thử lại nhé!";

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: reply,
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      };

      const finalMessages = [...nextMessages, aiMsg];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
    } catch {
      const errorMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: "Đã xảy ra lỗi kết nối. Vui lòng kiểm tra lại mạng hoặc khóa API Key.",
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      };
      const finalMessages = [...nextMessages, errorMsg];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
    } finally {
      setIsSending(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

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
          <code key={pIdx} className="px-1 py-0.5 rounded bg-zinc-100 text-red-600 font-mono text-[10px] border border-zinc-200">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  const renderMessageContent = (text: string) => {
    const blocks = text.split(/(```[\s\S]*?```)/g);

    return blocks.map((block, bIdx) => {
      if (block.startsWith("```") && block.endsWith("```")) {
        const lines = block.slice(3, -3).trim().split("\n");
        const lang = lines[0].trim();
        const code = (lang ? lines.slice(1) : lines).join("\n");

        return (
          <div key={bIdx} className="my-1.5 rounded-lg bg-zinc-900 text-zinc-100 p-2.5 text-[11px] font-mono overflow-x-auto">
            <div className="flex justify-between items-center pb-1 mb-1.5 border-b border-zinc-700 text-zinc-400 text-[10px]">
              <span>{lang || "code"}</span>
              <button
                onClick={() => navigator.clipboard.writeText(code)}
                className="flex items-center gap-1 hover:text-white cursor-pointer"
              >
                <Copy className="w-3 h-3" /> Chép
              </button>
            </div>
            <code>{code}</code>
          </div>
        );
      }

      return (
        <div key={bIdx} className="whitespace-pre-wrap leading-relaxed text-xs">
          {renderFormattedText(block)}
        </div>
      );
    });
  };

  return (
    <>
      {/* ── NÚT BẤM FLOATING ICON GÓC PHẢI DƯỚI ── */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-40 p-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 cursor-pointer flex items-center gap-2 group border-2 border-white/20"
          title={isTeacher ? "Mở Trợ Giảng Sư Phạm E-V-E Mini" : "Mở Gia Sư Học Tập E-V-E Mini"}
          aria-label={isTeacher ? "Mở Trợ Giảng Sư Phạm E-V-E Mini" : "Mở Gia Sư Học Tập E-V-E Mini"}
        >
          <div className="relative">
            <Bot className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-red-600 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-red-600" />
          </div>
          <span className="hidden sm:inline font-bold text-xs pr-1">
            {isTeacher ? "Trợ Giảng AI" : "Gia Sư E-V-E"}
          </span>
        </button>
      )}

      {/* ── POPUP KHUNG CHAT BÉ (MINI POPUP CHAT) ── */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[92vw] sm:w-[400px] h-[540px] max-h-[85vh] bg-white border-2 border-red-600 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <header className="p-3.5 bg-white border-b border-zinc-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold relative shrink-0">
                <Bot className="w-4 h-4" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-xs text-zinc-900 truncate flex items-center gap-1.5">
                  {isTeacher ? "Trợ Giảng Sư Phạm" : "Gia Sư E-V-E"} <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-100 text-red-700 font-semibold">Mini</span>
                </h3>
                <p className="text-[10px] text-zinc-500 truncate">
                  {isTeacher ? "Cố vấn giáo án & soạn bài 24/7" : "Hỏi đáp & Hỗ trợ bài học 24/7"}
                </p>
              </div>
            </div>

            {/* Actions Controls */}
            <div className="flex items-center gap-1">
              {/* Nút Bật/Tắt Trí Nhớ */}
              <button
                type="button"
                onClick={handleToggleMemory}
                className={`p-1.5 rounded-lg border text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                  memoryActive
                    ? "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                    : "bg-zinc-100 text-zinc-400 border-zinc-200 hover:text-zinc-600"
                }`}
                title={memoryActive ? "Trí nhớ AI: ĐANG BẬT (Nhớ lịch sử hội thoại). Bấm để Tắt" : "Trí nhớ AI: ĐANG TẮT. Bấm để Bật"}
              >
                <BrainCircuit className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{memoryActive ? "Nhớ" : "Tắt nhớ"}</span>
              </button>

              {/* Nút Xóa Toàn Bộ Trí Nhớ */}
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="p-1.5 rounded-lg bg-zinc-100 hover:bg-red-50 text-zinc-600 hover:text-red-600 border border-zinc-200 transition-colors cursor-pointer"
                title="Xóa toàn bộ lịch sử trò chuyện & làm mới trí nhớ"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Nút Mở Toàn Màn Hình */}
              <Link
                href={isTeacher ? "/teacher/ai-tutor" : "/student/ai-tutor"}
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 transition-colors cursor-pointer"
                title={isTeacher ? "Mở toàn màn hình Trợ Giảng AI" : "Mở toàn màn hình Gia Sư AI"}
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </Link>

              {/* Nút Đóng Popup */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 transition-colors cursor-pointer"
                title="Thu nhỏ cửa sổ"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </header>

          {/* Live Page Context Awareness Banner */}
          <div className="px-3.5 py-1.5 bg-red-50/80 border-b border-red-100 flex items-center justify-between text-[10px] text-zinc-600 shrink-0">
            <span className="flex items-center gap-1.5 truncate font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse shrink-0" />
              <span className="truncate">📍 <strong className="text-zinc-800">{getCurrentLivePageContext(userRole).pageName}</strong></span>
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-white text-red-700 border border-red-200 font-bold shrink-0 shadow-2xs">
              Live Context
            </span>
          </div>

          {/* Modal xác nhận xóa trí nhớ */}
          {showClearConfirm && (
            <div className="p-3 bg-red-50 border-b border-red-200 text-xs text-red-900 flex items-center justify-between gap-2 shrink-0 animate-in fade-in">
              <span className="font-semibold text-[11px]">Xác nhận xóa sạch lịch sử chat & trí nhớ?</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleClearMemory}
                  className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold cursor-pointer"
                >
                  Xóa
                </button>
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="px-2 py-1 rounded bg-zinc-200 hover:bg-zinc-300 text-zinc-700 text-[10px] font-bold cursor-pointer"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}

          {/* Message Stream */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 bg-zinc-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 max-w-[90%] ${
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-white text-[10px] font-bold mt-0.5 ${
                    msg.sender === "user" ? "bg-zinc-800" : "bg-red-600"
                  }`}
                >
                  {msg.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`p-3 rounded-2xl relative group ${
                    msg.sender === "user"
                      ? "bg-red-600 text-white rounded-tr-xs"
                      : "bg-white border border-zinc-200 text-zinc-900 rounded-tl-xs shadow-2xs"
                  }`}
                >
                  {renderMessageContent(msg.text)}

                  <div
                    className={`flex items-center justify-between gap-2 mt-1 pt-1 border-t text-[9px] ${
                      msg.sender === "user"
                        ? "border-red-500/50 text-red-100"
                        : "border-zinc-100 text-zinc-400"
                    }`}
                  >
                    <span>{msg.timestamp}</span>

                    {msg.sender === "ai" && (
                      <button
                        onClick={() => handleCopy(msg.text, msg.id)}
                        className="opacity-0 group-hover:opacity-100 hover:text-zinc-700 transition-opacity flex items-center gap-1 cursor-pointer"
                        title="Sao chép câu trả lời"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-2.5 h-2.5 text-emerald-600" />
                            <span className="text-emerald-600">Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-2.5 h-2.5" />
                            <span>Chép</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex gap-2 max-w-[85%] mr-auto">
                <div className="w-6 h-6 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="p-3 rounded-2xl bg-white border border-zinc-200 text-zinc-500 rounded-tl-xs shadow-2xs text-xs flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-red-600 animate-spin" />
                  <span>{isTeacher ? "Trợ giảng đang suy nghĩ..." : "Gia sư đang suy nghĩ..."}</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Questions Helper */}
          <div className="px-3 py-1.5 bg-white border-t border-zinc-100 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0 no-scrollbar">
            {isTeacher ? (
              <>
                <button
                  type="button"
                  onClick={() => handleSendMessage("Gợi ý mẫu JSON Pairs 4 câu hỏi trắc nghiệm cho bài học")}
                  className="px-2 py-1 rounded-full bg-zinc-100 hover:bg-red-50 hover:text-red-700 text-zinc-600 whitespace-nowrap transition-colors cursor-pointer text-[10px]"
                >
                  📝 Sinh JSON Pairs
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage("Hướng dẫn thiết kế lộ trình học tập tối ưu cho học sinh")}
                  className="px-2 py-1 rounded-full bg-zinc-100 hover:bg-red-50 hover:text-red-700 text-zinc-600 whitespace-nowrap transition-colors cursor-pointer text-[10px]"
                >
                  🗺️ Soạn Lộ Trình
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage("Cách tích hợp Game SDK và cấu hình Extra Data")}
                  className="px-2 py-1 rounded-full bg-zinc-100 hover:bg-red-50 hover:text-red-700 text-zinc-600 whitespace-nowrap transition-colors cursor-pointer text-[10px]"
                >
                  🎮 Hướng Dẫn SDK
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleSendMessage("Hướng dẫn học lập trình Python")}
                  className="px-2 py-1 rounded-full bg-zinc-100 hover:bg-red-50 hover:text-red-700 text-zinc-600 whitespace-nowrap transition-colors cursor-pointer text-[10px]"
                >
                  🐍 Học Python
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage("Xem bảng xếp hạng học sinh top đầu")}
                  className="px-2 py-1 rounded-full bg-zinc-100 hover:bg-red-50 hover:text-red-700 text-zinc-600 whitespace-nowrap transition-colors cursor-pointer text-[10px]"
                >
                  🏆 BXH Top
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage("Gợi ý trò chơi luyện trí nhớ")}
                  className="px-2 py-1 rounded-full bg-zinc-100 hover:bg-red-50 hover:text-red-700 text-zinc-600 whitespace-nowrap transition-colors cursor-pointer text-[10px]"
                >
                  🎮 Chơi Game
                </button>
              </>
            )}
          </div>

          {/* Input Form */}
          <div className="p-3 bg-white border-t border-zinc-200 shrink-0">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder={isTeacher ? "Hỏi Trợ giảng AI về bài giảng, câu hỏi..." : "Hỏi gia sư AI bất kỳ điều gì..."}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isSending}
                className="flex-1 bg-zinc-50 border border-zinc-300 focus:border-red-600 rounded-xl px-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none transition-colors disabled:opacity-50"
              />

              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={isSending || !inputMessage.trim()}
                className="p-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0 shadow-xs"
                title="Gửi câu hỏi"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
