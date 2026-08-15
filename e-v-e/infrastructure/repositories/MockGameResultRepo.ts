import { GameResult, StudentLeaderboardItem } from "@/core/entities/GameResult";
import {
  GameResultPort,
  SubmitGameResultInput,
} from "@/core/ports/GameResultPort";

export class MockGameResultRepo implements GameResultPort {
  private mockResults: GameResult[] = [
    {
      id: "res_001",
      uid: "usr_student_001",
      cid: "crs_coding_basics",
      gid: "game_card_match_vr",
      result: 95,
      reward: 50,
      playedAt: new Date("2026-08-10"),
    },
    {
      id: "res_002",
      uid: "usr_student_001",
      cid: "crs_python_foundation",
      gid: "game_card_match_vr",
      result: 88,
      reward: 40,
      playedAt: new Date("2026-08-12"),
    },
  ];

  async submitGameResult(input: SubmitGameResultInput): Promise<GameResult> {
    const newResult: GameResult = {
      id: `res_${Date.now()}`,
      uid: input.uid,
      cid: input.cid,
      gid: input.gid,
      result: input.result,
      reward: input.reward,
      playedAt: new Date(),
    };
    this.mockResults.push(newResult);
    return { ...newResult };
  }

  async getResultsByUser(uid: string): Promise<GameResult[]> {
    return this.mockResults.filter((r) => r.uid === uid);
  }

  async getResultsByCourse(cid: string): Promise<GameResult[]> {
    return this.mockResults.filter((r) => r.cid === cid);
  }

  async getResultsByGame(gid: string): Promise<GameResult[]> {
    return this.mockResults.filter((r) => r.gid === gid);
  }

  async getTopMonthlyStudents(limitCount = 10): Promise<StudentLeaderboardItem[]> {
    return [
      {
        uid: "usr_student_001",
        name: "Học Sinh Explorer",
        email: "student@eve.edu.vn",
        totalScore: 183,
        totalCoins: 90,
        gamesPlayed: 2,
        rank: 1,
      },
      {
        uid: "usr_student_002",
        name: "Trần Minh Khoa",
        email: "khoa@eve.edu.vn",
        totalScore: 140,
        totalCoins: 60,
        gamesPlayed: 2,
        rank: 2,
      },
    ].slice(0, limitCount);
  }
}
