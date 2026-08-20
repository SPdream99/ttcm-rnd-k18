// Logic Let's Learn SDK Integration
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
  let questionOrder = [];
  let currentIndex = 0;
  let score = 0;
  let corrects = 0;
  let answered = 0;
  let isAnswering = false;

  function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function buildQuestionOrder() {
    questionOrder = shuffleArray(pairs.map((_, i) => i));
    currentIndex = 0;
  }

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
        // Đăng ký callback để nhận dữ liệu bài học đẩy qua postMessage từ Host container
        if (typeof window.EveSDK.onDataReady === "function") {
          window.EveSDK.onDataReady((data) => {
            if (data && Array.isArray(data.pairs) && data.pairs.length > 0) {
              pairs = data.pairs;
              titleEl.textContent = data.courseTitle || "Khóa Học E-V-E";
              buildQuestionOrder();
            }
          });
        }
        const session = await window.EveSDK.initSession({
          gameId: "let_s_learn"
        });
        if (session && session.pairs && session.pairs.length > 0) {
          pairs = session.pairs;
          titleEl.textContent = session.courseTitle || "Khóa Học E-V-E";
          buildQuestionOrder();
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
    buildQuestionOrder();
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
    buildQuestionOrder();
  });

  function renderQuestion(pos) {
    if (pos >= questionOrder.length) {
      finishGame();
      return;
    }
    isAnswering = false;
    feedbackEl.textContent = "";
    const q = pairs[questionOrder[pos]];
    questionEl.textContent = q.title || "Thử thách " + (pos + 1);
    progressEl.textContent = (pos + 1) + "/" + questionOrder.length;

    const correct = q.description || q.rightAnswer || "Đáp án đúng";
    const distracts = q.distractions || ["Tùy chọn 1", "Tùy chọn 2", "Tùy chọn 3"];
    const all = shuffleArray([correct, ...distracts]);

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
})();