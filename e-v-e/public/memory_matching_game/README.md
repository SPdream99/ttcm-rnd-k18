# E-V-E Memory Matching Game Template (Production Ready)

Đây là mẫu minigame **Thẻ Bài Lật Hình / Ghép Cặp Khái Niệm & Trí Nhớ** đã tích hợp sẵn chuẩn **E-V-E Game SDK v2.0**.

## 1. Cấu Trúc Gói Minigame
- `index.html`: Giao diện chính, HUD thời gian, điểm số, combo multiplier, lưới thẻ bài 3D và màn hình chiến thắng.
- `style.css`: Hiệu ứng lật thẻ 3D xoay chiều, hiệu ứng ánh sáng Neon, animation rung lắc khi ghép sai.
- `game.js`: Logic xáo trộn thẻ (Fisher-Yates Shuffle), kiểm tra ghép đôi, âm thanh Web Audio API và kết nối E-V-E SDK.
- `eve-game-sdk.js`: Bộ thư viện giao tiếp chuẩn giữa Game Engine và hệ thống E-V-E.

## 2. Hướng Dẫn Tải Lên Dành Cho Giáo Viên
1. Tải về file `memory_matching_game.zip`.
2. Đăng nhập tài khoản **Giáo Viên** trên hệ thống E-V-E.
3. Truy cập mục **Trung Tâm Tải Lên (Upload Center)** tại: `/teacher/upload-center`.
4. Điền thông tin game:
   - **Tên Game**: `Thẻ Bài Trí Nhớ & Khái Niệm (Memory Matching)`
   - **Mã Game (ID)**: `memory_matching_game`
   - **Danh Mục**: `Khoa Học Tự Nhiên & Tin Học`
   - **Tệp Game Engine (.zip)**: Chọn file `memory_matching_game.zip`.
5. Nhấn **Gửi Duyệt Game**. Game sẽ được tải lên và sẵn sàng phân phối cho học sinh trong các lộ trình bài học!
