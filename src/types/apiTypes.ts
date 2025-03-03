import { RepoDetails, RepoGraphData } from "./repoTypes";
import { ExploreContributor } from "./contributorTypes";

export interface RepoDetailsResponse { 
  repository: RepoDetails;
}

export interface RecentCommitsResponse {
  repository: {
    defaultBranchRef: {
      target: {
        history: {
          nodes: {
            author: {
              user: {
                login: string;
              };
            };
          }[];
        };
      };
    };
  };
}

export interface ContributorGraphDataResponse {
  user: {
    login: string;
    contributionsCollection: {
      commitContributionsByRepository: {
        repository: RepoGraphData;
        contributions: { nodes: { occurredAt: string }[] };
      }[];
    };
  };
}

export interface ContributorDetailsResponse {
  user: {
    avatarUrl: string;
    company: string;
    email: string;
    followers: { totalCount: number };
    location: string;
    login: string;
    organizations: { nodes: { login: string }[] };
    websiteUrl: string;
    contributionsCollection: {
      commitContributionsByRepository: {
        repository: RepoGraphData;
        contributions: { nodes: { occurredAt: string }[] };
      }[];
    };
  };
}

export interface SearchRepoResponse {
  search: { nodes: Array<{ id: string; nameWithOwner: string }> };
}

export interface SearchUserResponse {
  search: { nodes: Array<{ __typename: string; id: string; login: string }> };
}

export interface GetFreshRepoResponse { 
  search: { nodes: RepoDetails[] }; 
}

export interface GetActiveContributorsResponse { 
  search: { nodes: ExploreContributor[] }; 
}