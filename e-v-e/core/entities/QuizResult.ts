/**
 * ENTITY: QuizResult
 *
 * Khớp với Firestore collection "quiz_results"
 * Lưu kết quả bài kiểm tra của học viên
 */

export interface QuizResult {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string;       // quiz thuộc bài học nào
  score: number;          // điểm đạt được
  maxScore: number;       // điểm tối đa
  passed: boolean;
  submittedAt: Date;
}
