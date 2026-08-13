import { LearningPath } from "@/core/entities/LearningPath";
import {
  LearningPathPort,
  CreateLearningPathInput,
} from "@/core/ports/LearningPathPort";

export class MockLearningPathRepo implements LearningPathPort {
  private mockPaths: LearningPath[] = [
    {
      id: "lpath_quantum_physics",
      lpathId: "lpath_quantum_physics",
      title: "Lộ Trình Nhập Môn Vật Lý Lượng Tử Base",
      description: "Hành trình từ Cơ học cổ điển đến các khái niệm Vướng víu Lượng tử và Máy tính Lượng tử.",
      authorId: "usr_teacher_1",
      courses: ["crs_quantum_101", "crs_schrodinger_eq", "crs_quantum_logic"],
      isAccepted: true,
      createdAt: new Date("2026-01-10"),
    },
    {
      id: "lpath_cosmic_space",
      lpathId: "lpath_cosmic_space",
      title: "Lộ Trình Khám Phá Vũ Trụ & Hố Đen",
      description: "Chinh phục chân trời sự kiện và tìm hiểu về các thiên thể kỳ vĩ nhất.",
      authorId: "usr_teacher_2",
      courses: ["crs_blackhole_basics", "crs_astrophysics"],
      isAccepted: true,
      createdAt: new Date("2026-02-01"),
    },
    {
      id: "lpath_draft_relativity",
      lpathId: "lpath_draft_relativity",
      title: "Lộ Trình Thuyết Tương Đối Hẹp (Chờ Duyệt)",
      description: "Phân tích hệ quy chiếu phi quán tính và không thời gian 4 chiều.",
      authorId: "usr_teacher_1",
      courses: ["crs_special_relativity"],
      isAccepted: false,
      createdAt: new Date("2026-03-01"),
    },
  ];

  async getLearningPathById(lpathId: string): Promise<LearningPath | null> {
    const found = this.mockPaths.find((p) => p.lpathId === lpathId || p.id === lpathId);
    return found ? { ...found } : null;
  }

  async getAllLearningPaths(): Promise<LearningPath[]> {
    return [...this.mockPaths];
  }

  async getAcceptedLearningPaths(): Promise<LearningPath[]> {
    return this.mockPaths.filter((p) => p.isAccepted);
  }

  async getLearningPathsByAuthor(authorId: string): Promise<LearningPath[]> {
    return this.mockPaths.filter((p) => p.authorId === authorId);
  }

  async createLearningPath(input: CreateLearningPathInput): Promise<LearningPath> {
    const newPath: LearningPath = {
      id: `lpath_${Date.now()}`,
      lpathId: `lpath_${Date.now()}`,
      title: input.title,
      description: input.description,
      authorId: input.authorId,
      courses: input.courses,
      isAccepted: false,
      createdAt: new Date(),
    };
    this.mockPaths.push(newPath);
    return { ...newPath };
  }

  async updateLearningPath(
    lpathId: string,
    data: Partial<LearningPath>
  ): Promise<LearningPath> {
    const index = this.mockPaths.findIndex((p) => p.lpathId === lpathId || p.id === lpathId);
    if (index === -1) {
      throw new Error("Learning Path not found");
    }
    this.mockPaths[index] = {
      ...this.mockPaths[index],
      ...data,
      updatedAt: new Date(),
    };
    return { ...this.mockPaths[index] };
  }

  async approveLearningPath(lpathId: string): Promise<boolean> {
    const item = this.mockPaths.find((p) => p.lpathId === lpathId || p.id === lpathId);
    if (item) {
      item.isAccepted = true;
      item.updatedAt = new Date();
      return true;
    }
    return false;
  }

  async deleteLearningPath(lpathId: string): Promise<boolean> {
    const initialLen = this.mockPaths.length;
    this.mockPaths = this.mockPaths.filter((p) => p.lpathId !== lpathId && p.id !== lpathId);
    return this.mockPaths.length < initialLen;
  }
}
