import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// Holds the current draft value from the search input.
export const searchInputAtom = atom<string>("");

// Holds the last committed search term.
export const committedSearchAtom = atom<string>("");

// Write-only atom to commit the search.
// It takes the current draft value and sets it as the committed search.
export const commitSearchAtom = atom(
  null,
  (get, set) => {
    const draft = get(searchInputAtom);
    set(committedSearchAtom, draft);
  }
);

// Write-only atom to reset the search state.
export const resetSearchAtom = atom(
  null,
  (__, set) => {
    set(searchInputAtom, "");
    set(committedSearchAtom, "");
  }
);

// An atom to store the search history using local storage.
export const searchHistoryAtom = atomWithStorage<string[]>("searchHistory", []);