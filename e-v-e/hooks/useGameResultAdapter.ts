import { useState, useEffect, useMemo, useCallback } from "react";
import { GameResult, StudentLeaderboardItem } from "@/core/entities/GameResult";
import { FirestoreGameResultRepo } from "@/infrastructure/repositories/FirestoreGameResultRepo";
import { MockGameResultRepo } from "@/infrastructure/repositories/MockGameResultRepo";
import {
  SubmitGameResultUseCase,
  GetStudentGameResultsUseCase,
  GetTopMonthlyStudentsUseCase,
} from "@/core/use-cases/GameResultUseCases";
import { SubmitGameResultInput } from "@/core/ports/GameResultPort";

export function useGameResultAdapter(uid?: string) {
  const [results, setResults] = useState<GameResult[]>([]);
  const [topStudents, setTopStudents] = useState<StudentLeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const repo = useMemo(() => {
    return process.env.NEXT_PUBLIC_USE_MOCK === "true"
      ? new MockGameResultRepo()
      : new FirestoreGameResultRepo();
  }, []);

  const submitUseCase = useMemo(() => new SubmitGameResultUseCase(repo), [repo]);
  const getResultsUseCase = useMemo(() => new GetStudentGameResultsUseCase(repo), [repo]);
  const getTopUseCase = useMemo(() => new GetTopMonthlyStudentsUseCase(repo), [repo]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (uid) {
        const userResults = await getResultsUseCase.execute(uid);
        setResults(userResults);
      }
      const leaderboard = await getTopUseCase.execute(10);
      setTopStudents(leaderboard);
    } catch (err: any) {
      setError(err.message || "Lỗi tải kết quả chơi game.");
    } finally {
      setLoading(false);
    }
  }, [uid, getResultsUseCase, getTopUseCase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const submitResult = async (input: SubmitGameResultInput) => {
    setLoading(true);
    try {
      const res = await submitUseCase.execute(input);
      setResults((prev) => [res, ...prev]);
      // Refresh top leaderboard after submission
      const updatedTop = await getTopUseCase.execute(10);
      setTopStudents(updatedTop);
      return { success: true, result: res };
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    results,
    topStudents,
    loading,
    error,
    refresh: fetchData,
    submitResult,
  };
}
