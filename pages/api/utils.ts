import { GraphQLClient } from "graphql-request";

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
  goodFirstIssues: issues(states: OPEN, first: 100, labels: [${GOOD_FIRST_ISSUE_LABELS.map(
    (label) => `"${label}"`
  ).join(", ")}]) {
    totalCount
    nodes {
      number
      title
      url
    }
  }
`;

const buildOrgQuery = (index: number) => `
  org${index}: organization(login: $org${index}) {
    repositories(first: 100, isArchived: false) {
      nodes {
        name
        owner {
          login
        }
        url
        ${buildIssuesFragment()}
      }
    }
  }
`;

const buildRepoQuery = (index: number) => `
  repo${index}: repository(owner: $owner${index}, name: $repo${index}) {
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

  const data = await client.request(query, variables);
  return data;
};
