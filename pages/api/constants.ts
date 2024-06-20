import { Entity } from "./types";

export const PSE_ENTITIES: Entity[] = [
  { org: "semaphore-protocol" },
  { org: "Rate-Limiting-Nullifier" },
  { org: "privacy-scaling-explorations" },
  { org: "bandada-infra" },
  { org: "anon-aadhaar" },
  { org: "summa-dev"},
  // { repo: { owner: "semaphore-protocol", repo: "semaphore" } },
  // Add more orgs and repos here
];

export const MAX_NUM_PREVIEWS = 6;
export const ISSUE_PREVIEWS_PER_REPO = 2;
export const CACHE_TTL = 60 * 60 * 1000; // 1 hour
