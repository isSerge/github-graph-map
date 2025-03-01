import { handleError } from "../utils/errorUtils";

/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: pass duration as an argument for different queries
const DEFAULT_CACHE_DURATION = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
const CACHE_PREFIX = "graphql_cache_";

interface CacheEntry {
  data: any;
  timestamp: number; // when cache was set
  duration: number; // how long to keep the cache
}

const memoryCache = new Map<string, CacheEntry>();

// First, try to retrieve from localStorage, then fall back to in-memory.
export const getFromCache = (key: string): any | null => {
  // Try local storage first.
  const localItem = localStorage.getItem(CACHE_PREFIX + key);
  if (localItem) {
    try {
      const entry: CacheEntry = JSON.parse(localItem);
      if (Date.now() - entry.timestamp <= entry.duration) {
        return entry.data;
      } else {
        localStorage.removeItem(CACHE_PREFIX + key);
      }
    } catch (error) {
      handleError("getFromCache", error);
      localStorage.removeItem(CACHE_PREFIX + key);
    }
  }

  // Fall back to in-memory cache.
  const memoryEntry = memoryCache.get(key);
  if (memoryEntry && Date.now() - memoryEntry.timestamp <= memoryEntry.duration) {
    return memoryEntry.data;
  } else if (memoryEntry) {
    memoryCache.delete(key);
  }

  return null;
};

// Stores data in both localStorage and the in-memory cache.
// The caller can pass a custom duration; otherwise, it defaults to DEFAULT_CACHE_DURATION.
export const setCache = (key: string, data: any, duration: number = DEFAULT_CACHE_DURATION): void => {
  const entry: CacheEntry = { data, timestamp: Date.now(), duration };
  // Update both local storage and in-memory cache.
  localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  memoryCache.set(key, entry);
};

export const generateCacheKey = (query: string, variables?: Record<string, any>): string => {
  return JSON.stringify({ query, variables });
};

/**
 * A helper to wrap any asynchronous fetch function with caching.
 *
 * @param cacheKey - The key under which data is cached.
 * @param fetchFn - A function that returns a Promise for the data.
 * @param duration - Cache duration in milliseconds.
 * @returns The fetched (or cached) data.
 */
export async function fetchWithCache<T>(
  cacheKey: string,
  fetchFn: () => Promise<T>,
  duration: number = DEFAULT_CACHE_DURATION
): Promise<T> {
  const cachedData = getFromCache(cacheKey);
  if (cachedData !== null) {
    return cachedData;
  }
  const data = await fetchFn();
  setCache(cacheKey, data, duration);
  return data;
}