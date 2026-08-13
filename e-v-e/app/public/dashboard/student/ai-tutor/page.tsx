'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function StudentAITutorPage() {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Xin chào Nguyễn Văn An! Tôi là Trợ lý AI Tutor của lớp Lập Trình Python AI. Bạn cần hỗ trợ câu hỏi nào hôm nay?' },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsgs = [...messages, { sender: 'user', text: inputMsg }];
    setMessages(newMsgs);
    setInputMsg('');

    setTimeout(() => {
      setMessages([
        ...newMsgs,
        {
          sender: 'ai',
          text: `🤖 E-V-E AI Tutor: Để giải quyết câu hỏi "${inputMsg}", bạn hãy kiểm tra vòng lặp \`for\` hoặc khai báo danh sách \`list\` theo chuẩn cú pháp Python nhé!`,
        },
      ]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6 md:p-10 font-sans flex flex-col justify-between">
      <header className="max-w-4xl w-full mx-auto flex justify-between items-center pb-6 border-b border-purple-500/20 mb-6">
        <div className="flex items-center gap-3">
          <Link href="/public/dashboard/student" className="font-mono text-xs text-purple-400 hover:underline">
            ← Dashboard Học Sinh
          </Link>
          <span className="text-slate-600 font-mono">/</span>
          <span className="font-mono text-sm text-white font-bold">AI TUTOR 24/7</span>
        </div>
      </header>

      <main className="max-w-4xl w-full mx-auto flex-1 flex flex-col space-y-4">
        {/* Chat Box */}
        <div className="flex-1 min-h-[450px] p-6 rounded-3xl bg-[#0f1524]/80 border border-purple-500/30 backdrop-blur-xl shadow-2xl space-y-4 overflow-y-auto max-h-[500px]">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xl p-4 rounded-2xl text-xs font-mono leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-purple-600 text-white rounded-br-none'
                    : 'bg-slate-950 border border-purple-500/30 text-purple-200 rounded-bl-none'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Hỏi AI Tutor bài tập Python hoặc thuật toán..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-purple-400 font-mono"
          />
          <button
            type="submit"
            className="px-8 py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all"
          >
            Gửi Câu Hỏi 🚀
          </button>
        </form>
      </main>
    </div>
  );
}
