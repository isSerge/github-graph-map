import { NodeProps, ComputedNode } from '@nivo/network'
import { ContributorNode as ContrNode, EitherNode, RepoNode } from '../../types/networkTypes'
import networkTheme from './theme'
import { useRepoDetails } from "../../hooks/useRepoDetails";
import { HELP_WANTED, countBeginnerFriendlyLabels, GOOD_FIRST_ISSUE, rateRepo, BEGINNER_FRIENDLY } from '../../utils/repoUtils';
import "./glow.css";
import { useContributorDetails } from '../../hooks/useContributorDetails';
import { ContributorDetails, RepoDetails } from '../../types';
import { formatNumber } from '../../utils/formatUtils';
import { formatDistanceToNow } from 'date-fns';

interface CustomNodeProps extends NodeProps<EitherNode> {
    onNodeClick?: (node: ComputedNode<EitherNode>) => void;
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

const getRepoTooltipContent = (data: RepoDetails | undefined) => {
    if (!data) return null;

    const labelCounts = countBeginnerFriendlyLabels(data.labels.nodes);
    const countGoodFirstIssue = labelCounts[GOOD_FIRST_ISSUE];
    const countHelpWanted = labelCounts[HELP_WANTED];
    const countBeginnerFriendly = labelCounts[BEGINNER_FRIENDLY];

    return `
    <div class="p-3">
      <p class="font-bold mb-2">${data.nameWithOwner}</p>
      <p class="text-gray-300 mb-2 inline-block">
        <span class="text-sm">⭐ </span>${formatNumber(data.stargazerCount)}
      </p>
      <p class="text-gray-300 mb-2 inline-block ml-4">
        <span class="text-sm">🍴 </span>${formatNumber(data.forkCount)}
      </p>
      <p class="text-gray-300 mb-2">
        <span class="text-sm">Active contributors (7d): </span>${data.contributors.length}
      </p>
      ${data.primaryLanguage ? `<p class="text-gray-300 mb-2">
        <span class="text-sm">Primary Language: </span>${data.primaryLanguage.name}
      </p>` : ""}
      <p class="text-gray-300 mb-2">
        <span class="text-sm">Pushed at: </span>${formatDistanceToNow(new Date(data.pushedAt), { addSuffix: true })}
      </p>
      <p class="text-gray-300 mb-2">
        <span class="text-sm">${countGoodFirstIssue > 0 ? "✅" : "❌"} </span>
        ${GOOD_FIRST_ISSUE} (${countGoodFirstIssue})
      </p>
      <p class="text-gray-300 mb-2">
        <span class="text-sm">${countHelpWanted > 0 ? "✅" : "❌"} </span>
        ${HELP_WANTED} (${countHelpWanted})
      </p>
      <p class="text-gray-300 mb-2">
        <span class="text-sm">${countBeginnerFriendly > 0 ? "✅" : "❌"} </span>
        ${BEGINNER_FRIENDLY} (${countBeginnerFriendly})
      </p>
      <p class="text-gray-300 mb-2">
        <span class="text-sm">${data.contributingFile ? "✅" : "❌"} </span>
        CONTRIBUTING.md
      </p>
    </div>
  `;
};

export const RepositoryNode = ({ node, onNodeClick }: CustomNodeProps) => {
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
            data-tooltip-html={getRepoTooltipContent(data)}
            data-tooltip-id="global-tooltip"
        >
            <circle r={10} fill={fillColor} stroke={networkTheme.linkColor} className={isFetching ? 'loading-glow' : ''} />
            <text y="20" textAnchor="middle" fontSize="12" fill={networkTheme.textColor}>
                {node.data.name}
            </text>
        </g>
    );
}


const getContributorTooltipContent = (data: ContributorDetails | undefined) => {
    if (!data) return null;

    const contributions = data.contributionsCollection.commitContributionsByRepository;
    const maxReposToShow = 3;
    const displayedRepos = contributions.slice(0, maxReposToShow);
    const additionalCount = contributions.length - maxReposToShow;

    return `
    <div class="p-4">
    <div class="flex items-center mb-3">
        <img src="${data.avatarUrl}" alt="${data.login}" class="w-16 h-16 rounded-full border-2 border-gray-700 object-cover" />
        <div class="ml-4">
          <p class="font-bold text-lg">${data.login}</p>
          <p class="text-gray-300">
            <span class="font-semibold">Followers:</span> ${formatNumber(data.followers.totalCount)}
          </p>
          ${data.lastActivityDate ? `<p class="text-gray-300 text-xs">
            <span class="font-semibold">Last activity:</span> ${formatDistanceToNow(data.lastActivityDate, { addSuffix: true })}
          </p>` : ""}
        </div>
      </div>
      ${contributions.length > 0 ? `
        <div>
          <p class="text-gray-400 text-sm mb-1">Recent repos pushed to:</p>
          <ul class="text-sm text-gray-300">
            ${displayedRepos.map(({ repository }) => `<li>${repository.nameWithOwner}</li>`).join('')}
            ${additionalCount > 0 ? `<li>+${additionalCount} more</li>` : ""}
          </ul>
        </div>
      ` : ""}
    </div>
  `;
};

export const ContributorNode = ({ node, onNodeClick }: CustomNodeProps) => {
    // TODO: use data in this component
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