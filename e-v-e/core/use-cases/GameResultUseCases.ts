import { GameResult, StudentLeaderboardItem } from "../entities/GameResult";
import {
  GameResultPort,
  SubmitGameResultInput,
} from "../ports/GameResultPort";

export class SubmitGameResultUseCase {
  constructor(private repo: GameResultPort) {}

  async execute(input: SubmitGameResultInput): Promise<GameResult> {
    if (!input.uid || !input.cid || !input.gid) {
      throw new Error("Thiếu thông tin nhận diện để nộp kết quả trò chơi.");
    }
    return this.repo.submitGameResult(input);
  }
}

export class GetStudentGameResultsUseCase {
  constructor(private repo: GameResultPort) {}

  async execute(uid: string): Promise<GameResult[]> {
    return this.repo.getResultsByUser(uid);
  }
}

export class GetTopMonthlyStudentsUseCase {
  constructor(private repo: GameResultPort) {}

  async execute(limitCount?: number): Promise<StudentLeaderboardItem[]> {
    return this.repo.getTopMonthlyStudents(limitCount);
  }
}
