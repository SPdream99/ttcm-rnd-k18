import { Game } from "../entities/Game";

export interface CreateGameInput {
  authors: string[];
  title: string;
  description: string;
  coursesAllowed: string[];
  coursesBlocked?: string[];
  needExtraData: boolean;
  sourceUrl: string;
  uploaderId: string;
}

export interface GamePort {
  getGameById(gameId: string): Promise<Game | null>;
  getAllGames(): Promise<Game[]>;
  getAcceptedGames(): Promise<Game[]>;
  getGamesByUploader(uploaderId: string): Promise<Game[]>;
  createGame(input: CreateGameInput): Promise<Game>;
  updateGame(gameId: string, data: Partial<Game>): Promise<Game>;
  approveGame(gameId: string): Promise<boolean>;
  deleteGame(gameId: string): Promise<boolean>;
}
