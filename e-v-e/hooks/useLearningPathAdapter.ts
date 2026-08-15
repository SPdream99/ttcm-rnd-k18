import { useMemo, useState, useEffect } from "react";
import { FirestoreLearningPathRepo } from "@/infrastructure/repositories/FirestoreLearningPathRepo";
import {
  GetLearningPathDetailsUseCase,
  GetAcceptedLearningPathsUseCase,
  GetLearningPathsByAuthorUseCase,
  CreateLearningPathUseCase,
  ApproveLearningPathUseCase,
  DeleteLearningPathUseCase,
} from "@/core/use-cases/LearningPathUseCases";
import { LearningPath } from "@/core/entities/LearningPath";
import { CreateLearningPathInput } from "@/core/ports/LearningPathPort";

export function useLearningPathAdapter(authorId?: string) {
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);

  const learningPathRepo = useMemo(() => new FirestoreLearningPathRepo(), []);

  const getDetailsUseCase = useMemo(() => new GetLearningPathDetailsUseCase(learningPathRepo), [learningPathRepo]);
  const getAcceptedUseCase = useMemo(() => new GetAcceptedLearningPathsUseCase(learningPathRepo), [learningPathRepo]);
  const getByAuthorUseCase = useMemo(() => new GetLearningPathsByAuthorUseCase(learningPathRepo), [learningPathRepo]);
  const createUseCase = useMemo(() => new CreateLearningPathUseCase(learningPathRepo), [learningPathRepo]);
  const approveUseCase = useMemo(() => new ApproveLearningPathUseCase(learningPathRepo), [learningPathRepo]);
  const deleteUseCase = useMemo(() => new DeleteLearningPathUseCase(learningPathRepo), [learningPathRepo]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (authorId) {
        const data = await getByAuthorUseCase.execute(authorId);
        setLearningPaths(data);
      } else {
        const data = await getAcceptedUseCase.execute();
        setLearningPaths(data);
      }
    } catch (err) {
      console.error("Error loading learning paths:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [authorId]);

  return {
    learningPaths,
    loading,
    getLearningPathById: (id: string) => getDetailsUseCase.execute(id),
    getAllLearningPaths: () => learningPathRepo.getAllLearningPaths(),
    createLearningPath: (input: CreateLearningPathInput) => createUseCase.execute(input),
    updateLearningPath: (id: string, data: Partial<LearningPath>) => learningPathRepo.updateLearningPath(id, data),
    approveLearningPath: (id: string) => approveUseCase.execute(id),
    deleteLearningPath: (id: string) => deleteUseCase.execute(id),
    reload: loadData,
  };
}
