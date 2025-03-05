const repositoryDetailsFragment = `
  fragment RepositoryFields on Repository {
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
        issues {
          totalCount
        }
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
    topics: repositoryTopics(first: 5) {
      nodes {
        topic {
          name
        }
      }
    }
  }
`;


const repositoryGraphFragment = `
  fragment RepositoryFields on Repository {
    id
    name
    nameWithOwner
    url
  }
`;

const userGraphFragment = `
  fragment UserFields on User {
    login
    url
    contributionsCollection {
      commitContributionsByRepository {
        contributions(first: 10) {
          nodes { occurredAt }
        }
        repository {
          ...RepositoryFields
        }
      }
    }
  }
  ${repositoryGraphFragment}
`;

const userDetailsFragment = `
  fragment UserFields on User {
    login
    name
    avatarUrl
    company
    email
    followers {
      totalCount
    }
    location
    websiteUrl
    contributionsCollection {
      commitContributionsByRepository {
        contributions(first: 10) {
          nodes { occurredAt }
        }
        repository {
          ...RepositoryFields
        }
      }
    }
  }
  ${repositoryGraphFragment}
`;

export const getRepositoryDetailsQuery = `
  query getRepositoryDetails($owner: String!, $repo: String!) {
    repository(owner: $owner, name: $repo) {
      ...RepositoryFields
    }
  }
  ${repositoryDetailsFragment}
`;

export const getRecentCommitsQuery = `
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

export const getContributorGraphDataQuery = `
  query getContributorGraphData($username: String!) {
    user(login: $username) {
      ...UserFields
    }
  }
  ${userGraphFragment}
`;

export const getContributorDetailsQuery = `
  query getContributorDetails($username: String!) {
    user(login: $username) {
      ...UserFields
    }
  }
  ${userDetailsFragment}
`;

export const searchRepoQuery = `
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

export const searchUserQuery = `
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

export const getFreshReposQuery = `
  query GetFreshRepos {
    search(
      query: "stars:>100 sort:updated-desc"
      type: REPOSITORY
      first: 3
    ) {
      nodes {
        ... on Repository{
          ...RepositoryFields
        }
      }
    }
  }
  ${repositoryDetailsFragment}
`;

export const getExploreContributorsQuery = `
  query getExploreContributors($since: DateTime!) {
    search(query: "followers:>100 sort:joined-desc", type: USER, first: 5) {
      nodes {
        ... on User {
          id
          login
          avatarUrl
          followers {
            totalCount
          }
          contributionsCollection (from: $since) {
            commitContributionsByRepository {
              repository {
                nameWithOwner
              }
            }
          }
        }
      }
    }
  }
`;
