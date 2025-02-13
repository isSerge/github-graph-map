import React, { useRef, useState } from "react";
import { ComputedNode } from "@nivo/network";

import Network from "./components/Network";
import DisplaySettings from "./components/DisplaySettings";
import { useGraph } from "./hooks/useGraph";
import { useDisplaySettings } from "./hooks/useDisplaySettings";
import { EitherNode } from "./types";
import { useOnClickOutside } from "./hooks/useOnClickOutside";
import JsonDisplay from "./components/JsonDisplay";
import NodeModal from "./components/NodeModal";

const App: React.FC = () => {
  const [repoInput, setRepoInput] = useState<string>("autonomys/subspace");
  const { fetching, error, graphData, selectedRepo } = useGraph(repoInput);
  const {
    showJson,
    setShowJson,
    linkDistanceMultiplier,
    repulsivity,
    centeringStrength,
    setLinkDistanceMultiplier,
    setRepulsivity,
    setCenteringStrength,
  } = useDisplaySettings();

  // State for toggling the settings dropdown.
  const [showSettingsPanel, setShowSettingsPanel] = useState<boolean>(false);
  // State to track which node (if any) is selected for modal display.
  const [modalNode, setModalNode] = useState<ComputedNode<EitherNode> | null>(null);

  // Create a ref for the container that wraps the settings button and dropdown.
  const settingsRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(settingsRef, () => {
    setShowSettingsPanel(false);
  });

  // When a node is clicked, show the modal.
  const handleNodeClick = (node: ComputedNode<EitherNode>) => {
    setModalNode(node);
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white relative flex flex-col">
      <header>
        {/* Repository Input */}
        <input
          type="text"
          placeholder="Enter repository (e.g., facebook/react)"
          value={repoInput}
          onChange={(e) => setRepoInput(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
      </header>

      {/* Loading or Error Message */}
      {fetching && <div className="text-blue-500 mb-4">Fetching data...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Main Network Graph */}
      {graphData && selectedRepo && !fetching && !error && (
        <div className="h-screen relative">
          {/* Settings Button & Dropdown in the top right */}
          <div ref={settingsRef} className="absolute top-4 right-4 z-20">
            <button
              onClick={() => setShowSettingsPanel((prev) => !prev)}
              className="flex items-center p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition"
            >
              <span className="text-xl">⚙️</span>
            </button>
            {showSettingsPanel && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-20">
                <DisplaySettings
                  linkDistanceMultiplier={linkDistanceMultiplier}
                  repulsivity={repulsivity}
                  centeringStrength={centeringStrength}
                  setLinkDistanceMultiplier={setLinkDistanceMultiplier}
                  setRepulsivity={setRepulsivity}
                  setCenteringStrength={setCenteringStrength}
                  showJson={showJson}
                  setShowJson={setShowJson}
                />
              </div>
            )}
          </div>

          <Network
            selectedNodeName={selectedRepo.name}
            data={graphData}
            linkDistanceMultiplier={linkDistanceMultiplier}
            repulsivity={repulsivity}
            centeringStrength={centeringStrength}
            onNodeClick={handleNodeClick}
          />
        </div>
      )}

      {/* Optional JSON displays */}
      {selectedRepo && graphData && (
        <div className="mt-4">
          {showJson && (
            <>
              <JsonDisplay title="Selected Repo" data={selectedRepo} />
              <JsonDisplay title="Graph Data" data={graphData} />
            </>
          )}
        </div>
      )}

      {/* Modal for node details */}
      {modalNode && (
        <NodeModal 
          node={modalNode} 
          onClose={() => setModalNode(null)} 
          onSeeGraph={(nodeName) => setRepoInput(nodeName)} 
        />
      )}
    </div>
  );
};

export default App;