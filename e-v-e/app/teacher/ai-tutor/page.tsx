"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  User,
  RotateCcw,
  Lightbulb,
  GraduationCap,
  Copy,
  Check,
  BrainCircuit,
  Key,
  Trash2,
} from "lucide-react";
import { useAuthAdapter } from "@/hooks/useAuthAdapter";
import { getDecryptedAIKey, hasAIKey, getMaskedAIKey, saveEncryptedAIKey, removeAIKey } from "@/lib/secureKeyStorage";
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

export default function TeacherAITutorPage() {
  const toast = useToast();
  const { currentUser, profile } = useAuthAdapter();
  const displayName = currentUser?.name || (currentUser as any)?.fullName || profile?.fullName || "Thầy/Cô";

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [memoryActive, setMemoryActive] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [hasApiKeyActive, setHasApiKeyActive] = useState(false);
  const [maskedKey, setMaskedKey] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    refreshKeyState();
    const hasKey = hasAIKey();
    setMessages(getChatHistory(displayName, hasKey));
    setMemoryActive(isMemoryEnabled());

    const handleChatUpdate = () => {
      setMessages(getChatHistory(displayName, hasAIKey()));
      setMemoryActive(isMemoryEnabled());
    };

    window.addEventListener(CHAT_UPDATED_EVENT, handleChatUpdate);
    window.addEventListener("storage", handleChatUpdate);

    return () => {
      window.removeEventListener(CHAT_UPDATED_EVENT, handleChatUpdate);
      window.removeEventListener("storage", handleChatUpdate);
    };
  }, [displayName]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleToggleMemory = () => {
    const nextState = !memoryActive;
    setMemoryActive(nextState);
    setMemoryEnabled(nextState);
    if (nextState) {
      toast.success("Đã BẬT tính năng Trí Nhớ: Trợ giảng sẽ nhớ ngữ cảnh các câu hỏi trước.", "Trí Nhớ AI");
    } else {
      toast.info("Đã TẮT Trí Nhớ: Trợ giảng chỉ phản hồi câu hỏi hiện tại độc lập.", "Trí Nhớ AI");
    }
  };

  const handleClearMemory = () => {
    const hasKey = hasAIKey();
    const fresh = clearChatHistory(displayName, hasKey);
    setMessages(fresh);
    setShowClearConfirm(false);
    toast.success("Đã xóa sạch toàn bộ lịch sử trò chuyện & làm mới trí nhớ của Trợ Giảng!", "Xóa Trí Nhớ");
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

  const handleSend = async (customPrompt?: string) => {
    const promptText = customPrompt || input.trim();
    if (!promptText || isTyping) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    saveChatHistory(nextMessages);
    if (!customPrompt) setInput("");
    setIsTyping(true);

    try {
      const savedKey = getDecryptedAIKey();
      const liveContext = getCurrentLivePageContext("teacher");

      const conversationHistory = memoryActive
        ? messages
            .filter((m) => m.id !== "msg-welcome-default" && m.id !== "m_init")
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
          prompt: promptText,
          role: "teacher",
          apiKey: savedKey || undefined,
          history: conversationHistory,
          pageContext: liveContext,
        }),
      });

      const data = await res.json();
      const aiReply = data.reply || "Đã xử lý yêu cầu, Thầy/Cô có cần tinh chỉnh thêm phần nào không?";

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: "ai",
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      const finalMessages = [...nextMessages, aiMsg];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
    } catch {
      const errMsg: ChatMessage = {
        id: `ai_err_${Date.now()}`,
        sender: "ai",
        text: "Xin lỗi Thầy/Cô, kết nối tới máy chủ đang gặp gián đoạn. Xin vui lòng thử lại sau ít giây.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      const finalMessages = [...nextMessages, errMsg];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
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
    "Soạn 5 câu trắc nghiệm về Vòng lặp For trong Python",
    "Gợi ý cấu trúc lộ trình Lập trình Game cơ bản",
    "Tạo ngân hàng câu hỏi linh kiện phần cứng máy tính",
  ];

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

    return blocks.map((block, index) => {
      if (block.startsWith("```") && block.endsWith("```")) {
        const codeLines = block.slice(3, -3).trim().split("\n");
        const lang = codeLines[0].trim();
        const code = (lang ? codeLines.slice(1) : codeLines).join("\n");

        return (
          <div key={`code-${index}`} className="my-2 rounded-xl bg-zinc-900 text-zinc-100 p-3 text-xs font-mono overflow-x-auto">
            <div className="flex justify-between items-center pb-1 mb-2 border-b border-zinc-700 text-zinc-400">
              <span>{lang || "code"}</span>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(code)}
                className="btn-plain flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" /> Sao chép
              </button>
            </div>
            <code>{code}</code>
          </div>
        );
      }

      return (
        <div key={`p-${index}`} className="whitespace-pre-wrap leading-relaxed">
          {renderFormattedText(block)}
        </div>
      );
    });
  };

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col space-y-4 font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-zinc-200 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shadow-sm relative">
            <GraduationCap className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-zinc-900 flex items-center gap-2">
              Trợ Giảng Sư Phạm E-V-E <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-700 font-bold border border-red-200">Dành Cho Giáo Viên</span>
            </h1>
            <p className="text-xs text-zinc-500">Tự động sinh câu hỏi trắc nghiệm, thiết kế cấu trúc lộ trình & gợi ý bài giảng</p>
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
            title={memoryActive ? "Trí nhớ AI: ĐANG BẬT. Bấm để Tắt" : "Trí nhớ AI: ĐANG TẮT. Bấm để Bật"}
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
      </div>

      {/* Modal Xác Nhận Xóa Trí Nhớ */}
      {showClearConfirm && (
        <div className="p-3 bg-red-50 border-b border-red-200 text-xs text-red-900 flex items-center justify-between gap-3 shrink-0 animate-in fade-in rounded-xl">
          <span className="font-semibold">
            Thầy/Cô có chắc chắn muốn xóa toàn bộ lịch sử trò chuyện và làm mới trí nhớ của Trợ Giảng?
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

      {/* Main Chat Stream Viewport */}
      <div className="flex-1 bg-zinc-50 rounded-2xl border border-zinc-200 p-4 md:p-6 overflow-y-auto space-y-4 shadow-inner">
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
              {msg.sender === "user" ? <User className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
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
                    className="btn-plain flex items-center gap-0.5 cursor-pointer ml-1"
                  >
                    {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === msg.id ? "Đã chép" : "Chép"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 max-w-xl mr-auto">
            <div className="w-8 h-8 rounded-full shrink-0 bg-red-600 text-white flex items-center justify-center font-bold">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-white border border-zinc-200 text-xs text-zinc-600 rounded-tl-none flex items-center gap-2 shadow-sm">
              <Sparkles className="w-4 h-4 text-red-600 animate-spin" />
              <span>Trợ giảng đang soạn dữ liệu bài học...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 shrink-0">
        <span className="text-[11px] font-bold text-zinc-500 flex items-center gap-1 whitespace-nowrap">
          <Lightbulb className="w-3.5 h-3.5 text-red-600" /> Gợi ý:
        </span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(p)}
            className="px-3 py-1 rounded-full bg-zinc-100 hover:bg-red-50 border border-zinc-200 hover:border-red-200 text-zinc-700 hover:text-red-700 text-xs whitespace-nowrap transition-colors cursor-pointer font-medium"
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
          placeholder="Yêu cầu soạn câu hỏi trắc nghiệm, cấu trúc bài giảng hoặc hướng dẫn tích hợp game..."
          className="flex-1 bg-white border-2 border-zinc-200 focus:border-red-600 rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:outline-none placeholder-zinc-400 transition-colors shadow-sm"
        />

        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="p-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Modal Cài Đặt API Key */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border-2 border-red-600 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <h3 className="font-bold text-base text-zinc-900 flex items-center gap-2">
                <Key className="w-5 h-5 text-red-600" /> Cài Đặt Gemini API Key Giáo Viên
              </h3>
              <button
                onClick={() => setShowKeyModal(false)}
                className="btn-plain text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {hasApiKeyActive && maskedKey && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[11px] text-emerald-800 font-bold block flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Đã lưu an toàn trên máy
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
              Nhập Google Gemini API Key để Trợ Giảng Sư Phạm trực tiếp sinh đề thi, gợi ý cấu trúc bài giảng và hỗ trợ soạn bài:
            </p>

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

              <div className="flex items-center justify-end gap-2 pt-1">
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
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
