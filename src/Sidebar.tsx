import { RepoData } from "./types";

type SidebarProps = {
  repo: RepoData | null;
};

const Sidebar: React.FC<SidebarProps> = ({ repo }) => {
  if (!repo) return null;

  return (
    <aside className="w-sm p-4 bg-gray-800 text-white overflow-auto">
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
    </aside>
  );
};

export default Sidebar;