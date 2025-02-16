// App.tsx
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
import ExploreLists from "./components/ExploreLists";
import SearchInput from "./components/SearchInput";
import { useSearchReducer } from "./hooks/useSearchReducer";

const App = () => {
  // Use our reducer to manage the search state.
  const [searchState, dispatchSearch] = useSearchReducer();
  // The committed value (searchState.committed) is used to fetch graph data.
  const { fetching, error, graphData, selectedEntity, resetGraph } = useGraph(searchState.committed);
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

  // Parent also maintains search history.
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  // Node history for undo/redo navigation.
  const [history, setHistory] = useState<EitherNode[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(-1);
  // Ref for settings container.
  const settingsRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(settingsRef, () => setShowSettingsPanel(false));
  const [showSettingsPanel, setShowSettingsPanel] = useState<boolean>(false);
  const [modalNode, setModalNode] = useState<ComputedNode<EitherNode> | null>(null);

  // When a new committed search happens, update search history.
  useEffect(() => {
    if (searchState.committed && !fetching && !error) {
      setSearchHistory((prev) =>
        prev.includes(searchState.committed) ? prev : [searchState.committed, ...prev]
      );
    }
  }, [searchState.committed, fetching, error]);

  // When a new node is selected, update node history.
  useEffect(() => {
    if (!selectedEntity) return;
    setHistory((prev) => {
      if (
        prev.length > 0 &&
        currentHistoryIndex >= 0 &&
        prev[currentHistoryIndex].id === selectedEntity.id
      ) {
        return prev;
      }
      const newHistory = [...prev.slice(0, currentHistoryIndex + 1), selectedEntity];
      setCurrentHistoryIndex(newHistory.length - 1);
      return newHistory;
    });
    // TODO: Fix the exhaustive-deps warning.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEntity]);

  const handlePrev = () => {
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1;
      setCurrentHistoryIndex(newIndex);
      const prevNode = history[newIndex];
      const newInput = prevNode.type === "repo" ? prevNode.nameWithOwner : prevNode.name;
      dispatchSearch({ type: "setDraft", payload: newInput });
      dispatchSearch({ type: "commit" });
    }
  };

  const handleNext = () => {
    if (currentHistoryIndex < history.length - 1) {
      const newIndex = currentHistoryIndex + 1;
      setCurrentHistoryIndex(newIndex);
      const nextNode = history[newIndex];
      const newInput = nextNode.type === "repo" ? nextNode.nameWithOwner : nextNode.name;
      dispatchSearch({ type: "setDraft", payload: newInput });
      dispatchSearch({ type: "commit" });
    }
  };

  const handleNodeClick = (node: ComputedNode<EitherNode>) => setModalNode(node);

  const handleClearSearch = () => {
    dispatchSearch({ type: "reset" });
    setHistory([]);
    setCurrentHistoryIndex(-1);
    resetGraph();
  };

  // Called when SearchInput commits a search.
  const handleSubmit = (value: string) => {
    dispatchSearch({ type: "setDraft", payload: value });
    dispatchSearch({ type: "commit" });
    // The committed value (searchState.committed) will then trigger useGraph.
    setSearchHistory((prev) =>
      prev.includes(value) ? prev : [value, ...prev]
    );
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white relative flex flex-col">
      <header>
        <SearchInput
          value={searchState.draft}
          onChange={(val) => dispatchSearch({ type: "setDraft", payload: val })}
          onSubmit={handleSubmit}
          onClear={handleClearSearch}
          history={searchHistory}
          onSelectHistory={handleSubmit}
        />
      </header>

      {fetching && <div className="text-blue-500 mb-4">Fetching data...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {!fetching && !error && !selectedEntity && (
        <ExploreLists onSelect={(node: EitherNode) => handleSubmit(node.name)} />
      )}

      {graphData && selectedEntity && !fetching && !error && (
        <div className="h-screen relative">
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

          <div className="absolute top-4 left-4 flex gap-4 z-20">
            <button
              onClick={handlePrev}
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
            selectedNodeId={selectedEntity.id}
            data={graphData}
            linkDistanceMultiplier={linkDistanceMultiplier}
            repulsivity={repulsivity}
            centeringStrength={centeringStrength}
            onNodeClick={handleNodeClick}
          />
        </div>
      )}

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

      {modalNode && (
        <NodeModal
          node={modalNode}
          onClose={() => setModalNode(null)}
          onExploreGraph={(nodeName) => handleSubmit(nodeName)}
        />
      )}
    </div>
  );
};

export default App;