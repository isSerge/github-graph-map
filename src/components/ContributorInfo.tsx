// import { formatDistanceToNow } from "date-fns";
import { ContributorNode } from "../types";

interface ContributorInfoProps {
  contributor: ContributorNode;
}

const ContributorInfo: React.FC<ContributorInfoProps> = ({ contributor }) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="md:flex">
        {/* Visual/Icon Section */}
        <div className="p-4 flex items-center justify-center bg-gray-900">
          {/* You can replace the emoji with an SVG or avatar image */}
          <span className="text-5xl">👤</span>
        </div>
        {/* Details Section */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-3">
            {contributor.login}
          </h2>
          {/* <p className="text-gray-300 mb-2">
            <span className="font-semibold">Contributed Repos: </span>
            {contributor.contributedRepos.length}
          </p>
          {topRepo && (
            <>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Top Repo: </span>
                {topRepo.name}
              </p>
              <p className="text-gray-300 mb-4">
                <span className="font-semibold">Last Updated: </span>
                {formatDistanceToNow(new Date(topRepo.pushedAt), { addSuffix: true })}
              </p>
            </>
          )} */}
          <a
            href={`https://github.com/${contributor.login}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-400 transition-colors"
          >
            View Profile &rarr;
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContributorInfo;