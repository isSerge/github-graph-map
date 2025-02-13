import { formatDistanceToNow } from "date-fns";
import { ContributorNode } from "../types";

interface ContributorInfoProps {
  contributor: ContributorNode;
  onSeeGraph: () => void;
}

const ContributorInfo: React.FC<ContributorInfoProps> = ({ contributor, onSeeGraph }) => {
    // Compute the most recent contribution date from repositoriesContributedTo
  const lastContributionDate = 
  contributor.repositoriesContributedTo &&
  contributor.repositoriesContributedTo.nodes.length > 0
    ? new Date(
        Math.max(
          ...contributor.repositoriesContributedTo.nodes.map((repo) =>
            new Date(repo.pushedAt).getTime()
          )
        )
      )
    : null;

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="md:flex">
        {/* Avatar Section */}
        <div className="p-4 flex items-center justify-center bg-gray-900">
          <img
            src={contributor.avatarUrl}
            alt={contributor.login}
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>
        {/* Details Section */}
        <div className="p-6 flex flex-col justify-between grow">
          <div>
            <h2 className="text-2xl font-bold text-white mb-3">
              {contributor.login}
            </h2>
            {contributor.company && (
              <p className="text-gray-300 mb-1">
                <span className="font-semibold">Company: </span>
                {contributor.company}
              </p>
            )}
            {contributor.location && (
              <p className="text-gray-300 mb-1">
                <span className="font-semibold">Location: </span>
                {contributor.location}
              </p>
            )}
            <p className="text-gray-300 mb-1">
              <span className="font-semibold">Followers: </span>
              {contributor.followers.totalCount}
            </p>
            <p className="text-gray-300 mb-1">
              <span className="font-semibold">Following: </span>
              {contributor.following.totalCount}
            </p>
            {contributor.websiteUrl && (
              <p className="text-gray-300 mb-1">
                <span className="font-semibold">Website: </span>
                <a
                  href={contributor.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {contributor.websiteUrl}
                </a>
              </p>
            )}
            <p className="text-gray-300 mb-1">
              <span className="font-semibold">Repos Contributed To: </span>
              {contributor.repositoriesContributedTo.totalCount}
            </p>
            {lastContributionDate && (
              <p className="text-gray-300 mb-1">
                <span className="font-semibold">Last Contribution: </span>
                {formatDistanceToNow(lastContributionDate, { addSuffix: true })}
              </p>
            )}
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={onSeeGraph}
              className="flex-1 text-center px-6 py-3 bg-yellow-500 text-white font-bold rounded shadow-lg hover:bg-yellow-400 transition-colors duration-300"
            >
              See Graph
            </button>
            <a
              href={`https://github.com/${contributor.login}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center inline-block px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-400 transition-colors duration-300"
            >
              View Profile &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributorInfo;