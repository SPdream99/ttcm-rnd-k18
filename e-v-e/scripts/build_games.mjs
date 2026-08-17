import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";

// ==========================================
// 1. TẠO GAME BOSS_BATTLE_QUIZ HOÀN CHỈNH
// ==========================================
const bossDir = path.join(process.cwd(), "public", "boss_battle_quiz");
if (!fs.existsSync(bossDir)) fs.mkdirSync(bossDir, { recursive: true });

const bossHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Boss Slayer Marathon Quiz - E-V-E Engine</title>
  <!-- Nhúng SDK Server -->
  <script src="/eve-game-sdk.js"></script>
  <script src="eve-game-sdk.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: #09090b; color: #f4f4f5; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 16px; overflow: hidden; }
    .game-box { width: 100%; max-width: 860px; background: #18181b; border: 2px solid #dc2626; border-radius: 24px; padding: 24px; box-shadow: 0 25px 50px -12px rgba(220, 38, 38, 0.25); display: flex; flex-direction: column; gap: 20px; }
    .top-bar { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #27272a; padding-bottom: 16px; flex-wrap: wrap; gap: 12px; }
    .badge { background: #fee2e2; color: #b91c1c; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.05em; }
    .boss-hud { background: #27272a; padding: 16px; border-radius: 16px; display: flex; flex-direction: column; gap: 8px; border: 1px solid #3f3f46; }
    .boss-header { display: flex; justify-content: space-between; align-items: center; font-size: 14px; font-weight: 700; }
    .hp-bar-bg { width: 100%; height: 16px; background: #3f3f46; border-radius: 9999px; overflow: hidden; position: relative; }
    .hp-bar-fill { height: 100%; background: linear-gradient(90deg, #ef4444, #dc2626); width: 100%; transition: width 0.3s ease; }
    .question-card { background: #27272a; border-radius: 16px; padding: 20px; text-align: center; font-size: 17px; font-weight: 700; line-height: 1.5; color: #fff; min-height: 90px; display: flex; align-items: center; justify-content: center; border: 1px solid #3f3f46; }
    .options-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; }
    .opt-btn { background: #3f3f46; color: #f4f4f5; border: 2px solid transparent; border-radius: 14px; padding: 14px 18px; font-size: 14px; font-weight: 600; text-align: left; cursor: pointer; transition: all 0.15s ease; }
    .opt-btn:hover { background: #52525b; border-color: #dc2626; transform: translateY(-2px); }
    .opt-btn.correct { background: #065f46; border-color: #10b981; color: #a7f3d0; }
    .opt-btn.wrong { background: #7f1d1d; border-color: #ef4444; color: #fecaca; }
    .footer-bar { display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: #a1a1aa; border-top: 1px solid #27272a; padding-top: 14px; }
    .btn-action { background: #dc2626; color: #fff; border: none; border-radius: 12px; padding: 10px 20px; font-weight: 700; cursor: pointer; transition: 0.2s; font-size: 13px; }
    .btn-action:hover { background: #b91c1c; }
    .screen-overlay { text-align: center; padding: 30px 10px; display: flex; flex-direction: column; align-items: center; gap: 16px; }
    .hidden { display: none !important; }
  </style>
</head>
<body>
  <div class="game-box">
    <!-- Topbar -->
    <div class="top-bar">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span class="badge">⚔️ BOSS BATTLE QUIZ</span>
        <span id="course-title-text" style="font-size: 13px; font-weight: 600; color: #a1a1aa;">Đang kết nối SDK...</span>
      </div>
      <div style="display: flex; gap: 16px; font-size: 14px; font-weight: 800;">
        <span>Điểm: <span id="score-text" style="color: #ef4444;">0</span></span>
        <span>Combo: <span id="streak-text" style="color: #f59e0b;">0x</span></span>
      </div>
    </div>

    <!-- Start Screen -->
    <div id="start-screen" class="screen-overlay">
      <div style="font-size: 64px;">👹</div>
      <h1 style="font-size: 24px; font-weight: 900; color: #fff;">ĐẤU TRÙM PHẢN XẠ KIẾN THỨC</h1>
      <p style="font-size: 13px; color: #a1a1aa; max-width: 480px; line-height: 1.6;">
        Mỗi câu trả lời đúng từ học liệu khóa học sẽ giáng một đòn sấm sét vào Boss. Trả lời sai bạn sẽ bị Boss phản đòn!
      </p>
      <button id="btn-start" class="btn-action" style="font-size: 15px; padding: 12px 32px;">BẮT ĐẦU CHIẾN ĐẤU</button>
    </div>

    <!-- Play Screen -->
    <div id="play-screen" class="hidden" style="display: flex; flex-direction: column; gap: 16px;">
      <div class="boss-hud">
        <div class="boss-header">
          <span>👑 Quái Thú Kiến Thức (Cyber Dragon)</span>
          <span id="boss-hp-text" style="color: #ef4444;">HP: 100%</span>
        </div>
        <div class="hp-bar-bg">
          <div id="boss-hp-fill" class="hp-bar-fill"></div>
        </div>
      </div>

      <div id="question-text" class="question-card">
        Đang nạp câu hỏi...
      </div>

      <div id="options-container" class="options-grid"></div>

      <div class="footer-bar">
        <span>Tiến độ: <strong id="progress-text" style="color: #fff;">0/0</strong></span>
        <span id="feedback-text" style="font-weight: 700; color: #10b981;"></span>
      </div>
    </div>

    <!-- Result Screen -->
    <div id="result-screen" class="screen-overlay hidden">
      <div id="result-icon" style="font-size: 64px;">🏆</div>
      <h2 id="result-title" style="font-size: 24px; font-weight: 900;">BẠN ĐÃ CHIẾN THẮNG!</h2>
      <div style="background: #27272a; border-radius: 16px; padding: 16px 24px; display: flex; gap: 24px; font-size: 14px;">
        <div>Tổng Điểm: <strong id="final-score-text" style="color: #ef4444; font-size: 18px;">0</strong></div>
        <div>Chính Xác: <strong id="final-acc-text" style="color: #10b981; font-size: 18px;">100%</strong></div>
      </div>
      <button id="btn-replay" class="btn-action" style="margin-top: 8px;">CHƠI LẠI MÀN NÀY</button>
    </div>
  </div>

  <script src="game.js"></script>
</body>
</html>`;

const bossJs = `// Logic Game Boss Battle Quiz tích hợp E-V-E SDK
(function() {
  const FALLBACK_PAIRS = [
    {
      title: "Trong lập trình, cấu trúc điều kiện nào dùng để rẽ nhánh đúng hoặc sai?",
      description: "Cấu trúc IF - ELSE",
      distractions: ["Vòng lặp For", "Vòng lặp While", "Hàm Function"]
    },
    {
      title: "Linh kiện nào được coi là 'Bộ Não' xử lý trung tâm của máy tính?",
      description: "CPU (Central Processing Unit)",
      distractions: ["RAM", "Ổ cứng SSD", "Bộ nguồn PSU"]
    },
    {
      title: "Bộ nhớ truy xuất ngẫu nhiên tạm thời của máy tính viết tắt là gì?",
      description: "RAM (Random Access Memory)",
      distractions: ["ROM", "HDD", "GPU"]
    },
    {
      title: "Mạng nơ-ron nhân tạo trong AI viết tắt là gì?",
      description: "ANN (Artificial Neural Network)",
      distractions: ["CNN", "RNN", "API"]
    }
  ];

  let pairs = FALLBACK_PAIRS;
  let currentIndex = 0;
  let score = 0;
  let streak = 0;
  let corrects = 0;
  let totalAnswered = 0;
  let isAnswering = false;

  // DOM
  const courseTitleEl = document.getElementById("course-title-text");
  const scoreEl = document.getElementById("score-text");
  const streakEl = document.getElementById("streak-text");
  const startScreen = document.getElementById("start-screen");
  const playScreen = document.getElementById("play-screen");
  const resultScreen = document.getElementById("result-screen");
  const bossHpText = document.getElementById("boss-hp-text");
  const bossHpFill = document.getElementById("boss-hp-fill");
  const questionEl = document.getElementById("question-text");
  const optionsEl = document.getElementById("options-container");
  const progressText = document.getElementById("progress-text");
  const feedbackText = document.getElementById("feedback-text");
  const finalScoreEl = document.getElementById("final-score-text");
  const finalAccEl = document.getElementById("final-acc-text");

  // Khởi tạo SDK
  window.addEventListener("DOMContentLoaded", async () => {
    if (window.EveSDK) {
      try {
        const session = await window.EveSDK.initSession({
          gameId: "boss_battle_quiz",
          courseId: "crs_coding_basics"
        });
        if (session && session.pairs && session.pairs.length > 0) {
          pairs = session.pairs;
          courseTitleEl.textContent = session.courseTitle || "Khóa Học E-V-E";
        }
      } catch (err) {
        console.warn("Dùng học liệu mẫu:", err);
      }
    }
  });

  // Start game
  document.getElementById("btn-start").addEventListener("click", () => {
    startScreen.classList.add("hidden");
    playScreen.classList.remove("hidden");
    if (window.EveSDK && window.EveSDK.startTimer) {
      window.EveSDK.startTimer();
    }
    loadQuestion(0);
  });

  document.getElementById("btn-replay").addEventListener("click", () => {
    resultScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
    score = 0;
    streak = 0;
    corrects = 0;
    totalAnswered = 0;
    currentIndex = 0;
    scoreEl.textContent = "0";
    streakEl.textContent = "0x";
  });

  function loadQuestion(idx) {
    if (idx >= pairs.length) {
      finishGame();
      return;
    }
    isAnswering = false;
    feedbackText.textContent = "";
    const q = pairs[idx];
    questionEl.textContent = q.title || "Câu hỏi số " + (idx + 1);
    progressText.textContent = (idx + 1) + "/" + pairs.length;

    // HP Boss
    const hpPercent = Math.max(0, Math.round(((pairs.length - idx) / pairs.length) * 100));
    bossHpText.textContent = "HP: " + hpPercent + "%";
    bossHpFill.style.width = hpPercent + "%";

    const correctAns = q.description || q.rightAnswer || "Đáp án đúng";
    const distracts = q.distractions || ["Đáp án A", "Đáp án B", "Đáp án C"];
    const allOptions = [correctAns, ...distracts].sort(() => Math.random() - 0.5);

    optionsEl.innerHTML = "";
    allOptions.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "opt-btn";
      btn.textContent = opt;
      btn.addEventListener("click", () => handleAnswer(opt, correctAns, btn));
      optionsEl.appendChild(btn);
    });
  }

  function handleAnswer(selected, correct, clickedBtn) {
    if (isAnswering) return;
    isAnswering = true;
    totalAnswered += 1;

    const isCorrect = selected === correct;
    if (isCorrect) {
      clickedBtn.classList.add("correct");
      streak += 1;
      corrects += 1;
      const gain = 50 + (streak * 10);
      score += gain;
      feedbackText.textContent = "⚡ CHÍ MẠNG! +" + gain + " ĐIỂM";
      feedbackText.style.color = "#10b981";
    } else {
      clickedBtn.classList.add("wrong");
      streak = 0;
      feedbackText.textContent = "💥 BOSS PHẢN ĐÒN!";
      feedbackText.style.color = "#ef4444";
    }

    scoreEl.textContent = String(score);
    streakEl.textContent = streak + "x";

    setTimeout(() => {
      currentIndex += 1;
      loadQuestion(currentIndex);
    }, 1000);
  }

  async function finishGame() {
    playScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");

    bossHpText.textContent = "HP: 0%";
    bossHpFill.style.width = "0%";

    const accuracy = totalAnswered > 0 ? Math.round((corrects / totalAnswered) * 100) : 100;
    finalScoreEl.textContent = String(score);
    finalAccEl.textContent = accuracy + "%";

    if (window.EveSDK && window.EveSDK.finishGame) {
      try {
        await window.EveSDK.finishGame({
          score: score,
          accuracy: accuracy
        });
      } catch (e) {
        console.warn("Finish game sync err:", e);
      }
    }
  }
})();`;

fs.writeFileSync(path.join(bossDir, "index.html"), bossHtml, "utf8");
fs.writeFileSync(path.join(bossDir, "game.js"), bossJs, "utf8");

// Tạo boss_battle_quiz.zip
const bossZip = new AdmZip();
bossZip.addLocalFolder(bossDir);
bossZip.writeZip(path.join(process.cwd(), "public", "boss_battle_quiz.zip"));
console.log("✅ Đã tạo thành công public/boss_battle_quiz.zip");

// ==========================================
// 2. TẠO GAME-Z (GAME STARTER KIT & MINI ENGINE)
// ==========================================
const gameZDir = path.join(process.cwd(), "public", "game-z");
if (!fs.existsSync(gameZDir)) fs.mkdirSync(gameZDir, { recursive: true });

const gameZHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Game-Z Space Academy - E-V-E Engine</title>
  <!-- Nhúng SDK Server -->
  <script src="/eve-game-sdk.js"></script>
  <script src="eve-game-sdk.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: #030712; color: #f9fafb; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 16px; }
    .game-card { width: 100%; max-width: 820px; background: #111827; border: 2px solid #3b82f6; border-radius: 24px; padding: 24px; box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.3); display: flex; flex-direction: column; gap: 20px; }
    .top-bar { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1f2937; padding-bottom: 14px; flex-wrap: wrap; gap: 10px; }
    .badge { background: #dbeafe; color: #1d4ed8; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; }
    .question-box { background: #1f2937; border-radius: 16px; padding: 24px; text-align: center; font-size: 18px; font-weight: 700; border: 1px solid #374151; min-height: 100px; display: flex; align-items: center; justify-content: center; }
    .options-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px; }
    .btn-opt { background: #374151; color: #f9fafb; border: 2px solid transparent; border-radius: 14px; padding: 14px 18px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; text-align: left; }
    .btn-opt:hover { background: #4b5563; border-color: #3b82f6; transform: scale(1.01); }
    .btn-opt.correct { background: #065f46; border-color: #10b981; color: #6ee7b7; }
    .btn-opt.wrong { background: #881337; border-color: #f43f5e; color: #fecdd3; }
    .btn-primary { background: #2563eb; color: #fff; border: none; border-radius: 14px; padding: 12px 28px; font-weight: 700; cursor: pointer; transition: 0.2s; }
    .btn-primary:hover { background: #1d4ed8; }
    .screen { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 16px; padding: 20px; }
    .hidden { display: none !important; }
  </style>
</head>
<body>
  <div class="game-card">
    <div class="top-bar">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span class="badge">🚀 GAME-Z SPACE ACADEMY</span>
        <span id="z-course-title" style="font-size: 13px; color: #9ca3af;">Đang nạp dữ liệu...</span>
      </div>
      <div style="font-size: 14px; font-weight: 800;">
        Điểm Vũ Trụ: <span id="z-score" style="color: #60a5fa;">0</span>
      </div>
    </div>

    <div id="z-start" class="screen">
      <div style="font-size: 64px;">🌌</div>
      <h1 style="font-size: 24px; font-weight: 900;">TRẠM HỌC TẬP KHÔNG GIAN GAME-Z</h1>
      <p style="font-size: 13px; color: #9ca3af; max-width: 480px; line-height: 1.6;">
        Thu thập năng lượng tri thức để đưa phi thuyền E-V-E vượt qua các vành đai thiên thạch của bài học!
      </p>
      <button id="btn-z-start" class="btn-primary">KHỞI ĐỘNG PHI THUYỀN</button>
    </div>

    <div id="z-play" class="hidden" style="display: flex; flex-direction: column; gap: 16px;">
      <div id="z-question" class="question-box">Câu hỏi...</div>
      <div id="z-options" class="options-grid"></div>
      <div style="display: flex; justify-content: space-between; font-size: 12px; color: #9ca3af; border-top: 1px solid #1f2937; padding-top: 12px;">
        <span>Chặng bay: <strong id="z-progress" style="color: #fff;">0/0</strong></span>
        <span id="z-feedback" style="font-weight: 700;"></span>
      </div>
    </div>

    <div id="z-result" class="screen hidden">
      <div style="font-size: 64px;">🌠</div>
      <h2 style="font-size: 24px; font-weight: 900;">HOÀN THÀNH CHUYẾN BAY!</h2>
      <p style="font-size: 13px; color: #9ca3af;">Phi thuyền đã hạ cánh an toàn với dữ liệu bài học đầy đủ.</p>
      <div style="background: #1f2937; border-radius: 16px; padding: 16px 24px; display: flex; gap: 20px; font-size: 14px;">
        <div>Tổng Điểm: <strong id="z-final-score" style="color: #60a5fa; font-size: 18px;">0</strong></div>
        <div>Chính Xác: <strong id="z-final-acc" style="color: #34d399; font-size: 18px;">100%</strong></div>
      </div>
      <button id="btn-z-replay" class="btn-primary" style="margin-top: 10px;">BAY LẠI MÀN NÀY</button>
    </div>
  </div>

  <script src="game.js"></script>
</body>
</html>`;

const gameZJs = `// Logic Game-Z SDK Integration
(function() {
  const FALLBACK_PAIRS = [
    {
      title: "Hệ điều hành mã nguồn mở nhân Linux phổ biến nhất cho lập trình là gì?",
      description: "Ubuntu Linux",
      distractions: ["Windows 95", "MS-DOS", "macOS Lion"]
    },
    {
      title: "Giao thức truyền tải siêu văn bản an toàn có mã hóa SSL/TLS viết tắt là gì?",
      description: "HTTPS (Hypertext Transfer Protocol Secure)",
      distractions: ["HTTP", "FTP", "SMTP"]
    },
    {
      title: "Công cụ quản lý phiên bản mã nguồn phân tán phổ biến nhất hiện nay là gì?",
      description: "Git",
      distractions: ["SVN", "Mercurial", "Docker"]
    }
  ];

  let pairs = FALLBACK_PAIRS;
  let currentIndex = 0;
  let score = 0;
  let corrects = 0;
  let answered = 0;
  let isAnswering = false;

  const titleEl = document.getElementById("z-course-title");
  const scoreEl = document.getElementById("z-score");
  const startEl = document.getElementById("z-start");
  const playEl = document.getElementById("z-play");
  const resultEl = document.getElementById("z-result");
  const questionEl = document.getElementById("z-question");
  const optionsEl = document.getElementById("z-options");
  const progressEl = document.getElementById("z-progress");
  const feedbackEl = document.getElementById("z-feedback");
  const finalScoreEl = document.getElementById("z-final-score");
  const finalAccEl = document.getElementById("z-final-acc");

  window.addEventListener("DOMContentLoaded", async () => {
    if (window.EveSDK) {
      try {
        const session = await window.EveSDK.initSession({
          gameId: "game-z",
          courseId: "crs_coding_basics"
        });
        if (session && session.pairs && session.pairs.length > 0) {
          pairs = session.pairs;
          titleEl.textContent = session.courseTitle || "Khóa Học E-V-E";
        }
      } catch (err) {
        console.warn("Offline demo:", err);
      }
    }
  });

  document.getElementById("btn-z-start").addEventListener("click", () => {
    startEl.classList.add("hidden");
    playEl.classList.remove("hidden");
    if (window.EveSDK && window.EveSDK.startTimer) window.EveSDK.startTimer();
    renderQuestion(0);
  });

  document.getElementById("btn-z-replay").addEventListener("click", () => {
    resultEl.classList.add("hidden");
    startEl.classList.remove("hidden");
    score = 0;
    corrects = 0;
    answered = 0;
    currentIndex = 0;
    scoreEl.textContent = "0";
  });

  function renderQuestion(idx) {
    if (idx >= pairs.length) {
      finishGame();
      return;
    }
    isAnswering = false;
    feedbackEl.textContent = "";
    const q = pairs[idx];
    questionEl.textContent = q.title || "Thử thách " + (idx + 1);
    progressEl.textContent = (idx + 1) + "/" + pairs.length;

    const correct = q.description || q.rightAnswer || "Đáp án đúng";
    const distracts = q.distractions || ["Tùy chọn 1", "Tùy chọn 2", "Tùy chọn 3"];
    const all = [correct, ...distracts].sort(() => Math.random() - 0.5);

    optionsEl.innerHTML = "";
    all.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "btn-opt";
      btn.textContent = opt;
      btn.addEventListener("click", () => {
        if (isAnswering) return;
        isAnswering = true;
        answered += 1;
        if (opt === correct) {
          btn.classList.add("correct");
          corrects += 1;
          score += 40;
          feedbackEl.textContent = "✨ CHÍNH XÁC! +40 ĐIỂM";
          feedbackEl.style.color = "#34d399";
        } else {
          btn.classList.add("wrong");
          feedbackEl.textContent = "❌ CHƯA CHÍNH XÁC!";
          feedbackEl.style.color = "#f43f5e";
        }
        scoreEl.textContent = String(score);
        setTimeout(() => {
          currentIndex += 1;
          renderQuestion(currentIndex);
        }, 1000);
      });
      optionsEl.appendChild(btn);
    });
  }

  async function finishGame() {
    playEl.classList.add("hidden");
    resultEl.classList.remove("hidden");
    const acc = answered > 0 ? Math.round((corrects / answered) * 100) : 100;
    finalScoreEl.textContent = String(score);
    finalAccEl.textContent = acc + "%";

    if (window.EveSDK && window.EveSDK.finishGame) {
      try {
        await window.EveSDK.finishGame({ score: score, accuracy: acc });
      } catch (e) {}
    }
  }
})();`;

fs.writeFileSync(path.join(gameZDir, "index.html"), gameZHtml, "utf8");
fs.writeFileSync(path.join(gameZDir, "game.js"), gameZJs, "utf8");

// Tạo game-z.zip và eve_game_starter_kit.zip
const gameZZip = new AdmZip();
gameZZip.addLocalFolder(gameZDir);
gameZZip.writeZip(path.join(process.cwd(), "public", "game-z.zip"));
gameZZip.writeZip(path.join(process.cwd(), "public", "eve_game_starter_kit.zip"));
console.log("✅ Đã tạo thành công public/game-z.zip và public/eve_game_starter_kit.zip");

// Giải nén luôn vào public/games/ để chơi được ngay
const gamesPublicDir = path.join(process.cwd(), "public", "games");
const bossExtractDir = path.join(gamesPublicDir, "boss_battle_quiz");
const gameZExtractDir = path.join(gamesPublicDir, "game-z");

if (!fs.existsSync(bossExtractDir)) fs.mkdirSync(bossExtractDir, { recursive: true });
if (!fs.existsSync(gameZExtractDir)) fs.mkdirSync(gameZExtractDir, { recursive: true });

bossZip.extractAllTo(bossExtractDir, true);
gameZZip.extractAllTo(gameZExtractDir, true);

// Ghi đè SDK chuẩn của server vào thư mục game
const serverSdkPath = path.join(process.cwd(), "public", "eve-game-sdk.js");
fs.copyFileSync(serverSdkPath, path.join(bossExtractDir, "eve-game-sdk.js"));
fs.copyFileSync(serverSdkPath, path.join(gameZExtractDir, "eve-game-sdk.js"));

// Dọn dẹp thư mục tạm staging
if (fs.existsSync(bossDir)) fs.rmSync(bossDir, { recursive: true, force: true });
if (fs.existsSync(gameZDir)) fs.rmSync(gameZDir, { recursive: true, force: true });

console.log("✅ Đã giải nén & ghi đè SDK server cho boss_battle_quiz và game-z vào public/games/");

