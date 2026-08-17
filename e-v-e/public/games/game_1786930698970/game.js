// Logic Game Boss Battle Quiz tích hợp E-V-E SDK
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
})();