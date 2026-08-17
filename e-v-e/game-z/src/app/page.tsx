'use client';

import React, { useEffect, useState } from 'react';
import { QUESTIONS, STAGES } from '../data/quizData';
import { GameMode, Question, Stage, UserAnswerRecord, UserProgress } from '../types/quiz';
import { soundManager } from '../utils/soundManager';

import { AchievementsModal } from '../components/AchievementsModal';
import { Header } from '../components/Header';
import { MainMenu } from '../components/MainMenu';
import { QuizScreen } from '../components/QuizScreen';
import { ResultScreen } from '../components/ResultScreen';
import { ReviewModal } from '../components/ReviewModal';
import { StageSelector } from '../components/StageSelector';

type GameState = 'menu' | 'stageSelect' | 'quiz' | 'result';

const INITIAL_PROGRESS: UserProgress = {
  totalXp: 0,
  level: 1,
  unlockedStageIds: [1],
  stageStars: {},
  highScores: { adventure: 0, timeAttack: 0, custom: 0 },
  achievements: []
};

export default function Home() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [selectedMode, setSelectedMode] = useState<GameMode>('adventure');
  const [activeStage, setActiveStage] = useState<Stage | undefined>(undefined);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  
  // Game session outcome records
  const [lastRecords, setLastRecords] = useState<UserAnswerRecord[]>([]);
  const [lastScore, setLastScore] = useState(0);
  const [lastMaxStreak, setLastMaxStreak] = useState(0);

  // Modals
  const [showAchievements, setShowAchievements] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Persistent Progress State
  const [userProgress, setUserProgress] = useState<UserProgress>(INITIAL_PROGRESS);

  // Load saved progress from LocalStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quiz_user_progress');
      if (saved) {
        try {
          setUserProgress(JSON.parse(saved));
        } catch {
          // Ignore json parse error fallback
        }
      }
      setIsMuted(soundManager.getMuted());
    }
  }, []);

  // Save progress helper
  const saveProgress = (newProgress: UserProgress) => {
    setUserProgress(newProgress);
    if (typeof window !== 'undefined') {
      localStorage.setItem('quiz_user_progress', JSON.stringify(newProgress));
    }
  };

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const handleSelectMode = (mode: GameMode) => {
    setSelectedMode(mode);
    if (mode === 'adventure') {
      setGameState('stageSelect');
    } else if (mode === 'timeAttack') {
      setActiveStage(undefined);
      // Pick 10 random questions for time attack
      const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10);
      setActiveQuestions(shuffled);
      setGameState('quiz');
    } else {
      // Custom practice mode: all questions
      setActiveStage(undefined);
      setActiveQuestions(QUESTIONS);
      setGameState('quiz');
    }
  };

  const handleSelectStage = (stage: Stage) => {
    setActiveStage(stage);
    const stageQs = QUESTIONS.filter((q) => stage.questionIds.includes(q.id));
    setActiveQuestions(stageQs.length > 0 ? stageQs : QUESTIONS.slice(0, 4));
    setGameState('quiz');
  };

  const handleFinishGame = (records: UserAnswerRecord[], score: number, maxStreak: number) => {
    setLastRecords(records);
    setLastScore(score);
    setLastMaxStreak(maxStreak);

    // Calculate achievement unlocks & XP updates
    const correctCount = records.filter((r) => r.isCorrect).length;
    const accuracy = records.length > 0 ? (correctCount / records.length) * 100 : 0;
    
    let starsEarned = 0;
    if (accuracy >= 90) starsEarned = 3;
    else if (accuracy >= 60) starsEarned = 2;
    else if (accuracy >= 30) starsEarned = 1;

    const newXp = userProgress.totalXp + score;
    const newLevel = Math.floor(newXp / 500) + 1;
    const newAchievements = [...userProgress.achievements];

    if (!newAchievements.includes('first_win')) newAchievements.push('first_win');
    if (maxStreak >= 5 && !newAchievements.includes('combo_master')) newAchievements.push('combo_master');
    if (starsEarned === 3 && !newAchievements.includes('perfect_stage')) newAchievements.push('perfect_stage');
    
    // Speed demon check
    const hasFastAnswer = records.some((r) => r.isCorrect && r.timeSpentSeconds <= 3);
    if (hasFastAnswer && !newAchievements.includes('speed_demon')) newAchievements.push('speed_demon');

    // Stage unlocks for Adventure mode
    const updatedStageStars = { ...userProgress.stageStars };
    const unlockedStages = [...userProgress.unlockedStageIds];

    if (selectedMode === 'adventure' && activeStage) {
      const prevStars = updatedStageStars[activeStage.id] || 0;
      if (starsEarned > prevStars) {
        updatedStageStars[activeStage.id] = starsEarned;
      }

      // Unlock next stage if passed with >= 1 star
      if (starsEarned >= 1) {
        const nextStageId = activeStage.id + 1;
        if (nextStageId <= STAGES.length && !unlockedStages.includes(nextStageId)) {
          unlockedStages.push(nextStageId);
        }
      }
    }

    if (unlockedStages.length >= 8 && !newAchievements.includes('all_stages')) {
      newAchievements.push('all_stages');
    }

    // High scores update
    const currentHighScore = userProgress.highScores[selectedMode] || 0;
    const updatedHighScores = {
      ...userProgress.highScores,
      [selectedMode]: Math.max(currentHighScore, score)
    };

    saveProgress({
      totalXp: newXp,
      level: newLevel,
      unlockedStageIds: unlockedStages,
      stageStars: updatedStageStars,
      highScores: updatedHighScores,
      achievements: newAchievements
    });

    setGameState('result');
  };

  const handleNextStage = () => {
    if (!activeStage) return;
    const nextStage = STAGES.find((s) => s.id === activeStage.id + 1);
    if (nextStage) {
      handleSelectStage(nextStage);
    } else {
      setGameState('stageSelect');
    }
  };

  return (
    <div className="app-container">
      {/* Persistent App Header */}
      <Header
        userProgress={userProgress}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        onOpenAchievements={() => setShowAchievements(true)}
        onReturnHome={() => {
          soundManager.playClick();
          setGameState('menu');
        }}
      />

      {/* Main Content Router based on gameState */}
      <main style={{ flexGrow: 1, paddingBottom: '2rem' }}>
        {gameState === 'menu' && (
          <MainMenu
            userProgress={userProgress}
            onSelectMode={handleSelectMode}
            onOpenAchievements={() => setShowAchievements(true)}
          />
        )}

        {gameState === 'stageSelect' && (
          <StageSelector
            userProgress={userProgress}
            onSelectStage={handleSelectStage}
            onBack={() => setGameState('menu')}
          />
        )}

        {gameState === 'quiz' && (
          <QuizScreen
            mode={selectedMode}
            stage={activeStage}
            questions={activeQuestions}
            onFinishGame={handleFinishGame}
            onQuit={() => setGameState(selectedMode === 'adventure' ? 'stageSelect' : 'menu')}
          />
        )}

        {gameState === 'result' && (
          <ResultScreen
            mode={selectedMode}
            stage={activeStage}
            records={lastRecords}
            totalScore={lastScore}
            maxStreak={lastMaxStreak}
            onRestart={() => setGameState('quiz')}
            onNextStage={
              selectedMode === 'adventure' && activeStage && activeStage.id < STAGES.length
                ? handleNextStage
                : undefined
            }
            onOpenReview={() => setShowReview(true)}
            onReturnHome={() => setGameState('menu')}
          />
        )}
      </main>

      {/* Modals */}
      {showAchievements && (
        <AchievementsModal
          userProgress={userProgress}
          onClose={() => setShowAchievements(false)}
        />
      )}

      {showReview && (
        <ReviewModal
          records={lastRecords}
          onClose={() => setShowReview(false)}
        />
      )}
    </div>
  );
}
