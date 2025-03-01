import { RepoBase } from "./repoTypes";

export type ContributorBase = {
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

// Extend ContributorBase with recentRepos
export interface ContributorDataWithRecentRepos
  extends Omit<ContributorBase, /* "repositoriesContributedTo" if it existed */ never> {
  recentRepos: RepoBase[];
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