export interface EveAuthSession {
  uid: string;
  id?: string;
  email: string;
  name?: string;
  fullName?: string;
  displayName?: string;
  role: "student" | "teacher" | "admin" | "school" | string;
  status?: "pending" | "active" | "banned" | string;
  coins?: number;
  profileDecorations?: string[];
  activeDecorations?: {
    avatarFrame?: string;
    badge?: string;
  };
}

export const AUTH_COOKIE_NAME = "eve_auth_user";

/**
 * Set the authentication cookie in the browser
 */
export function setAuthCookie(user: Partial<EveAuthSession>, rememberMe: boolean = true) {
  if (typeof document === "undefined") return;

  const cookiePayload: EveAuthSession = {
    uid: user.uid || user.id || "",
    id: user.id || user.uid || "",
    email: user.email || "",
    name: user.name || user.fullName || user.displayName || "User",
    fullName: user.fullName || user.name || user.displayName || "User",
    role: user.role || "student",
    status: user.status || "active",
    coins: Number(user.coins) || 0,
    profileDecorations: user.profileDecorations || [],
    activeDecorations: user.activeDecorations || {},
  };

  const cookieData = encodeURIComponent(JSON.stringify(cookiePayload));
  // 30 days for remember me, otherwise 7 days (or session duration)
  const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7;
  document.cookie = `${AUTH_COOKIE_NAME}=${cookieData}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

/**
 * Get the current user session from the cookie
 */
export function getAuthCookie(): EveAuthSession | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${AUTH_COOKIE_NAME}=`));

  if (!match) return null;

  try {
    const rawVal = match.substring(match.indexOf("=") + 1);
    return JSON.parse(decodeURIComponent(rawVal));
  } catch (err) {
    console.error("Error parsing auth cookie:", err);
    return null;
  }
}

/**
 * Remove the authentication cookie
 */
export function removeAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}
