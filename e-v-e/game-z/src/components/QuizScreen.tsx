'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { CATEGORIES } from '../data/quizData';
import { GameMode, LifelinesState, Question, Stage, UserAnswerRecord } from '../types/quiz';
import { soundManager } from '../utils/soundManager';

interface QuizScreenProps {
  mode: GameMode;
  stage?: Stage;
  questions: Question[];
  onFinishGame: (records: UserAnswerRecord[], totalScore: number, maxStreak: number) => void;
  onQuit: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  mode,
  stage,
  questions,
  onFinishGame,
  onQuit
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [answerRecords, setAnswerRecords] = useState<UserAnswerRecord[]>([]);

  // Time & Lifeline States
  const timeLimit = stage ? stage.timeLimitSeconds : mode === 'timeAttack' ? 60 : 25;
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isFrozen, setIsFrozen] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);

  const [lifelines, setLifelines] = useState<LifelinesState>({
    fiftyFifty: 1,
    addTime: 1,
    freezeTime: 1,
    hint: 2
  });

  const currentQ = questions[currentIndex];
  const category = CATEGORIES.find((c) => c.id === currentQ.categoryId) || CATEGORIES[0];
  const questionStartTimeRef = useRef<number>(Date.now());

  // Multiplier calculation based on streak
  const getMultiplier = (currentStreak: number) => {
    if (currentStreak >= 5) return 3.0;
    if (currentStreak >= 3) return 2.0;
    if (currentStreak >= 2) return 1.5;
    return 1.0;
  };

  const handleNextQuestion = useCallback(
    (records: UserAnswerRecord[], currentScore: number, currentMaxStreak: number) => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
        setIsAnswered(false);
        setDisabledOptions([]);
        setShowHint(false);
        setIsFrozen(false);

        // Reset timer for stage/adventure/custom, but keep global timer for timeAttack
        if (mode !== 'timeAttack') {
          setTimeLeft(timeLimit);
        }
        questionStartTimeRef.current = Date.now();
      } else {
        soundManager.playWin();
        onFinishGame(records, currentScore, currentMaxStreak);
      }
    },
    [currentIndex, questions.length, mode, timeLimit, onFinishGame]
  );

  const handleSelectOption = useCallback(
    (optIdx: number) => {
      if (isAnswered) return;

      setIsAnswered(true);
      setSelectedOption(optIdx);

      const timeSpent = Math.max(1, Math.round((Date.now() - questionStartTimeRef.current) / 1000));
      const isCorrect = optIdx === currentQ.correctIndex;

      let newStreak = streak;
      let newScore = score;

      if (isCorrect) {
        soundManager.playCorrect();
        newStreak += 1;
        const mult = getMultiplier(newStreak);
        const basePoints = currentQ.difficulty === 'hard' ? 150 : currentQ.difficulty === 'medium' ? 100 : 50;
        const timeBonus = Math.max(0, timeLeft * 2);
        const earned = Math.round((basePoints + timeBonus) * mult);
        newScore += earned;
      } else {
        soundManager.playWrong();
        newStreak = 0;
      }

      const newMaxStreak = Math.max(maxStreak, newStreak);
      setStreak(newStreak);
      setMaxStreak(newMaxStreak);
      setScore(newScore);

      const newRecord: UserAnswerRecord = {
        question: currentQ,
        selectedIndex: optIdx,
        isCorrect,
        timeSpentSeconds: timeSpent
      };

      const updatedRecords = [...answerRecords, newRecord];
      setAnswerRecords(updatedRecords);

      // Auto advance after 1.4 seconds feedback delay
      setTimeout(() => {
        handleNextQuestion(updatedRecords, newScore, newMaxStreak);
      }, 1400);
    },
    [isAnswered, currentQ, streak, score, maxStreak, timeLeft, answerRecords, handleNextQuestion]
  );

  const handleTimeout = useCallback(() => {
    if (isAnswered) return;

    soundManager.playWrong();
    setIsAnswered(true);
    setSelectedOption(null);
    setStreak(0);

    const timeSpent = timeLimit;
    const newRecord: UserAnswerRecord = {
      question: currentQ,
      selectedIndex: null,
      isCorrect: false,
      timeSpentSeconds: timeSpent
    };

    const updatedRecords = [...answerRecords, newRecord];
    setAnswerRecords(updatedRecords);

    setTimeout(() => {
      handleNextQuestion(updatedRecords, score, maxStreak);
    }, 1400);
  }, [isAnswered, currentQ, timeLimit, answerRecords, handleNextQuestion, score, maxStreak]);

  // Timer Tick Effect
  useEffect(() => {
    if (isAnswered || isFrozen) return;

    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 5 && prev > 1) {
          soundManager.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswered, isFrozen, handleTimeout]);

  // Lifelines Handlers
  const useFiftyFifty = () => {
    if (lifelines.fiftyFifty <= 0 || isAnswered || disabledOptions.length > 0) return;

    soundManager.playLifeline();
    const wrongIndices = currentQ.options
      .map((_, idx) => idx)
      .filter((idx) => idx !== currentQ.correctIndex);

    // Shuffle and pick 2 wrong options to disable
    const shuffled = wrongIndices.sort(() => Math.random() - 0.5);
    const toDisable = shuffled.slice(0, 2);

    setDisabledOptions(toDisable);
    setLifelines((prev) => ({ ...prev, fiftyFifty: prev.fiftyFifty - 1 }));
  };

  const useAddTime = () => {
    if (lifelines.addTime <= 0 || isAnswered) return;
    soundManager.playLifeline();
    setTimeLeft((prev) => prev + 15);
    setLifelines((prev) => ({ ...prev, addTime: prev.addTime - 1 }));
  };

  const useFreezeTime = () => {
    if (lifelines.freezeTime <= 0 || isAnswered || isFrozen) return;
    soundManager.playLifeline();
    setIsFrozen(true);
    setLifelines((prev) => ({ ...prev, freezeTime: prev.freezeTime - 1 }));
    setTimeout(() => {
      setIsFrozen(false);
    }, 10000);
  };

  const useHint = () => {
    if (lifelines.hint <= 0 || isAnswered || showHint) return;
    soundManager.playLifeline();
    setShowHint(true);
    setLifelines((prev) => ({ ...prev, hint: prev.hint - 1 }));
  };

  // Timer Progress percentage & color
  const timePercent = Math.max(0, (timeLeft / timeLimit) * 100);
  const timerColor = timeLeft <= 5 ? 'var(--accent-rose)' : timeLeft <= 10 ? 'var(--accent-amber)' : 'var(--accent-cyan)';
  const multiplier = getMultiplier(streak);

  return (
    <div className="quiz-screen animate-pop" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top HUD: Navigation, Topic Badge, Combo Multiplier, Score */}
      <div className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <button
          className="btn-secondary"
          onClick={() => {
            soundManager.playClick();
            onQuit();
          }}
          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
        >
          ❌ Thoát Game
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', background: `${category.color}25`, color: category.color, border: `1px solid ${category.color}40` }}>
            {category.icon} {category.name}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Câu {currentIndex + 1}/{questions.length}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {streak >= 2 && (
            <div className="animate-pop" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 800, color: '#fff', boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)' }}>
              🔥 {streak} STREAK ({multiplier}x)
            </div>
          )}
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {score} pts
          </div>
        </div>
      </div>

      {/* Timer Bar & Indicator */}
      <div className="glass-panel" style={{ padding: '0.75rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 700 }}>
          <span style={{ color: isFrozen ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
            {isFrozen ? '❄️ THỜI GIAN ĐANG ĐÓNG BẰNG (10s)' : '⏱️ Thời gian còn lại:'}
          </span>
          <span style={{ color: timerColor, fontSize: '1rem' }}>{timeLeft}s</span>
        </div>
        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
          <div
            style={{
              width: `${timePercent}%`,
              height: '100%',
              background: timerColor,
              transition: isFrozen ? 'none' : 'width 1s linear, background-color 0.3s ease',
              borderRadius: 'var(--radius-full)'
            }}
          />
        </div>
      </div>

      {/* Lifelines Bar */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          className="btn-secondary"
          onClick={useFiftyFifty}
          disabled={lifelines.fiftyFifty <= 0 || isAnswered || disabledOptions.length > 0}
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', opacity: lifelines.fiftyFifty > 0 ? 1 : 0.4 }}
          title="Loại bỏ 2 phương án sai"
        >
          ✂️ 50:50 ({lifelines.fiftyFifty})
        </button>

        <button
          className="btn-secondary"
          onClick={useAddTime}
          disabled={lifelines.addTime <= 0 || isAnswered}
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', opacity: lifelines.addTime > 0 ? 1 : 0.4 }}
          title="Cộng thêm 15 giây"
        >
          ⏳ +15s ({lifelines.addTime})
        </button>

        <button
          className="btn-secondary"
          onClick={useFreezeTime}
          disabled={lifelines.freezeTime <= 0 || isAnswered || isFrozen}
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', opacity: lifelines.freezeTime > 0 ? 1 : 0.4 }}
          title="Đóng băng thời gian trong 10s"
        >
          ❄️ Đóng Băng ({lifelines.freezeTime})
        </button>

        <button
          className="btn-secondary"
          onClick={useHint}
          disabled={lifelines.hint <= 0 || isAnswered || showHint}
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', opacity: lifelines.hint > 0 ? 1 : 0.4 }}
          title="Hiển thị gợi ý làm bài"
        >
          💡 Gợi Ý ({lifelines.hint})
        </button>
      </div>

      {/* Hint Modal Card (If Active) */}
      {showHint && (
        <div className="glass-panel animate-pop" style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.15)', borderColor: 'var(--accent-amber)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--accent-amber)', marginBottom: '0.25rem' }}>
            <span>💡 Gợi Ý Tri Thức:</span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.4' }}>{currentQ.hint}</p>
        </div>
      )}

      {/* Main Question Card */}
      <div
        className="glass-panel"
        style={{
          padding: '2rem',
          textAlign: 'center',
          minHeight: '130px',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          background: 'linear-gradient(145deg, rgba(22, 30, 49, 0.85), rgba(30, 41, 69, 0.95))'
        }}
      >
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, lineHeight: '1.5', color: '#fff' }}>
          {currentQ.question}
        </h2>
      </div>

      {/* Answer Options Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {currentQ.options.map((optionText, idx) => {
          const isDisabled = disabledOptions.includes(idx);
          const isSelected = selectedOption === idx;
          const isCorrect = idx === currentQ.correctIndex;

          let btnBg = 'rgba(255, 255, 255, 0.05)';
          let btnBorder = '1px solid rgba(255, 255, 255, 0.1)';
          let btnColor = 'var(--text-main)';

          if (isAnswered) {
            if (isCorrect) {
              btnBg = 'rgba(16, 185, 129, 0.25)';
              btnBorder = '2px solid var(--accent-emerald)';
              btnColor = '#fff';
            } else if (isSelected) {
              btnBg = 'rgba(244, 63, 94, 0.25)';
              btnBorder = '2px solid var(--accent-rose)';
              btnColor = '#fff';
            }
          }

          const optionLabels = ['A', 'B', 'C', 'D'];

          return (
            <button
              key={idx}
              disabled={isAnswered || isDisabled}
              onClick={() => handleSelectOption(idx)}
              className={`glass-panel ${isAnswered && isSelected && !isCorrect ? 'animate-shake' : ''}`}
              style={{
                padding: '1.2rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                textAlign: 'left',
                borderRadius: 'var(--radius-md)',
                background: btnBg,
                border: btnBorder,
                color: btnColor,
                opacity: isDisabled ? 0.25 : 1,
                cursor: isAnswered || isDisabled ? 'default' : 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!isAnswered && !isDisabled) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isAnswered && !isDisabled) {
                  e.currentTarget.style.background = btnBg;
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: 'var(--radius-sm)',
                  background: isAnswered && isCorrect ? 'var(--accent-emerald)' : 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  flexShrink: 0
                }}
              >
                {optionLabels[idx]}
              </div>
              <span style={{ fontSize: '1rem', fontWeight: 500, flexGrow: 1, lineHeight: '1.4' }}>
                {optionText}
              </span>
              {isAnswered && isCorrect && <span style={{ fontSize: '1.2rem' }}>✅</span>}
              {isAnswered && isSelected && !isCorrect && <span style={{ fontSize: '1.2rem' }}>❌</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
