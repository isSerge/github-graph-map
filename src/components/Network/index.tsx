import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import { NetworkDataProps, ComputedNode } from '@nivo/network'

import { NetworkLink, EitherNode } from '../../types/networkTypes'
import Network from "./Network";

const ZoomControls = () => {
    const { zoomIn, zoomOut } = useControls();

    return (
        <div className="absolute bottom-4 right-4 z-30 flex flex-col items-end gap-2">
            {/* You can include your settings button here as well */}
            <button
                onClick={() => zoomIn(0.1)}
                className="px-3 py-2 bg-blue-500 rounded text-white hover:bg-blue-400 transition"
            >
                +
            </button>
            <button
                onClick={() => zoomOut(0.1)}
                className="px-3 py-2 bg-blue-500 rounded text-white hover:bg-blue-400 transition"
            >
                -
            </button>
        </div>
    );
};

type NetworkProps = NetworkDataProps<EitherNode, NetworkLink> & {
    selectedNodeId: string;
    linkDistanceMultiplier?: number;
    repulsivity?: number;
    centeringStrength?: number;
    onNodeClick?: (node: ComputedNode<EitherNode>) => void;
};

const NetworkWithZoom = ({
    selectedNodeId,
    data,
    linkDistanceMultiplier,
    repulsivity,
    centeringStrength,
    onNodeClick,
}: NetworkProps) => {
    return (
        <div className="relative h-screen bg-gray-800">
            <TransformWrapper
                initialScale={1}
                minScale={0.5}
                maxScale={4}
                wheel={{ disabled: true }}
                doubleClick={{ disabled: true }}
            >
                <ZoomControls />
                <TransformComponent>
                    <div className="w-screen h-screen">
                        <Network
                            key={selectedNodeId}
                            selectedNodeId={selectedNodeId}
                            data={data}
                            linkDistanceMultiplier={linkDistanceMultiplier}
                            repulsivity={repulsivity}
                            centeringStrength={centeringStrength}
                            onNodeClick={onNodeClick}
                        />
                    </div>
                </TransformComponent>
            </TransformWrapper>
        </div>
    );
};

export default NetworkWithZoom;