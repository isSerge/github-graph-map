import { formatDistanceToNow } from "date-fns";

import { useRepoDetails } from "../hooks/useRepoDetails";
import { RepoNode } from "../types";
import {
  countBeginnerFriendlyLabels, 
  GOOD_FIRST_ISSUE,
  HELP_WANTED,
  BEGINNER_FRIENDLY
} from "../utils/repoUtils";
import { formatNumber } from "../utils/formatUtils";
import LoadingSpinner from "./LoadingSpinner";
import { getErrorMessage } from "../utils/errorUtils";

interface RepoInfoProps {
  node: RepoNode;
  onExploreGraph: (name: string) => void;
}

const RepoInfo = ({ node, onExploreGraph }: RepoInfoProps) => {
  const { isFetching, error, data } = useRepoDetails(node.nameWithOwner);

  if (isFetching) return <LoadingSpinner />;
  // TODO: proper component for error state
  if (error) return <p className="text-red-500">{getErrorMessage(error)}</p>;
  if (!data) return null;

  const labelCounts = countBeginnerFriendlyLabels(data.labels.nodes);
  const countGoodFirstIssue = labelCounts[GOOD_FIRST_ISSUE];
  const countHelpWanted = labelCounts[HELP_WANTED];
  const countBeginnerFriendly = labelCounts[BEGINNER_FRIENDLY];

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="md:flex">
        {/* Icon/Visual Section */}
        <div className="p-4 flex items-center justify-center bg-gray-900">
          <span className="text-5xl">📦</span>
        </div>
        {/* Details Section */}
        <div className="p-6 grow">
          <h2 className="text-2xl font-bold text-white mb-3">
            {data.name}
          </h2>
          <div>
            <p className="text-gray-300 mb-2 inline-block">
              <span className="font-semibold">⭐&nbsp;</span>
              {formatNumber(data.stargazerCount)}
            </p>
            <p className="text-gray-300 mb-2 inline-block ml-4">
              <span className="font-semibold">🍴&nbsp;</span>
              {formatNumber(data.forkCount)}
            </p>
          </div>
          {data.description && (
            <p className="text-gray-300 mb-2">{data.description}</p>
          )}
          {data.primaryLanguage && (
            <p className="text-gray-300 mb-2">
              <span className="font-semibold">Primary Language:&nbsp;</span>
              {data.primaryLanguage.name}
            </p>
          )}
          <p className="text-gray-300 mb-2">
            <span className="font-semibold">Pushed at:&nbsp;</span>
            {formatDistanceToNow(new Date(data.pushedAt), { addSuffix: true })}
          </p>
          <p className="text-gray-300 mb-2">
            <span className="font-semibold">Issues open</span>&nbsp;(7d):&nbsp;
            {data.issues.totalCount}
          </p>
          <p className="text-gray-300 mb-2">
            <span className="font-semibold">PRs</span>&nbsp;(7d):&nbsp;
            {data.pullRequests.totalCount} open, {data.pullRequests.nodes.filter((pr) => pr.merged).length} merged
          </p>
          <p className="text-gray-300 mb-2">
            <span className="font-semibold">
              {countGoodFirstIssue > 0 ? "✅" : "❌"}&nbsp;
            </span>
            {GOOD_FIRST_ISSUE} ({countGoodFirstIssue})
          </p>
          <p className="text-gray-300 mb-2">
            <span className="font-semibold">
              {countHelpWanted > 0 ? "✅" : "❌"}&nbsp;
            </span>
            {HELP_WANTED} ({countHelpWanted})
          </p>
          <p className="text-gray-300 mb-2">
            <span className="font-semibold">
              {countBeginnerFriendly > 0 ? "✅" : "❌"}&nbsp;
            </span>
            {BEGINNER_FRIENDLY} ({countBeginnerFriendly})
          </p>
          <p className="text-gray-300 mb-2">
            <span className="font-semibold">{data.contributingFile ? "✅" : "❌"}&nbsp;</span>
            CONTRIBUTING.md
          </p>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onExploreGraph(node.nameWithOwner)}
              className="flex-1 text-center px-6 py-3 bg-yellow-500 text-white font-bold rounded shadow-lg hover:bg-yellow-400 transition-colors duration-300"
            >
              Explore Graph
            </button>
            <a
              href={node.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center px-6 py-3 border border-blue-500 text-blue-500 rounded shadow-lg hover:bg-blue-500 hover:text-white transition-colors duration-300"
            >
              View on GitHub &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepoInfo;