import { useState, useEffect } from "react";
import { searchRepositories, searchUsers } from "../services/github";
import { useDebounce } from "./useDebounce";
import { handleError } from "../utils/errorUtils";
import { extractGitHubPath } from "../utils/stringUtils";

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

  const normalizedQuery = extractGitHubPath(query) || query;

  const debouncedQuery = useDebounce(normalizedQuery, 300);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    (async () => {
      try {
        let suggestionsData: Suggestion[] = [];
        if (debouncedQuery.includes("/")) {
          const repos = await searchRepositories(debouncedQuery);
          suggestionsData = repos.map((repo) => ({
            id: repo.id,
            label: repo.nameWithOwner,
            type: "repo",
          }));
        } else {
          const users = await searchUsers(debouncedQuery);
          suggestionsData = users.map((user) => ({
            id: user.id,
            label: user.login,
            type: "user",
          }));
        }
        setSuggestions(suggestionsData);
      } catch (error) {
        handleError("useAutocomplete", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [debouncedQuery]);

  return { suggestions, isLoading };
}