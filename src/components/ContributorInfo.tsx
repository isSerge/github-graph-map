import { formatDistanceToNow } from "date-fns";
import { ContributorDetails } from "../types";
import { formatNumber } from "../utils/formatUtils";
import { useContributorDetails } from "../hooks/useContributorDetails";
import LoadingSpinner from "./LoadingSpinner";
import { getErrorMessage } from "../utils/errorUtils";

interface ContributorInfoProps {
  node: ContributorDetails;
  onExploreGraph: (name: string) => void;
}

const ContributorInfo = ({ node, onExploreGraph }: ContributorInfoProps) => {
  const { isFetching, error, data } = useContributorDetails(node.login);

  if (isFetching) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">{getErrorMessage(error)}</p>;
  if (!data) return null;

  const contributions = data.contributionsCollection.commitContributionsByRepository;

  const maxReposToShow = 3;
  const displayedRepos = contributions.slice(0, maxReposToShow);
  const additionalCount = contributions.length - maxReposToShow;

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Avatar Section */}
        <div className="md:w-1/3 flex justify-center items-center bg-gray-900 p-6">
          <img
            src={data.avatarUrl}
            alt={data.login}
            className="w-32 h-32 rounded-full border-4 border-gray-700 object-cover"
          />
        </div>
        {/* Details Section */}
        <div className="md:w-2/3 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {data.login}
            </h2>
            <div className="space-y-2">
              {data.company && (
                <p className="text-gray-300">
                  <span className="font-semibold">Company:</span> {data.company}
                </p>
              )}
              {data.location && (
                <p className="text-gray-300">
                  <span className="font-semibold">Location:</span> {data.location}
                </p>
              )}
              <p className="text-gray-300">
                <span className="font-semibold">Followers:</span> {formatNumber(data.followers.totalCount)}
              </p>
              {data.websiteUrl && (
                <p className="text-gray-300">
                  <span className="font-semibold">Website:</span>{" "}
                  <a
                    href={data.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {data.websiteUrl}
                  </a>
                </p>
              )}
              {contributions.length > 0 && (
                <div>
                  <p className="text-gray-400 text-sm">Recent repos pushed to:</p>
                  <p
                    className="text-sm text-gray-300"
                    title={displayedRepos
                      .map(({repository}) => repository.nameWithOwner)
                      .join(", ")}
                  >
                    {displayedRepos
                      .map(({repository}) => repository.nameWithOwner)
                      .join(", ")}
                    {additionalCount > 0 && `, +${additionalCount} more`}
                  </p>
                </div>
              )}
              {data.lastActivityDate && (
                <p className="text-gray-300 text-sm">
                  <span className="font-semibold">Last activity:</span> {formatDistanceToNow(data.lastActivityDate, { addSuffix: true })}
                </p>
              )}
            </div>
          </div>
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => onExploreGraph(node.login)}
              className="flex-1 py-3 bg-yellow-500 text-white font-bold rounded-lg shadow hover:bg-yellow-400 transition-colors duration-300"
            >
              Explore Graph
            </button>
            <a
              href={`https://github.com/${node.login}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 text-center bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-400 transition-colors duration-300"
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