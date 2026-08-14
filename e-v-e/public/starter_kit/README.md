# 🎮 E-V-E Game Engine Starter Kit (v2.0.0)

Bộ mã nguồn mẫu chuẩn giúp Thầy/Cô và các Lập trình viên xây dựng minigame giáo dục tương thích 100% với nền tảng **E-V-E LMS Platform**.

---

## 📁 Cấu trúc thư mục

```
starter_kit/
├── index.html        # Giao diện HTML5 hiển thị câu hỏi, đáp án, giải thích
├── style.css         # CSS hiện đại phong cách Cyberpunk, responsive
├── game.js           # Logic game kết nối E-V-E SDK, xử lý câu hỏi & điểm
├── eve-game-sdk.js   # Thư viện E-V-E Game SDK v2.0
└── README.md         # Hướng dẫn sử dụng
```

---

## 🚀 3 Bước Chạy & Nộp Game Cho Giáo Viên

### Bước 1: Kiểm thử trực tiếp trên máy (Offline Testing)
* Nhấp đúp chuột vào file `index.html` (hoặc mở bằng VS Code Live Server).
* Trò chơi sẽ tự động nạp **5 câu hỏi mẫu (Fallback Pairs)** có sẵn trong `game.js` để Thầy/Cô trải nghiệm âm thanh, giao diện và luồng tính điểm.

### Bước 2: Tùy biến hoặc Phát triển Game của Thầy/Cô
* Thầy/Cô có thể sử dụng bất kỳ công nghệ web nào: **Canvas 2D**, **WebGL (Three.js)**, **Phaser**, **Pixi.js**, **React**, hoặc **HTML/JS thuần**.
* Chỉ cần giữ nguyên đoạn gọi SDK:
  ```js
  // 1. Nhận câu hỏi từ khóa học
  window.EveSDK.initSession({ gameId: "my_game", courseId: "crs_coding_basics" });

  // 2. Phát âm thanh
  window.EveSDK.playSound("correct");

  // 3. Báo cáo tiến độ
  window.EveSDK.updateProgress({ score: 100, currentStreak: 3 });

  // 4. Kết thúc và nộp điểm
  window.EveSDK.finishGame({ score: 100, isWin: true });
  ```

### Bước 3: Đóng gói và Tải lên hệ thống E-V-E
1. Chọn tất cả các file trong thư mục game của Thầy/Cô (`index.html`, `game.js`, `style.css`, `eve-game-sdk.js`).
2. Nén thành file định dạng `.zip` (Lưu ý: File `index.html` phải nằm ở thư mục gốc của file zip).
3. Truy cập **Trung Tâm Tải Lên (Teacher Upload Center)** trên website E-V-E:
   * Chọn loại nội dung: **Trò Chơi Giáo Dục (Game)**.
   * Tải file `.zip` lên để Ban Quản Trị phê duyệt.
