import { EitherNode } from "../../types";

interface TooltipProps {
  data: EitherNode; // You can type this according to your node data shape
  position: { x: number; y: number };
}

const Tooltip = ({ data, position }: TooltipProps) => {
  return (
    <div
      className="absolute bg-gray-900 text-white p-2 rounded shadow-lg text-sm pointer-events-none z-50"
      style={{ top: position.y + 10, left: position.x + 10 }}
    >
      <p className="font-bold">{data.name}</p>
      {/* Add more details here as needed */}
      {data.type === "repo" && data.nameWithOwner && (
        <p className="text-xs">Repo: {data.nameWithOwner}</p>
      )}
      {data.type === "contributor" && (
        <p className="text-xs">Contributor</p>
      )}
    </div>
  );
};

export default Tooltip;