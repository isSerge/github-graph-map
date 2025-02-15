import { useRef } from "react";
import { ComputedNode } from "@nivo/network";

import { ContributorNode, EitherNode, RepoNode } from "../types";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import RepoInfo from "./RepoInfo";
import ContributorInfo from "./ContributorInfo";

interface NodeModalProps {
    node: ComputedNode<EitherNode>;
    onClose: () => void;
    onExploreGraph: (nodeName: string) => void;
}

const NodeModal = ({ node, onClose, onExploreGraph }: NodeModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(modalRef, onClose);

    const isRepoNode = (node: ComputedNode<EitherNode>): node is ComputedNode<RepoNode> => {
        return node.data.type === "repo";
    };

    const handleExploreGraph = (name: string) => {
        onExploreGraph(name);
        onClose();
    }

    return (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50">
            <div ref={modalRef} className="shadow-lg max-w-lg w-full relative">
                {isRepoNode(node) ? (
                    <RepoInfo repo={node.data} onExploreGraph={handleExploreGraph} />
                ) : (
                    <ContributorInfo contributor={node.data as ContributorNode} onExploreGraph={handleExploreGraph} />
                )}
            </div>
        </div>
    );
};

export default NodeModal;