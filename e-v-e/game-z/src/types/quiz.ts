export type GameMode = 'adventure' | 'timeAttack' | 'custom';

export type CategoryId = 'science' | 'tech' | 'history' | 'geography';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface Question {
  id: string;
  categoryId: CategoryId;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Stage {
  id: number;
  categoryId: CategoryId;
  title: string;
  description: string;
  requiredStars: number;
  questionIds: string[];
  timeLimitSeconds: number;
}

export interface LifelinesState {
  fiftyFifty: number; // remaining count
  addTime: number;
  freezeTime: number;
  hint: number;
}

export interface UserAnswerRecord {
  question: Question;
  selectedIndex: number | null; // null if timed out
  isCorrect: boolean;
  timeSpentSeconds: number;
}

export interface GameStats {
  score: number;
  streak: number;
  maxStreak: number;
  correctAnswers: number;
  totalQuestions: number;
  starsEarned: number;
  timeSpentSeconds: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserProgress {
  totalXp: number;
  level: number;
  unlockedStageIds: number[];
  stageStars: Record<number, number>; // stageId -> stars (1-3)
  highScores: Record<GameMode, number>;
  achievements: string[]; // achievement IDs
}
