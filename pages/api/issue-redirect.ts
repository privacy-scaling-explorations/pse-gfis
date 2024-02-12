import { NextApiRequest, NextApiResponse } from "next";

import { cachePreviewData, cachedPreviewData } from "./cache-previews";
import { MAX_NUM_PREVIEWS } from "./constants";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.query.issueIndex === undefined) {
    return res.status(400).json({
      error: "issueIndex is required.",
    });
  }

  if (Number(req.query.issueIndex) > MAX_NUM_PREVIEWS - 1) {
    return res.status(400).json({
      error:
        "issueIndex is out of bounds. Max value is " + (MAX_NUM_PREVIEWS - 1),
    });
  }

  if (cachedPreviewData === undefined) {
    await cachePreviewData();
  }

  try {
    const data = cachedPreviewData[Number(req.query.issueIndex) || 0];
    res.status(302).redirect(data?.issue.url ?? "/");
  } catch (err) {
    res.status(500).json({
      error: "An error occurred while processing the request.",
      err,
    });
  }
};
