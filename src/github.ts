import { graphql, GraphQlQueryResponseData } from "@octokit/graphql"

const githubToken = import.meta.env.VITE_GITHUB_TOKEN;

export const githubClient = graphql.defaults({
  headers: {
    authorization: `token ${githubToken}`,
  },
});

const GET_CONTRIBUTOR_REPOS = `
  query GET_CONTRIBUTOR_REPOS ($owner: String!, $name: String!) {
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

export async function getRepoContributorsWithRepos(repoOwner: string, repoName: string): Promise<GraphQlQueryResponseData> {
  return await githubClient(GET_CONTRIBUTOR_REPOS, { owner: repoOwner, name: repoName });
}