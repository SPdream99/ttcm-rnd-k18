import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// ── Smart Educator Knowledge Engine for Programming & Tech (Fallback & Offline Intelligence) ──
function getIntelligentEducationalResponse(question: string, role: string = "student"): string {
  const q = question.toLowerCase().trim();

  // 1. Python Variables & Data Types
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

  // 2. Loops (for / while)
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

  // 3. Conditional statements (if-else)
  if (q.includes("điều kiện") || q.includes("if") || q.includes("else") || q.includes("so sánh")) {
    return `### 🔀 Câu Lệnh Điều Kiện (If - Else):

Câu lệnh điều kiện giúp chương trình đưa ra **quyết định** dựa trên tình huống cụ thể (giống như "Nếu trời mưa thì mang ô, ngược lại thì đội mũ").

\`\`\`python
diem_kiem_tra = 85

if diem_kiem_tra >= 90:
    print("Xếp loại: Xuất sắc! 🌟")
elif diem_kiem_tra >= 70:
    print("Xếp loại: Khá giỏi! 👍")
else:
    print("Cần cố gắng thêm ở bài sau nhé! 💪")
\`\`\`

👉 **Mẹo nhỏ:** Đừng quên thụt lề (indentation) 4 dấu cách sau dấu hai chấm \`:\` trong Python nhé!`;
  }

  // 4. Computer Hardware & Components
  if (q.includes("phần cứng") || q.includes("cpu") || q.includes("ram") || q.includes("gpu") || q.includes("ssd")) {
    return `### 🖥️ Các Linh Kiện Phần Cứng Máy Tính Cơ Bản:

1. **CPU (Bộ vi xử lý):** "Bộ não" của máy tính, chịu trách nhiệm tính toán và thực thi mọi câu lệnh.
2. **RAM (Bộ nhớ tạm thời):** Lưu trữ dữ liệu các ứng dụng đang chạy. Khi tắt máy tính, dữ liệu trên RAM sẽ bị xóa sạch.
3. **GPU (Card đồ họa):** Xử lý hình ảnh, dựng mô hình 3D và đồ họa trò chơi mượt mà.
4. **SSD (Ổ cứng thể rắn):** Nơi lưu trữ vĩnh viễn hệ điều hành, game và tài liệu với tốc độ đọc ghi siêu tốc.
5. **Mainboard (Bo mạch chủ):** "Xương sống" kết nối tất cả các linh kiện trên với nhau.

👉 Bạn có thể vào phòng thí nghiệm **3D Hardware Assembly Lab** trong Lộ trình để tự tay lắp ráp các linh kiện này!`;
  }

  // 5. Functions & Methods
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

  // 6. Teacher Assistance (Soạn bài, JSON pairs)
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

  // Default intelligent educational reply
  return `Chào bạn! Tôi là Trợ Lý AI của E-V-E. 

Về câu hỏi **"${question}"**:
- Trong khoa học máy tính và lập trình, đây là một chủ đề rất thú vị để rèn luyện tư duy logic.
- Bạn có thể đặt các câu hỏi cụ thể hơn như: *"Cách viết vòng lặp for trong Python"*, *"Giải thích cấu tạo CPU"*, *"Sửa lỗi cú pháp SyntaxError"* hoặc *"Cách tạo một game mini"*.

Bạn muốn tôi giải thích bằng ví dụ mã nguồn (code) hay hình ảnh trực quan nào? 🚀`;
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

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    // If Gemini API Key is configured, attempt real Gemini API call
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemPrompt = `Bạn là E-V-E AI Tutor - Trợ lý giáo dục dạy lập trình và khoa học máy tính cho học sinh & giáo viên tại Việt Nam.
Hãy trả lời thân thiện, dễ hiểu, có ví dụ code ngắn gọn, định dạng Markdown đẹp, giải thích rõ ràng và khích lệ tư duy học tập.
Vai trò người dùng: ${role}.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `${systemPrompt}\n\nCâu hỏi: ${message}`,
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
        console.warn("⚠️ Gemini API returned error, falling back to Education Knowledge Engine:", geminiErr.message);
      }
    }

    // Comprehensive Fallback / Offline Educator Response
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