/**
 * E-V-E BOSS SLAYER QUIZ - GAME ENGINE CONTROLLER
 * Architecture: State Machine + E-V-E Game SDK Integration
 */

// ── 1. FALLBACK QUESTIONS (Used if running offline or course is empty) ──
const DEFAULT_FALLBACK_PAIRS = [
  {
    id: "fb_1",
    title: "Trong lập trình Python, lệnh nào dùng để xuất kết quả ra màn hình?",
    description: "print()",
    explanation: "Hàm print() là hàm tiêu chuẩn trong Python dùng để in các thông báo, biến số hoặc kết quả tính toán ra màn hình console.",
    distractions: ["input()", "echo()", "write()"],
  },
  {
    id: "fb_2",
    title: "Cấu trúc điều kiện nào dùng để rẽ nhánh quyết định?",
    description: "if - else",
    explanation: "Cấu trúc IF - ELSE cho phép chương trình kiểm tra điều kiện logic và lựa chọn luồng thực thi tương ứng.",
    distractions: ["for - while", "def - return", "import - from"],
  },
  {
    id: "fb_3",
    title: "Biến số (Variable) trong thuật toán dùng để làm gì?",
    description: "Lưu trữ dữ liệu và thay đổi giá trị khi chạy",
    explanation: "Biến số đại diện cho một ô nhớ định danh dùng để lưu giữ các giá trị dữ liệu và có thể được gán lại trong khi chương trình chạy.",
    distractions: ["Tắt máy tính", "Xóa ổ cứng", "Tăng tốc độ mạng"],
  },
  {
    id: "fb_4",
    title: "Vòng lặp nào được dùng khi biết trước số lần lặp?",
    description: "for",
    explanation: "Vòng lặp For thường được sử dụng khi đã xác định trước số lần lặp hoặc duyệt qua một tập hợp có kích thước xác định.",
    distractions: ["while", "switch", "try - catch"],
  },
  {
    id: "fb_5",
    title: "Linh kiện nào được coi là bộ não tính toán của máy tính?",
    description: "CPU",
    explanation: "CPU (Central Processing Unit) là bộ xử lý trung tâm điều khiển và thực thi mọi tác vụ logic, số học trong hệ thống máy tính.",
    distractions: ["GPU", "RAM", "SSD"],
  },
  {
    id: "fb_6",
    title: "Bộ nhớ RAM có đặc điểm gì quan trọng?",
    description: "Truy xuất nhanh, mất dữ liệu khi tắt nguồn",
    explanation: "RAM là bộ nhớ truy xuất ngẫu nhiên tạm thời (volatile), đọc ghi tốc độ cực cao nhưng dữ liệu sẽ mất khi ngắt nguồn điện.",
    distractions: ["Lưu trữ vĩnh viễn", "Xử lý đồ họa", "Cấp nguồn điện"],
  },
  {
    id: "fb_7",
    title: "Kiểu dữ liệu nào chỉ lưu trữ 2 giá trị True hoặc False?",
    description: "Boolean",
    explanation: "Kiểu Boolean chỉ nhận một trong hai giá trị chân lý: True (đúng) hoặc False (sai).",
    distractions: ["Integer", "String", "Float"],
  },
  {
    id: "fb_8",
    title: "Mảng (Array/List) dùng để chứa tập hợp các phần tử theo thứ tự?",
    description: "Đúng (True)",
    explanation: "Mảng/Danh sách là cấu trúc dữ liệu tuyến tính lưu trữ tập hợp các phần tử có chỉ số (index) theo thứ tự xác định.",
    distractions: ["Sai (False)", "Chỉ chứa 1 phần tử", "Không thể truy xuất"],
  },
  {
    id: "fb_9",
    title: "Thuật toán tìm kiếm nhị phân (Binary Search) yêu cầu dữ liệu phải thế nào?",
    description: "Đã được sắp xếp theo thứ tự",
    explanation: "Tìm kiếm nhị phân chia đôi không gian tìm kiếm ở mỗi bước nên bắt buộc dữ liệu mảng phải được sắp xếp trước.",
    distractions: ["Xáo trộn ngẫu nhiên", "Toàn số âm", "Không có điều kiện"],
  },
  {
    id: "fb_10",
    title: "Độ phức tạp O(1) biểu thị điều gì?",
    description: "Thời gian thực thi không đổi theo kích thước dữ liệu",
    explanation: "Độ phức tạp hằng số O(1) biểu thị thuật toán luôn hoàn thành trong một lượng thời gian cố định bất kể kích thước đầu vào N.",
    distractions: ["Thời gian tăng tuyến tính", "Vòng lặp vô tận", "Thuật toán lỗi"],
  },
];

