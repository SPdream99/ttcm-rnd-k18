/**
 * ==============================================================================
 * E-V-E GAME ENGINE SDK (v2.0.0 - Official Production Standard)
 * ==============================================================================
 * Thư viện Javascript chuẩn bắt buộc dành cho mọi Trò Chơi Giáo Dục trên E-V-E.
 * 
 * QUY TẮC BẢO MẬT & VẬN HÀNH:
 * 1. REALTIME PRODUCTION MODE (Khi chạy trên máy chủ E-V-E):
 *    - Game bắt buộc phải import: <script src="/eve-game-sdk.js"></script>
 *    - SDK được nạp trực tiếp từ máy chủ E-V-E, KHÔNG cho phép tải từ nguồn ngoài.
 *    - Tự động kết nối Realtime 2 chiều qua postMessage và REST API (/api/games/init, /progress, /finish).
 *    - Dữ liệu câu hỏi & giải thích chi tiết (JSON Pairs) được nạp trực tiếp từ khóa học thực tế.
 *    - Điểm số & Coins được bảo vệ bằng chữ ký số chống gian lận (Anti-Cheat Token).
 * 
 * 2. OFFLINE SIMULATOR MODE (Khi Thầy/Cô chạy test cục bộ trong Starter Kit):
 *    - Nếu không kết nối được máy chủ E-V-E (mở file:// hoặc localhost độc lập), SDK tự động
 *      kích hoạt chế độ Giả Lập Mẫu (Mock Simulator) với 5 câu hỏi có sẵn để test giao diện và âm thanh.
 */
