import { NodeProps, ComputedNode } from '@nivo/network'
import { ContributorNode as ContrNode, EitherNode, RepoNode } from '../../types/networkTypes'
import networkTheme from './theme'
import { useRepoDetails } from "../../hooks/useRepoDetails";
import { useContributorDetails } from '../../hooks/useContributorDetails';
import { getRepoTooltipContent, getContributorTooltipContent } from '../../utils/tooltipsUtils';
import "./glow.css";

interface CustomNodeProps extends NodeProps<EitherNode> {
  onNodeClick?: (node: ComputedNode<EitherNode>) => void;
  timePeriod: number;
  isMain?: boolean;
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

export const RepositoryNode = ({ node, onNodeClick, timePeriod, isMain }: CustomNodeProps) => {
  const { data, isFetching } = useRepoDetails((node.data as RepoNode).nameWithOwner, timePeriod);
  // Assume data.score is between 0 and 100; default to 0 if not available.
  const score = data?.score ?? 0;

  // For non-main nodes, adjust opacity:
  let alpha = 1.0;
  let glowClass = "";
  if (!isMain) {
    // If score is below 50, map from 0.5 (at 0) to 1.0 (at 50)
    alpha = score < 50 ? 0.5 + (score / 50) * 0.5 : 1.0;
    // If score is 70 or above, add a glow effect
    glowClass = score >= 70 ? "glow-effect" : "";
  }

  const fillColor = setRgbAlpha(node.color, alpha);


  return (
    <g
      transform={`translate(${node.x},${node.y})`}
      style={{ cursor: 'pointer' }}
      onClick={() => onNodeClick?.(node)}
      data-tooltip-html={getRepoTooltipContent(data, timePeriod)}
      data-tooltip-id="global-tooltip"
    >
      <circle r={10} fill={fillColor} stroke={networkTheme.linkColor} className={`${isFetching ? 'loading-pulse' : ''} ${glowClass}`} />
      <text y="20" textAnchor="middle" fontSize="12" fill={networkTheme.textColor}>
        {node.data.name}
      </text>
    </g>
  );
}

export const ContributorNode = ({ node, onNodeClick }: CustomNodeProps) => {
  const { data } = useContributorDetails((node.data as ContrNode).name);

  return (
    <g
      transform={`translate(${node.x - 12},${node.y - 18})`}
      style={{ cursor: 'pointer' }}
      onClick={() => onNodeClick?.(node)}
      data-tooltip-id="global-tooltip"
      data-tooltip-html={getContributorTooltipContent(data)}
    >
      <circle cx="12" cy="8" r="5" fill={node.color} stroke={networkTheme.linkColor} />
      <path d="M3,21 h18 C 21,12 3,12 3,21" fill={node.color} stroke={networkTheme.linkColor} />
      <text x="12" y="32" textAnchor="middle" fontSize="12" fill={networkTheme.textColor}>
        {node.data.name}
      </text>
    </g>
  )
};