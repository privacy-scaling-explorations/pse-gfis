import { NextApiRequest, NextApiResponse } from "next";

import { IssueData, RepoData } from "./types";
import { fetchGfisData } from "./pse-gfis";
import { emptySvg } from "./utils";

const renderIssuePreview = (
  darkMode: boolean,
  repo: RepoData,
  issue: IssueData,
  showRepoName: boolean
) => `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        role="img"
        viewBox="0 0 ${showRepoName ? "600" : "400"} ${
  showRepoName ? "85" : "50"
}"
        version="1.1"
        width="${showRepoName ? "600" : "400"}"
        height="${showRepoName ? "85" : "50"}"
        aria-hidden="true"
      >
        <style>
        * {
            font-family: -apple-system, "system-ui", "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
        }
        .repo-title {
          font-weight: 400;
          font-size: 1rem;
          fill: ${darkMode ? "#e6ecf2" : "#1f2328"};
        }
        .slash {
            fill: ${darkMode ? "#828c96" : "#646c75"};
        }
        .repo-name {
            font-weight: 600;
        }
        .issue-title {
            font-weight: 600;
            font-size: 1rem;
            fill: ${darkMode ? "#e6ecf2" : "#1f2328"};
        }
        .desc {
            font-size: 0.75rem;
            font-weight: 400;
            fill: ${darkMode ? "#848D97" : "#646c75"};
        }
        </style>
        ${
          showRepoName
            ? `
<text class="repo-title" x="0" y="22">${repo.owner} <tspan class="slash">/</tspan> <tspan class="repo-name">${repo.name}</tspan></text>
`
            : ""
        }
            <path fill="${
              darkMode ? "#3fba4f" : "#197f36"
            }" d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" transform="translate(0, ${
  showRepoName ? "45" : "0"
})"></path>
            <path fill="${
              darkMode ? "#3fba4f" : "#197f36"
            }" d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z" transform="translate(0, ${
  showRepoName ? "45" : "0"
})"></path>
        <text class="issue-title" x="25" y="${showRepoName ? "57" : "17"}">${
  issue.title
}</text>
        <text class="desc" x="25" y="${showRepoName ? "75" : "38"}">#${
  issue.number
} opened on ${new Date(issue.createdAt).toDateString()} by ${
  issue.author
}</text>
    </svg>
`;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  fetchGfisData()
    .then((data) => {
      let issueIndex = Number(req.query.issueIndex ?? 0) % 2;
      let repoIndex = (Number(req.query.issueIndex ?? 0) - issueIndex) / 2;

      let repoData = data?.[repoIndex];
      let issueData = repoData?.issues[issueIndex];

      while (!issueData && repoIndex < data.length) {
        repoIndex++;
        repoData = data?.[repoIndex];
        issueData = repoData?.issues[issueIndex];
      }

      res
        .status(200)
        .setHeader("Content-Type", "image/svg+xml")
        .send(
          repoData && issueData
            ? renderIssuePreview(
                !req.query.lightMode,
                repoData,
                issueData,
                issueIndex === 0
              )
            : emptySvg
        );
    })
    .catch((err) => {
      res.status(500).json({
        error: "An error occurred while processing the request.",
        err,
      });
    });
};
