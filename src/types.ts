import { InputNode, InputLink } from '@nivo/network'

export interface NetworkNode extends InputNode {
    id: string
    color: string
}

export interface RepoNode extends NetworkNode {
    id: string
    name: string
    stargazerCount: number
    description: string
    primaryLanguage: {
        name: string
    }
}

export interface ContributorNode extends NetworkNode {
    login: string
}

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
}

export interface ContributorsWithRepos {
    login: string;
    contributedRepos: RepoData[];
}