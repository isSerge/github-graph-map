import { RepoGraphData, RepoDetails } from "../types";

export const GOOD_FIRST_ISSUE = "good first issue";
export const HELP_WANTED = "help wanted";
export const BEGINNER_FRIENDLY = "beginner friendly";

/**
 * Count the number of issues for each beginner-friendly label.
 * Iterates over all labels once and returns an object mapping each label to its total issues count.
 */
export const countBeginnerFriendlyLabels = (
  labels: { name: string; issues: { totalCount: number } }[]
): Record<string, number> => {
  const counts: Record<string, number> = {
    [GOOD_FIRST_ISSUE]: 0,
    [HELP_WANTED]: 0,
    [BEGINNER_FRIENDLY]: 0,
  };

  labels.forEach(({ name, issues }) => {
    const lowerName = name.toLowerCase();
    if (
      lowerName === GOOD_FIRST_ISSUE ||
      lowerName === HELP_WANTED ||
      lowerName === BEGINNER_FRIENDLY
    ) {
      counts[lowerName] += issues.totalCount;
    }
  });

  return counts;
};

interface Contribution {
  repository: RepoGraphData;
  contributions: {
    nodes: {
      occurredAt: string;
    }[];
  };
}

export function getTopFiveRecentRepos(contributions: Contribution[]): RepoGraphData[] {
  return contributions
    .map((item) => ({
      repository: item.repository,
      // Compute the most recent contribution timestamp.
      lastContribution: item.contributions.nodes.reduce((max, { occurredAt }) => {
        const time = new Date(occurredAt).getTime();
        return Math.max(max, time);
      }, 0),
    }))
    .sort((a, b) => b.lastContribution - a.lastContribution)
    .slice(0, 5)
    .map(item => item.repository);
}

export function rateRepo(repo: RepoDetails): number {
  let score = 0;
  
  // Beginner friendly labels
  const labels = repo.labels.nodes;
  labels.forEach(({ name, issues }) => {
    const lowerName = name.toLowerCase();
    if ([GOOD_FIRST_ISSUE, HELP_WANTED, BEGINNER_FRIENDLY].includes(lowerName)) {
      score += issues.totalCount; // Weight issues count for each label
    }
  });
  
  // CONTRIBUTING.md check: add a fixed score if present
  if (repo.contributingFile && repo.contributingFile.__typename !== "null") {
    score += 10;
  }
  
  // Recent activity: you can compare pushedAt date with current date.
  const pushedAt = new Date(repo.pushedAt);
  const now = new Date();
  const daysSinceUpdate = (now.getTime() - pushedAt.getTime()) / (1000 * 3600 * 24);
  if (daysSinceUpdate < 30) {
    score += 5; // Recently active
  }
  
  // Optionally, factor in stars, forks, etc.
  score += repo.stargazerCount / 100;
  
  return score;
}