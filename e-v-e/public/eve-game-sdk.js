/**
 * E-V-E Game Engine SDK (v1.0.0)
 * Thư viện Javascript chuẩn dành cho Giáo viên & Lập trình viên Game
 * Hỗ trợ giao tiếp 2 chiều giữa Game Engine (WebGL / HTML5 / Phaser / Canvas) và nền tảng E-V-E
 */
(function (global) {
  class EVEGameSDK {
    constructor(config = {}) {
      this.gameId = config.gameId || "eve_custom_game";
      this.courseId = config.courseId || this._getUrlParam("courseId") || "crs_quantum_101";
      this.userId = config.userId || this._getUrlParam("userId") || "student_user";
      this.pathId = config.pathId || this._getUrlParam("pathId") || "path_quantum_physics";
      this.apiBase = config.apiBase || "/api/games";
      this.gameData = null;

      this._listenParentMessages();
    }

    _getUrlParam(param) {
      if (typeof window === "undefined") return null;
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
    }

    _listenParentMessages() {
      if (typeof window === "undefined") return;
      window.addEventListener("message", (event) => {
        if (event.data && event.data.type === "EVE_INIT_GAME_DATA") {
          console.log("[E-V-E SDK] Received course data via postMessage:", event.data.payload);
          this.gameData = event.data.payload;
          if (typeof this.onDataReady === "function") {
            this.onDataReady(this.gameData);
          }
        }
      });
    }

    /**
     * 1. Khởi tạo và lấy danh sách các cặp câu hỏi (JSON Pairs) từ Khóa Học
     */
    async init() {
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
          return result;
        }
        throw new Error(result.error || "Failed to load game course data");
      } catch (err) {
        console.warn("[E-V-E SDK] Failed to fetch via REST API, using cached/postMessage data:", err);
        return this.gameData;
      }
    }

    /**
     * 2. Báo cáo tiến độ chơi thời gian thực (Real-time Progress)
     */
    async updateProgress({ score = 0, currentStreak = 0, progressPercent = 0 }) {
      try {
        // Gửi qua postMessage lên iframe cha
        if (window.parent && window.parent !== window) {
          window.parent.postMessage(
            {
              type: "EVE_GAME_PROGRESS",
              payload: { gameId: this.gameId, score, currentStreak, progressPercent },
            },
            "*"
          );
        }

        // Báo cáo qua REST API
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
        console.error("[E-V-E SDK] updateProgress error:", e);
      }
    }

    /**
     * 3. Báo cáo hoàn thành trò chơi, ghi nhận điểm số, thưởng coin & mở khóa lộ trình
     */
    async finishGame({ score = 100, isWin = true, accuracyPercent = 100, playTimeSeconds = 60 }) {
      // Gửi qua postMessage lên iframe cha
      if (window.parent && window.parent !== window) {
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
            },
          },
          "*"
        );
      }

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
          }),
        });
        return await response.json();
      } catch (e) {
        console.error("[E-V-E SDK] finishGame error:", e);
        return { success: false, error: e.message };
      }
    }
  }

  // Export to global scope
  global.EVEGameSDK = EVEGameSDK;
})(typeof window !== "undefined" ? window : this);
