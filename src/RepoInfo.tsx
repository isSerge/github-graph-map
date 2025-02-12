import { RepoData } from "./types";

interface RepoInfoProps {
  repo: RepoData;
}

const RepoInfo = ({ repo }: RepoInfoProps) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Repository Info</h2>
      <div className="mb-2">
        <span className="font-semibold">Name: </span>
        {repo.name}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Stars: </span>
        {repo.stargazerCount}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Primary Language: </span>
        {repo.primaryLanguage.name}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Description: </span>
        {repo.description}
      </div>
      <div className="mb-2">
        <span className="font-semibold">URL: </span>
        <a
          href={repo.url}
          className="text-blue-400 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {repo.url}
        </a>
      </div>
    </div>
  )
}

export default RepoInfo;