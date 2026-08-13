import { LearningPath } from "../entities/LearningPath";

export interface CreateLearningPathInput {
  title: string;
  description: string;
  authorId: string;
  courses: string[];
}

export interface LearningPathPort {
  getLearningPathById(lpathId: string): Promise<LearningPath | null>;
  getAllLearningPaths(): Promise<LearningPath[]>;
  getAcceptedLearningPaths(): Promise<LearningPath[]>;
  getLearningPathsByAuthor(authorId: string): Promise<LearningPath[]>;
  createLearningPath(input: CreateLearningPathInput): Promise<LearningPath>;
  updateLearningPath(lpathId: string, data: Partial<LearningPath>): Promise<LearningPath>;
  approveLearningPath(lpathId: string): Promise<boolean>;
  deleteLearningPath(lpathId: string): Promise<boolean>;
}
