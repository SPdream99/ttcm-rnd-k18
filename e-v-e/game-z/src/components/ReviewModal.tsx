'use client';

import React from 'react';
import { UserAnswerRecord } from '../types/quiz';
import { soundManager } from '../utils/soundManager';

interface ReviewModalProps {
  records: UserAnswerRecord[];
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ records, onClose }) => {
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
        justify: 'center',
        padding: '1.5rem'
      }}
    >
      <div
        className="glass-panel animate-pop"
        style={{
          width: '100%',
          maxWidth: '800px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>📖 Xem Lại Lời Giải & Đáp Án</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Củng cố kiến thức qua phân tích chi tiết từng câu hỏi
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

        {/* Question List Scrollable Container */}
        <div
          style={{
            padding: '1.5rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}
        >
          {records.map((rec, idx) => {
            const q = rec.question;

            return (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${rec.isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
              >
                {/* Status Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>
                    Câu {idx + 1}:
                  </span>
                  <span
                    style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: 700,
                      background: rec.isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)',
                      color: rec.isCorrect ? 'var(--accent-emerald)' : 'var(--accent-rose)'
                    }}
                  >
                    {rec.isCorrect ? '✅ Trả lời đúng' : rec.selectedIndex === null ? '⏱️ Hết giờ' : '❌ Trả lời sai'}
                  </span>
                </div>

                {/* Question Title */}
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', lineHeight: '1.4' }}>
                  {q.question}
                </h4>

                {/* Options List */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.5rem', marginTop: '0.25rem' }}>
                  {q.options.map((opt, optIdx) => {
                    const isCorrectOpt = optIdx === q.correctIndex;
                    const isUserSelected = optIdx === rec.selectedIndex;

                    let bg = 'rgba(255, 255, 255, 0.04)';
                    let border = '1px solid rgba(255, 255, 255, 0.08)';
                    let color = 'var(--text-muted)';

                    if (isCorrectOpt) {
                      bg = 'rgba(16, 185, 129, 0.2)';
                      border = '1px solid var(--accent-emerald)';
                      color = '#fff';
                    } else if (isUserSelected && !isCorrectOpt) {
                      bg = 'rgba(244, 63, 94, 0.2)';
                      border = '1px solid var(--accent-rose)';
                      color = '#fff';
                    }

                    return (
                      <div
                        key={optIdx}
                        style={{
                          padding: '0.6rem 0.8rem',
                          borderRadius: 'var(--radius-sm)',
                          background: bg,
                          border: border,
                          color: color,
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          justify: 'space-between'
                        }}
                      >
                        <span>{opt}</span>
                        {isCorrectOpt && <span>✅ (Đáp án chuẩn)</span>}
                        {isUserSelected && !isCorrectOpt && <span>❌ (Lựa chọn của bạn)</span>}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Card */}
                <div
                  style={{
                    background: 'rgba(6, 182, 212, 0.1)',
                    borderLeft: '3px solid var(--accent-cyan)',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    color: 'var(--text-main)',
                    lineHeight: '1.5',
                    marginTop: '0.25rem'
                  }}
                >
                  <strong style={{ color: 'var(--accent-cyan)', display: 'block', marginBottom: '0.2rem' }}>
                    💡 Lời giải thích học tập:
                  </strong>
                  {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
