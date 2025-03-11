import { useCallback, useEffect, useRef, useState } from "react";
import { ComputedNode } from "@nivo/network";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { useAtom, useSetAtom } from "jotai";

import {
  timePeriodAtom,
  linkDistanceMultiplierAtom,
  repulsivityAtom,
  centeringStrengthAtom,
} from "../atoms/displaySettings";
import {
  navigateHistoryAtom,
  canNavigateForwardAtom,
  canNavigateBackAtom,
  resetHistoryAtom,
  addNavNodeAtom,
  currentNavNodeAtom,
} from "../atoms/navHistory";
import {
  searchInputAtom,
  committedSearchAtom,
  commitSearchAtom,
  resetSearchAtom,
  searchHistoryAtom,
} from "../atoms/search";
import SearchInput from "../components/SearchInput";
import LoadingSpinner from "../components/LoadingSpinner";
import NetworkWithZoom from "../components/Network";
import DisplaySettings from "../components/DisplaySettings";
import NodeModal from "../components/NodeModal";
import SidebarNodeList from "../components/SidebarNodeList";
import { useGraph } from "../hooks/useGraph";
import { EitherNode } from "../types";
import { getErrorMessage } from "../utils/errorUtils";

interface GraphPageProps {
  query: string;
}

const GraphPage: React.FC<GraphPageProps> = ({ query }) => {
  // display settings atoms
  const [timePeriod] = useAtom(timePeriodAtom);
  const [linkDistanceMultiplier] = useAtom(linkDistanceMultiplierAtom);
  const [repulsivity] = useAtom(repulsivityAtom);
  const [centeringStrength] = useAtom(centeringStrengthAtom);

  // navigation history atoms
  const [, addNavNode] = useAtom(addNavNodeAtom);
  const [, navigateHistory] = useAtom(navigateHistoryAtom);
  const [canGoBack] = useAtom(canNavigateBackAtom);
  const [canGoForward] = useAtom(canNavigateForwardAtom);
  const [, resetHistory] = useAtom(resetHistoryAtom);
  const [currentNode] = useAtom(currentNavNodeAtom);

  // search state atoms
  const [draft, setDraft] = useAtom(searchInputAtom);
  const [committed] = useAtom(committedSearchAtom);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const commitSearch = useSetAtom(commitSearchAtom);
  const resetSearch = useSetAtom(resetSearchAtom);

  // Initialize search state with the query from the URL.
  // const { draft, committed, setDraft, commitSearch, resetSearch } = useSearchInputReducer(query);
  // const { searchHistory, addSearchQuery } = useSearchHistory();

  // Get graph-related state based on the committed search value.
  const { isFetching, error, data } = useGraph(committed, timePeriod);

  // Automatically commit the initial query so that fetching starts.
  useEffect(() => {
    if (query && !committed) {
      commitSearch();
    }
  }, [query, committed, commitSearch]);

  const [modalNode, setModalNode] = useState<ComputedNode<EitherNode> | null>(null);

  // When the selected entity changes, add it to navigation history.
  useEffect(() => {
    if (data?.selectedEntity) {
      addNavNode(data.selectedEntity);
    }
  }, [data?.selectedEntity, addNavNode]);

  // Add the committed query to search history once data is successfully fetched.
  useEffect(() => {
    if (committed && !isFetching && !error && data?.graph) {
      setSearchHistory((prev) => {
        const filtered = prev.filter((item) => item !== committed);
        return [committed, ...filtered];
      });
    }
  }, [committed, isFetching, error, data?.graph, setSearchHistory]);

  const handlePrev = () => navigateHistory("prev");
  const handleNext = () => navigateHistory("next");

  const navigate = useNavigate();
  // Synchronize navigation with URL and input
  useEffect(() => {
    if (currentNode) {
      const newInput = currentNode.type === "repo" ? currentNode.nameWithOwner : currentNode.name;
      setDraft(newInput);
      commitSearch();
      navigate(`/${newInput}`, { replace: true });
    }
  }, [currentNode, setDraft, commitSearch, navigate]);

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
          <SidebarNodeList data={data} handleSubmit={handleSubmit} timePeriod={timePeriod} />
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
              timePeriod={timePeriod}
              key={data.selectedEntity.id}
            />
          </div>
          {/* Settings Panel */}
          <DisplaySettings />
        </div>
      )}

      {modalNode && (
        <NodeModal
          node={modalNode}
          onClose={() => setModalNode(null)}
          onExploreGraph={(nodeName) => handleSubmit(nodeName)}
          timePeriod={timePeriod}
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