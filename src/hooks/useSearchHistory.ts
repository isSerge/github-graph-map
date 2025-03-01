import { useState, useEffect, useCallback } from "react";
import { handleError } from "../utils/errorUtils";

const HISTORY_STORAGE_KEY = "searchHistory";

export function useSearchHistory(initialValue: string[] = []) {
  // Initialize search history from local storage.
  const getInitialHistory = (): string[] => {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  };

  const [searchHistory, setSearchHistory] = useState<string[]>(getInitialHistory);

  // Persist search history in local storage whenever it changes.
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(searchHistory));
    } catch (err) {
      handleError("useSearchHistory", err);
    }
  }, [searchHistory]);

  // Adds a new query to the history.
  // If the query already exists, remove it and then prepend it so that
  // the most recent query is always at the front.
  const addSearchQuery = useCallback((query: string) => {
    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item !== query);
      return [query, ...filtered];
    });
  }, []);

  // Optionally, provide a function to clear the history.
  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (err) {
      handleError("useSearchHistory", err);
    }
  }, []);

  return { searchHistory, addSearchQuery, clearSearchHistory, setSearchHistory };
}