import { useState, useEffect } from "react";
import { RepoDetails } from "../types/repoTypes";
import { getRepositoryDetails } from "../services/github";
import { handleError } from "../utils/errorUtils";

export function useRepoDetails(nameWithOwner: string) {
    const [fetching, setFetching] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [repoDetails, setRepoDetails] = useState<RepoDetails | null>(null);
  
    useEffect(() => {
      if (!nameWithOwner) return;
      const controller = new AbortController();
  
      (async () => {
        setFetching(true);
        setError(null);
        setRepoDetails(null);
        try {
            const [ owner, name ] = nameWithOwner.split("/");
            const response = await getRepositoryDetails(owner, name, controller.signal);
            setRepoDetails(response);
        } catch (error) {
          handleError("useGraph", error);
          if (error instanceof Error && error.name === "AbortError") return;
          setError("Failed to fetch data. Please check the input.");
        } finally {
          setFetching(false);
        }
      })();
  
      return () => controller.abort();
    }, [nameWithOwner]);
  
    return { fetching, error, repoDetails };
}