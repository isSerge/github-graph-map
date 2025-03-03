import { useState, useEffect } from "react";
import {
  getRepoContributorsWithContributedRepos,
  getRepositoryDetails,
  getContributorGraphData,
} from "../services/github";
import { EitherNode, RepoNode, ContributorNode, NetworkLink } from "../types/networkTypes";
import { handleError } from "../utils/errorUtils";
import { createRepoGraph, createUserGraph } from "../utils/graphUtils";

async function fetchRepoGraph(input: string, since: string, signal: AbortSignal) {
  const [owner, name] = input.split("/");
  if (!owner || !name) {
    throw new Error("Please enter a valid repository in the format 'owner/repo'.");
  }
  const repository = await getRepositoryDetails(owner, name, signal);
  const contributors = await getRepoContributorsWithContributedRepos(owner, name, since, signal);

  const selectedEntity: RepoNode = {
    ...repository,
    id: repository.nameWithOwner,
    type: "repo",
  };

  const graph = createRepoGraph(contributors, selectedEntity);
  return { selectedEntity, graph };
}

async function fetchUserGraph(username: string, signal: AbortSignal) {
  const contributor = await getContributorGraphData(username, signal);
  const selectedEntity: ContributorNode = {
    ...contributor,
    id: username,
    name: username,
    type: "contributor",
  };
  const graph = createUserGraph(contributor.recentRepos, selectedEntity);
  return { selectedEntity, graph };
}

export function useGraph(input: string, timePeriod: number) {
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [graphData, setGraphData] = useState<{ nodes: EitherNode[]; links: NetworkLink[] } | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<EitherNode | null>(null);

  const resetGraph = () => {
    setError(null);
    setGraphData(null);
    setSelectedEntity(null);
  };

  useEffect(() => {
    if (!input) return;
    const controller = new AbortController();

    (async () => {
      setFetching(true);
      setError(null);
      setGraphData(null);
      try {
        if (input.includes("/")) {
          // Calculate "since" based on the timePeriod.
          const since = new Date(Date.now() - timePeriod * 24 * 60 * 60 * 1000).toISOString();
          const { selectedEntity, graph } = await fetchRepoGraph(input, since, controller.signal);
          setSelectedEntity(selectedEntity);
          setGraphData(graph);
        } else {
          const { selectedEntity, graph } = await fetchUserGraph(input, controller.signal);
          setSelectedEntity(selectedEntity);
          setGraphData(graph);
        }
      } catch (error) {
        handleError("useGraph", error);
        if (error instanceof Error && error.name === "AbortError") return;
        setError("Failed to fetch data. Please check the input.");
        setSelectedEntity(null);
        setGraphData(null);
      } finally {
        setFetching(false);
      }
    })();

    return () => controller.abort();
  }, [input, timePeriod]);

  return { fetching, error, graphData, selectedEntity, resetGraph };
}