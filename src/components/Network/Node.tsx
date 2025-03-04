import { NodeProps, ComputedNode } from '@nivo/network'
import { EitherNode } from '../../types/networkTypes'
import networkTheme from './theme'

interface CustomNodeProps extends NodeProps<EitherNode> {
    onNodeClick?: (node: ComputedNode<EitherNode>) => void;
}

export const RepositoryNode = ({ node, onNodeClick }: CustomNodeProps) => (
    <g
        transform={`translate(${node.x},${node.y})`}
        style={{ cursor: 'pointer' }}
        onClick={() => onNodeClick?.(node)}
    >
        <circle r={10} fill={node.color} stroke={networkTheme.linkColor} />
        <text y="20" textAnchor="middle" fontSize="12" fill={networkTheme.textColor}>
            {node.data.name}
        </text>
    </g>
);

export const ContributorNode = ({ node, onNodeClick }: CustomNodeProps) => (
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