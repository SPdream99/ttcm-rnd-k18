import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";

const outDir = path.join(process.cwd(), "public", "game-z-static");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// ─── INDEX.HTML ───
const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Game-Z: Hành Trình Chinh Phục Tri Thức</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div id="app" class="app-container">
    <!-- HEADER -->
    <header class="game-header">
      <div class="header-brand">
        <span class="brand-icon">🎮</span>
        <div>
          <div class="brand-title">GAME-Z</div>
          <div id="header-course" class="brand-sub">Đang kết nối Khóa Học...</div>
        </div>
      </div>
      <div class="header-stats">
        <div class="stat-pill"><span class="stat-label">XP:</span> <span id="hud-xp" class="stat-value text-cyan">0</span></div>
        <div class="stat-pill"><span class="stat-label">Sao:</span> <span id="hud-stars" class="stat-value text-amber">0</span></div>
        <button id="btn-sound" class="btn-icon" title="Bật/Tắt âm thanh">🔊</button>
      </div>
    </header>

    <!-- SCREEN: MENU -->
    <section id="screen-menu" class="screen active">
      <div class="hero-banner glass-panel">
        <div class="hero-emoji float-effect">🎮✨</div>
        <h1 class="hero-title">Hành Trình Chinh Phục Tri Thức</h1>
        <p class="hero-desc">Trải nghiệm game trắc nghiệm tương tác với học liệu từ khóa học, nhân điểm combo streak, mở khóa thử thách và khám phá tri thức mới!</p>
        <div class="hero-stats-row">
          <div class="hero-stat">⭐ Cao nhất: <strong id="menu-highscore" class="text-amber">0 pts</strong></div>
          <div class="hero-stat">🏆 Chính xác: <strong id="menu-best-acc" class="text-cyan">0%</strong></div>
        </div>
      </div>

      <h2 class="section-title">🎯 Chọn Chế Độ Chơi</h2>
      <div class="modes-grid">
        <!-- Adventure Mode -->
        <div class="mode-card glass-panel" onclick="startMode('adventure')" style="border-left: 4px solid var(--accent-cyan);">
          <div class="mode-top"><span class="mode-icon">🗺️</span><span class="mode-tag tag-cyan">Phổ biến nhất</span></div>
          <h3 class="mode-name">Chế Độ Thám Hiểm</h3>
          <p class="mode-desc">Chinh phục toàn bộ câu hỏi từ bài học theo thứ tự. Trả lời đúng liên tiếp để tích combo và ghi điểm cao.</p>
          <button class="btn-primary" style="width:100%">Bắt Đầu Thám Hiểm ➔</button>
        </div>
        <!-- Time Attack Mode -->
        <div class="mode-card glass-panel" onclick="startMode('timeAttack')" style="border-left: 4px solid var(--accent-violet);">
          <div class="mode-top"><span class="mode-icon">⚡</span><span class="mode-tag tag-violet">Thách Thức</span></div>
          <h3 class="mode-name">Chế Độ Tốc Độ</h3>
          <p class="mode-desc">60 giây đếm ngược nghẹt thở! Trả lời càng nhiều câu đúng càng tốt để ghi điểm kỷ lục cao nhất.</p>
          <button class="btn-primary btn-violet" style="width:100%">Thử Thách Ngay ➔</button>
        </div>
        <!-- Practice Mode -->
        <div class="mode-card glass-panel" onclick="startMode('practice')" style="border-left: 4px solid var(--accent-emerald);">
          <div class="mode-top"><span class="mode-icon">📚</span><span class="mode-tag tag-emerald">Luyện Tập</span></div>
          <h3 class="mode-name">Chế Độ Luyện Tập</h3>
          <p class="mode-desc">Tự do ôn luyện tất cả câu hỏi mà không áp lực thời gian. Xem giải thích chi tiết sau mỗi câu.</p>
          <button class="btn-secondary" style="width:100%">Luyện Tập Ngay ➔</button>
        </div>
      </div>
    </section>

    <!-- SCREEN: QUIZ -->
    <section id="screen-quiz" class="screen">
      <!-- Timer Bar (Time Attack only) -->
      <div id="timer-container" class="timer-container glass-panel hidden">
        <div class="timer-label-row">
          <span>⚡ THỜI GIAN CÒN LẠI</span>
          <span id="timer-text" class="timer-countdown">60.0s</span>
        </div>
        <div class="timer-bar-outer">
          <div id="timer-bar" class="timer-bar-inner"></div>
        </div>
      </div>

      <!-- Question Card -->
      <div class="question-container glass-panel">
        <div class="q-header">
          <span id="q-mode-badge" class="q-badge">CHẾ ĐỘ THÁM HIỂM</span>
          <span id="q-number" class="q-num">CÂU #1 / 10</span>
        </div>
        <div id="q-text" class="q-text">Đang tải câu hỏi...</div>
        <div id="answers-grid" class="answers-grid"></div>
        <div id="q-feedback" class="q-feedback hidden"></div>
      </div>

      <!-- Combat Sub-bar -->
      <div class="combat-subbar glass-panel">
        <div class="combat-stat"><span>Điểm:</span> <strong id="quiz-score" class="text-cyan">0</strong></div>
        <div class="combat-stat"><span>Combo:</span> <strong id="quiz-combo" class="text-amber">x0</strong></div>
        <div class="combat-stat"><span>Đúng:</span> <strong id="quiz-correct" class="text-emerald">0</strong></div>
      </div>
    </section>

    <!-- SCREEN: RESULT -->
    <section id="screen-result" class="screen">
      <div class="result-panel glass-panel">
        <div id="result-trophy" class="result-trophy-ring">
          <div class="trophy-icon">🏆</div>
        </div>
        <h1 id="result-title" class="result-title">HOÀN THÀNH XUẤT SẮC!</h1>
        <p id="result-subtitle" class="result-subtitle">Bạn đã hoàn thành màn chơi tuyệt vời!</p>

        <div class="result-stats-card glass-panel">
          <div class="result-row"><span>Tổng Điểm:</span> <strong id="res-score" class="text-cyan">0 PTS</strong></div>
          <div class="result-row"><span>Độ Chính Xác:</span> <strong id="res-accuracy" class="text-emerald">100%</strong></div>
          <div class="result-row"><span>Combo Cao Nhất:</span> <strong id="res-streak" class="text-amber">x0</strong></div>
          <div class="result-row"><span>Thời Gian:</span> <strong id="res-time" class="text-white">0s</strong></div>
          <div class="result-row"><span>Coins Thưởng:</span> <strong id="res-coins" class="text-amber">+0 🪙</strong></div>
        </div>

        <div class="result-actions">
          <button class="btn-secondary" onclick="restartGame()">🔄 Chơi Lại</button>
          <button class="btn-primary" onclick="backToMenu()">🏠 Menu Chính</button>
        </div>
      </div>
    </section>
  </div>

  <script src="eve-game-sdk.js"></script>
  <script src="game.js"></script>
