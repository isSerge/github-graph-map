import { useEffect, useState } from "react";
import { ActiveContributor } from "../types";
import { getActiveContributors } from "../services/github";

export const useActiveContributors = (): {
  contributors: ActiveContributor[];
  loading: boolean;
  error: string | null;
} => {
  const [contributors, setContributors] = useState<ActiveContributor[]>([]);
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
      .catch(() => setError("Failed to fetch active contributors"))
      .finally(() => setLoading(false));
  }, []);

  return { contributors, loading, error };
};