import { NextResponse } from "next/server";
import OpenAI from "openai";
import { EVE_SKILL_DECLARATIONS, EVE_OPENAI_TOOLS } from "@/lib/aiSkillDefinitions";
import { executeEveSkill } from "@/lib/aiSkillService";

// ── Smart Conversational & Computational Intelligence Engine ──
function solveMathExpression(text: string): string | null {
  const cleaned = text.replace(/=/g, "").replace(/\?/g, "").trim();
  const mathRegex = /^([0-9\.\s\+\-\*\/\(\)\^\%]+)$/;
  if (mathRegex.test(cleaned) && /[0-9]/.test(cleaned) && /[\+\-\*\/\^\%]/.test(cleaned)) {
    try {
      const safeExpr = cleaned.replace(/\^/g, "**");
      if (/^[0-9\.\s\+\-\*\/\(\)\%]+$/.test(safeExpr)) {
        // eslint-disable-next-line no-eval
        const result = Function(`'use strict'; return (${safeExpr})`)();
        if (typeof result === "number" && !isNaN(result) && isFinite(result)) {
          return `###  Kết quả phép tính:

$$\\mathbf{${cleaned} = ${result}}$$

**Giải thích:**
- Thực hiện phép toán: \`${cleaned}\`
- Kết quả chính xác là: **${result}**

 Trong lập trình Python, bạn có thể tính trực tiếp bằng lệnh: \`print(${cleaned})\` nhé!`;
        }
      }
    } catch {}
  }
  return null;
}

/**
 * Làm sạch toàn bộ câu trả lời: Xóa các khối thinking, các nhãn phân tích hệ thống, và dấu ngoặc kép thừa.
 */
function cleanAIReply(text: string): string {
  if (!text) return "";
  let cleaned = text.trim();

  // 1. Loại bỏ các thẻ suy nghĩ <thought>...</thought> hoặc <thinking>...</thinking>
  cleaned = cleaned.replace(/<thought>[\s\S]*?<\/thought>/gi, "").trim();
  cleaned = cleaned.replace(/<thinking>[\s\S]*?<\/thinking>/gi, "").trim();
  cleaned = cleaned.replace(/^Thinking Process:[\s\S]*?(?=\n\n|\n[#A-ZÀ-Ỹ])/i, "").trim();

  // 2. Tách từng dòng và làm sạch
  const lines = cleaned.split("\n");
  const processedLines: string[] = [];

  for (const rawLine of lines) {
    let line = rawLine.trim();

    // 2.1 Bỏ qua các dòng thinking / metadata / checklist / chỉ dẫn hệ thống
    if (
      /^\*?\s*(Thinking|Thought|Reasoning|Planning|Plan|Understanding|Step\s*\d+|Role|User says|User role|My identity|Persona|Mission|User's Input|Tone|Constraint|Constraints|Acknowledge|Introduce|State capabilities|Encourage|Friendly|Markdown|Draft|Does it follow|Is it direct|Is the tone|Accurate|Evaluation|Checklist|Goal|Strategy|Approach):/i.test(
        line
      ) ||
      /^\*?\s*\*[^*]+\*\s*$/i.test(line) ||
      /^Does it follow/i.test(line) ||
      /^Is it direct/i.test(line) ||
      /^Is the tone/i.test(line) ||
      line === "*"
    ) {
      continue;
    }

    // 2.2 Xóa các tiền tố nhãn hội thoại như 'Greeting:', 'Introduction (briefly as E-V-E):', 'Offer help:'
    line = line
      .replace(
        /^\*?\s*(Greeting|Introduction\s*\([^)]*\)|Introduction|Offer help|Help offer|Response|Answer)\s*:\s*/i,
        ""
      )
      .trim();

    // 2.3 Bỏ qua dòng nếu là phần tùy chọn phụ (ví dụ: 'or "Xin chào! "')
    if (/^\s*or\s+["'“]/i.test(line)) {
      continue;
    }

    // 2.4 Xóa dấu * hoặc - ở đầu dòng
    if (line.startsWith("*")) {
      line = line.replace(/^\*+\s*/, "").trim();
    }

    // 2.5 Xóa dấu ngoặc kép " ở đầu và cuối dòng
    if (line.startsWith('"') && line.endsWith('"') && line.length >= 2) {
      line = line.slice(1, -1).trim();
    } else {
      line = line.replace(/^"+|"+$/g, "").trim();
    }

    processedLines.push(line);
  }

  let result = processedLines.join("\n").trim();

  // 3. Xóa dấu " ở đầu và cuối toàn bộ câu/đoạn văn
  if (result.startsWith('"') && result.endsWith('"')) {
    result = result.slice(1, -1).trim();
  }
  result = result.replace(/^"+|"+$/g, "").trim();

  return result;
}

/**
 * Trích xuất text sạch từ danh sách parts của Gemini, tự động loại bỏ mọi part có thinking/thought
 */
function extractGeminiText(parts: any[]): string {
  if (!Array.isArray(parts)) return "";
  const validTextParts = parts
    .filter((p: any) => !p.thought && typeof p.text === "string")
    .map((p: any) => p.text);
  return cleanAIReply(validTextParts.join("\n"));
}

/**
 * Gọi Google Gemini API với Agent Skill Tool Calling & Dynamic Model Selection
 */
async function callGeminiApi(
  apiKey: string,
  systemInstruction: string,
  userMessage: string
): Promise<string> {
  const cleanKey = apiKey.trim();
  let candidateModels: string[] = [
    "models/gemini-2.0-flash",
    "models/gemini-1.5-flash-latest",
    "models/gemini-1.5-flash",
    "models/gemini-pro",
  ];

  // 1. Thử truy vấn danh sách model thực tế được cấp quyền từ API Key
  try {
    const listRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`
    );
    if (listRes.ok) {
      const listData = await listRes.json();
      if (Array.isArray(listData.models)) {
        const supported = listData.models
          .filter(
            (m: any) =>
              Array.isArray(m.supportedGenerationMethods) &&
              m.supportedGenerationMethods.includes("generateContent")
          )
          .map((m: any) => m.name);

        if (supported.length > 0) {
          const priority = [
            "gemini-2.0-flash",
            "gemini-1.5-flash-latest",
            "gemini-1.5-flash",
            "gemini-1.5-pro",
            "gemini-pro",
          ];
          supported.sort((a: string, b: string) => {
            const idxA = priority.findIndex((p) => a.includes(p));
            const idxB = priority.findIndex((p) => b.includes(p));
            const scoreA = idxA === -1 ? 99 : idxA;
            const scoreB = idxB === -1 ? 99 : idxB;
            return scoreA - scoreB;
          });
          candidateModels = supported;
        }
      }
    }
  } catch (e) {
    console.warn("Không thể lấy danh sách dynamic models:", e);
  }

  let lastError: any = null;

  const strictSystemInstruction = `Bạn là E-V-E AI Tutor - Trợ lý giáo dục thông minh tại Việt Nam.
Bạn có khả năng gọi các Agent Skill của nền tảng web E-V-E để tra cứu thông tin chính xác về: Trò chơi (search_games), Lộ trình học (get_learning_paths), Khóa học (search_courses), Giáo viên (get_public_teachers), Hồ sơ học sinh (get_public_student_profile) và Bảng xếp hạng (get_leaderboard).
Hãy phản hồi trực tiếp, thân thiện, tự nhiên bằng tiếng Việt với định dạng Markdown đẹp. Không xuất ra bất kỳ ghi chú suy nghĩ (Thinking) nào.`;

  // 2. Thử lần lượt các model được tìm thấy
  for (const rawModelName of candidateModels) {
    const modelPath = rawModelName.startsWith("models/")
      ? rawModelName
      : `models/${rawModelName}`;

    try {
      const restUrl = `https://generativelanguage.googleapis.com/v1beta/${modelPath}:generateContent?key=${cleanKey}`;
      
      // Request lần 1: Kèm Tool Declarations (Agent Skills)
      const requestPayload: any = {
        system_instruction: {
          parts: [{ text: strictSystemInstruction }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: userMessage }],
          },
        ],
        tools: [
          {
            function_declarations: EVE_SKILL_DECLARATIONS,
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      };

      const restRes = await fetch(restUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
      });

      if (restRes.ok) {
        const data = await restRes.json();
        const firstCandidate = data.candidates?.[0];
        const parts = firstCandidate?.content?.parts || [];

        // ── KIỂM TRA XEM AI CÓ GỌI AGENT SKILL HAY KHÔNG ──
        const funcCallPart = parts.find((p: any) => p.functionCall);
        if (funcCallPart?.functionCall) {
          const { name, args } = funcCallPart.functionCall;
          console.log(` AI đang kích hoạt Agent Skill [${name}] với tham số:`, args);

          // Thực thi Agent Skill lấy dữ liệu từ Firebase / Hệ thống
          const skillResult = await executeEveSkill(name, args || {});

          // Gửi kết quả Skill ngược lại cho AI sinh câu trả lời hoàn chỉnh
          const secondPayload = {
            system_instruction: {
              parts: [{ text: strictSystemInstruction }],
            },
            contents: [
              {
                role: "user",
                parts: [{ text: userMessage }],
              },
              firstCandidate.content,
              {
                role: "function",
                parts: [
                  {
                    functionResponse: {
                      name,
                      response: { content: skillResult },
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
            },
          };

          const secondRes = await fetch(restUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(secondPayload),
          });

          if (secondRes.ok) {
            const secondData = await secondRes.json();
            const secondParts = secondData.candidates?.[0]?.content?.parts || [];
            const finalReply = extractGeminiText(secondParts);
            if (finalReply) {
              return finalReply;
            }
          }
        }

        // Nếu không có tool call, trích xuất câu trả lời trực tiếp (bỏ qua thinking)
        const textReply = extractGeminiText(parts);
        if (textReply) {
          return textReply;
        }
      } else {
        // Fallback đơn giản không kèm tools nếu model cũ không hỗ trợ function calling
        const fallbackRes = await fetch(restUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: userMessage }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
            },
          }),
        });

        if (fallbackRes.ok) {
          const fbData = await fallbackRes.json();
          const fbParts = fbData.candidates?.[0]?.content?.parts || [];
          const fbText = extractGeminiText(fbParts);
          if (fbText) {
            return fbText;
          }
        } else {
          const errJson = await restRes.json().catch(() => ({}));
          lastError = new Error(
            errJson.error?.message || `HTTP ${restRes.status} cho model ${modelPath}`
          );
        }
      }
    } catch (err: any) {
      lastError = err;
    }
  }

  throw (
    lastError ||
    new Error(
      "Không tìm thấy model Gemini phù hợp được hỗ trợ cho API Key này."
    )
  );
}

