import { useState, useEffect, useMemo, useCallback } from "react";
import { Game } from "@/core/entities/Game";
import { FirestoreGameRepo } from "@/infrastructure/repositories/FirestoreGameRepo";
import { MockGameRepo } from "@/infrastructure/repositories/MockGameRepo";
import {
  GetAcceptedGamesUseCase,
  GetGamesByUploaderUseCase,
  CreateGameUseCase,
  ApproveGameUseCase,
  DeleteGameUseCase,
} from "@/core/use-cases/GameUseCases";
import { CreateGameInput } from "@/core/ports/GamePort";

export function useGameAdapter(uploaderId?: string) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const repo = useMemo(() => {
    return process.env.NEXT_PUBLIC_USE_MOCK === "true"
      ? new MockGameRepo()
      : new FirestoreGameRepo();
  }, []);

  const getAcceptedUseCase = useMemo(() => new GetAcceptedGamesUseCase(repo), [repo]);
  const getByUploaderUseCase = useMemo(() => new GetGamesByUploaderUseCase(repo), [repo]);
  const createUseCase = useMemo(() => new CreateGameUseCase(repo), [repo]);
  const approveUseCase = useMemo(() => new ApproveGameUseCase(repo), [repo]);
  const deleteUseCase = useMemo(() => new DeleteGameUseCase(repo), [repo]);

  const fetchGames = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data: Game[];
      if (uploaderId) {
        data = await getByUploaderUseCase.execute(uploaderId);
      } else {
        data = await getAcceptedUseCase.execute();
      }
      setGames(data);
    } catch (err: any) {
      setError(err.message || "Lỗi tải danh sách Game.");
    } finally {
      setLoading(false);
    }
  }, [uploaderId, getAcceptedUseCase, getByUploaderUseCase]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const createGame = async (input: CreateGameInput) => {
    setLoading(true);
    try {
      const created = await createUseCase.execute(input);
      setGames((prev) => [created, ...prev]);
      return { success: true, game: created };
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const approveGame = async (gameId: string) => {
    try {
      const ok = await approveUseCase.execute(gameId);
      if (ok) {
        setGames((prev) =>
          prev.map((g) => (g.gameId === gameId ? { ...g, isAccepted: true } : g))
        );
      }
      return ok;
    } catch (err) {
      return false;
    }
  };

  const deleteGame = async (gameId: string) => {
    try {
      const ok = await deleteUseCase.execute(gameId);
      if (ok) {
        setGames((prev) => prev.filter((g) => g.gameId !== gameId));
      }
      return ok;
    } catch (err) {
      return false;
    }
  };

  return {
    games,
    loading,
    error,
    refresh: fetchGames,
    createGame,
    approveGame,
    deleteGame,
  };
}
