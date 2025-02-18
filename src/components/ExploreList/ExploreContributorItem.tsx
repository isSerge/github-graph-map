import { formatDistanceToNow } from "date-fns";

import { ContributorNode } from "../../types";
import { formatNumber } from "../../utils";

interface ExploreContributorItemProps {
    contributor: ContributorNode;
    onSelect: (node: ContributorNode) => void;
}

const ExploreContributorItem = ({ contributor, onSelect }: ExploreContributorItemProps) => {
    // Display up to three recently pushed-to repositories.
    const lastRepos = contributor.repositoriesContributedTo.nodes.slice(0, 3);
    return (
        <li
            onClick={() => onSelect(contributor)}
            className="p-4 bg-gray-700 rounded cursor-pointer hover:bg-gray-600 transition-colors flex items-center gap-4 min-h-[150px]"
        >
            <img
                src={contributor.avatarUrl}
                alt={contributor.login}
                className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
                <p className="font-bold text-white">{contributor.login}</p>
                <p className="text-gray-300 text-sm">
                    Followers: {formatNumber(contributor.followers.totalCount)}
                </p>
                <div className="mt-2">
                    <span className="text-gray-400 text-xs">
                        Last repos pushed to:
                    </span>
                    <ul className="list-disc list-inside text-xs text-gray-300">
                        {lastRepos.map((repo, index) => (
                            <li key={index}>
                                {repo.nameWithOwner}{" "}
                                <span className="text-gray-500">
                                    (
                                    {formatDistanceToNow(new Date(repo.pushedAt), { addSuffix: true })}
                                    )
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </li>
    );
};

export default ExploreContributorItem;