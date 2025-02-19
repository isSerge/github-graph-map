import { useState, useEffect } from "react";
import {
  getRepoContributorsWithContributedRepos,
  getRepository,
  getContributorData,
} from "../services/github";
import {
  NetworkLink,
  RepoBase,
  RepoNode,
  ContributorNode,
  EitherNode,
  ContributorBase,
} from "../types";

// Helper: Create graph in repository mode.
function createRepoGraph(
  contributors: (ContributorBase & { contributionCount: number })[],
  centralRepo: RepoNode,
) {
  const nodesMap = new Map<string, RepoNode | ContributorNode>();
  const linksMap = new Map<string, NetworkLink>();

  nodesMap.set(centralRepo.id, centralRepo);

  contributors.forEach((contributor) => {
    const contributorId = contributor.login;
    if (!nodesMap.has(contributorId)) {
      nodesMap.set(contributorId, {
        ...contributor,
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
        thickness: contributor.contributionCount,
      });
    }
    // For each repo the contributor worked on:
    contributor.repositoriesContributedTo.nodes.forEach((repo) => {
      const repoNode: RepoNode = {
        ...repo,
        id: repo.nameWithOwner,
        type: "repo",
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
function createUserGraph(repos: RepoBase[], contributor: ContributorNode) {
  const nodesMap = new Map<string, EitherNode>();
  const linksMap = new Map<string, NetworkLink>();

  // Central user node.
  const userNode: ContributorNode = {
    ...contributor,
    id: contributor.name,
    name: contributor.name,
    type: "contributor",
  };
  nodesMap.set(contributor.name, userNode);

  repos.forEach((repo) => {
    const repoNode: RepoNode = {
      ...repo,
      id: repo.nameWithOwner,
      type: "repo",
    };
    nodesMap.set(repoNode.id, repoNode);
    linksMap.set(`${contributor.id}-${repoNode.id}`, {
      source: contributor.id,
      target: repoNode.id,
      distance: 100,
    });
  });

  return { nodes: Array.from(nodesMap.values()), links: Array.from(linksMap.values()) };
}

// Helper: Fetch graph data when input is in repository mode.
async function fetchRepoGraph(input: string, signal: AbortSignal) {
  const [owner, name] = input.split("/");
  if (!owner || !name) {
    throw new Error("Please enter a valid repository in the format 'owner/repo'.");
  }
  const repository = await getRepository(owner, name, signal);
  // Get recent commit authors using GraphQL.
  const contributors = await getRepoContributorsWithContributedRepos(owner, name, signal);

  // Our central repo node will have a name like "owner/repo"
  const selectedEntity: RepoNode = {
    ...repository,
    id: repository.nameWithOwner,
    type: "repo",
  };

  const graph = createRepoGraph(contributors, selectedEntity);
  return { selectedEntity, graph };
}

// Helper: Fetch graph data when input is in user mode.
async function fetchUserGraph(username: string, signal: AbortSignal) {
  const contributor = await getContributorData(username, signal);
  // Create a central user node.
  const selectedEntity: ContributorNode = {
    ...contributor,
    id: username,
    name: username,
    type: "contributor",
  };
  const graph = createUserGraph(contributor.repositoriesContributedTo.nodes, selectedEntity);
  return { selectedEntity, graph };
}

export function useGraph(input: string) {
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [graphData, setGraphData] = useState<{ nodes: EitherNode[]; links: NetworkLink[] } | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<EitherNode | null>(null);

  const resetGraph = () => {
    setError(null);
    setGraphData(null);
    setSelectedEntity(null);
  }

  useEffect(() => {
    if (!input) return;

    const controller = new AbortController();

    (async () => {
      setFetching(true);
      setError(null);
      setGraphData(null);
      try {
        if (input.includes("/")) {
          const { selectedEntity, graph } = await fetchRepoGraph(input, controller.signal);
          setSelectedEntity(selectedEntity);
          setGraphData(graph);
        } else {
          const { selectedEntity, graph } = await fetchUserGraph(input, controller.signal);
          setSelectedEntity(selectedEntity);
          setGraphData(graph);
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error(err);
        if (err.name === "AbortError") return;
        setError("Failed to fetch data. Please check the input.");
        setSelectedEntity(null);
        setGraphData(null);
      } finally {
        setFetching(false);
      }
    })();

    // Cleanup: abort previous request when input changes or component unmounts.
    return () => {
      controller.abort();
    };
  }, [input]);

  return { fetching, error, graphData, selectedEntity, resetGraph };
}