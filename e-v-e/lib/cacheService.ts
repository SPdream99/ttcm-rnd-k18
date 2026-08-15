/**
 * E-V-E CACHE SERVICE & REVALIDATION ENGINE
 * Quản lý bộ nhớ đệm (Memory, SessionStorage, LocalStorage) và cơ chế xóa cache thông minh.
 */

type CacheEntry<T> = {
  data: T;
  timestamp: number;
  ttlMs: number;
};

class CacheService {
  private memoryCache = new Map<string, CacheEntry<any>>();
  private subscribers = new Map<string, Set<(data: any) => void>>();
  private cleanupInterval: any = null;

  constructor() {
    if (this.isBrowser()) {
      // Tự động dọn dẹp cache hết hạn mỗi 2 phút
      this.cleanupInterval = setInterval(() => {
        this.purgeExpired();
      }, 120000);

      // Dọn dẹp khi người dùng quay lại tab trình duyệt
      window.addEventListener("focus", () => {
        this.purgeExpired();
      });
    }
  }

  private isBrowser(): boolean {
    return typeof window !== "undefined";
  }

  /**
   * Quét và dọn sạch các mục cache đã hết hạn (TTL)
   */
  purgeExpired(): void {
    const now = Date.now();
    for (const [key, entry] of Array.from(this.memoryCache.entries())) {
      if (now - entry.timestamp > entry.ttlMs) {
        this.memoryCache.delete(key);
        if (this.isBrowser()) {
          try {
            sessionStorage.removeItem(`eve_cache_${key}`);
          } catch {}
        }
      }
    }
  }

  /**
   * Lưu cache vào Memory và SessionStorage
   */
  set<T>(key: string, data: T, ttlMs: number = 60000): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttlMs,
    };

    this.memoryCache.set(key, entry);

    if (this.isBrowser()) {
      try {
        sessionStorage.setItem(`eve_cache_${key}`, JSON.stringify(entry));
      } catch {
        // Bỏ qua lỗi quota
      }
    }

    // Thông báo cho các listeners
    const listeners = this.subscribers.get(key);
    if (listeners) {
      listeners.forEach((listener) => listener(data));
    }
  }

  /**
   * Lấy dữ liệu đã cache nếu còn hạn
   */
  get<T>(key: string): { data: T; isStale: boolean } | null {
    let entry: CacheEntry<T> | undefined = this.memoryCache.get(key);

    if (!entry && this.isBrowser()) {
      try {
        const stored = sessionStorage.getItem(`eve_cache_${key}`);
        if (stored) {
          entry = JSON.parse(stored) as CacheEntry<T>;
          this.memoryCache.set(key, entry);
        }
      } catch {
        entry = undefined;
      }
    }

    if (!entry) return null;

    const age = Date.now() - entry.timestamp;
    const isStale = age > entry.ttlMs;

    return { data: entry.data, isStale };
  }

  /**
   * Stale-While-Revalidate: Trả về cache ngay và ngầm tải dữ liệu mới nếu stale.
   */
  async getOrFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: { ttlMs?: number; forceRefresh?: boolean } = {}
  ): Promise<T> {
    const { ttlMs = 60000, forceRefresh = false } = options;

    if (!forceRefresh) {
      const cached = this.get<T>(key);
      if (cached) {
        if (cached.isStale) {
          fetcher()
            .then((fresh) => this.set(key, fresh, ttlMs))
            .catch(() => {});
        }
        return cached.data;
      }
    }

    const freshData = await fetcher();
    this.set(key, freshData, ttlMs);
    return freshData;
  }

  /**
   * Đăng ký lắng nghe cập nhật cache
   */
  subscribe<T>(key: string, callback: (data: T) => void): () => void {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }

    this.subscribers.get(key)!.add(callback);

    return () => {
      const listeners = this.subscribers.get(key);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.subscribers.delete(key);
        }
      }
    };
  }

  /**
   * Xóa cache theo key hoặc regex pattern
   */
  invalidate(keyOrPattern: string | RegExp): void {
    if (typeof keyOrPattern === "string") {
      this.memoryCache.delete(keyOrPattern);
      if (this.isBrowser()) {
        sessionStorage.removeItem(`eve_cache_${keyOrPattern}`);
      }
    } else {
      for (const k of Array.from(this.memoryCache.keys())) {
        if (keyOrPattern.test(k)) {
          this.memoryCache.delete(k);
          if (this.isBrowser()) {
            sessionStorage.removeItem(`eve_cache_${k}`);
          }
        }
      }
    }
  }

  /**
   * Xóa toàn bộ cache trong phiên
   */
  invalidateAll(): void {
    this.memoryCache.clear();
    if (this.isBrowser()) {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const k = sessionStorage.key(i);
          if (k && k.startsWith("eve_cache_")) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach((k) => sessionStorage.removeItem(k));
      } catch {}
    }
  }

  /**
   * Xóa sạch toàn diện bộ nhớ cache (Session, Local Cache, Temp Data)
   * Đồng thời phát Event cho toàn bộ ứng dụng cập nhật lại tức thì.
   */
  clearFullAppCache(preserveAuth: boolean = true): void {
    this.invalidateAll();

    if (this.isBrowser()) {
      try {
        // Xóa các key cache trong localStorage nhưng giữ lại Auth Token / API Key nếu cần
        const preserved: Record<string, string | null> = {};
        if (preserveAuth) {
          preserved["eve_auth_user"] = localStorage.getItem("eve_auth_user");
          preserved["eve_user"] = localStorage.getItem("eve_user");
          preserved["eve_gemini_api_key"] = localStorage.getItem("eve_gemini_api_key");
          preserved["eve_2fa_pending_secret"] = localStorage.getItem("eve_2fa_pending_secret");
        }

        const localKeysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith("eve_cache_") || key.startsWith("eve_uploaded_"))) {
            localKeysToRemove.push(key);
          }
        }
        localKeysToRemove.forEach((k) => localStorage.removeItem(k));

        if (preserveAuth) {
          Object.entries(preserved).forEach(([k, v]) => {
            if (v !== null) localStorage.setItem(k, v);
          });
        }

        // Bắn tín hiệu đồng bộ qua window event
        window.dispatchEvent(new Event("eve_cache_cleared"));
        window.dispatchEvent(new Event("eve_games_updated"));
        window.dispatchEvent(new Event("storage"));
      } catch (err) {
        console.warn("Lỗi khi dọn dẹp localStorage:", err);
      }
    }
  }
}

export const cacheService = new CacheService();