// ── 2. GLOBAL GAME STATE ──
const GameState = {
  // Boss
  bossMaxHp: 1000,
  bossHp: 1000,
  round: 1,

  // Weapon
  selectedWeapon: "sword", // "sword" | "staff"

  // Scoring & Stats
  score: 0,
  combo: 0,
  totalCorrect: 0,
  totalAnswered: 0,
  totalWrong: 0,
  accumulatedDamage: 0,
  startTime: 0,
  endTime: 0,

  // Marathon Timer
  marathonTimeMax: 10.0,
  marathonTimeRemaining: 10.0,
  marathonTimerInterval: null,

  // Questions
  questionBank: [],
  currentQuestion: null,
  isQuestionLocked: false,
  questionOrder: [],
  questionOrderIdx: 0,
  questionOrderBankSize: 0,

  // Dodge QTE
  dodgeTimeMax: 1.8,
  dodgeTimeRemaining: 1.8,
  dodgeTimerInterval: null,
  targetDirection: null, // "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight"
  isDodgeActive: false,

  // Audio & SDK
  isMuted: false,
  sdk: null,
};

// ── 3. DOM ELEMENT REFERENCES ──
const UI = {
  screens: {
    weaponSelect: document.getElementById("screen-weapon-select"),
    battle: document.getElementById("screen-battle"),
    victory: document.getElementById("screen-victory"),
    defeat: document.getElementById("screen-defeat"),
  },
  phases: {
    marathon: document.getElementById("phase-marathon"),
    attackRelease: document.getElementById("phase-attack-release"),
    dodge: document.getElementById("phase-dodge"),
  },
  header: {
    courseTitle: document.getElementById("course-title"),
    score: document.getElementById("hud-score"),
    combo: document.getElementById("hud-combo"),
    btnSound: document.getElementById("btn-sound"),
  },
  boss: {
    hpNumber: document.getElementById("boss-current-hp"),
    hpBar: document.getElementById("boss-hp-bar"),
    figure: document.getElementById("boss-figure"),
    phaseTag: document.getElementById("boss-phase-tag"),
    dmgContainer: document.getElementById("floating-damage-container"),
  },
  combatSubbar: {
    weaponIcon: document.getElementById("equipped-icon"),
    weaponName: document.getElementById("equipped-name"),
    accDamage: document.getElementById("hud-acc-damage"),
  },
  marathon: {
    timerText: document.getElementById("timer-text"),
    timerBar: document.getElementById("timer-bar-inner"),
    qNum: document.getElementById("q-number"),
    qText: document.getElementById("question-text"),
    answersGrid: document.getElementById("answers-grid"),
  },
  attackRelease: {
    summaryText: document.getElementById("attack-summary-text"),
  },
  dodge: {
    barInner: document.getElementById("dodge-bar-inner"),
    targetIcon: document.getElementById("target-direction-icon"),
    targetName: document.getElementById("target-direction-name"),
  },
  victory: {
    score: document.getElementById("res-win-score"),
    time: document.getElementById("res-win-time"),
    acc: document.getElementById("res-win-acc"),
    coins: document.getElementById("res-win-coins"),
  },
  defeat: {
    bossHp: document.getElementById("res-defeat-boss-hp"),
    score: document.getElementById("res-defeat-score"),
    reason: document.getElementById("defeat-reason-text"),
  },
};

// ── 4. INITIALIZATION & SDK INTEGRATION ──
document.addEventListener("DOMContentLoaded", () => {
  initSDK();
  fitGameToContainer();
  initFXCanvas();
  setupKeyboardListeners();
  setupSoundButton();
});

// ── 4.1. SCALE-TO-FIT CONTAINER (letterbox contain) ──
const GAME_DESIGN_WIDTH = 1280;
const GAME_DESIGN_HEIGHT = 720;