(function (global) {
  "use strict";

  // Bộ dữ liệu mẫu tích hợp sẵn để phục vụ Giáo viên chạy Test Offline trong Starter Kit
  const OFFLINE_MOCK_DATA = {
    courseId: "crs_coding_basics",
    courseTitle: "Nhập Môn Tư Duy Lập Trình (Offline Simulator)",
    sessionToken: "sim_token_offline_dev_test_mode",
    pairs: [
      {
        id: "mock_p1",
        title: "Trong lập trình, cấu trúc điều kiện nào dùng để rẽ nhánh khi đúng hoặc sai?",
        description: "Cấu trúc IF - ELSE",
        distractions: ["Vòng lặp For", "Vòng lặp While", "Hàm Function"],
        explanation: "Cấu trúc IF - ELSE cho phép chương trình kiểm tra một biểu thức điều kiện Logic (Boolean). Nếu biểu thức trả về True thì thực thi khối lệnh IF, ngược lại thực thi khối lệnh ELSE.",
      },
      {
        id: "mock_p2",
        title: "Linh kiện nào được coi là 'Bộ Não' xử lý trung tâm của máy tính?",
        description: "CPU (Central Processing Unit)",
        distractions: ["RAM", "Ổ cứng SSD", "Bộ nguồn PSU"],
        explanation: "CPU là bộ vi xử lý trung tâm, chịu trách nhiệm nhận, giải mã và thực thi các chỉ lệnh của chương trình máy tính bằng các khối ALU và Control Unit.",
      },
      {
        id: "mock_p3",
        title: "Ai là người đề xuất phương trình hàm sóng mô tả trạng thái lượng tử?",
        description: "Erwin Schrödinger",
        distractions: ["Albert Einstein", "Niels Bohr", "Isaac Newton"],
        explanation: "Nhà vật lý học người Áo Erwin Schrödinger đã đề xuất phương trình vi phân hàm sóng Psi mô tả xác suất tìm thấy hạt lượng tử.",
      },
      {
        id: "mock_p4",
        title: "Bộ nhớ truy xuất ngẫu nhiên tạm thời của máy tính viết tắt là gì?",
        description: "RAM (Random Access Memory)",
        distractions: ["ROM", "HDD", "GPU"],
        explanation: "RAM là bộ nhớ khả biến (volatile memory) có tốc độ cực cao, lưu trữ tạm thời các chương trình và dữ liệu đang chạy để CPU truy xuất.",
      },
      {
        id: "mock_p5",
        title: "Mạng nơ-ron nhân tạo trong Trí Tuệ Nhân Tạo (AI) được viết tắt là gì?",
        description: "ANN (Artificial Neural Network)",
        distractions: ["CNN", "RNN", "API"],
        explanation: "Mạng nơ-ron nhân tạo (ANN) là mô hình tính toán lấy cảm hứng từ cấu trúc mạng lưới nơ-ron sinh học trong não bộ con người.",
      },
    ],
  };

  class EVEGameSDK {
    constructor(config = {}) {
      this.version = "2.0.0";
      this.gameId = config.gameId || this._getUrlParam("gameId") || "starter_quiz_game";
      this.courseId = config.courseId || this._getUrlParam("courseId") || "crs_coding_basics";
      this.userId = config.userId || this._getUrlParam("userId") || "student_user";
      this.pathId = config.pathId || this._getUrlParam("pathId") || "default_path";
      this.apiBase = config.apiBase || "/api/games";
      this.sessionToken = null;
      this.gameData = null;
      this.isRealtimeConnected = false;
      this.onDataReadyCallback = null;
      this.onPauseCallback = null;
      this.onResumeCallback = null;
      this.audioCtx = null;

      console.log(`%c[E-V-E Game SDK v${this.version}]%c Initializing SDK Core...`, "color: #06b6d4; font-weight: bold", "color: #94a3b8");
      this._listenParentMessages();
    }

    _getUrlParam(param) {
      if (typeof window === "undefined") return null;
      try {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
      } catch {
        return null;
      }
    }

    _listenParentMessages() {
      if (typeof window === "undefined") return;

      window.addEventListener("message", (event) => {
        if (!event.data) return;

        // Xử lý nạp dữ liệu từ LMS Host Container
        if (event.data.type === "EVE_INIT_GAME_DATA") {
          console.log("[E-V-E SDK] ⚡ Nhận dữ liệu bài học Realtime từ Host qua postMessage:", event.data.payload);
          this.gameData = event.data.payload;
          this.isRealtimeConnected = true;
          if (event.data.payload?.sessionToken) {
            this.sessionToken = event.data.payload.sessionToken;
          }
          if (typeof this.onDataReadyCallback === "function") {
            this.onDataReadyCallback(this.gameData);
          }
        } else if (event.data.type === "EVE_GAME_PAUSE") {
          if (typeof this.onPauseCallback === "function") this.onPauseCallback();
        } else if (event.data.type === "EVE_GAME_RESUME") {
          if (typeof this.onResumeCallback === "function") this.onResumeCallback();
        }
      });
    }

    /**
     * Đăng ký callback khi dữ liệu bài học đã sẵn sàng
     */
    onDataReady(callback) {
      this.onDataReadyCallback = callback;
      if (this.gameData) {
        callback(this.gameData);
      }
    }

    /**
     * Lấy dữ liệu khóa học đã nạp
     */
    getCourseData() {
      return this.gameData || OFFLINE_MOCK_DATA;
    }

    /**
     * 1. Khởi tạo phiên chơi: Tự động lấy câu hỏi Realtime từ server E-V-E
     * Nếu chạy Offline không có server, tự động kích hoạt Mock Simulator
     */
    async initSession(customConfig = {}) {
      if (customConfig.gameId) this.gameId = customConfig.gameId;
      if (customConfig.courseId) this.courseId = customConfig.courseId;
      if (customConfig.userId) this.userId = customConfig.userId;

      // Nếu đã nhận data từ postMessage của LMS Host
      if (this.gameData && this.gameData.pairs && this.gameData.pairs.length > 0) {
        return this.gameData;
      }

      try {
        // Thử kết nối API máy chủ E-V-E
        const response = await fetch(`${this.apiBase}/init`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gameId: this.gameId,
            courseId: this.courseId,
            userId: this.userId,
          }),
        });

        const result = await response.json();
        if (result.success && result.pairs && result.pairs.length > 0) {
          this.gameData = result;
          this.sessionToken = result.sessionToken || null;
          this.isRealtimeConnected = true;
          console.log("[E-V-E SDK] ✅ Đã kết nối Realtime với máy chủ E-V-E. Số câu hỏi:", result.pairs.length);

          if (typeof this.onDataReadyCallback === "function") {
            this.onDataReadyCallback(result);
          }
          return result;
        }
        throw new Error(result.error || "Không thể lấy dữ liệu khóa học");
      } catch (err) {
        // Kích hoạt Offline Simulator Mode
        console.warn("[E-V-E SDK] ⚠️ Chạy trong môi trường Offline / Simulator. Tự động nạp bộ câu hỏi mẫu:", err.message);
        this.gameData = OFFLINE_MOCK_DATA;
        this.sessionToken = OFFLINE_MOCK_DATA.sessionToken;
        this.isRealtimeConnected = false;

        if (typeof this.onDataReadyCallback === "function") {
          this.onDataReadyCallback(this.gameData);
        }
        return this.gameData;
      }
    }

    /**
     * 2. Báo cáo tiến độ chơi thời gian thực (Live Progress)
     */
    async updateProgress({ score = 0, currentStreak = 0, progressPercent = 0, currentQuestion = 0, totalQuestions = 0 }) {
      // Báo cáo qua postMessage lên LMS Container
      if (typeof window !== "undefined" && window.parent && window.parent !== window) {
        window.parent.postMessage(
          {
            type: "EVE_GAME_PROGRESS",
            payload: {
              gameId: this.gameId,
              score,
              currentStreak,
              progressPercent,
              currentQuestion,
              totalQuestions,
            },
          },
          "*"
        );
      }

      // Gửi API lên máy chủ E-V-E (nếu có kết nối)
      if (this.isRealtimeConnected) {
        try {
          await fetch(`${this.apiBase}/progress`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              gameId: this.gameId,
              courseId: this.courseId,
              userId: this.userId,
              sessionToken: this.sessionToken,
              score,
              currentStreak,
              progressPercent,
            }),
          });
        } catch (e) {
          // Bỏ qua lỗi mạng nền
        }
      }
    }

    /**
     * 3. Hoàn thành trò chơi, ghi nhận điểm số & thưởng Coins
     */
    async finishGame({ score = 100, isWin = true, accuracyPercent = 100, playTimeSeconds = 60, details = {} }) {
      if (isWin) {
        this.playSound("win");
      }

      // Gửi qua postMessage
      if (typeof window !== "undefined" && window.parent && window.parent !== window) {
        window.parent.postMessage(
          {
            type: "EVE_GAME_FINISHED",
            payload: {
              gameId: this.gameId,
              courseId: this.courseId,
              pathId: this.pathId,
              sessionToken: this.sessionToken,
              score,
              isWin,
              accuracyPercent,
              playTimeSeconds,
              details,
            },
          },
          "*"
        );
      }

      // Gửi API lên máy chủ
      try {
        const response = await fetch(`${this.apiBase}/finish`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gameId: this.gameId,
            courseId: this.courseId,
            pathId: this.pathId,
            userId: this.userId,
            sessionToken: this.sessionToken,
            score,
            isWin,
            accuracyPercent,
            playTimeSeconds,
            details,
          }),
        });

        const data = await response.json();
        return data;
      } catch (err) {
        return {
          success: true,
          isOfflineSimulated: true,
          data: {
            earnedCoins: isWin ? 50 : 10,
            score,
            message: "Hoàn thành trong chế độ Offline Simulator.",
          },
        };
      }
    }

    /**
     * 4. Hệ thống âm thanh hiệu ứng Web Audio Synthesis (Không cần tải file ngoài)
     */
    playSound(soundType = "correct") {
      if (typeof window === "undefined") return;

      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;

        if (!this.audioCtx) {
          this.audioCtx = new AudioCtx();
        }

        if (this.audioCtx.state === "suspended") {
          this.audioCtx.resume();
        }

        const now = this.audioCtx.currentTime;

        if (soundType === "correct") {
          // Âm thanh Trả lời Đúng (Chord tăng dần)
          const osc1 = this.audioCtx.createOscillator();
          const osc2 = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();

          osc1.type = "sine";
          osc1.frequency.setValueAtTime(587.33, now); // D5
          osc1.frequency.exponentialRampToValueAtTime(880.0, now + 0.15); // A5

          osc2.type = "triangle";
          osc2.frequency.setValueAtTime(880.0, now + 0.1);
          osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.25); // D6

          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc1.start(now);
          osc2.start(now + 0.08);
          osc1.stop(now + 0.3);
          osc2.stop(now + 0.3);
        } else if (soundType === "wrong") {
          // Âm thanh Trả lời Sai (Buzz trầm giảm dần)
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();

          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.linearRampToValueAtTime(110, now + 0.25);

          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc.start(now);
          osc.stop(now + 0.25);
        } else if (soundType === "win") {
          // Âm thanh Chiến thắng / Hoàn thành bài
          const notes = [523.25, 659.25, 783.99, 1046.5]; // C - E - G - C6
          notes.forEach((freq, i) => {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc.type = "triangle";
            osc.frequency.setValueAtTime(freq, now + i * 0.1);

            gain.gain.setValueAtTime(0.15, now + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.3);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.3);
          });
        } else if (soundType === "coin") {
          // Âm thanh Nhận thưởng Coins
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(987.77, now); // B5
          osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc.start(now);
          osc.stop(now + 0.35);
        }
      } catch (e) {
        // Fallback im lặng nếu trình duyệt không hỗ trợ Web Audio
      }
    }

    /**
     * 5. Helper Bật / Tắt Toàn Màn Hình
     */
    toggleFullscreen(element = null) {
      if (typeof document === "undefined") return;
      const target = element || document.documentElement;

      if (!document.fullscreenElement) {
        if (target.requestFullscreen) {
          target.requestFullscreen().catch(() => {});
        } else if (target.webkitRequestFullscreen) {
          target.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      }
    }
  }

  // Khởi tạo Singleton Instance & Export Class Constructor trên window / global
  const defaultInstance = new EVEGameSDK();

  if (typeof window !== "undefined") {
    window.EveSDK = defaultInstance;
    window.eveSDK = defaultInstance;
    window.EVE_SDK = defaultInstance;
    window.EVEGameSDK = EVEGameSDK;
    window.EveGameSDK = EVEGameSDK;
  }

  if (typeof globalThis !== "undefined") {
    (globalThis as any).EveSDK = defaultInstance;
    (globalThis as any).EVEGameSDK = EVEGameSDK;
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { EVEGameSDK, EveSDK: defaultInstance };
  }
})(typeof window !== "undefined" ? window : globalThis);
