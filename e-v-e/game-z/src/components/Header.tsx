'use client';

import React from 'react';
import { UserProgress } from '../types/quiz';
import { soundManager } from '../utils/soundManager';

interface HeaderProps {
  userProgress: UserProgress;
  isMuted: boolean;
  onToggleSound: () => void;
  onOpenAchievements: () => void;
  onReturnHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userProgress,
  isMuted,
  onToggleSound,
  onOpenAchievements,
  onReturnHome
}) => {
  return (
    <header className="game-header glass-panel">
      <div className="brand-logo" onClick={onReturnHome} style={{ cursor: 'pointer' }}>
        <div className="logo-icon">💡</div>
        <div>
          <span>QuizQuest</span>
          <span style={{ fontSize: '0.75rem', display: 'block', color: 'var(--accent-cyan)', fontWeight: 600 }}>
            Tri Thức Kỳ Du
          </span>
        </div>
      </div>

      <div className="user-stats-bar">
        <div className="stat-badge" title="Cấp độ hiện tại">
          <span className="stat-icon">🎓</span>
          <span>Lv. {userProgress.level}</span>
        </div>

        <div className="stat-badge" title="Tổng điểm kinh nghiệm (XP)">
          <span className="stat-icon">⚡</span>
          <span style={{ color: 'var(--accent-amber)' }}>{userProgress.totalXp} XP</span>
        </div>

        <button
          className="stat-badge"
          onClick={onOpenAchievements}
          style={{ cursor: 'pointer' }}
          title="Xem Huy hiệu danh dự"
        >
          <span className="stat-icon">🏆</span>
          <span>{userProgress.achievements.length}/5</span>
        </button>

        <button
          className="sound-toggle-btn"
          onClick={() => {
            soundManager.playClick();
            onToggleSound();
          }}
          title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
      </div>
    </header>
  );
};
