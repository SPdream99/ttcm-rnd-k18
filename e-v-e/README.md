# 🌌 E-V-E — Educational Virtual Ecosystem (Next.js Application)

Tài liệu kỹ thuật và hướng dẫn khởi chạy ứng dụng web **E-V-E** (thư mục `e-v-e/`).

🌐 **Trải nghiệm demo trực tiếp tại:** [https://ttcm-rnd-k18.vercel.app/](https://ttcm-rnd-k18.vercel.app/)

Vui lòng xem tài liệu tổng quan và hướng dẫn đồ án chi tiết tại [README.md gốc của dự án](../README.md).

---

## 🚀 Khởi Động Nhanh (Quick Start)

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
FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"..."}'
GEMINI_API_KEY="AIzaSy..."
```

### 3. Chạy Server Phát Triển (Development Server)
```bash
npm run dev
```
Truy cập: **`http://localhost:3000`**

### 4. Kiểm Tra & Biên Dịch Production (Build Test)
```bash
npm run build
npm run start
```

---

## 📂 Cấu Trúc Thư Mục Dự Án

- `app/`: Next.js 16 App Router (các route: `/student`, `/teacher`, `/admin`, `/game/MemoryMatchingGame`, `/api/tutor`, `/api/games`).
- `components/`: Thư viện giao diện tái sử dụng (Sidebar, Toast, LearningPathMap, GameCenterList, MemoryMatchingGame).
- `core/`: Kiến trúc Clean Architecture (Domain Entities, Ports, Use Cases).
- `infrastructure/`: Adapter kết nối cơ sở dữ liệu Firebase Firestore và Mock Repositories.
- `lib/`: Tiện ích bảo mật, mã hóa AI Key, xác thực 2FA OTP, chống gian lận Game.
- `public/`: Tài nguyên tĩnh, âm thanh, logo, và các gói minigame đóng gói sẵn (`memory_matching_game.zip`, `eve-game-sdk.js`).
- `scripts/`: Scripts khởi tạo database Firestore và tạo tài khoản mẫu.
