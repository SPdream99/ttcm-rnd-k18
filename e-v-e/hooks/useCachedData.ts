"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { cacheService } from "@/lib/cacheService";

export interface UseCachedDataOptions {
  ttlMs?: number;
  enabled?: boolean;
}

export function useCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: UseCachedDataOptions = {}
) {
  const { ttlMs = 60000, enabled = true } = options;

  const [data, setData] = useState<T | null>(() => {
    const cached = cacheService.get<T>(key);
    return cached ? cached.data : null;
  });

  const [loading, setLoading] = useState<boolean>(() => {
    const cached = cacheService.get<T>(key);
    return !cached;
  });

  const [error, setError] = useState<Error | null>(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const executeFetch = useCallback(
    async (forceRefresh = false) => {
      if (!enabled) return;

      try {
        if (!forceRefresh) {
          const cached = cacheService.get<T>(key);
          if (cached) {
            setData(cached.data);
            setLoading(false);

            if (!cached.isStale) {
              return;
            }
          }
        } else {
          setLoading(true);
        }

        const freshData = await fetcherRef.current();
        cacheService.set(key, freshData, ttlMs);
        setData(freshData);
        setError(null);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [key, enabled, ttlMs]
  );

  useEffect(() => {
    executeFetch();

    // Subscribe to external cache updates on this key
    const unsubscribe = cacheService.subscribe<T>(key, (updatedData) => {
      setData(updatedData);
    });

    return () => {
      unsubscribe();
    };
  }, [key, executeFetch]);

  const refresh = useCallback(() => {
    return executeFetch(true);
  }, [executeFetch]);

  return {
    data,
    loading,
    error,
    refresh,
  };
}
