import React, { useState } from "react";
import Network from "./Network";
import Sidebar from "./Sidebar";
import { useRepoData } from "./useRepoData";
import { useNetworkControls } from "./useNetworkControls";

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
  const {
    linkDistanceMultiplier,
    repulsivity,
    centeringStrength,
    setLinkDistanceMultiplier,
    setRepulsivity,
    setCenteringStrength,
  } = useNetworkControls();

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      {/* Input Field */}
      <input
        type="text"
        placeholder="Enter repository (e.g., facebook/react)"
        value={repoInput}
        onChange={(e) => setRepoInput(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      {/* Display error or loading */}
      {fetching && <div className="text-blue-500 mb-4">Fetching data...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Main Layout: Sidebar and Network Graph */}
      <div className="flex flex-col md:flex-row h-[80vh]">
        
        {/* Network Graph */}
        <div className="flex-1">
          {graphData ? (
            <Network
              data={graphData}
              linkDistanceMultiplier={linkDistanceMultiplier}
              repulsivity={repulsivity}
              centeringStrength={centeringStrength}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No graph data available.
            </div>
          )}
        </div>
        {/* Sidebar */}
        <Sidebar 
          repo={selectedRepo}
          linkDistanceMultiplier={linkDistanceMultiplier}
          repulsivity={repulsivity}
          centeringStrength={centeringStrength}
          setLinkDistanceMultiplier={setLinkDistanceMultiplier}
          setRepulsivity={setRepulsivity}
          setCenteringStrength={setCenteringStrength}
        />
      </div>
      {/* JSON Previews */}
      {selectedRepo && (
        <JsonDisplay title="Selected Repo" data={selectedRepo} />
      )}
      {graphData && <JsonDisplay title="Graph Data" data={graphData} />}
    </div>
  );
};

export default App;