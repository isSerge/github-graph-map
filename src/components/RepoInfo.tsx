import { formatDistanceToNow } from 'date-fns';

import { RepoNode } from "../types";

interface RepoInfoProps {
  repo: RepoNode;
}

const RepoInfo = ({ repo }: RepoInfoProps) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="md:flex">
        {/* Icon/Visual */}
        <div className="p-4 flex items-center justify-center bg-gray-900">
          <span className="text-5xl">📦</span>
        </div>
        {/* Details */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-3">
            {repo.name}
          </h2>
          <p className="text-gray-300 mb-2">
            {repo.stargazerCount}
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
            <p className="text-gray-300 mb-4">
              {repo.description}
            </p>
          )}
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-400 transition-colors"
          >
            View on GitHub &rarr;
          </a>
        </div>
      </div>
    </div>
  );
};

export default RepoInfo;