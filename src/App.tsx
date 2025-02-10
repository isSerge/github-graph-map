import React, { useState, useEffect } from "react"
import { getRepoContributorsWithContributedRepos, getRepository } from "./github"
import { NetworkNode, NetworkLink, Repo, ContributorsWithRepos } from './types'
import Network from "./Network"

function transformData(apiResponse: ContributorsWithRepos[], selectedRepo: Repo) {
  const nodes: NetworkNode[] = [];
  // const links: NetworkLink[] = [];
  const linksMap: Map<string, NetworkLink> = new Map();

  // Add the selected repository node
  nodes.push({
      id: selectedRepo.name,
      size: 50, // Adjust size as needed
      color: "#ff7f0e" // Highlight color for the selected repository
  });

  // Create a map to keep track of processed repositories
  const repoSet = new Set<string>();
  repoSet.add(selectedRepo.name);

  // Iterate through contributors to build repository nodes and links
  apiResponse.forEach((contributor) => {
      contributor.contributedRepos.forEach((repo) => {
          if (!repoSet.has(repo.name)) {
              // Add a node for each new repository
              nodes.push({
                  id: repo.name,
                  size: 24,
                  color: "rgb(97, 205, 187)" // Color for other repositories
              });
              repoSet.add(repo.name);
          }

          // Create a link between the selected repository and other repositories via shared contributors
          if (repo.id !== selectedRepo.id) {
            const linkKey = `${selectedRepo.name}-${repo.name}`;

            if (!linksMap.has(linkKey)) {
              linksMap.set(linkKey, {
                  source: selectedRepo.name,
                  target: repo.name,
                  distance: 50,
                  contributorsCount: 1
              });
          } else {
              // Increment contributors count if the link already exists
              linksMap.get(linkKey)!.contributorsCount += 1;
          }
          }
      });
  });

  // Convert links map to an array
  const links: NetworkLink[] = Array.from(linksMap.values());

  return { nodes, links };
}

const App: React.FC = () => {
  const [repoInput, setRepoInput] = useState<string>("autonomys/subspace");
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [data, setData] = useState<any | null>(null);  // Store raw JSON data
  const [selectedRepo, setSelectedRepo] = useState<any | null>(null);

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
        const {repository} = await getRepository(owner, name);
        const response = await getRepoContributorsWithContributedRepos(owner, name);
        setSelectedRepo(repository);
        setData(response);  // Save raw data
      } catch {
        setError("Failed to fetch repository data. Please check the repo name.");
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [repoInput]);

  const graphData = data && selectedRepo ? transformData(data, selectedRepo) : null;

  console.log(graphData);

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
      {graphData && (
        <div className="h-96">
        <Network data={graphData} />
      </div>
    )}
      {selectedRepo && (
        <pre
        className="mt-4 p-4 bg-gray-800 border rounded overflow-x-auto text-sm leading-relaxed text-green-300"
        style={{
          maxHeight: "500px",
          fontFamily: "Courier New, monospace",
        }}
      >
        {JSON.stringify(selectedRepo, null, 2)}
      </pre>
      )}
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