/**
 * E-V-E Game Engine SDK TypeScript Definitions (v2.1.0)
 */

export interface EVEGameCoursePair {
  id: string;
  title: string;
  description: string;
  distractions?: string[];
  explanation?: string;
  image_url?: string;
  question_image_url?: string;
  right_answer?: string;
  right_answer_image_url?: string;
  wrong_answers?: string[];
  wrong_answers_image_urls?: string[];
  distraction_image_urls?: string[];
}

export interface EVEInitGamePayload {
  success: boolean;
  gameId: string;
  courseId: string;
  courseTitle: string;
  totalPairs: number;
  pairs: EVEGameCoursePair[];
  sessionToken?: string;
  targetScore?: number;
}

export interface EVEProgressUpdate {
  score: number;
  currentStreak?: number;
  progressPercent?: number;
  currentQuestion?: number;
  totalQuestions?: number;
  playTimeSeconds?: number;
}

export interface EVEFinishGamePayload {
  score: number;
  isWin: boolean;
  accuracyPercent?: number;
  playTimeSeconds?: number;
  details?: Record<string, any>;
}

export interface EVEFinishGameResult {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    gameId: string;
    courseId: string;
    pathId?: string;
    finalScore: number;
    isWin: boolean;
    accuracyPercent?: number;
    playTimeSeconds?: number;
    earnedCoins: number;
    courseCompleted: boolean;
    unlockedNextCourse: boolean;
    timestamp: string;
  };
}

export interface EVELeaderboardRecord {
  rank: number;
  name: string;
  score: number;
  playTime: string;
  accuracy: number;
  date: string;
  userId?: string;
}

export interface EVELeaderboardResult {
  success: boolean;
  gameId: string;
  courseId: string;
  totalPlayers: number;
  rankings: EVELeaderboardRecord[];
}

export declare class EVEGameSDK {
  version: string;
  gameId: string;
  courseId: string;
  userId: string;
  pathId: string;

  constructor(config?: {
    gameId?: string;
    courseId?: string;
    userId?: string;
    pathId?: string;
    apiBase?: string;
  });

  startTimer(): EVEGameSDK;
  getElapsedTime(): number;
  pauseTimer(): number;
  resumeTimer(): EVEGameSDK;
  resetTimer(): EVEGameSDK;

  onDataReady(callback: (data: EVEInitGamePayload) => void): void;
  getCourseData(): EVEInitGamePayload | null;
  initSession(config?: Partial<{ gameId: string; courseId: string; userId: string }>): Promise<EVEInitGamePayload>;
  updateProgress(progress: EVEProgressUpdate): Promise<void>;
  finishGame(payload: EVEFinishGamePayload): Promise<EVEFinishGameResult>;
  toggleFullscreen(element?: HTMLElement | null): boolean;
  isFullscreen(): boolean;
  getLeaderboard(params?: { gameId?: string; courseId?: string }): Promise<EVELeaderboardResult>;
  playSound(type?: "correct" | "wrong" | "win" | "coin"): void;
}

declare global {
  interface Window {
    EveSDK?: EVEGameSDK;
    EVEGameSDK?: typeof EVEGameSDK;
    eveSDK?: EVEGameSDK;
    EVE_SDK?: EVEGameSDK;
  }
}
