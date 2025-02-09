import { InputNode, InputLink } from '@nivo/network'

export interface NetworkNode extends InputNode {
    id: string
    size: number
    color: string
}

export interface NetworkLink extends InputLink {
    source: string
    target: string
    distance: number
}

export interface Repo {
    id: string
    name: string
    stargazerCount: number
    description: string
    primaryLanguage: string
}

export interface CoontributorsWithRepos {
    login: string;
    contributedRepos: { id: string; name: string; stargazerCount: number }[];
}