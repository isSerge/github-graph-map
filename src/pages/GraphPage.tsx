import { useCallback, useEffect, useRef, useState } from "react";
import { ComputedNode } from "@nivo/network";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";

import SearchInput from "../components/SearchInput";
import LoadingSpinner from "../components/LoadingSpinner";
import NetworkWithZoom from "../components/Network";
import DisplaySettings from "../components/DisplaySettings";
import NodeModal from "../components/NodeModal";
import SidebarNodeList from "../components/SidebarNodeList";
import { useGraph } from "../hooks/useGraph";
import { useDisplaySettings } from "../hooks/useDisplaySettings";
import { useSearchInputReducer } from "../hooks/useSearchInputReducer";
import { useSearchHistory } from "../hooks/useSearchHistory";
import { useNavHistoryReducer } from "../hooks/useNavHistoryReducer";
import { EitherNode } from "../types";
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
  const {
    timePeriod,
    setTimePeriod,
    linkDistanceMultiplier,
    repulsivity,
    centeringStrength,
    setLinkDistanceMultiplier,
    setRepulsivity,
    setCenteringStrength,
  } = useDisplaySettings();
  
  // Get graph-related state based on the committed search value.
  const { isFetching, error, data } = useGraph(committed, timePeriod);

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
    setModalNode(node);
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

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white relative flex flex-col">
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
        <div className="flex h-screen">
          {/* Sidebar for Nodes List */}
          <SidebarNodeList data={data} handleSubmit={handleSubmit} />
          {/* Graph Container */}
          <div className="relative flex-1 bg-gray-800">
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
            />
          </div>
          {/* Settings Panel */}
          <DisplaySettings
            linkDistanceMultiplier={linkDistanceMultiplier}
            repulsivity={repulsivity}
            centeringStrength={centeringStrength}
            setLinkDistanceMultiplier={setLinkDistanceMultiplier}
            setRepulsivity={setRepulsivity}
            setCenteringStrength={setCenteringStrength}
            timePeriod={timePeriod}
            setTimePeriod={setTimePeriod}
          />
        </div>
      )}

      {modalNode && (
        <NodeModal
          node={modalNode}
          onClose={() => setModalNode(null)}
          onExploreGraph={(nodeName) => handleSubmit(nodeName)}
        />
      )}

      <Tooltip
        id="global-tooltip"
        place="right-start"
        delayHide={200}
        className="z-50"
      />
    </div>
  );
};

export default GraphPage;