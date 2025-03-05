import { GraphResponse } from "../hooks/useGraph";
import { EitherNode, RepoNode } from "../types";
import { isRepoNode } from '../utils/graphUtils'

interface SidebarNodeListProps {
  data: GraphResponse;
  handleSubmit: (value: string) => void;
}

interface ListItemProps {
  node: EitherNode;
  handleSubmit: (value: string) => void;
}

const RepoListItem = ({ node, handleSubmit }: ListItemProps) => (
  <li
    key={node.id}
    className="mb-2 cursor-pointer hover:underline"
    onClick={() => handleSubmit((node as RepoNode).nameWithOwner)}
  >
    📦 {node.name}
  </li>
);

const ContributorListItem = ({ node, handleSubmit }: ListItemProps) => (
  <li
    key={node.id}
    className="mb-2 cursor-pointer hover:underline"
    onClick={() => handleSubmit(node.name)}
  >
    👤 {node.name}
  </li>
);

const SidebarNodeList = ({
  data,
  handleSubmit,
}: SidebarNodeListProps) => (
  <aside className="w-50 bg-gray-900 p-2 overflow-y-auto">
    <h2 className="text-xl font-bold mb-4">Nodes</h2>
    <ul>
      {data.graph.nodes.map((node) =>
        isRepoNode(node)
          ? <RepoListItem node={node} handleSubmit={handleSubmit} />
          : <ContributorListItem node={node} handleSubmit={handleSubmit} />
      )}
    </ul>
  </aside>
);

export default SidebarNodeList;