</body>
</html>`;

// ─── STYLE.CSS ───
const css = `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
:root {
  --font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  --bg-dark: #090d16;
  --bg-card: rgba(22, 30, 49, 0.75);
  --bg-card-border: rgba(255, 255, 255, 0.08);
  --accent-cyan: #06b6d4;
  --accent-violet: #8b5cf6;
  --accent-amber: #f59e0b;
  --accent-emerald: #10b981;
  --accent-rose: #f43f5e;
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --shadow-glow-cyan: 0 0 25px rgba(6, 182, 212, 0.25);
  --shadow-glow-violet: 0 0 25px rgba(139, 92, 246, 0.25);
  --shadow-card: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-full: 9999px;
}
* { box-sizing: border-box; margin: 0; padding: 0; font-family: var(--font-family); -webkit-font-smoothing: antialiased; }
body { background: var(--bg-dark); color: var(--text-main); min-height: 100vh; background-image: radial-gradient(circle at 15% 15%, rgba(139,92,246,0.12) 0%, transparent 40%), radial-gradient(circle at 85% 85%, rgba(6,182,212,0.12) 0%, transparent 40%); background-attachment: fixed; overflow-x: hidden; }
button { cursor: pointer; border: none; background: none; font-family: inherit; transition: all 0.2s cubic-bezier(0.4,0,0.2,1); }

