import { RepoGraphData } from "../types/repoTypes";
import { ContributorGraphData } from "../types/contributorTypes";
import { NetworkLink, RepoNode, ContributorNode, EitherNode } from "../types/networkTypes";

/**
 * Creates a graph (nodes and links) in repository mode.
 * 
 * @param contributors - An array of contributor objects (with recentRepos and contributionCount).
 * @param centralRepo - The central repository node.
 * @returns An object containing the graph's nodes and links.
 */
export function createRepoGraph(
  contributors: (ContributorGraphData & { contributionCount: number })[],
  centralRepo: RepoNode
): { nodes: EitherNode[]; links: NetworkLink[] } {
  const nodesMap = new Map<string, EitherNode>();
  const linksMap = new Map<string, NetworkLink>();

  // Add the central repository node.
  nodesMap.set(centralRepo.id, centralRepo);

  contributors.forEach((contributor) => {
    const contributorId = contributor.login;

    // Add contributor node if not already present.
    if (!nodesMap.has(contributorId)) {
      const contributorNode: ContributorNode = {
        ...contributor,
        id: contributorId,
        name: contributorId,
        type: "contributor",
      };
      nodesMap.set(contributorId, contributorNode);
    }

    // Link central repository to contributor.
    const repoToContributorKey = `${centralRepo.id}-${contributorId}`;
    if (!linksMap.has(repoToContributorKey)) {
      linksMap.set(repoToContributorKey, {
        source: centralRepo.id,
        target: contributorId,
        distance: 100,
        thickness: contributor.contributionCount,
      });
    }

    // For each repository in the contributor's recentRepos array, add nodes and links.
    contributor.recentRepos.forEach((repo) => {
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

/**
 * Creates a graph (nodes and links) in user mode.
 * 
 * @param repos - An array of repository data contributed to by the user.
 * @param contributor - The central contributor node.
 * @returns An object containing the graph's nodes and links.
 */
export function createUserGraph(
  repos: RepoGraphData[],
  contributor: ContributorNode
): { nodes: EitherNode[]; links: NetworkLink[] } {
  const nodesMap = new Map<string, EitherNode>();
  const linksMap = new Map<string, NetworkLink>();

  // Create the central user node.
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
    const linkKey = `${contributor.id}-${repoNode.id}`;
    linksMap.set(linkKey, {
      source: contributor.id,
      target: repoNode.id,
      distance: 100,
    });
  });

  return { nodes: Array.from(nodesMap.values()), links: Array.from(linksMap.values()) };
}

export function isRepoNode(node: EitherNode): node is RepoNode {
  return node.type === "repo";
}