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