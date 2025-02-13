import { InputNode, InputLink } from '@nivo/network'

export interface NetworkNode extends InputNode {
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
    // TODO: move name to parent
    name: string
    // TODO: Add more fields
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

export interface ContributorsWithRepos {
    login: string;
    contributedRepos: RepoData[];
}