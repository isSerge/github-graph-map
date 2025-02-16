import { useReducer } from "react";

export interface SearchState {
  draft: string;
  committed: string;
}

export type SearchAction =
  | { type: 'setDraft'; payload: string }
  | { type: 'commit' }
  | { type: 'reset' };

function searchReducer(state: SearchState, action: SearchAction): SearchState {
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

export function useSearchReducer(initialDraft = '') {
  const initialState: SearchState = { draft: initialDraft, committed: '' };
  const [state, dispatch] = useReducer(searchReducer, initialState);

  const setDraft = (payload: string) => dispatch({ type: 'setDraft', payload });
  const commitSearch = () => dispatch({ type: 'commit' });
  const resetSearch = () => dispatch({ type: 'reset' });

  return {
    draft: state.draft,
    committed: state.committed,
    setDraft,
    commitSearch,
    resetSearch,
  }
}