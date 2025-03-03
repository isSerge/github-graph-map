import { useQuery } from "react-query";
import { getContributorDetails } from "../services/github";

export function useContributorDetails(login: string) {
  return useQuery(
    ["contributorDetails", login],
    () => getContributorDetails(login),
    {
      enabled: Boolean(login),
      staleTime: 2 * 60 * 60 * 1000, // 2 hours
    }
  );
}