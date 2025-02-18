import { InputNode, InputLink } from '@nivo/network';

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

export interface ContributorNode extends NetworkNode {
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
  organizations: {
    nodes: {
      login: string;
    }[];
  };
  websiteUrl: string;
  topRepositories: {
    totalCount: number;
    nodes: RepoBase[];
  };
  repositoriesContributedTo: {
    totalCount: number;
    nodes: RepoBase[];
  };
  type: "contributor";
}

export type EitherNode = RepoNode | ContributorNode;

export interface NetworkLink extends InputLink {
  source: string;
  target: string;
  distance: number;
  thickness?: number;
}