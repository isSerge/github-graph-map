import { useReducer, useCallback } from "react";

export interface SearchState {
  draft: string;
  committed: string;
}

export type SearchAction =
  | { type: 'setDraft'; payload: string }
  | { type: 'commit' }
  | { type: 'reset' };

function searchInputReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case 'setDraft':
      return { ...state, draft: action.payload };
    case 'commit':
      return { ...state, committed: state.draft };
    case 'reset':
      return { draft: '', committed: '' };
    default:
      return state;
  }
}

export function useSearchInputReducer(initialDraft = '') {
  const initialState: SearchState = { draft: initialDraft, committed: '' };
  const [state, dispatch] = useReducer(searchInputReducer, initialState);

  const setDraft = useCallback((payload: string) => dispatch({ type: 'setDraft', payload }),[]);
  const commitSearch = useCallback(() => dispatch({ type: 'commit' }), []);
  const resetSearch = useCallback(() => dispatch({ type: 'reset' }), []);

  return {
    draft: state.draft,
    committed: state.committed,
    setDraft,
    commitSearch,
    resetSearch,
  }
}