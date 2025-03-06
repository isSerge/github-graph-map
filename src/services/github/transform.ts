import { RepoDetailsResponse, RepoDetails, RecentCommitsResponse, ContributorDetailsResponse } from '../../types';
import { rateRepo } from '../../utils/repoUtils';

export const transformRepoDataResponses = (
  response: RepoDetailsResponse,
  contributors: { login: string; contributionCount: number }[],
  since: string
): RepoDetails => {
  const recentIssues = response.repository.issues.nodes.filter(
    (issue) => new Date(issue.createdAt) > new Date(since)
  );
  const recentPRs = response.repository.pullRequests.nodes.filter(
    (pr) => new Date(pr.createdAt) > new Date(since)
  );

  const repoDetails = {
    ...response.repository,
    contributors,
    issues: {
      totalCount: recentIssues.length,
      nodes: recentIssues,
    },
    pullRequests: {
      totalCount: recentPRs.length,
      nodes: recentPRs,
    },
  }

  return {
    ...repoDetails,
    score: rateRepo(repoDetails),
  };
};

export const transformCommitDataResponse = (response: RecentCommitsResponse): { login: string; contributionCount: number }[] => {
  const nodes = response.repository?.defaultBranchRef?.target?.history?.nodes || [];
  const contributorMap = new Map<string, number>();
  nodes.forEach((commit) => {
    const login = commit.author?.user?.login;
    if (login) {
      contributorMap.set(login, (contributorMap.get(login) || 0) + 1);
    }
  });

  return Array.from(contributorMap.entries()).map(([login, contributionCount]) => ({ login, contributionCount }));
};

export const transformContributorResponse = (response: ContributorDetailsResponse): ContributorDetailsResponse["user"] & { lastActivityDate: Date | null }  => {
  const contributions = response.user.contributionsCollection.commitContributionsByRepository;

  const lastActivityTime = contributions
    .flatMap(item => item.contributions.nodes)
    .reduce((latest, cur) => {
      const curTime = new Date(cur.occurredAt).getTime();
      return curTime > latest ? curTime : latest;
    }, 0);

  const lastActivityDate = lastActivityTime ? new Date(lastActivityTime) : null;

  return {
    ...response.user,
    lastActivityDate,
  };
};