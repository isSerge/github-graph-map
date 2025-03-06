import { GraphResponse } from "../hooks/useGraph";
import { ContributorNode, EitherNode, RepoNode } from "../types";
import { isRepoNode } from '../utils/graphUtils'
import { useRepoDetails } from "../hooks/useRepoDetails";
import { useContributorDetails } from '../hooks/useContributorDetails';
import { getRepoTooltipContent, getContributorTooltipContent } from '../utils/tooltipsUtils';

interface SidebarNodeListProps {
  data: GraphResponse;
  handleSubmit: (value: string) => void;
  timePeriod: number;
}

interface ListItemProps {
  node: EitherNode;
  handleSubmit: (value: string) => void;
  timePeriod: number;
}

const RepoListItem = ({ node, handleSubmit, timePeriod }: ListItemProps) => {
  const { data } = useRepoDetails((node as RepoNode).nameWithOwner, timePeriod);
  return (
    <li
      key={node.id}
      className="mb-2 cursor-pointer hover:underline text-nowrap"
      onClick={() => handleSubmit((node as RepoNode).nameWithOwner)}
      data-tooltip-id="global-tooltip"
      data-tooltip-html={getRepoTooltipContent(data, timePeriod)}
    >
      📦 {node.name} ({data?.score.toFixed(1)})
    </li>
  );
}

const ContributorListItem = ({ node, handleSubmit }: ListItemProps) => {
  const { data } = useContributorDetails((node as ContributorNode).name);
  return (
    <li
      key={node.id}
      className="mb-2 cursor-pointer hover:underline text-nowrap"
      onClick={() => handleSubmit(node.name)}
      data-tooltip-id="global-tooltip"
      data-tooltip-html={getContributorTooltipContent(data)}
    >
      👤 {node.name}
    </li>
  )
};

const SidebarNodeList = ({
  data,
  handleSubmit,
  timePeriod,
}: SidebarNodeListProps) => {
  // Split nodes into repositories and contributors.
  const [repositories, contributors] = data.graph.nodes.reduce(
    ([repos, contrs], node) => {
      return isRepoNode(node)
        ? [[...repos, node], contrs]
        : [repos, [...contrs, node]];
    },
    [[], []] as [RepoNode[], ContributorNode[]]
  );

  return (
    <aside className="w-60 p-2 overflow-y-auto overflow-x-hidden">
      <h2 className="text-xl font-bold mb-2">Contributors</h2>
      <ul className="mb-4">
        {contributors.map((node) =>
          <ContributorListItem node={node} handleSubmit={handleSubmit} key={node.id} timePeriod={timePeriod} />
        )}
      </ul>
      <h2 className="text-xl font-bold mb-2">Repositories</h2>
      <ul className="mb-4">
        {repositories.map((node) =>
          <RepoListItem node={node} handleSubmit={handleSubmit} key={node.id} timePeriod={timePeriod} />
        )}
      </ul>
    </aside>
  )
};

export default SidebarNodeList;