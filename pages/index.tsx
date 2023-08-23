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
  const [hideZero, setHideZero] = useState(true);

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

  const handleHideZeroChange = (event) => {
    setHideZero(event.target.checked);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 className="text-4xl font-bold mt-2 mb-8">
        PSE - Good First Issues Tracker
      </h1>
      <div>
        <label>
          Hide repos with no good first issues
          <input
            type="checkbox"
            checked={hideZero}
            onChange={handleHideZeroChange}
            style={{ marginLeft: "0.5rem" }}
          />
        </label>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {data.map((repo, index) => {
            if (hideZero && repo.count === 0) {
              return null;
            }
            return (
              <div key={index} style={{ marginBottom: "20px" }}>
                <h2>
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-3xl font-bold hover:text-blue-500"
                  >
                    {repo.repo} ({repo.count}/{repo.totalOpenIssues})
                  </a>
                </h2>
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
