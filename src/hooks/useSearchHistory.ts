import { useState, useEffect } from "react";

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
      console.error("Failed to save search history", err);
    }
  }, [searchHistory]);

  // Adds a new query to the history only if it's not already present.
  const addSearchQuery = (query: string) => {
    setSearchHistory((prev) =>
      prev.includes(query) ? prev : [query, ...prev]
    );
  };

  // Optionally, provide a function to clear the history.
  const clearSearchHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (err) {
      console.error("Failed to clear search history", err);
    }
  };

  return { searchHistory, addSearchQuery, clearSearchHistory, setSearchHistory };
}