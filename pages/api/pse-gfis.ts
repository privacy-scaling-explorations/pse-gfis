import { getOctokitInstance, getRepos, processRepo } from "./utils";

type ResultType = {
  repo: string;
  count: number;
  totalOpenIssues: number;
  url: string;
  issues: { number: number; title: string; url: string }[];
};

type EntityType = { org: string } | { repo: { owner: string; repo: string } };

let cache;
let cacheTimestamp;

export default async (req, res) => {
  const currentTime = Date.now();

  // Check if the cache exists and is less than an hour old
  if (cache && currentTime - cacheTimestamp < 60 * 60 * 1000) {
    return res.status(200).json(cache);
  }

  const accessToken = process.env.GITHUB_ACCESS_TOKEN;
  if (!accessToken) {
    return res.status(400).json({ error: "Access token is missing." });
  }

  try {
    const octokit = getOctokitInstance(accessToken);
    const entities: EntityType[] = [
      { org: "semaphore-protocol" },
      { org: "Unirep" },
      { org: "Rate-Limiting-Nullifier" },
      { org: "privacy-scaling-explorations" },
      // { repo: { owner: "privacy-scaling-explorations", repo: "maci" } },
      // Add more orgs and repos here
    ];
    const result: ResultType[] = [];

    for (let entity of entities) {
      if ("org" in entity) {
        const repos = await getRepos(octokit, entity.org);
        for (let repo of repos) {
          const { count, issues, totalOpenIssues } = await processRepo(
            octokit,
            {
              owner: repo.owner.login,
              repo: repo.name,
            }
          );
          result.push({
            repo: `${repo.owner.login}/${repo.name}`,
            count,
            totalOpenIssues,
            url: repo.html_url,
            issues,
          });
        }
      } else if ("repo" in entity) {
        const { count, issues, totalOpenIssues } = await processRepo(
          octokit,
          entity.repo
        );
        result.push({
          repo: `${entity.repo.owner}/${entity.repo.repo}`,
          count,
          totalOpenIssues,
          url: `https://github.com/${entity.repo.owner}/${entity.repo.repo}`,
          issues,
        });
      }
    }

    cache = result; // Store the result in the cache
    cacheTimestamp = currentTime; // Update the timestamp
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request." });
  }
};
