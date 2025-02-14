import { ResponsiveNetwork, NetworkDataProps, NodeProps, ComputedNode } from '@nivo/network'
import { NetworkLink, RepoNode, EitherNode } from '../types'

const networkTheme = {
  background: "#1e2939",
  textColor: "#ffffff",
  linkColor: "#364153",
  selectedNodeColor: "rgb(255, 230, 0)",
  repoNodeColor: "rgb(97, 205, 187)",
  contributorNodeColor: "#f47560",
};

function isRepoNode(node: EitherNode): node is RepoNode {
  return node.type === "repo";
}

interface CustomNodeProps extends NodeProps<EitherNode> {
  onNodeClick?: (node: ComputedNode<EitherNode>) => void;
}

const RepositoryNode = ({ node, onNodeClick }: CustomNodeProps) => (
  <g
    transform={`translate(${node.x},${node.y})`}
    style={{ cursor: 'pointer' }}
    onClick={() => onNodeClick?.(node)}
  >
    <circle r={10} fill={node.color} stroke={networkTheme.linkColor} />
    <text y="20" textAnchor="middle" fontSize="12" fill={networkTheme.textColor}>
      {node.data.name.split("/")[1]}
    </text>
  </g>
);

const ContributorNode = ({ node, onNodeClick }: CustomNodeProps) => (
  <g
    transform={`translate(${node.x - 12},${node.y - 18})`}
    style={{ cursor: 'pointer' }}
    onClick={() => onNodeClick?.(node)}
  >
    <circle cx="12" cy="8" r="5" fill={node.color} stroke={networkTheme.linkColor} />
    <path d="M3,21 h18 C 21,12 3,12 3,21" fill={node.color} stroke={networkTheme.linkColor} />
    <text x="12" y="32" textAnchor="middle" fontSize="12" fill={networkTheme.textColor}>
      {node.data.name}
    </text>
  </g>
);

type NetworkProps = NetworkDataProps<EitherNode, NetworkLink> & {
  selectedNodeName: string;
  linkDistanceMultiplier?: number;
  repulsivity?: number;
  centeringStrength?: number;
  onNodeClick?: (node: ComputedNode<EitherNode>) => void;
};

function getNodeColor(selectedNodeName: string, node: EitherNode) {
  if (node.name === selectedNodeName) {
    return networkTheme.selectedNodeColor;
  } else if (isRepoNode(node)) {
    return networkTheme.repoNodeColor;
  }

  return networkTheme.contributorNodeColor;
}

const Network = ({
  selectedNodeName,
  data,
  linkDistanceMultiplier = 1,
  repulsivity = 300,
  centeringStrength = 0.5,
  onNodeClick,
}: NetworkProps) => (
  <ResponsiveNetwork
    theme={networkTheme}
    data={data}
    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
    // Multiply the default distance by the multiplier
    linkDistance={(e) => e.distance * linkDistanceMultiplier}
    nodeColor={(node) => getNodeColor(selectedNodeName, node)}
    repulsivity={repulsivity}
    centeringStrength={centeringStrength}
    nodeComponent={(props: NodeProps<EitherNode>) => 
      isRepoNode(props.node.data) 
      ? <RepositoryNode {...props} onNodeClick={onNodeClick} /> 
      : <ContributorNode {...props} onNodeClick={onNodeClick} />
    }
    nodeSize={10}
    linkColor={networkTheme.linkColor}
  />
)

export default Network