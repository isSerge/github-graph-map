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
};

export interface ContributorGraphData {
  login: string;
  recentRepos: RepoGraphData[];
}

export type ActiveContributor = {
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
      }
    }[];
  };
};