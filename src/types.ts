import { InputNode, InputLink } from '@nivo/network'

export interface NetworkNode extends InputNode {
    name: string
    type: "repo" | "contributor"
}

export interface RepoNode extends NetworkNode {
    name: string
    stargazerCount: number
    description: string
    primaryLanguage: {
        name: string
    }
    url: string
    owner: {
        login: string
    }
    pushedAt: string
}

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
      nodes: RepoData[];
    }
    repositoriesContributedTo: {
      totalCount: number;
      nodes: RepoData[];
    };
}

export type EitherNode = RepoNode | ContributorNode;

export interface NetworkLink extends InputLink {
    source: string
    target: string
    distance: number
}

export interface RepoData {
    name: string
    stargazerCount: number
    description: string
    primaryLanguage: {
        name: string
    }
    url: string
    owner: {
        login: string
    }
    pushedAt: string
}