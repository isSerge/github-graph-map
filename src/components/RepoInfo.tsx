import { formatDistanceToNow } from "date-fns";

import { RepoNode } from "../types";
import { formatNumber } from "../utils";

interface RepoInfoProps {
  repo: RepoNode;
  onSeeGraph: () => void;
}

const RepoInfo = ({ repo, onSeeGraph }: RepoInfoProps) => {
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
          <p className="text-gray-300 mb-2">
            {formatNumber(repo.stargazerCount)}
            <span className="font-semibold"> ⭐</span>
          </p>
          <p className="text-gray-300 mb-2">
            <span className="font-semibold">Primary Language: </span>
            {repo.primaryLanguage.name}
          </p>
          <p className="text-gray-300 mb-2">
            <span className="font-semibold">Pushed at: </span>
            {formatDistanceToNow(new Date(repo.pushedAt), { addSuffix: true })}
          </p>
          {repo.description && (
            <p className="text-gray-300 mb-4">{repo.description}</p>
          )}
          <div className="flex gap-2 mt-4">
            <button
              onClick={onSeeGraph}
              className="flex-1 text-center px-6 py-3 bg-yellow-500 text-white font-bold rounded shadow-lg hover:bg-yellow-400 transition-colors duration-300"
            >
              See Graph
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