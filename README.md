# 🌌 E-V-E — Educational Virtual Ecosystem

> **Hệ Sinh Thái Giáo Dục Trực Tuyến Tương Tác Tích Hợp AI Tutor & Game-Based Learning**  
> Đồ án tốt nghiệp / Nghiên cứu phát triển: **Lớp TTCM - RnD - K18**  
---

## 🌐 Trải Nghiệm Demo Trực Tiếp

Truy cập và trải nghiệm toàn bộ tính năng của hệ thống E-V-E trực tuyến tại:  
👉 **[https://ttcm-rnd-k18.vercel.app/](https://ttcm-rnd-k18.vercel.app/)**

### 🔑 Danh Sách Tài Khoản Thử Nghiệm (Demo Accounts):

| Vai Trò (Role) | Email Đăng Nhập | Mật Khẩu (Password) | Quyền Hạn Trải Nghiệm |
|:---|:---|:---:|:---|
| 🎓 **Học Sinh (Student)** | `dat@gmail.com` | `123456` | Học tập, nộp bài, làm bài tập, hỏi AI Tutor, chơi Minigame |
| 👨‍🏫 **Giáo Viên (Teacher)** | `dat1@gmail.com` | `123456` | Quản lý lớp học, sổ điểm, giao bài tập AI, Upload Game Engine |
| 🛡️ **Quản Trị Viên (Admin)** | `dat2@gmail.com` | `123456` | Kiểm duyệt game, phê duyệt lộ trình, quản lý người dùng |

---

## 📖 1. Giới Thiệu Dự Án

**E-V-E (Educational Virtual Ecosystem)** là nền tảng học tập trực tuyến thế hệ mới, kết hợp phương pháp sư phạm hiện đại với công nghệ **Trí Tuệ Nhân Tạo (AI)** và **Trò chơi hóa giáo dục (Gamification)**. Hệ thống mang đến trải nghiệm học tập đa chiều thông qua các lộ trình học tập tương tác, trợ lý AI Tutor thông minh, quản lý lớp học toàn diện và kho Game Engine giáo dục đạt chuẩn **E-V-E Game SDK v2.0**.

### 🌟 Tính Năng Nổi Bật
- 🤖 **E-V-E AI Tutor**: Trợ lý gia sư AI phân tích ngữ nghĩa, giải toán tự động, gợi ý lộ trình và hỗ trợ học tập cá nhân hóa 24/7.
- 🗺️ **Learning Path & Visual Map**: Bản đồ hành trình học tập trực quan kết nối chuỗi bài học và minigame.
- 🏫 **Class Hub (Học Sinh & Giáo Viên)**: Quản lý lớp học, sổ điểm GPA điện tử, giao và nộp bài tập trực tuyến, kho bài giảng đa phương tiện.
- 🎮 **E-V-E Game Engine SDK v2.0**: Bộ giao thức kết nối trò chơi HTML5/Canvas 2 chiều, chống gian lận (Anti-Cheat Token), cơ chế Combo Multiplier, âm thanh Synth Web Audio và minigame mẫu **Memory Matching Game** & **Boss Slayer Quiz**.
- 🛡️ **Bảo Mật & Xác Thực**: Xác thực Firebase Auth, hỗ trợ xác thực 2 lớp OTP (2FA), phân quyền Role-based Access Control (Student, Teacher, Admin).

---

## 👥 2. Thành Viên Thực Hiện

| STT | Họ và Tên | Vai trò | Nhiệm vụ chính |
|:---:|:---|:---:|:---|
| 1 | **Nguyễn Nhật Anh** | Trưởng nhóm | Kiến trúc hệ thống, Backend API, Game SDK, AI Tutor Engine, Bảo mật |
| 2 | **Nguyễn Thành Đạt** | Thành viên | Giao diện Class & Learning Path, Memory Matching Game, Dashboard |
| 3 | **Đàm Tuấn Nhiên** | Thành viên | Giao diện Landing Page, Quản lý tài nguyên & Báo cáo đồ án |

---

## 📁 3. Tài Liệu Đồ Án & Báo Cáo

- 📂 **Folder Tài Liệu Nhóm (Google Drive):** [https://drive.google.com/drive/folders/1clPPIeyvm3CkhCIhyYJAkFBPT7n_2v02](https://drive.google.com/drive/folders/1clPPIeyvm3CkhCIhyYJAkFBPT7n_2v02)
- 📊 **Báo Cáo Tiến Độ & Kế Hoạch (Google Sheets):** [https://docs.google.com/spreadsheets/d/1XVPI0MKJFvKDSKv91b8vD7zJRsw2_1AHGjsWmiVpclA/edit?usp=sharing](https://docs.google.com/spreadsheets/d/1XVPI0MKJFvKDSKv91b8vD7zJRsw2_1AHGjsWmiVpclA/edit?usp=sharing)

---

## 🛠️ 4. Công Nghệ Sử Dụng

- **Frontend**: [Next.js 16 (App Router)](https://nextjs.org), React 19, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend & Database**: Next.js Server Route Handlers, [Firebase Firestore](https://firebase.google.com), Firebase Admin SDK.
- **Authentication**: Firebase Authentication, 2FA OTP Service, Cookie Session Middleware.
- **AI Engine**: Google Gemini API, Custom NLP Reasoning, Computational Math Solver.
- **Game Engine**: E-V-E Game SDK v2.0, HTML5 Canvas, Web Audio API, 3D CSS Transforms.

---

## 🚀 5. Hướng Dẫn Cài Đặt Cục Bộ (Local Setup)

### Yêu Cầu Môi Trường (Prerequisites)
- [Node.js](https://nodejs.org) phiên bản **18.x** hoặc **20.x** trở lên.
- Trình quản lý gói: `npm` (khuyên dùng), `yarn` hoặc `pnpm`.
- Tài khoản [Firebase Console](https://console.firebase.google.com) đã kích hoạt Authentication & Firestore.

### Bước 1: Clone Mã Nguồn
```bash
git clone https://github.com/SPdream99/ttcm-rnd-k18.git
cd ttcm-rnd-k18/e-v-e
```

### Bước 2: Cài Đặt Dependencies
```bash
npm install
```

### Bước 3: Cấu Hình Biến Môi Trường (`.env.local`)
Tạo file `.env.local` bên trong thư mục `e-v-e/` theo mẫu [`.env.local.example`](file:///c:/Users/SPdream/OneDrive/Máy%20tính/MindX/TTCM%20-%20Teaching%20K18/ttcm-rnd-k18/e-v-e/.env.local.example):

```env
# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="1234567890"
NEXT_PUBLIC_FIREBASE_APP_ID="1:1234567890:web:abcdef"

# Firebase Admin SDK (Service Account Key dạng chuỗi JSON)
FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project-id","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk@your-project-id.iam.gserviceaccount.com"}'

# Gemini AI API Key (Dành cho AI Tutor)
GEMINI_API_KEY="AIzaSy..."

# Feature flags (Tùy chọn)
USE_MOCK_DB="false"
```

### Bước 4: Khởi Tạo Cơ Sở Dữ Liệu Mẫu (Database Seeding)
Chạy script để tạo sẵn danh mục khóa học, giáo viên và học sinh:
```bash
node scripts/initDatabase.mjs
```

### Bước 5: Khởi Động Development Server
```bash
npm run dev
```
Mở trình duyệt và truy cập: **`http://localhost:3000`**

---

## 🖥️ 6. Hướng Dẫn Sử Dụng Ứng Dụng

### 🎓 A. Dành Cho Học Sinh (Student Role)
1. **Đăng nhập / Đăng ký**: Truy cập `/login` hoặc `/register` (hỗ trợ bật 2FA bảo mật qua Email).
2. **Dashboard (`/student/dashboard`)**: Theo dõi tổng quan số giờ học, chuỗi ngày streak, GPA và huy hiệu thành tích.
3. **Lộ Trình Học Tập (`/student/learning-paths`)**: Khám phá các lộ trình chuyên sâu (*Vật lý lượng tử, Nhập môn AI, Lập trình Game...*), mở khóa từng chặng theo bản đồ tương tác.
4. **Lớp Học Của Tôi (`/student/classes`)**:
   - Quản lý các lớp học đang tham gia.
   - **Bài Tập (`/student/classes/assignments`)**: Xem hạn nộp bài, tải file bài nộp PDF/Word/ZIP lên hệ thống.
   - **Thành Viên (`/student/classes/members`)**: Nhắn tin trực tiếp với Giảng viên và bạn cùng lớp.
5. **Trợ Lý AI Tutor (`/student/ai-tutor`)**: Đặt câu hỏi, nhận lời giải chi tiết, phân tích code và học tập cá nhân hóa.
6. **Kho Minigame (`/student/games` hoặc `/game/MemoryMatchingGame`)**: Chơi game lật thẻ ghi nhớ, giải đố kiến thức và nhận thưởng E-V-E Coins.
7. **Cửa Hàng Đổi Thưởng (`/student/shop`)**: Dùng Coins đổi avatar, hiệu ứng và vật phẩm độc quyền.

### 👨‍🏫 B. Dành Cho Giáo Viên (Teacher Role)
1. **Quản Lý Lớp Học (`/teacher/classes`)**:
   - **Sĩ Số & Sổ Điểm (`/teacher/classes/students`)**: Theo dõi điểm GPA, tỷ lệ chuyên cần và nhắn tin hỗ trợ từng học sinh.
   - **Ngân Hàng Bài Tập (`/teacher/classes/assignments`)**: Tạo bài tập mới, kích hoạt AI chấm theo barem tự động.
   - **Kho Bài Giảng (`/teacher/classes/lectures`)**: Đăng video bài giảng và slide tài liệu học tập.
2. **Trung Tâm Tải Lên (`/teacher/upload-center`)**:
   - Soạn bài giảng và ghép khóa học thành **Lộ Trình Học Tập (Learning Path)** mới.
   - Tải lên gói **Game Engine (.ZIP)** tích hợp E-V-E SDK (như `memory_matching_game.zip`).
3. **Hướng Dẫn & Bộ Mẫu Game SDK (`/teacher/game-sdk-guide`)**:
   - Tải về các bộ mã nguồn mẫu: *Starter Kit (.ZIP)*, *Memory Matching Game (.ZIP)*, *Boss Slayer Quiz (.ZIP)*.
   - Xem tài liệu kết nối API `window.EVE_SDK.init()`, `submitAnswer()`, `finishSession()`.

### 🛡️ C. Dành Cho Quản Trị Viên (Admin Role)
1. **Kiểm Duyệt Nội Dung (`/admin/approvals`)**: Phê duyệt các Game Engine và Lộ trình do giáo viên đăng tải.
2. **Quản Lý Người Dùng (`/admin/users`)**: Điều chỉnh vai trò (Student / Teacher / Admin), khóa/mở tài khoản.

---

## 🌐 7. Hướng Dẫn Triển Khai Lên Production (Deploy)

### Cách 1: Triển Khai Lên Vercel (Khuyên Dùng)
1. Đẩy mã nguồn lên kho chứa GitHub.
2. Đăng nhập [Vercel](https://vercel.com) và chọn **Add New Project** → Chọn repository `ttcm-rnd-k18`.
3. Cấu hình Project:
   - **Root Directory**: Chọn thư mục `e-v-e`.
   - **Framework Preset**: `Next.js`.
   - **Build Command**: `next build` (mặc định).
   - **Output Directory**: `.next` (mặc định).
4. Cài đặt **Environment Variables**:
   - Thêm đầy đủ các biến môi trường từ file `.env.local` (`NEXT_PUBLIC_FIREBASE_*`, `FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY`, `GEMINI_API_KEY`).
5. Bấm **Deploy**. Vercel sẽ tự động build và cung cấp liên kết chạy ứng dụng trực tuyến.

### Cách 2: Triển Khai Quy Tắc Bảo Mật Firestore (Security Rules)
Để áp dụng toàn bộ quy tắc phân quyền chống can thiệp trái phép cơ sở dữ liệu:
```bash
# Cài đặt Firebase CLI nếu chưa có
npm install -g firebase-tools

# Đăng nhập và deploy Rules
firebase login
firebase deploy --only firestore:rules
```

### Cách 3: Build & Chạy Thử Production Tại Cục Bộ
```bash
cd e-v-e
npm run build
npm run start
```

---

## 📜 8. Bản Quyền & Giấy Phép

Đồ án thuộc bản quyền nghiên cứu của **Nhóm 1 — Lớp TTCM - RnD - K18**.  
Phát hành theo giấy phép [Creative Commons Attribution-NonCommercial 4.0 (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/).  
*Mọi hành vi sao chép, phân phối vì mục đích thương mại khi chưa có sự đồng ý bằng văn bản của nhóm phát triển đều bị nghiêm cấm.*
