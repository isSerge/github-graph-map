import { formatDistanceToNow } from "date-fns";

import { RepoNode } from "../../types";
import {
    countBeginnerFriendlyLabels,
    GOOD_FIRST_ISSUE,
    HELP_WANTED,
    BEGINNER_FRIENDLY
} from "../../utils/repoUtils";
import { formatNumber } from "../../utils/formatUtils";

interface ExploreRepoItemProps {
    repo: RepoNode;
    onSelect: (nodeName: string) => void;
}

const ExploreRepoItem = ({ repo, onSelect }: ExploreRepoItemProps) => {
    const labelCounts = countBeginnerFriendlyLabels(repo.labels.nodes);
    const countGoodFirstIssue = labelCounts[GOOD_FIRST_ISSUE];
    const countHelpWanted = labelCounts[HELP_WANTED];
    const countBeginnerFriendly = labelCounts[BEGINNER_FRIENDLY];
    return (
        <li
            onClick={() => onSelect(repo.nameWithOwner)}
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
            {countGoodFirstIssue > 0 && (
                <span className="bg-gray-600 text-gray-200 px-2 py-1 rounded-full text-xs">
                    {GOOD_FIRST_ISSUE} ({labelCounts[GOOD_FIRST_ISSUE]})
                </span>
            )}
            {countHelpWanted > 0 && (
                <span className="bg-gray-600 text-gray-200 px-2 py-1 rounded-full text-xs">
                    {HELP_WANTED} ({labelCounts[HELP_WANTED]})
                </span>
            )}
            {countBeginnerFriendly > 0 && (
                <span className="bg-gray-600 text-gray-200 px-2 py-1 rounded-full text-xs">
                    {BEGINNER_FRIENDLY} ({labelCounts[BEGINNER_FRIENDLY]})
                </span>
            )}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
                {repo.topics.nodes.map((node, index) => (
                    <span
                        key={index}
                        className="bg-gray-600 text-gray-200 px-2 py-1 rounded-full text-xs"
                    >
                        {node.topic.name}
                    </span>
                ))}
            </div>
        </li>
    );
};

export default ExploreRepoItem;