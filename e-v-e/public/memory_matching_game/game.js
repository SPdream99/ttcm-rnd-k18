/**
 * E-V-E MEMORY MATCHING GAME ENGINE v2.0
 * Tích hợp E-V-E Game SDK v2.0, BGM Audio, Lives Counter, Preview Timer, Combo Multiplier
 */

(function () {
  'use strict';

  // ─── DOM Elements ────────────────────────────────────────────────────────────
  const screenStart = document.getElementById('screen-start');
  const screenGameplay = document.getElementById('screen-gameplay');
  const modalVictory = document.getElementById('modal-victory');
  const modalGameOver = document.getElementById('modal-gameover');
  const previewBanner = document.getElementById('preview-banner');
  const previewCountdownEl = document.getElementById('preview-countdown');

  const btnStart = document.getElementById('btn-start-game');
  const btnReplay = document.getElementById('btn-replay');
  const btnRetry = document.getElementById('btn-retry');
  const btnFinishSDK = document.getElementById('btn-finish-sdk');
  const btnSoundToggle = document.getElementById('btn-sound-toggle');
  const bgmAudio = document.getElementById('bgm-audio');

  const cardsGrid = document.getElementById('cards-grid');
  const timerDisplay = document.getElementById('timer-display');
  const scoreDisplay = document.getElementById('score-display');
  const comboDisplay = document.getElementById('combo-display');
  const livesDisplay = document.getElementById('lives-display');
  const courseTitle = document.getElementById('course-title');
  const startPairsCount = document.getElementById('start-pairs-count');

  const modalFinalTime = document.getElementById('modal-final-time');
  const modalFinalScore = document.getElementById('modal-final-score');
  const modalFinalCoins = document.getElementById('modal-final-coins');

  // ─── Game State ──────────────────────────────────────────────────────────────
  let soundEnabled = true;
  let timerInterval = null;
  let secondsElapsed = 0;
  let score = 0;
  let combo = 1;
  let lives = 5;
  const MAX_LIVES = 5;

  let cards = [];
  let flippedCards = [];
  let matchedPairsCount = 0;
  let isLocked = false;
  let isPreviewing = false;

  // ─── Sound FX Synthesizer (Web Audio API) ───────────────────────────────────
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  function playSynthSound(type) {
    if (!soundEnabled || !audioCtx) return;
    try {
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      const now = audioCtx.currentTime;

      if (type === 'flip') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'match') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(783.99, now + 0.2);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(140, now + 0.2);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'victory') {
        osc.type = 'sine';
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
          const noteOsc = audioCtx.createOscillator();
          const noteGain = audioCtx.createGain();
          noteOsc.type = 'triangle';
          noteOsc.frequency.value = freq;
          noteOsc.connect(noteGain);
          noteGain.connect(audioCtx.destination);
          noteGain.gain.setValueAtTime(0.25, now + idx * 0.12);
          noteGain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.12 + 0.3);
          noteOsc.start(now + idx * 0.12);
          noteOsc.stop(now + idx * 0.12 + 0.3);
        });
      }
    } catch (e) {
      console.warn('Synth sound warning:', e);
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
  ];

  let rawQuestionPairs = DEFAULT_PAIRS;

  // ─── Initialize E-V-E Game SDK ───────────────────────────────────────────────
  let sdkInstance = null;

  function initSDKConnection() {
    try {
      if (typeof window.EVEGameSDK === 'function') {
        sdkInstance = new window.EVEGameSDK({
          gameId: 'game_card_match_vr',
          onInit: function (sessionData) {
            console.log('🎮 SDK Initialized with session payload:', sessionData);
            if (sessionData && sessionData.courseTitle) {
              courseTitle.textContent = sessionData.courseTitle;
            }
            if (sessionData && Array.isArray(sessionData.pairs) && sessionData.pairs.length >= 2) {
              rawQuestionPairs = sessionData.pairs.map((p, idx) => ({
                id: p.id || 'pair_' + idx,
                term: p.title || p.term || 'Khái niệm #' + (idx + 1),
                definition: p.right_answer || p.definition || p.explanation || 'Định nghĩa #' + (idx + 1),
                icon: '💡',
              }));
              startPairsCount.textContent = `${rawQuestionPairs.length} Cặp (${rawQuestionPairs.length * 2} Thẻ)`;
            }
          },
        });
      }
    } catch (err) {
      console.warn('SDK Init Notice:', err);
    }
  }

  // ─── Build Deck from Question Pairs ──────────────────────────────────────────
  function generateDeck() {
    const deck = [];
    const source = rawQuestionPairs.length >= 4 ? rawQuestionPairs.slice(0, 8) : DEFAULT_PAIRS;

    source.forEach((item, idx) => {
      // Card A: Term / Concept / Emoji
      deck.push({
        uid: 'card_' + idx + '_a',
        pairId: item.id,
        type: 'term',
        text: item.term,
        icon: item.icon || '📌',
        matched: false,
        flipped: false,
      });

      // Card B: Definition / Explanation
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

    // Fisher-Yates Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
  }

  // ─── Render Card Grid ────────────────────────────────────────────────────────
  function renderBoard() {
    cardsGrid.innerHTML = '';

    cards.forEach((card, index) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'card-item cursor-pointer aspect-square perspective';
      cardEl.dataset.index = index;

      cardEl.innerHTML = `
        <div class="card-inner w-full h-full relative rounded-2xl shadow-xl transition-transform duration-500 transform-style-3d">
          <!-- FRONT FACE (HIDDEN BY DEFAULT) -->
          <div class="card-front absolute inset-0 w-full h-full rounded-2xl bg-[#151b2c] border-2 border-cyan-500/30 p-3 flex flex-col items-center justify-center text-center backface-hidden shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <span class="text-3xl mb-1">${card.icon}</span>
            <span class="text-xs font-bold text-white leading-tight line-clamp-3">${card.text}</span>
            <span class="text-[9px] mt-1.5 px-2 py-0.5 rounded-full font-mono font-bold ${
              card.type === 'term' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-emerald-500/20 text-emerald-300'
            }">${card.type === 'term' ? 'KHÁI NIỆM' : 'ĐỊNH NGHĨA'}</span>
          </div>

          <!-- BACK FACE (SHOWN BY DEFAULT) -->
          <div class="card-back absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-indigo-700 via-blue-800 to-cyan-900 border-2 border-cyan-400/40 flex items-center justify-center text-center backface-hidden shadow-lg hover:border-cyan-300 transition-all">
            <span class="text-3xl font-black text-white/90 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">?</span>
          </div>
        </div>
      `;

      cardEl.addEventListener('click', () => handleCardClick(index, cardEl));
      cardsGrid.appendChild(cardEl);
    });
  }

  // ─── Preview Phase (5 seconds preview like Đạt's game) ────────────────────────
  function startPreviewPhase(callback) {
    isPreviewing = true;
    isLocked = true;
    previewBanner.classList.remove('hidden');

    // Flip all cards face up
    document.querySelectorAll('.card-item').forEach((el) => {
      el.classList.add('flipped');
    });

    let previewSeconds = 5;
    previewCountdownEl.textContent = `${previewSeconds}s`;

    const previewTimer = setInterval(() => {
      previewSeconds--;
      previewCountdownEl.textContent = `${previewSeconds}s`;

      if (previewSeconds <= 0) {
        clearInterval(previewTimer);
        previewBanner.classList.add('hidden');

        // Flip all cards back down
        document.querySelectorAll('.card-item').forEach((el) => {
          el.classList.remove('flipped');
        });

        setTimeout(() => {
          isPreviewing = false;
          isLocked = false;
          if (callback) callback();
        }, 500);
      }
    }, 1000);
  }

  // ─── Card Click Handler ──────────────────────────────────────────────────────
  function handleCardClick(index, cardEl) {
    if (isLocked || isPreviewing) return;
    const card = cards[index];
    if (card.flipped || card.matched) return;

    // Flip card
    card.flipped = true;
    cardEl.classList.add('flipped');
    playSynthSound('flip');
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
        first.el.classList.add('matched');
        second.el.classList.add('matched');

        playSynthSound('match');

        score += 100 * combo;
        combo = Math.min(combo + 1, 4);
        matchedPairsCount++;

        updateHUD();

        // Submit answer to SDK
        if (sdkInstance && typeof sdkInstance.submitAnswer === 'function') {
          sdkInstance.submitAnswer({
            pairId: first.card.pairId,
            isCorrect: true,
            scoreDelta: 100 * combo,
          });
        }

        flippedCards = [];
        isLocked = false;

        // Check Victory
        const totalPairs = cards.length / 2;
        if (matchedPairsCount >= totalPairs) {
          handleVictory();
        }
      }, 500);
    } else {
      // MATCH WRONG!
      setTimeout(() => {
        playSynthSound('wrong');
        first.el.classList.add('shake');
        second.el.classList.add('shake');

        combo = 1;
        lives = Math.max(0, lives - 1);
        updateHUD();

        setTimeout(() => {
          first.card.flipped = false;
          second.card.flipped = false;
          first.el.classList.remove('flipped', 'shake');
          second.el.classList.remove('flipped', 'shake');

          flippedCards = [];
          isLocked = false;

          // Check Game Over
          if (lives <= 0) {
            handleGameOver();
          }
        }, 600);
      }, 600);
    }
  }

  // ─── Update HUD ──────────────────────────────────────────────────────────────
  function updateHUD() {
    scoreDisplay.textContent = score.toString();
    comboDisplay.textContent = `x${combo}`;
    livesDisplay.textContent = '❤️'.repeat(lives) + '🖤'.repeat(MAX_LIVES - lives);
  }

  // ─── Timer Functions ─────────────────────────────────────────────────────────
  function startTimer() {
    stopTimer();
    secondsElapsed = 0;
    timerInterval = setInterval(() => {
      secondsElapsed++;
      const m = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
      const s = (secondsElapsed % 60).toString().padStart(2, '0');
      timerDisplay.textContent = `${m}:${s}`;
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  // ─── Victory & Finish ────────────────────────────────────────────────────────
  function handleVictory() {
    stopTimer();
    playSynthSound('victory');

    const m = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
    const s = (secondsElapsed % 60).toString().padStart(2, '0');
    modalFinalTime.textContent = `${m}:${s}`;
    modalFinalScore.textContent = score.toString();
    modalFinalCoins.textContent = `+${Math.max(50, Math.floor(score / 10))}`;

    modalVictory.classList.remove('hidden');

    if (sdkInstance && typeof sdkInstance.finishSession === 'function') {
      sdkInstance.finishSession({
        score: score,
        timeSpent: secondsElapsed,
        stars: combo >= 3 ? 3 : 2,
        passed: true,
      });
    }
  }

  // ─── Game Over ───────────────────────────────────────────────────────────────
  function handleGameOver() {
    stopTimer();
    modalGameOver.classList.remove('hidden');
  }

  // ─── Start New Game Session ──────────────────────────────────────────────────
  function startNewGame() {
    score = 0;
    combo = 1;
    lives = 5;
    matchedPairsCount = 0;
    flippedCards = [];
    isLocked = true;

    modalVictory.classList.add('hidden');
    modalGameOver.classList.add('hidden');
    screenStart.classList.add('hidden');
    screenGameplay.classList.remove('hidden');

    cards = generateDeck();
    renderBoard();
    updateHUD();

    // Start background music
    if (soundEnabled && bgmAudio) {
      bgmAudio.volume = 0.25;
      bgmAudio.play().catch(() => {});
    }

    startPreviewPhase(() => {
      startTimer();
    });
  }

  // ─── Event Listeners ─────────────────────────────────────────────────────────
  btnStart.addEventListener('click', startNewGame);
  btnReplay.addEventListener('click', startNewGame);
  btnRetry.addEventListener('click', startNewGame);

  btnFinishSDK.addEventListener('click', () => {
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'EVE_GAME_CLOSE' }, '*');
    } else {
      location.reload();
    }
  });

  btnSoundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    btnSoundToggle.textContent = soundEnabled ? '🔊' : '🔇';
    if (bgmAudio) {
      if (soundEnabled) bgmAudio.play().catch(() => {});
      else bgmAudio.pause();
    }
  });

  // ─── Initialize ──────────────────────────────────────────────────────────────
  initSDKConnection();
})();
