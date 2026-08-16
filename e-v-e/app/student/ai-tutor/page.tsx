"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bot,
  User,
  Send,
  Sparkles,
  Key,
  Copy,
  Check,
  Lightbulb,
  Mic,
  ShieldCheck,
  ExternalLink,
  BrainCircuit,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import {
  saveEncryptedAIKey,
  getDecryptedAIKey,
  removeAIKey,
  hasAIKey,
  getMaskedAIKey,
} from "@/lib/secureKeyStorage";
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

export default function StudentAITutorPage() {
  const toast = useToast();
  const { currentUser, profile } = useAuthAdapter();
  const studentName = currentUser?.name || currentUser?.displayName || profile?.fullName || "bạn";

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [hasApiKeyActive, setHasApiKeyActive] = useState(false);
  const [maskedKey, setMaskedKey] = useState("");

  const [memoryActive, setMemoryActive] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync key state from secureKeyStorage (shared with Profile page)
  const refreshKeyState = () => {
    const active = hasAIKey();
    setHasApiKeyActive(active);
    setMaskedKey(active ? getMaskedAIKey() : "");
    if (active) {
      const decrypted = getDecryptedAIKey();
      setApiKeyInput(decrypted || "");
    } else {
      setApiKeyInput("");
    }
  };

  // Load chat history & memory setting from storage, listen to synchronization events
  useEffect(() => {
    refreshKeyState();
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

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

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = apiKeyInput.trim();
    if (trimmed) {
      saveEncryptedAIKey(trimmed);
    } else {
      removeAIKey();
    }
    refreshKeyState();
    setShowKeyModal(false);
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
      const liveContext = getCurrentLivePageContext("student");

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
          role: "student",
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
        text: "Đã xảy ra lỗi kết nối. Vui lòng thử lại sau.",
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

    return blocks.map((block, bIdx) => {
      if (block.startsWith("```") && block.endsWith("```")) {
        const lines = block.slice(3, -3).trim().split("\n");
        const lang = lines[0].trim();
        const code = (lang ? lines.slice(1) : lines).join("\n");

        return (
          <div key={bIdx} className="my-2 rounded-xl bg-zinc-900 text-zinc-100 p-3 text-xs font-mono overflow-x-auto">
            <div className="flex justify-between items-center pb-1 mb-2 border-b border-zinc-700 text-zinc-400">
              <span>{lang || "code"}</span>
              <button
                onClick={() => navigator.clipboard.writeText(code)}
                className="flex items-center gap-1 hover:text-white"
              >
                <Copy className="w-3 h-3" /> Chép
              </button>
            </div>
            <code>{code}</code>
          </div>
        );
      }

      return (
        <div key={bIdx} className="whitespace-pre-wrap leading-relaxed">
          {renderFormattedText(block)}
        </div>
      );
    });
  };

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col font-sans bg-white rounded-2xl border-2 border-zinc-200 overflow-hidden relative shadow-sm">
      {/* Header (Red & White) */}
      <header className="p-4 bg-white border-b-2 border-zinc-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold relative">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div>
            <h1 className="font-bold text-base text-zinc-900 flex items-center gap-2">
              Gia Sư Học Tập E-V-E <span className="w-2 h-2 rounded-full bg-red-600" />
            </h1>
            <p className="text-xs text-zinc-500">
              Đồng hành 24/7 cùng lộ trình học tập của bạn
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Nút Bật/Tắt Trí Nhớ */}
          <button
            type="button"
            onClick={handleToggleMemory}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              memoryActive
                ? "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                : "bg-zinc-100 text-zinc-500 border-zinc-200 hover:text-zinc-800"
            }`}
            title={memoryActive ? "Trí nhớ AI: ĐANG BẬT (Gia sư nhớ ngữ cảnh các câu trước). Bấm để Tắt" : "Trí nhớ AI: ĐANG TẮT. Bấm để Bật"}
          >
            <BrainCircuit className="w-3.5 h-3.5 text-purple-600" />
            <span>{memoryActive ? "Trí Nhớ: BẬT" : "Trí Nhớ: TẮT"}</span>
          </button>

          {/* Nút Xóa Toàn Bộ Trí Nhớ */}
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-red-50 text-zinc-600 hover:text-red-700 border border-zinc-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            title="Xóa toàn bộ lịch sử trò chuyện & làm mới trí nhớ"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Xóa Trí Nhớ</span>
          </button>

          {/* Nút Cài Đặt Key */}
          <button
            type="button"
            onClick={() => setShowKeyModal(true)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              hasApiKeyActive
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-zinc-100 text-zinc-600 border-zinc-200 hover:text-zinc-900"
            }`}
          >
            <Key className="w-3.5 h-3.5 text-red-600" />
            <span>{hasApiKeyActive ? "Gemini Key" : "Cài đặt Key"}</span>
          </button>
        </div>
      </header>

      {/* Modal Xác Nhận Xóa Trí Nhớ */}
      {showClearConfirm && (
        <div className="p-3 bg-red-50 border-b border-red-200 text-xs text-red-900 flex items-center justify-between gap-3 shrink-0 animate-in fade-in">
          <span className="font-semibold">
            Bạn có chắc chắn muốn xóa toàn bộ lịch sử trò chuyện và làm mới trí nhớ của Gia sư?
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleClearMemory}
              className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold cursor-pointer"
            >
              Xác Nhận Xóa
            </button>
            <button
              type="button"
              onClick={() => setShowClearConfirm(false)}
              className="px-3 py-1 rounded-lg bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-bold cursor-pointer"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Message Stream */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-5 bg-zinc-50/50">
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
              {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
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

        {isSending && (
          <div className="flex gap-3 max-w-xl mr-auto">
            <div className="w-8 h-8 rounded-full shrink-0 bg-red-600 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-white border border-zinc-200 text-xs text-zinc-600 rounded-tl-none flex items-center gap-2 shadow-sm">
              <Sparkles className="w-4 h-4 text-red-600 animate-spin" />
              <span>Gia Sư đang suy nghĩ câu trả lời...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Questions */}
      <div className="px-4 py-2 bg-white border-t border-zinc-200 flex items-center gap-2 overflow-x-auto shrink-0">
        <span className="text-[11px] font-bold text-zinc-500 flex items-center gap-1 shrink-0">
          <Lightbulb className="w-3.5 h-3.5 text-red-600" /> Gợi ý:
        </span>
        {[
          "Có những game nào trên hệ thống?",
          "Bảng xếp hạng học sinh hiện tại?",
          "Giải thích biến số và vòng lặp trong Python",
        ].map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(prompt)}
            className="px-3 py-1 rounded-full bg-zinc-100 hover:bg-red-50 text-xs text-zinc-700 hover:text-red-700 border border-zinc-200 transition-colors shrink-0 cursor-pointer font-medium"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-white border-t border-zinc-200 shrink-0">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <input
            type="text"
            placeholder="Đặt câu hỏi (toán học, lập trình Python, bài tập, minigame...)"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isSending}
            className="flex-1 bg-zinc-50 border-2 border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-red-600 transition-colors disabled:opacity-50"
          />

          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={isSending || !inputMessage.trim()}
            className="p-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0 shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal Cài Đặt API Key */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border-2 border-red-600 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <h3 className="font-bold text-base text-zinc-900 flex items-center gap-2">
                <Key className="w-5 h-5 text-red-600" /> Cài Đặt Gemini API Key
              </h3>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-zinc-400 hover:text-zinc-900 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {hasApiKeyActive && maskedKey && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[11px] text-emerald-800 font-bold block flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Đã liên kết với Hồ sơ cá nhân
                  </span>
                  <span className="font-mono text-xs text-zinc-900 font-bold tracking-wider">{maskedKey}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    removeAIKey();
                    refreshKeyState();
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-200 hover:bg-red-50 text-zinc-700 hover:text-red-700 text-[11px] font-bold transition-colors cursor-pointer"
                >
                  Xóa Key
                </button>
              </div>
            )}

            <p className="text-xs text-zinc-600 leading-relaxed">
              {hasApiKeyActive
                ? "Nhập mã mới bên dưới để thay đổi API Key (tự động cập nhật vào Hồ sơ cá nhân):"
                : "Nhập Google Gemini API Key để gia sư trực tiếp trả lời mọi câu hỏi (dùng chung với Hồ sơ cá nhân):"}
            </p>

            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-zinc-700 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed text-[11px]">
                <strong className="text-red-700">Lưu ý bảo mật:</strong> Khóa API Key được <strong>mã hóa an toàn và lưu cục bộ trên trình duyệt</strong> (Local Storage), đồng bộ tự động giữa <strong>Gia Sư AI</strong> và <strong>Hồ Sơ Cá Nhân</strong>.
              </span>
            </div>

            <form onSubmit={handleSaveApiKey} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Dán mã Google Gemini API Key (VD: AIzaSy...)"
                  className="w-full bg-zinc-50 border border-zinc-300 focus:border-red-600 rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <Link
                  href="/student/profile"
                  onClick={() => setShowKeyModal(false)}
                  className="text-xs text-red-600 hover:underline font-bold flex items-center gap-1"
                >
                  <span>Hồ Sơ Cá Nhân</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowKeyModal(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-100 text-zinc-700 text-xs font-bold hover:bg-zinc-200 cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
                  >
                    Lưu & Kích Hoạt
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
