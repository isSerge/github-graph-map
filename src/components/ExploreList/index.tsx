import ExploreRepoItem from "./ExploreRepoItem";
import ExploreContributorItem from "./ExploreContributorItem";
import { useFreshRepos } from "../../hooks/useFreshRepos";
import { useActiveContributors } from "../../hooks/useActiveContributors";
import { getErrorMessage } from "../../utils/errorUtils";

interface ExploreListsProps {
    onSelect: (nodeName: string) => void;
}

const ExploreLists: React.FC<ExploreListsProps> = ({ onSelect }) => {
    const repos = useFreshRepos();
    const contributors = useActiveContributors();

    return (
        <div className="flex gap-8 p-8">
            {/* Repositories Column */}
            <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">Explore repositories...</h2>
                {repos.isFetching && <p className="text-gray-300">Loading repositories…</p>}
                {repos.error ? <p className="text-red-500">{getErrorMessage(repos.error)}</p> : null}
                {!repos.isFetching && !repos.error && (
                    <ul className="space-y-4">
                        {repos.data?.map((repo) => (
                            <ExploreRepoItem key={repo.id} repo={repo} onSelect={onSelect} />
                        ))}
                    </ul>
                )}
            </div>

            {/* Contributors Column */}
            <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">Explore contributors...</h2>
                {contributors.isFetching && <p className="text-gray-300">Loading contributors</p>}
                {contributors.error ? <p className="text-red-500">{getErrorMessage(contributors.error)}</p> : null}
                {!contributors.isFetching && !contributors.error && (
                    <ul className="space-y-4">
                        {contributors.data?.slice(0, 3).map((contributor) => (
                            <ExploreContributorItem
                                key={contributor.id}
                                contributor={contributor}
                                onSelect={onSelect}
                            />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ExploreLists;