import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

// ── Smart Conversational & Computational Intelligence Engine ──
function solveMathExpression(text: string): string | null {
  const cleaned = text.replace(/=/g, "").replace(/\?/g, "").trim();
  // Match patterns like "1+1", "25 * 4", "100 / 2", "5 - 3", "2^3", "sqrt(16)", "10 + 20 - 5"
  const mathRegex = /^([0-9\.\s\+\-\*\/\(\)\^\%]+)$/;
  if (mathRegex.test(cleaned) && /[0-9]/.test(cleaned) && /[\+\-\*\/\^\%]/.test(cleaned)) {
    try {
      // Safe sanitized eval for basic math only
      const safeExpr = cleaned.replace(/\^/g, "**");
      // Only allow numbers and basic math operators
      if (/^[0-9\.\s\+\-\*\/\(\)\%]+$/.test(safeExpr)) {
        // eslint-disable-next-line no-eval
        const result = Function(`'use strict'; return (${safeExpr})`)();
        if (typeof result === "number" && !isNaN(result) && isFinite(result)) {
          return `### 🧮 Kết quả phép tính:

$$\\mathbf{${cleaned} = ${result}}$$

**Giải thích:**
- Thực hiện phép toán: \`${cleaned}\`
- Kết quả chính xác là: **${result}**

👉 Trong lập trình Python, bạn có thể tính trực tiếp bằng lệnh: \`print(${cleaned})\` nhé!`;
        }
      }
    } catch {}
  }
  return null;
}

function getIntelligentEducationalResponse(question: string, role: string = "student"): string {
  const q = question.toLowerCase().trim();

  // 1. Check math expressions first (e.g. "1+1", "1+1=", "50 * 2", "10 / 3")
  const mathAnswer = solveMathExpression(question);
  if (mathAnswer) return mathAnswer;

  // 2. Greetings & Introductions
  if (q === "hi" || q === "hello" || q === "chào" || q === "chào bạn" || q === "xin chào" || q === "hey") {
    return `Chào bạn! 👋 Rất vui được đồng hành cùng bạn hôm nay.

Tôi là **Trợ Lý AI E-V-E**, sẵn sàng giúp bạn:
1. 🐍 **Học lập trình Python, Scratch & Tư duy thuật toán**
2. 🖥️ **Khám phá phần cứng máy tính 3D & Công nghệ**
3. 🧮 **Giải đáp toán học & logic vui nhộn**
4. 🐞 **Tìm và sửa lỗi code (Debug)**

Bạn muốn cùng tôi khám phá chủ đề nào trước?`;
  }

  // 3. Who are you? / Bạn là ai?
  if (q.includes("bạn là ai") || q.includes("tên là gì") || q.includes("ai tutor")) {
    return `Tôi là **E-V-E AI Tutor** - Người bạn trợ lý học tập thông minh được thiết kế riêng cho nền tảng giáo dục công nghệ E-V-E! 🤖

Nhiệm vụ của tôi là giúp học sinh học lập trình dễ dàng, vui nhộn hơn thông qua các ví dụ trực quan, trò chơi và giải thích từng bước cặn kẽ.`;
  }

  // 4. Python Variables & Data Types
  if (q.includes("biến") || q.includes("variable") || q.includes("kiểu dữ liệu")) {
    return `### 💡 Khái niệm Biến số (Variables) trong Lập trình:

**Biến số** giống như một **chiếc hộp có dán nhãn** để lưu trữ thông tin (số, chữ, dữ liệu) trong bộ nhớ máy tính.

\`\`\`python
# Ví dụ tạo biến trong Python:
ten_hoc_sinh = "Bảo Nam"  # Kiểu chữ (String)
tuoi = 10                  # Kiểu số nguyên (Integer)
diem_so = 9.5              # Kiểu số thập phân (Float)
da_hoan_thanh = True       # Kiểu Đúng/Sai (Boolean)

print("Xin chào", ten_hoc_sinh, "- Điểm của bạn là:", diem_so)
\`\`\`

👉 **Gợi ý thực hành:** Hãy thử tạo 2 biến \`a = 5\` và \`b = 10\`, sau đó in ra tổng \`a + b\` nhé!`;
  }

  // 5. Loops (for / while)
  if (q.includes("vòng lặp") || q.includes("loop") || q.includes("for") || q.includes("while")) {
    return `### 🔁 Vòng Lặp (Loops) trong Lập trình:

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

👉 **Ứng dụng trong Game:** Vòng lặp dùng để kiểm tra va chạm, cập nhật chuyển động nhân vật liên tục!`;
  }

  // 6. Conditional statements (if-else)
  if (q.includes("điều kiện") || q.includes("if") || q.includes("else") || q.includes("so sánh")) {
    return `### 🔀 Câu Lệnh Điều Kiện (If - Else):

Câu lệnh điều kiện giúp chương trình đưa ra **quyết định** dựa trên tình huống cụ thể (giống như *"Nếu trời mưa thì mang ô, ngược lại thì đội mũ"*).

\`\`\`python
diem_kiem_tra = 85

if diem_kiem_tra >= 90:
    print("Xếp loại: Xuất sắc! 🌟")
elif diem_kiem_tra >= 70:
    print("Xếp loại: Khá giỏi! 👍")
else:
    print("Cần cố gắng thêm ở bài sau nhé! 💪")
\`\`\`

👉 **Mẹo nhỏ:** Đừng quên thụt lề 4 dấu cách sau dấu hai chấm \`:\` trong Python nhé!`;
  }

  // 7. Computer Hardware & Components
  if (q.includes("phần cứng") || q.includes("cpu") || q.includes("ram") || q.includes("gpu") || q.includes("ssd") || q.includes("máy tính")) {
    return `### 🖥️ Các Linh Kiện Phần Cứng Máy Tính Cơ Bản:

1. **CPU (Bộ vi xử lý):** "Bộ não" của máy tính, chịu trách nhiệm tính toán và thực thi mọi câu lệnh.
2. **RAM (Bộ nhớ tạm thời):** Lưu trữ dữ liệu các ứng dụng đang chạy. Khi tắt máy tính, dữ liệu trên RAM sẽ bị xóa sạch.
3. **GPU (Card đồ họa):** Xử lý hình ảnh, dựng mô hình 3D và đồ họa trò chơi mượt mà.
4. **SSD (Ổ cứng thể rắn):** Nơi lưu trữ vĩnh viễn hệ điều hành, game và tài liệu với tốc độ đọc ghi siêu tốc.
5. **Mainboard (Bo mạch chủ):** "Xương sống" kết nối tất cả các linh kiện trên với nhau.

👉 Bạn có thể vào phòng thí nghiệm **3D Hardware Assembly Lab** trong Lộ trình để tự tay lắp ráp các linh kiện này!`;
  }

  // 8. Functions & Methods
  if (q.includes("hàm") || q.includes("function") || q.includes("def")) {
    return `### 📦 Hàm (Functions) - Tái Sử Dụng Mã Nguồn:

**Hàm** là một khối lệnh được đặt tên để thực hiện một nhiệm vụ cụ thể. Khi cần dùng, bạn chỉ cần gọi tên hàm.

\`\`\`python
# Khai báo hàm tính điểm thưởng
def tinh_diem_thuong(so_cau_dung):
    diem = so_cau_dung * 10
    return diem

# Gọi hàm
ket_qua = tinh_diem_thuong(5)
print("Tổng điểm thưởng nhận được là:", ket_qua) # In ra: 50
\`\`\``;
  }

  // 9. Debugging & Syntax Errors
  if (q.includes("lỗi") || q.includes("error") || q.includes("debug") || q.includes("syntax")) {
    return `### 🐞 Các Lỗi Thường Gặp Khi Học Lập Trình & Cách Sửa:

1. **SyntaxError (Lỗi cú pháp):** Quên dấu hai chấm \`:\`, đóng mở ngoặc \`()\` không đủ hoặc viết sai từ khóa.
2. **IndentationError (Lỗi thụt lề):** Thụt lề không đều giữa các dòng lệnh con trong hàm, if hoặc vòng lặp.
3. **NameError (Biến chưa khai báo):** Dùng một biến trước khi gán giá trị cho nó hoặc gõ sai chính tả tên biến.
4. **ZeroDivisionError (Chia cho 0):** Thực hiện phép chia cho số 0.

👉 **Mẹo debug:** Hãy đọc kỹ thông báo lỗi ở dòng cuối cùng trong màn hình Console để biết chính xác lỗi xảy ra ở dòng nào nhé!`;
  }

  // 10. Teacher Assistance (Soạn bài, JSON pairs)
  if (role === "teacher" || q.includes("soạn") || q.includes("json pair") || q.includes("đề thi")) {
    return `### 📋 Gợi Ý Cặp Dữ Liệu (JSON Pairs) Cho Bài Giảng:

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

👉 Thầy/Cô chỉ cần dán các cặp này vào Tab 1 ở mục **Soạn Bài & Học Liệu** để hệ thống tự động bốc vào Game Quiz và Card Matching!`;
  }

  // 11. General Questions with Helpful Step-by-Step Reasoning
  return `### 💡 Trả Lời Về "${question}":

1. **Khái niệm & Ý nghĩa:**
   - Trong học tập và tư duy máy tính, câu hỏi **"${question}"** giúp chúng ta hiểu sâu hơn về cách giải quyết vấn đề logic theo từng bước (Step-by-step).

2. **Cách tiếp cận từng bước:**
   - **Bước 1:** Xác định thông tin đầu vào (Input).
   - **Bước 2:** Xử lý và tính toán theo quy tắc/thuật toán (Process).
   - **Bước 3:** Đưa ra kết quả chính xác (Output).

3. **Ví dụ thực tế:**
   - Nếu áp dụng vào lập trình, bạn có thể dùng Python để mô phỏng và kiểm tra nhanh kết quả!

👉 Bạn muốn tôi làm rõ thêm chi tiết nào hay viết code mẫu minh họa không?`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body.message || body.prompt;
    const role = body.role || "student";
    const subjectId = body.subjectId;

    if (!message) {
      return NextResponse.json({ error: "Không có câu hỏi được gửi" }, { status: 400 });
    }

    // Check for math evaluation immediately
    const directMath = solveMathExpression(message);
    if (directMath) {
      return NextResponse.json({
        success: true,
        reply: directMath,
        source: "math-engine",
      });
    }

    const geminiKey =
      body.geminiApiKey ||
      body.apiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const openaiKey = body.openaiApiKey || process.env.OPENAI_API_KEY;

    // 1. Try Gemini AI if key exists
    if (geminiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: geminiKey });
        const systemInstruction = `Bạn là E-V-E AI Tutor - Trợ lý giáo dục dạy lập trình, toán học và khoa học máy tính cho học sinh & giáo viên tại Việt Nam.
Hãy trả lời thân thiện, chính xác mọi câu hỏi (toán học, lập trình, khoa học, logic), có ví dụ code ngắn gọn, định dạng Markdown đẹp, giải thích rõ ràng và khích lệ tư duy học tập.
Vai trò người dùng: ${role}.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `${systemInstruction}\n\nCâu hỏi của người dùng: ${message}`,
        });

        const replyText = response.text;
        if (replyText && replyText.trim()) {
          return NextResponse.json({
            success: true,
            reply: replyText,
            source: "gemini-api",
          });
        }
      } catch (geminiErr: any) {
        console.warn("⚠️ Gemini API error, falling back:", geminiErr.message);
      }
    }

    // 2. Try OpenAI if key exists
    if (openaiKey) {
      try {
        const openai = new OpenAI({ apiKey: openaiKey });
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `Bạn là E-V-E AI Tutor dạy lập trình và khoa học cho trẻ em tại Việt Nam. Trả lời thân thiện, chính xác, định dạng Markdown đẹp.`,
            },
            { role: "user", content: message },
          ],
        });
        const replyText = completion.choices[0]?.message?.content;
        if (replyText) {
          return NextResponse.json({
            success: true,
            reply: replyText,
            source: "openai-api",
          });
        }
      } catch (openAiErr: any) {
        console.warn("⚠️ OpenAI error, falling back:", openAiErr.message);
      }
    }

    // 3. Fallback to Comprehensive Local Intelligence Engine
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