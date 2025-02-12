import { ResponsiveNetwork, NetworkDataProps, NodeProps, ComputedNode } from '@nivo/network'
import { NetworkLink, RepoNode, ContributorNode } from './types'

const networkTheme = {
  background: "#1e2939",
  textColor: "#ffffff",
  linkColor: "#364153",
};

type Node = RepoNode | ContributorNode;

function isRepoNode(node: Node): node is RepoNode {
  return (node as RepoNode).stargazerCount !== undefined
    && (node as RepoNode).name !== undefined
    && (node as RepoNode).url !== undefined
}

interface CustomNodeProps extends NodeProps<Node> {
  onRepoNodeClick?: (node: ComputedNode<RepoNode>) => void;
}

const NodeComponent = ({ node, onRepoNodeClick }: CustomNodeProps) => {
  const isRepository = isRepoNode(node.data);
  const commonStyle = { cursor: 'pointer' };

  const handleClick = () => {
    if (isRepository) {
      // If it's a repo node, update repoInput via callback.
      onRepoNodeClick?.(node as ComputedNode<RepoNode>);
    } else {
      // For contributor nodes, you might handle this differently.
      console.log("Contributor node clicked", node);
    }
  };

  const repoNode = (
    <g transform={`translate(${node.x},${node.y})`} style={commonStyle} onClick={handleClick}>
      <circle r={10} fill={node.color} stroke={networkTheme.linkColor} />
      <text y="20" textAnchor="middle" fontSize="12" fill={networkTheme.textColor}>
        {node.id}
      </text>
    </g>
  )

  const contributorNode = (
    <g transform={`translate(${node.x - 12},${node.y - 18})`} style={commonStyle} onClick={handleClick}>
      <circle cx="12" cy="8" r="5" fill={node.color} stroke={networkTheme.linkColor} />
      <path d="M3,21 h18 C 21,12 3,12 3,21" fill={node.color} stroke={networkTheme.linkColor} />
      <text x="12" y="32" textAnchor="middle" fontSize="12" fill={networkTheme.textColor}>
        {node.id}
      </text>
    </g>
  );

  return isRepository ? repoNode : contributorNode;
}

type NetworkProps = NetworkDataProps<Node, NetworkLink> & {
  linkDistanceMultiplier?: number;
  repulsivity?: number;
  centeringStrength?: number;
  onRepoNodeClick?: (node: ComputedNode<RepoNode>) => void;
};

const Network = ({
  data,
  linkDistanceMultiplier = 1,
  repulsivity = 300,
  centeringStrength = 0.5,
  onRepoNodeClick,
}: NetworkProps) => (
  <ResponsiveNetwork
    theme={networkTheme}
    data={data}
    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
    // Multiply the default distance by the multiplier
    linkDistance={(e) => e.distance * linkDistanceMultiplier}
    nodeColor={e => e.color}
    repulsivity={repulsivity}
    centeringStrength={centeringStrength}
    nodeComponent={(props: NodeProps<Node>) => (
      <NodeComponent {...props} onRepoNodeClick={onRepoNodeClick} />
    )}
    onClick={(node) => console.log(node)}
    nodeSize={10}
    linkColor={networkTheme.linkColor}
  />
)

export default Network