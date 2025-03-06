import { useQuery } from "react-query";
import { createRepoGraph, createUserGraph } from "../utils/graphUtils";
import { getRepositoryDetails, getRepoContributorsWithContributedRepos, getContributorGraphData } from "../services/github";
import { RepoNode, ContributorNode, EitherNode, NetworkLink } from "../types/networkTypes";
import { RepoDetails } from "../types/repoTypes";

// A discriminated union so consumers know whether the graph is for a repo or a contributor.
type RepoGraphResponse = {
  type: "repo";
  selectedEntity: RepoNode;
  graph: { nodes: EitherNode[]; links: NetworkLink[] };
};

type ContributorGraphResponse = {
  type: "contributor";
  selectedEntity: ContributorNode;
  graph: { nodes: EitherNode[]; links: NetworkLink[] };
};

export type GraphResponse = RepoGraphResponse | ContributorGraphResponse;

async function fetchRepoGraph(input: string, timePeriod: number, signal: AbortSignal): Promise<RepoGraphResponse> {
  const [owner, name] = input.split("/");
  if (!owner || !name) {
    throw new Error("Please enter a valid repository in the format 'owner/repo'.");
  }
  // getRepositoryDetails returns a RepoDetails; we spread it into a new object for the graph node.
  const repository: RepoDetails = await getRepositoryDetails(owner, name, timePeriod, signal!);
  const contributors = await getRepoContributorsWithContributedRepos(owner, name, timePeriod, signal!);
  const selectedEntity: RepoNode = {
    ...repository,
    id: repository.nameWithOwner,  // use a unique id (for example, nameWithOwner)
    type: "repo",
    name: repository.name, // ensure required fields from RepoGraphData are available
  };
  const graph = createRepoGraph(contributors, selectedEntity);
  return { type: "repo", selectedEntity, graph };
}

async function fetchUserGraph(username: string, signal: AbortSignal): Promise<ContributorGraphResponse> {
  const contributor = await getContributorGraphData(username, signal!);
  const selectedEntity: ContributorNode = {
    ...contributor,
    id: username,
    name: username,
    type: "contributor",
  };
  const graph = createUserGraph(contributor.recentRepos, selectedEntity);
  return { type: "contributor", selectedEntity, graph };
}

export function useGraph(input: string, timePeriod: number) {
  return useQuery<GraphResponse, Error, GraphResponse, (string | number)[]>(
    ["graph", input, timePeriod],
    ({ signal }) => {
      if (!input) throw new Error("No input provided");
      if (input.includes("/")) {
        return fetchRepoGraph(input, timePeriod, signal!);
      } else {
        return fetchUserGraph(input, signal!);
      }
    },
    {
      enabled: Boolean(input),
      staleTime: 2 * 60 * 60 * 1000, // 2 hour
    }
  );
}