import { useEffect, useState } from "react";
import { getFreshRepositories } from "../services/github";
import { RepoNode } from "../types";

interface UseFreshReposResult {
  repos: RepoNode[];
  loading: boolean;
  error: string | null;
}

export const useFreshRepos = (): UseFreshReposResult => {
  const [repos, setRepos] = useState<RepoNode[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getFreshRepositories()
      .then((data) => {
        const repos = data.map((repo) => ({
            ...repo,
            id: repo.nameWithOwner,
            type: "repo" as const,
        }));
        setRepos(repos);
      })
      .catch(() => {
        setError("Failed to load repositories");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { repos, loading, error };
};