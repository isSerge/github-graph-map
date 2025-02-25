import { formatDistanceToNow } from "date-fns";

import { RepoNode } from "../types";
import { formatNumber } from "../utils";

interface RepoInfoProps {
  repo: RepoNode;
  onExploreGraph: (name: string) => void;
}

const goodFirstIssue = "good first issue";
const helpWanted = "help wanted";
const beginnerFriendly = "beginner friendly";

/**
 * Count the number of issues for each beginner-friendly label.
 * Returns an object mapping the label to its total issues count.
 */
const countBeginnerFriendlyLabels = (
  labels: { name: string; issues: { totalCount: number } }[]
): Record<string, number> => {
  const counts: Record<string, number> = {
    [goodFirstIssue]: 0,
    [helpWanted]: 0,
    [beginnerFriendly]: 0,
  };

  labels.forEach(({ name, issues }) => {
    const lowerName = name.toLowerCase();
    if (lowerName === goodFirstIssue || lowerName === helpWanted || lowerName === beginnerFriendly) {
      counts[lowerName] += issues.totalCount;
    }
  });

  return counts;
};

const RepoInfo = ({ repo, onExploreGraph }: RepoInfoProps) => {
  const labelCounts = countBeginnerFriendlyLabels(repo.labels.nodes);
  const countGoodFirstIssue = labelCounts[goodFirstIssue];
  const countHelpWanted = labelCounts[helpWanted];
  const countBeginnerFriendly = labelCounts[beginnerFriendly];

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
            {repo.name}
          </h2>
          <div>
            <p className="text-gray-300 mb-2 inline-block">
              <span className="font-semibold">⭐&nbsp;</span>
              {formatNumber(repo.stargazerCount)}
            </p>
            <p className="text-gray-300 mb-2 inline-block ml-4">
              <span className="font-semibold">🍴&nbsp;</span>
              {formatNumber(repo.forkCount)}
            </p>
          </div>
          {repo.description && (
            <p className="text-gray-300 mb-2">{repo.description}</p>
          )}
          {repo.primaryLanguage && (
            <p className="text-gray-300 mb-2">
              <span className="font-semibold">Primary Language:&nbsp;</span>
              {repo.primaryLanguage.name}
            </p>
          )}
          <p className="text-gray-300 mb-2">
            <span className="font-semibold">Pushed at:&nbsp;</span>
            {formatDistanceToNow(new Date(repo.pushedAt), { addSuffix: true })}
          </p>
          <p className="text-gray-300 mb-2">
            <span className="font-semibold">Issues open</span>&nbsp;(7d):&nbsp;
            {repo.issues.totalCount}
          </p>
          <p className="text-gray-300 mb-2">
            <span className="font-semibold">PRs</span>&nbsp;(7d):&nbsp;
            {repo.pullRequests.totalCount} open, {repo.pullRequests.nodes.filter((pr) => pr.merged).length} merged
          </p>
          <p className="text-gray-300 mb-2">
            <span className="font-semibold">
              {countGoodFirstIssue > 0 ? "✅" : "❌"}&nbsp;
            </span>
            {goodFirstIssue} ({countGoodFirstIssue})
          </p>
          <p className="text-gray-300 mb-2">
            <span className="font-semibold">
              {countHelpWanted > 0 ? "✅" : "❌"}&nbsp;
            </span>
            {helpWanted} ({countHelpWanted})
          </p>
          <p className="text-gray-300 mb-2">
            <span className="font-semibold">
              {countBeginnerFriendly > 0 ? "✅" : "❌"}&nbsp;
            </span>
            {beginnerFriendly} ({countBeginnerFriendly})
          </p>
          <p className="text-gray-300 mb-2">
            <span className="font-semibold">{repo.contributingFile ? "✅" : "❌"}&nbsp;</span>
            CONTRIBUTING.md
          </p>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onExploreGraph(repo.nameWithOwner)}
              className="flex-1 text-center px-6 py-3 bg-yellow-500 text-white font-bold rounded shadow-lg hover:bg-yellow-400 transition-colors duration-300"
            >
              Explore Graph
            </button>
            <a
              href={repo.url}
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