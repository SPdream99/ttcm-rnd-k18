# E-V-E — Educational Virtual Ecosystem

Nền tảng học tập trực tuyến hỗ trợ trợ lý AI gia sư và tích hợp minigame giáo dục qua SDK tự phát triển.  
Dự án đồ án / nghiên cứu phát triển thuộc lớp **TTCM - RnD - K18**.

---

## Trải nghiệm Demo

- **Website Demo:** [https://ttcm-rnd-k18.vercel.app](https://ttcm-rnd-k18.vercel.app)
- **Thư mục tài liệu (Google Drive):** [Drive Folder](https://drive.google.com/drive/folders/1clPPIeyvm3CkhCIhyYJAkFBPT7n_2v02)
- **Kế hoạch & tiến độ (Google Sheets):** [Sheets Báo Cáo](https://docs.google.com/spreadsheets/d/1XVPI0MKJFvKDSKv91b8vD7zJRsw2_1AHGjsWmiVpclA/edit?usp=sharing)

### Tài khoản thử nghiệm

| Vai trò | Email | Mật khẩu | Chức năng chính có thể test |
|:---|:---|:---:|:---|
| **Học sinh (Student)** | `dat@gmail.com` | `123456` | Xem lộ trình, làm bài tập, hỏi AI Tutor, chơi minigame, đổi quà |
| **Giáo viên (Teacher)** | `dat1@gmail.com` | `123456` | Quản lý lớp, tạo bài tập, tải lên bài giảng & game engine |
| **Quản trị viên (Admin)** | `dat2@gmail.com` | `123456` | Quản lý người dùng, duyệt game engine và lộ trình |

> **Lưu ý:** Dự án phục vụ mục đích nghiên cứu và báo cáo đồ án, một số luồng tương tác và dữ liệu hiện là prototype / mock để minh họa tính năng.

---

## Thành viên nhóm

| STT | Họ và Tên | Vai trò | Phụ trách chính |
|:---:|:---|:---:|:---|
| 1 | **Nguyễn Nhật Anh** | Trưởng nhóm | System Architecture, Backend API, Game SDK, AI Tutor, Security |
| 2 | **Nguyễn Thành Đạt** | Thành viên | Giao diện Class & Learning Path, Memory Matching Game, Dashboard |
| 3 | **Đàm Tuấn Nhiên** | Thành viên | Giao diện Landing Page, quản lý tài nguyên và tổng hợp báo cáo |

---

## Tính năng chính

- **Lộ trình học tập tương tác (Learning Path):** Bản đồ bài học trực quan, mở khóa bài giảng theo tiến độ hoàn thành.
- **AI Tutor:** Trợ lý ảo tích hợp Google Gemini API hỗ trợ giải đáp thắc mắc, giải bài tập và gợi ý phương pháp học.
- **Quản lý lớp học (Class Hub):**
  - Dành cho học sinh: Theo dõi điểm, nộp bài trực tuyến, danh sách thành viên.
  - Dành cho giáo viên: Theo dõi sĩ số, tạo và chấm bài tập, đăng tải bài giảng.
- **E-V-E Game SDK & Minigames:** Bộ SDK kết nối game HTML5/Canvas với nền tảng (xác thực token chống gian lận, tính điểm combo, đồng bộ điểm số và thưởng E-V-E Coins).
- **Phân quyền & Bảo mật:** Xác thực người dùng qua Firebase Auth (hỗ trợ OTP 2FA), phân quyền theo Role (Student / Teacher / Admin).

---

## Ứng dụng Trí Tuệ Nhân Tạo (AI Integration)

Dự án **E-V-E** ứng dụng mô hình ngôn ngữ lớn **Google Gemini AI** nhằm tối ưu hóa trải nghiệm học tập và hỗ trợ công tác giảng dạy:

1. **Gia Sư Học Tập 24/7 (AI Tutor cho Học Sinh):**
   - Hỗ trợ học sinh giải đáp kiến thức lập trình, toán học, tư duy logic và hướng dẫn làm bài tập.
   - Định dạng phản hồi trực quan (Markdown, in đậm cú pháp, Code Snippets với nút sao chép nhanh).
   - Đưa ra các gợi ý học tập bám sát lộ trình và nội dung bài học.

2. **Trợ Giảng Sư Phạm Thông Minh (AI Assistant cho Giáo Viên):**
   - Tự động sinh ngân hàng câu hỏi trắc nghiệm / ghép cặp theo chủ đề bài giảng.
   - Hỗ trợ xây dựng khung chương trình và gợi ý cấu trúc bài giảng.
   - Hướng dẫn tích hợp mã nguồn Game SDK vào các minigame giáo dục.

3. **Bảo Mật & Quyền Riêng Tư (Local Device Storage):**
   - Cho phép người dùng linh hoạt cấu hình **Google Gemini API Key** cá nhân.
   - Khóa API được **mã hóa và chỉ lưu trữ cục bộ trên thiết bị/trình duyệt của người dùng** (Local Storage), hoàn toàn không được truyền tải hay lưu trữ trên máy chủ backend.

---

## Công nghệ sử dụng

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons
- **Backend & Database:** Next.js Route Handlers, Firebase Firestore, Firebase Admin SDK
- **Authentication:** Firebase Authentication, Cookie Session, OTP 2FA
- **AI Integration:** Google Gemini API
- **Game Module:** E-V-E Game SDK (Custom JavaScript Bridge), HTML5 Canvas, Web Audio API

---

## Hướng dẫn cài đặt và chạy trên máy cục bộ (Local Setup)

### Yêu cầu môi trường
- Node.js version 18.x hoặc 20.x trở lên
- Trình quản lý gói: `npm` (hoặc `yarn` / `pnpm`)
- Dự án Firebase đã bật Authentication và Cloud Firestore

### 1. Clone source code
```bash
git clone https://github.com/SPdream99/ttcm-rnd-k18.git
cd ttcm-rnd-k18/e-v-e
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình file môi trường
Tạo file `.env.local` trong thư mục `e-v-e/` (dựa theo file mẫu `.env.local.example`):

```env
# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"

# Firebase Admin SDK (JSON string hoặc Service Account credentials)
FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'

# Gemini API Key cho tính năng AI Tutor
GEMINI_API_KEY="your-gemini-api-key"

# Tùy chọn: Sử dụng Mock DB nếu không cấu hình Firebase
USE_MOCK_DB="false"
```

### 4. Khởi tạo dữ liệu mẫu (Seed Data)
```bash
node scripts/initDatabase.mjs
```

### 5. Chạy môi trường phát triển
```bash
npm run dev
```
Truy cập ứng dụng tại: `http://localhost:3000`

---

## Cấu trúc thư mục (`e-v-e/`)

```text
e-v-e/
├── app/                  # Next.js App Router (pages & API routes)
│   ├── (auth)/           # Routes đăng nhập, đăng ký, xác thực 2FA
│   ├── admin/            # Trang quản trị (duyệt game, quản lý user)
│   ├── api/              # API endpoints (AI tutor, Game SDK, Auth...)
│   ├── student/          # Dashboard, bài học, lớp học, AI tutor cho học sinh
│   └── teacher/          # Quản lý lớp, sổ điểm, upload tài nguyên cho giáo viên
├── components/           # Components UI dùng chung (Sidebar, Toast, Modals...)
├── core/                 # Clean Architecture (Entities, Ports, Use Cases)
├── infrastructure/       # Database Adapters (Firestore & Mock Repositories)
├── lib/                  # Helpers, bảo mật, Firebase config, Game SDK bridge
├── public/               # Static assets, âm thanh, icons, các gói game .zip
└── scripts/              # Script khởi tạo dữ liệu mẫu
```

---

## Sơ Đồ Cơ Sở Dữ Liệu (Firestore Database Schema / ERD)

![Sơ Đồ Cơ Sở Dữ Liệu Firestore E-V-E](docs/firestore_database_schema.png)

---

## Bản quyền

Dự án được thực hiện bởi **Nhóm 1 — Lớp TTCM - RnD - K18**.  
Sử dụng cho mục đích học tập và nghiên cứu.

