import { useMemo, useState, useEffect } from "react";
import { FirestoreGameResultRepo } from "@/infrastructure/repositories/FirestoreGameResultRepo";
import {
  SubmitGameResultUseCase,
  GetStudentGameResultsUseCase,
  GetTopMonthlyStudentsUseCase,
} from "@/core/use-cases/GameResultUseCases";
import { GameResult } from "@/core/entities/GameResult";
import { SubmitGameResultInput } from "@/core/ports/GameResultPort";

export function useGameResultAdapter(userId?: string) {
  const [userResults, setUserResults] = useState<GameResult[]>([]);
  const [loading, setLoading] = useState(true);

  const gameResultRepo = useMemo(() => new FirestoreGameResultRepo(), []);

  const submitResultUseCase = useMemo(
    () => new SubmitGameResultUseCase(gameResultRepo),
    [gameResultRepo]
  );
  const getResultsByUserUseCase = useMemo(
    () => new GetStudentGameResultsUseCase(gameResultRepo),
    [gameResultRepo]
  );
  const getTopMonthlyUseCase = useMemo(
    () => new GetTopMonthlyStudentsUseCase(gameResultRepo),
    [gameResultRepo]
  );

  const loadData = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getResultsByUserUseCase.execute(userId);
      setUserResults(data);
    } catch (err) {
      console.error("Error loading game results:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  const submitGameResult = async (input: SubmitGameResultInput) => {
    return submitResultUseCase.execute(input);
  };

  const getTopMonthlyStudents = async (limitCount?: number) => {
    return getTopMonthlyUseCase.execute(limitCount);
  };

  return {
    userResults,
    loading,
    submitGameResult,
    getTopMonthlyStudents,
    reload: loadData,
  };
}
