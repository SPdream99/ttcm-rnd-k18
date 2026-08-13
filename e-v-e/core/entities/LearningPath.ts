export interface LearningPath {
  id: string;
  lpathId: string;
  title: string;
  description: string;
  authorId: string;
  courses: string[]; // List of Course IDs contained in this path
  isAccepted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
