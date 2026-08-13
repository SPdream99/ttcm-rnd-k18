/**
 * E-V-E Game Engine SDK (v2.0.0)
 * Thư viện Javascript chuẩn dành cho Giáo viên & Lập trình viên Game Giáo Dục
 * Hỗ trợ giao tiếp 2 chiều giữa Game Engine (WebGL / HTML5 / Phaser / Canvas / React) và nền tảng E-V-E
 *
 * Tính năng chính:
 * 1. Tự động nhận dữ liệu câu hỏi / kiến thức của khóa học (JSON Pairs).
 * 2. Báo cáo tiến độ thời gian thực & kết quả chơi kèm cơ chế bảo mật chống gian lận (Anti-Cheat Token).
 * 3. Hỗ trợ kích hoạt toàn màn hình (Fullscreen API helper) mượt mà trên mọi thiết bị.
 * 4. Tích hợp hệ thống âm thanh hiệu ứng (Web Audio sound synthesis cho Đúng/Sai/Chiến Thắng/Coins).
 * 5. Lấy bảng xếp hạng (Leaderboard) của riêng game trong bài học.
 */
(function (global) {
  class EVEGameSDK {
    constructor(config = {}) {
      this.version = "2.0.0";
      this.gameId = config.gameId || this._getUrlParam("gameId") || "game_space_quiz_3d";
      this.courseId = config.courseId || this._getUrlParam("courseId") || "crs_coding_basics";
      this.userId = config.userId || this._getUrlParam("userId") || "student_user";
      this.pathId = config.pathId || this._getUrlParam("pathId") || "default_path";
      this.apiBase = config.apiBase || "/api/games";
      this.sessionToken = null;
      this.gameData = null;
      this.onDataReadyCallback = null;
      this.onPauseCallback = null;
      this.onResumeCallback = null;
      this.audioCtx = null;

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

        if (event.data.type === "EVE_INIT_GAME_DATA") {
          console.log("[E-V-E SDK v2] Received course data via postMessage:", event.data.payload);
          this.gameData = event.data.payload;
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
     * Lấy dữ liệu khóa học đã cache
     */
    getCourseData() {
      return this.gameData;
    }

    /**
     * 1. Khởi tạo phiên chơi và lấy danh sách câu hỏi / bài học từ E-V-E
     */
    async initSession(customConfig = {}) {
      if (customConfig.gameId) this.gameId = customConfig.gameId;
      if (customConfig.courseId) this.courseId = customConfig.courseId;
      if (customConfig.userId) this.userId = customConfig.userId;

      try {
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
        if (result.success) {
          this.gameData = result;
          this.sessionToken = result.sessionToken || null;
          if (typeof this.onDataReadyCallback === "function") {
            this.onDataReadyCallback(result);
          }
          return result;
        }
        throw new Error(result.error || "Failed to load game course data");
      } catch (err) {
        console.warn("[E-V-E SDK v2] Fallback to embedded/cached course data:", err);
        return this.gameData;
      }
    }

    /**
     * 2. Báo cáo tiến độ chơi thời gian thực (Live Progress)
     */
    async updateProgress({ score = 0, currentStreak = 0, progressPercent = 0, currentQuestion = 0, totalQuestions = 0 }) {
      // 1. Gửi qua postMessage lên cửa sổ cha (nếu nhúng iframe)
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

      // 2. Báo cáo qua REST API
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
        console.error("[E-V-E SDK v2] updateProgress error:", e);
      }
    }

    /**
     * 3. Hoàn thành trò chơi, ghi nhận điểm số, thưởng Coins & mở khóa lộ trình
     */
    async finishGame({ score = 100, isWin = true, accuracyPercent = 100, playTimeSeconds = 60, details = {} }) {
      if (isWin) {
        this.playSound("win");
      }

      // 1. Gửi qua postMessage
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

      // 2. Gửi API lên máy chủ E-V-E
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
        return await response.json();
      } catch (e) {
        console.error("[E-V-E SDK v2] finishGame API error:", e);
        return { success: false, error: e.message };
      }
    }

    /**
     * 4. Bật / Tắt Toàn Màn Hình (Fullscreen Controller)
     */
    toggleFullscreen(element) {
      if (typeof document === "undefined") return false;
      const target = element || document.documentElement;

      if (!document.fullscreenElement) {
        if (target.requestFullscreen) {
          target.requestFullscreen().catch((err) => console.warn("Fullscreen request error:", err));
          return true;
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch((err) => console.warn("Exit fullscreen error:", err));
          return false;
        }
      }
      return false;
    }

    isFullscreen() {
      if (typeof document === "undefined") return false;
      return !!document.fullscreenElement;
    }

    /**
     * 5. Lấy bảng xếp hạng của riêng game này trong bài học
     */
    async getLeaderboard(params = {}) {
      const gId = params.gameId || this.gameId;
      const cId = params.courseId || this.courseId;
      try {
        const res = await fetch(`${this.apiBase}/leaderboard?gameId=${encodeURIComponent(gId)}&courseId=${encodeURIComponent(cId)}`);
        return await res.json();
      } catch (err) {
        console.error("[E-V-E SDK v2] getLeaderboard error:", err);
        return { success: false, rankings: [] };
      }
    }

    /**
     * 6. Phát âm thanh hiệu ứng bằng Web Audio API (không cần tải thêm file mp3)
     */
    playSound(type = "correct") {
      if (typeof window === "undefined") return;
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        if (!this.audioCtx) this.audioCtx = new AudioContext();

        const ctx = this.audioCtx;
        if (ctx.state === "suspended") {
          ctx.resume();
        }

        const now = ctx.currentTime;

        if (type === "correct") {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "sine";
          osc.frequency.setValueAtTime(587.33, now); // D5
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
          osc.start(now);
          osc.stop(now + 0.3);
        } else if (type === "wrong") {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.linearRampToValueAtTime(110, now + 0.25);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
          osc.start(now);
          osc.stop(now + 0.3);
        } else if (type === "win") {
          [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = "triangle";
            osc.frequency.setValueAtTime(freq, now + i * 0.1);
            gain.gain.setValueAtTime(0.25, now + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.4);
            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.4);
          });
        }
      } catch (e) {
        console.warn("[E-V-E SDK v2] Web Audio synthesis error:", e);
      }
    }
  }

  // Create global instance & class definition
  global.EVEGameSDK = EVEGameSDK;
  if (typeof window !== "undefined") {
    window.EveSDK = new EVEGameSDK();
  }
})(typeof window !== "undefined" ? window : this);
