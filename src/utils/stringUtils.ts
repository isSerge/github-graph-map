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