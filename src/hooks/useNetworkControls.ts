import { useState } from "react";

interface NetworkControlsState {
  linkDistanceMultiplier: number;
  repulsivity: number;
  centeringStrength: number;
}

export function useNetworkControls(initialState: NetworkControlsState = {
  linkDistanceMultiplier: 1,
  repulsivity: 300,
  centeringStrength: 0.5,
}) {
  const [linkDistanceMultiplier, setLinkDistanceMultiplier] = useState<number>(
    initialState.linkDistanceMultiplier
  );
  const [repulsivity, setRepulsivity] = useState<number>(
    initialState.repulsivity
  );
  const [centeringStrength, setCenteringStrength] = useState<number>(
    initialState.centeringStrength
  );

  return {
    linkDistanceMultiplier,
    repulsivity,
    centeringStrength,
    setLinkDistanceMultiplier,
    setRepulsivity,
    setCenteringStrength,
  };
}