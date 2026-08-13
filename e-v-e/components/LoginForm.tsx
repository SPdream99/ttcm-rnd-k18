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
  </aside>