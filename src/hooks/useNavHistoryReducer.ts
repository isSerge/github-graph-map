import { useReducer } from "react";
import { EitherNode } from "../types";

interface HistoryState {
  nodes: EitherNode[];
  index: number;
}

const initialHistoryState: HistoryState = {
  nodes: [],
  index: -1,
};

type HistoryAction =
  | { type: "ADD"; node: EitherNode }
  | { type: "NAVIGATE"; index: number }
  | { type: "RESET" };

function navHistoryReducer(state: HistoryState, action: HistoryAction): HistoryState {
  switch (action.type) {
    case "ADD": {
      // Check if the node already exists in the history.
      const existingIndex = state.nodes.findIndex(n => n.id === action.node.id);
      if (existingIndex !== -1) {
        // If it's already the current node, do nothing.
        if (existingIndex === state.index) return state;
        // Otherwise, update the current index to the existing node.
        return { ...state, index: existingIndex };
      }
      // If the node doesn't exist, discard any forward history and add the new node.
      const newNodes = [...state.nodes.slice(0, state.index + 1), action.node];
      return { nodes: newNodes, index: newNodes.length - 1 };
    }
    case "NAVIGATE": {
      if (action.index >= 0 && action.index < state.nodes.length) {
        return { ...state, index: action.index };
      }
      return state;
    }
    case "RESET":
      return initialHistoryState;
    default:
      return state;
  }
}

export function useNavHistoryReducer() {
  const [state, dispatch] = useReducer(navHistoryReducer, initialHistoryState);

  const addNode = (node: EitherNode) => dispatch({ type: "ADD", node });
  const navigateTo = (index: number) => dispatch({ type: "NAVIGATE", index });
  const resetHistory = () => dispatch({ type: "RESET" });

  return {
    history: state.nodes,
    currentIndex: state.index,
    addNode,
    navigateTo,
    resetHistory,
    canGoBack: state.index > 0,
    canGoForward: state.index < state.nodes.length - 1,
  };
}