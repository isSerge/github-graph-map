import { useRef } from "react";
import { ComputedNode } from "@nivo/network";

import { EitherNode } from "../types/networkTypes";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import RepoInfo from "./RepoInfo";
import ContributorInfo from "./ContributorInfo";
import { isRepoNode } from "../utils/graphUtils";

interface NodeModalProps {
  node: ComputedNode<EitherNode>;
  onClose: () => void;
  onExploreGraph: (nodeName: string) => void;
  timePeriod: number;
}

const NodeModal = ({ node, onClose, onExploreGraph, timePeriod }: NodeModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(modalRef, onClose);

  const handleExploreGraph = (name: string) => {
    onExploreGraph(name);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50">
      <div ref={modalRef} className="shadow-lg max-w-lg w-full relative">
        {isRepoNode(node.data) ? (
          <RepoInfo node={node.data} onExploreGraph={handleExploreGraph} timePeriod={timePeriod} />
        ) : (
          <ContributorInfo node={node.data} onExploreGraph={handleExploreGraph} timePeriod={timePeriod} />
        )}
      </div>
    </div>
  );
};

export default NodeModal;