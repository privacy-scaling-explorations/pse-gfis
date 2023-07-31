import { GraphQLClient } from "graphql-request";

const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";

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
      query += `
        org${index}: organization(login: $org${index}) {
          repositories(first: 100) {
            nodes {
              name
              owner {
                login
              }
              url
              issues(states: OPEN, first: 100) {
                totalCount
              }
              goodFirstIssues: issues(states: OPEN, first: 100, labels: ["good first issue", "good-first-issue", "good first issues"]) {
                totalCount
                nodes {
                  number
                  title
                  url
                }
              }
            }
          }
        }
      `;
      variables[`org${index}`] = entity.org;
    } else if ("repo" in entity) {
      query += `
        repo${index}: repository(owner: $owner${index}, name: $repo${index}) {
          name
          owner {
            login
          }
          url
          issues(states: OPEN, first: 100) {
            totalCount
          }
          goodFirstIssues: issues(states: OPEN, first: 100, labels: ["good first issue", "good-first-issue", "good first issues"]) {
            totalCount
            nodes {
              number
              title
              url
            }
          }
        }
      `;
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
