import { formatDistanceToNow } from "date-fns";

import { ContributorNode, EitherNode, RepoNode } from "../../types";
import { useRepoDetails } from "../../hooks/useRepoDetails";
import { useContributorDetails } from '../../hooks/useContributorDetails';
import { formatNumber } from "../../utils/formatUtils";
import {
  countBeginnerFriendlyLabels,
  GOOD_FIRST_ISSUE,
  HELP_WANTED,
  BEGINNER_FRIENDLY,
} from "../../utils/repoUtils";

interface TooltipProps {
  node: EitherNode;
  position: { x: number; y: number };
}

interface ContributorTooltipProps extends TooltipProps {
  node: ContributorNode;
}
const ContributorTooltip = ({ node, position }: ContributorTooltipProps) => {
  const { data } = useContributorDetails((node as ContributorNode).name);

  if (!data) return null;

  const contributions = data.contributionsCollection.commitContributionsByRepository;

  const lastActivityTime = contributions
    .flatMap(item => item.contributions.nodes)
    .reduce((latest, cur) => {
      const curTime = new Date(cur.occurredAt).getTime();
      return curTime > latest ? curTime : latest;
    }, 0);

  const lastActivityDate = lastActivityTime ? new Date(lastActivityTime) : null;

  const maxReposToShow = 3;
  const displayedRepos = contributions.slice(0, maxReposToShow);
  const additionalCount = contributions.length - maxReposToShow;

  return (
    <div
      className="absolute bg-gray-900 text-white p-4 rounded-lg shadow-lg text-sm pointer-events-none z-50"
      style={{ top: position.y + 30, left: position.x + 50 }}
    >
      <p className="font-bold text-lg mb-2">{node.name}</p>
      <div className="flex items-center mb-3">
        <img
          src={data.avatarUrl}
          alt={data.login}
          className="w-16 h-16 rounded-full border-2 border-gray-700 object-cover"
        />
        <div className="ml-4">
          <p className="text-gray-300">
            <span className="font-semibold">Followers:</span> {formatNumber(data.followers.totalCount)}
          </p>
          {lastActivityDate && (
            <p className="text-gray-300 text-xs">
              <span className="font-semibold">Last activity:</span>{" "}
              {formatDistanceToNow(lastActivityDate, { addSuffix: true })}
            </p>
          )}
        </div>
      </div>
      {contributions.length > 0 && (
        <div>
          <p className="text-gray-400 text-sm mb-1">Recent repos pushed to:</p>
          <ul className="text-sm text-gray-300">
            {displayedRepos.map(({ repository }) => <li>{repository.nameWithOwner}</li>)}
            {additionalCount > 0 && <li>+{additionalCount} more</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

interface RepoTooltipProps extends TooltipProps {
  node: RepoNode;
}

const RepoTooltip = ({ node, position }: RepoTooltipProps) => {
  const { data } = useRepoDetails(node.nameWithOwner);

  if (!data) return null;

  const labelCounts = countBeginnerFriendlyLabels(data.labels.nodes);
  const countGoodFirstIssue = labelCounts[GOOD_FIRST_ISSUE];
  const countHelpWanted = labelCounts[HELP_WANTED];
  const countBeginnerFriendly = labelCounts[BEGINNER_FRIENDLY];

  return (
    <div
      className="absolute bg-gray-900 text-white p-3 rounded shadow-lg text-sm pointer-events-none z-50"
      style={{ top: position.y + 30, left: position.x + 50 }}
    >
      <p className="font-bold mb-2">{data.nameWithOwner}</p>
      <p className="text-gray-300 mb-2 inline-block">
        <span className="text-sm">⭐&nbsp;</span>
        {formatNumber(data.stargazerCount)}
      </p>
      <p className="text-gray-300 mb-2 inline-block ml-4">
        <span className="text-sm">🍴&nbsp;</span>
        {formatNumber(data.forkCount)}
      </p>
      <p className="text-gray-300 mb-2">
        <span className="text-sm">Active contributors (7d):&nbsp;</span>
        {data.contributors.length}
      </p>
      {data.primaryLanguage && (
        <p className="text-gray-300 mb-2">
          <span className="text-sm">Primary Language:&nbsp;</span>
          {data.primaryLanguage.name}
        </p>
      )}
      <p className="text-gray-300 mb-2">
        <span className="text-sm">Pushed at:&nbsp;</span>
        {formatDistanceToNow(new Date(data.pushedAt), { addSuffix: true })}
      </p>
      <p className="text-gray-300 mb-2">
        <span className="text-sm">
          {countGoodFirstIssue > 0 ? "✅" : "❌"}&nbsp;
        </span>
        {GOOD_FIRST_ISSUE} ({countGoodFirstIssue})
      </p>
      <p className="text-gray-300 mb-2">
        <span className="text-sm">
          {countHelpWanted > 0 ? "✅" : "❌"}&nbsp;
        </span>
        {HELP_WANTED} ({countHelpWanted})
      </p>
      <p className="text-gray-300 mb-2">
        <span className="text-sm">
          {countBeginnerFriendly > 0 ? "✅" : "❌"}&nbsp;
        </span>
        {BEGINNER_FRIENDLY} ({countBeginnerFriendly})
      </p>
      <p className="text-gray-300 mb-2">
        <span className="text-sm">{data.contributingFile ? "✅" : "❌"}&nbsp;</span>
        CONTRIBUTING.md
      </p>
    </div>
  );
};

const Tooltip = ({ node, position }: TooltipProps) => {
  if (node.type === "contributor") {
    return <ContributorTooltip node={node} position={position} />;
  } else {
    return <RepoTooltip node={node} position={position} />;
  }
}

export default Tooltip;