/**
 * Xử lý truy vấn thông tin hệ thống E-V-E nếu chạy chế độ Fallback không dùng API Key
 */
async function handleFallbackPlatformQueries(q: string): Promise<string | null> {
  const lower = q.toLowerCase();

  // 1. Leaderboard / Ranking
  if (
    lower.includes("bảng xếp hạng") ||
    lower.includes("ranking") ||
    lower.includes("leaderboard") ||
    lower.includes("top điểm") ||
    lower.includes("ai đang đứng top") ||
    lower.includes("ai đứng đầu")
  ) {
    const data = await executeEveSkill("get_leaderboard", { limit: 5 });
    if (data && data.leaderboard && data.leaderboard.length > 0) {
      const rows = data.leaderboard
        .map(
          (item: any) =>
            `| **#${item.rank}** | **${item.name}** | ${item.totalScore} | ${item.gamesPlayed} |`
        )
        .join("\n");
      return `###  BẢNG XẾP HẠNG HỌC VIÊN E-V-E (CÔNG KHAI)

| Hạng | Học sinh | Tổng Điểm | Số Game Đã Chơi |
| :---: | :--- | :---: | :---: |
${rows}

 Bạn có thể vào mục **[Bảng Xếp Hạng](/student/leaderboard)** để xem chi tiết đầy đủ nhé!`;
    }
  }

  // 2. Games / Mini-games
  if (
    lower.includes("game") ||
    lower.includes("trò chơi") ||
    lower.includes("luyện tập") ||
    lower.includes("mini game")
  ) {
    const data = await executeEveSkill("search_games", {});
    if (data && data.games && data.games.length > 0) {
      const list = data.games
        .map((g: any) => `-  **${g.title}**: ${g.description}`)
        .join("\n");
      return `###  DANH SÁCH TRÒ CHƠI HỌC TẬP TRÊN E-V-E:

${list}

 Hãy truy cập ngay mục **[Phòng Game Học Tập](/student/games)** để thử thách bản thân và tích lũy điểm thưởng!`;
    }
  }

  // 3. Learning Path
  if (
    lower.includes("lộ trình") ||
    lower.includes("learning path") ||
    lower.includes("học từ đầu") ||
    lower.includes("khóa học bắt đầu")
  ) {
    const data = await executeEveSkill("get_learning_paths", {});
    if (data && data.learningPaths && data.learningPaths.length > 0) {
      const list = data.learningPaths
        .map(
          (p: any) =>
            `-  **${p.title}** (${p.totalCourses} khóa học con): ${p.description}`
        )
        .join("\n");
      return `###  CÁC LỘ TRÌNH HỌC TẬP CHUẨN TRÊN E-V-E:

${list}

 Khám phá chi tiết tại mục **[Lộ Trình Học](/student/learning-paths)** nhé!`;
    }
  }

  // 4. Courses
  if (
    lower.includes("khóa học") ||
    lower.includes("bài giảng") ||
    lower.includes("course")
  ) {
    const data = await executeEveSkill("search_courses", {});
    if (data && data.courses && data.courses.length > 0) {
      const list = data.courses
        .map(
          (c: any) =>
            `-  **${c.title}**: ${c.description} (Thời lượng: ${c.totalDuration})`
        )
        .join("\n");
      return `###  CÁC KHÓA HỌC ĐANG MỞ TRÊN E-V-E:

${list}

 Bạn có thể xem đề cương chi tiết trong giao diện học tập!`;
    }
  }

  // 5. Teachers
  if (
    lower.includes("giáo viên") ||
    lower.includes("thầy cô") ||
    lower.includes("giảng viên") ||
    lower.includes("teacher")
  ) {
    const data = await executeEveSkill("get_public_teachers", {});
    if (data && data.teachers && data.teachers.length > 0) {
      const list = data.teachers
        .map(
          (t: any) =>
            `-  **${t.name}**: ${t.bio} *(Chuyên môn: ${t.subjects.join(", ")})*`
        )
        .join("\n");
      return `###  DANH SÁCH GIÁO VIÊN & GIẢNG VIÊN E-V-E:

${list}`;
    }
  }

  return null;
}

