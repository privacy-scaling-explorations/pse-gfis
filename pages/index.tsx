import { useState, useEffect } from "react";
import Image from "next/image";

type RepoData = {
  name: string;
  owner: string;
  avatarUrl: string;
  count: number;
  totalOpenIssues: number;
  url: string;
  issues: {
    number: number;
    title: string;
    url: string;
    author: string;
    createdAt: string;
  }[];
};

const IssueIcon = () => (
  <svg
    className="my-1"
    fill="rgb(63, 185, 80)"
    viewBox="0 0 16 16"
    version="1.1"
    width="16"
    height="16"
    aria-hidden="true"
  >
    <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>
  </svg>
);

const Home = () => {
  const [data, setData] = useState<RepoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hideZero, setHideZero] = useState(true);

  useEffect(() => {
    // Fetch data from the API endpoint
    fetch("/api/pse-gfis")
      .then((response) => response.json())
      .then((result) => {
        if (result.error) {
          throw new Error(result.error);
        }
        setData(result);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(true);
        setLoading(false);
      });
  }, []);

  const handleHideZeroChange = (event) => {
    setHideZero(event.target.checked);
  };

  if (error) {
    return <p>There was an error loading the data. Check the console.</p>;
  }

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
                <h2 className="flex align-center mt-4">
                  <Image
                    width={24}
                    height={24}
                    src={repo.avatarUrl}
                    alt="profile"
                    className="rounded-md w-6 h-6 mr-2"
                  />
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-semibold"
                  >
                    {repo.owner} / {repo.name}
                  </a>
                </h2>
                <ul>
                  {repo.issues.map((issue, i) => (
                    <li key={i} className="flex my-3">
                      <IssueIcon />
                      <div className="ml-2">
                        <a
                          href={issue.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-base"
                        >
                          {issue.title}
                        </a>
                        <p className="text-xs text-[#848D97] mt-1">
                          #{issue.number} opened on{" "}
                          {new Date(issue.createdAt).toDateString()} by{" "}
                          {issue.author}
                        </p>
                      </div>
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
