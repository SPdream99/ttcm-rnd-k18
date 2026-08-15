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

### 3. Khởi chạy Development Server
```bash
npm run dev
```
Mở trình duyệt tại: `http://localhost:3000`

### 4. Build & Chạy Production
```bash
npm run build
npm run start
```

---

## Cấu trúc thư mục

- `app/`: Next.js 16 App Router (routes `/student`, `/teacher`, `/admin`, `/game/...`, `/api/...`).
- `components/`: UI components dùng chung (Sidebar, Navbar, Modals, Toast, Map...).
- `core/`: Định nghĩa Domain Entities, Ports và Use Cases theo Clean Architecture.
- `infrastructure/`: Adapter kết nối Firestore và Mock Database.
- `lib/`: Tiện ích bảo mật, mã hóa, xác thực 2FA OTP, Game Token validator.
- `public/`: Tài nguyên tĩnh, âm thanh và các gói game đóng gói sẵn (`eve-game-sdk.js`, minigames).
- `scripts/`: Script khởi tạo cơ sở dữ liệu mẫu (`initDatabase.mjs`).

---

## Sơ Đồ Cơ Sở Dữ Liệu (Firestore Database Schema / ERD)

![Sơ Đồ Cơ Sở Dữ Liệu Firestore E-V-E](/docs/firestore_database_schema.png)

---

Chi tiết tài liệu đồ án và thông tin nhóm xem tại [README.md gốc](../README.md).

