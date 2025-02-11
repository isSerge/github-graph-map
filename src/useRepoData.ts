import { useState, useEffect } from "react";
import {
  getRepoContributorsWithContributedRepos,
  getRepository,
} from "./github";
import {
  NetworkLink,
  RepoData,
  ContributorsWithRepos,
  RepoNode,
  ContributorNode,
} from "./types";

const REPO_COLOR = "rgb(97, 205, 187)";
const SELECTED_REPO_COLOR = "rgb(255, 230, 0)";
const CONTRIBUTOR_COLOR = "#f47560";

function transformData(
  apiResponse: ContributorsWithRepos[],
  selectedRepo: RepoData
) {
  const nodesMap = new Map<string, RepoNode | ContributorNode>();
  const linksMap = new Map<string, NetworkLink>();

  // Add the selected repository node
  nodesMap.set(selectedRepo.name, {
    ...selectedRepo,
    id: selectedRepo.name,
    color: SELECTED_REPO_COLOR,
  });

  // For each contributor, add their node and create link from repo to contributor.
  apiResponse.forEach((contributor) => {
    const contributorId = contributor.login;
    if (!nodesMap.has(contributorId)) {
      nodesMap.set(contributorId, {
        id: contributorId,
        color: CONTRIBUTOR_COLOR,
        login: contributorId,
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
          color: REPO_COLOR,
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

export function useRepoData(repoInput: string) {
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ContributorsWithRepos[] | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<RepoData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Ensure input is in the form "owner/repo"
      if (!repoInput.includes("/")) return;
      const [owner, name] = repoInput.split("/");
      if (!owner || !name) {
        setError("Please enter a valid repository in the format 'owner/repo'.");
        return;
      }
      setFetching(true);
      setError(null);
      setData(null);
      try {
        const { repository } = await getRepository(owner, name);
        const response = await getRepoContributorsWithContributedRepos(owner, name);
        setSelectedRepo(repository);
        setData(response);
      } catch (e) {
        console.error(e);
        setError("Failed to fetch repository data. Please check the repo name.");
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [repoInput]);

  const graphData =
    data && selectedRepo ? transformData(data, selectedRepo) : null;

  return { fetching, error, graphData, selectedRepo };
}