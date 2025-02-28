export function formatNumber(num: number): string {
    if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
    return num.toString();
}

export function extractGitHubPath(input: string): string | null {
  try {
    const url = new URL(input);
    if (url.hostname.toLowerCase() !== "github.com") {
      return null;
    }
    const parts = url.pathname.split("/").filter(Boolean);
    // If there are at least 2 parts, assume it's a repo URL (owner/repo)
    if (parts.length >= 2) {
      return `${parts[0]}/${parts[1]}`;
    }
    // If there's exactly 1 part, assume it's a user URL.
    if (parts.length === 1) {
      return parts[0];
    }
  } catch {
    // Not a valid URL, so return null.
  }
  return null;
}

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

export function handleError(context: string, error: unknown): void {
  if (error instanceof Error) {
    // Handle specific error types:
    if (error.name === "AbortError") {
      console.info(`AbortError in ${context}: ${error.message}`);
      return; // You might choose to do nothing for aborts.
    }
    // Log other errors with their message.
    console.error(`Error in ${context}: ${error.message}`);
  } else {
    // Fallback for non-Error objects.
    console.error(`Unexpected error in ${context}:`, error);
  }
}