function fitGameToContainer() {
  const app = document.getElementById("game-app");
  if (!app) return;
  const scaleX = window.innerWidth / GAME_DESIGN_WIDTH;
  const scaleY = window.innerHeight / GAME_DESIGN_HEIGHT;
  app.style.position = "fixed";
  app.style.top = "50%";
  app.style.left = "50%";
  app.style.width = `${GAME_DESIGN_WIDTH}px`;
  app.style.height = `${GAME_DESIGN_HEIGHT}px`;
  app.style.marginTop = `${-(GAME_DESIGN_HEIGHT / 2)}px`;
  app.style.marginLeft = `${-(GAME_DESIGN_WIDTH / 2)}px`;
  app.style.transformOrigin = "center center";
  app.style.transform = `scale(${scaleX}, ${scaleY})`;
}

window.addEventListener("resize", () => {
  fitGameToContainer();
});

function initSDK() {
  try {
    if (typeof window !== "undefined" && window.EveSDK) {
      GameState.sdk = window.EveSDK;
    } else if (typeof window !== "undefined" && window.EVEGameSDK) {
      GameState.sdk = new window.EVEGameSDK({ gameId: "boss_battle_quiz" });
    } else if (typeof EVEGameSDK !== "undefined") {
      GameState.sdk = new EVEGameSDK({ gameId: "boss_battle_quiz" });
    }

    if (GameState.sdk) {
      GameState.sdk.onDataReady((data) => {
        console.log("[Boss Slayer] Course data loaded via SDK:", data);
        console.log("[Boss Slayer] Raw pairs from SDK:", data?.pairs);
        
        // Reset questionBank to fallback first, then override with SDK data if valid
        GameState.questionBank = [];
        
        if (data && data.pairs && Array.isArray(data.pairs) && data.pairs.length > 0) {
          // Validate pairs format: each pair should have title, description, distractions
          const validPairs = data.pairs.filter(p => p && p.title && p.description);
          console.log("[Boss Slayer] Valid pairs from SDK:", validPairs.length);
          
          if (validPairs.length > 0) {
            GameState.questionBank = validPairs;
          }
        }
        
        // Always ensure we have at least fallback pairs
        if (GameState.questionBank.length === 0) {
          GameState.questionBank = DEFAULT_FALLBACK_PAIRS;
          console.warn("[Boss Slayer] Using DEFAULT_FALLBACK_PAIRS - SDK data was empty or malformed");
        }
        
        if (data && data.courseTitle) {
          UI.header.courseTitle.innerText = `Khóa học: ${data.courseTitle}`;
        }
      });

      // Request session if not automatically pushed
      GameState.sdk.initSession({ gameId: "boss_battle_quiz" }).then((data) => {
        console.log("[Boss Slayer] initSession data:", data?.pairs?.length || 0, "pairs");
        
        // Only override questionBank if SDK data is valid
        if (data && data.pairs && Array.isArray(data.pairs) && data.pairs.length > 0) {
          // Validate format again
          const validPairs = data.pairs.filter(p => p && p.title && p.description);
          if (validPairs.length > 0 && validPairs.length <= DEFAULT_FALLBACK_PAIRS.length * 2) {
            GameState.questionBank = validPairs;
          }
        }
        
        // If questionBank still empty after initSession, ensure fallback is used
        if (GameState.questionBank.length === 0) {
          GameState.questionBank = DEFAULT_FALLBACK_PAIRS;
        }
        
        if (data && data.courseTitle) {
          UI.header.courseTitle.innerText = `Khóa học: ${data.courseTitle}`;
        }
      }).catch(() => {
        console.warn("[Boss Slayer] initSession failed, using fallback");
        if (GameState.questionBank.length === 0) {
          GameState.questionBank = DEFAULT_FALLBACK_PAIRS;
        }
      });
    } else {
      // No SDK available - use fallback immediately
      GameState.questionBank = DEFAULT_FALLBACK_PAIRS;
      UI.header.courseTitle.innerText = "Khóa học: Lập Trình Cơ Bản (Offline)";
    }
  } catch (err) {
    console.warn("EVE SDK initialization fallback:", err);
    GameState.questionBank = DEFAULT_FALLBACK_PAIRS;
    UI.header.courseTitle.innerText = "Khóa học: Lập Trình Cơ Bản (Offline)";
  }
}