function getIntelligentEducationalResponse(question: string, role: string = "student"): string {
  const q = question.toLowerCase().trim();

  // Greetings & Introductions
  if (
    q === "hi" ||
    q === "hello" ||
    q === "chào" ||
    q === "chào bạn" ||
    q === "xin chào" ||
    q === "hey"
  ) {
    return `Chào bạn!  Rất vui được đồng hành cùng bạn hôm nay.

Tôi là **Trợ Lý AI E-V-E**, sẵn sàng giúp bạn:
1.  **Học lập trình Python, Scratch & Tư duy thuật toán**
2.  **Tìm kiếm thông tin Game học tập, Lộ trình, Khóa học & Bảng xếp hạng**
3.  **Khám phá phần cứng máy tính 3D & Công nghệ**
4.  **Giải đáp toán học & logic vui nhộn**
5.  **Tìm và sửa lỗi code (Debug)**

Bạn muốn cùng tôi khám phá chủ đề nào trước?`;
  }

  if (q.includes("bạn là ai") || q.includes("tên là gì") || q.includes("ai tutor")) {
    return `Tôi là **E-V-E AI Tutor** - Người bạn trợ lý học tập thông minh được tích hợp hệ thống Agent Skill trên nền tảng giáo dục công nghệ E-V-E! 

Tôi có thể hỗ trợ bạn học lập trình, giải toán và tra cứu toàn bộ thông tin công khai về Games, Khóa học, Lộ trình, Giáo viên và Bảng xếp hạng trên hệ thống.`;
  }

  if (q.includes("biến") || q.includes("variable") || q.includes("kiểu dữ liệu")) {
    return `###  Khái niệm Biến số (Variables) trong Lập trình:

**Biến số** giống như một **chiếc hộp có dán nhãn** để lưu trữ thông tin (số, chữ, dữ liệu) trong bộ nhớ máy tính.

\`\`\`python
# Ví dụ tạo biến trong Python:
ten_hoc_sinh = "Bảo Nam"  # Kiểu chữ (String)
tuoi = 10                  # Kiểu số nguyên (Integer)
diem_so = 9.5              # Kiểu số thập phân (Float)
da_hoan_thanh = True       # Kiểu Đúng/Sai (Boolean)

print("Xin chào", ten_hoc_sinh, "- Điểm của bạn là:", diem_so)
\`\`\`

 **Gợi ý thực hành:** Hãy thử tạo 2 biến \`a = 5\` và \`b = 10\`, sau đó in ra tổng \`a + b\` nhé!`;
  }

  if (q.includes("vòng lặp") || q.includes("loop") || q.includes("for") || q.includes("while")) {
    return `###  Vòng Lặp (Loops) trong Lập trình:

Vòng lặp giúp máy tính tự động lặp lại một hành động nhiều lần mà không cần viết lại mã nguồn.

#### 1. Vòng lặp \`for\` (Lặp với số lần biết trước):
\`\`\`python
# In các số từ 1 đến 5:
for i in range(1, 6):
    print("Lần lặp thứ:", i)
\`\`\`

#### 2. Vòng lặp \`while\` (Lặp khi điều kiện còn Đúng):
\`\`\`python
nang_luong = 3
while nang_luong > 0:
    print("Nhân vật đang chạy... Năng lượng còn:", nang_luong)
    nang_luong -= 1
print("Đã hết năng lượng!")
\`\`\`

 **Ứng dụng trong Game:** Vòng lặp dùng để kiểm tra va chạm, cập nhật chuyển động nhân vật liên tục!`;
  }

  if (q.includes("điều kiện") || q.includes("if") || q.includes("else") || q.includes("so sánh")) {
    return `###  Câu Lệnh Điều Kiện (If - Else):

Câu lệnh điều kiện giúp chương trình đưa ra **quyết định** dựa trên tình huống cụ thể (giống như *"Nếu trời mưa thì mang ô, ngược lại thì đội mũ"*).

\`\`\`python
diem_kiem_tra = 85

if diem_kiem_tra >= 90:
    print("Xếp loại: Xuất sắc! ")
elif diem_kiem_tra >= 70:
    print("Xếp loại: Khá giỏi! ")
else:
    print("Cần cố gắng thêm ở bài sau nhé! ")
\`\`\`

 **Mẹo nhỏ:** Đừng quên thụt lề 4 dấu cách sau dấu hai chấm \`:\` trong Python nhé!`;
  }

  if (
    q.includes("phần cứng") ||
    q.includes("cpu") ||
    q.includes("ram") ||
    q.includes("gpu") ||
    q.includes("ssd") ||
    q.includes("máy tính")
  ) {
    return `###  Các Linh Kiện Phần Cứng Máy Tính Cơ Bản:

1. **CPU (Bộ vi xử lý):** "Bộ não" của máy tính, chịu trách nhiệm tính toán và thực thi mọi câu lệnh.
2. **RAM (Bộ nhớ tạm thời):** Lưu trữ dữ liệu các ứng dụng đang chạy. Khi tắt máy tính, dữ liệu trên RAM sẽ bị xóa sạch.
3. **GPU (Card đồ họa):** Xử lý hình ảnh, dựng mô hình 3D và đồ họa trò chơi mượt mà.
4. **SSD (Ổ cứng thể rắn):** Nơi lưu trữ vĩnh viễn hệ điều hành, game và tài liệu với tốc độ đọc ghi siêu tốc.
5. **Mainboard (Bo mạch chủ):** "Xương sống" kết nối tất cả các linh kiện trên với nhau.
\n💡 Bạn có thể chơi trò **Lật Thẻ Trí Nhớ Thuật Toán** để ôn luyện và củng cố kiến thức phần cứng này!`;
  }

  if (role === "teacher" || q.includes("soạn") || q.includes("json pair") || q.includes("đề thi")) {
    return `###  Gợi Ý Cặp Dữ Liệu (JSON Pairs) Cho Bài Giảng:

Thầy/Cô có thể tham khảo mẫu cặp câu hỏi dưới đây để nhập nhanh vào Trung Tâm Soạn Bài:

\`\`\`json
[
  {
    "title": "Cú pháp khai báo hàm trong Python bắt đầu bằng từ khóa nào?",
    "description": "def",
    "distractions": ["func", "function", "define"]
  },
  {
    "title": "Linh kiện nào được ví như bộ não xử lý trung tâm của máy tính?",
    "description": "CPU (Central Processing Unit)",
    "distractions": ["RAM", "Ổ cứng SSD", "Khối nguồn PSU"]
  },
  {
    "title": "Kết quả của biểu thức 10 % 3 trong lập trình là bao nhiêu?",
    "description": "1 (Phép chia lấy phần dư)",
    "distractions": ["3", "0", "3.33"]
  }
]
\`\`\`

 Thầy/Cô chỉ cần dán các cặp này vào Tab 1 ở mục **Soạn Bài & Học Liệu** để hệ thống tự động bốc vào Game Quiz và Card Matching!`;
  }

  return `###  Trả Lời Về "${question}":

1. **Khái niệm & Ý nghĩa:**
   - Trong học tập và tư duy máy tính, câu hỏi **"${question}"** giúp chúng ta hiểu sâu hơn về cách giải quyết vấn đề logic theo từng bước (Step-by-step).

2. **Cách tiếp cận từng bước:**
   - **Bước 1:** Xác định thông tin đầu vào (Input).
   - **Bước 2:** Xử lý và tính toán theo quy tắc/thuật toán (Process).
   - **Bước 3:** Đưa ra kết quả chính xác (Output).

3. **Ví dụ thực tế:**
   - Nếu áp dụng vào lập trình, bạn có thể dùng Python để mô phỏng và kiểm tra nhanh kết quả!

 Bạn muốn tôi làm rõ thêm chi tiết nào hay viết code mẫu minh họa không?`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = (body.message || body.prompt || "").trim();
    const role = body.role || "student";

    if (!message) {
      return NextResponse.json({ error: "Không có câu hỏi được gửi" }, { status: 400 });
    }

    const providedKey =
      body.geminiApiKey ||
      body.apiKey ||
      body.openaiApiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    const isOpenAIKey =
      Boolean(body.openaiApiKey) ||
      (typeof providedKey === "string" && providedKey.startsWith("sk-")) ||
      Boolean(process.env.OPENAI_API_KEY);

    const systemInstruction = `Bạn là E-V-E AI Tutor - Trợ lý thông minh hàng đầu về giáo dục công nghệ, lập trình và khoa học tại Việt Nam.
Vai trò người dùng đang trò chuyện: ${role}.`;

    // ── 1. NẾU CÓ API KEY -> GỌI TRỰC TIẾP AI MODEL ĐỂ TRẢ LỜI CÂU HỎI ──
    if (providedKey) {
      // 1.1 Nếu là OpenAI Key
      if (isOpenAIKey) {
        try {
          const openaiApiKey =
            body.openaiApiKey || providedKey || process.env.OPENAI_API_KEY;
          const openai = new OpenAI({ apiKey: openaiApiKey });

          const runner = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemInstruction },
              { role: "user", content: message },
            ],
            tools: EVE_OPENAI_TOOLS,
          });

          const choice = runner.choices[0]?.message;
          if (choice?.tool_calls && choice.tool_calls.length > 0) {
            const toolCall = choice.tool_calls[0];
            if (toolCall.type === "function") {
              const args = JSON.parse(toolCall.function.arguments || "{}");
              const toolResult = await executeEveSkill(
                toolCall.function.name,
                args
              );

              const secondRun = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                  { role: "system", content: systemInstruction },
                  { role: "user", content: message },
                  choice,
                  {
                    role: "tool",
                    tool_call_id: toolCall.id,
                    content: JSON.stringify(toolResult),
                  },
                ],
              });

              const reply = secondRun.choices[0]?.message?.content;
              if (reply) {
                return NextResponse.json({
                  success: true,
                  reply: cleanAIReply(reply),
                  source: "openai-live-skill",
                });
              }
            }
          }

          if (choice?.content) {
            return NextResponse.json({
              success: true,
              reply: cleanAIReply(choice.content),
              source: "openai-live-model",
            });
          }
        } catch (openAiErr: any) {
          console.error(" OpenAI Live Call Error:", openAiErr.message);
          return NextResponse.json({
            success: false,
            reply: ` **Lỗi OpenAI API Key:** ${openAiErr.message || "Không thể xác thực khóa OpenAI"}.\n\nThầy/Cô hãy kiểm tra lại mã API Key OpenAI trong phần Cài đặt nhé!`,
            source: "openai-error",
          });
        }
      }

      // 1.2 Nếu là Google Gemini Key
      try {
        const geminiReply = await callGeminiApi(
          providedKey,
          systemInstruction,
          message
        );
        if (geminiReply && geminiReply.trim()) {
          return NextResponse.json({
            success: true,
            reply: geminiReply,
            source: "gemini-live-model",
          });
        }
      } catch (geminiErr: any) {
        console.error(" Gemini Live Call Error:", geminiErr.message);
        return NextResponse.json({
          success: false,
          reply: ` **Không thể kết nối Google Gemini API với Key đã nhập:**\n\`${geminiErr.message || "Lỗi xác thực API Key"}\`\n\n **Gợi ý khắc phục:**\n1. Kiểm tra mã Gemini API Key tại [Google AI Studio](https://aistudio.google.com/app/apikey).\n2. Đảm bảo API Key còn hạn mức sử dụng (Quota) và chưa bị vô hiệu hóa.`,
          source: "gemini-error",
        });
      }
    }

    // ── 2. NẾU KHÔNG CÓ API KEY -> CHẠY LOCAL ENGINE & PLATFORM QUERIES ──

    // 2.1 Tính toán toán học trực tiếp
    const directMath = solveMathExpression(message);
    if (directMath) {
      return NextResponse.json({
        success: true,
        reply: directMath,
        source: "math-engine",
      });
    }

    // 2.2 Tra cứu dữ liệu nền tảng E-V-E (Game, Lộ trình, Khóa học, Bảng xếp hạng)
    const platformDataReply = await handleFallbackPlatformQueries(message);
    if (platformDataReply) {
      return NextResponse.json({
        success: true,
        reply: platformDataReply,
        source: "eve-public-skill-fallback",
      });
    }

    // 2.3 Local Educational Fallback Response
    const fallbackReply = getIntelligentEducationalResponse(message, role);

    return NextResponse.json({
      success: true,
      reply: fallbackReply,
      source: "eve-educational-engine",
    });
  } catch (error: any) {
    console.error("AI Tutor Route Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Lỗi xử lý câu hỏi của AI Tutor",
        reply: "Hệ thống AI đang bận xử lý dữ liệu. Bạn hãy thử lại sau ít giây nhé!",
      },
      { status: 500 }
    );
  }
}