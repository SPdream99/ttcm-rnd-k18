# 🎮 HƯỚNG DẪN TÍCH HỢP GAME ENGINE & BỘ REST API DÀNH CHO GIÁO VIÊN (E-V-E PLATFORM)

Tài liệu này hướng dẫn cách kết nối bất kỳ Game Engine nào (HTML5 / Canvas / Phaser / Unity WebGL / React) với hệ thống **E-V-E** để tự động nhận dữ liệu câu hỏi (JSON Pairs), báo cáo tiến độ thời gian thực, cập nhật điểm số, thưởng Coins và mở khóa các bài học trên **Lộ Trình Học Tập (Learning Path)**.

---

## 1. Cơ Chế Hoạt Động (Architecture)

E-V-E hỗ trợ 2 phương thức giao tiếp song song:
1. **REST API Direct Call**: Gọi trực tiếp các endpoint HTTP POST từ mã nguồn game.
2. **`window.postMessage` / SDK Wrapper**: Nhúng game trong thẻ `<iframe>`, hệ thống E-V-E tự động gửi dữ liệu và lắng nghe sự kiện hoàn thành.

---

## 2. Các REST API Endpoints

### 🔹 API 1: Khởi Tạo & Nhận Dữ Liệu Câu Hỏi
- **URL**: `POST /api/games/init`
- **Mục đích**: Lấy danh sách các cặp câu hỏi (JSON Pairs) của khóa học mà học sinh đang chơi.
- **Request Body**:
  ```json
  {
    "gameId": "game_card_match_vr",
    "courseId": "crs_coding_basics",
    "userId": "usr_student_001"
  }
  ```
- **Response Success (200)**:
  ```json
  {
    "success": true,
    "gameId": "game_card_match_vr",
    "courseId": "crs_coding_basics",
    "courseTitle": "Nhập Môn Tư Duy Lập Trình & Thuật Toán",
    "totalPairs": 3,
    "pairs": [
      {
        "id": "p1",
        "title": "Cấu trúc điều kiện nào dùng để rẽ nhánh khi đúng hoặc sai?",
        "description": "Cấu trúc IF - ELSE",
        "explanation": "Cấu trúc IF - ELSE cho phép chương trình kiểm tra biểu thức điều kiện Logic.",
        "distractions": ["Vòng lặp For", "Vòng lặp While", "Hàm Function"]
      }
    ],
    "targetScore": 100
  }
  ```

---

### 🔹 API 2: Cập Nhật Tiến Độ Thời Gian Thực (Live Progress)
- **URL**: `POST /api/games/progress`
- **Mục đích**: Cập nhật điểm số tạm thời, chuỗi combo liên tiếp (streak) và phần trăm hoàn thành màn chơi.
- **Request Body**:
  ```json
  {
    "gameId": "game_card_match_vr",
    "courseId": "crs_coding_basics",
    "userId": "usr_student_001",
    "score": 60,
    "currentStreak": 3,
    "progressPercent": 66
  }
  ```

---

### 🔹 API 3: Hoàn Thành Màn Chơi, Thưởng Coins & Mở Khóa Lộ Trình
- **URL**: `POST /api/games/finish`
- **Mục đích**: Ghi nhận kết quả chung cuộc, tính toán Coins thưởng, cập nhật tiến độ `x/y trò` của bài học trên Lộ trình học tập và mở khóa bài học tiếp theo nếu hoàn thành đủ.
- **Request Body**:
  ```json
  {
    "gameId": "game_card_match_vr",
    "courseId": "crs_coding_basics",
    "pathId": "path_fullstack_gamification_2026",
    "userId": "usr_student_001",
    "score": 95,
    "isWin": true,
    "accuracyPercent": 100,
    "playTimeSeconds": 85
  }
  ```
- **Response Success (200)**:
  ```json
  {
    "success": true,
    "message": "Kết quả trò chơi đã được ghi nhận và cập nhật điểm lên hệ sinh thái E-V-E!",
    "data": {
      "finalScore": 95,
      "isWin": true,
      "earnedCoins": 48,
      "courseCompleted": true,
      "unlockedNextCourse": true,
      "timestamp": "2026-08-14T03:50:00.000Z"
    }
  }
  ```

---

## 3. Sử Dụng E-V-E Game SDK (Dành cho Game HTML5 / JS)

Chèn thư viện SDK vào file `index.html` của game:
```html
<script src="/eve-game-sdk.js"></script>
```

Sử dụng trong mã nguồn game:
```javascript
// Khởi tạo SDK
const eve = new EVEGameSDK({ gameId: "space_quiz_3d" });

// 1. Tải câu hỏi từ khóa học
const gameData = await eve.init();
console.log("Danh sách câu hỏi:", gameData.pairs);

// 2. Cập nhật khi người chơi trả lời đúng/sai
eve.updateProgress({
  score: 30,
  currentStreak: 2,
  progressPercent: 50
});

// 3. Khi học sinh hoàn thành toàn bộ câu hỏi
const result = await eve.finishGame({
  score: 100,
  isWin: true,
  accuracyPercent: 100,
  playTimeSeconds: 65
});

alert(`Bạn đã chiến thắng và nhận được +${result.data.earnedCoins} Coins!`);
```
