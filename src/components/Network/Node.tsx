import { NodeProps, ComputedNode } from '@nivo/network'
import { EitherNode, RepoNode } from '../../types/networkTypes'
import networkTheme from './theme'
import { useRepoDetails } from "../../hooks/useRepoDetails";
import { rateRepo } from '../../utils/repoUtils';
import "./glow.css";

interface CustomNodeProps extends NodeProps<EitherNode> {
    onNodeClick?: (node: ComputedNode<EitherNode>) => void;
    onMouseEnter?: (node: ComputedNode<EitherNode>) => void;
    onMouseLeave?: (node: ComputedNode<EitherNode>) => void;
}

function setRgbAlpha(rgb: string, alpha: number): string {
    // Expect input like "rgb(97, 205, 187)"
    const matches = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!matches) {
        return rgb; // Fallback in case parsing fails.
    }
    const [, r, g, b] = matches;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const RepositoryNode = ({ node, onNodeClick, onMouseEnter, onMouseLeave }: CustomNodeProps) => {
    const { data, isFetching } = useRepoDetails((node.data as RepoNode).nameWithOwner);
    const score = data ? rateRepo(data) : 0;
    // Map score (assumed between 0 and 20) to an alpha between 0.6 and 1.0:
    const alpha = 0.6 + (score / 20) * 0.4;
    const fillColor = setRgbAlpha(node.color, alpha);

    return (
        <g
            transform={`translate(${node.x},${node.y})`}
            style={{ cursor: 'pointer' }}
            onClick={() => onNodeClick?.(node)}
            onMouseEnter={() => onMouseEnter?.(node)}
            onMouseLeave={() => onMouseLeave?.(node)}
        >
            <circle r={10} fill={fillColor} stroke={networkTheme.linkColor} className={isFetching ? 'loading-glow' : ''} />
            <text y="20" textAnchor="middle" fontSize="12" fill={networkTheme.textColor}>
                {node.data.name}
            </text>
        </g>
    );
}

export const ContributorNode = ({ node, onNodeClick, onMouseEnter, onMouseLeave }: CustomNodeProps) => (
    <g
        transform={`translate(${node.x - 12},${node.y - 18})`}
        style={{ cursor: 'pointer' }}
        onClick={() => onNodeClick?.(node)}
        onMouseEnter={() => onMouseEnter?.(node)}
        onMouseLeave={() => onMouseLeave?.(node)}
    >
        <circle cx="12" cy="8" r="5" fill={node.color} stroke={networkTheme.linkColor} />
        <path d="M3,21 h18 C 21,12 3,12 3,21" fill={node.color} stroke={networkTheme.linkColor} />
        <text x="12" y="32" textAnchor="middle" fontSize="12" fill={networkTheme.textColor}>
            {node.data.name}
        </text>
    </g>
);