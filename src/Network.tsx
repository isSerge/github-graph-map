import { ResponsiveNetwork, NetworkDataProps, NodeProps } from '@nivo/network'
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

const NodeComponent = ({ node, onClick }:  NodeProps<Node>) => {
  const style = {
    cursor: 'pointer',
  }

  const repoNode = (
    <g transform={`translate(${node.x},${node.y})`} style={style} onClick={onClick ? event => onClick(node, event) : undefined}>
      <circle r={10} fill={node.color} />
      <text y="20" textAnchor="middle" fontSize="12" fill="#000000">
            {node.id}
        </text>
    </g>
  )

  const contributorNode = (
    <g transform={`translate(${node.x - 12},${node.y - 18})`} style={style} onClick={onClick ? event => onClick(node, event) : undefined}>
        <circle cx="12" cy="8" r="5" fill={node.color} stroke="#ffffff" />
        <path d="M3,21 h18 C 21,12 3,12 3,21" fill={node.color} stroke="#ffffff" />
        <text x="12" y="32" textAnchor="middle" fontSize="12" fill="#000000">
            {node.id}
        </text>
    </g>
);
  
  return isRepoNode(node.data) ? repoNode : contributorNode;
}

const Network = ({ data }: NetworkDataProps<Node, NetworkLink>) => (
    <ResponsiveNetwork
        theme={theme}
        data={data}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        linkDistance={e=>e.distance}
        nodeColor={e=>e.color}
        linkColor="rgb(255, 230, 0)"
        repulsivity={300}
        centeringStrength={0.5}
        nodeComponent={NodeComponent}
        onClick={(node) => console.log(node)}
    />
)

export default Network