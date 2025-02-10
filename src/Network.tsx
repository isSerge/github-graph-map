import { ResponsiveNetwork, NetworkDataProps, NodeTooltipProps } from '@nivo/network'
import { NetworkLink, RepoNode, ContributorNode } from './types'

const theme = {
  background: '#fff',
  tooltip: {
    container: {
      color: 'black',
    }
  }
}

type Node = RepoNode | ContributorNode;

function isRepoNode(node: Node): node is RepoNode {
  return (node as RepoNode).stargazerCount !== undefined;
}

const Tooltip = ({ node }: NodeTooltipProps<Node>) => (
  <div
      style={{
          background: node.color,
          color: '#000000',
          padding: '9px 12px',
          borderRadius: '2px',
          boxShadow: '0 3px 9px rgba(0, 0, 0, .35)',
      }}
  >
      <strong>{node.id}</strong>
      <br />
      {isRepoNode(node.data) && (
          <span>
              {node.data.stargazerCount} stargazers
              <br />
          </span>
      )}
  </div>
)

const Network = ({ data }: NetworkDataProps<Node, NetworkLink>) => (
    <ResponsiveNetwork
        theme={theme}
        data={data}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        linkDistance={e=>e.distance}
        nodeColor={e=>e.color}
        linkColor="rgb(255, 230, 0)"
        repulsivity={200}
        centeringStrength={0.5}
        nodeTooltip={Tooltip}
    />
)

export default Network