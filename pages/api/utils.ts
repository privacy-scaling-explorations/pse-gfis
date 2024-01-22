import { GraphQLClient } from "graphql-request";

import { Entity, RepoData } from "./types";

const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";

const GOOD_FIRST_ISSUE_LABELS = [
  "good first issue",
  "good-first-issue",
  "good first issues",
  // Add more labels here
];

const buildIssuesFragment = () => `
  issues(states: OPEN, first: 100) {
    totalCount
  }
goodFirstIssues: issues(states: OPEN, first: 10, orderBy: {field: CREATED_AT, direction: DESC} labels: [${GOOD_FIRST_ISSUE_LABELS.map(
  (label) => `"${label}"`
).join(", ")}]) {
    totalCount
    nodes {
      number
      title
      url
      createdAt
      author {
        login
      }
    }
  }
`;

const buildOrgQuery = (index: number) => `
  org${index}: organization(login: $org${index}) {
    repositories(first: 10, isArchived: false, orderBy: {field: UPDATED_AT, direction: DESC}) {
      nodes {
        name
        owner {
          login
          avatarUrl
        }
        url
        ${buildIssuesFragment()}
      }
    }
  }
`;

const buildRepoQuery = (index: number) => `
  repo${index}: repository(owner: $owner${index}, name: $repo${index}, orderBy: {field: UPDATED_AT, direction: DESC}) {
    name
    owner {
      login
    }
    url
    ${buildIssuesFragment()}
  }
`;

export const emptySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 0 0" width="0" height="0"></svg>`;

export const getOctokitInstance = (accessToken: string) => {
  return new GraphQLClient(GITHUB_GRAPHQL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
};

export const fetchData = async (
  client: GraphQLClient,
  entities: Entity[]
): Promise<RepoData[]> => {
  let query = "";
  const variables = {};

  entities.forEach((entity, index) => {
    if ("org" in entity) {
      query += buildOrgQuery(index);
      variables[`org${index}`] = entity.org;
    } else if ("repo" in entity) {
      query += buildRepoQuery(index);
      variables[`owner${index}`] = entity.repo.owner;
      variables[`repo${index}`] = entity.repo.repo;
    }
  });

  query = `query (${Object.keys(variables)
    .map((key) => `$${key}: String!`)
    .join(", ")}) { ${query} }`;

  const data = (await client.request(query, variables)) as any;
  const result: RepoData[] = [];

  Object.keys(data).forEach((key) => {
    const item = data[key];
    if (key.startsWith("org")) {
      item.repositories.nodes.forEach((repo: any) => {
        if (repo.goodFirstIssues.totalCount != 0) {
          result.push({
            owner: repo.owner.login,
            name: repo.name,
            avatarUrl: repo.owner.avatarUrl,
            count: repo.goodFirstIssues.totalCount,
            totalOpenIssues: repo.issues.totalCount,
            url: repo.url,
            issues: repo.goodFirstIssues.nodes.map((issue: any) => ({
              number: issue.number,
              title: issue.title,
              url: issue.url,
              author: issue.author.login,
              createdAt: issue.createdAt,
            })),
          });
        }
      });
    } else if (key.startsWith("repo")) {
      if (item.goodFirstIssues.totalCount != 0) {
        result.push({
          name: item.name,
          owner: item.owner.login,
          avatarUrl: item.owner.avatarUrl,
          count: item.goodFirstIssues.totalCount,
          totalOpenIssues: item.issues.totalCount,
          url: item.url,
          issues: item.goodFirstIssues.nodes.map((issue: any) => ({
            number: issue.number,
            title: issue.title,
            url: issue.url,
            author: issue.author.login,
            createdAt: issue.createdAt,
          })),
        });
      }
    }
  });

  return result;
};
