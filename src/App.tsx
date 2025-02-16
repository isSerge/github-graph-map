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
import LoadingSpinner from "./components/LoadingSpinner";
import { useHistoryReducer } from "./hooks/useHistoryReducer";

const App = () => {
  // Use our reducer to manage the search state.
  const {
    draft,
    committed,
    setDraft,
    commitSearch,
    resetSearch,
  } = useSearchReducer();
  // The committed value (searchState.committed) is used to fetch graph data.
  const { fetching, error, graphData, selectedEntity, resetGraph } = useGraph(committed);
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

  const { 
    history, 
    currentIndex, 
    addNode, 
    navigateTo, 
    resetHistory, 
    canGoBack, 
    canGoForward 
  } = useHistoryReducer();

  // Ref for settings container.
  const settingsRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(settingsRef, () => setShowSettingsPanel(false));

  const [showSettingsPanel, setShowSettingsPanel] = useState<boolean>(false);
  const [modalNode, setModalNode] = useState<ComputedNode<EitherNode> | null>(null);

  useEffect(() => {
    if (selectedEntity) {
      addNode(selectedEntity);
    }
  }, [selectedEntity, addNode]);

  // When a new committed search happens, update search history.
  useEffect(() => {
    if (committed && !fetching && !error) {
      setSearchHistory((prev) =>
        prev.includes(committed) ? prev : [committed, ...prev]
      );
    }
  }, [committed, fetching, error]);

  const handlePrev = () => {
    if (canGoBack) {
      const newIndex = currentIndex - 1;
      navigateTo(newIndex);
      const prevNode = history[newIndex];
      const newInput = prevNode.type === "repo" ? prevNode.nameWithOwner : prevNode.name;
      setDraft(newInput);
      commitSearch();
    }
  };

  const handleNext = () => {
    if (canGoForward) {
      const newIndex = currentIndex + 1;
      navigateTo(newIndex);
      const nextNode = history[newIndex];
      const newInput = nextNode.type === "repo" ? nextNode.nameWithOwner : nextNode.name;
      setDraft(newInput);
      commitSearch();
    }
  };

  const handleNodeClick = (node: ComputedNode<EitherNode>) => setModalNode(node);

  const handleClearSearch = () => {
    resetSearch();
    resetHistory();
    resetGraph();
  };

  // Called when SearchInput commits a search.
  const handleSubmit = (value: string) => {
    setDraft(value);
    commitSearch();
    // The committed value (searchState.committed) will then trigger useGraph.
    setSearchHistory((prev) =>
      prev.includes(value) ? prev : [value, ...prev]
    );
  };

  const handleSearchInputChange = (value: string) => {
    setDraft(value);
    if (value === "") {
      // When the user manually deletes everything,
      // commit an empty search and reset the graph.
      commitSearch();
      resetSearch();
      resetGraph();
    }
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white relative flex flex-col">
      <header>
        <SearchInput
          value={draft}
          onChange={handleSearchInputChange}
          onSubmit={handleSubmit}
          onClear={handleClearSearch}
          history={searchHistory}
          onSelectHistory={handleSubmit}
        />
      </header>

      {fetching && <LoadingSpinner />}
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
              disabled={!canGoBack}
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <button
              onClick={handleNext}
              disabled={!canGoForward}
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