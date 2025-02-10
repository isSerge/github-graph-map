import React, { useState } from "react"
import Network from "./Network"
import { useRepoData } from "./useRepoData"

type JsonDisplayProps = {
  title?: string;
  data: unknown;
};

const JsonDisplay: React.FC<JsonDisplayProps> = ({ title, data }) => {
  return (
    <div className="mt-4">
      {title && <h2 className="text-lg font-bold mb-2">{title}</h2>}
      <pre
        className="p-4 bg-gray-800 border rounded overflow-x-auto text-sm leading-relaxed text-green-300"
        style={{
          maxHeight: "500px",
          fontFamily: "Courier New, monospace",
        }}
      >
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

const App: React.FC = () => {
  const [repoInput, setRepoInput] = useState<string>("autonomys/subspace");
  const { fetching, error, graphData, selectedRepo } = useRepoData(repoInput);

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

      {/* Network Graph */}
      {graphData && (
        <div className="h-screen">
          <Network data={graphData} />
        </div>
      )}

      {/* JSON Previews */}
      {selectedRepo && (
        <JsonDisplay title="Selected Repo" data={selectedRepo} />
      )}
      {graphData && <JsonDisplay title="Graph Data" data={graphData} />}
    </div>
  );
};

export default App;