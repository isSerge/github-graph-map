/* eslint-disable @typescript-eslint/no-explicit-any */
const CACHE_DURATION = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
const CACHE_PREFIX = "graphql_cache_";

interface CacheEntry {
  data: any;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry>();

// First, try to retrieve from localStorage, then fall back to in-memory.
export const getFromCache = (key: string): any | null => {
  // Try local storage first.
  const localItem = localStorage.getItem(CACHE_PREFIX + key);
  if (localItem) {
    try {
      const entry: CacheEntry = JSON.parse(localItem);
      if (Date.now() - entry.timestamp <= CACHE_DURATION) {
        return entry.data;
      } else {
        localStorage.removeItem(CACHE_PREFIX + key);
      }
    } catch {
      localStorage.removeItem(CACHE_PREFIX + key);
    }
  }

  // Fall back to in-memory cache.
  const memoryEntry = memoryCache.get(key);
  if (memoryEntry && Date.now() - memoryEntry.timestamp <= CACHE_DURATION) {
    return memoryEntry.data;
  } else if (memoryEntry) {
    memoryCache.delete(key);
  }

  return null;
};

export const setCache = (key: string, data: any): void => {
  const entry: CacheEntry = { data, timestamp: Date.now() };
  // Update both local storage and in-memory cache.
  localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  memoryCache.set(key, entry);
};

export const generateCacheKey = (query: string, variables: Record<string, any>): string => {
  return JSON.stringify({ query, variables });
};