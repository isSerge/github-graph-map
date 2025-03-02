export const repositoryFragment = `
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
  }
`;

export const userGraphFragment = `
  fragment UserFields on User {
    login
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