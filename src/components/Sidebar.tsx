import { useState } from "react";

import DisplaySettings from "./DisplaySettings";
import RepoInfo from "./RepoInfo";
import { RepoData } from "../types";

type SidebarProps = {
  repo: RepoData | null;
  linkDistanceMultiplier: number;
  repulsivity: number;
  centeringStrength: number;
  setLinkDistanceMultiplier: (value: number) => void;
  setRepulsivity: (value: number) => void;
  setCenteringStrength: (value: number) => void;
  setShowJson: (value: boolean) => void;
  showJson: boolean;
};

const Sidebar: React.FC<SidebarProps> = ({
  repo,
  linkDistanceMultiplier,
  repulsivity,
  centeringStrength,
  setLinkDistanceMultiplier,
  setRepulsivity,
  setCenteringStrength,
  setShowJson,
  showJson,
}) => {
  const [showSettings, setShowSettings] = useState(false);

  if (!repo) return null;

  return (
    <aside className="w-sm p-4 bg-gray-800 text-white overflow-auto border-l border-gray-700">
      {/* Toggle button for network settings */}

        <button
          onClick={() => setShowSettings((prev) => !prev)}
          className="flex items-center text-blue-400 focus:outline-none"
        >
          {/* Using a simple gear emoji as an icon */}
          <span className="mr-2">{showSettings ? "❌" : "⚙️"}</span>
          <span>Display Settings</span>
        </button>
      {showSettings && (
        <DisplaySettings
          linkDistanceMultiplier={linkDistanceMultiplier}
          repulsivity={repulsivity}
          centeringStrength={centeringStrength}
          setLinkDistanceMultiplier={setLinkDistanceMultiplier}
          setRepulsivity={setRepulsivity}
          setCenteringStrength={setCenteringStrength}
          showJson={showJson}
          setShowJson={setShowJson}
        />)}
      {repo && (
        <RepoInfo repo={repo} />
      )}
    </aside>
  );
};

export default Sidebar;