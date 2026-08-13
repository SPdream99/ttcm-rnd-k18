/**
 * E-V-E Anti-Cheat & Secure Score Validation Engine
 * Bảo vệ hệ thống khỏi Cheat Engine, thao túng bộ nhớ và chỉnh sửa điểm số phía client.
 */

export interface GameSessionPayload {
  sessionId: string;
  gameId: string;
  courseId: string;
  userId: string;
  startTime: number;
  maxScore: number;
  minPlayTimeSeconds: number;
}

const SERVER_SECRET_SALT = "eve_anticheat_secure_salt_2026";

/**
 * 1. Tạo session token bảo mật có chữ ký khi khởi tạo màn chơi
 */
export function generateGameSessionToken(payload: Omit<GameSessionPayload, "sessionId" | "startTime">): {
  sessionToken: string;
  sessionId: string;
  startTime: number;
} {
  const startTime = Date.now();
  const sessionId = `ses_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const fullPayload: GameSessionPayload = {
    ...payload,
    sessionId,
    startTime,
  };

  // Base64 encode JSON payload
  const rawString = JSON.stringify(fullPayload);
  const encodedPayload = Buffer.from(rawString).toString("base64url");

  // Simple deterministic signature
  const signature = simpleHash(`${encodedPayload}_${SERVER_SECRET_SALT}`);
  const sessionToken = `${encodedPayload}.${signature}`;

  return { sessionToken, sessionId, startTime };
}

/**
 * 2. Xác thực session token và kiểm tra điểm số có hợp lệ hay bị can thiệp
 */
export function validateGameScore(
  sessionToken: string | undefined,
  reportedScore: number,
  clientPlayTimeSeconds: number = 0
): {
  isValid: boolean;
  sanitizedScore: number;
  earnedCoins: number;
  reason?: string;
} {
  // If no token, apply strict fallback limit
  if (!sessionToken) {
    const sanitized = Math.min(Math.max(0, reportedScore), 100);
    return {
      isValid: true,
      sanitizedScore: sanitized,
      earnedCoins: Math.floor(sanitized * 0.4),
      reason: "No session token - capped to default max",
    };
  }

  try {
    const [encodedPayload, signature] = sessionToken.split(".");
    if (!encodedPayload || !signature) {
      return { isValid: false, sanitizedScore: 0, earnedCoins: 0, reason: "Invalid token format" };
    }

    const expectedSig = simpleHash(`${encodedPayload}_${SERVER_SECRET_SALT}`);
    if (signature !== expectedSig) {
      return { isValid: false, sanitizedScore: 0, earnedCoins: 0, reason: "Signature mismatch (Tampered token)" };
    }

    const decodedString = Buffer.from(encodedPayload, "base64url").toString("utf-8");
    const session: GameSessionPayload = JSON.parse(decodedString);

    const now = Date.now();
    const actualElapsedSeconds = (now - session.startTime) / 1000;

    // Anti-speedhack / instant finish check
    if (actualElapsedSeconds < session.minPlayTimeSeconds && clientPlayTimeSeconds < session.minPlayTimeSeconds) {
      return {
        isValid: false,
        sanitizedScore: 0,
        earnedCoins: 0,
        reason: "Instant completion detected (Speedhack/Cheat Engine)",
      };
    }

    // Anti-score manipulation check: Score cannot exceed max allowed score
    if (reportedScore > session.maxScore) {
      console.warn(`[Anti-Cheat Warning] Reported score ${reportedScore} exceeded max ${session.maxScore}. Capping score.`);
    }

    const sanitizedScore = Math.min(Math.max(0, reportedScore), session.maxScore);

    // Calculate fair coin reward (max 60 coins per game session)
    const earnedCoins = Math.min(60, Math.max(10, Math.floor(sanitizedScore * 0.5)));

    return {
      isValid: true,
      sanitizedScore,
      earnedCoins,
    };
  } catch (err: any) {
    return { isValid: false, sanitizedScore: 0, earnedCoins: 0, reason: err.message };
  }
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}
