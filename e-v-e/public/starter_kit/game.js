/**
 * E-V-E Game Starter Kit - Minigame Template Logic
 * File này hướng dẫn Thầy/Cô cách kết nối E-V-E Game SDK v2.0
 */

// ── 1. Dữ liệu mẫu Fallback (Dùng khi Thầy/Cô chạy test offline mở trực tiếp file index.html) ──
const DEFAULT_FALLBACK_PAIRS = [
  {
    id: "demo_p1",
    title: "Trong lập trình, cấu trúc điều kiện nào dùng để rẽ nhánh khi đúng hoặc sai?",
    description: "Cấu trúc IF - ELSE",
    explanation: "Cấu trúc IF - ELSE cho phép chương trình kiểm tra một biểu thức điều kiện Logic (Boolean). Nếu biểu thức trả về True thì thực thi khối lệnh IF, ngược lại thực thi khối lệnh ELSE.",
    distractions: ["Vòng lặp For", "Vòng lặp While", "Hàm Function"],
  },
  {
    id: "demo_p2",
    title: "Linh kiện nào được coi là 'Bộ Não' xử lý trung tâm của máy tính?",
    description: "CPU (Central Processing Unit)",
    explanation: "CPU là bộ vi xử lý trung tâm, chịu trách nhiệm nhận, giải mã và thực thi các chỉ lệnh của chương trình máy tính bằng các khối ALU và Control Unit.",
    distractions: ["RAM", "Ổ cứng SSD", "Bộ nguồn PSU"],
  },
  {
    id: "demo_p3",
    title: "Ai là người khám phá ra hằng số lượng tử Planck (h)?",
    description: "Max Planck",
    explanation: "Nhà vật lý Max Planck đã đề xuất thuyết lượng tử năng lượng E = h.f vào năm 1900, mở ra kỷ nguyên Vật lý Lượng tử hiện đại.",
    distractions: ["Albert Einstein", "Isaac Newton", "Niels Bohr"],
  },
  {
    id: "demo_p4",
    title: "Bộ nhớ truy xuất ngẫu nhiên tạm thời của máy tính viết tắt là gì?",
    description: "RAM (Random Access Memory)",
    explanation: "RAM là bộ nhớ khả biến (volatile memory) có tốc độ cực cao, lưu trữ tạm thời các chương trình và dữ liệu đang chạy để CPU truy xuất trực tiếp.",
    distractions: ["ROM", "HDD", "GPU"],
  },
  {
    id: "demo_p5",
    title: "Mạng nơ-ron nhân tạo trong Trí Tuệ Nhân Tạo (AI) được viết tắt là gì?",
    description: "ANN (Artificial Neural Network)",
    explanation: "Mạng nơ-ron nhân tạo (ANN) là mô hình tính toán lấy cảm hứng từ cấu trúc mạng lưới nơ-ron sinh học trong não bộ con người.",
    distractions: ["CNN", "RNN", "API"],
  },
];

// ── Game State ──
let gameSession = null;
let questionPairs = DEFAULT_FALLBACK_PAIRS;
let currentIndex = 0;
let userScore = 0;
let streakCount = 0;
let correctCount = 0;
let isAnswered = false;

// DOM Elements
const elCourseTitle = document.getElementById("course-title");
const elScoreDisplay = document.getElementById("score-display");
const elProgressBar = document.getElementById("progress-bar");
const elStartScreen = document.getElementById("start-screen");
const elPlayScreen = document.getElementById("play-screen");
const elResultScreen = document.getElementById("result-screen");
const elQuestionIndex = document.getElementById("question-index");
const elStreakBadge = document.getElementById("streak-badge");
const elQuestionText = document.getElementById("question-text");
const elOptionsGrid = document.getElementById("options-grid");
const elExplanationBox = document.getElementById("explanation-box");
const elExplanationText = document.getElementById("explanation-text");
const elBtnNext = document.getElementById("btn-next");
const elBtnStart = document.getElementById("btn-start");
const elBtnReplay = document.getElementById("btn-replay");
const elBtnFullscreen = document.getElementById("btn-fullscreen");
const elFinalScore = document.getElementById("final-score");
const elFinalAccuracy = document.getElementById("final-accuracy");
const elEarnedCoins = document.getElementById("earned-coins");

// ── 2. Khởi tạo SDK & Lắng nghe dữ liệu bài học ──
window.addEventListener("DOMContentLoaded", async () => {
  if (window.EveSDK) {
    try {
      console.log("🎮 Đang khởi tạo E-V-E Game SDK v2.0...");
      gameSession = await window.EveSDK.initSession({
        gameId: "starter_quiz_game",
        courseId: "crs_coding_basics",
      });

      if (gameSession && gameSession.pairs && gameSession.pairs.length > 0) {
        questionPairs = gameSession.pairs;
        elCourseTitle.textContent = gameSession.courseTitle || "Khóa Học E-V-E";
        console.log("✅ Đã nhận thành công bộ câu hỏi từ khóa học:", gameSession.pairs);
      } else {
        elCourseTitle.textContent = "Chế Độ Chạy Thử Nghiệm (Offline Demo)";
      }
    } catch (e) {
      console.warn("⚠️ Không thể kết nối máy chủ E-V-E, sử dụng bộ câu hỏi mẫu:", e);
      elCourseTitle.textContent = "Chế Độ Chạy Thử Nghiệm (Offline Demo)";
    }
  } else {
    elCourseTitle.textContent = "Chế Độ Chạy Thử Nghiệm (Offline Demo)";
  }
});

