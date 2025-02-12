import { useRef } from "react";
import { ComputedNode } from "@nivo/network";

import { ContributorNode, EitherNode, RepoNode } from "../types";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import RepoInfo from "./RepoInfo";
import ContributorInfo from "./ContributorInfo";

interface NodeModalProps {
    node: ComputedNode<EitherNode>;
    onClose: () => void;
}

const NodeModal = ({ node, onClose }: NodeModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(modalRef, onClose);

    const isRepoNode = (node: ComputedNode<EitherNode>): node is ComputedNode<RepoNode> => {
        return node.data.type === "repo";
    };

    return (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50">
            <div ref={modalRef} className="shadow-lg max-w-lg w-full relative">
                {isRepoNode(node) ? (
                    <RepoInfo repo={node.data} />
                ) : (
                    <ContributorInfo contributor={node.data as ContributorNode} />
                )}
            </div>
        </div>
    );
};

export default NodeModal;