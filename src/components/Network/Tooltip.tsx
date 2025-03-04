import { ContributorNode, EitherNode, RepoNode } from "../../types";
import { useRepoDetails } from "../../hooks/useRepoDetails";

interface TooltipProps {
  node: EitherNode;
  position: { x: number; y: number };
}

interface ContributorTooltipProps extends TooltipProps {
  node: ContributorNode;
}

const ContributorTooltip = ({ node, position }: ContributorTooltipProps) => {
  return (
    <div
      className="absolute bg-gray-900 text-white p-2 rounded shadow-lg text-sm pointer-events-none z-50"
      style={{ top: position.y + 10, left: position.x + 10 }}
    >
      <p className="font-bold">{node.name}</p>
      <p className="text-xs">Contributor</p>
    </div>
  );
};

interface RepoTooltipProps extends TooltipProps {
  node: RepoNode;
}

const RepoTooltip = ({ node, position }: RepoTooltipProps) => {
  const { data } = useRepoDetails(node.nameWithOwner);

  console.log(data)

  return (
    <div
      className="absolute bg-gray-900 text-white p-2 rounded shadow-lg text-sm pointer-events-none z-50"
      style={{ top: position.y + 10, left: position.x + 10 }}
    >
      <p className="font-bold">{node.name}</p>
      <p className="text-xs">Repo: {node.nameWithOwner}</p>
    </div>
  );
};

const Tooltip = ({ node, position }: TooltipProps) => {
  if (node.type === "contributor") {
    return <ContributorTooltip node={node} position={position} />;
  } else {
    return <RepoTooltip node={node} position={position} />;
  }
}

export default Tooltip;