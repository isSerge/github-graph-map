import NetworkControls from "./NetworkControls";
import RepoInfo from "./RepoInfo";
import { RepoData } from "./types";

type SidebarProps = {
    repo: RepoData | null;
    linkDistanceMultiplier: number;
    repulsivity: number;
    centeringStrength: number;
    setLinkDistanceMultiplier: (value: number) => void;
    setRepulsivity: (value: number) => void;
    setCenteringStrength: (value: number) => void;
  };

const Sidebar: React.FC<SidebarProps> = ({ 
    repo,
    linkDistanceMultiplier,
    repulsivity,
    centeringStrength,
    setLinkDistanceMultiplier,
    setRepulsivity,
    setCenteringStrength,
 }) => {
  if (!repo) return null;

  return (
    <aside className="w-sm p-4 bg-gray-800 text-white overflow-auto">
        <NetworkControls 
            linkDistanceMultiplier={linkDistanceMultiplier}
            repulsivity={repulsivity}
            centeringStrength={centeringStrength}
            setLinkDistanceMultiplier={setLinkDistanceMultiplier}
            setRepulsivity={setRepulsivity}
            setCenteringStrength={setCenteringStrength}
        />
        {repo && (
            <RepoInfo  repo={repo} />
        )}
    </aside>
  );
};

export default Sidebar;