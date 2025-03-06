import { formatDistanceToNow } from 'date-fns';

import { HELP_WANTED, countBeginnerFriendlyLabels, GOOD_FIRST_ISSUE, BEGINNER_FRIENDLY } from '../../utils/repoUtils';
import { ContributorDetails, RepoDetails } from '../../types';
import { formatNumber } from '../../utils/formatUtils';

export const getRepoTooltipContent = (data: RepoDetails | undefined) => {
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


export const getContributorTooltipContent = (data: ContributorDetails | undefined) => {
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