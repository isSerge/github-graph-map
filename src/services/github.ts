import { graphql } from "@octokit/graphql";
import { RepoBase } from "../types";

const githubToken = import.meta.env.VITE_GITHUB_TOKEN;

// Initialize GraphQL client with authentication
const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${githubToken}`,
  },
});

const repositoryFields = `
  id
  name
  nameWithOwner
  url
  stargazerCount
  description
  primaryLanguage {
    name
  }
  owner {
    login
  }
  pushedAt
  contributingFile: object(expression: "HEAD:CONTRIBUTING.md") {
    __typename
  }
  labels(first: 50) {
    nodes {
      name
      color
    }
  }
  issues(first: 100, orderBy: { field: CREATED_AT, direction: DESC }) {
    totalCount
    nodes {
      createdAt
    }
  }
  forkCount
  pullRequests(first: 100, orderBy: { field: CREATED_AT, direction: DESC }) {
    totalCount
    nodes {
      createdAt
      state
      merged
    }
  }
`;

/**
 * Fetch repository details via GraphQL.
 * 
 * @param owner - The owner of the repository.
 * @param repo - The repository name.
 * @returns A promise resolving to the repository data.
 */
export const getRepository = async (owner: string, repo: string, signal?: AbortSignal) => {
  // Calculate date 7 days ago in ISO format.
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const query = `
    query getRepository($owner: String!, $repo: String!) {
      repository(owner: $owner, name: $repo) {
        ${repositoryFields}
      }
    }
  `;

  const result = await graphqlWithAuth<{ repository: RepoBase }>(query, { owner, repo, signal });

  const recentIssues = result.repository.issues.nodes.filter(
    (issue) => new Date(issue.createdAt) > new Date(since)
  );

  const recentPRs = result.repository.pullRequests.nodes.filter(
    (pr) => new Date(pr.createdAt) > new Date(since)
  );

  return {
    ...result.repository,
    issues: {
      totalCount: recentIssues.length,
      nodes: recentIssues,
    },
    pullRequests: {
      totalCount: recentPRs.length,
      nodes: recentPRs,
    }
  }
}

interface GetRecentCommitAuthorsResponse {
  repository: {
    defaultBranchRef: {
      target: {
        history: {
          nodes: {
            author: {
              user: {
                login: string;
              }
            }
          }[];
        };
      };
    };
  };
}

/**
 * Uses GraphQL to fetch recent commits (last 7 days) for a given repository
 * and extracts unique commit authors.
 *
 * @param repoOwner - The owner of the repository.
 * @param repoName - The repository name.
 * @returns A promise resolving to an array of commit author objects (with login).
 */
export async function getRecentCommitAuthors(
  repoOwner: string,
  repoName: string,
  signal?: AbortSignal,
): Promise<{ login: string; contributionCount: number }[]> {
  // Calculate date 7 days ago in ISO format.
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const query = `
    query getRecentCommits($owner: String!, $name: String!, $since: GitTimestamp!) {
      repository(owner: $owner, name: $name) {
        defaultBranchRef {
          target {
            ... on Commit {
              history(since: $since, first: 100) {
                nodes {
                  author {
                    user {
                      login
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const result = await graphqlWithAuth<GetRecentCommitAuthorsResponse>(query, { owner: repoOwner, name: repoName, since, signal });
  const history = result.repository?.defaultBranchRef?.target?.history;
  const nodes = history?.nodes || [];

  const contributorMap = new Map<string, number>();
  nodes.forEach((commit) => {
    const login = commit.author?.user?.login;
    if (login) {
      const currentCount = contributorMap.get(login) || 0;
      contributorMap.set(login, currentCount + 1);
    }
  });
  
  return Array.from(contributorMap.entries()).map(([login, contributionCount]) => ({
    login,
    contributionCount,
  }));
}

/**
 * GraphQL response type for fetching contributed repositories.
 */
export type UserContributedReposResponse = {
  user: {
    avatarUrl: string;
    company: string;
    email: string;
    followers: {
      totalCount: number;
    };
    following: {
      totalCount: number;
    };
    location: string;
    login: string;
    organizations: {
      nodes: {
        login: string;
      }[];
    };
    websiteUrl: string;
    topRepositories: {
      totalCount: number;
      nodes: RepoBase[];
    };
    repositoriesContributedTo: {
      totalCount: number;
      nodes: RepoBase[];
    };
  };
};

/**
 * Uses GraphQL to fetch repositories that the given user has contributed to.
 *
 * @param username - The GitHub username.
 * @returns A promise resolving to the user’s data including contributed repositories.
 */
export async function getContributorData(
  username: string,
  signal?: AbortSignal,
): Promise<UserContributedReposResponse["user"]> {
  const query = `
    query getContributorData($username: String!) {
      user(login: $username) {
        avatarUrl
        company
        email
        followers {
          totalCount
        }
        following {
          totalCount
        }
        location
        login
        organizations(first: 5) {
          nodes {
            login
          }
        }
        websiteUrl
        repositoriesContributedTo(first: 5, includeUserRepositories: true, orderBy: { field: STARGAZERS, direction: DESC }) {
          totalCount
          nodes {
            ${repositoryFields}
          }
        }
        topRepositories(first: 5, orderBy: { field: STARGAZERS, direction: DESC }) {
          totalCount
          nodes {
            ${repositoryFields}
          }
        }
      }
    }
  `;
  const data = await graphqlWithAuth<UserContributedReposResponse>(query, { username, signal });
  if (!data.user) {
    throw new Error("User not found");
  }
  return data.user;
}

/**
 * For a given repository (by owner and name), this function:
 * 1. Fetches recent commit authors using GraphQL.
 * 2. For each author, uses GraphQL to fetch the repositories they've contributed to.
 *
 * @param repoOwner - The owner of the repository.
 * @param repoName - The repository name.
 * @returns A promise resolving to an array where each element contains the contributor’s detailed data.
 */
export async function getRepoContributorsWithContributedRepos(
  repoOwner: string,
  repoName: string,
  signal?: AbortSignal,
): Promise<(UserContributedReposResponse["user"] & { contributionCount: number })[]> {
  const contributors = await getRecentCommitAuthors(repoOwner, repoName, signal);
  const results = await Promise.all(
    contributors.map(async (contributor) => {
      const user = await getContributorData(contributor.login);
      return { ...user, contributionCount: contributor.contributionCount };
    })
  );
  return results;
}

/**
 * Searches for repositories using the GraphQL API.
 * @param searchTerm - The search query string.
 * @returns A promise resolving to an array of repository objects with id and nameWithOwner.
 */
export async function searchRepositories(
  searchTerm: string
): Promise<Array<{ id: string; nameWithOwner: string }>> {
  const repoQuery = `
    query SearchRepos($searchTerm: String!) {
      search(query: $searchTerm, type: REPOSITORY, first: 5) {
        nodes {
          ... on Repository {
            id
            nameWithOwner
          }
        }
      }
    }
  `;
  const result = await graphqlWithAuth<{
    search: { nodes: Array<{ id: string; nameWithOwner: string }> };
  }>(repoQuery, { searchTerm });
  return result.search.nodes;
}

/**
 * Searches for users using the GraphQL API.
 * @param searchTerm - The search query string.
 * @returns A promise resolving to an array of user objects with id and login.
 */
export async function searchUsers(
  searchTerm: string
): Promise<Array<{ id: string; login: string }>> {
  const userQuery = `
    query SearchUsers($searchTerm: String!) {
      search(query: $searchTerm, type: USER, first: 5) {
        nodes {
          __typename
          ... on User {
            id
            login
          }
          ... on Organization {
            id
            login
          }
        }
      }
    }
  `;
  const result = await graphqlWithAuth<{
    search: { nodes: Array<{ __typename: string; id: string; login: string }> };
  }>(userQuery, { searchTerm });
  // Only keep nodes that are Users for now
  return result.search.nodes.filter(node => node.__typename === "User");
}