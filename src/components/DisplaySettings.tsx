interface DisplaySettingsProps {
  linkDistanceMultiplier: number;
  repulsivity: number;
  centeringStrength: number;
  setLinkDistanceMultiplier: (value: number) => void;
  setRepulsivity: (value: number) => void;
  setCenteringStrength: (value: number) => void;
  showJson: boolean;
  setShowJson: (value: boolean) => void;
}

const DisplaySettings: React.FC<DisplaySettingsProps> = ({
  linkDistanceMultiplier,
  repulsivity,
  centeringStrength,
  setLinkDistanceMultiplier,
  setRepulsivity,
  setCenteringStrength,
  showJson,
  setShowJson,
}) => {
  return (
    <div className="mt-4 p-4">
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

      {/* Toggle Switch for JSON Data Display */}
      <div className="flex items-center">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={showJson}
            onChange={() => setShowJson(!showJson)}
          />
          <div className="w-11 h-6 bg-gray-600 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 transition-colors duration-300 peer-checked:bg-blue-500"></div>
          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform peer-checked:translate-x-5"></div>
        </label>
        <span className="text-sm font-medium text-gray-300 ml-3">Show JSON Data</span>
      </div>
    </div>
  );
};

export default DisplaySettings;