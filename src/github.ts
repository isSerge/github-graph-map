import { graphql } from "@octokit/graphql";

const githubToken = import.meta.env.VITE_GITHUB_TOKEN;

export const githubClient = graphql.defaults({
  headers: {
    authorization: `token ${githubToken}`,
  },
});

export async function getRepoContributorsWithRepos(repoOwner: string, repoName: string) {
  const query = `
    query ($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        collaborators(first: 10) {
          edges {
            node {
              login
              repositoriesContributedTo (first: 10, includeUserRepositories:true ) {
                edges {
                  node {
                      name
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  return await githubClient(query, { owner: repoOwner, name: repoName });
}