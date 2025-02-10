import { useState, useEffect } from "react"
import { getRepoContributorsWithContributedRepos, getRepository } from "./github"
import { NetworkNode, NetworkLink, Repo, ContributorsWithRepos } from './types'

function transformData(
    apiResponse: ContributorsWithRepos[],
    selectedRepo: Repo
  ) {
    const nodes: NetworkNode[] = [];
    const linksMap: Map<string, NetworkLink> = new Map();
  
    // Add the selected repository node
    nodes.push({
      id: selectedRepo.name,
      size: 50, // Adjust size as needed
      color: "#ff7f0e", // Highlight color for the selected repository
    });
  
    // Create a set to track already processed repositories
    const repoSet = new Set<string>();
    repoSet.add(selectedRepo.name);
  
    // Iterate through contributors to build repository nodes and links
    apiResponse.forEach((contributor) => {
      contributor.contributedRepos.forEach((repo) => {
        if (!repoSet.has(repo.name)) {
          // Add a node for each new repository
          nodes.push({
            id: repo.name,
            size: 24,
            color: "rgb(97, 205, 187)", // Color for other repositories
          });
          repoSet.add(repo.name);
        }
  
        // Create a link between the selected repository and other repositories via shared contributors
        if (repo.id !== selectedRepo.id) {
          const linkKey = `${selectedRepo.name}-${repo.name}`;
          if (!linksMap.has(linkKey)) {
            linksMap.set(linkKey, {
              source: selectedRepo.name,
              target: repo.name,
              distance: 50,
              contributorsCount: 1,
            });
          } else {
            // Increment contributors count if the link already exists
            linksMap.get(linkKey)!.contributorsCount += 1;
          }
        }
      });
    });
  
    // Convert links map to an array
    const links: NetworkLink[] = Array.from(linksMap.values());
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