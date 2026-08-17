'use client';

import React, { useEffect } from 'react';
import { GameMode, Stage, UserAnswerRecord } from '../types/quiz';
import { triggerConfetti } from '../utils/confetti';
import { soundManager } from '../utils/soundManager';

interface ResultScreenProps {
  mode: GameMode;
  stage?: Stage;
  records: UserAnswerRecord[];
  totalScore: number;
  maxStreak: number;
  onRestart: () => void;
  onNextStage?: () => void;
  onOpenReview: () => void;
  onReturnHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  mode,
  stage,
  records,
  totalScore,
  maxStreak,
  onRestart,
  onNextStage,
  onOpenReview,
  onReturnHome
}) => {
  const correctCount = records.filter((r) => r.isCorrect).length;
  const totalCount = records.length;
  const accuracyPercent = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  // Calculate stars earned (1-3 stars)
  let starsEarned = 0;
  if (accuracyPercent >= 90) starsEarned = 3;
  else if (accuracyPercent >= 60) starsEarned = 2;
  else if (accuracyPercent >= 30) starsEarned = 1;

  useEffect(() => {
    if (starsEarned >= 2) {
      triggerConfetti();
    }
  }, [starsEarned]);

  return (
    <div className="result-screen animate-pop" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '700px', margin: '0 auto', width: '100%' }}>
      {/* Main Result Card */}
      <div
        className="glass-panel"
        style={{
          padding: '2.5rem 2rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(22, 30, 49, 0.9), rgba(30, 41, 69, 0.95))',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          boxShadow: 'var(--shadow-glow-cyan)'
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
          {starsEarned === 3 ? '🏆' : starsEarned === 2 ? '🌟' : '👍'}
        </div>

        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          {starsEarned === 3 ? 'Xuất Sắc! Hoàn Hảo!' : starsEarned >= 1 ? 'Chúc Mừng Hoàn Thành!' : 'Cố Gắng Hơn Lần Sau!'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          {stage ? stage.title : mode === 'timeAttack' ? 'Chế độ Thách thức Tốc độ' : 'Chế độ Luyện tập'}
        </p>

        {/* Star Rating Badge (If Stage Mode) */}
        {mode === 'adventure' && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', fontSize: '2.5rem', marginBottom: '1.5rem' }}>
            {[1, 2, 3].map((starNum) => (
              <span
                key={starNum}
                style={{
                  transform: starNum <= starsEarned ? 'scale(1.1)' : 'scale(0.85)',
                  opacity: starNum <= starsEarned ? 1 : 0.25,
                  transition: 'transform 0.3s ease'
                }}
              >
                ⭐
              </span>
            ))}
          </div>
        )}

        {/* Big Score Display */}
        <div
          style={{
            fontSize: '3rem',
            fontWeight: 900,
            color: 'var(--accent-cyan)',
            letterSpacing: '-0.03em',
            marginBottom: '1.5rem'
          }}
        >
          {totalScore} <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>PTS</span>
        </div>

        {/* Key Performance Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', background: 'rgba(0,0,0,0.25)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Đúng / Tổng</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
              {correctCount} / {totalCount}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Độ chính xác</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-amber)' }}>
              {accuracyPercent}%
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Combo đỉnh</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-violet)' }}>
              🔥 {maxStreak}x
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          className="btn-primary"
          onClick={() => {
            soundManager.playClick();
            onRestart();
          }}
          style={{ flex: 1, minWidth: '160px' }}
        >
          🔄 Chơi Lại Màn Này
        </button>

        {onNextStage && (
          <button
            className="btn-primary"
            onClick={() => {
              soundManager.playClick();
              onNextStage();
            }}
            style={{ flex: 1, minWidth: '160px', background: 'linear-gradient(135deg, var(--accent-emerald), #059669)', boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)' }}
          >
            ⏩ Màn Tiếp Theo ➔
          </button>
        )}

        <button
          className="btn-secondary"
          onClick={() => {
            soundManager.playClick();
            onOpenReview();
          }}
          style={{ flex: 1, minWidth: '160px' }}
        >
          📖 Xem Lời Giải
        </button>

        <button
          className="btn-secondary"
          onClick={() => {
            soundManager.playClick();
            onReturnHome();
          }}
          style={{ width: '100%' }}
        >
          🏠 Về Trang Chủ Menu
        </button>
      </div>
    </div>
  );
};
