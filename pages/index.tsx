import { useState, useEffect } from "react";

type RepoData = {
  repo: string;
  count: number;
  totalOpenIssues: number;
  url: string;
  issues: { number: number; title: string; url: string }[];
};

const Home = () => {
  const [data, setData] = useState<RepoData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the API endpoint
    fetch("/api/pse-gfis")
      .then((response) => response.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Good First Issues</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {data.map((repo, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <h2>
                <a href={repo.url} target="_blank" rel="noopener noreferrer">
                  {repo.repo}
                </a>
              </h2>
              <p>Total Open Issues: {repo.totalOpenIssues}</p>
              <p>Good First Issues: {repo.count}</p>
              <ul>
                {repo.issues.map((issue, i) => (
                  <li key={i}>
                    <a
                      href={issue.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      #{issue.number}: {issue.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
