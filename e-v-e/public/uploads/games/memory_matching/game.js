/**
 * E-V-E MEMORY MATCHING GAME ENGINE v3.0
 * Giao diện & logic đồng bộ với bản tham chiếu MemoryMatchingGame/ (FIND THE PAIRS)
 * - Level-based (4/6/8 cặp thẻ), Lives (5 Hearts), Preview Timer, Combo Score, Reward Coins
 * - Tích hợp E-V-E Game SDK v2.x (onDataReady, initSession, updateProgress, finishGame)
 */

(function () {
  'use strict';

  // ─── DOM Elements ────────────────────────────────────────────────────────────
  const screenStart = document.getElementById('screen-start');
  const screenGameplay = document.getElementById('screen-gameplay');
  const modalLevelComplete = document.getElementById('modal-level-complete');
  const modalGameOver = document.getElementById('modal-gameover');
  const previewBanner = document.getElementById('preview-banner');
  const previewCountdownEl = document.getElementById('preview-countdown');

  const btnStart = document.getElementById('btn-start-game');
  const btnContinue = document.getElementById('btn-continue');
  const btnPlayAgain = document.getElementById('btn-play-again');
  const btnClaimReward = document.getElementById('btn-claim-reward');
  const btnSoundToggle = document.getElementById('btn-sound-toggle');
  const bgmAudio = document.getElementById('bgm-audio');

  const cardsGrid = document.getElementById('cards-grid');
  const scoreDisplay = document.getElementById('score-display');
  const comboDisplay = null; // combo is internal (reference UI shows only hearts)
  const livesDisplay = document.getElementById('lives-display');
  const livesCount = document.getElementById('lives-count');
  const levelDisplay = document.getElementById('level-display');
  const startLevelBadge = document.getElementById('start-level-badge');
  const matchedDisplay = document.getElementById('matched-display');
  const totalDisplay = document.getElementById('total-display');
  const progressFill = document.getElementById('progress-fill');
  const courseTitleEl = document.getElementById('course-title');
  const startPairsCount = document.getElementById('start-pairs-count');

  const gameoverLevel = document.getElementById('gameover-level');
  const gameoverLevelStat = document.getElementById('gameover-level-stat');
  const gameoverScore = document.getElementById('gameover-score');
  const gameoverMatches = document.getElementById('gameover-matches');
  const gameoverReward = document.getElementById('gameover-reward');
  const claimAmount = document.getElementById('claim-amount');
  const rewardClaimedAmount = document.getElementById('reward-claimed-amount');
  const rewardClaimSection = document.getElementById('reward-claim-section');
  const rewardClaimedSection = document.getElementById('reward-claimed-section');

  const completePairs = document.getElementById('complete-pairs');
  const completeHearts = document.getElementById('complete-hearts');

  // ─── Game State ──────────────────────────────────────────────────────────────
  const MAX_LIVES = 5;
  const PREVIEW_SECONDS = 4;

  let soundEnabled = true;
  let previewInterval = null;

  let score = 0;
  let combo = 1;
  let lives = MAX_LIVES;
  let level = 1;
  let highestLevelReached = 1;
  let rewardClaimed = false;
  let movesCount = 0;
  let matchedPairsCount = 0;
  let totalMatches = 0;

  let cards = [];
  let flippedCards = [];
  let isLocked = false;
  let isPreviewing = false;
  let isGameActive = false;

  // ─── SDK Instance ────────────────────────────────────────────────────────────
  let sdkInstance = null;

  function playSound(type) {
    if (!soundEnabled) return;
    try {
      if (sdkInstance && typeof sdkInstance.playSound === 'function') {
        sdkInstance.playSound(type);
      }
    } catch (e) {
      console.warn('Sound warning:', e);
    }
  }

  // ─── Default Content (Fallback if no external course payload) ─────────────────
  const DEFAULT_PAIRS = [
    {
      id: 'p1',
      term: '🐱 Con Mèo (Cat)',
      definition: 'Loài thú cưng nhanh nhẹn, tiếng kêu Meo Meo',
      icon: '🐱',
    },
    {
      id: 'p2',
      term: '🐶 Con Chó (Dog)',
      definition: 'Loài vật trung thành, tiếng sủa Gâu Gâu',
      icon: '🐶',
    },
    {
      id: 'p3',
      term: '🍎 Quả Táo (Apple)',
      definition: 'Trái cây giàu vitamin C và chất xơ',
      icon: '🍎',
    },
    {
      id: 'p4',
      term: '📚 Sách Vở (Book)',
      definition: 'Kho tàng tri thức lưu giữ kiến thức nhân loại',
      icon: '📚',
    },
    {
      id: 'p5',
      term: '⚡ Thuật Toán (Algorithm)',
      definition: 'Tập hợp các bước hữu hạn giải quyết bài toán',
      icon: '⚡',
    },
    {
      id: 'p6',
      term: '🌌 Trí Tuệ Nhân Tạo (AI)',
      definition: 'Hệ thống máy tính mô phỏng trí thông minh con người',
      icon: '🌌',
    },
    {
      id: 'p7',
      term: '🚀 Vòng Lặp (Loop)',
      definition: 'Lặp lại một khối lệnh nhiều lần tự động',
      icon: '🚀',
    },
    {
      id: 'p8',
      term: '🎯 Hàm (Function)',
      definition: 'Khối lệnh đặt tên, tái sử dụng nhiều lần',
      icon: '🎯',
    },
  ];

  const FALLBACK_ICONS = ['💡', '✨', '🔍', '🧩', '⭐', '🌈', '🎈', '🪐'];

  let rawQuestionPairs = DEFAULT_PAIRS;

  // ─── Level Config: 4 / 6 / 8 cặp thẻ ─────────────────────────────────────────
  function pairsForLevel(targetLevel) {
    if (targetLevel <= 1) return 4;
    if (targetLevel === 2) return 6;
    return 8;
  }

  // ─── Luật qua chặng (pass rule) của game ─────────────────────────────────────
  // Mặc định: đạt tối thiểu Level 2. Có thể được Host truyền qua sessionData.passRule.
  let PASS_RULE = { type: 'minLevel', value: 2 };

  function evaluatePassRule(rule, reachedLevel) {
    const r = rule && typeof rule === 'object' ? rule : PASS_RULE;
    const type = r.type || 'minLevel';
    const value = Number(r.value) || 2;
    if (type === 'minScore') return false; // điểm do server quyết định theo rule
    if (type === 'minAccuracy') return false;
    return reachedLevel >= value; // minLevel
  }

  // ─── Initialize E-V-E Game SDK ───────────────────────────────────────────────
  function initSDKConnection() {
    try {
      if (typeof window.EVEGameSDK === 'function') {
        sdkInstance = new window.EVEGameSDK({ gameId: 'game_card_match_vr' });
        if (typeof sdkInstance.onDataReady === 'function') {
          sdkInstance.onDataReady(function (sessionData) {
            console.log('🎮 SDK Initialized with session payload:', sessionData);
            if (sessionData && sessionData.courseTitle) {
              courseTitleEl.textContent = sessionData.courseTitle;
            }
            if (sessionData && sessionData.passRule) {
              PASS_RULE = sessionData.passRule;
            }
            if (sessionData && Array.isArray(sessionData.pairs) && sessionData.pairs.length >= 2) {
              rawQuestionPairs = sessionData.pairs.map((p, idx) => ({
                id: p.id || 'pair_' + idx,
                term: p.title || p.term || 'Khái niệm #' + (idx + 1),
                definition:
                  p.right_answer ||
                  p.definition ||
                  p.description ||
                  p.explanation ||
                  'Định nghĩa #' + (idx + 1),
                icon: FALLBACK_ICONS[idx % FALLBACK_ICONS.length],
              }));
            }
            updateStartPairsInfo();
          });
        }
        if (typeof sdkInstance.initSession === 'function') {
          sdkInstance.initSession({ gameId: 'game_card_match_vr' });
        }
      }
    } catch (err) {
      console.warn('SDK Init Notice:', err);
    }
  }

  function updateStartPairsInfo() {
    const pairs = pairsForLevel(1);
    if (startPairsCount) {
      startPairsCount.textContent = `${pairs} Cặp (${pairs * 2} Thẻ)`;
    }
  }

  // ─── Build Deck from Question Pairs ──────────────────────────────────────────
  function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function generateDeck(targetLevel) {
    const deck = [];
    const needPairs = pairsForLevel(targetLevel);
    const pool = rawQuestionPairs.length >= needPairs ? rawQuestionPairs : DEFAULT_PAIRS;
    const source = shuffleArray(pool).slice(0, needPairs);

    source.forEach((item, idx) => {
      // Card A: Term / Concept
      deck.push({
        uid: 'card_' + idx + '_a',
        pairId: item.id,
        type: 'term',
        text: item.term,
        icon: item.icon || FALLBACK_ICONS[idx % FALLBACK_ICONS.length],
        matched: false,
        flipped: false,
      });

      // Card B: Definition
      deck.push({
        uid: 'card_' + idx + '_b',
        pairId: item.id,
        type: 'definition',
        text: item.definition,
        icon: '📖',
        matched: false,
        flipped: false,
      });
    });

    return shuffleArray(deck);
  }

  // ─── Render Card Grid (reference: CardGame.tsx) ─────────────────────────────
  function getGridClass(count) {
    if (count <= 8) return 'grid-cols-4';
    if (count <= 12) return 'grid-cols-4 sm:grid-cols-6';
    return 'grid-cols-4 sm:grid-cols-8';
  }

  function renderBoard() {
    cardsGrid.innerHTML = '';
    cardsGrid.className = 'mx-auto grid w-full max-w-4xl gap-4 ' + getGridClass(cards.length);

    // Cỡ chữ thích ứng theo số thẻ trên bàn để chữ luôn hiển thị đầy đủ
    const isLarge = cards.length > 12; // 16 thẻ
    const isMedium = cards.length > 8; // 12 thẻ
    const emojiSize = isLarge ? 'text-xl' : isMedium ? 'text-2xl' : 'text-5xl';
    const textSize = isLarge ? 'text-[8px]' : isMedium ? 'text-[10px]' : 'text-xs';
    const facePad = isLarge ? '!p-1' : isMedium ? '!p-1.5' : 'p-3';
    const textGap = isLarge ? 'mt-0.5' : 'mt-1';

    cards.forEach((card, index) => {
      const cardEl = document.createElement('button');
      cardEl.type = 'button';
      cardEl.className = 'card-item aspect-square w-full cursor-pointer focus:outline-none select-none transition-transform active:scale-95';
      cardEl.dataset.index = index;

      const shownClass = card.flipped || card.matched ? ' card-show-front' : '';
      const matchedClass = card.matched ? ' card-matched' : '';

      cardEl.className += shownClass + matchedClass;

      cardEl.innerHTML = `
        <div class="relative h-full w-full">
          <!-- CARD BACK -->
          <div class="card-face card-back bg-indigo-600 shadow-lg">
            <span class="text-5xl font-black text-white">?</span>
          </div>

          <!-- CARD FRONT -->
          <div class="card-face card-front flex-col bg-white ${facePad}">
            <span class="${emojiSize} leading-none">${card.icon}</span>
            <span class="${textGap} text-center font-bold text-slate-500 leading-snug break-words whitespace-normal ${textSize}">${card.text}</span>
          </div>
        </div>
      `;

      cardEl.addEventListener('click', () => handleCardClick(index, cardEl));
      cardsGrid.appendChild(cardEl);
    });
  }

  // ─── Preview Phase (reference: `previewing` prop on cards) ───────────────────
  function startPreviewPhase(callback) {
    isPreviewing = true;
    isLocked = true;
    previewBanner.classList.remove('hidden');

    document.querySelectorAll('.card-item').forEach((el) => {
      el.classList.add('card-show-front');
    });

    let previewSeconds = PREVIEW_SECONDS;
    previewCountdownEl.textContent = `${previewSeconds}s`;

    previewInterval = setInterval(() => {
      previewSeconds--;
      previewCountdownEl.textContent = `${previewSeconds}s`;

      if (previewSeconds <= 0) {
        clearInterval(previewInterval);
        previewInterval = null;
        previewBanner.classList.add('hidden');

        document.querySelectorAll('.card-item').forEach((el) => {
          el.classList.remove('card-show-front');
        });

        setTimeout(() => {
          isPreviewing = false;
          isLocked = false;
          if (callback) callback();
        }, 400);
      }
    }, 1000);
  }

  // ─── Card Click Handler ──────────────────────────────────────────────────────
  function handleCardClick(index, cardEl) {
    if (!isGameActive || isLocked || isPreviewing) return;
    const card = cards[index];
    if (card.flipped || card.matched) return;

    card.flipped = true;
    cardEl.classList.add('card-show-front');
    playSound('click');
    flippedCards.push({ card, el: cardEl, index });

    if (flippedCards.length === 2) {
      checkMatch();
    }
  }

  // ─── Check Match ─────────────────────────────────────────────────────────────
  function checkMatch() {
    isLocked = true;
    const [first, second] = flippedCards;

    if (first.card.pairId === second.card.pairId && first.card.type !== second.card.type) {
      // MATCH SUCCESS!
      setTimeout(() => {
        first.card.matched = true;
        second.card.matched = true;
        first.el.classList.add('card-matched');
        second.el.classList.add('card-matched');

        playSound('correct');

        score += 100 * combo;
        combo = Math.min(combo + 1, 4);
        matchedPairsCount++;
        totalMatches++;
        movesCount++;

        updateHUD();

        if (sdkInstance && typeof sdkInstance.updateProgress === 'function') {
          sdkInstance.updateProgress({
            score: score,
            currentStreak: combo,
            progressPercent: Math.min(100, Math.round((matchedPairsCount / (cards.length / 2)) * 100)),
            currentQuestion: matchedPairsCount,
            totalQuestions: cards.length / 2,
          });
        }

        flippedCards = [];
        isLocked = false;

        const totalPairs = cards.length / 2;
        if (matchedPairsCount >= totalPairs) {
          setTimeout(() => {
            handleLevelComplete();
          }, 450);
        }
      }, 500);
    } else {
      // MATCH WRONG!
      movesCount++;
      setTimeout(() => {
        playSound('wrong');
        first.el.classList.add('card-shake');
        second.el.classList.add('card-shake');

        combo = 1;
        lives = Math.max(0, lives - 1);
        updateHUD();

        setTimeout(() => {
          first.card.flipped = false;
          second.card.flipped = false;
          first.el.classList.remove('card-show-front', 'card-shake');
          second.el.classList.remove('card-show-front', 'card-shake');

          flippedCards = [];
          isLocked = false;

          if (lives <= 0) {
            handleGameOver();
          }
        }, 600);
      }, 600);
    }
  }

  // ─── Update HUD (reference: GameHeader + GameStatus) ─────────────────────────
  function updateHUD() {
    if (scoreDisplay) scoreDisplay.textContent = score.toString();

    // Hearts
    let heartsHtml = '';
    for (let i = 0; i < MAX_LIVES; i++) {
      const alive = i < lives;
      heartsHtml += `<span class="text-[17px] leading-none transition-all duration-200 ${
        alive
          ? 'text-red-400 drop-shadow-[0_1px_2px_rgba(248,113,113,0.25)]'
          : 'text-slate-200'
      }">♥</span>`;
    }
    livesDisplay.innerHTML = heartsHtml;
    livesCount.textContent = `${lives}/${MAX_LIVES}`;

    // Level
    const levelText = String(level).padStart(2, '0');
    levelDisplay.textContent = levelText;
    startLevelBadge.textContent = levelText;

    // Progress
    const totalPairs = cards.length / 2;
    matchedDisplay.textContent = matchedPairsCount.toString();
    totalDisplay.textContent = totalPairs.toString();
    const progress = totalPairs > 0 ? (matchedPairsCount / totalPairs) * 100 : 0;
    progressFill.style.width = `${progress}%`;
  }

  // ─── Level Complete (reference: LevelCompleted.tsx) ──────────────────────────
  function handleLevelComplete() {
    isLocked = true;
    highestLevelReached = Math.max(highestLevelReached, level);

    completePairs.textContent = matchedPairsCount.toString();
    completeHearts.textContent = '❤️'.repeat(lives);

    playSound('correct');

    modalLevelComplete.classList.remove('hidden');
  }

  function handleContinue() {
    modalLevelComplete.classList.add('hidden');
    level += 1;
    startLevel(level);
  }

  // ─── Game Over (reference: GameOver.tsx) ─────────────────────────────────────
  function handleGameOver() {
    isLocked = true;
    isGameActive = false;

    if (previewInterval) {
      clearInterval(previewInterval);
      previewInterval = null;
    }
    previewBanner.classList.add('hidden');

    const reachedLevel = highestLevelReached;
    const reward = reachedLevel * 100;

    gameoverLevel.textContent = reachedLevel.toString();
    gameoverLevelStat.textContent = reachedLevel.toString();
    gameoverScore.textContent = score.toString();
    gameoverMatches.textContent = totalMatches.toString();
    gameoverReward.textContent = reward.toString();
    claimAmount.textContent = reward.toString();

    rewardClaimSection.classList.remove('hidden');
    rewardClaimedSection.classList.add('hidden');

    playSound('gameover');

    modalGameOver.classList.remove('hidden');
  }

  function claimReward() {
    if (rewardClaimed) return;
    rewardClaimed = true;

    const reward = highestLevelReached * 100;
    rewardClaimedAmount.textContent = reward.toString();

    rewardClaimSection.classList.add('hidden');
    rewardClaimedSection.classList.remove('hidden');

    playSound('coin');

    const totalPairs = Math.max(1, cards.length / 2);
    const accuracyPercent = movesCount > 0 ? Math.min(100, Math.max(15, Math.round((totalPairs / movesCount) * 100))) : 100;

    // Kết quả đủ đạt (qua chặng) theo luật: đạt tối thiểu Level theo passRule
    const passed = evaluatePassRule(PASS_RULE, highestLevelReached);

    if (sdkInstance && typeof sdkInstance.finishGame === 'function') {
      sdkInstance.finishGame({
        score: score,
        isWin: passed,
        accuracyPercent: accuracyPercent,
        playTimeSeconds: sdkInstance.getElapsedTime ? sdkInstance.getElapsedTime() : 1,
        highestLevelReached: highestLevelReached,
        totalMatches: totalMatches,
      });
    }
  }

  // ─── Start a new Level ───────────────────────────────────────────────────────
  function startLevel(targetLevel) {
    level = targetLevel;
    highestLevelReached = Math.max(highestLevelReached, targetLevel);
    cards = [];
    flippedCards = [];
    matchedPairsCount = 0;
    movesCount = 0;
    combo = 1;
    isLocked = true;
    isGameActive = true;

    modalLevelComplete.classList.add('hidden');
    modalGameOver.classList.add('hidden');
    screenStart.classList.add('hidden');
    screenGameplay.classList.remove('hidden');

    cards = generateDeck(targetLevel);
    renderBoard();
    updateHUD();

    startPreviewPhase();
  }

  // ─── Start New Game Session (fresh run) ──────────────────────────────────────
  function startNewGame() {
    score = 0;
    combo = 1;
    lives = MAX_LIVES;
    level = 1;
    highestLevelReached = 1;
    totalMatches = 0;
    rewardClaimed = false;
    movesCount = 0;
    matchedPairsCount = 0;
    flippedCards = [];
    isLocked = true;

    if (sdkInstance && typeof sdkInstance.startTimer === 'function') {
      sdkInstance.startTimer();
    }

    if (soundEnabled && bgmAudio) {
      bgmAudio.volume = 0.25;
      bgmAudio.play().catch(() => {});
    }

    startLevel(1);
  }

  // ─── Event Listeners ─────────────────────────────────────────────────────────
  btnStart.addEventListener('click', startNewGame);
  btnContinue.addEventListener('click', handleContinue);
  btnPlayAgain.addEventListener('click', startNewGame);
  btnClaimReward.addEventListener('click', claimReward);

  btnSoundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    btnSoundToggle.textContent = soundEnabled ? '🔊' : '🔇';
    if (bgmAudio) {
      if (soundEnabled) bgmAudio.play().catch(() => {});
      else bgmAudio.pause();
    }
  });

  // ─── Initialize ──────────────────────────────────────────────────────────────
  updateStartPairsInfo();
  initSDKConnection();
})();