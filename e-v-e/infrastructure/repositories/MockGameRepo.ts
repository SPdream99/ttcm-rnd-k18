import { Game } from "@/core/entities/Game";
import { GamePort, CreateGameInput } from "@/core/ports/GamePort";

export class MockGameRepo implements GamePort {
  private mockGames: Game[] = [];

  async getGameById(gameId: string): Promise<Game | null> {
    const found = this.mockGames.find((g) => g.gameId === gameId || g.id === gameId);
    return found ? { ...found } : null;
  }

  async getAllGames(): Promise<Game[]> {
    return [...this.mockGames];
  }

  async getAcceptedGames(): Promise<Game[]> {
    return this.mockGames.filter((g) => g.isAccepted);
  }

  async getGamesByUploader(uploaderId: string): Promise<Game[]> {
    return this.mockGames.filter((g) => g.uploaderId === uploaderId);
  }

  async createGame(input: CreateGameInput): Promise<Game> {
    const newGame: Game = {
      id: `game_${Date.now()}`,
      gameId: `game_${Date.now()}`,
      authors: input.authors,
      title: input.title,
      description: input.description,
      isAccepted: false,
      coursesAllowed: input.coursesAllowed,
      coursesBlocked: input.coursesBlocked || [],
      needExtraData: input.needExtraData,
      sourceUrl: input.sourceUrl,
      uploaderId: input.uploaderId,
      createdAt: new Date(),
    };
    this.mockGames.push(newGame);
    return { ...newGame };
  }

  async updateGame(gameId: string, data: Partial<Game>): Promise<Game> {
    const index = this.mockGames.findIndex((g) => g.gameId === gameId || g.id === gameId);
    if (index === -1) {
      throw new Error("Game not found");
    }
    this.mockGames[index] = {
      ...this.mockGames[index],
      ...data,
      updatedAt: new Date(),
    };
    return { ...this.mockGames[index] };
  }

  async approveGame(gameId: string): Promise<boolean> {
    const item = this.mockGames.find((g) => g.gameId === gameId || g.id === gameId);
    if (item) {
      item.isAccepted = true;
      item.updatedAt = new Date();
      return true;
    }
    return false;
  }

  async deleteGame(gameId: string): Promise<boolean> {
    const initialLen = this.mockGames.length;
    this.mockGames = this.mockGames.filter((g) => g.gameId !== gameId && g.id !== gameId);
    return this.mockGames.length < initialLen;
  }
}
