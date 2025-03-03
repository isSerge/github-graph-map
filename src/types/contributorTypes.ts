import { RepoGraphData } from "./repoTypes";

export type ContributorDetails = {
  avatarUrl: string;
  company: string;
  email: string;
  followers: {
    totalCount: number;
  };
  location: string;
  login: string;
  websiteUrl: string;
  contributionsCollection: {
    commitContributionsByRepository: {
      repository: RepoGraphData;
      contributions: { nodes: { occurredAt: string }[] };
    }[];
  };
};

export interface ContributorGraphData {
  login: string;
  recentRepos: RepoGraphData[];
}

export type ExploreContributor = {
  login: string;
  avatarUrl: string;
  id: string;
  followers: {
    totalCount: number;
  };
  contributionsCollection: {
    commitContributionsByRepository: {
      repository: {
        nameWithOwner: string;
      };
    }[];
  };
};