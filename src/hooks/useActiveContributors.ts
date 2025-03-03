import { useQuery } from "react-query";
import { getActiveContributors } from "../services/github";

export const useActiveContributors = () => {
  return useQuery(
    "activeContributors", 
    async () => {
      const data = await getActiveContributors();
      return data
        .filter((contributor) => contributor.login && contributor.avatarUrl)
        .map((contributor) => ({
          ...contributor,
          type: "contributor" as const,
          name: contributor.login,
          id: contributor.login,
        }));
    }, 
    {
      staleTime: 2 * 60 * 60 * 1000, // 2 hours
    }
  );
};