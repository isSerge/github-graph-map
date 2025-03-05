import { NodeProps, ComputedNode } from '@nivo/network'
import { EitherNode, RepoNode } from '../../types/networkTypes'
import networkTheme from './theme'
import { useRepoDetails } from "../../hooks/useRepoDetails";
import { rateRepo } from '../../utils/repoUtils';

interface CustomNodeProps extends NodeProps<EitherNode> {
  onNodeClick?: (node: ComputedNode<EitherNode>) => void;
  onMouseEnter?: (node: ComputedNode<EitherNode>) => void;
  onMouseLeave?: (node: ComputedNode<EitherNode>) => void;
}

// Helper: convert polar coordinates to Cartesian.
function polarToCartesian(cx: number, cy: number, r: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians)
  };
}

// Helper: describe an arc as an SVG path.
// The arc goes from startAngle to endAngle (in degrees).
function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} L ${cx} ${cy} Z`;
}

export const RepositoryNode = ({ node, onNodeClick, onMouseEnter, onMouseLeave }: CustomNodeProps) => {
  const { data } = useRepoDetails((node.data as RepoNode).nameWithOwner);
  const score = data ? rateRepo(data) : 0;

  console.log(data)

  // Define center and radius for our circle.
  const cx = 0;
  const cy = 0;
  const r = 10;

  // Each slice ideally spans 120°; adjust each by halfMargin.
  const arc1 = describeArc(cx + 1, cy - 1, r, 0, 90);
  const arc2 = describeArc(cx + 1, cy + 1, r, 90, 180);
  const arc3 = describeArc(cx -1, cy + 1, r, 180, 270);
  const arc4 = describeArc(cx -1, cy -1, r, 270, 360);

  return (
    <g
      transform={`translate(${node.x},${node.y})`}
      style={{ cursor: 'pointer' }}
      onClick={() => onNodeClick?.(node)}
      onMouseEnter={() => onMouseEnter?.(node)}
      onMouseLeave={() => onMouseLeave?.(node)}
    >
      <circle cx={cx} cy={cy} r={r + 4} fill={networkTheme.linkColor} />
      {/* Arc for beginner-friendly criteria */}
      <path d={arc1} fill={'#4CAF50'} />
      {/* Arc for CONTRIBUTING.md criteria */}
      <path d={arc2} fill={'yellow'} />
      {/* Arc for active community criteria */}
      <path d={arc3} fill={'#F44336'} />
      <path d={arc4} fill={'#F44336'} />
      <text y="25" textAnchor="middle" fontSize="12" fill={networkTheme.textColor}>
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