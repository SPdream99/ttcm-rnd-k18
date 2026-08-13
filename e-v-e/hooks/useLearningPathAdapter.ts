import { useState, useEffect, useMemo, useCallback } from "react";
import { LearningPath } from "@/core/entities/LearningPath";
import { FirestoreLearningPathRepo } from "@/infrastructure/repositories/FirestoreLearningPathRepo";
import { MockLearningPathRepo } from "@/infrastructure/repositories/MockLearningPathRepo";
import {
  GetAcceptedLearningPathsUseCase,
  GetLearningPathsByAuthorUseCase,
  CreateLearningPathUseCase,
  ApproveLearningPathUseCase,
  DeleteLearningPathUseCase,
} from "@/core/use-cases/LearningPathUseCases";
import { CreateLearningPathInput } from "@/core/ports/LearningPathPort";

export function useLearningPathAdapter(authorId?: string) {
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const repo = useMemo(() => {
    return process.env.NEXT_PUBLIC_USE_MOCK === "true"
      ? new MockLearningPathRepo()
      : new FirestoreLearningPathRepo();
  }, []);

  const getAcceptedUseCase = useMemo(() => new GetAcceptedLearningPathsUseCase(repo), [repo]);
  const getByAuthorUseCase = useMemo(() => new GetLearningPathsByAuthorUseCase(repo), [repo]);
  const createUseCase = useMemo(() => new CreateLearningPathUseCase(repo), [repo]);
  const approveUseCase = useMemo(() => new ApproveLearningPathUseCase(repo), [repo]);
  const deleteUseCase = useMemo(() => new DeleteLearningPathUseCase(repo), [repo]);

  const fetchPaths = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data: LearningPath[];
      if (authorId) {
        data = await getByAuthorUseCase.execute(authorId);
      } else {
        data = await getAcceptedUseCase.execute();
      }
      setLearningPaths(data);
    } catch (err: any) {
      setError(err.message || "Lỗi tải danh sách lộ trình học tập.");
    } finally {
      setLoading(false);
    }
  }, [authorId, getAcceptedUseCase, getByAuthorUseCase]);

  useEffect(() => {
    fetchPaths();
  }, [fetchPaths]);

  const createLearningPath = async (input: CreateLearningPathInput) => {
    setLoading(true);
    try {
      const created = await createUseCase.execute(input);
      setLearningPaths((prev) => [created, ...prev]);
      return { success: true, learningPath: created };
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const approveLearningPath = async (lpathId: string) => {
    try {
      const ok = await approveUseCase.execute(lpathId);
      if (ok) {
        setLearningPaths((prev) =>
          prev.map((p) => (p.lpathId === lpathId ? { ...p, isAccepted: true } : p))
        );
      }
      return ok;
    } catch (err) {
      return false;
    }
  };

  const deleteLearningPath = async (lpathId: string) => {
    try {
      const ok = await deleteUseCase.execute(lpathId);
      if (ok) {
        setLearningPaths((prev) => prev.filter((p) => p.lpathId !== lpathId));
      }
      return ok;
    } catch (err) {
      return false;
    }
  };

  return {
    learningPaths,
    loading,
    error,
    refresh: fetchPaths,
    createLearningPath,
    approveLearningPath,
    deleteLearningPath,
  };
}
