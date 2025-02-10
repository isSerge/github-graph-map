import { useState, useEffect } from "react"
import { getRepoContributorsWithContributedRepos, getRepository } from "./github"
import { NetworkLink, RepoData, ContributorsWithRepos, RepoNode, ContributorNode } from './types'

const REPO_COLOR = "rgb(97, 205, 187)";
const SELECTED_REPO_COLOR = "rgb(255, 230, 0)";
const CONTRIBUTOR_COLOR = "#f47560";

function transformData(apiResponse: ContributorsWithRepos[], selectedRepo: RepoData) {
    const nodes: (RepoNode | ContributorNode)[] = [];
    const links: NetworkLink[] = [];

    // Add the selected repository node
    nodes.push({
        ...selectedRepo,
        id: selectedRepo.name,
        color: SELECTED_REPO_COLOR,
    });

    const nodeSet = new Set<string>();

    nodeSet.add(selectedRepo.name);

    // Iterate through contributors to build contributor nodes and links
    apiResponse.forEach((contributor) => {
        // Add contributor node if not already processed
        if (!nodeSet.has(contributor.login)) {
            nodes.push({
                id: contributor.login,
                color: CONTRIBUTOR_COLOR,
                login: contributor.login,
            });
            nodeSet.add(contributor.login);
        }

        // Create a link between the selected repository and the contributor
        links.push({
            source: selectedRepo.name,
            target: contributor.login,
            distance: 100,
        });

        // Iterate through the repositories the contributor has contributed to
        contributor.contributedRepos.forEach((repo) => {
            // Add repository node if not already processed
            if (!nodeSet.has(repo.name)) {
                nodes.push({
                    ...repo,
                    id: repo.name,
                    color: REPO_COLOR,
                });
                nodeSet.add(repo.name);
            }

            // Create a link between the contributor and the repository
            links.push({
                source: contributor.login,
                target: repo.name,
                distance: 50,
            });
        });
    });

    return { nodes, links };
}

export function useRepoData(repoInput: string) {
    const [fetching, setFetching] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ContributorsWithRepos[] | null>(null);
    const [selectedRepo, setSelectedRepo] = useState<RepoData | null>(null);
  
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