function setupSoundButton() {
  UI.header.btnSound.addEventListener("click", () => {
    GameState.isMuted = !GameState.isMuted;
    UI.header.btnSound.innerText = GameState.isMuted ? "🔇" : "🔊";
  });
}

function playSound(type) {
  if (GameState.isMuted) return;
  if (GameState.sdk && typeof GameState.sdk.playSound === "function") {
    GameState.sdk.playSound(type);
  }
}

// ── 5. SCREEN MANAGEMENT ──
function showScreen(screenKey) {
  Object.values(UI.screens).forEach((screen) => screen.classList.remove("active"));
  UI.screens[screenKey].classList.add("active");
}

function showPhase(phaseKey) {
  Object.values(UI.phases).forEach((phase) => phase.classList.remove("active-phase"));
  UI.phases[phaseKey].classList.add("active-phase");
}

// ── 6. WEAPON SELECTION & GAME START ──
function selectWeapon(weaponType) {
  GameState.selectedWeapon = weaponType;
  if (weaponType === "sword") {
    UI.combatSubbar.weaponIcon.innerText = "⚔️";
    UI.combatSubbar.weaponName.innerText = "Kiếm Diệt Thần (+40 DMG & 2x Điểm)";
  } else {
    UI.combatSubbar.weaponIcon.innerText = "🪄";
    UI.combatSubbar.weaponName.innerText = "Trượng Thời Gian (+0.4s/câu đúng)";
  }

  startGame();
}

function startGame() {
  GameState.bossHp = GameState.bossMaxHp;
  GameState.round = 1;
  GameState.score = 0;
  GameState.combo = 0;
  GameState.totalCorrect = 0;
  GameState.totalAnswered = 0;
  GameState.totalWrong = 0;
  GameState.accumulatedDamage = 0;
  GameState.startTime = Date.now();
  GameState.questionOrder = [];
  GameState.questionOrderIdx = 0;

  updateHUD();
  updateBossHP(0);

  showScreen("battle");
  startMarathonPhase();
}

function restartGame() {
  clearInterval(GameState.marathonTimerInterval);
  clearInterval(GameState.dodgeTimerInterval);
  showScreen("weaponSelect");
}

// ── 7. PHASE A: 10s QUESTION MARATHON ──
function startMarathonPhase() {
  showPhase("marathon");
  UI.boss.phaseTag.innerText = `ĐỢT ${GameState.round}: TÍCH SÁT THƯƠNG 10S`;
  UI.boss.phaseTag.className = "badge-phase";

  GameState.accumulatedDamage = 0;
  GameState.marathonTimeRemaining = GameState.marathonTimeMax;
  updateAccumulatedDamageHUD();
  updateMarathonTimerBar();

  loadNextQuestion();

  // Start 100ms interval timer
  clearInterval(GameState.marathonTimerInterval);
  GameState.marathonTimerInterval = setInterval(() => {
    GameState.marathonTimeRemaining -= 0.1;
    if (GameState.marathonTimeRemaining <= 0) {
      GameState.marathonTimeRemaining = 0;
      clearInterval(GameState.marathonTimerInterval);
      updateMarathonTimerBar();
      endMarathonPhase();
    } else {
      updateMarathonTimerBar();
    }
  }, 100);
}

function updateMarathonTimerBar() {
  const percent = Math.min(100, Math.max(0, (GameState.marathonTimeRemaining / GameState.marathonTimeMax) * 100));
  UI.marathon.timerBar.style.width = `${percent}%`;
  UI.marathon.timerText.innerText = `${GameState.marathonTimeRemaining.toFixed(1)}s`;

  if (GameState.marathonTimeRemaining <= 3) {
    UI.marathon.timerBar.style.background = "linear-gradient(90deg, #f43f5e, #fb7185)";
  } else {
    UI.marathon.timerBar.style.background = "linear-gradient(90deg, #06b6d4, #38bdf8)";
  }
}

function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestionOrder() {
  const bank = GameState.questionBank.length > 0
    ? GameState.questionBank
    : DEFAULT_FALLBACK_PAIRS;
  GameState.questionOrder = shuffleArray(bank.map((_, i) => i));
  GameState.questionOrderIdx = 0;
  GameState.questionOrderBankSize = bank.length;
}

