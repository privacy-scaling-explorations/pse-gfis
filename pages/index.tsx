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
      <h1 className="text-4xl font-bold mt-2 mb-8">
        PSE - Good First Issues Tracker
      </h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {data.map((repo, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <h2>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-3xl font-bold hover:text-blue-500"
                >
                  {repo.repo}
                </a>
              </h2>
              <p>
                Good First Issues: {repo.count}/{repo.totalOpenIssues}
              </p>
              <ul>
                {repo.issues.map((issue, i) => (
                  <li key={i}>
                    <a
                      href={issue.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-blue-500"
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
