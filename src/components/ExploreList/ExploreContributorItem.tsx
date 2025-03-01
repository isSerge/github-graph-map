import { ActiveContributor } from "../../types";
import { formatNumber } from "../../utils/formatUtils";

interface ExploreContributorItemProps {
    contributor: ActiveContributor;
    onSelect: (nodeName: string) => void;
}

const ExploreContributorItem = ({ contributor, onSelect }: ExploreContributorItemProps) => {
    const contributions = contributor.contributionsCollection.commitContributionsByRepository;
    return (
        <li
            onClick={() => onSelect(contributor.login)}
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
                    Followers: {formatNumber(contributor.followers?.totalCount || 0)}
                </p>
                {contributions.length > 0 && (<div className="mt-2">
                    <span className="text-gray-400 text-xs">
                        Last repos pushed to:
                    </span>
                    <ul className="list-disc list-inside text-xs text-gray-300">
                        {contributions.map(({ repository }) => (
                            <li key={repository.nameWithOwner}>
                                {repository.nameWithOwner}
                            </li>
                        ))}
                    </ul>
                </div>)}
            </div>
        </li>
    );
};

export default ExploreContributorItem;