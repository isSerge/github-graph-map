import React, { useState, useEffect } from "react"
import { getRepoContributorsWithRepos } from "./github"
import type { GraphQlQueryResponseData } from "@octokit/graphql"

const App: React.FC = () => {
  const [repoInput, setRepoInput] = useState<string>("isserge/org-metrics");
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<GraphQlQueryResponseData | null>(null);  // Store raw JSON data

  // Effect to fetch data when a valid repo input is provided
  useEffect(() => {
    const fetchData = async () => {
      if (!repoInput.includes("/")) return; // Wait until input is in "owner/repo" format
      const [owner, name] = repoInput.split("/");

      if (!owner || !name) {
        setError("Please enter a valid repository in the format 'owner/repo'.");
        return;
      }

      setFetching(true);
      setError(null);
      setData(null);

      try {
        const response = await getRepoContributorsWithRepos(owner, name);
        setData(response);  // Save raw data
      } catch {
        setError("Failed to fetch repository data. Please check the repo name.");
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [repoInput]);

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      {/* Input Field */}
      <input
        type="text"
        placeholder="Enter repository (e.g., facebook/react)"
        value={repoInput}
        onChange={(e) => setRepoInput(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      />

      {/* Loading Indicator */}
      {fetching && <div className="text-blue-500">Fetching data...</div>}

      {/* Error Message */}
      {error && <div className="text-red-500">{error}</div>}

      {/* Raw JSON Data */}
      {data && (
        <pre
        className="mt-4 p-4 bg-gray-800 border rounded overflow-x-auto text-sm leading-relaxed text-green-300"
        style={{
          maxHeight: "500px",
          fontFamily: "Courier New, monospace",
        }}
      >
        {JSON.stringify(data, null, 2)}
      </pre>
      )}
    </div>
  );
};

export default App;