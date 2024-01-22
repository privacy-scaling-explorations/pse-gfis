import { NextApiRequest, NextApiResponse } from "next";

import { fetchGfisData } from "./pse-gfis";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  fetchGfisData()
    .then((data) => {
      const issueData =
        data?.[Number(req.query.repoIndex ?? 0)]?.issues[
          Number(req.query.issueIndex ?? 0)
        ];
      res.status(302).redirect(issueData?.url ?? "/");
    })
    .catch((err) => {
      res.status(500).json({
        error: "An error occurred while processing the request.",
        err,
      });
    });
};
