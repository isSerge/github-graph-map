import { InputNode, InputLink } from '@nivo/network'

export interface NetworkNode extends InputNode {
    id: string
    type: string
}

export interface RepoNode extends NetworkNode {
    id: string
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
    login: string
}

export type EitherNode = RepoNode | ContributorNode;

export interface NetworkLink extends InputLink {
    source: string
    target: string
    distance: number
}

export interface RepoData {
    id: string
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

export interface ContributorsWithRepos {
    login: string;
    contributedRepos: RepoData[];
}