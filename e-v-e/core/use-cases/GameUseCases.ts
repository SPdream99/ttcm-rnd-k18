import { Game } from "../entities/Game";
import { GamePort, CreateGameInput } from "../ports/GamePort";

export class GetAcceptedGamesUseCase {
  constructor(private repo: GamePort) {}

  async execute(): Promise<Game[]> {
    return this.repo.getAcceptedGames();
  }
}

export class GetGamesByUploaderUseCase {
  constructor(private repo: GamePort) {}

  async execute(uploaderId: string): Promise<Game[]> {
    return this.repo.getGamesByUploader(uploaderId);
  }
}

export class GetGameDetailsUseCase {
  constructor(private repo: GamePort) {}

  async execute(gameId: string): Promise<Game | null> {
    return this.repo.getGameById(gameId);
  }
}

export class CreateGameUseCase {
  constructor(private repo: GamePort) {}

  async execute(input: CreateGameInput): Promise<Game> {
    if (!input.title || !input.description || !input.uploaderId || !input.sourceUrl) {
      throw new Error("Thiếu thông tin bắt buộc để nộp Game mới.");
    }
    return this.repo.createGame(input);
  }
}

export class ApproveGameUseCase {
  constructor(private repo: GamePort) {}

  async execute(gameId: string): Promise<boolean> {
    return this.repo.approveGame(gameId);
  }
}

export class DeleteGameUseCase {
  constructor(private repo: GamePort) {}

  async execute(gameId: string): Promise<boolean> {
    return this.repo.deleteGame(gameId);
  }
}
