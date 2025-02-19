import { useEffect, useState } from "react";
import { ContributorNode } from "../types";
import { getActiveContributors } from "../services/github";

export const useActiveContributors = (): {
  contributors: ContributorNode[];
  loading: boolean;
  error: string | null;
} => {
  const [contributors, setContributors] = useState<ContributorNode[]>([]);
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