function loadNextQuestion() {
  GameState.isQuestionLocked = false;

  // Use questionBank if available and has items, otherwise fallback
  const bank = GameState.questionBank && GameState.questionBank.length > 0
    ? GameState.questionBank
    : DEFAULT_FALLBACK_PAIRS;

  // Build shuffled order lazily
  if (
    GameState.questionOrder.length === 0 ||
    GameState.questionOrderBankSize !== bank.length ||
    GameState.questionOrderIdx >= GameState.questionOrder.length
  ) {
    // Build order from bank
    const orderBank = bank.length > 0 ? bank : DEFAULT_FALLBACK_PAIRS;
    GameState.questionOrder = shuffleArray(bank.map((_, i) => i));
    GameState.questionOrderBankSize = bank.length;
  }

  // Guard: if still no questions, show error and stop
  if (GameState.questionOrder.length === 0) {
    console.error("[Boss Slayer] No questions available in bank or fallback!");
    UI.marathon.qText.innerText = "Lỗi: Không có câu hỏi!";
    UI.marathon.answersGrid.innerHTML = "";
    return;
  }

  GameState.questionOrderIdx = (GameState.questionOrderIdx % GameState.questionOrder.length);
  const pair = bank[GameState.questionOrder[GameState.questionOrderIdx]];
  GameState.questionOrderIdx++;

  // Guard: if pair is somehow undefined, use first from bank
  if (!pair) {
    console.warn("[Boss Slayer] Pair undefined, using first from bank");
    pair = bank[0];
  }

  GameState.currentQuestion = pair;
  const correct = pair.description || pair.rightAnswer || "Đáp án đúng";
  const distractions = pair.distractions || ["Đáp án A", "Đáp án B", "Đáp án C"];

  // Shuffle options
  const options = shuffleArray([correct, ...distractions]);

  UI.marathon.qNum.innerText = `CÂU #${GameState.totalAnswered + 1}`;
  // Show title if available, otherwise fallback text
  UI.marathon.qText.innerText = pair.title || "Câu hỏi thử thách:";

  UI.marathon.answersGrid.innerHTML = "";
  const keyHints = ["1", "2", "3", "4"];

  options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "ans-btn";
    btn.innerHTML = `<span class="key-hint">${keyHints[idx] || idx + 1}</span> <span>${opt}</span>`;
    btn.onclick = () => handleAnswerSelect(opt, correct, btn);
    UI.marathon.answersGrid.appendChild(btn);
  });
}

function handleAnswerSelect(selected, correct, btnElem) {
  if (GameState.isQuestionLocked || GameState.marathonTimeRemaining <= 0) return;
  GameState.isQuestionLocked = true;
  GameState.totalAnswered++;

  const isRight = selected === correct;

  if (isRight) {
    btnElem.classList.add("correct");
    GameState.totalCorrect++;
    GameState.combo++;

    // Base damage per right answer
    let damageGained = 60 + (GameState.combo * 5);
    let pointsGained = 20 * Math.min(3, 1 + (GameState.combo * 0.2));

    // Weapon Perks
    if (GameState.selectedWeapon === "sword") {
      damageGained += 40; // Sword perk: +40 DMG
      pointsGained *= 2;  // Sword perk: 2x points
      showFloatingDamage(`+${damageGained} DMG! ⚔️`, "#f97316");
    } else if (GameState.selectedWeapon === "staff") {
      // Magic Staff perk: +0.4s time extension
      GameState.marathonTimeRemaining += 0.4;
      showFloatingDamage(`+0.4s 🪄`, "#38bdf8");
    }

    GameState.accumulatedDamage += damageGained;
    GameState.score += Math.round(pointsGained);

    playSound("hit");
    createSlashFX();
  } else {
    btnElem.classList.add("wrong");
    GameState.combo = 0;
    GameState.totalWrong++;

    // Wrong answer penalty: -0.5s in marathon battle phase
    GameState.marathonTimeRemaining = Math.max(0, GameState.marathonTimeRemaining - 0.5);
    updateMarathonTimerBar();

    playSound("wrong");
    showFloatingDamage("MISS! 0 DMG (-0.5s ⏳)", "#f43f5e");

    // If time is fully consumed by penalties, end the marathon immediately
    if (GameState.marathonTimeRemaining <= 0) {
      clearInterval(GameState.marathonTimerInterval);
      endMarathonPhase();
      return;
    }
  }

  updateHUD();
  updateAccumulatedDamageHUD();

  // Report real-time progress to SDK
  if (GameState.sdk) {
    GameState.sdk.updateProgress({
      score: GameState.score,
      currentStreak: GameState.combo,
      progressPercent: Math.min(100, Math.round(((GameState.bossMaxHp - GameState.bossHp) / GameState.bossMaxHp) * 100)),
      currentQuestion: GameState.totalAnswered,
      totalQuestions: 20,
    });
  }

  // Rapid fire next question after 120ms
  setTimeout(() => {
    if (GameState.marathonTimeRemaining > 0) {
      loadNextQuestion();
    }
  }, 120);
}

