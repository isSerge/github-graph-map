import { graphql } from "@octokit/graphql";
import { 
  RepoDetails, 
  ExploreContributor, 
  ContributorGraphData, 
  RepoDetailsResponse, 
  RecentCommitsResponse,
  ContributorGraphDataResponse,
  ContributorDetailsResponse,
  SearchRepoResponse,
  SearchUserResponse,
  GetFreshRepoResponse, 
  getExploreContributorsResponse, 
} from "../../types";
import { getTopFiveRecentRepos } from "../../utils/repoUtils";
import { 
  getContributorGraphDataQuery, 
  getRepositoryDetailsQuery, 
  getRecentCommitsQuery, 
  getContributorDetailsQuery, 
  searchRepoQuery, 
  searchUserQuery, 
  getFreshReposQuery, 
  getExploreContributorsQuery, 
} from "./queries";
import { 
  transformCommitDataResponse, 
  transformContributorResponse, 
  transformRepoDataResponses,
} from "./transform";

const githubToken = import.meta.env.VITE_GITHUB_TOKEN;

// Initialize GraphQL client with authentication
const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${githubToken}`,
  },
});

/**
 * Fetch repository details via GraphQL.
 * 
 * @param owner - The owner of the repository.
 * @param repo - The repository name.
 * @param signal - Optional AbortSignal to cancel the request.
 * @returns A promise resolving to the repository data.
 */
export const getRepositoryDetails = async (
  owner: string,
  repo: string,
  timePeriod: number,
  signal?: AbortSignal
): Promise<RepoDetails> => {
  const since = new Date(Date.now() - timePeriod * 24 * 60 * 60 * 1000).toISOString();
  const repoResponse = await graphqlWithAuth<RepoDetailsResponse>(getRepositoryDetailsQuery, { owner, repo, signal });
  const contributorsResponse = await getRecentCommitAuthors(owner, repo, since, signal);
  const repoData = transformRepoDataResponses(repoResponse, contributorsResponse, since);
  
  return repoData;
};

/**
 * Uses GraphQL to fetch recent commits (last 7 days) for a given repository
 * and extracts unique commit authors.
 *
 * @param repoOwner - The owner of the repository.
 * @param repoName - The repository name.
 * @param since - ISO string representing the start date.
 * @param signal - Optional AbortSignal to cancel the request.
 * @returns A promise resolving to an array of commit author objects.
 */
export async function getRecentCommitAuthors(
  owner: string,
  name: string,
  since: string,
  signal?: AbortSignal,
): Promise<{ login: string; contributionCount: number }[]> {
  const result = await graphqlWithAuth<RecentCommitsResponse>(getRecentCommitsQuery, { owner, name, since, signal });
  return transformCommitDataResponse(result);
}

/**
 * Uses GraphQL to fetch repositories that the given user has contributed to.
 *
 * @param username - The GitHub username.
 * @param signal - Optional AbortSignal to cancel the request.
 * @returns A promise resolving to the user’s graph data.
 */
export async function getContributorGraphData(
  username: string,
  signal?: AbortSignal,
): Promise<ContributorGraphData> {
  const data = await graphqlWithAuth<ContributorGraphDataResponse>(getContributorGraphDataQuery, { username, signal });
  if (!data.user) {
    throw new Error("User not found");
  }
  
  const contributions = data.user.contributionsCollection.commitContributionsByRepository;
  const topFiveRepos = getTopFiveRecentRepos(contributions);
  return {
    ...data.user,
    recentRepos: topFiveRepos,
  };
}

/**
 * Uses GraphQL to fetch detailed data for a given contributor.
 *
 * @param username - The GitHub username.
 * @param signal - Optional AbortSignal to cancel the request.
 * @returns A promise resolving to the contributor’s detailed data.
 */
export async function getContributorDetails(
  username: string,
  signal?: AbortSignal,
): Promise<ContributorDetailsResponse["user"] & { lastActivityDate: Date | null }> {
  const response = await graphqlWithAuth<ContributorDetailsResponse>(getContributorDetailsQuery, { username, signal });
  if (!response.user) {
    throw new Error("User not found");
  }
  return transformContributorResponse(response);
}

/**
 * For a given repository, this function:
 * 1. Fetches recent commit authors.
 * 2. For each author, fetches the repositories they've contributed to.
 *
 * @param repoOwner - The owner of the repository.
 * @param repoName - The repository name.
 * @param since - ISO string representing the start date.
 * @param signal - Optional AbortSignal to cancel the request.
 * @returns A promise resolving to an array of contributor graph data with contribution counts.
 */
export async function getRepoContributorsWithContributedRepos(
  repoOwner: string,
  repoName: string,
  timePeriod: number,
  signal?: AbortSignal,
): Promise<(ContributorGraphData & { contributionCount: number })[]> {
  const since = new Date(Date.now() - timePeriod * 24 * 60 * 60 * 1000).toISOString(); 
  const contributors = await getRecentCommitAuthors(repoOwner, repoName, since, signal);
  const results = await Promise.all(
    contributors
      .filter(contributor => !contributor.login.includes("[bot]"))
      .map(async (contributor) => {
        const user = await getContributorGraphData(contributor.login, signal);
        return { ...user, contributionCount: contributor.contributionCount };
      })
  );
  return results;
}

/**
 * Searches for repositories using the GraphQL API.
 * @param searchTerm - The search query string.
 * @returns A promise resolving to an array of repository objects.
 */
export async function searchRepositories(
  searchTerm: string
): Promise<Array<{ id: string; nameWithOwner: string }>> {
  const result = await graphqlWithAuth<SearchRepoResponse>(searchRepoQuery, { searchTerm });
  return result.search.nodes;
}

/**
 * Searches for users using the GraphQL API.
 * @param searchTerm - The search query string.
 * @returns A promise resolving to an array of user objects.
 */
export async function searchUsers(
  searchTerm: string
): Promise<Array<{ id: string; login: string }>> {
  const result = await graphqlWithAuth<SearchUserResponse>(searchUserQuery, { searchTerm });
  // Only keep nodes that are Users.
  return result.search.nodes.filter(node => node.__typename === "User");
}

/**
 * Fetches fresh repositories using the GraphQL API.
 * @param signal - Optional AbortSignal to cancel the request.
 * @returns A promise resolving to an array of repositories.
 */
export async function getFreshRepositories(signal?: AbortSignal): Promise<RepoDetails[]> {
  const result = await graphqlWithAuth<GetFreshRepoResponse>(getFreshReposQuery, { signal });
  return result.search.nodes;
}

/**
 * Fetches active contributors using the GraphQL API.
 * @param signal - Optional AbortSignal to cancel the request.
 * @returns A promise resolving to an array of active contributors.
 */
export async function getExploreContributors(signal?: AbortSignal): Promise<ExploreContributor[]> {
  const date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  date.setUTCHours(0, 0, 0, 0);
  const since = date.toISOString().replace('.000', '');
  const result = await graphqlWithAuth<getExploreContributorsResponse>(getExploreContributorsQuery, { signal, since });
  return result.search.nodes;
}