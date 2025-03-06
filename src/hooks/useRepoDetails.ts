import { useQuery } from "react-query";
import { getRepositoryDetails } from "../services/github";

export function useRepoDetails(nameWithOwner: string, timePeriod: number) {
  const [owner, name] = nameWithOwner.split("/");
  return useQuery(
    ["repoDetails", nameWithOwner],
    () => getRepositoryDetails(owner, name, timePeriod),
    {
      enabled: Boolean(nameWithOwner),
    }
  );
}