function updateAccumulatedDamageHUD() {
  UI.combatSubbar.accDamage.innerText = `${GameState.accumulatedDamage} DMG`;
}

function updateHUD() {
  UI.header.score.innerText = GameState.score;
  UI.header.combo.innerText = `x${GameState.combo}`;
}

// ── 8. PHASE B: ATTACK RELEASE CUTSCENE ──
function endMarathonPhase() {
  showPhase("attackRelease");
  UI.attackRelease.summaryText.innerText = `Bạn đã tích lũy tổng cộng ${GameState.accumulatedDamage} Sát Thương! Đang xả toàn lực lên Trùm Hư Không...`;

  playSound("slash");

  // Attack unleash animation sequence
  setTimeout(() => {
    // Apply damage to Boss
    const prevHp = GameState.bossHp;
    GameState.bossHp = Math.max(0, GameState.bossHp - GameState.accumulatedDamage);
    const actualDamage = prevHp - GameState.bossHp;

    updateBossHP(actualDamage);
    showFloatingDamage(`-${actualDamage} HP 💥`, "#ff0055");

    // Boss shake effect
    UI.boss.figure.classList.add("hit-shake");
    setTimeout(() => UI.boss.figure.classList.remove("hit-shake"), 500);

    // Check Victory
    if (GameState.bossHp <= 0) {
      setTimeout(() => {
        handleVictory();
      }, 900);
    } else {
      // Transition to Boss Counterattack / Dodge Phase
      setTimeout(() => {
        startDodgePhase();
      }, 1200);
    }
  }, 700);
}

function updateBossHP(dmgTaken) {
  UI.boss.hpNumber.innerText = GameState.bossHp;
  const percent = (GameState.bossHp / GameState.bossMaxHp) * 100;
  UI.boss.hpBar.style.width = `${percent}%`;
}

function showFloatingDamage(text, color) {
  const popup = document.createElement("div");
  popup.className = "floating-damage";
  popup.innerText = text;
  if (color) popup.style.color = color;
  popup.style.left = `${Math.random() * 60 + 20}%`;
  popup.style.top = `${Math.random() * 40 + 20}%`;

  UI.boss.dmgContainer.appendChild(popup);
  setTimeout(() => {
    popup.remove();
  }, 900);
}

// ── 9. PHASE C: BOSS COUNTERATTACK & DODGE QTE ──
const DIRECTIONS = [
  { key: "ArrowUp", wasd: "KeyW", name: "MŨI TÊN LÊN (UP / W)", icon: "⬆️" },
  { key: "ArrowDown", wasd: "KeyS", name: "MŨI TÊN XUỐNG (DOWN / S)", icon: "⬇️" },
  { key: "ArrowLeft", wasd: "KeyA", name: "MŨI TÊN TRÁI (LEFT / A)", icon: "⬅️" },
  { key: "ArrowRight", wasd: "KeyD", name: "MŨI TÊN PHẢI (RIGHT / D)", icon: "➡️" },
];

