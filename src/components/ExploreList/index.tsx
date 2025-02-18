import { RepoNode, ContributorNode, EitherNode } from "../../types";
import ExploreRepoItem from "./ExploreRepoItem";
import ExploreContributorItem from "./ExploreContributorItem";

interface ExploreListsProps {
    onSelect: (node: EitherNode) => void;
}

const ExploreLists: React.FC<ExploreListsProps> = ({ onSelect }) => {
    const repoList: RepoNode[] = [
        {
            id: "repo1",
            name: "facebook/react",
            stargazerCount: 200000,
            description: "A JavaScript library for building user interfaces",
            primaryLanguage: { name: "JavaScript" },
            url: "https://github.com/facebook/react",
            owner: { login: "facebook" },
            pushedAt: new Date().toISOString(),
            type: "repo",
            topics: {
                nodes: [
                    { name: "react" },
                    { name: "javascript" },
                    { name: "library" },
                ]
            },
            nameWithOwner: "facebook/react",
            contributingFile: { __typename: "File" },
            labels: {
                nodes: [
                    { name: "good first issue", color: "7057ff" },
                    { name: "help wanted", color: "008672" },
                ],
            },
            issues: {
                totalCount: 100,
                nodes: [{ createdAt: new Date().toISOString() }],
            },
            forkCount: 100,
            pullRequests: {
                totalCount: 50,
                nodes: [
                    {
                        createdAt: new Date().toISOString(),
                        state: "open",
                        merged: false,
                    },
                ],
            },
        },
        {
            id: "repo2",
            name: "facebook/react",
            stargazerCount: 200000,
            description: "A JavaScript library for building user interfaces",
            primaryLanguage: { name: "JavaScript" },
            url: "https://github.com/facebook/react",
            owner: { login: "facebook" },
            pushedAt: new Date().toISOString(),
            type: "repo",
            topics: {
                nodes: [
                    { name: "react" },
                    { name: "javascript" },
                    { name: "library" },
                ]
            },
            nameWithOwner: "facebook/react",
            contributingFile: { __typename: "File" },
            labels: {
                nodes: [
                    { name: "good first issue", color: "7057ff" },
                    { name: "help wanted", color: "008672" },
                ],
            },
            issues: {
                totalCount: 100,
                nodes: [{ createdAt: new Date().toISOString() }],
            },
            forkCount: 100,
            pullRequests: {
                totalCount: 50,
                nodes: [
                    {
                        createdAt: new Date().toISOString(),
                        state: "open",
                        merged: false,
                    },
                ],
            },
        },

    ];

    const contributorList: ContributorNode[] = [
        {
            id: "contrib1",
            name: "torvalds",
            login: "torvalds",
            avatarUrl: "https://avatars.githubusercontent.com/u/1024025?v=4",
            company: "Linux Foundation",
            email: "",
            followers: { totalCount: 120000 },
            following: { totalCount: 0 },
            location: "Portland, OR",
            organizations: { nodes: [{ login: "linux" }] },
            websiteUrl: "https://github.com/torvalds",
            topRepositories: { totalCount: 5, nodes: [] },
            repositoriesContributedTo: { totalCount: 100, nodes: [] },
            type: "contributor",
        },
        {
            id: "contrib2",
            name: "gaearon",
            login: "gaearon",
            avatarUrl: "https://avatars.githubusercontent.com/u/810438?v=4",
            company: "Facebook",
            email: "",
            followers: { totalCount: 60000 },
            following: { totalCount: 100 },
            location: "San Francisco",
            organizations: { nodes: [{ login: "facebook" }] },
            websiteUrl: "https://github.com/gaearon",
            topRepositories: { totalCount: 10, nodes: [] },
            repositoriesContributedTo: { totalCount: 50, nodes: [] },
            type: "contributor",
        },
    ];

    return (
        <div className="flex gap-8 p-8">
            {/* Repositories Column */}
            <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">Explore repositories...</h2>
                <ul className="space-y-4">
                    {repoList.map((repo) => (
                        <ExploreRepoItem key={repo.id} repo={repo} onSelect={onSelect} />
                    ))}
                </ul>
            </div>

            {/* Contributors Column */}
            <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">Explore contributors...</h2>
                <ul className="space-y-4">
                    {contributorList.map((contributor) => (
                        <ExploreContributorItem
                            key={contributor.id}
                            contributor={contributor}
                            onSelect={onSelect}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ExploreLists;