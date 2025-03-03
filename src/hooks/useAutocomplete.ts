import { useQuery } from "react-query";
import { searchRepositories, searchUsers } from "../services/github";
import { useDebounce } from "./useDebounce";
import { extractGitHubPath } from "../utils/stringUtils";

export interface Suggestion {
  id: string;
  label: string;
  type: "repo" | "user";
}

export function useAutocomplete(query: string) {
  const normalizedQuery = extractGitHubPath(query) || query;
  const debouncedQuery = useDebounce(normalizedQuery, 300);

  const { data, isFetching, error } = useQuery(
    ["autocomplete", debouncedQuery],
    async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) return [];
      if (debouncedQuery.includes("/")) {
        const repos = await searchRepositories(debouncedQuery);
        return repos.map((repo) => ({
          id: repo.id,
          label: repo.nameWithOwner,
          type: "repo" as const,
        }));
      } else {
        const users = await searchUsers(debouncedQuery);
        return users.map((user) => ({
          id: user.id,
          label: user.login,
          type: "user" as const,
        }));
      }
    },
    {
      enabled: Boolean(debouncedQuery && debouncedQuery.length >= 2),
    }
  );

  return { suggestions: data || [], isFetching, error };
}