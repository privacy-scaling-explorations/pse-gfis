import { NextApiRequest, NextApiResponse } from "next";

import { MAX_NUM_PREVIEWS } from "./constants";
import { fetchGfisData } from "./pse-gfis";
import { PreviewData } from "./types";

export let cachedPreviewData: PreviewData[];

export async function cachePreviewData() {
  await fetchGfisData().then((data) => {
    const newPreviewData: PreviewData[] = [];

    // cache previews
    for (let i = 0; i < MAX_NUM_PREVIEWS; i++) {
      let issueIndex = Number(i) % 2;
      let repoIndex = (Number(i) - issueIndex) / 2;

      let repoData = data?.[repoIndex];
      let issueData = repoData?.issues[issueIndex];

      while (!issueData && repoIndex < data.length) {
        repoIndex++;
        repoData = data?.[repoIndex];
        issueData = repoData?.issues[issueIndex];
      }

      newPreviewData.push({
        repo: repoData,
        issue: issueData,
        includeHeader: issueIndex === 0,
      });
    }

    cachedPreviewData = newPreviewData;
  });
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  cachePreviewData()
    .then(() => {
      res.status(200).send({
        success: true,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: "An error occurred while processing the request.",
        err,
      });
    });
};