function startDodgePhase() {
  showPhase("dodge");
  UI.boss.phaseTag.innerText = "CẢNH BÁO: TRÙM PHẢN CÔNG!";
  UI.boss.phaseTag.className = "badge-phase";
  playSound("boss_attack");

  // Pick random direction
  const chosen = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
  GameState.targetDirection = chosen;
  GameState.isDodgeActive = true;

  // Dodge penalty: -0.1s per completed dodge phase (cumulative) + -0.1s per wrong answer (cumulative), min 0.4s
  const completedDodgePenalty = (GameState.round - 1) * 0.1;
  const wrongAnswerPenalty = GameState.totalWrong * 0.1;
  GameState.dodgeTimeRemaining = Math.max(0.4, GameState.dodgeTimeMax - completedDodgePenalty - wrongAnswerPenalty);

  UI.dodge.targetIcon.innerText = chosen.icon;
  UI.dodge.targetName.innerText = chosen.name;
  UI.dodge.barInner.style.width = `${(GameState.dodgeTimeRemaining / GameState.dodgeTimeMax) * 100}%`;

  clearInterval(GameState.dodgeTimerInterval);
  GameState.dodgeTimerInterval = setInterval(() => {
    GameState.dodgeTimeRemaining -= 0.05;
    const pct = Math.max(0, (GameState.dodgeTimeRemaining / GameState.dodgeTimeMax) * 100);
    UI.dodge.barInner.style.width = `${pct}%`;

    if (GameState.dodgeTimeRemaining <= 0) {
      clearInterval(GameState.dodgeTimerInterval);
      if (GameState.isDodgeActive) {
        handleDodgeFailure("Hết thời gian né đòn! Bạn đã bị đòn hủy diệt của Ma Thần nghiền nát.");
      }
    }
  }, 50);
}

function handleDodgeInput(directionKey) {
  if (!GameState.isDodgeActive) return;

  if (directionKey === GameState.targetDirection.key) {
    // SUCCESSFUL DODGE!
    GameState.isDodgeActive = false;
    clearInterval(GameState.dodgeTimerInterval);
    playSound("dodge");

    showFloatingDamage("PERFECT DODGE! 💨", "#10b981");

    // Bonus points for dodge
    GameState.score += 50;
    updateHUD();

    // Advance to next round
    GameState.round++;
    setTimeout(() => {
      startMarathonPhase();
    }, 800);
  } else {
    // WRONG DIRECTION PRESSED -> INSTANT DEFEAT!
    GameState.isDodgeActive = false;
    clearInterval(GameState.dodgeTimerInterval);
    handleDodgeFailure("Bấm sai hướng né! Bạn đã bị trúng trọn đòn phản công cực đại.");
  }
}

function handleDodgeFailure(reason) {
  GameState.isDodgeActive = false;
  playSound("damage");

  UI.defeat.reason.innerText = reason;
  UI.defeat.bossHp.innerText = `${GameState.bossHp} / ${GameState.bossMaxHp} HP`;
  UI.defeat.score.innerText = `${GameState.score} PTS`;

  // SDK notify finish
  if (GameState.sdk) {
    GameState.sdk.finishGame({
      score: GameState.score,
      isWin: false,
      accuracyPercent: GameState.totalAnswered > 0 ? Math.round((GameState.totalCorrect / GameState.totalAnswered) * 100) : 0,
      playTimeSeconds: Math.round((Date.now() - GameState.startTime) / 1000),
    });
  }

  setTimeout(() => {
    showScreen("defeat");
  }, 600);
}

// ── 10. VICTORY HANDLER ──
function handleVictory() {
  GameState.endTime = Date.now();
  const playTimeSec = Math.round((GameState.endTime - GameState.startTime) / 1000);
  const accuracy = GameState.totalAnswered > 0 ? Math.round((GameState.totalCorrect / GameState.totalAnswered) * 100) : 100;
  const coinsWon = Math.round(GameState.score * 0.5) + 30;

  UI.victory.score.innerText = `${GameState.score} PTS`;
  UI.victory.time.innerText = `${playTimeSec}s`;
  UI.victory.acc.innerText = `${accuracy}%`;
  UI.victory.coins.innerText = `+${coinsWon} 🪙`;

  playSound("win");
  createVictoryConfetti();

  if (GameState.sdk) {
    GameState.sdk.finishGame({
      score: GameState.score,
      isWin: true,
      accuracyPercent: accuracy,
      playTimeSeconds: playTimeSec,
      details: {
        weapon: GameState.selectedWeapon,
        rounds: GameState.round,
        bossDefeated: true,
      },
    });
  }

  showScreen("victory");
}

