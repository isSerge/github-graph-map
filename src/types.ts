import { InputNode, InputLink } from '@nivo/network';

export type ActiveContributor = {
  login: string;
  avatarUrl: string;
  id: string;
  followers: {
    totalCount: number;
  }
  contributionsCollection: {
    commitContributionsByRepository: {
      repository: {
        nameWithOwner: string;
      }
    }[];
  }
}

export type ContributorBase = {
  avatarUrl: string;
  company: string;
  email: string;
  followers: {
    totalCount: number;
  };
  following: {
    totalCount: number;
  };
  location: string;
  login: string;
  websiteUrl: string;
  repositoriesContributedTo: {
    totalCount: number;
    nodes: RepoBase[];
  };
};

// Base type for repository data as returned by the API.
export interface RepoBase {
  name: string;
  nameWithOwner: string;
  stargazerCount: number;
  description: string;
  primaryLanguage: {
    name: string;
  };
  url: string;
  owner: {
    login: string;
  };
  pushedAt: string;
  contributingFile?: {
    __typename: string;
  }
  labels: {
    nodes: {
      name: string;
      color: string;
    }[];
  }
  issues: {
    totalCount: number;
    nodes: {
      createdAt: string;
    }[];
  }
  forkCount: number;
  pullRequests: {
    totalCount: number;
    nodes: {
      createdAt: string;
      state: string;
      merged: boolean;
    }[];
  }
  topics: {
    nodes: {
      topic: {
        name: string;
      }
    }[]
  };
}

// Common network node interface.
export interface NetworkNode extends InputNode {
  name: string;
  type: "repo" | "contributor";
}

// RepoNode is a combination of the repository data and network node info.
export type RepoNode = RepoBase & NetworkNode & { type: "repo" };

export type ContributorNode = ContributorBase & NetworkNode & { type: "contributor" };

export type EitherNode = RepoNode | ContributorNode;

export interface NetworkLink extends InputLink {
  source: string;
  target: string;
  distance: number;
  thickness?: number;
}