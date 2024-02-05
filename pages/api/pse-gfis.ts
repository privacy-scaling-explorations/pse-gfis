import { NextApiRequest, NextApiResponse } from "next";

import { getOctokitInstance, fetchData } from "./utils";
import { RepoData } from "./types";
import { PSE_ENTITIES } from "./constants";

let cache: RepoData[];
let cacheTimestamp: number;

export const fetchGfisData = async () => {
  const currentTime = Date.now();

  const accessToken = process.env.GITHUB_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("GITHUB_ACCESS_TOKEN environment variable not set");
  }

  const client = getOctokitInstance(accessToken);

  const data = await fetchData(client, PSE_ENTITIES);

  // Check if the cache exists and is less than an hour old
  if (cache && currentTime - cacheTimestamp < 60 * 60 * 1000) {
    return cache;
  }

  // Process the data to match the RepoData structure

  cache = data; // Store the result in the cache
  cacheTimestamp = currentTime; // Update the timestamp
  return data;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const startTime = new Date(); // Capture the start time as a Date object
  console.log(`API request started at ${startTime.toISOString()}`); // Log the start time

  fetchGfisData()
    .then((data) => {
      const endTime = Date.now(); // Capture the end time
      const timeTaken = endTime - startTime.getTime(); // Calculate the time taken
      console.log(`API request took ${timeTaken} milliseconds`); // Log the time taken
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json({
        error: "An error occurred while processing the request.",
        err,
      });
    });
};
