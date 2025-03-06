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
      data-tooltip-html={getRepoTooltipContent(data)}
    >
      📦 {node.name}
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
}: SidebarNodeListProps) => (
  <aside className="w-60 p-2 overflow-y-auto">
    <h2 className="text-xl font-bold mb-4">Nodes</h2>
    <ul>
      {data.graph.nodes.map((node) =>
        isRepoNode(node)
          ? <RepoListItem node={node} handleSubmit={handleSubmit} key={node.id} timePeriod={timePeriod} />
          : <ContributorListItem node={node} handleSubmit={handleSubmit} key={node.id} timePeriod={timePeriod} />
      )}
    </ul>
  </aside>
);

export default SidebarNodeList;