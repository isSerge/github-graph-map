interface DisplaySettingsProps {
  linkDistanceMultiplier: number;
  repulsivity: number;
  centeringStrength: number;
  setLinkDistanceMultiplier: (value: number) => void;
  setRepulsivity: (value: number) => void;
  setCenteringStrength: (value: number) => void;
  timePeriod: number;
  setTimePeriod: (value: number) => void;
}

const DisplaySettings: React.FC<DisplaySettingsProps> = ({
  linkDistanceMultiplier,
  repulsivity,
  centeringStrength,
  setLinkDistanceMultiplier,
  setRepulsivity,
  setCenteringStrength,
  timePeriod,
  setTimePeriod,
}) => {
  return (
    <aside className="w-60 p-2">
      {/* Time Period Radio Buttons */}
      <div className="mb-4">
        <span className="block text-sm font-medium mb-2">Time Period:</span>
        <div className="flex rounded-md shadow-sm gap-2">
          <button
            onClick={() => setTimePeriod(1)}
            className={`w-1/3 border border-gray-300 text-xs font-medium focus:outline-none ${
              timePeriod === 1 ? "bg-blue-600 text-white" : "bg-white text-gray-700"
            }`}
          >
            1 day
          </button>
          <button
            onClick={() => setTimePeriod(7)}
            className={`w-1/3 border-t border-b border-gray-300 text-xs font-medium focus:outline-none ${
              timePeriod === 7 ? "bg-blue-600 text-white" : "bg-white text-gray-700"
            }`}
          >
            7 days
          </button>
          <button
            onClick={() => setTimePeriod(30)}
            className={`w-1/3 border border-gray-300 text-xs font-medium focus:outline-none ${
              timePeriod === 30 ? "bg-blue-600 text-white" : "bg-white text-gray-700"
            }`}
          >
            30 days
          </button>
        </div>
      </div>

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
    </aside>
  );
};

export default DisplaySettings;