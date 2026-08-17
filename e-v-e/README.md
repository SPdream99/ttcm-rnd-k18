# E-V-E — Frontend & Backend Application (`e-v-e/`)

Thư mục chứa toàn bộ mã nguồn ứng dụng web E-V-E (Next.js 16).

---

## Hướng dẫn khởi chạy nhanh

### 1. Cài đặt thư viện
```bash
npm install
```

### 2. Cấu hình biến môi trường
Tạo file `.env.local` theo mẫu `.env.local.example`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="1234567890"
NEXT_PUBLIC_FIREBASE_APP_ID="1:1234567890:web:abcdef"
FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
GEMINI_API_KEY="AIzaSy..."
```

### 3. Khởi tạo dữ liệu Firestore (nếu cần)
```bash
node scripts/reset_firestore.mjs
node scripts/initDatabase.mjs
node scripts/fill_data.mjs
```

### 4. Khởi chạy Development Server
```bash
npm run dev
```
Mở trình duyệt tại: `http://localhost:3000`

### 5. Build & Chạy Production
```bash
npm run build
npm run start
```

---

## Cấu trúc thư mục

```text
e-v-e/
├── app/                  # Next.js 16 App Router (routes /student, /teacher, /admin, /api/...)
├── components/           # UI components dùng chung (Sidebar, Navbar, Modals, Toast, Map, AITutorFloatingWidget...)
├── context/              # React Contexts (AuthContext, AudioContext)
├── core/                 # Định nghĩa Domain Entities, Ports và Use Cases theo Clean Architecture
├── hooks/                # Custom Hooks (useAuthAdapter, useFirestoreLive)
├── infrastructure/       # Adapter kết nối Firestore và Repositories
├── lib/                  # Tiện ích bảo mật, mã hóa API Key, lưu trữ chat AI, ngữ cảnh trang, 2FA, Anti-Cheat
├── public/               # Tài nguyên tĩnh, âm thanh, hình ảnh, icons
├── scripts/              # Bộ 3 scripts quản trị Firestore Database (reset_firestore.mjs, initDatabase.mjs, fill_data.mjs)
└── firestore.rules       # Quy tắc bảo mật Cloud Firestore
```

---

## Ứng dụng Trí Tuệ Nhân Tạo (AI Integration)

Ứng dụng tích hợp Google Gemini AI với cơ chế bảo mật khóa cục bộ (Local Storage):
- **AI Tutor Học Sinh:** Giải đáp thắc mắc bài học, hỗ trợ giải toán & lập trình 24/7, tự động nhận diện ngữ cảnh trang hiện tại và lưu trữ trí nhớ cuộc hội thoại xuyên suốt.
- **Trợ Giảng Giáo Viên:** Tự động sinh câu hỏi trắc nghiệm JSON Pairs, gợi ý thiết kế lộ trình học tập và hướng dẫn tích hợp Game SDK.
- **Widget Thu Nhỏ (Mini Popup):** Hiển thị hỗ trợ ở tất cả các trang kèm công tắc Bật/Tắt Trí Nhớ và làm mới hội thoại.
- **Bảo Mật:** Khóa API Key được mã hóa và chỉ lưu trữ trên thiết bị cục bộ của người dùng, tự động xóa sạch khi đăng xuất.

---

## Sơ Đồ Cơ Sở Dữ Liệu (Firestore Database Schema / ERD)

![Sơ Đồ Cơ Sở Dữ Liệu Firestore E-V-E](/docs/firestore_database_schema.png)

---

## Đóng Góp & Hỗ Trợ Phát Triển Bởi Trí Tuệ Nhân Tạo (AI)

Dự án được phát triển với sự hỗ trợ và đóng góp toàn diện của Trí Tuệ Nhân Tạo (AI Pair Programming & Google Gemini AI) trong việc thiết kế kiến trúc, phát triển tính năng, tối ưu hiệu năng và kiểm thử tự động.

---

Chi tiết tài liệu đồ án và thông tin nhóm xem tại [README.md gốc](../README.md).
