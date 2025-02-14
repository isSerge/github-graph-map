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
`;

/**
 * Fetch repository details via GraphQL.
 * 
 * @param owner - The owner of the repository.
 * @param repo - The repository name.
 * @returns A promise resolving to the repository data.
 */
export const getRepository = async (owner: string, repo: string) => {
  const query = `
    query getRepository($owner: String!, $repo: String!) {
      repository(owner: $owner, name: $repo) {
        ${repositoryFields}
      }
    }
  `;
  return graphqlWithAuth<{ repository: RepoBase }>(query, { owner, repo });
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
  repoName: string
): Promise<{ login: string }[]> {
  // Calculate date 30 days ago in ISO format.
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
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
  const result = await graphqlWithAuth<GetRecentCommitAuthorsResponse>(query, { owner: repoOwner, name: repoName, since });
  const history = result.repository?.defaultBranchRef?.target?.history;
  const nodes = history?.nodes || [];

  // Use a set to collect unique contributor logins
  const contributorLogins = new Set<string>();
  nodes.forEach((commit) => {
    const login = commit.author?.user?.login;
    if (login) {
      contributorLogins.add(login);
    }
  });
  return Array.from(contributorLogins).map(login => ({ login }));
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
  username: string
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
  const data = await graphqlWithAuth<UserContributedReposResponse>(query, { username });
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
  repoName: string
): Promise<UserContributedReposResponse["user"][]> {
  // 1. Get recent commit authors from the repository using GraphQL.
  const contributors = await getRecentCommitAuthors(repoOwner, repoName);
  // 2. For each contributor, fetch their contributed repositories via GraphQL.
  const results = await Promise.all(
    contributors.map(async (contributor) => {
      const user = await getContributorData(contributor.login);
      return user;
    })
  );
  return results;
}