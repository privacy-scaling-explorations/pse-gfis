import { GraphQLClient } from "graphql-request";
import edgeChromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

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
goodFirstIssues: issues(states: OPEN, first: 5, orderBy: {field: CREATED_AT, direction: DESC} labels: [${GOOD_FIRST_ISSUE_LABELS.map(
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
    repositories(first: 100, isArchived: false, orderBy: {field: UPDATED_AT, direction: DESC}) {
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

export const getOctokitInstance = (accessToken: string) => {
  return new GraphQLClient(GITHUB_GRAPHQL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
};

export type EntityType =
  | { org: string }
  | { repo: { owner: string; repo: string } };

export const fetchData = async (
  client: GraphQLClient,
  entities: EntityType[]
) => {
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

  console.log(query);
  const data = await client.request(query, variables);
  return data;
};

export const renderPng = async (html: string) => {
  const executablePath =
    (await edgeChromium.executablePath) || process.env.LOCAL_CHROMIUM_PATH;

  const browser = await puppeteer.launch({
    executablePath,
    args: edgeChromium.args,
    headless: false,
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 400,
    height: 70,
    deviceScaleFactor: 2,
  });
  await page.setContent(html);
  const screenshot = await page.screenshot({
    omitBackground: true,
  });
  await browser.close();
  return screenshot;
};
