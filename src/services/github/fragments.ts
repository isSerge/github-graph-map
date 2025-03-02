export const repositoryDetailsFragment = `
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

export const userGraphFragment = `
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


export const userDetailsFragment = `
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