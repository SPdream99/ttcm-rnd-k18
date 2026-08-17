'use client';

import React from 'react';
import { GameMode, UserProgress } from '../types/quiz';
import { soundManager } from '../utils/soundManager';

interface MainMenuProps {
  userProgress: UserProgress;
  onSelectMode: (mode: GameMode) => void;
  onOpenAchievements: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  userProgress,
  onSelectMode,
  onOpenAchievements
}) => {
  const handleModeClick = (mode: GameMode) => {
    soundManager.playClick();
    onSelectMode(mode);
  };

  const totalStars = Object.values(userProgress.stageStars).reduce((a, b) => a + b, 0);

  return (
    <div className="main-menu animate-pop" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Hero Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '2.5rem 2rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(139, 92, 246, 0.15))',
          border: '1px solid rgba(6, 182, 212, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }} className="float-effect">
          🎮✨
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>
          Hành Trình Chinh Phục Tri Thức
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
          Trải nghiệm game trắc nghiệm tương tác với hàng trăm câu hỏi hấp dẫn, nhân điểm combo streak, mở khóa huy hiệu và khám phá tri thức mới!
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div className="stat-badge" style={{ background: 'rgba(0,0,0,0.3)', padding: '0.6rem 1.2rem' }}>
            <span>⭐ Tổng sao:</span>
            <strong style={{ color: 'var(--accent-amber)' }}>{totalStars} / 24</strong>
          </div>
          <div className="stat-badge" style={{ background: 'rgba(0,0,0,0.3)', padding: '0.6rem 1.2rem' }}>
            <span>🏆 Kỷ lục Thám hiểm:</span>
            <strong style={{ color: 'var(--accent-cyan)' }}>{userProgress.highScores.adventure} pts</strong>
          </div>
          <div className="stat-badge" style={{ background: 'rgba(0,0,0,0.3)', padding: '0.6rem 1.2rem' }}>
            <span>⚡ Kỷ lục Tốc độ:</span>
            <strong style={{ color: 'var(--accent-violet)' }}>{userProgress.highScores.timeAttack} pts</strong>
          </div>
        </div>
      </div>

      {/* Game Mode Cards Grid */}
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '0.5rem' }}>🎯 Chọn Chế Độ Chơi</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        
        {/* Adventure Mode */}
        <div
          className="glass-panel"
          onClick={() => handleModeClick('adventure')}
          style={{
            padding: '1.8rem',
            cursor: 'pointer',
            borderLeft: '4px solid var(--accent-cyan)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px)';
            e.currentTarget.style.borderColor = 'var(--accent-cyan)';
            e.currentTarget.style.boxShadow = 'var(--shadow-glow-cyan)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow-card)';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <span style={{ fontSize: '2.5rem' }}>🗺️</span>
            <span style={{ background: 'rgba(6, 182, 212, 0.2)', color: 'var(--accent-cyan)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700 }}>
              Phổ biến nhất
            </span>
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Chế Độ Thám Hiểm</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: '1.5' }}>
            Chinh phục 8 màn chơi theo lộ trình từ dễ đến khó. Tích lũy sao để mở khóa bài học tiếp theo.
          </p>
          <button className="btn-primary" style={{ width: '100%' }}>
            Vào Màn Chơi ➔
          </button>
        </div>

        {/* Time Attack Mode */}
        <div
          className="glass-panel"
          onClick={() => handleModeClick('timeAttack')}
          style={{
            padding: '1.8rem',
            cursor: 'pointer',
            borderLeft: '4px solid var(--accent-violet)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px)';
            e.currentTarget.style.borderColor = 'var(--accent-violet)';
            e.currentTarget.style.boxShadow = 'var(--shadow-glow-violet)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow-card)';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <span style={{ fontSize: '2.5rem' }}>⚡</span>
            <span style={{ background: 'rgba(139, 92, 246, 0.2)', color: 'var(--accent-violet)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700 }}>
              Thách Thức
            </span>
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Chế Độ Tốc Độ</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: '1.5' }}>
            60 giây đếm ngược nghẹt thở! Trả lời càng nhiều câu đúng càng tốt để ghi điểm kỷ lục cao nhất.
          </p>
          <button className="btn-primary" style={{ width: '100%', background: 'linear-gradient(135deg, var(--accent-violet), #6d28d9)', boxShadow: 'var(--shadow-glow-violet)' }}>
            Bắt Đầu Thử Thách ➔
          </button>
        </div>

        {/* Custom Practice Mode */}
        <div
          className="glass-panel"
          onClick={() => handleModeClick('custom')}
          style={{
            padding: '1.8rem',
            cursor: 'pointer',
            borderLeft: '4px solid var(--accent-emerald)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px)';
            e.currentTarget.style.borderColor = 'var(--accent-emerald)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <span style={{ fontSize: '2.5rem' }}>📚</span>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-emerald)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700 }}>
              Luyện Tập
            </span>
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Chế Độ Luyện Tập</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: '1.5' }}>
            Tự do ôn luyện tất cả bộ câu hỏi mà không gặp áp lực về khóa màn chơi hay giới hạn nghiêm ngặt.
          </p>
          <button className="btn-secondary" style={{ width: '100%' }}>
            Khám Phá Ngay ➔
          </button>
        </div>

      </div>

      {/* Achievements Banner Footer */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '2rem' }}>🏅</span>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Bộ Sưu Tập Huy Hiệu Danh Dự</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Đã mở khóa {userProgress.achievements.length} / 5 danh hiệu cao quý
            </p>
          </div>
        </div>

        <button className="btn-secondary" onClick={() => { soundManager.playClick(); onOpenAchievements(); }}>
          Xem Huy Hiệu
        </button>
      </div>
    </div>
  );
};
