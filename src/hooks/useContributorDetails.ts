import { useState, useEffect } from "react";
import { ContributorDetails } from "../types/contributorTypes";
import { getContributorDetails } from "../services/github";
import { handleError } from "../utils/errorUtils";

export function useContributorDetails(login: string) {
    const [fetching, setFetching] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [contributorDetails, setContributorDetails] = useState<ContributorDetails | null>(null);
  
    useEffect(() => {
      if (!login) return;
      const controller = new AbortController();
  
      (async () => {
        setFetching(true);
        setError(null);
        setContributorDetails(null);
        try {
            const response = await getContributorDetails(login, controller.signal);
            setContributorDetails(response);
        } catch (error) {
          handleError("useGraph", error);
          if (error instanceof Error && error.name === "AbortError") return;
          setError("Failed to fetch data. Please check the input.");
        } finally {
          setFetching(false);
        }
      })();
  
      return () => controller.abort();
    }, [login]);
  
    return { fetching, error, contributorDetails };
}