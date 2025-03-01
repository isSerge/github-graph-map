export interface RepoBase {
    name: string;
    nameWithOwner: string;
    stargazerCount: number;
    description: string;
    primaryLanguage: {
      name: string;
    };
    url: string;
    owner: {
      login: string;
    };
    pushedAt: string;
    contributingFile?: {
      __typename: string;
    };
    labels: {
      nodes: {
        name: string;
        color: string;
        issues: {
          totalCount: number;
        }
      }[];
    };
    issues: {
      totalCount: number;
      nodes: {
        createdAt: string;
      }[];
    };
    forkCount: number;
    pullRequests: {
      totalCount: number;
      nodes: {
        createdAt: string;
        state: string;
        merged: boolean;
      }[];
    };
    topics: {
      nodes: {
        topic: {
          name: string;
        }
      }[];
    };
  }