import { useMemo, useState, useEffect } from "react";
import { FirestoreGameRepo } from "@/infrastructure/repositories/FirestoreGameRepo";
import {
  GetGameDetailsUseCase,
  GetAcceptedGamesUseCase,
  GetGamesByUploaderUseCase,
  CreateGameUseCase,
  ApproveGameUseCase,
  DeleteGameUseCase,
} from "@/core/use-cases/GameUseCases";
import { Game } from "@/core/entities/Game";
import { CreateGameInput } from "@/core/ports/GamePort";

export function useGameAdapter(uploaderId?: string) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  const gameRepo = useMemo(() => new FirestoreGameRepo(), []);

  const getDetailsUseCase = useMemo(() => new GetGameDetailsUseCase(gameRepo), [gameRepo]);
  const getAcceptedUseCase = useMemo(() => new GetAcceptedGamesUseCase(gameRepo), [gameRepo]);
  const getByUploaderUseCase = useMemo(() => new GetGamesByUploaderUseCase(gameRepo), [gameRepo]);
  const createUseCase = useMemo(() => new CreateGameUseCase(gameRepo), [gameRepo]);
  const approveUseCase = useMemo(() => new ApproveGameUseCase(gameRepo), [gameRepo]);
  const deleteUseCase = useMemo(() => new DeleteGameUseCase(gameRepo), [gameRepo]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (uploaderId) {
        const data = await getByUploaderUseCase.execute(uploaderId);
        setGames(data);
      } else {
        const data = await getAcceptedUseCase.execute();
        setGames(data);
      }
    } catch (err) {
      console.error("Error loading games:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [uploaderId]);

  return {
    games,
    loading,
    getGameById: (id: string) => getDetailsUseCase.execute(id),
    getAllGames: () => gameRepo.getAllGames(),
    createGame: (input: CreateGameInput) => createUseCase.execute(input),
    updateGame: (id: string, data: Partial<Game>) => gameRepo.updateGame(id, data),
    approveGame: (id: string) => approveUseCase.execute(id),
    deleteGame: (id: string) => deleteUseCase.execute(id),
    reload: loadData,
  };
}
