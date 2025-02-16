import { useState, useEffect } from "react";
import { searchRepositories, searchUsers } from "../services/github";

export interface Suggestion {
  id: string;
  label: string;
  type: "repo" | "user";
}

export function useAutocomplete(query: string): {
  suggestions: Suggestion[];
  isLoading: boolean;
} {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        let suggestionsData: Suggestion[] = [];
        if (query.includes("/")) {
          const repos = await searchRepositories(query);
          suggestionsData = repos.map((repo) => ({
            id: repo.id,
            label: repo.nameWithOwner,
            type: "repo",
          }));
        } else {
          const users = await searchUsers(query);
          suggestionsData = users.map((user) => ({
            id: user.id,
            label: user.login,
            type: "user",
          }));
        }
        setSuggestions(suggestionsData);
      } catch (error) {
        console.error("Error fetching suggestions", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return { suggestions, isLoading };
}