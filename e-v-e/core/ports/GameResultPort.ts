import { GameResult, StudentLeaderboardItem } from "../entities/GameResult";

export interface SubmitGameResultInput {
  uid: string;
  cid: string;
  gid: string;
  result: number | Record<string, any>;
  reward: number;
}

export interface GameResultPort {
  submitGameResult(input: SubmitGameResultInput): Promise<GameResult>;
  getResultsByUser(uid: string): Promise<GameResult[]>;
  getResultsByCourse(cid: string): Promise<GameResult[]>;
  getResultsByGame(gid: string): Promise<GameResult[]>;
  getTopMonthlyStudents(limitCount?: number): Promise<StudentLeaderboardItem[]>;
}