// Fullscreen Button
elBtnFullscreen.addEventListener("click", () => {
  if (window.EveSDK) {
    window.EveSDK.toggleFullscreen();
  } else {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }
});

// Start Game
elBtnStart.addEventListener("click", () => {
  currentIndex = 0;
  userScore = 0;
  streakCount = 0;
  correctCount = 0;
  elScoreDisplay.textContent = "0";

  elStartScreen.classList.remove("active");
  elResultScreen.classList.remove("active");
  elPlayScreen.classList.add("active");

  showQuestion();
});

// Replay Game
elBtnReplay.addEventListener("click", () => {
  elResultScreen.classList.remove("active");
  elStartScreen.classList.add("active");
});

// Show Question
function showQuestion() {
  isAnswered = false;
  elExplanationBox.classList.add("hidden");

  const currentPair = questionPairs[currentIndex];
  const totalQuestions = questionPairs.length;

  elQuestionIndex.textContent = `Câu ${currentIndex + 1} / ${totalQuestions}`;
  elStreakBadge.textContent = `Chuỗi: x${Math.max(1, streakCount)} 🔥`;
  elQuestionText.textContent = currentPair.title;

  // Update progress bar
  const progressPercent = (currentIndex / totalQuestions) * 100;
  elProgressBar.style.width = `${progressPercent}%`;

  // Merge Right Answer + Distractions and Shuffle
  const rightAnswer = currentPair.description || "";
  const wrongAnswers = Array.isArray(currentPair.distractions) ? currentPair.distractions : [];
  const allOptions = [rightAnswer, ...wrongAnswers].filter(Boolean);

  // Shuffle options
  allOptions.sort(() => Math.random() - 0.5);

  elOptionsGrid.innerHTML = "";
  const keyLabels = ["A", "B", "C", "D", "E"];

  allOptions.forEach((optionText, idx) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerHTML = `
      <span class="option-key">${keyLabels[idx] || (idx + 1)}</span>
      <span class="option-text">${optionText}</span>
    `;

    btn.addEventListener("click", () => handleSelectOption(btn, optionText, rightAnswer, currentPair));
    elOptionsGrid.appendChild(btn);
  });
}

// Handle Select Option
function handleSelectOption(selectedBtn, chosenText, rightAnswer, pair) {
  if (isAnswered) return;
  isAnswered = true;

  const isCorrect = chosenText.trim().toLowerCase() === rightAnswer.trim().toLowerCase();

  // Disable all buttons and highlight
  const allBtns = elOptionsGrid.querySelectorAll(".option-btn");
  allBtns.forEach((btn) => {
    btn.disabled = true;
    const txt = btn.querySelector(".option-text")?.textContent || "";
    if (txt.trim().toLowerCase() === rightAnswer.trim().toLowerCase()) {
      btn.classList.add("correct");
    }
  });

  if (isCorrect) {
    selectedBtn.classList.add("correct");
    streakCount++;
    correctCount++;
    const points = 20 * (streakCount > 1 ? 1.5 : 1.0);
    userScore += Math.round(points);
    elScoreDisplay.textContent = userScore.toString();

    // ── 3. Báo cáo âm thanh qua SDK ──
    if (window.EveSDK) {
      window.EveSDK.playSound("correct");
    }
  } else {
    selectedBtn.classList.add("wrong");
    streakCount = 0;

    if (window.EveSDK) {
      window.EveSDK.playSound("wrong");
    }
  }

  // ── 4. Báo cáo tiến độ thời gian thực (Live Progress) ──
  if (window.EveSDK) {
    window.EveSDK.updateProgress({
      score: userScore,
      currentStreak: streakCount,
      progressPercent: ((currentIndex + 1) / questionPairs.length) * 100,
      currentQuestion: currentIndex + 1,
      totalQuestions: questionPairs.length,
    });
  }

  // Show Explanation Box
  if (pair.explanation) {
    elExplanationText.textContent = pair.explanation;
  } else {
    elExplanationText.textContent = `Đáp án chính xác là: "${rightAnswer}".`;
  }
  elExplanationBox.classList.remove("hidden");
}

// Next Question Button
elBtnNext.addEventListener("click", () => {
  currentIndex++;
  if (currentIndex < questionPairs.length) {
    showQuestion();
  } else {
    finishGame();
  }
});

// Finish Game
async function finishGame() {
  elPlayScreen.classList.remove("active");
  elResultScreen.classList.add("active");
  elProgressBar.style.width = "100%";

  const totalQuestions = questionPairs.length;
  const accuracy = Math.round((correctCount / totalQuestions) * 100);
  const isWin = accuracy >= 60;

  elFinalScore.textContent = `${userScore} Điểm`;
  elFinalAccuracy.textContent = `${accuracy}%`;

  let earnedCoins = 0;

  // ── 5. Gửi kết quả hoàn thành lên E-V-E để nhận thưởng Coins ──
  if (window.EveSDK) {
    try {
      const result = await window.EveSDK.finishGame({
        score: userScore,
        isWin: isWin,
        accuracyPercent: accuracy,
        playTimeSeconds: 45,
        details: { correctCount, totalQuestions },
      });

      earnedCoins = result?.data?.earnedCoins || (isWin ? 50 : 10);
    } catch (err) {
      console.warn("Lỗi gửi kết quả về máy chủ:", err);
      earnedCoins = isWin ? 50 : 10;
    }
  } else {
    earnedCoins = isWin ? 50 : 10;
  }

  elEarnedCoins.textContent = `+${earnedCoins} 🪙`;
}