.app-container { max-width: 960px; margin: 0 auto; padding: 1.25rem; min-height: 100vh; display: flex; flex-direction: column; gap: 1.5rem; }
.glass-panel { background: var(--bg-card); backdrop-filter: blur(16px); border: 1px solid var(--bg-card-border); border-radius: var(--radius-lg); box-shadow: var(--shadow-card); }
.hidden { display: none !important; }
.screen { display: none; flex-direction: column; gap: 1.5rem; animation: fadeUp 0.35s ease; }
.screen.active { display: flex; }

@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
@keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.06); } }
@keyframes shake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-6px); } 40% { transform: translateX(6px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } }
.float-effect { animation: float 3s ease-in-out infinite; }
.shake { animation: shake 0.4s ease; }

/* TEXT UTILS */
.text-cyan { color: var(--accent-cyan); }
.text-amber { color: var(--accent-amber); }
.text-emerald { color: var(--accent-emerald); }
.text-violet { color: var(--accent-violet); }
.text-rose { color: var(--accent-rose); }
.text-white { color: #fff; }

/* HEADER */
.game-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.25rem; background: var(--bg-card); border: 1px solid var(--bg-card-border); border-radius: var(--radius-lg); flex-wrap: wrap; gap: 0.75rem; }
.header-brand { display: flex; align-items: center; gap: 0.75rem; }
.brand-icon { font-size: 1.75rem; }
.brand-title { font-size: 1.1rem; font-weight: 800; letter-spacing: 0.05em; background: linear-gradient(90deg, var(--accent-cyan), var(--accent-violet)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.brand-sub { font-size: 0.75rem; color: var(--text-muted); }
.header-stats { display: flex; align-items: center; gap: 0.75rem; }
.stat-pill { background: rgba(0,0,0,0.3); padding: 0.4rem 0.8rem; border-radius: var(--radius-full); font-size: 0.8rem; font-weight: 700; display: flex; gap: 0.35rem; align-items: center; }
.stat-label { color: var(--text-muted); font-weight: 500; }
.btn-icon { width: 36px; height: 36px; border-radius: var(--radius-md); background: rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; transition: 0.2s; }
.btn-icon:hover { background: rgba(255,255,255,0.15); }

/* HERO BANNER */
.hero-banner { padding: 2.5rem 2rem; text-align: center; background: linear-gradient(135deg, rgba(6,182,212,0.15), rgba(139,92,246,0.15)); border: 1px solid rgba(6,182,212,0.25); overflow: hidden; }
.hero-emoji { font-size: 3rem; margin-bottom: 0.75rem; }
.hero-title { font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem; letter-spacing: -0.03em; }
.hero-desc { color: var(--text-muted); font-size: 0.95rem; max-width: 600px; margin: 0 auto 1.25rem; line-height: 1.6; }
.hero-stats-row { display: flex; justify-content: center; gap: 1.5rem; flex-wrap: wrap; }
.hero-stat { background: rgba(0,0,0,0.3); padding: 0.5rem 1rem; border-radius: var(--radius-full); font-size: 0.85rem; }

/* MODE CARDS */
.section-title { font-size: 1.3rem; font-weight: 700; margin-top: 0.5rem; }
.modes-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem; }
.mode-card { padding: 1.5rem; cursor: pointer; transition: all 0.3s ease; }
.mode-card:hover { transform: translateY(-6px); }
.mode-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; }
.mode-icon { font-size: 2.2rem; }
.mode-tag { padding: 0.2rem 0.6rem; border-radius: var(--radius-full); font-size: 0.7rem; font-weight: 700; }
.tag-cyan { background: rgba(6,182,212,0.2); color: var(--accent-cyan); }
.tag-violet { background: rgba(139,92,246,0.2); color: var(--accent-violet); }
.tag-emerald { background: rgba(16,185,129,0.2); color: var(--accent-emerald); }
.mode-name { font-size: 1.15rem; font-weight: 700; margin-bottom: 0.4rem; }
.mode-desc { color: var(--text-muted); font-size: 0.85rem; line-height: 1.5; margin-bottom: 1rem; }

