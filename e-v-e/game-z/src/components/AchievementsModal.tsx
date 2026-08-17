'use client';

import React from 'react';
import { INITIAL_ACHIEVEMENTS } from '../data/quizData';
import { UserProgress } from '../types/quiz';
import { soundManager } from '../utils/soundManager';

interface AchievementsModalProps {
  userProgress: UserProgress;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ userProgress, onClose }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(5, 8, 15, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}
    >
      <div
        className="glass-panel animate-pop"
        style={{
          width: '100%',
          maxWidth: '650px',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>🏆 Bộ Sưu Tập Huy Hiệu</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Mở khóa các danh hiệu cao quý qua từng thử thách game
            </p>
          </div>
          <button
            className="btn-secondary"
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            style={{ padding: '0.4rem 0.8rem' }}
          >
            ✖️ Đóng
          </button>
        </div>

        {/* Grid of Badges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '60vh', overflowY: 'auto' }}>
          {INITIAL_ACHIEVEMENTS.map((ach) => {
            const isUnlocked = userProgress.achievements.includes(ach.id);

            return (
              <div
                key={ach.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  padding: '1.2rem',
                  borderRadius: 'var(--radius-md)',
                  background: isUnlocked
                    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.15))'
                    : 'rgba(255, 255, 255, 0.03)',
                  border: isUnlocked ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                  opacity: isUnlocked ? 1 : 0.5
                }}
              >
                <div
                  style={{
                    fontSize: '2.2rem',
                    width: '60px',
                    height: '60px',
                    borderRadius: 'var(--radius-md)',
                    background: isUnlocked ? 'rgba(139, 92, 246, 0.25)' : 'rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    filter: isUnlocked ? 'none' : 'grayscale(1)'
                  }}
                >
                  {ach.icon}
                </div>

                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{ach.title}</h4>
                    {isUnlocked ? (
                      <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                        Đã Đạt
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', background: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-muted)' }}>
                        Chưa Mở Khóa
                      </span>
                    )}
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.4' }}>
                    {ach.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
