/**
 * E-V-E Game Engine SDK (v2.0.0)
 * Self-contained SDK for E-V-E Game Integration
 */
(function (global) {
  class EVEGameSDK {
    constructor(config = {}) {
      this.version = "2.0.0";
      this.gameId = config.gameId || this._getUrlParam("gameId") || "boss_battle_quiz";
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

    onDataReady(callback) {
      this.onDataReadyCallback = callback;
      if (this.gameData) {
        callback(this.gameData);
      }
    }

    getCourseData() {
      return this.gameData;
    }

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

    async updateProgress({ score = 0, currentStreak = 0, progressPercent = 0, currentQuestion = 0, totalQuestions = 0 }) {
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

    async finishGame({ score = 100, isWin = true, accuracyPercent = 100, playTimeSeconds = 60, details = {} }) {
      if (isWin) {
        this.playSound("win");
      }

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

        if (type === "correct" || type === "hit") {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "triangle";
          osc.frequency.setValueAtTime(520, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
          osc.start(now);
          osc.stop(now + 0.25);
        } else if (type === "wrong" || type === "damage") {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.linearRampToValueAtTime(80, now + 0.3);
          gain.gain.setValueAtTime(0.35, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
          osc.start(now);
          osc.stop(now + 0.35);
        } else if (type === "dodge") {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "sine";
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.exponentialRampToValueAtTime(1200, now + 0.2);
          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
          osc.start(now);
          osc.stop(now + 0.2);
        } else if (type === "slash") {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "sine";
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);
          gain.gain.setValueAtTime(0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
          osc.start(now);
          osc.stop(now + 0.18);
        } else if (type === "boss_attack") {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(120, now);
          osc.frequency.linearRampToValueAtTime(40, now + 0.5);
          gain.gain.setValueAtTime(0.5, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
          osc.start(now);
          osc.stop(now + 0.5);
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
        console.warn("[E-V-E SDK v2] Sound synthesis error:", e);
      }
    }
  }

  global.EVEGameSDK = EVEGameSDK;
  if (typeof window !== "undefined") {
    window.EveSDK = new EVEGameSDK();
  }
})(typeof window !== "undefined" ? window : this);
