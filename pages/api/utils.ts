import { Octokit } from "octokit";

type Repo = { owner: string; repo: string };

export const getOctokitInstance = (token: string) =>
  new Octokit({ auth: token });

export const getRepos = async (octokit: Octokit, org: string) => {
  const { data } = await octokit.request("GET /orgs/{org}/repos", { org });
  return data;
};

export const processRepo = async (octokit: Octokit, repo: Repo) => {
  const { data: issues } = await octokit.request(
    "GET /repos/{owner}/{repo}/issues",
    repo
  );
  const totalOpenIssues = issues.length;
  const goodFirstIssues = issues.filter((issue) =>
    issue.labels.some(
      (label) =>
        typeof label === "object" &&
        ["good first issue", "good-first-issue", "good first issues"].includes(
          label.name?.toLowerCase() || ""
        )
    )
  );
  const details = goodFirstIssues.map((issue) => ({
    number: issue.number,
    title: issue.title,
    url: issue.html_url,
  }));
  return { count: goodFirstIssues.length, issues: details, totalOpenIssues };
};
