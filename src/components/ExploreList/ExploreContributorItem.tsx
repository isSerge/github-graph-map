import { ActiveContributor } from "../../types";
import { formatNumber } from "../../utils/formatUtils";

interface ExploreContributorItemProps {
  contributor: ActiveContributor;
  onSelect: (nodeName: string) => void;
}

const ExploreContributorItem = ({ contributor, onSelect }: ExploreContributorItemProps) => {
  const contributions = contributor.contributionsCollection.commitContributionsByRepository;
  const maxReposToShow = 3;
  const displayedRepos = contributions.slice(0, maxReposToShow);
  const additionalCount = contributions.length - maxReposToShow;

  return (
    <li
      onClick={() => onSelect(contributor.login)}
      className="p-4 bg-gray-700 rounded cursor-pointer hover:bg-gray-600 transition-colors flex items-center gap-4 min-h-[150px]"
      aria-label={`Contributor ${contributor.login}`}
    >
      <img
        src={contributor.avatarUrl}
        alt={`${contributor.login}'s avatar`}
        className="w-12 h-12 rounded-full object-cover"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = "/fallback-avatar.png";
        }}
      />
      <div className="flex-1">
        <p className="font-bold text-white">{contributor.login}</p>
        <p className="text-gray-300 text-sm">
          Followers: {formatNumber(contributor.followers?.totalCount || 0)}
        </p>
        {contributions.length > 0 && (
          <div className="mt-2">
            <span className="text-gray-400 text-xs">Last repos pushed to: </span>
            <span
              className="text-xs text-gray-300"
              title={displayedRepos
                .map(({ repository }) => repository.nameWithOwner)
                .join(", ")}
            >
              {displayedRepos
                .map(({ repository }) => repository.nameWithOwner)
                .join(", ")}
              {additionalCount > 0 && `, +${additionalCount} more`}
            </span>
          </div>
        )}
        <a
          href={`https://github.com/${contributor.login}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-blue-400 text-xs hover:underline"
          aria-label={`View ${contributor.login}'s GitHub profile`}
        >
          View Profile &rarr;
        </a>
      </div>
    </li>
  );
};

export default ExploreContributorItem;