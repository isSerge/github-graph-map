import { useState } from "react";

interface DisplaySettingsState {
  linkDistanceMultiplier: number;
  repulsivity: number;
  centeringStrength: number;
}

export function useDisplaySettings(initialState: DisplaySettingsState = {
  linkDistanceMultiplier: 1,
  repulsivity: 300,
  centeringStrength: 0.5,
}) {
  const [showJson, setShowJson] = useState<boolean>(false);
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
    showJson,
    setShowJson,
  };
}