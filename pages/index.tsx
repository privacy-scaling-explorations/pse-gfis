import { useState, useEffect } from "react";
import Image from "next/image";

import RepoPreview from "../components/RepoPreview";
import IssuePreview from "../components/IssuePreview";
import pseLogo from "../public/pse-logo.png";
import SearchBar from "@/components/SearchBar";

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

const Home = () => {
  const [data, setData] = useState<RepoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setQuery(e.target.value);
  };

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

  if (error) {
    return <p>There was an error loading the data. Check the console.</p>;
  }

  return (
    <div className="p-6">
      <div className="flex mb-6 mt-2 items-center">
        <Image
          width={100}
          height={100}
          src={pseLogo}
          alt="Logo"
          className="max-md:w-24 max-md:h-24"
        />
        <div className="ml-4">
          <h1 className="text-4xl max-md:text-2xl font-bold mt-2 mb-2">
            Privacy & Scaling Explorations
          </h1>
          <h2 className="text-2xl max-md:text-lg text-[#848D97]">
            Good First Issues Tracker
          </h2>
        </div>
      </div>
      <SearchBar handleSearch = {handleSearch} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {data.map(repo => {
            const filteredIssues = repo.issues.filter(issue => issue.title.toLowerCase().includes(query.toLowerCase()));
      
            if (filteredIssues.length > 0) {
              return {
                ...repo,
                issues: filteredIssues,
              }
            }
            return null;
          }).filter(repo => repo !== null).map((repo, index) => {
            if (repo.count === 0) {
              return null;
            }

            return (
              <div key={index} className="pb-4">
                <RepoPreview repo={repo} />
                <ul className="pt-2">
                  {repo.issues.map((issue, i) => (
                    <li key={i} className="flex my-3">
                      <IssuePreview issue={issue} />
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
