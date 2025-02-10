type NetworkControlsProps = {
  linkDistanceMultiplier: number;
  repulsivity: number;
  centeringStrength: number;
  setLinkDistanceMultiplier: (value: number) => void;
  setRepulsivity: (value: number) => void;
  setCenteringStrength: (value: number) => void;
};

const NetworkControls: React.FC<NetworkControlsProps> = ({
  linkDistanceMultiplier,
  repulsivity,
  centeringStrength,
  setLinkDistanceMultiplier,
  setRepulsivity,
  setCenteringStrength,
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Network Display Settings</h2>
      
      {/* Link Distance Multiplier */}
      <div className="mb-4">
        <label htmlFor="linkDistance" className="block text-sm font-medium mb-1">
          Link Distance Multiplier: {linkDistanceMultiplier}
        </label>
        <input
          id="linkDistance"
          type="range"
          min="0.5"
          max="3"
          step="0.1"
          value={linkDistanceMultiplier}
          onChange={(e) => setLinkDistanceMultiplier(Number(e.target.value))}
          className="w-full"
        />
      </div>
      
      {/* Repulsivity */}
      <div className="mb-4">
        <label htmlFor="repulsivity" className="block text-sm font-medium mb-1">
          Repulsivity: {repulsivity}
        </label>
        <input
          id="repulsivity"
          type="range"
          min="100"
          max="1000"
          step="50"
          value={repulsivity}
          onChange={(e) => setRepulsivity(Number(e.target.value))}
          className="w-full"
        />
      </div>
      
      {/* Centering Strength */}
      <div className="mb-4">
        <label htmlFor="centeringStrength" className="block text-sm font-medium mb-1">
          Centering Strength: {centeringStrength}
        </label>
        <input
          id="centeringStrength"
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={centeringStrength}
          onChange={(e) => setCenteringStrength(Number(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default NetworkControls;