import { formatDistanceToNow } from "date-fns";

import { RepoNode } from "../../types";
import { formatNumber } from "../../utils";

interface ExploreRepoItemProps {
    repo: RepoNode;
    onSelect: (node: RepoNode) => void;
}

const ExploreRepoItem = ({ repo, onSelect }: ExploreRepoItemProps) => {
    return (
        <li
            onClick={() => onSelect(repo)}
            className="p-4 bg-gray-700 rounded cursor-pointer hover:bg-gray-600 transition-colors min-h-[150px]"
        >
            <div className="mb-2">
                <p className="font-bold text-white">{repo.name}</p>
                <p className="text-gray-300 text-sm">{repo.description}</p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                <span>
                    Last updated:{" "}
                    {formatDistanceToNow(new Date(repo.pushedAt), {
                        addSuffix: true,
                    })}
                </span>
                <span>⭐ {formatNumber(repo.stargazerCount)}</span>
                <span>🍴 {formatNumber(repo.forkCount)}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
                {repo.topics.nodes.map((topic, index) => (
                    <span
                        key={index}
                        className="bg-gray-600 text-gray-200 px-2 py-1 rounded-full text-xs"
                    >
                        {topic.name}
                    </span>
                ))}
            </div>
        </li>
    );
};

export default ExploreRepoItem;