import { formatDistanceToNow } from "date-fns";

import { ContributorDetails } from "../types";
import { formatNumber } from "../utils/formatUtils";
import { useContributorDetails } from "../hooks/useContributorDetails";
import LoadingSpinner from "./LoadingSpinner";

interface ContributorInfoProps {
  node: ContributorDetails;
  onExploreGraph: (name: string) => void;
}

const ContributorInfo = ({ node, onExploreGraph }: ContributorInfoProps) => {
  const { fetching, error, contributorDetails } = useContributorDetails(node.login);

  if (fetching) return <LoadingSpinner />;
  // TODO: proper component for error state
  if (error) return <p>{error}</p>;
  if (!contributorDetails) return null;

  const lastActivityTime = contributorDetails.contributionsCollection.commitContributionsByRepository
    .flatMap(item => item.contributions.nodes)
    .reduce((latest, node) => {
      const nodeTime = new Date(node.occurredAt).getTime();
      return nodeTime > latest ? nodeTime : latest;
    }, 0);

  const lastActivityDate = lastActivityTime ? new Date(lastActivityTime) : null;

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="md:flex">
        {/* Avatar Section */}
        <div className="p-4 flex items-center justify-center bg-gray-900">
          <img
            src={contributorDetails.avatarUrl}
            alt={contributorDetails.login}
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>
        {/* Details Section */}
        <div className="p-6 flex flex-col justify-between grow">
          <div>
            <h2 className="text-2xl font-bold text-white mb-3">
              {contributorDetails.login}
            </h2>
            {contributorDetails.company && (
              <p className="text-gray-300 mb-1">
                <span className="font-semibold">Company: </span>
                {contributorDetails.company}
              </p>
            )}
            {contributorDetails.location && (
              <p className="text-gray-300 mb-1">
                <span className="font-semibold">Location: </span>
                {contributorDetails.location}
              </p>
            )}
            <p className="text-gray-300 mb-1">
              <span className="font-semibold">Followers: </span>
              {formatNumber(contributorDetails.followers.totalCount)}
            </p>
            {contributorDetails.websiteUrl && (
              <p className="text-gray-300 mb-1">
                <span className="font-semibold">Website: </span>
                <a
                  href={contributorDetails.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {contributorDetails.websiteUrl}
                </a>
              </p>
            )}
            {/* <p className="text-gray-300 mb-1">
              <span className="font-semibold">Repos Contributed To: </span>
              {formatNumber(contributorDetails.recentRepos.length)}
            </p> */}
            {lastActivityDate && (
              <p className="text-gray-300 mb-1">
                <span className="font-semibold">Last activity: </span>
                {formatDistanceToNow(lastActivityDate, { addSuffix: true })}
              </p>
            )}
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => onExploreGraph(node.login)}
              className="flex-1 text-center px-6 py-3 bg-yellow-500 text-white font-bold rounded shadow-lg hover:bg-yellow-400 transition-colors duration-300"
            >
              Explore Graph
            </button>
            <a
              href={`https://github.com/${node.login}`}
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