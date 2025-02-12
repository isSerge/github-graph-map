import { useState, useEffect } from "react";
import {
  getRepoContributorsWithContributedRepos,
  getRepository,
} from "../services/github";
import {
  NetworkLink,
  RepoData,
  ContributorsWithRepos,
  RepoNode,
  ContributorNode,
} from "../types";

function createGraph(
  contributors: ContributorsWithRepos[],
  selectedRepo: RepoData
) {
  const nodesMap = new Map<string, RepoNode | ContributorNode>();
  const linksMap = new Map<string, NetworkLink>();

  // Add the selected repository node
  nodesMap.set(selectedRepo.name, {
    ...selectedRepo,
    id: selectedRepo.name,
    type: "repo",
  });

  // For each contributor, add their node and create link from repo to contributor.
  contributors.forEach((contributor) => {
    const contributorId = contributor.login;
    if (!nodesMap.has(contributorId)) {
      nodesMap.set(contributorId, {
        id: contributorId,
        login: contributorId,
        type: "contributor",
      });
    }

    const repoToContributorKey = `${selectedRepo.name}-${contributorId}`;
    if (!linksMap.has(repoToContributorKey)) {
      linksMap.set(repoToContributorKey, {
        source: selectedRepo.name,
        target: contributorId,
        distance: 100,
      });
    }

    // For each repo the contributor worked on, add the node and link
    contributor.contributedRepos.forEach((repo) => {
      if (!nodesMap.has(repo.name)) {
        nodesMap.set(repo.name, {
          ...repo,
          id: repo.name,
          type: "repo",
        });
      }
      const contributorToRepoKey = `${contributorId}-${repo.name}`;
      if (!linksMap.has(contributorToRepoKey)) {
        linksMap.set(contributorToRepoKey, {
          source: contributorId,
          target: repo.name,
          distance: 20,
        });
      }
    });
  });

  return {
    nodes: Array.from(nodesMap.values()),
    links: Array.from(linksMap.values()),
  };
}

export function useGraph(repoInput: string) {
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ContributorsWithRepos[] | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<RepoData | null>(null);

  useEffect(() => {
    // Only attempt to fetch if repoInput contains a slash.
    if (!repoInput.includes("/")) return;

    const [owner, name] = repoInput.split("/");
    
    if (!owner || !name) {
      setError("Please enter a valid repository in the format 'owner/repo'.");
      return;
    }

    const timer = setTimeout(() => {
      (async () => {
        setFetching(true);
        setError(null);
        setData(null);
        try {
          const { repository } = await getRepository(owner, name);
          const response = await getRepoContributorsWithContributedRepos(owner, name);
          setSelectedRepo(repository);
          setData(response);
        } catch (err) {
          console.error(err);
          setError("Failed to fetch repository data. Please check the repo name.");
        } finally {
          setFetching(false);
        }
      })();
    }, 500);

    // Clear the timeout if repoInput changes before delay
    return () => clearTimeout(timer);
  }, [repoInput]);

  const graphData =
    data && selectedRepo ? createGraph(data, selectedRepo) : null;

  return { fetching, error, graphData, selectedRepo };
}