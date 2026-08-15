type CacheEntry<T> = {
  data: T;
  timestamp: number;
  ttlMs: number;
};

class CacheService {
  private memoryCache = new Map<string, CacheEntry<any>>();
  private subscribers = new Map<string, Set<(data: any) => void>>();

  private isBrowser(): boolean {
    return typeof window !== "undefined";
  }

  /**
   * Set cache entry in Memory and SessionStorage
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
        // Ignore quota errors
      }
    }

    // Notify subscribers of new data
    const listeners = this.subscribers.get(key);
    if (listeners) {
      listeners.forEach((listener) => listener(data));
    }
  }

  /**
   * Get cached data if available and not expired
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
   * Stale-While-Revalidate pattern:
   * Returns cached data immediately if available, then fetches in background if stale.
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
        // If stale, revalidate in background without blocking caller
        if (cached.isStale) {
          fetcher()
            .then((fresh) => this.set(key, fresh, ttlMs))
            .catch(() => {});
        }
        return cached.data;
      }
    }

    // Fetch fresh data
    const freshData = await fetcher();
    this.set(key, freshData, ttlMs);
    return freshData;
  }

  /**
   * Subscribe to cache updates for a specific key
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
   * Invalidate cache matching key or regex
   */
  invalidate(keyOrPattern: string | RegExp): void {
    if (typeof keyOrPattern === "string") {
      this.memoryCache.delete(keyOrPattern);
      if (this.isBrowser()) {
        sessionStorage.removeItem(`eve_cache_${keyOrPattern}`);
      }
    } else {
      // Regex pattern
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
   * Invalidate all cached data
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
}

export const cacheService = new CacheService();
