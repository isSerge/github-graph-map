import { RepoNode, ContributorNode, EitherNode } from "../types";
import { formatNumber } from "../utils";

interface ExploreListsProps {
  onSelect: (node: EitherNode) => void;
}

const ExploreLists: React.FC<ExploreListsProps> = ({ onSelect }) => {
  const repoList: RepoNode[] = [
    {
      id: "repo1",
      name: "facebook/react",
      stargazerCount: 200000,
      description: "A JavaScript library for building user interfaces",
      primaryLanguage: { name: "JavaScript" },
      url: "https://github.com/facebook/react",
      owner: { login: "facebook" },
      pushedAt: new Date().toISOString(),
      type: "repo",
    },
    {
      id: "repo2",
      name: "vuejs/vue",
      stargazerCount: 190000,
      description: "The Progressive JavaScript Framework",
      primaryLanguage: { name: "JavaScript" },
      url: "https://github.com/vuejs/vue",
      owner: { login: "vuejs" },
      pushedAt: new Date().toISOString(),
      type: "repo",
    },
  ];

  const contributorList: ContributorNode[] = [
    {
      id: "contrib1",
      name: "torvalds",
      login: "torvalds",
      avatarUrl: "https://avatars.githubusercontent.com/u/1024025?v=4",
      company: "Linux Foundation",
      email: "",
      followers: { totalCount: 120000 },
      following: { totalCount: 0 },
      location: "Portland, OR",
      organizations: { nodes: [{ login: "linux" }] },
      websiteUrl: "https://github.com/torvalds",
      topRepositories: { totalCount: 5, nodes: [] },
      repositoriesContributedTo: { totalCount: 100, nodes: [] },
      type: "contributor",
    },
    {
      id: "contrib2",
      name: "gaearon",
      login: "gaearon",
      avatarUrl: "https://avatars.githubusercontent.com/u/810438?v=4",
      company: "Facebook",
      email: "",
      followers: { totalCount: 60000 },
      following: { totalCount: 100 },
      location: "San Francisco",
      organizations: { nodes: [{ login: "facebook" }] },
      websiteUrl: "https://github.com/gaearon",
      topRepositories: { totalCount: 10, nodes: [] },
      repositoriesContributedTo: { totalCount: 50, nodes: [] },
      type: "contributor",
    },
  ];

  return (
    <div className="flex gap-8 p-8">
      {/* Repositories Column */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-4">Explore repositories...</h2>
        <ul className="space-y-4">
          {repoList.map((repo) => (
            <li
              key={repo.id}
              onClick={() => onSelect(repo)}
              className="p-4 bg-gray-700 rounded cursor-pointer hover:bg-gray-600 transition-colors min-h-[120px]"
            >
              <p className="font-bold text-white">{repo.name}</p>
              <p className="text-gray-300 text-sm">{repo.description}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Contributors Column */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-4">Explore contributors...</h2>
        <ul className="space-y-4">
          {contributorList.map((contributor) => (
            <li
              key={contributor.id}
              onClick={() => onSelect(contributor)}
              className="p-4 bg-gray-700 rounded cursor-pointer hover:bg-gray-600 transition-colors flex items-center gap-4 min-h-[120px]"
            >
              <img
                src={contributor.avatarUrl}
                alt={contributor.login}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-bold text-white">{contributor.login}</p>
                <p className="text-gray-300 text-sm">
                  Followers: {formatNumber(contributor.followers.totalCount)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExploreLists;