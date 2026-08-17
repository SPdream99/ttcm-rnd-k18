'use client';

import React from 'react';
import { CATEGORIES, STAGES } from '../data/quizData';
import { Stage, UserProgress } from '../types/quiz';
import { soundManager } from '../utils/soundManager';

interface StageSelectorProps {
  userProgress: UserProgress;
  onSelectStage: (stage: Stage) => void;
  onBack: () => void;
}

export const StageSelector: React.FC<StageSelectorProps> = ({
  userProgress,
  onSelectStage,
  onBack
}) => {
  const totalStars = Object.values(userProgress.stageStars).reduce((a, b) => a + b, 0);

  const getCategoryInfo = (catId: string) => {
    return CATEGORIES.find((c) => c.id === catId) || CATEGORIES[0];
  };

  const isStageUnlocked = (stage: Stage) => {
    return (
      userProgress.unlockedStageIds.includes(stage.id) ||
      totalStars >= stage.requiredStars
    );
  };

  return (
    <div className="stage-selector animate-pop" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <button
          className="btn-secondary"
          onClick={() => {
            soundManager.playClick();
            onBack();
          }}
        >
          ⬅️ Quay Lại Menu
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Tiến trình sao:</span>
          <div className="stat-badge" style={{ background: 'rgba(245, 158, 11, 0.15)', borderColor: 'var(--accent-amber)' }}>
            <span style={{ color: 'var(--accent-amber)' }}>⭐ {totalStars} Stars</span>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', margin: '0.5rem 0 1rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>🗺️ Bản Đồ Thám Hiểm Tri Thức</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          Hoàn thành các màn chơi để thu thập sao và mở khóa vùng đất tri thức mới!
        </p>
      </div>

      {/* Stage Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        {STAGES.map((stage) => {
          const unlocked = isStageUnlocked(stage);
          const starsEarned = userProgress.stageStars[stage.id] || 0;
          const category = getCategoryInfo(stage.categoryId);

          return (
            <div
              key={stage.id}
              className="glass-panel"
              onClick={() => {
                if (unlocked) {
                  soundManager.playClick();
                  onSelectStage(stage);
                } else {
                  soundManager.playWrong();
                }
              }}
              style={{
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                opacity: unlocked ? 1 : 0.6,
                cursor: unlocked ? 'pointer' : 'not-allowed',
                position: 'relative',
                border: unlocked ? `1px solid ${category.color}55` : '1px solid rgba(255,255,255,0.05)',
                background: unlocked
                  ? `linear-gradient(145deg, rgba(22, 30, 49, 0.8), ${category.color}15)`
                  : 'rgba(15, 20, 32, 0.6)',
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={(e) => {
                if (unlocked) {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 8px 25px ${category.color}33`;
                }
              }}
              onMouseLeave={(e) => {
                if (unlocked) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                }
              }}
            >
              {/* Top Badge: Category */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-full)',
                    background: `${category.color}25`,
                    color: category.color,
                    border: `1px solid ${category.color}40`
                  }}
                >
                  {category.icon} {category.name}
                </span>

                {unlocked ? (
                  <div style={{ fontSize: '0.9rem', display: 'flex', gap: '2px' }}>
                    {[1, 2, 3].map((starNum) => (
                      <span key={starNum} style={{ opacity: starNum <= starsEarned ? 1 : 0.25 }}>
                        ⭐
                      </span>
                    ))}
                  </div>
                ) : (
                  <span style={{ fontSize: '1.1rem' }}>🔒</span>
                )}
              </div>

              {/* Title & Description */}
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem' }}>{stage.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem', minHeight: '2.5rem', lineHeight: '1.4' }}>
                {stage.description}
              </p>

              {/* Footer Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: 'var(--text-dim)' }}>⏱️ {stage.timeLimitSeconds}s / câu</span>
                {unlocked ? (
                  <span style={{ color: category.color, fontWeight: 700 }}>Vào Chơi ➔</span>
                ) : (
                  <span style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>Cần {stage.requiredStars} ⭐</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
