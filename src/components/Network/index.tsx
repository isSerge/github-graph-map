import { ResponsiveNetwork, NetworkDataProps, NodeProps, ComputedNode } from '@nivo/network'
import { NetworkLink, EitherNode } from '../../types/networkTypes'
import { RepositoryNode, ContributorNode } from './Node'
import networkTheme from './theme'
import { isRepoNode } from '../../utils/graphUtils'

type NetworkProps = NetworkDataProps<EitherNode, NetworkLink> & {
  selectedNodeId: string;
  linkDistanceMultiplier?: number;
  repulsivity?: number;
  centeringStrength?: number;
  onNodeClick?: (node: ComputedNode<EitherNode>) => void;
  timePeriod: number;
};

function getNodeColor(selectedNodeId: string, node: EitherNode) {
  if (node.id === selectedNodeId) {
    return networkTheme.selectedNodeColor;
  } else if (isRepoNode(node)) {
    return networkTheme.repoNodeColor;
  }

  return networkTheme.contributorNodeColor;
}

const Network = ({
  selectedNodeId,
  data,
  linkDistanceMultiplier = 1,
  repulsivity = 300,
  centeringStrength = 0.5,
  onNodeClick,
  timePeriod,
}: NetworkProps) => {
  const contributorNodesCount = data.nodes.filter((node) => !isRepoNode(node)).length;

  return (
    <ResponsiveNetwork
      theme={networkTheme}
      data={data}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      // Multiply the default distance by the multiplier
      linkDistance={(e) => e.distance * linkDistanceMultiplier}
      nodeColor={(node) => getNodeColor(selectedNodeId, node)}
      repulsivity={repulsivity}
      centeringStrength={centeringStrength}
      nodeComponent={(props: NodeProps<EitherNode>) =>
        isRepoNode(props.node.data)
          ? <RepositoryNode {...props} onNodeClick={onNodeClick} timePeriod={timePeriod} isMain={props.node.id === selectedNodeId} />
          : <ContributorNode {...props} onNodeClick={onNodeClick} timePeriod={timePeriod} />
      }
      nodeSize={10}
      linkColor={networkTheme.linkColor}
      linkThickness={(link) => contributorNodesCount > 1 ? link.data.thickness || 1 : 1}
    />
  )
}

export default Network