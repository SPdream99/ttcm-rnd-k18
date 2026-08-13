import { LearningPath } from "../entities/LearningPath";
import {
  LearningPathPort,
  CreateLearningPathInput,
} from "../ports/LearningPathPort";

export class GetAcceptedLearningPathsUseCase {
  constructor(private repo: LearningPathPort) {}

  async execute(): Promise<LearningPath[]> {
    return this.repo.getAcceptedLearningPaths();
  }
}

export class GetLearningPathsByAuthorUseCase {
  constructor(private repo: LearningPathPort) {}

  async execute(authorId: string): Promise<LearningPath[]> {
    return this.repo.getLearningPathsByAuthor(authorId);
  }
}

export class GetLearningPathDetailsUseCase {
  constructor(private repo: LearningPathPort) {}

  async execute(lpathId: string): Promise<LearningPath | null> {
    return this.repo.getLearningPathById(lpathId);
  }
}

export class CreateLearningPathUseCase {
  constructor(private repo: LearningPathPort) {}

  async execute(input: CreateLearningPathInput): Promise<LearningPath> {
    if (!input.title || !input.description || !input.authorId) {
      throw new Error("Thiếu thông tin bắt buộc để tạo lộ trình học tập.");
    }
    return this.repo.createLearningPath(input);
  }
}

export class ApproveLearningPathUseCase {
  constructor(private repo: LearningPathPort) {}

  async execute(lpathId: string): Promise<boolean> {
    return this.repo.approveLearningPath(lpathId);
  }
}

export class DeleteLearningPathUseCase {
  constructor(private repo: LearningPathPort) {}

  async execute(lpathId: string): Promise<boolean> {
    return this.repo.deleteLearningPath(lpathId);
  }
}
