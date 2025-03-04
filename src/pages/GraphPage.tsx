import { useCallback, useEffect, useRef, useState } from "react";
import { ComputedNode } from "@nivo/network";
import { useNavigate } from "react-router-dom";

import SearchInput from "../components/SearchInput";
import LoadingSpinner from "../components/LoadingSpinner";
import NetworkWithZoom from "../components/Network";
import Tooltip from "../components/Network/Tooltip";
import DisplaySettings from "../components/DisplaySettings";
import JsonDisplay from "../components/JsonDisplay";
import NodeModal from "../components/NodeModal";
import { useGraph } from "../hooks/useGraph";
import { useDisplaySettings } from "../hooks/useDisplaySettings";
import { useSearchInputReducer } from "../hooks/useSearchInputReducer";
import { useSearchHistory } from "../hooks/useSearchHistory";
import { useNavHistoryReducer } from "../hooks/useNavHistoryReducer";
import { EitherNode } from "../types";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import { getErrorMessage } from "../utils/errorUtils";

interface GraphPageProps {
  query: string;
}

const GraphPage: React.FC<GraphPageProps> = ({ query }) => {
  const navigate = useNavigate();
  // Initialize search state with the query from the URL.
  const { draft, committed, setDraft, commitSearch, resetSearch } = useSearchInputReducer(query);
  const { searchHistory, addSearchQuery } = useSearchHistory();

  // Display settings and time period.
  const displaySettings = useDisplaySettings();
  // Get graph-related state based on the committed search value.
  const {
    isFetching,
    error,
    data,
  } = useGraph(committed, displaySettings.timePeriod);

  const {
    timePeriod,
    setTimePeriod,
    showJson,
    setShowJson,
    linkDistanceMultiplier,
    repulsivity,
    centeringStrength,
    setLinkDistanceMultiplier,
    setRepulsivity,
    setCenteringStrength,
  } = displaySettings;

  // Automatically commit the initial query so that fetching starts.
  useEffect(() => {
    if (query && !committed) {
      commitSearch();
    }
  }, [query, committed, commitSearch]);

  // Navigation history for graph nodes.
  const {
    history,
    currentIndex,
    addNode,
    navigateTo,
    resetHistory,
    canGoBack,
    canGoForward,
  } = useNavHistoryReducer();

  // Ref and local state for settings panel and modal.
  const settingsRef = useRef<HTMLDivElement>(null);
  const [showSettingsPanel, setShowSettingsPanel] = useState<boolean>(false);
  const [modalNode, setModalNode] = useState<ComputedNode<EitherNode> | null>(null);

  // When the selected entity changes, add it to navigation history.
  useEffect(() => {
    if (data?.selectedEntity) {
      addNode(data.selectedEntity);
    }
  }, [data?.selectedEntity, addNode]);

  // Add the committed query to search history once data is successfully fetched.
  useEffect(() => {
    if (committed && !isFetching && !error && data?.graph) {
      addSearchQuery(committed);
    }
  }, [committed, isFetching, error, data?.graph, addSearchQuery]);

  const handlePrev = useCallback(() => {
    if (canGoBack) {
      const newIndex = currentIndex - 1;
      navigateTo(newIndex);
      const prevNode = history[newIndex];
      const newInput = prevNode.type === "repo" ? prevNode.nameWithOwner : prevNode.name;
      setDraft(newInput);
      commitSearch();
    }
  }, [canGoBack, currentIndex, history, navigateTo, setDraft, commitSearch]);

  const handleNext = useCallback(() => {
    if (canGoForward) {
      const newIndex = currentIndex + 1;
      navigateTo(newIndex);
      const nextNode = history[newIndex];
      const newInput = nextNode.type === "repo" ? nextNode.nameWithOwner : nextNode.name;
      setDraft(newInput);
      commitSearch();
    }
  }, [canGoForward, currentIndex, history, navigateTo, setDraft, commitSearch]);

  const handleNodeClick = useCallback((node: ComputedNode<EitherNode>) => {
    setTooltipData(null);
    setModalNode(node)
  }, []);

  const handleSubmit = useCallback(
    (value: string) => {
      setDraft(value);
      commitSearch();
    },
    [commitSearch, setDraft]
  );

  const handleSearchInputChange = useCallback(
    (value: string) => {
      setDraft(value);
      if (value === "") {
        commitSearch();
        resetSearch();
      }
    },
    [setDraft, commitSearch, resetSearch]
  );
  const navigatedRef = useRef(false);
  const handleClearSearch = useCallback(() => {
    resetSearch();
    resetHistory();
    if (!navigatedRef.current) {
      navigatedRef.current = true;
      navigate("/");
    }
  }, [resetSearch, resetHistory, navigate]);

  useOnClickOutside(settingsRef, () => setShowSettingsPanel(false));

  const [tooltipData, setTooltipData] = useState<ComputedNode<EitherNode> | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

  const handleNodeMouseEnter = useCallback((node: ComputedNode<EitherNode>) => {
    setTooltipData(node);
    // You might want to adjust these coordinates based on your layout
    setTooltipPosition({ x: node.x, y: node.y });
  }, []);

  const handleNodeMouseLeave = useCallback(() => {
    setTooltipData(null);
    setTooltipPosition(null);
  }, []);

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

      {isFetching && <LoadingSpinner />}
      {error && <div className="text-red-500 mb-4">{getErrorMessage(error)}</div>}

      {data && !isFetching && !error && (
        <div className="h-screen relative bg-gray-800 overflow-hidden">
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={() => setShowSettingsPanel((prev) => !prev)}
              className="flex items-center p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition"
            >
              <span className="text-xl">⚙️</span>
            </button>
            {showSettingsPanel && (
              <div 
                ref={settingsRef}
                className="absolute top-full right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-20"
              >
                <DisplaySettings
                  linkDistanceMultiplier={linkDistanceMultiplier}
                  repulsivity={repulsivity}
                  centeringStrength={centeringStrength}
                  setLinkDistanceMultiplier={setLinkDistanceMultiplier}
                  setRepulsivity={setRepulsivity}
                  setCenteringStrength={setCenteringStrength}
                  showJson={showJson}
                  setShowJson={setShowJson}
                  timePeriod={timePeriod}
                  setTimePeriod={setTimePeriod}
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

          <NetworkWithZoom
            selectedNodeId={data.selectedEntity.id}
            data={data.graph}
            linkDistanceMultiplier={linkDistanceMultiplier}
            repulsivity={repulsivity}
            centeringStrength={centeringStrength}
            onNodeClick={handleNodeClick}
            onNodeMouseEnter={handleNodeMouseEnter}
            onNodeMouseLeave={handleNodeMouseLeave}
          />
        </div>
      )}

      {data && (
        <div className="mt-4">
          {showJson && (
            <>
              <JsonDisplay title="Selected Repo" data={data.selectedEntity} />
              <JsonDisplay title="Graph Data" data={data.graph} />
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

      {/* Render tooltip if data exists */}
      {tooltipData && tooltipPosition && (
        <Tooltip node={tooltipData.data} position={tooltipPosition} />
      )}
    </div>
  );
};

export default GraphPage;