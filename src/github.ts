import { Octokit } from "@octokit/rest";
import { graphql } from "@octokit/graphql";
import { CoontributorsWithRepos, Repo } from "./types";

// Your GitHub token from environment variables
const githubToken = import.meta.env.VITE_GITHUB_TOKEN;

// Initialize REST API client (Octokit)
const octokit = new Octokit({
  auth: githubToken,
});

// Initialize GraphQL client with authentication
const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${githubToken}`,
  },
});

export const getRepository = async (owner: string, repo: string) => {
  const query = `
    query getRepository($owner: String!, $repo: String!) {
      repository(owner: $owner, name: $repo) {
        id
        name
        stargazerCount
        description
        primaryLanguage {
          name
        }
      }
    }
  `;

  return graphqlWithAuth<{ repository: Repo }>(query, { owner, repo });
}

/**
 * Uses the REST API to fetch all contributors for a given repository.
 *
 * @param repoOwner - The owner of the repository.
 * @param repoName - The repository name.
 * @returns A promise resolving to an array of contributor objects (with at least a login).
 */
export async function getRepoContributors(
  repoOwner: string,
  repoName: string
): Promise<{ login: string }[]> {
  const response = await octokit.rest.repos.listContributors({
    owner: repoOwner,
    repo: repoName,
    per_page: 2, // adjust if necessary
  });
  // Map to only the fields you need
  return response.data.map((contributor) => ({ login: contributor.login ??  "Unknown" }));
}

/**
 * GraphQL response type for fetching contributed repositories for a user.
 */
type UserContributedReposResponse = {
  user: {
    repositoriesContributedTo: {
      nodes: {
        id: string;
        name: string;
        stargazerCount: number;
        description: string;
        primaryLanguage: {
          name: string;
        };
      }[];
    };
  };
};

/**
 * Uses GraphQL to fetch repositories that the given user has contributed to.
 *
 * @param username - The GitHub username.
 * @returns A promise resolving to an array of repositories with id, name, and stargazerCount.
 */
export async function getUserContributedRepos(
  username: string
): Promise<{ id: string; name: string; stargazerCount: number }[]> {
  const query = `
    query getUserContributedRepos($username: String!) {
      user(login: $username) {
        repositoriesContributedTo(first: 2, includeUserRepositories: true, orderBy: { field: STARGAZERS, direction: DESC }) {
          nodes {
            id
            name
            stargazerCount
            description
            primaryLanguage {
              name
            }
          }
        }
      }
    }
  `;

  const data = await graphqlWithAuth<UserContributedReposResponse>(query, { username });
  
  // If no user found, return an empty array.
  if (!data.user) {
    return [];
  }
  
  return data.user.repositoriesContributedTo.nodes;
}

/**
 * For a given repository (by owner and name), this function:
 * 1. Fetches all contributors using the REST API.
 * 2. For each contributor, uses GraphQL to fetch all repositories they've contributed to.
 *
 * @param repoOwner - The owner of the repository.
 * @param repoName - The repository name.
 * @returns A promise resolving to an array where each element contains the contributor's login and
 *          an array of repositories they have contributed to.
 */
export async function getRepoContributorsWithContributedRepos(
  repoOwner: string,
  repoName: string
): Promise<CoontributorsWithRepos[]> {
  // 1. Get all contributors from the repository using REST
  const contributors = await getRepoContributors(repoOwner, repoName);

  // 2. For each contributor, fetch their contributed repositories via GraphQL
  const results = await Promise.all(
    contributors.map(async (contributor) => {
      const contributedRepos = (await getUserContributedRepos(contributor.login)).sort((a, b) => b.stargazerCount - a.stargazerCount);
      return {
        login: contributor.login,
        contributedRepos,
      };
    })
  );

  return results;
}