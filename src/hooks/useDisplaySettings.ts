import { useReducer, useEffect } from "react";

export interface DisplaySettingsState {
  linkDistanceMultiplier: number;
  repulsivity: number;
  centeringStrength: number;
  timePeriod: number;
}

type Action =
  | { type: "SET_LINK_DISTANCE_MULTIPLIER"; payload: number }
  | { type: "SET_REPULSIVITY"; payload: number }
  | { type: "SET_CENTERING_STRENGTH"; payload: number }
  | { type: "SET_TIME_PERIOD"; payload: number }
  | { type: "RESET"; payload?: DisplaySettingsState };

const STORAGE_KEY = "displaySettings";

function settingsReducer(
  state: DisplaySettingsState,
  action: Action
): DisplaySettingsState {
  switch (action.type) {
    case "SET_LINK_DISTANCE_MULTIPLIER":
      return { ...state, linkDistanceMultiplier: action.payload };
    case "SET_REPULSIVITY":
      return { ...state, repulsivity: action.payload };
    case "SET_CENTERING_STRENGTH":
      return { ...state, centeringStrength: action.payload };
    case "SET_TIME_PERIOD":
      return { ...state, timePeriod: action.payload };
    case "RESET":
      return action.payload ?? state;
    default:
      return state;
  }
}

function loadInitialState(
  initialState: DisplaySettingsState
): DisplaySettingsState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading display settings", error);
  }
  return initialState;
}

export function useDisplaySettings(
  initialState: DisplaySettingsState = {
    linkDistanceMultiplier: 1,
    repulsivity: 300,
    centeringStrength: 0.5,
    timePeriod: 7,
  }
) {
  const [state, dispatch] = useReducer(
    settingsReducer,
    initialState,
    loadInitialState
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return {
    ...state,
    setLinkDistanceMultiplier: (value: number) =>
      dispatch({ type: "SET_LINK_DISTANCE_MULTIPLIER", payload: value }),
    setRepulsivity: (value: number) =>
      dispatch({ type: "SET_REPULSIVITY", payload: value }),
    setCenteringStrength: (value: number) =>
      dispatch({ type: "SET_CENTERING_STRENGTH", payload: value }),
    setTimePeriod: (value: number) =>
      dispatch({ type: "SET_TIME_PERIOD", payload: value }),
    reset: (newState?: DisplaySettingsState) =>
      dispatch({ type: "RESET", payload: newState }),
  };
}