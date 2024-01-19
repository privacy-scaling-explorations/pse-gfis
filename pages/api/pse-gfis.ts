import { NextApiRequest, NextApiResponse } from "next";

import { getOctokitInstance, fetchData, EntityType } from "./utils";

type ResultType = {
  name: string;
  owner: string;
  avatarUrl: string;
  count: number;
  totalOpenIssues: number;
  url: string;
  issues: {
    number: number;
    title: string;
    url: string;
    author: string;
    createdAt: string;
  }[];
};

let cache;
let cacheTimestamp;

export default async (req: NextApiRequest, res: NextApiResponse) => {
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
    const startTime = new Date(); // Capture the start time as a Date object
    console.log(`API request started at ${startTime.toISOString()}`); // Log the start time

    const client = getOctokitInstance(accessToken);
    const entities: EntityType[] = [
      { org: "semaphore-protocol" },
      { org: "Unirep" },
      { org: "Rate-Limiting-Nullifier" },
      { org: "privacy-scaling-explorations" },
      // { repo: { owner: "privacy-scaling-explorations", repo: "maci" } },
      // { repo: { owner: "semaphore-protocol", repo: "semaphore" } },
      // Add more orgs and repos here
    ];
    const data = (await fetchData(client, entities)) as Record<string, any>;

    // Process the data to match the ResultType structure
    const result: ResultType[] = [];
    Object.keys(data).forEach((key) => {
      const item = data[key];
      if (key.startsWith("org")) {
        item.repositories.nodes.forEach((repo) => {
          if (repo.goodFirstIssues.totalCount != 0) {
            console.log(repo.goodFirstIssues.nodes);
          }
          result.push({
            owner: repo.owner.login,
            name: repo.name,
            avatarUrl: repo.owner.avatarUrl,
            count: repo.goodFirstIssues.totalCount,
            totalOpenIssues: repo.issues.totalCount,
            url: repo.url,
            issues: repo.goodFirstIssues.nodes.map((issue) => ({
              number: issue.number,
              title: issue.title,
              url: issue.url,
              author: issue.author.login,
              createdAt: issue.createdAt,
            })),
          });
        });
      } else if (key.startsWith("repo")) {
        result.push({
          name: item.name,
          owner: item.owner.login,
          avatarUrl: item.owner.avatarUrl,
          count: item.goodFirstIssues.totalCount,
          totalOpenIssues: item.issues.totalCount,
          url: item.url,
          issues: item.goodFirstIssues.nodes.map((issue) => ({
            number: issue.number,
            title: issue.title,
            url: issue.url,
            author: issue.author.login,
            createdAt: issue.createdAt,
          })),
        });
      }
    });

    cache = result; // Store the result in the cache
    cacheTimestamp = currentTime; // Update the timestamp

    const endTime = Date.now(); // Capture the end time
    const timeTaken = endTime - startTime.getTime(); // Calculate the time taken

    console.log(`API request took ${timeTaken} milliseconds`); // Log the time taken

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request." });
  }
};
