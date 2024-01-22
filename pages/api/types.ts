export type Entity =
  | { org: string }
  | { repo: { owner: string; repo: string } };

export type IssueData = {
  number: number;
  title: string;
  url: string;
  author: string;
  createdAt: string;
};

export type RepoData = {
  name: string;
  owner: string;
  avatarUrl: string;
  count: number;
  totalOpenIssues: number;
  url: string;
  issues: IssueData[];
};
