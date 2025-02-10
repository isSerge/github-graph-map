import { useState, useEffect } from "react"
import { getRepoContributorsWithContributedRepos, getRepository } from "./github"
import { NetworkNode, NetworkLink, Repo, ContributorsWithRepos } from './types'

function transformData(apiResponse: ContributorsWithRepos[], selectedRepo: Repo) {
    const nodes: NetworkNode[] = [];
    const links: NetworkLink[] = [];

    // Add the selected repository node
    nodes.push({
        id: selectedRepo.name,
        size: 50, // Adjust size as needed
        color: "#ff7f0e", // Highlight color for the selected repository
    });

    const contributorSet = new Set<string>();

    // Iterate through contributors to build contributor nodes and links
    apiResponse.forEach((contributor) => {
        // Add contributor node if not already processed
        if (!contributorSet.has(contributor.login)) {
            nodes.push({
                id: contributor.login,
                size: 30, // Adjust size as needed
                color: "#f47560", // Contributor node color
            });
            contributorSet.add(contributor.login);
        }

        // Create a link between the selected repository and the contributor
        links.push({
            source: selectedRepo.name,
            target: contributor.login,
            distance: 50,
        });
    });

    return { nodes, links };
}

export function useRepoData(repoInput: string) {
    const [fetching, setFetching] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ContributorsWithRepos[] | null>(null);
    const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);
  
    useEffect(() => {
      const fetchData = async () => {
        // Only attempt fetch if the repoInput is in "owner/repo" format
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
        } catch {
          setError("Failed to fetch repository data. Please check the repo name.");
        } finally {
          setFetching(false);
        }
      };
  
      fetchData();
    }, [repoInput]);
  
    return { fetching, error, graphData: data && selectedRepo ? transformData(data, selectedRepo) : null, selectedRepo };
  }