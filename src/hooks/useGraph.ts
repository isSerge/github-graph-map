import { useState, useEffect } from "react";
import {
  getRepoContributorsWithContributedRepos,
  getRepository,
  getUserContributedRepos,
} from "../services/github";
import {
  NetworkLink,
  RepoData,
  ContributorsWithRepos,
  RepoNode,
  ContributorNode,
  EitherNode,
} from "../types";

// Helper: Create graph in repository mode.
function createRepoGraph(
  contributors: ContributorsWithRepos[],
  selectedRepo: RepoData
) {
  const nodesMap = new Map<string, RepoNode | ContributorNode>();
  const linksMap = new Map<string, NetworkLink>();

  // Central repository node: use full name as node name.
  const centralRepo: RepoNode = {
    ...selectedRepo,
    id: selectedRepo.name,
    type: "repo",
    name: `${selectedRepo.owner.login}/${selectedRepo.name}`,
  };
  nodesMap.set(centralRepo.id, centralRepo);

  contributors.forEach((contributor) => {
    const contributorId = contributor.login;
    if (!nodesMap.has(contributorId)) {
      nodesMap.set(contributorId, {
        id: contributorId,
        name: contributorId,
        type: "contributor",
      });
    }
    const repoToContributorKey = `${centralRepo.id}-${contributorId}`;
    if (!linksMap.has(repoToContributorKey)) {
      linksMap.set(repoToContributorKey, {
        source: centralRepo.id,
        target: contributorId,
        distance: 100,
      });
    }
    // For each repo the contributor worked on:
    contributor.contributedRepos.forEach((repo) => {
      const repoNode: RepoNode = {
        ...repo,
        id: repo.name,
        type: "repo",
        name: `${repo.owner.login}/${repo.name}`,
      };
      if (!nodesMap.has(repoNode.id)) {
        nodesMap.set(repoNode.id, repoNode);
      }
      const contributorToRepoKey = `${contributorId}-${repoNode.id}`;
      if (!linksMap.has(contributorToRepoKey)) {
        linksMap.set(contributorToRepoKey, {
          source: contributorId,
          target: repoNode.id,
          distance: 20,
        });
      }
    });
  });

  return { nodes: Array.from(nodesMap.values()), links: Array.from(linksMap.values()) };
}

// Helper: Create graph in user mode.
function createUserGraph(repos: RepoData[], username: string) {
  const nodesMap = new Map<string, EitherNode>();
  const linksMap = new Map<string, NetworkLink>();

  // Central user node.
  const userNode: ContributorNode = {
    id: username,
    name: username,
    type: "contributor",
  };
  nodesMap.set(username, userNode);

  repos.forEach((repo) => {
    const repoNode: RepoNode = {
      ...repo,
      id: repo.name,
      type: "repo",
      name: `${repo.owner.login}/${repo.name}`,
    };
    nodesMap.set(repoNode.id, repoNode);
    linksMap.set(`${username}-${repoNode.id}`, {
      source: username,
      target: repoNode.id,
      distance: 100,
    });
  });

  return { nodes: Array.from(nodesMap.values()), links: Array.from(linksMap.values()) };
}

// Helper: Fetch graph data when input is in repository mode.
async function fetchRepoGraph(input: string) {
  const [owner, name] = input.split("/");
  if (!owner || !name) {
    throw new Error("Please enter a valid repository in the format 'owner/repo'.");
  }
  const { repository } = await getRepository(owner, name);
  const contributors = await getRepoContributorsWithContributedRepos(owner, name);
  // Our central repo node will have a name like "owner/repo"
  const selectedEntity: RepoNode = {
    ...repository,
    id: repository.name,
    type: "repo",
    name: `${owner}/${name}`,
  };
  const graph = createRepoGraph(contributors, repository);
  return { selectedEntity, graph };
}

// Helper: Fetch graph data when input is in user mode.
async function fetchUserGraph(username: string) {
  const repos = await getUserContributedRepos(username);
  const graph = createUserGraph(repos, username);
  // Create a central user node.
  const selectedEntity: ContributorNode = {
    id: username,
    name: username,
    type: "contributor",
  };
  return { selectedEntity, graph };
}

export function useGraph(input: string) {
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [graphData, setGraphData] = useState<{ nodes: EitherNode[]; links: NetworkLink[] } | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<EitherNode | null>(null);

  useEffect(() => {
    if (!input) return;
    const timer = setTimeout(() => {
      (async () => {
        setFetching(true);
        setError(null);
        setGraphData(null);
        try {
          if (input.includes("/")) {
            const { selectedEntity, graph } = await fetchRepoGraph(input);
            setSelectedEntity(selectedEntity);
            setGraphData(graph);
          } else {
            const { selectedEntity, graph } = await fetchUserGraph(input);
            setSelectedEntity(selectedEntity);
            setGraphData(graph);
          }
        } catch (err) {
          console.error(err);
          setError("Failed to fetch data. Please check the input.");
          setSelectedEntity(null);
          setGraphData(null);
        } finally {
          setFetching(false);
        }
      })();
    }, 500);
    return () => clearTimeout(timer);
  }, [input]);

  return { fetching, error, graphData, selectedEntity };
}