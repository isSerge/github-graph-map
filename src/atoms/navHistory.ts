// atoms/navHistory.ts
import { atom } from "jotai";
import { EitherNode } from "../types/networkTypes";

export const navHistoryAtom = atom<EitherNode[]>([]);
export const navHistoryIndexAtom = atom<number>(-1);

export const currentNavNodeAtom = atom((get) => {
  const history = get(navHistoryAtom);
  const index = get(navHistoryIndexAtom);
  return history[index] ?? null;
});

export const addNavNodeAtom = atom(null, (get, set, node: EitherNode) => {
  const history = get(navHistoryAtom);
  const currentIndex = get(navHistoryIndexAtom);
  const existingIndex = history.findIndex(n => n.id === node.id);
  if (existingIndex !== -1) {
    set(navHistoryIndexAtom, existingIndex);
  } else {
    const updatedHistory = [...history.slice(0, currentIndex + 1), node];
    set(navHistoryAtom, updatedHistory);
    set(navHistoryIndexAtom, updatedHistory.length - 1);
  }
});

export const navigateHistoryAtom = atom(null, (get, set, direction: "prev" | "next") => {
  const currentIndex = get(navHistoryIndexAtom);
  const history = get(navHistoryAtom);
  
  let newIndex = currentIndex;
  if (direction === "prev" && currentIndex > 0) {
    newIndex -= 1;
  } else if (direction === "next" && currentIndex < history.length - 1) {
    newIndex = currentIndex + 1;
  } else {
    return; // Invalid move
  }

  set(navHistoryIndexAtom, newIndex);
});

export const resetHistoryAtom = atom(null, (_, set) => {
  set(navHistoryAtom, []);
  set(navHistoryIndexAtom, -1);
});

export const canNavigateBackAtom = atom((get) => {
  const index = get(navHistoryIndexAtom);
  return index > 0;
});

export const canNavigateForwardAtom = atom((get) => {
  const history = get(navHistoryAtom);
  const index = get(navHistoryIndexAtom);
  return index < history.length - 1;
});