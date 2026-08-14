// lib/aiSkillDefinitions.ts

export interface FunctionDeclaration {
  name: string;
  description: string;
  parameters: {
    type: "OBJECT" | "object";
    properties: Record<string, any>;
    required?: string[];
  };
}

/**
 * Danh sách định nghĩa các Skill / Tool công khai cho AI Tutor của nền tảng E-V-E.
 */
export const EVE_SKILL_DECLARATIONS: FunctionDeclaration[] = [
  {
    name: "search_games",
    description: "Tìm kiếm các trò chơi giáo dục, game bài tập, thực hành 3D công khai trên hệ thống E-V-E theo tên, thể loại hoặc từ khóa.",
    parameters: {
      type: "OBJECT",
      properties: {
        keyword: {
          type: "STRING",
          description: "Từ khóa tìm kiếm (ví dụ: 'Python', 'Phần cứng', 'Toán', 'Lắp ráp')",
        },
      },
    },
  },
  {
    name: "get_learning_paths",
    description: "Lấy danh sách các lộ trình học tập (Learning Path) chuẩn hóa công khai trên hệ thống E-V-E.",
    parameters: {
      type: "OBJECT",
      properties: {
        keyword: {
          type: "STRING",
          description: "Từ khóa tìm kiếm lộ trình (ví dụ: 'Python', 'Khoa học', 'Lập trình')",
        },
      },
    },
  },
  {
    name: "search_courses",
    description: "Tra cứu danh mục các khóa học đã được kiểm duyệt và công khai trên E-V-E.",
    parameters: {
      type: "OBJECT",
      properties: {
        keyword: {
          type: "STRING",
          description: "Tên khóa học hoặc từ khóa liên quan",
        },
      },
    },
  },
  {
    name: "get_public_teachers",
    description: "Tra cứu danh sách giáo viên, giảng viên công khai trên hệ thống E-V-E.",
    parameters: {
      type: "OBJECT",
      properties: {
        keyword: {
          type: "STRING",
          description: "Tên giáo viên hoặc môn học phụ trách",
        },
      },
    },
  },
  {
    name: "get_public_student_profile",
    description: "Tra cứu hồ sơ thành tích công khai của một học sinh (Điểm tích lũy, cấp độ, bảng xếp hạng).",
    parameters: {
      type: "OBJECT",
      properties: {
        studentName: {
          type: "STRING",
          description: "Tên hiển thị của học sinh cần tìm",
        },
      },
      required: ["studentName"],
    },
  },
  {
    name: "get_leaderboard",
    description: "Lấy bảng xếp hạng công khai (Top học sinh điểm cao, số game đã chơi và thành tích trong tháng).",
    parameters: {
      type: "OBJECT",
      properties: {
        limit: {
          type: "NUMBER",
          description: "Số lượng học sinh trong top cần lấy (mặc định: 10)",
        },
      },
    },
  },
];

/**
 * Định dạng Tool declarations cho OpenAI Chat Completions
 */
export const EVE_OPENAI_TOOLS = EVE_SKILL_DECLARATIONS.map((tool) => ({
  type: "function" as const,
  function: {
    name: tool.name,
    description: tool.description,
    parameters: {
      type: "object",
      properties: Object.fromEntries(
        Object.entries(tool.parameters.properties).map(([k, v]) => [
          k,
          { ...v, type: v.type.toLowerCase() },
        ])
      ),
      required: tool.parameters.required || [],
    },
  },
}));
