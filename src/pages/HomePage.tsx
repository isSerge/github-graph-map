import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom, useSetAtom } from "jotai";

import SearchInput from "../components/SearchInput";
import ExploreList from "../components/ExploreList";

import {
  searchInputAtom,
  commitSearchAtom,
  resetSearchAtom,
  searchHistoryAtom,
} from "../atoms/search";

const HomePage = () => {
  const navigate = useNavigate();
  
  // search state atoms
  const [draft, setDraft] = useAtom(searchInputAtom);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const commitSearch = useSetAtom(commitSearchAtom);
  const resetSearch = useSetAtom(resetSearchAtom);

  // When the user submits a search (or selects an explore item), navigate to the GraphPage.
  const handleSubmit = useCallback((value: string) => {
    // Optionally, you can update the search state here before navigating.
    setDraft(value);
    commitSearch();
    navigate(`/${value}`);
    // Update search history: prepend the new search term and remove duplicates.
    setSearchHistory((prev: string[]) => {
      const filtered = prev.filter((item) => item !== value);
      return [value, ...filtered];
    });
  }, [navigate, setDraft, commitSearch, setSearchHistory]);

  const handleSearchInputChange = useCallback((value: string) => {
    setDraft(value);
  }, [setDraft]);

  const handleClearSearch = useCallback(() => {
    resetSearch();
  }, [resetSearch]);

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white flex flex-col items-center justify-center">
      <header className="w-full max-w-xl mb-8">
        <SearchInput
          value={draft}
          onChange={handleSearchInputChange}
          onSubmit={handleSubmit}
          onClear={handleClearSearch}
          history={searchHistory}
          onSelectHistory={handleSubmit}
          placeholder="Enter repo (e.g., facebook/react) or user (e.g., torvalds)"
        />
      </header>
      <ExploreList onSelect={handleSubmit} />
    </div>
  );
};

export default HomePage;