import { useQuery } from "react-query";
import { getExploreContributors } from "../services/github";

export const useExploreContributors = () => {
  return useQuery(
    "activeContributors", 
    async () => {
      const data = await getExploreContributors();
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