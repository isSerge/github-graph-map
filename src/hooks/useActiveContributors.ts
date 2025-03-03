import { useEffect, useState } from "react";
import { ExploreContributor } from "../types";
import { getActiveContributors } from "../services/github";
import { handleError } from "../utils/errorUtils";

export const useActiveContributors = (): {
  contributors: ExploreContributor[];
  loading: boolean;
  error: string | null;
} => {
  const [contributors, setContributors] = useState<ExploreContributor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getActiveContributors()
      .then((data) => {
        const contributors = data
        .filter((contributor) => contributor.login && contributor.avatarUrl)
        .map((contributor) => ({
            ...contributor,
            type: "contributor" as const,
            name: contributor.login,
            id: contributor.login,
        }));
        setContributors(contributors);
    })
      .catch((error) => {
        handleError("useActiveContributors", error);
        if (error.name === "AbortError") return;
        setError("Failed to fetch active contributors")
      })
      .finally(() => setLoading(false));
  }, []);

  return { contributors, loading, error };
};