/* BUTTONS */
.btn-primary { background: linear-gradient(135deg, var(--accent-cyan), #0891b2); color: #fff; padding: 0.75rem 1.5rem; border-radius: var(--radius-md); font-weight: 700; font-size: 0.9rem; box-shadow: var(--shadow-glow-cyan); }
.btn-primary:hover { transform: translateY(-2px); filter: brightness(1.1); }
.btn-violet { background: linear-gradient(135deg, var(--accent-violet), #6d28d9); box-shadow: var(--shadow-glow-violet); }
.btn-secondary { background: rgba(255,255,255,0.08); color: var(--text-main); padding: 0.75rem 1.5rem; border-radius: var(--radius-md); font-weight: 700; font-size: 0.9rem; border: 1px solid rgba(255,255,255,0.12); }
.btn-secondary:hover { background: rgba(255,255,255,0.14); }

/* TIMER */
.timer-container { padding: 1rem 1.25rem; }
.timer-label-row { display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 700; color: var(--accent-violet); margin-bottom: 0.5rem; }
.timer-countdown { font-size: 1.1rem; color: var(--accent-rose); }
.timer-bar-outer { width: 100%; height: 10px; background: rgba(255,255,255,0.08); border-radius: var(--radius-full); overflow: hidden; }
.timer-bar-inner { width: 100%; height: 100%; background: linear-gradient(90deg, var(--accent-violet), var(--accent-rose)); transition: width 0.15s linear; border-radius: var(--radius-full); }

/* QUESTION */
.question-container { padding: 1.5rem; }
.q-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem; }
.q-badge { background: rgba(6,182,212,0.15); color: var(--accent-cyan); padding: 0.3rem 0.8rem; border-radius: var(--radius-full); font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
.q-num { font-size: 0.85rem; font-weight: 700; color: var(--text-muted); }
.q-text { font-size: 1.15rem; font-weight: 700; line-height: 1.6; text-align: center; padding: 1rem 0.5rem; min-height: 80px; display: flex; align-items: center; justify-content: center; }
.answers-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 0.75rem; margin-top: 1rem; }
.ans-btn { background: rgba(255,255,255,0.06); color: var(--text-main); border: 2px solid transparent; border-radius: var(--radius-md); padding: 1rem 1.25rem; font-size: 0.95rem; font-weight: 600; text-align: left; cursor: pointer; transition: all 0.2s ease; position: relative; overflow: hidden; }
.ans-btn:hover { background: rgba(255,255,255,0.1); border-color: var(--accent-cyan); transform: translateY(-2px); }
.ans-btn.correct { background: rgba(16,185,129,0.2); border-color: var(--accent-emerald); color: #a7f3d0; }
.ans-btn.wrong { background: rgba(244,63,94,0.2); border-color: var(--accent-rose); color: #fecdd3; }
.ans-btn.disabled { pointer-events: none; opacity: 0.6; }
.ans-btn .key-hint { position: absolute; top: 8px; right: 10px; font-size: 0.7rem; color: var(--text-muted); opacity: 0.6; }

.q-feedback { margin-top: 0.75rem; padding: 0.75rem 1rem; border-radius: var(--radius-md); font-size: 0.85rem; font-weight: 600; text-align: center; }
.q-feedback.feedback-correct { background: rgba(16,185,129,0.15); color: #6ee7b7; border: 1px solid rgba(16,185,129,0.3); }
.q-feedback.feedback-wrong { background: rgba(244,63,94,0.15); color: #fda4af; border: 1px solid rgba(244,63,94,0.3); }

/* COMBAT SUBBAR */
.combat-subbar { display: flex; justify-content: center; gap: 1.5rem; padding: 0.75rem 1.25rem; flex-wrap: wrap; }
.combat-stat { font-size: 0.85rem; display: flex; gap: 0.35rem; align-items: center; }
.combat-stat span { color: var(--text-muted); }

/* RESULT */
.result-panel { padding: 2.5rem 2rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1.25rem; }
.result-trophy-ring { width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, rgba(245,158,11,0.2), rgba(6,182,212,0.2)); display: flex; align-items: center; justify-content: center; animation: pulse 2s ease-in-out infinite; border: 2px solid rgba(245,158,11,0.3); }
.trophy-icon { font-size: 3rem; }
.result-title { font-size: 1.8rem; font-weight: 800; }
.result-subtitle { color: var(--text-muted); font-size: 0.95rem; max-width: 480px; }
.result-stats-card { padding: 1.25rem 1.5rem; width: 100%; max-width: 420px; }
.result-row { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 0.9rem; }
.result-row:last-child { border-bottom: none; }
.result-row span { color: var(--text-muted); }
.result-actions { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; margin-top: 0.5rem; }

@media (max-width: 640px) {
  .hero-title { font-size: 1.5rem; }
  .modes-grid { grid-template-columns: 1fr; }
  .answers-grid { grid-template-columns: 1fr; }
}`;

// ─── GAME.JS ───
const gameJs = `/**
 * Game-Z Static - Hành Trình Chinh Phục Tri Thức
 * Full-featured quiz game with 3 modes + E-V-E SDK integration
 */
const DEFAULT_PAIRS = [
  { id:"p1", title:"Trong lập trình Python, lệnh nào dùng để xuất kết quả ra màn hình?", description:"print()", distractions:["input()","echo()","write()"], explanation:"Hàm print() trong Python dùng để hiển thị kết quả ra cửa sổ console." },
  { id:"p2", title:"Cấu trúc điều kiện nào dùng để rẽ nhánh quyết định?", description:"if - else", distractions:["for - while","def - return","import - from"], explanation:"Cấu trúc if-else cho phép chương trình thực thi các khối lệnh khác nhau dựa trên điều kiện logic." },
  { id:"p3", title:"Biến số (Variable) trong thuật toán dùng để làm gì?", description:"Lưu trữ dữ liệu và thay đổi giá trị khi chạy", distractions:["Tắt máy tính","Xóa ổ cứng","Tăng tốc mạng"], explanation:"Biến là vùng nhớ có tên, lưu trữ dữ liệu có thể thay đổi trong quá trình thực thi chương trình." },
  { id:"p4", title:"Vòng lặp nào được dùng khi biết trước số lần lặp?", description:"for", distractions:["while","switch","try-catch"], explanation:"Vòng lặp for thích hợp khi biết trước số lần lặp, duyệt qua danh sách hoặc phạm vi số." },
  { id:"p5", title:"Linh kiện nào được coi là bộ não tính toán của máy tính?", description:"CPU", distractions:["GPU","RAM","SSD"], explanation:"CPU (Central Processing Unit) chịu trách nhiệm xử lý mọi phép tính và chỉ lệnh của chương trình." },
  { id:"p6", title:"Bộ nhớ RAM có đặc điểm gì quan trọng?", description:"Truy xuất nhanh, mất dữ liệu khi tắt nguồn", distractions:["Lưu trữ vĩnh viễn","Xử lý đồ họa","Cấp nguồn điện"], explanation:"RAM là bộ nhớ khả biến (volatile), tốc độ cực cao, dùng để lưu tạm chương trình đang chạy." },
  { id:"p7", title:"Kiểu dữ liệu nào chỉ lưu 2 giá trị True hoặc False?", description:"Boolean", distractions:["Integer","String","Float"], explanation:"Boolean là kiểu dữ liệu logic chỉ có 2 giá trị: True (đúng) và False (sai)." },
  { id:"p8", title:"Thuật toán tìm kiếm nhị phân yêu cầu dữ liệu phải thế nào?", description:"Đã được sắp xếp theo thứ tự", distractions:["Xáo trộn ngẫu nhiên","Toàn số âm","Không có điều kiện"], explanation:"Binary Search chia đôi phạm vi tìm kiếm mỗi bước, nên yêu cầu dữ liệu đã sắp xếp." },
  { id:"p9", title:"Độ phức tạp O(1) biểu thị điều gì?", description:"Thời gian không đổi theo kích thước dữ liệu", distractions:["Thời gian tăng tuyến tính","Vòng lặp vô tận","Thuật toán lỗi"], explanation:"O(1) là constant time - thời gian thực thi không phụ thuộc vào số lượng dữ liệu đầu vào." },
  { id:"p10", title:"Mạng nơ-ron nhân tạo trong AI viết tắt là gì?", description:"ANN", distractions:["CNN","API","SQL"], explanation:"ANN (Artificial Neural Network) là mô hình tính toán mô phỏng cấu trúc nơ-ron trong não bộ." },
];

// ── STATE ──
const GS = {
  sdk: null,
  pairs: DEFAULT_PAIRS,
  mode: "adventure", // adventure | timeAttack | practice
  currentIdx: 0,
  score: 0,
  combo: 0,
  maxCombo: 0,
  correct: 0,
  answered: 0,
  isLocked: false,
  startTime: 0,
  // Time Attack
  timerSeconds: 60,
  timerInterval: null,
  // Stats
  highScore: 0,
  bestAcc: 0,
  totalXp: 0,
  totalStars: 0,
  isMuted: false,
};

// ── DOM ──
const $ = (id) => document.getElementById(id);
const screens = { menu: $("screen-menu"), quiz: $("screen-quiz"), result: $("screen-result") };

// ── INIT ──
document.addEventListener("DOMContentLoaded", () => {
  initSDK();
  setupSoundBtn();
  setupKeyboard();
});

function initSDK() {
  try {
    GS.sdk = new EVEGameSDK({ gameId: "game-z" });
    GS.sdk.onDataReady((data) => {
      if (data.courseTitle) $("header-course").textContent = "Khóa học: " + data.courseTitle;
      if (Array.isArray(data.pairs) && data.pairs.length > 0) GS.pairs = data.pairs;
    });
    GS.sdk.initSession().then((data) => {
      if (data && data.pairs && data.pairs.length > 0) {
        GS.pairs = data.pairs;
        if (data.courseTitle) $("header-course").textContent = "Khóa học: " + data.courseTitle;
      }
    }).catch(() => {
      $("header-course").textContent = "Khóa học: Lập Trình Cơ Bản (Offline)";
    });
  } catch (e) {
    $("header-course").textContent = "Khóa học: Lập Trình Cơ Bản (Offline)";
  }
}

function setupSoundBtn() {
  $("btn-sound").addEventListener("click", () => {
    GS.isMuted = !GS.isMuted;
    $("btn-sound").textContent = GS.isMuted ? "🔇" : "🔊";
  });
}

function playSound(type) {
  if (GS.isMuted || !GS.sdk) return;
  try { GS.sdk.playSound(type); } catch(e) {}
}

function setupKeyboard() {
  window.addEventListener("keydown", (e) => {
    if (!screens.quiz.classList.contains("active")) return;
    const btns = document.querySelectorAll("#answers-grid .ans-btn:not(.disabled)");
    if (e.key === "1" && btns[0]) btns[0].click();
    if (e.key === "2" && btns[1]) btns[1].click();
    if (e.key === "3" && btns[2]) btns[2].click();
    if (e.key === "4" && btns[3]) btns[3].click();
  });
}

// ── SCREEN MANAGEMENT ──
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
}

// ── GAME MODES ──
window.startMode = function(mode) {
  GS.mode = mode;
  GS.currentIdx = 0;
  GS.score = 0;
  GS.combo = 0;
  GS.maxCombo = 0;
  GS.correct = 0;
  GS.answered = 0;
  GS.isLocked = false;
  GS.startTime = Date.now();
  playSound("click");

  // Shuffle pairs
  GS.pairs = [...GS.pairs].sort(() => Math.random() - 0.5);

  // Mode badge
  const badges = { adventure: "CHẾ ĐỘ THÁM HIỂM", timeAttack: "CHẾ ĐỘ TỐC ĐỘ ⚡", practice: "CHẾ ĐỘ LUYỆN TẬP" };
  $("q-mode-badge").textContent = badges[mode] || "GAME-Z";

  // Timer
  if (mode === "timeAttack") {
    GS.timerSeconds = 60;
    $("timer-container").classList.remove("hidden");
    $("timer-text").textContent = "60.0s";
    $("timer-bar").style.width = "100%";
    clearInterval(GS.timerInterval);
    GS.timerInterval = setInterval(() => {
      GS.timerSeconds -= 0.1;
      if (GS.timerSeconds <= 0) {
        GS.timerSeconds = 0;
        clearInterval(GS.timerInterval);
        endGame();
        return;
      }
      $("timer-text").textContent = GS.timerSeconds.toFixed(1) + "s";
      $("timer-bar").style.width = ((GS.timerSeconds / 60) * 100) + "%";
    }, 100);
  } else {
    $("timer-container").classList.add("hidden");
    clearInterval(GS.timerInterval);
  }

  if (GS.sdk && GS.sdk.startTimer) GS.sdk.startTimer();
  updateQuizHUD();
  showScreen("quiz");
  loadQuestion();
};

function updateQuizHUD() {
  $("quiz-score").textContent = GS.score;
  $("quiz-combo").textContent = "x" + GS.combo;
  $("quiz-correct").textContent = GS.correct;
  $("hud-xp").textContent = GS.totalXp;
}

function loadQuestion() {
  if (GS.currentIdx >= GS.pairs.length) {
    if (GS.mode === "timeAttack") {
      // Re-shuffle and continue in time attack
      GS.pairs = [...GS.pairs].sort(() => Math.random() - 0.5);
      GS.currentIdx = 0;
    } else {
      endGame();
      return;
    }
  }

  GS.isLocked = false;
  const q = GS.pairs[GS.currentIdx];
  $("q-number").textContent = "CÂU #" + (GS.currentIdx + 1) + (GS.mode !== "timeAttack" ? " / " + GS.pairs.length : "");
  $("q-text").textContent = q.title || "Câu hỏi " + (GS.currentIdx + 1);
  $("q-feedback").classList.add("hidden");

  const correctAns = q.description || q.rightAnswer || "Đáp án đúng";
  const distracts = q.distractions || ["A", "B", "C"];
  const options = [correctAns, ...distracts].sort(() => Math.random() - 0.5);

  const grid = $("answers-grid");
  grid.innerHTML = "";
  options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "ans-btn";
    btn.innerHTML = opt + '<span class="key-hint">' + (i+1) + '</span>';
    btn.addEventListener("click", () => handleAnswer(opt, correctAns, q, btn));
    grid.appendChild(btn);
  });
}

function handleAnswer(selected, correct, question, clickedBtn) {
  if (GS.isLocked) return;
  GS.isLocked = true;
  GS.answered++;

  const allBtns = document.querySelectorAll("#answers-grid .ans-btn");
  allBtns.forEach(b => b.classList.add("disabled"));

  const isCorrect = selected === correct;
  const fb = $("q-feedback");

  if (isCorrect) {
    clickedBtn.classList.add("correct");
    GS.correct++;
    GS.combo++;
    if (GS.combo > GS.maxCombo) GS.maxCombo = GS.combo;
    const comboBonus = Math.min(GS.combo, 10) * 5;
    const gain = 50 + comboBonus;
    GS.score += gain;
    GS.totalXp += 10;
    playSound("correct");

    fb.className = "q-feedback feedback-correct";
    fb.textContent = "✅ CHÍNH XÁC! +" + gain + " điểm" + (GS.combo > 1 ? " (Combo x" + GS.combo + " 🔥)" : "");
  } else {
    clickedBtn.classList.add("wrong");
    // Highlight correct answer
    allBtns.forEach(b => { if (b.textContent.replace(/\\d$/, "").trim() === correct || b.textContent.includes(correct)) b.classList.add("correct"); });
    GS.combo = 0;
    playSound("wrong");

    fb.className = "q-feedback feedback-wrong";
    fb.textContent = "❌ Sai! Đáp án đúng: " + correct;
    if (GS.mode === "practice" && question.explanation) {
      fb.textContent += " — " + question.explanation;
    }
  }
  fb.classList.remove("hidden");

  updateQuizHUD();

  const delay = GS.mode === "timeAttack" ? 600 : (GS.mode === "practice" ? 2000 : 1000);
  setTimeout(() => {
    GS.currentIdx++;
    loadQuestion();
  }, delay);
}

function endGame() {
  clearInterval(GS.timerInterval);
  const playTime = Math.round((Date.now() - GS.startTime) / 1000);
  const accuracy = GS.answered > 0 ? Math.round((GS.correct / GS.answered) * 100) : 100;
  const coins = Math.round(GS.score * 0.4) + 20;

  if (GS.score > GS.highScore) GS.highScore = GS.score;
  if (accuracy > GS.bestAcc) GS.bestAcc = accuracy;

  // Update menu stats
  $("menu-highscore").textContent = GS.highScore + " pts";
  $("menu-best-acc").textContent = GS.bestAcc + "%";

  // Result screen
  const isGood = accuracy >= 70;
  $("result-trophy").querySelector(".trophy-icon").textContent = isGood ? "🏆" : "📊";
  $("result-title").textContent = isGood ? "HOÀN THÀNH XUẤT SẮC!" : "KẾT THÚC MÀN CHƠI";
  $("result-subtitle").textContent = isGood
    ? "Bạn đã thể hiện tuyệt vời trong hành trình chinh phục tri thức!"
    : "Hãy luyện tập thêm để cải thiện kết quả lần sau nhé!";

  $("res-score").textContent = GS.score + " PTS";
  $("res-accuracy").textContent = accuracy + "%";
  $("res-streak").textContent = "x" + GS.maxCombo;
  $("res-time").textContent = playTime + "s";
  $("res-coins").textContent = "+" + coins + " 🪙";

  playSound(isGood ? "win" : "wrong");
  showScreen("result");

  // SDK finish
  if (GS.sdk) {
    GS.sdk.finishGame({
      score: GS.score,
      isWin: isGood,
      accuracyPercent: accuracy,
      playTimeSeconds: playTime,
      details: { mode: GS.mode, maxCombo: GS.maxCombo, totalAnswered: GS.answered },
    });
  }
}

window.restartGame = function() {
  playSound("click");
  startMode(GS.mode);
};

window.backToMenu = function() {
  playSound("click");
  clearInterval(GS.timerInterval);
  showScreen("menu");
};
`;

// ─── WRITE FILES ───
fs.writeFileSync(path.join(outDir, "index.html"), html, "utf8");
fs.writeFileSync(path.join(outDir, "style.css"), css, "utf8");
fs.writeFileSync(path.join(outDir, "game.js"), gameJs, "utf8");

// Copy SDK
const sdkSrc = path.join(process.cwd(), "public", "eve-game-sdk.js");
fs.copyFileSync(sdkSrc, path.join(outDir, "eve-game-sdk.js"));

// ─── CREATE ZIPs ───
const zip = new AdmZip();
zip.addLocalFolder(outDir);
zip.writeZip(path.join(process.cwd(), "..", "game-z.zip"));
zip.writeZip(path.join(process.cwd(), "public", "game-z.zip"));
zip.writeZip(path.join(process.cwd(), "public", "eve_game_starter_kit.zip"));

console.log("✅ game-z.zip created with full UI (3 modes, glassmorphism, SDK)");
console.log("Files:", fs.readdirSync(outDir).join(", "));
</script>`;

fs.writeFileSync(path.join(outDir, "index.html"), html, "utf8");
fs.writeFileSync(path.join(outDir, "style.css"), css, "utf8");
fs.writeFileSync(path.join(outDir, "game.js"), gameJs, "utf8");

// Copy SDK
const sdkSrc = path.join(process.cwd(), "public", "eve-game-sdk.js");
fs.copyFileSync(sdkSrc, path.join(outDir, "eve-game-sdk.js"));

// Create ZIPs
const zip = new AdmZip();
zip.addLocalFolder(outDir);
zip.writeZip(path.join(process.cwd(), "..", "game-z.zip"));
zip.writeZip(path.join(process.cwd(), "public", "game-z.zip"));
zip.writeZip(path.join(process.cwd(), "public", "eve_game_starter_kit.zip"));

console.log("✅ game-z.zip created with full UI (3 modes, glassmorphism, SDK)");
console.log("Files:", fs.readdirSync(outDir).join(", "));
