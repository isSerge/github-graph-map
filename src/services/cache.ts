const CACHE_DURATION = 2 * 60 * 60 * 1000; // 2 hours

interface CacheEntry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getFromCache = (key: string): any | null => {
  const entry = cache.get(key);
  if (!entry) return null;
  // Invalidate if the entry is older than CACHE_DURATION
  if (Date.now() - entry.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  return entry.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setCache = (key: string, data: any): void => {
  cache.set(key, { data, timestamp: Date.now() });
};

export const generateCacheKey = (
  query: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables: Record<string, any>
): string => {
  return JSON.stringify({ query, variables });
};