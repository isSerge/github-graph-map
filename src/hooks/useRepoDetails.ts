import { useQuery } from "react-query";
// import { useState, useEffect } from "react";
// import { RepoDetails } from "../types/repoTypes";
// import { handleError } from "../utils/errorUtils";
import { getRepositoryDetails } from "../services/github";

export function useRepoDetails(nameWithOwner: string) {
  const [owner, name] = nameWithOwner.split("/");
  return useQuery(
    ["repoDetails", nameWithOwner],
    () => getRepositoryDetails(owner, name),
    {
      enabled: Boolean(nameWithOwner),
      staleTime: 2 * 60 * 60 * 1000, // 2 hours
    }
  );
}