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

export function useSearchReducer(initialDraft = ''): [SearchState, React.Dispatch<SearchAction>] {
  const initialState: SearchState = { draft: initialDraft, committed: '' };
  return useReducer(searchReducer, initialState);
}