function notifyParentFinish() {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: "EVE_GAME_FINISHED", payload: { score: GameState.score, isWin: true } }, "*");
  } else {
    alert("Cảm ơn bạn đã hoàn thành màn chơi thử thách!");
  }
}

// ── 11. KEYBOARD LISTENERS (1-4 for questions, Arrows & WASD for dodge) ──
function setupKeyboardListeners() {
  window.addEventListener("keydown", (e) => {
    // Marathon Answer Shortcuts: 1, 2, 3, 4
    if (UI.screens.battle.classList.contains("active") && UI.phases.marathon.classList.contains("active-phase")) {
      const btns = UI.marathon.answersGrid.querySelectorAll(".ans-btn");
      if (e.key === "1" && btns[0]) btns[0].click();
      if (e.key === "2" && btns[1]) btns[1].click();
      if (e.key === "3" && btns[2]) btns[2].click();
      if (e.key === "4" && btns[3]) btns[3].click();
    }

    // Dodge QTE Shortcuts: Arrows or WASD
    if (GameState.isDodgeActive) {
      if (e.key === "ArrowUp" || e.code === "KeyW") handleDodgeInput("ArrowUp");
      if (e.key === "ArrowDown" || e.code === "KeyS") handleDodgeInput("ArrowDown");
      if (e.key === "ArrowLeft" || e.code === "KeyA") handleDodgeInput("ArrowLeft");
      if (e.key === "ArrowRight" || e.code === "KeyD") handleDodgeInput("ArrowRight");
    }
  });
}

// ── 12. CANVAS PARTICLE FX SYSTEM ──
let fxCanvas, fxCtx, particles = [];

function initFXCanvas() {
  fxCanvas = document.getElementById("fx-canvas");
  if (!fxCanvas) return;
  fxCtx = fxCanvas.getContext("2d");

  function resize() {
    const app = document.getElementById("game-app");
    fxCanvas.width = app && app.clientWidth ? app.clientWidth : window.innerWidth;
    fxCanvas.height = app && app.clientHeight ? app.clientHeight : window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  // Spawn background ambient dust particles
  for (let i = 0; i < 35; i++) {
    particles.push({
      x: Math.random() * fxCanvas.width,
      y: Math.random() * fxCanvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      size: Math.random() * 2 + 1,
      color: "rgba(6, 182, 212, 0.4)",
    });
  }

  animateFX();
}

function animateFX() {
  if (!fxCtx) return;
  fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;

    if (p.isExplosion) {
      p.life -= 0.02;
      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }
      fxCtx.fillStyle = p.color;
      fxCtx.globalAlpha = p.life;
      fxCtx.beginPath();
      fxCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      fxCtx.fill();
      fxCtx.globalAlpha = 1.0;
    } else {
      // Wrap around screen
      if (p.x < 0) p.x = fxCanvas.width;
      if (p.x > fxCanvas.width) p.x = 0;
      if (p.y < 0) p.y = fxCanvas.height;
      if (p.y > fxCanvas.height) p.y = 0;

      fxCtx.fillStyle = p.color;
      fxCtx.beginPath();
      fxCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      fxCtx.fill();
    }
  }

  requestAnimationFrame(animateFX);
}

function createSlashFX() {
  if (!fxCanvas) return;
  const cx = fxCanvas.width / 2;
  const cy = fxCanvas.height * 0.3;

  for (let i = 0; i < 18; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 6 + 2;
    particles.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 3 + 2,
      color: GameState.selectedWeapon === "sword" ? "#f97316" : "#38bdf8",
      life: 1.0,
      isExplosion: true,
    });
  }
}

function createVictoryConfetti() {
  if (!fxCanvas) return;
  const colors = ["#fbbf24", "#06b6d4", "#f43f5e", "#10b981", "#a855f7"];
  for (let i = 0; i < 80; i++) {
    particles.push({
      x: fxCanvas.width / 2 + (Math.random() - 0.5) * 200,
      y: fxCanvas.height / 2,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.8) * 14,
      size: Math.random() * 4 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1.5,
      isExplosion: true,
    });
  }
}
