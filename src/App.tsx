import { useEffect, useRef, useState } from "react";
import { ComputedNode } from "@nivo/network";

import Network from "./components/Network";
import DisplaySettings from "./components/DisplaySettings";
import { useGraph } from "./hooks/useGraph";
import { useDisplaySettings } from "./hooks/useDisplaySettings";
import { EitherNode } from "./types";
import { useOnClickOutside } from "./hooks/useOnClickOutside";
import JsonDisplay from "./components/JsonDisplay";
import NodeModal from "./components/NodeModal";

const App = () => {
  const [repoInput, setInput] = useState<string>("autonomys/subspace");
  const { fetching, error, graphData, selectedEntity } = useGraph(repoInput);
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
  // History management: an array of nodes (EitherNode) and a pointer.
  const [history, setHistory] = useState<EitherNode[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(-1);

  // Create a ref for the container that wraps the settings button and dropdown.
  const settingsRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(settingsRef, () => {
    setShowSettingsPanel(false);
  });

  useEffect(() => {
    if (!selectedEntity) return;
    setHistory((prev) => {
      // If the history already has an element at the current index,
      // and it’s the same as the new selected entity, then do nothing.
      if (
        prev.length > 0 &&
        currentHistoryIndex >= 0 &&
        prev[currentHistoryIndex].id === selectedEntity.id
      ) {
        return prev;
      }
      // Otherwise, trim any "redo" entries (everything beyond the current index)
      // and add the new selection.
      const newHistory = [...prev.slice(0, currentHistoryIndex + 1), selectedEntity];
      setCurrentHistoryIndex(newHistory.length - 1);
      return newHistory;
    });
    // We deliberately exclude currentHistoryIndex from dependencies here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEntity]);

  // Undo: go to the previous node in history.
  const nandlePrev = () => {
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1;
      setCurrentHistoryIndex(newIndex);
      const prevNode = history[newIndex];
      const newInput = prevNode.type === "repo" ? prevNode.name : prevNode.id;
      setInput(newInput);
    }
  };

  // Redo: go forward if available.
  const handleNext = () => {
    if (currentHistoryIndex < history.length - 1) {
      const newIndex = currentHistoryIndex + 1;
      setCurrentHistoryIndex(newIndex);
      const nextNode = history[newIndex];
      const newInput = nextNode.type === "repo" ? nextNode.name : nextNode.id;
      setInput(newInput);
    }
  };

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
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
      </header>

      {/* Loading or Error Message */}
      {fetching && <div className="text-blue-500 mb-4">Fetching data...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Main Network Graph */}
      {graphData && selectedEntity && !fetching && !error && (
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

          {/* Prev/Next Arrows */}
          <div className="absolute top-4 left-4 flex gap-4 z-20">
            <button
              onClick={nandlePrev}
              disabled={currentHistoryIndex <= 0}
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentHistoryIndex >= history.length - 1}
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>

          <Network
            selectedNodeName={selectedEntity.name}
            data={graphData}
            linkDistanceMultiplier={linkDistanceMultiplier}
            repulsivity={repulsivity}
            centeringStrength={centeringStrength}
            onNodeClick={handleNodeClick}
          />
        </div>
      )}

      {/* Optional JSON displays */}
      {selectedEntity && graphData && (
        <div className="mt-4">
          {showJson && (
            <>
              <JsonDisplay title="Selected Repo" data={selectedEntity} />
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
          onSeeGraph={(nodeName) => setInput(nodeName)} 
        />
      )}
    </div>
  );
};

export default App;